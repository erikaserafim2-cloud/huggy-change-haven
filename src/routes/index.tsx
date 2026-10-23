import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { AdSlot, BlogCard } from "@/components/SiteChrome";
import {
  Sparkles,
  Heart,
  Baby,
  Users,
  Trophy,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Info,
  Calendar,
  Ticket,
  ShieldCheck,
  Smile,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: App,
});

// -----------------------------
// Types & data
// -----------------------------
type Participant = {
  id: string;
  role: string;
  name: string;
  active: boolean;
  emoji: string;
};

const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: "mae", role: "Mãe", name: "Mamãe", active: true, emoji: "🤱" },
  { id: "pai", role: "Pai", name: "Papai", active: true, emoji: "👨" },
  { id: "vovo_f", role: "Vovó", name: "Vovó", active: false, emoji: "👵" },
  { id: "vovo_m", role: "Vovô", name: "Vovô", active: false, emoji: "👴" },
  { id: "tia", role: "Tia", name: "Titia", active: false, emoji: "👩" },
  { id: "tio", role: "Tio", name: "Tio", active: false, emoji: "🧔" },
  { id: "irma", role: "Irmã", name: "Irmã", active: false, emoji: "👧" },
  { id: "irmao", role: "Irmão", name: "Irmão", active: false, emoji: "👦" },
];

const BABY_TIPS = [
  "Prepare a fralda limpa por baixo da suja antes de abri-la — evita surpresas e jatos inesperados!",
  "Meninos: aponte o pipizinho para baixo antes de fechar a fralda para evitar vazamentos na barriga.",
  "Meninas: limpe sempre de frente para trás para proteger e evitar infecções urinárias.",
  "Nos primeiros meses, prefira algodão e água morninha — a pele do recém-nascido é super delicada.",
  "Dobre a borda traseira da fralda para dentro na fase dos escapes e explosões de cocô.",
  "Deixe um brinquedinho musical ou mordedor por perto para entreter as mãozinhas na hora da troca.",
  "Nunca deixe o bebê sozinho no trocador, nem por uma fração de segundo. Segurança sempre!",
  "Se a fralda está vazando de madrugada, experimente um tamanho acima apenas para a hora do sono.",
  "Uma camada fina e homogênea de pomada já cria uma barreira eficaz contra a umidade.",
  "Passe o dedo nas perninhas para garantir que as abas e barreirinhas fiquem voltadas para fora.",
];

const EMOJI_OPTIONS = ["🤱", "👨", "👵", "👴", "👩", "🧔", "👧", "👦", "👼", "🧸", "🦄", "🐣", "🦸", "🧚"];

// -----------------------------
// Sound synth (Web Audio)
// -----------------------------
class Synth {
  ctx: AudioContext | null = null;
  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }
  tick() {
    this.init();
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(620, this.ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.06, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + 0.09);
  }
  celebrate() {
    this.init();
    if (!this.ctx) return;
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5];
    const now = this.ctx.currentTime;
    notes.forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f, now + i * 0.08);
      g.gain.setValueAtTime(0, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.35);
      o.connect(g);
      g.connect(this.ctx!.destination);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.4);
    });
  }
}

// -----------------------------
// localStorage helpers (SSR-safe)
// -----------------------------
function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveLS(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

// -----------------------------
// Main Component
// -----------------------------
type Step = "setup" | "participants" | "game";
type Gender = "" | "menino" | "menina" | "neutro";

function App() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("setup");
  const [babyName, setBabyName] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [participants, setParticipants] = useState<Participant[]>(DEFAULT_PARTICIPANTS);
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  const [tipIndex, setTipIndex] = useState(0);
  const synth = useRef(new Synth());

  useEffect(() => {
    setBabyName(loadLS("babyName", ""));
    setGender(loadLS<Gender>("babyGender", "neutro"));
    setParticipants(loadLS("participants_v3", DEFAULT_PARTICIPANTS));
    setScoreboard(loadLS("scoreboard_v2", {}));
    setTipIndex(Math.floor(Math.random() * BABY_TIPS.length));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLS("babyName", babyName);
  }, [babyName, hydrated]);

  useEffect(() => {
    if (hydrated) saveLS("babyGender", gender);
  }, [gender, hydrated]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.babyTheme = gender || "neutro";
    }
  }, [gender]);

  useEffect(() => {
    if (hydrated) saveLS("participants_v3", participants);
  }, [participants, hydrated]);

  useEffect(() => {
    if (hydrated) saveLS("scoreboard_v2", scoreboard);
  }, [scoreboard, hydrated]);

  const activeParticipants = useMemo(() => participants.filter((p) => p.active), [participants]);

  return (
    <div className={`relative min-h-screen overflow-x-clip baby-theme-${gender || "neutro"}`}>
      {/* Elementos decorativos acolhedores de fundo */}
      <FloatingDecorations />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:py-10">
        {/* Barra de Acesso Rápido às Ferramentas Maternas */}
        <MaternalToolsHub
          tip={BABY_TIPS[tipIndex]}
          onNextTip={() => setTipIndex((i) => (i + 1) % BABY_TIPS.length)}
        />

        {/* Card Principal da Roleta com Stepper Harmônico */}
        <main id="roleta" className="card-soft mt-8 p-6 sm:p-10 scroll-mt-24 transition-all">
          <StepperBar step={step} onStepClick={(s) => setStep(s)} />

          {step === "setup" && (
            <SetupStep
              babyName={babyName}
              setBabyName={setBabyName}
              gender={gender}
              setGender={setGender}
              onContinue={() => setStep("participants")}
            />
          )}

          {step === "participants" && (
            <ParticipantsStep
              babyName={babyName}
              participants={participants}
              setParticipants={setParticipants}
              onBack={() => setStep("setup")}
              onContinue={() => {
                if (activeParticipants.length < 2) return;
                synth.current.init();
                setStep("game");
              }}
            />
          )}

          {step === "game" && (
            <GameStep
              babyName={babyName}
              gender={gender}
              participants={activeParticipants}
              scoreboard={scoreboard}
              setScoreboard={setScoreboard}
              onBack={() => setStep("participants")}
              synth={synth.current}
              allParticipants={participants}
            />
          )}
        </main>

        {/* Badge de segurança e privacidade amorosa */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground font-medium">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Feito com carinho para famílias reais · Seus dados ficam salvos apenas no seu celular</span>
        </div>

        {/* Navegador das 24 fases do bebê */}
        <BabyMonthsNavigator />

        {/* Frase inspiradora de maternidade */}
        <MotherhoodInspiration />

        {/* Seção Editorial do Blog */}
        <section className="home-editorial">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
                <span>Conteúdo feito com amor</span>
              </span>
              <h2>Dicas para cuidar com mais leveza</h2>
            </div>
            <Link to="/blog" className="text-link">
              <span>Ver todos os artigos</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <AdSlot />

          <div className="blog-grid">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Card Teaser "Sobre o projeto" */}
          <div className="about-teaser mt-4">
            <div>
              <span className="eyebrow">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Nossa Missão</span>
              </span>
              <h2>Mais parceria e acolhimento na sua rotina</h2>
              <p>
                A roleta foi criada para transformar um momento cansativo do dia a dia em uma brincadeira
                gentil e compartilhada. No nosso portal, você também encontra guias detalhados mês a mês,
                dicas de cuidados com a pele do bebê e ideias para celebrar a chegada do seu tesouro.
              </p>
            </div>
            <Link to="/sobre" className="btn-primary shrink-0">
              <span>Conhecer a história</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// -----------------------------
// Decorações flutuantes
// -----------------------------
function FloatingDecorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="animate-float absolute left-[4%] top-[8%] text-4xl opacity-25">☁️</div>
      <div className="animate-float absolute right-[6%] top-[24%] text-3xl opacity-30" style={{ animationDelay: "1.5s" }}>
        ✨
      </div>
      <div className="animate-float absolute left-[8%] top-[55%] text-4xl opacity-20" style={{ animationDelay: "2.8s" }}>
        🌸
      </div>
      <div className="animate-float absolute right-[5%] top-[68%] text-5xl opacity-20" style={{ animationDelay: "2.2s" }}>
        ☁️
      </div>
      <div className="animate-float absolute right-[15%] bottom-[12%] text-2xl opacity-35" style={{ animationDelay: "3.5s" }}>
        ⭐
      </div>
    </div>
  );
}

// -----------------------------
// Maternal Tools Hub (Cards rápidos)
// -----------------------------
function MaternalToolsHub({ tip, onNextTip }: { tip: string; onNextTip: () => void }) {
  return (
    <section aria-label="Ferramentas do portal" className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Card 1: Chá-Rifa */}
      <Link
        to="/cha-rifa"
        className="group flex items-start gap-3 rounded-2xl border border-primary/15 bg-card/85 p-4 backdrop-blur-md shadow-xs transition hover:border-primary/40 hover:bg-card hover:shadow-md"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-xl group-hover:scale-105 transition">
          🎟️
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Chá-Rifa</span>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[9px] font-bold text-primary">Novo</span>
          </div>
          <h3 className="font-display font-semibold text-foreground text-sm mt-0.5 group-hover:text-primary transition">
            Criador de Chá-Rifa
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            Monte a arte em aquarela com números e baixe em PNG para o WhatsApp.
          </p>
        </div>
      </Link>

      {/* Card 2: Universo da Maternidade */}
      <Link
        to="/maternidade"
        className="group flex items-start gap-3 rounded-2xl border border-primary/15 bg-card/85 p-4 backdrop-blur-md shadow-xs transition hover:border-primary/40 hover:bg-card hover:shadow-md"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--sage)_35%,transparent)] text-xl group-hover:scale-105 transition">
          🌷
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Desenvolvimento</span>
          <h3 className="font-display font-semibold text-foreground text-sm mt-0.5 group-hover:text-primary transition">
            Universo da Maternidade
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            Guia personalizado por idade do bebê com sono, saltos e rotina.
          </p>
        </div>
      </Link>

      {/* Card 3: Dica do Dia */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-card/85 p-4 backdrop-blur-md shadow-xs">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklab,var(--butter)_65%,transparent)] text-xl">
          💡
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Diquinha de Mãe</span>
            <button
              onClick={onNextTip}
              title="Ver outra dica"
              aria-label="Ver outra dica carinhosa"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/80 text-xs text-muted-foreground hover:bg-primary/20 hover:text-primary transition"
            >
              <RotateCw className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-1 text-xs text-foreground/80 leading-relaxed line-clamp-3">
            "{tip}"
          </p>
        </div>
      </div>
    </section>
  );
}

// -----------------------------
// Stepper Bar
// -----------------------------
function StepperBar({ step, onStepClick }: { step: Step; onStepClick: (s: Step) => void }) {
  const steps: { key: Step; label: string; icon: string }[] = [
    { key: "setup", label: "1. O Bebê", icon: "👶" },
    { key: "participants", label: "2. Família", icon: "👨‍👩‍👧" },
    { key: "game", label: "3. A Roleta", icon: "🎡" },
  ];

  return (
    <div className="mb-6 sm:mb-8 border-b border-primary/12 pb-4">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((s, idx) => {
          const isActive = step === s.key;
          const isDone =
            (step === "participants" && s.key === "setup") ||
            (step === "game" && (s.key === "setup" || s.key === "participants"));

          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onStepClick(s.key)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl py-2 px-1 text-xs sm:text-sm font-bold transition ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : isDone
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="text-sm sm:text-base">{s.icon}</span>
              <span className="truncate">{s.label}</span>
              {isDone && <Check className="h-3.5 w-3.5 text-primary hidden sm:inline" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -----------------------------
// Step 1: Setup
// -----------------------------
function SetupStep({
  babyName,
  setBabyName,
  gender,
  setGender,
  onContinue,
}: {
  babyName: string;
  setBabyName: (s: string) => void;
  gender: Gender;
  setGender: (g: Gender) => void;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pop">
      <div className="text-center max-w-md mx-auto">
        <span className="badge-maternal mb-2">Passo 1 de 3</span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Vamos deixar tudo com a cara da sua família
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Se quiser, conte como vocês chamam o bebê e escolha uma paleta para personalizar a experiência. Você pode mudar isso quando quiser.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-5">
        <div>
          <label htmlFor="baby-name" className="mb-2 block text-sm font-bold text-foreground">
            Nome ou apelido do bebê <span className="font-normal text-muted-foreground">(opcional)</span>
          </label>
          <input
            id="baby-name"
            type="text"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            maxLength={22}
            placeholder="Ex: Maya, Theo, Liz, Arthur…"
            className="input-soft text-base"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-foreground">
            Como você prefere as cores?
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setGender("menina")}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition ${
                gender === "menina"
                  ? "border-primary bg-primary/10 shadow-sm font-bold text-primary"
                  : "border-border bg-card hover:border-primary/30 text-foreground"
              }`}
            >
              <span className="text-2xl">👧</span>
              <span className="text-xs font-bold">Rosa suave</span>
            </button>

            <button
              type="button"
              onClick={() => setGender("menino")}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition ${
                gender === "menino"
                  ? "border-primary bg-primary/10 shadow-sm font-bold text-primary"
                  : "border-border bg-card hover:border-primary/30 text-foreground"
              }`}
            >
              <span className="text-2xl">👦</span>
              <span className="text-xs font-bold">Azul sereno</span>
            </button>

            <button
              type="button"
              onClick={() => setGender("neutro")}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-3 text-center transition ${
                gender === "neutro" || gender === ""
                  ? "border-primary bg-primary/10 shadow-sm font-bold text-primary"
                  : "border-border bg-card hover:border-primary/30 text-foreground"
              }`}
            >
              <span className="text-2xl">🧸</span>
              <span className="text-xs font-bold">Neutro natural</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/60 p-4 text-xs text-muted-foreground flex items-center gap-2.5 border border-primary/10">
          <Info className="h-4 w-4 shrink-0 text-primary" />
          <span>Seu nome, suas escolhas e a pontuação ficam salvos neste aparelho. Nada disso é enviado para nossos servidores.</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="button" onClick={onContinue} className="btn-primary w-full sm:w-auto">
            <span>Avançar para quem participa</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Step 2: Participants
// -----------------------------
function ParticipantsStep({
  babyName,
  participants,
  setParticipants,
  onBack,
  onContinue,
}: {
  babyName: string;
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [customName, setCustomName] = useState("");
  const [customEmoji, setCustomEmoji] = useState(EMOJI_OPTIONS[0]);

  const active = participants.filter((p) => p.active);
  const canContinue = active.length >= 2;

  const toggle = (id: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;
    setParticipants((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        role: "Família",
        name,
        active: true,
        emoji: customEmoji,
      },
    ]);
    setCustomName("");
  };

  const remove = (id: string) => {
    if (id.startsWith("custom_")) {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    } else {
      setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, active: false } : p)));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-pop">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="badge-maternal mb-1">Passo 2 de 3</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Quem faz parte dessa equipe de cuidado?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha as pessoas que entram na brincadeira. Para a roleta funcionar, precisamos de pelo menos duas.
          </p>
        </div>
        <button
          onClick={onBack}
          type="button"
          className="btn-ghost py-2 px-3 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar</span>
        </button>
      </div>

      {/* Grid de membros da família */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {participants.map((p) => (
          <div
            key={p.id}
            onClick={() => toggle(p.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(p.id)}
            className={`group flex items-center gap-3 rounded-2xl border-2 p-3 transition cursor-pointer select-none ${
              p.active
                ? "border-primary/50 bg-primary/8 shadow-xs"
                : "border-border bg-card/60 opacity-60 hover:opacity-100 hover:border-primary/25"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl transition ${
                p.active ? "bg-primary text-white shadow-xs" : "bg-muted text-muted-foreground"
              }`}
            >
              {p.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {p.role}
              </span>
              <div className="font-bold text-foreground text-base truncate">{p.name}</div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
                  p.active ? "bg-primary text-white" : "border border-border text-transparent"
                }`}
              >
                ✓
              </div>

              {p.id.startsWith("custom_") && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(p.id);
                  }}
                  className="p-1 text-muted-foreground hover:text-red-500 transition"
                  aria-label={`Excluir ${p.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Adicionar participante extra */}
      <div className="rounded-2xl border border-dashed border-primary/30 bg-card/70 p-4 sm:p-5">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-primary">
          + Incluir outra pessoa (madrinha, dindo, cuidador...)
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={customEmoji}
            onChange={(e) => setCustomEmoji(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-lg outline-none focus:border-primary"
            aria-label="Escolher emoji do participante"
          >
            {EMOJI_OPTIONS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            maxLength={20}
            placeholder="Nome (ex: Madrinha Carol, Primo Leo)"
            className="input-soft flex-1 text-sm"
          />

          <button type="button" onClick={addCustom} className="btn-ghost shrink-0 py-2.5 px-4 text-xs">
            <Plus className="h-4 w-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Resumo de participantes ativos */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-muted-foreground">
          {active.length < 2 ? (
            <span className="font-bold text-amber-700">
              ⚠️ Escolha pelo menos 2 participantes para girar a roleta.
            </span>
          ) : (
            <span>
              ✅ <strong>{active.length}</strong> pessoas participando do sorteio.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className="btn-primary w-full sm:w-auto"
        >
          <span>Ir para a Roleta</span>
          <span>🎡</span>
        </button>
      </div>
    </div>
  );
}

// -----------------------------
// Step 3: Game (Wheel)
// -----------------------------
function GameStep({
  babyName,
  gender,
  participants,
  scoreboard,
  setScoreboard,
  onBack,
  synth,
  allParticipants,
}: {
  babyName: string;
  gender: Gender;
  participants: Participant[];
  scoreboard: Record<string, number>;
  setScoreboard: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onBack: () => void;
  synth: Synth;
  allParticipants: Participant[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const startAngleRef = useRef(0);
  const arc = useMemo(() => (participants.length ? (Math.PI * 2) / participants.length : 0), [participants.length]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [winnerMsg, setWinnerMsg] = useState("");

  const sliceColors =
    gender === "menino"
      ? ["#D6E8FA", "#BCD9F5", "#9FC6EE", "#83B2E6", "#B6D5F2", "#CCE3F8", "#97BFEA", "#A9CDEF"]
      : gender === "menina"
      ? ["#FDE2EB", "#F9C7D7", "#F3ADC1", "#ED95AD", "#F7BFD2", "#FDE4EC", "#F4B3C5", "#F8CCD9"]
      : ["#F9DEC9", "#F4C7A9", "#EBD5B3", "#DFE9D3", "#D2E5EE", "#E5D9EE", "#F6CFCF", "#F2DFC2"];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || participants.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
    }
    const cx = size / 2;
    const cy = size / 2;
    const r = cx - 6;
    ctx.clearRect(0, 0, size, size);

    participants.forEach((p, i) => {
      const a = startAngleRef.current + i * arc;
      ctx.fillStyle = sliceColors[i % sliceColors.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a, a + arc);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx + Math.cos(a + arc / 2) * r * 0.62, cy + Math.sin(a + arc / 2) * r * 0.62);
      ctx.rotate(a + arc / 2 + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#332219";
      ctx.font = "bold 15px Nunito, system-ui, sans-serif";
      const label = p.name.length > 12 ? p.name.slice(0, 11) + "…" : p.name;
      ctx.fillText(`${p.emoji} ${label}`, 0, 0);
      ctx.restore();
    });

    // Outer gentle border
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(180, 110, 90, 0.15)";
    ctx.lineWidth = 5;
    ctx.stroke();
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participants, arc]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  const spin = () => {
    if (spinning || participants.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const spinAngleStart = Math.random() * 10 + 12;
    const spinTimeTotal = Math.random() * 2500 + 4500;
    const t0 = performance.now();
    let currentSector = -1;

    const tick = (now: number) => {
      const t = now - t0;
      if (t >= spinTimeTotal) {
        const deg = (startAngleRef.current * 180) / Math.PI;
        const arcd = (arc * 180) / Math.PI;
        let idx = Math.floor(((360 - ((deg % 360) + 360) % 360 - 90 + 360) % 360) / arcd);
        idx = ((idx % participants.length) + participants.length) % participants.length;
        const w = participants[idx];
        setSpinning(false);
        setWinner(w);
        setWinnerMsg(pickMessage(w.name, babyName));
        synth.celebrate();
        return;
      }

      const progress = t / spinTimeTotal;
      const eased = 1 - Math.pow(1 - progress, 3);
      const speed = spinAngleStart * (1 - eased);
      startAngleRef.current += (speed * Math.PI) / 180;
      draw();

      const deg = (startAngleRef.current * 180) / Math.PI;
      const arcd = (arc * 180) / Math.PI;
      let idx = Math.floor(((360 - ((deg % 360) + 360) % 360 - 90 + 360) % 360) / arcd);
      idx = ((idx % participants.length) + participants.length) % participants.length;
      if (idx !== currentSector) {
        currentSector = idx;
        synth.tick();
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const confirmChange = () => {
    if (!winner) return;
    setScoreboard((prev) => ({ ...prev, [winner.id]: (prev[winner.id] || 0) + 1 }));
    setWinner(null);
  };

  const respin = () => {
    setWinner(null);
    setTimeout(spin, 200);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-pop">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="badge-maternal mb-1">Passo 3 de 3</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            A hora da verdade para {babyName ? babyName : "o bebê"}! 🍼
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque no botão e deixe a roleta decidir quem assume com carinho a próxima troca.
          </p>
        </div>
        <button
          onClick={onBack}
          type="button"
          className="btn-ghost py-2 px-3 text-xs shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ajustar participantes</span>
        </button>
      </div>

      {/* Roleta Central */}
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-square">
          {/* Indicador / Seta apontando para baixo */}
          <div className="absolute left-1/2 -top-4 z-20 -translate-x-1/2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg animate-bounce-soft border-2 border-white">
              👇
            </div>
          </div>

          {/* Prato da roleta */}
          <div className="relative h-full w-full rounded-full bg-white p-2.5 shadow-[var(--shadow-lift)] ring-4 ring-primary/20">
            <canvas ref={canvasRef} className="h-full w-full rounded-full" />

            {/* Centro fofo */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-primary text-2xl text-white shadow-md">
              👶
            </div>
          </div>
        </div>

        {/* Botão de girar com micro-interação */}
        <button
          type="button"
          onClick={spin}
          disabled={spinning || participants.length < 2}
          className="btn-primary mt-8 py-3.5 px-8 text-base sm:text-lg font-bold shadow-lg"
        >
          {spinning ? (
            <>
              <RotateCw className="h-5 w-5 animate-spin" />
              <span>Sorteando com emoção…</span>
            </>
          ) : (
            <>
              <span>Girar a roleta agora</span>
              <span>🎡</span>
            </>
          )}
        </button>

        <p className="mt-2 text-xs text-muted-foreground text-center">
          Dica: respire fundo, pegue o lencinho umedecido e a fraldinha limpa! ✨
        </p>
      </div>

      {/* Placar de Trocas da Família */}
      <div className="pt-4">
        <Scoreboard
          participants={allParticipants}
          scoreboard={scoreboard}
          onReset={() => setScoreboard({})}
        />
      </div>

      {/* Modal comemorativo do escolhido */}
      {winner && (
        <WinnerModal
          winner={winner}
          message={winnerMsg}
          onConfirm={confirmChange}
          onRespin={respin}
        />
      )}
    </div>
  );
}

function pickMessage(name: string, babyName: string) {
  const who = babyName ? `de ${babyName}` : "do bebê";
  const msgs = [
    `Parabéns, ${name}! Separe o lencinho e a pomadinha, a fralda ${who} chama por você! 🍼`,
    `A sorte sorriu (e o bebê também)! É sua vez de brilhar na troca ${who}. 🚼`,
    `Missão especial para ${name}! Trocar fralda é um ato de amor e cumplicidade. 🌸`,
    `Chegou a sua vez, ${name}! Respire fundo e faça aquela troca com muito carinho e dancinha. ✨`,
    `O trono do trocador é seu, ${name}! Vamos deixar o bumbum ${who} sequinho e cheiroso. 🧻`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// -----------------------------
// Scoreboard Component
// -----------------------------
function Scoreboard({
  participants,
  scoreboard,
  onReset,
}: {
  participants: Participant[];
  scoreboard: Record<string, number>;
  onReset: () => void;
}) {
  const list = participants
    .filter((p) => p.active)
    .map((p) => ({ ...p, score: scoreboard[p.id] || 0 }))
    .sort((a, b) => b.score - a.score);

  const total = list.reduce((s, x) => s + x.score, 0);

  return (
    <section className="rounded-3xl border border-primary/15 bg-card/90 p-5 sm:p-6 backdrop-blur-md shadow-xs">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold text-foreground">Placar da Parceria</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {total === 0
              ? "Nenhuma troca confirmada ainda hoje. Gire para começar!"
              : `${total} troca${total === 1 ? "" : "s"} registrada${total === 1 ? "" : "s"} com amor.`}
          </p>
        </div>

        {total > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition underline"
          >
            Zerar placar
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {list.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-2xl bg-muted/40 border border-primary/10 px-3.5 py-2.5"
          >
            <span className="text-2xl">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm truncate">{p.name}</span>
                {i === 0 && p.score > 0 && (
                  <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.2">
                    👑 Campeão(ã)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground">{p.role}</span>
            </div>

            <div className="flex items-center gap-1 font-bold text-primary text-base">
              <span>{p.score}</span>
              <span className="text-xs font-normal text-muted-foreground">trocas</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// -----------------------------
// Winner Modal
// -----------------------------
function WinnerModal({
  winner,
  message,
  onConfirm,
  onRespin,
}: {
  winner: Participant;
  message: string;
  onConfirm: () => void;
  onRespin: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm animate-pop">
      <div className="card-soft w-full max-w-md p-6 sm:p-8 text-center bg-card shadow-2xl border-2 border-primary/30">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 text-5xl animate-bounce-soft border-2 border-primary/30">
          {winner.emoji}
        </div>

        <span className="badge-maternal mt-5 inline-flex">
          🎉 Temos um(a) sorteado(a)!
        </span>

        <h3 className="font-display text-3xl font-bold text-primary mt-2">{winner.name}</h3>

        <p className="mt-3 text-foreground/85 text-sm sm:text-base leading-relaxed">{message}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button type="button" className="btn-primary" onClick={onConfirm}>
            <CheckCircle2 className="h-4 w-4" />
            <span>Missão aceita! Já troquei</span>
          </button>
          <button type="button" className="btn-ghost" onClick={onRespin}>
            <RotateCw className="h-4 w-4" />
            <span>Girar de novo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Baby Months Navigator
// -----------------------------
function BabyMonthsNavigator() {
  const months = Array.from({ length: 24 }, (_, i) => i + 1);

  return (
    <section aria-label="Fases do bebê mês a mês" className="mt-12 card-warm p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <span className="eyebrow">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Guia de Fases</span>
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">
            O que esperar do bebê mês a mês (1 aos 24 meses)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Clique na idade do seu bebê para ver saltos de desenvolvimento, sono e rotina.
          </p>
        </div>
        <Link to="/maternidade" className="btn-ghost shrink-0 py-2 px-3.5 text-xs font-bold">
          <span>Abrir Universo Materno</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {months.map((m) => (
          <Link
            key={m}
            to={`/bebe-${m}-${m === 1 ? "mes" : "meses"}`}
            className="rounded-full border border-primary/20 bg-card px-3 py-1.5 text-xs font-bold text-foreground/85 transition hover:bg-primary hover:text-white hover:border-primary shadow-xs"
          >
            {m} {m === 1 ? "mês" : "meses"}
          </Link>
        ))}
      </div>
    </section>
  );
}

// -----------------------------
// Motherhood Inspiration Banner
// -----------------------------
function MotherhoodInspiration() {
  return (
    <section className="mt-10 rounded-3xl bg-gradient-to-r from-primary/10 via-[color-mix(in_oklab,var(--sage)_25%,transparent)] to-primary/10 p-6 sm:p-8 border border-primary/15 text-center">
      <span className="text-3xl">🌸</span>
      <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-2">
        "Cuidar de um bebê é um caminho feito de amor, paciência e rede de apoio."
      </h3>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
        Dividir as trocas, o banho e o ninar não é favor — é parceria diária. Respire fundo: você está fazendo
        um trabalho incrível!
      </p>
    </section>
  );
}
