import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

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
  { id: "tia", role: "Tia", name: "Tia", active: false, emoji: "👩" },
  { id: "tio", role: "Tio", name: "Tio", active: false, emoji: "🧔" },
  { id: "irma", role: "Irmã", name: "Irmã", active: false, emoji: "👧" },
  { id: "irmao", role: "Irmão", name: "Irmão", active: false, emoji: "👦" },
];

const BABY_TIPS = [
  "Prepare a fralda limpa por baixo da suja antes de abri-la — evita surpresas.",
  "Meninos: aponte o pipizinho para baixo antes de fechar a fralda.",
  "Meninas: limpe sempre de frente para trás para evitar infecções.",
  "Nos primeiros meses, prefira água morna e algodão — a pele é sensível.",
  "Dobre a borda traseira para dentro na fase dos escapes de cocô.",
  "Deixe um brinquedinho por perto para distrair na hora da troca.",
  "Nunca deixe o bebê sozinho no trocador — nem por um segundo.",
  "Se vaza à noite, tente um tamanho maior só para dormir.",
  "Uma camada fina de pomada preventiva cria barreira contra assaduras.",
  "Cheque se as barreirinhas das perninhas estão viradas para fora.",
];

const EMOJI_OPTIONS = ["🤰", "🦖", "🦄", "🐶", "🥷", "🦸", "🧚", "🧸", "👼", "🐣"];

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
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + 0.09);
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
      g.gain.linearRampToValueAtTime(0.11, now + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.35);
      o.connect(g); g.connect(this.ctx!.destination);
      o.start(now + i * 0.08); o.stop(now + i * 0.08 + 0.4);
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
  } catch { return fallback; }
}
function saveLS(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// -----------------------------
// App
// -----------------------------
type Step = "setup" | "participants" | "game";
type Gender = "" | "menino" | "menina";

function App() {
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<Step>("setup");
  const [babyName, setBabyName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [participants, setParticipants] = useState<Participant[]>(DEFAULT_PARTICIPANTS);
  const [scoreboard, setScoreboard] = useState<Record<string, number>>({});
  const [tipIndex, setTipIndex] = useState(0);
  const synth = useRef(new Synth());

  useEffect(() => {
    setBabyName(loadLS("babyName", ""));
    setBirthDate(loadLS("babyBirthDate", ""));
    setGender(loadLS<Gender>("babyGender", ""));
    setParticipants(loadLS("participants_v2", DEFAULT_PARTICIPANTS));
    setScoreboard(loadLS("scoreboard_v2", {}));
    setTipIndex(Math.floor(Math.random() * BABY_TIPS.length));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) saveLS("babyName", babyName); }, [babyName, hydrated]);
  useEffect(() => { if (hydrated) saveLS("babyBirthDate", birthDate); }, [birthDate, hydrated]);
  useEffect(() => { if (hydrated) saveLS("babyGender", gender); }, [gender, hydrated]);
  useEffect(() => { if (hydrated) saveLS("participants_v2", participants); }, [participants, hydrated]);
  useEffect(() => { if (hydrated) saveLS("scoreboard_v2", scoreboard); }, [scoreboard, hydrated]);

  const activeParticipants = useMemo(() => participants.filter(p => p.active), [participants]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Ambient decorations */}
      <Decorations />




      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:py-12">
        <Header babyName={babyName} />

        <main className="card-soft mt-8 flex-1 p-6 sm:p-10 animate-pop">
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

        <Link
          to="/maternidade"
          className="mt-8 flex items-center gap-3 rounded-2xl bg-[var(--gradient-primary)] p-4 text-primary-foreground shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-lift)] sm:p-5"
        >
          <span className="text-2xl">🌷</span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">Universo da Maternidade</p>
            <p className="mt-0.5 text-sm font-semibold sm:text-base">Acompanhe o desenvolvimento dessa idade</p>
          </div>
          <span aria-hidden className="text-xl">→</span>
        </Link>

        <TipFooter
          tip={BABY_TIPS[tipIndex]}
          onNext={() => setTipIndex(i => (i + 1) % BABY_TIPS.length)}
        />

      </div>
    </div>
  );
}


// -----------------------------
// Decorations
// -----------------------------
function Decorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="animate-float absolute left-[6%] top-[10%] text-4xl opacity-30">☁️</div>
      <div className="animate-float absolute right-[8%] top-[70%] text-5xl opacity-25" style={{ animationDelay: "2s" }}>☁️</div>
      <div className="animate-float absolute right-[12%] top-[22%] text-2xl opacity-40" style={{ animationDelay: "1s" }}>✨</div>
      <div className="animate-float absolute left-[8%] top-[60%] text-3xl opacity-30" style={{ animationDelay: "3s" }}>🫧</div>
      <div className="animate-float absolute right-[18%] bottom-[8%] text-2xl opacity-40" style={{ animationDelay: "1.5s" }}>⭐</div>
    </div>
  );
}

// -----------------------------
// Header
// -----------------------------
function Header({ babyName }: { babyName: string }) {
  return (
    <header className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-3xl animate-bounce-soft">
        👶
      </div>
      <h1 className="mt-4 font-display text-4xl font-semibold text-foreground sm:text-5xl">
        Quem vai trocar {babyName ? <span className="text-primary">{babyName}</span> : "a fralda"}?
      </h1>
      <p className="mt-2 text-muted-foreground">Uma roleta gentil para dividir as trocas em família.</p>
    </header>
  );
}

// -----------------------------
// Step: Setup
// -----------------------------
function SetupStep({
  babyName, setBabyName, birthDate, setBirthDate, gender, setGender, onContinue,
}: {
  babyName: string;
  setBabyName: (s: string) => void;
  birthDate: string;
  setBirthDate: (s: string) => void;
  gender: Gender;
  setGender: (g: Gender) => void;
  onContinue: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const canContinue = gender !== "";
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Boas-vindas 👋</h2>
        <p className="mt-2 text-muted-foreground">
          Vamos personalizar a experiência para o seu bebê.
        </p>
      </div>

      <div>
        <label htmlFor="baby-name" className="mb-2 block text-sm font-semibold">
          Nome do bebê <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="baby-name"
          type="text"
          value={babyName}
          onChange={(e) => setBabyName(e.target.value)}
          maxLength={20}
          placeholder="Ex: Lucas, Sofia, Bento…"
          className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-lg outline-none transition focus:border-primary focus:ring-4 focus:ring-ring"
        />
      </div>

      <div>
        <label htmlFor="baby-birth" className="mb-2 block text-sm font-semibold">
          Data de nascimento <span className="font-normal text-muted-foreground">(para o guia da fase)</span>
        </label>
        <input
          id="baby-birth"
          type="date"
          value={birthDate}
          max={today}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-lg outline-none transition focus:border-primary focus:ring-4 focus:ring-ring"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Usamos essa data para gerar tópicos do <strong>Universo da Maternidade</strong> conforme a idade do bebê.
        </p>
      </div>

      <div>
        <p className="mb-2 block text-sm font-semibold">É menino ou menina?</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setGender("menino")}
            aria-pressed={gender === "menino"}
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-4 text-lg font-semibold transition ${
              gender === "menino"
                ? "border-transparent text-white shadow-[var(--shadow-soft)]"
                : "border-border bg-card text-foreground hover:border-[#9ecbe8]"
            }`}
            style={gender === "menino" ? { background: "linear-gradient(135deg,#B7DCF2,#7FB8DF)" } : undefined}
          >
            <span className="text-2xl">👦</span> Menino
          </button>
          <button
            type="button"
            onClick={() => setGender("menina")}
            aria-pressed={gender === "menina"}
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-4 text-lg font-semibold transition ${
              gender === "menina"
                ? "border-transparent text-white shadow-[var(--shadow-soft)]"
                : "border-border bg-card text-foreground hover:border-[#f3b8c8]"
            }`}
            style={gender === "menina" ? { background: "linear-gradient(135deg,#F8CFDD,#EE9FB8)" } : undefined}
          >
            <span className="text-2xl">👧</span> Menina
          </button>
        </div>
        {!canContinue && (
          <p className="mt-2 text-xs text-muted-foreground">Escolha uma opção para colorir a roleta.</p>
        )}
      </div>

      <div className="rounded-2xl bg-muted/60 p-5 text-sm text-muted-foreground">
        <p>
          <span className="mr-1">💡</span>
          Seus dados ficam somente no seu dispositivo. Nada é enviado para servidores.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continuar
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}


// -----------------------------
// Step: Participants
// -----------------------------
function ParticipantsStep({
  participants, setParticipants, onBack, onContinue,
}: {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [customName, setCustomName] = useState("");
  const [customEmoji, setCustomEmoji] = useState(EMOJI_OPTIONS[0]);

  const active = participants.filter(p => p.active);
  const canContinue = active.length >= 2;

  const toggle = (id: string) =>
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

  const rename = (id: string, name: string) =>
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, name } : p));

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    if (participants.some(p => p.name.toLowerCase() === name.toLowerCase())) return;
    setParticipants(prev => [...prev, {
      id: `custom_${Date.now()}`,
      role: "Convidado",
      name,
      active: true,
      emoji: customEmoji,
    }]);
    setCustomName("");
  };

  const remove = (id: string) => {
    if (id.startsWith("custom_")) {
      setParticipants(prev => prev.filter(p => p.id !== id));
    } else {
      setParticipants(prev => prev.map(p => p.id === id ? { ...p, active: false } : p));
    }
  };

  return (
    <div className="space-y-8">
      <StepHeader
        onBack={onBack}
        title="Quem participa?"
        subtitle="Selecione os membros da família e personalize os nomes."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {participants.filter(p => !p.id.startsWith("custom_")).map(p => (
          <MemberCard key={p.id} p={p} onToggle={() => toggle(p.id)} onRename={(n) => rename(p.id, n)} />
        ))}
      </div>

      {participants.some(p => p.id.startsWith("custom_")) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {participants.filter(p => p.id.startsWith("custom_")).map(p => (
            <MemberCard key={p.id} p={p} onToggle={() => toggle(p.id)} onRename={(n) => rename(p.id, n)} onDelete={() => remove(p.id)} />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-5">
        <p className="mb-3 text-sm font-semibold">Adicionar outro participante</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={customEmoji}
            onChange={(e) => setCustomEmoji(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-3 text-lg outline-none focus:border-primary focus:ring-4 focus:ring-ring"
          >
            {EMOJI_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            maxLength={20}
            placeholder="Ex: Madrinha Carla…"
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-ring"
          />
          <button className="btn-ghost" onClick={addCustom}>Adicionar</button>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold">
          Ativos <span className="text-muted-foreground">({active.length})</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {active.length === 0 && (
            <span className="text-sm text-muted-foreground">Selecione ao menos 2 participantes.</span>
          )}
          {active.map(p => (
            <span key={p.id} className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] px-4 py-2 text-sm font-semibold">
              <span>{p.emoji}</span>{p.name}
              <button
                onClick={() => remove(p.id)}
                className="ml-1 rounded-full px-1 text-muted-foreground transition hover:text-foreground"
                aria-label={`Remover ${p.name}`}
              >✕</button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Criar roleta
          <span aria-hidden>🎡</span>
        </button>
      </div>
    </div>
  );
}

function MemberCard({
  p, onToggle, onRename, onDelete,
}: { p: Participant; onToggle: () => void; onRename: (n: string) => void; onDelete?: () => void }) {
  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
        p.active
          ? "border-primary/40 bg-[color-mix(in_oklab,var(--primary)_7%,transparent)] shadow-sm"
          : "border-border bg-card"
      }`}
    >
      <button
        onClick={onToggle}
        aria-pressed={p.active}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl transition ${
          p.active ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground"
        }`}
      >
        {p.emoji}
      </button>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{p.role}</div>
        <input
          type="text"
          value={p.name}
          onChange={(e) => onRename(e.target.value)}
          className="w-full bg-transparent text-base font-semibold outline-none"
        />
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-full px-2 py-1 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100"
          aria-label={`Remover ${p.name}`}
        >✕</button>
      )}
    </div>
  );
}

function StepHeader({ onBack, title, subtitle }: { onBack: () => void; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onBack}
        className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-secondary"
        aria-label="Voltar"
      >←</button>
      <div>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

// -----------------------------
// Step: Game (Wheel)
// -----------------------------
function GameStep({
  babyName, gender, participants, scoreboard, setScoreboard, onBack, synth, allParticipants,
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

  const sliceColors = gender === "menino"
    ? ["#DCEEFB", "#B7DCF2", "#95C8E8", "#7FB8DF", "#B7DCF2", "#DCEEFB", "#95C8E8", "#A8D0EC"]
    : gender === "menina"
    ? ["#FDE4EC", "#F8CFDD", "#F3B4C8", "#EE9FB8", "#F8CFDD", "#FDE4EC", "#F3B4C8", "#F5C1D2"]
    : ["#F4C7A9", "#F0B49A", "#E9D6B8", "#D9E7CB", "#C9DDE6", "#DDD1EA", "#F2C4C4", "#EED9BB"];

  const themeStyle = gender === "menino"
    ? ({
        "--primary": "oklch(0.72 0.09 235)",
        "--ring": "oklch(0.72 0.09 235 / 40%)",
        "--gradient-primary": "linear-gradient(135deg, oklch(0.82 0.08 230), oklch(0.66 0.11 245))",
      } as React.CSSProperties)
    : gender === "menina"
    ? ({
        "--primary": "oklch(0.74 0.11 12)",
        "--ring": "oklch(0.74 0.11 12 / 40%)",
        "--gradient-primary": "linear-gradient(135deg, oklch(0.86 0.07 15), oklch(0.70 0.13 8))",
      } as React.CSSProperties)
    : ({} as React.CSSProperties);


  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || participants.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr; canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
    }
    const cx = size / 2, cy = size / 2, r = cx - 6;
    ctx.clearRect(0, 0, size, size);

    participants.forEach((p, i) => {
      const a = startAngleRef.current + i * arc;
      ctx.fillStyle = sliceColors[i % sliceColors.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a, a + arc);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx + Math.cos(a + arc / 2) * r * 0.62, cy + Math.sin(a + arc / 2) * r * 0.62);
      ctx.rotate(a + arc / 2 + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#3d2c22";
      ctx.font = "600 15px Nunito, system-ui, sans-serif";
      const label = p.name.length > 12 ? p.name.slice(0, 11) + "…" : p.name;
      ctx.fillText(`${p.emoji} ${label}`, 0, 0);
      ctx.restore();
    });

    // outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  useEffect(() => { draw(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [participants, arc]);
  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });

  const spin = () => {
    if (spinning || participants.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const spinAngleStart = Math.random() * 10 + 12; // deg per tick base
    const spinTimeTotal = Math.random() * 2500 + 4500;
    const t0 = performance.now();
    let currentSector = -1;

    const tick = (now: number) => {
      const t = now - t0;
      if (t >= spinTimeTotal) {
        // Finalize
        const deg = (startAngleRef.current * 180) / Math.PI;
        const arcd = (arc * 180) / Math.PI;
        // pointer at top => angle = -PI/2 (270deg from x-axis)
        // Winner is the sector under the top pointer
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

      // ticks: detect sector under pointer
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
    setScoreboard(prev => ({ ...prev, [winner.id]: (prev[winner.id] || 0) + 1 }));
    setWinner(null);
  };

  const respin = () => { setWinner(null); setTimeout(spin, 200); };

  return (
    <div className="space-y-8" style={themeStyle}>

      <StepHeader
        onBack={onBack}
        title={babyName ? `A hora da verdade para ${babyName}` : "A hora da verdade"}
        subtitle="Toque em girar e vamos ver quem foi o(a) sortudo(a)."
      />

      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[420px]">
          {/* pointer */}
          <div className="absolute left-1/2 top-[-8px] z-10 -translate-x-1/2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl shadow-lg animate-bounce-soft">
              👇
            </div>
          </div>
          {/* wheel */}
          <div className="relative aspect-square w-full rounded-full bg-white p-2 shadow-[var(--shadow-lift)]">
            <canvas ref={canvasRef} className="h-full w-full rounded-full" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-primary text-2xl shadow">
              👶
            </div>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || participants.length < 2}
          className="btn-primary mt-8 text-lg"
        >
          {spinning ? "Sorteando…" : "Girar a roleta 🎲"}
        </button>
      </div>

      <div className="pt-4">
        <Scoreboard
          participants={allParticipants}
          scoreboard={scoreboard}
          onReset={() => setScoreboard({})}
        />
      </div>

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
    `Prepare os lenços e a pomada, a fralda ${who} chama! 🍼`,
    `Parabéns, ${name}! Cheiro de vitória (e de fralda cheia) no ar. 🚼`,
    `A sorte sorriu — divirta-se trocando ${who}. 🌟`,
    `Sem careta! A missão de limpeza ${who} é toda sua. 🧻`,
    `Respire fundo e cumpra seu nobre dever, ${name}. 💪`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// -----------------------------
// Scoreboard
// -----------------------------
function Scoreboard({
  participants, scoreboard, onReset,
}: { participants: Participant[]; scoreboard: Record<string, number>; onReset: () => void }) {
  const list = participants
    .filter(p => p.active)
    .map(p => ({ ...p, score: scoreboard[p.id] || 0 }))
    .sort((a, b) => b.score - a.score);

  const total = list.reduce((s, x) => s + x.score, 0);

  return (
    <section className="rounded-2xl bg-muted/60 p-5 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">Placar de trocas</h3>
          <p className="text-sm text-muted-foreground">{total} troca{total === 1 ? "" : "s"} registrada{total === 1 ? "" : "s"}.</p>
        </div>
        <button onClick={onReset} className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
          Zerar
        </button>
      </header>

      <ul className="space-y-2">
        {list.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl bg-card px-4 py-3">
            <span className="text-xl">{p.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.role}</div>
            </div>
            {i === 0 && p.score > 0 && (
              <span className="rounded-full bg-butter px-2 py-0.5 text-xs font-bold text-foreground">👑 líder</span>
            )}
            <span className="rounded-full bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] px-3 py-1 font-bold text-primary">
              {p.score}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// -----------------------------
// Winner Modal
// -----------------------------
function WinnerModal({
  winner, message, onConfirm, onRespin,
}: { winner: Participant; message: string; onConfirm: () => void; onRespin: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="animate-pop card-soft w-full max-w-md p-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-5xl animate-bounce-soft">
          {winner.emoji}
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Temos um escolhido
        </p>
        <h2 className="mt-1 font-display text-4xl font-semibold text-primary">{winner.name}</h2>
        <p className="mt-4 text-foreground/80">{message}</p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button className="btn-primary" onClick={onConfirm}>Missão cumprida ✓</button>
          <button className="btn-ghost" onClick={onRespin}>Girar de novo 🔄</button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------
// Tip Footer
// -----------------------------
function TipFooter({ tip, onNext }: { tip: string; onNext: () => void }) {
  return (
    <footer className="mt-8">
      <div className="flex items-start gap-3 rounded-2xl bg-card/70 p-4 backdrop-blur sm:p-5">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Diquinha do dia</p>
          <p className="mt-1 text-sm text-foreground/80">{tip}</p>
        </div>
        <button
          onClick={onNext}
          className="shrink-0 rounded-full bg-muted p-2 text-muted-foreground transition hover:bg-secondary"
          aria-label="Próxima dica"
        >🔄</button>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Feito com carinho ❤️ · seus dados ficam somente no seu dispositivo
      </p>
    </footer>
  );
}
