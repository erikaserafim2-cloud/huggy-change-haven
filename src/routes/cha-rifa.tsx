import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import logoAsset from "@/assets/logo.png.asset.json";
import meninaAsset from "@/assets/temas/menina-3.jpg.asset.json";
import ursinhosAsset from "@/assets/temas/ursinhos-3.jpg.asset.json";
import azulAsset from "@/assets/temas/azul-3.jpg.asset.json";
import safariAsset from "@/assets/temas/safari-3.jpg.asset.json";

export const Route = createFileRoute("/cha-rifa")({
  head: () => ({
    meta: [
      { title: "Criador de Chá-Rifa — Quem vai trocar?" },
      { name: "description", content: "Monte a arte do seu chá-rifa de fraldas com modelos em aquarela e baixe como imagem PNG." },
      { property: "og:title", content: "Criador de Chá-Rifa" },
      { property: "og:description", content: "Monte a arte do seu chá-rifa e baixe como imagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChaRifaPage,
});

// -----------------------------
// Modelos (baseados nas artes de referência)
// -----------------------------
type TemplateKey = "menina" | "ursinhos" | "azul" | "safari";

type Palette = {
  accent: string;
  deep: string;
  text: string;
  soft: string;
  ring: string;
  card: string;
};

type Template = {
  label: string;
  hint: string;
  bg: string;
  /** margens (%) reservadas para as ilustrações do modelo */
  inset: { top: number; bottom: number; x: number };
  /** cor do "papel" usada para cobrir os textos originais do modelo */
  veil: string;
  /** retângulos extras (%) para cobrir textos impressos do modelo */
  patches?: { top: number; right: number; bottom: number; left: number }[];
  palette: Palette;
};

const TEMPLATES: Record<TemplateKey, Template> = {
  menina: {
    label: "Ursinha Rosa",
    hint: "Laço e balões dourados",
    bg: meninaAsset.url,
    inset: { top: 9, bottom: 16, x: 9 },
    veil: "rgba(255,252,253,0.86)",
    palette: {
      accent: "#D98BA6",
      deep: "#9B4E6B",
      text: "#7A4358",
      soft: "#FBE4EC",
      ring: "#EFBACB",
      card: "rgba(255,255,255,0.88)",
    },
  },
  ursinhos: {
    label: "Ursinhos Verde",
    hint: "Varal, balões e ursinhos",
    bg: ursinhosAsset.url,
    inset: { top: 19, bottom: 6, x: 14 },
    veil: "#FBF8F1",
    palette: {
      accent: "#8AA97F",
      deep: "#4E6B47",
      text: "#4A5A44",
      soft: "#E6EFDF",
      ring: "#BFD3B4",
      card: "rgba(255,255,255,0.9)",
    },
  },
  azul: {
    label: "Nuvem Azul",
    hint: "Aquarela azul com corações",
    bg: azulAsset.url,
    inset: { top: 6, bottom: 5, x: 7 },
    veil: "#EFF6FD",
    patches: [
      { top: 0, right: 16, bottom: 94, left: 16 },
      { top: 95, right: 18, bottom: 0, left: 18 },
    ],
    palette: {
      accent: "#5B8AC7",
      deep: "#274472",
      text: "#3B5578",
      soft: "#E4EFFB",
      ring: "#AFCCEA",
      card: "rgba(255,255,255,0.86)",
    },
  },
  safari: {
    label: "Safári Verde",
    hint: "Bichinhos no jipe e folhagens",
    bg: safariAsset.url,
    inset: { top: 18, bottom: 3.5, x: 8 },
    veil: "#F5FAF2",
    patches: [{ top: 1, right: 2, bottom: 86, left: 36 }],
    palette: {
      accent: "#7FA277",
      deep: "#41633C",
      text: "#4C5F48",
      soft: "#E8F1E3",
      ring: "#B9D2B0",
      card: "rgba(255,255,255,0.88)",
    },
  },
};

const TITLE_FONTS = [
  { key: "caveat", label: "Manuscrito Caveat", css: "'Caveat', 'Brush Script MT', cursive" },
  { key: "pacifico", label: "Pacifico Casual", css: "'Pacifico', 'Brush Script MT', cursive" },
  { key: "sacramento", label: "Sacramento Fino", css: "'Sacramento', 'Lucida Handwriting', cursive" },
  { key: "amatic", label: "Amatic Rústica", css: "'Amatic SC', ui-sans-serif, sans-serif" },
  { key: "fraunces", label: "Elegante Serifada", css: "'Fraunces', ui-serif, Georgia, serif" },
];

const NUMBER_COUNTS = [20, 60, 100, 200];

const DEFAULT_STATE = {
  babyName: "Bebê",
  template: "ursinhos" as TemplateKey,
  fontKey: "caveat",
  count: 100,
  price: "15",
  prize: "R$ 150,00",
  drawDate: "",
  intro: "Mamãe e papai estão super ansiosos com a minha chegada e resolveram comemorar de uma forma diferente. Você está convidado para participar do meu Chá Rifa!",
  rule1: "Escolha um número e verifique se está disponível.",
  rule2: "Combine a entrega da fralda ou o Pix com a mamãe.",
  rule3: "Aguarde o sorteio e boa sorte!",
  thanks: "Agradeço por sua participação no meu Chá Rifa.",
  pix: "",
  contact: "",
};

const LS_KEY = "cha_rifa_state_v2";

function ChaRifaPage() {
  const [state, setState] = useState<typeof DEFAULT_STATE>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = <K extends keyof typeof DEFAULT_STATE>(key: K, value: (typeof DEFAULT_STATE)[K]) =>
    setState(s => ({ ...s, [key]: value }));

  const template = TEMPLATES[state.template];
  const font = TITLE_FONTS.find(f => f.key === state.fontKey) ?? TITLE_FONTS[0];

  const download = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `cha-rifa-${state.babyName || "bebe"}.png`;
      a.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="btn-ghost inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-3.5">
            <span aria-hidden>←</span> Voltar ao Início
          </Link>
          <Link to="/" aria-label="Tela inicial" className="rounded-full p-1 transition hover:opacity-90">
            <span className="flex h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-card ring-2 ring-primary/20 shadow-xs">
              <img src={logoAsset.url} alt="Quem vai trocar?" className="h-full w-full object-cover scale-110" />
            </span>
          </Link>
        </div>

        <header className="mt-4 text-center">
          <span className="badge-maternal mb-2">🎟️ Criador Especial</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">
            Criador de Chá-Rifa de Fraldas
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-lg mx-auto">
            Escolha um modelo delicado em aquarela, preencha as informações do seu evento e baixe a arte prontinha para compartilhar no WhatsApp e Instagram!
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,360px] lg:items-start">
          {/* Preview */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className="w-full max-w-[520px]">
              <div className="mb-2 text-center text-xs uppercase tracking-widest text-muted-foreground">
                Prévia
              </div>
              <div
                ref={previewRef}
                className="mx-auto overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]"
                style={{ width: "100%", maxWidth: 520 }}
              >
                <RifaArt state={state} template={template} fontCss={font.css} />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                A imagem será exportada em alta resolução (2x).
              </p>
            </div>
          </div>

          {/* Painel lateral (direita) */}
          <aside className="card-soft order-1 space-y-5 self-start p-5 sm:p-6 lg:order-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <h2 className="sr-only font-display text-xl font-semibold">Configurações do chá-rifa</h2>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Escolha do modelo</h2>
              <Field label="Modelo">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(TEMPLATES) as TemplateKey[]).map(k => (
                    <button
                      key={k}
                      onClick={() => update("template", k)}
                      className={`overflow-hidden rounded-xl border text-left transition ${
                        state.template === k ? "border-primary ring-2 ring-primary/30" : "border-border hover:bg-muted"
                      }`}
                    >
                      <img
                        src={TEMPLATES[k].bg}
                        alt={`Modelo de chá-rifa ${TEMPLATES[k].label}`}
                        className="h-28 w-full bg-muted object-contain"
                        loading="lazy"
                      />
                      <span className="block px-2 py-1.5">
                        <span className="block truncate text-sm font-semibold">{TEMPLATES[k].label}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">{TEMPLATES[k].hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Field>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Dados do bebê e do evento</h2>
              <Field label="Nome do bebê">
                <input
                  className="input-soft"
                  value={state.babyName}
                  maxLength={40}
                  onChange={e => update("babyName", e.target.value)}
                  placeholder="Ex: Helena"
                />
              </Field>

              <Field label="Fonte do título">
                <select
                  className="input-soft"
                  value={state.fontKey}
                  onChange={e => update("fontKey", e.target.value)}
                >
                  {TITLE_FONTS.map(f => (
                    <option key={f.key} value={f.key}>{f.label}</option>
                  ))}
                </select>
              </Field>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Números e valores</h2>
              <Field label="Quantidade de números">
                <div className="grid grid-cols-4 gap-2">
                  {NUMBER_COUNTS.map(n => (
                    <button
                      key={n}
                      onClick={() => update("count", n)}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                        state.count === n
                          ? "border-primary bg-primary text-primary-foreground shadow"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Valor por número (R$)">
                  <input
                    className="input-soft"
                    inputMode="decimal"
                    value={state.price}
                    maxLength={10}
                    onChange={e => update("price", e.target.value.replace(/[^\d.,]/g, ""))}
                  />
                </Field>
                <Field label="Data do sorteio">
                  <input
                    className="input-soft"
                    type="date"
                    value={state.drawDate}
                    onChange={e => update("drawDate", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Prêmio">
                <input
                  className="input-soft"
                  value={state.prize}
                  maxLength={80}
                  onChange={e => update("prize", e.target.value)}
                  placeholder="Ex: R$ 200,00"
                />
              </Field>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Textos do convite</h2>
              <Field label="Texto de convite">
                <textarea
                  className="input-soft min-h-[80px] resize-none text-sm"
                  value={state.intro}
                  maxLength={260}
                  onChange={e => update("intro", e.target.value)}
                />
              </Field>

              <Field label="Regras — Como funciona">
                <div className="space-y-2">
                  {(["rule1", "rule2", "rule3"] as const).map((k, i) => (
                    <div key={k} className="flex items-start gap-2">
                      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <textarea
                        className="input-soft min-h-[52px] resize-none text-sm"
                        value={state[k]}
                        maxLength={140}
                        onChange={e => update(k, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Mensagem de agradecimento">
                <input
                  className="input-soft"
                  value={state.thanks}
                  maxLength={120}
                  onChange={e => update("thanks", e.target.value)}
                  placeholder="Ex: Agradeço por sua participação"
                />
              </Field>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold">Pagamento e contato</h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="PIX">
                  <input
                    className="input-soft"
                    value={state.pix}
                    maxLength={60}
                    onChange={e => update("pix", e.target.value)}
                    placeholder="chave PIX"
                  />
                </Field>
                <Field label="Contato">
                  <input
                    className="input-soft"
                    value={state.contact}
                    maxLength={40}
                    onChange={e => update("contact", e.target.value)}
                    placeholder="WhatsApp"
                  />
                </Field>
              </div>
            </section>

            <button onClick={download} disabled={exporting} className="btn-primary w-full">
              {exporting ? "Gerando..." : "Baixar como PNG"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

// -----------------------------
// Arte da rifa sobre o modelo escolhido
// -----------------------------
function RifaArt({
  state,
  template,
  fontCss,
}: {
  state: typeof DEFAULT_STATE;
  template: Template;
  fontCss: string;
}) {
  const p = template.palette;
  const numbers = useMemo(() => Array.from({ length: state.count }, (_, i) => i + 1), [state.count]);
  const cols = state.count <= 20 ? 5 : state.count <= 60 ? 10 : state.count <= 100 ? 10 : 20;

  const drawDatePt = state.drawDate
    ? new Date(state.drawDate + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: "9 / 16", background: "#fff" }}
    >
      {/* Fundo do modelo */}
      <img
        src={template.bg}
        alt=""
        aria-hidden
        crossOrigin="anonymous"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Remendos pontuais sobre textos impressos do modelo */}
      {template.patches?.map((r, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute"
          style={{
            top: `${r.top}%`,
            right: `${r.right}%`,
            bottom: `${r.bottom}%`,
            left: `${r.left}%`,
            background: template.veil,
            borderRadius: 20,
            boxShadow: `0 0 20px 20px ${template.veil}`,
          }}
        />
      ))}

      {/* Camada que cobre os textos originais do modelo */}
      <div
        aria-hidden
        className="absolute"
        style={{
          top: `${template.inset.top - 1.5}%`,
          bottom: `${template.inset.bottom - 1.5}%`,
          left: `${template.inset.x - 2}%`,
          right: `${template.inset.x - 2}%`,
          background: template.veil,
          borderRadius: 28,
          boxShadow: `0 0 26px 26px ${template.veil}`,
        }}
      />

      {/* Área de conteúdo, respeitando as ilustrações do modelo */}
      <div
        className="absolute flex flex-col overflow-hidden"
        style={{
          top: `${template.inset.top}%`,
          bottom: `${template.inset.bottom}%`,
          left: `${template.inset.x}%`,
          right: `${template.inset.x}%`,
        }}
      >
        {/* Título */}
        <div className="text-center">
          <div className="text-[9px] font-bold uppercase tracking-[0.45em]" style={{ color: p.accent }}>
            Chá Rifa do
          </div>
          <h2
            className="mt-0.5 leading-[1]"
            style={{ fontFamily: fontCss, color: p.deep, fontWeight: 700, fontSize: "clamp(24px, 6vw, 42px)" }}
          >
            {state.babyName || "Bebê"}
          </h2>
        </div>

        {/* Convite */}
        {state.intro && (
          <p
            className="mt-1.5 text-center text-[9.5px] leading-snug"
            style={{ color: p.text }}
          >
            {state.intro}
          </p>
        )}

        {/* Prêmio */}
        <div
          className="mx-auto mt-2 rounded-full px-4 py-1.5 text-center"
          style={{ background: p.soft, boxShadow: `inset 0 0 0 1.5px ${p.ring}` }}
        >
          <span className="text-[13px] font-bold" style={{ color: p.deep }}>
            Prêmio: {state.prize || "—"}
          </span>
        </div>

        <div className="mt-1 text-center text-[9px] font-semibold" style={{ color: p.text }}>
          Cada número da rifa: 1 pacote de fraldas {state.price ? `ou Pix de R$ ${state.price}` : ""}
        </div>

        {/* Cartela */}
        <div
          className="mt-2 rounded-2xl p-2"
          style={{ background: p.card, boxShadow: `inset 0 0 0 1.5px ${p.ring}` }}
        >
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {numbers.map(n => (
              <div
                key={n}
                className="flex aspect-square items-center justify-center rounded-full font-bold"
                style={{
                  fontSize: cols > 10 ? 6 : 9,
                  background: "#fff",
                  color: p.deep,
                  border: `1px solid ${p.ring}`,
                }}
              >
                {String(n).padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>

        {/* Como funciona */}
        <ol className="mt-2 space-y-1">
          {[state.rule1, state.rule2, state.rule3].filter(Boolean).map((rule, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span
                className="mt-[1px] grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full text-[7px] font-bold"
                style={{ background: p.accent, color: "#fff" }}
              >
                {i + 1}
              </span>
              <span className="text-[9px] leading-snug" style={{ color: p.text }}>
                {rule}
              </span>
            </li>
          ))}
        </ol>

        {/* Rodapé */}
        <div className="mt-auto pt-2 text-center">
          <div
            className="mx-auto inline-block rounded-full px-4 py-1"
            style={{ background: p.soft, boxShadow: `inset 0 0 0 1.5px ${p.ring}` }}
          >
            <span className="text-[10px] font-bold" style={{ color: p.deep }}>
              Sorteio: {drawDatePt || "a definir"}
            </span>
          </div>
          {state.thanks && (
            <p className="mt-1 text-[10px] italic leading-snug" style={{ color: p.text, fontFamily: fontCss }}>
              {state.thanks}
            </p>
          )}
          {(state.pix || state.contact) && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 text-[8.5px] font-semibold" style={{ color: p.deep }}>
              {state.pix && (
                <span className="rounded-full px-2 py-0.5" style={{ background: p.soft }}>
                  PIX: {state.pix}
                </span>
              )}
              {state.contact && (
                <span className="rounded-full px-2 py-0.5" style={{ background: p.soft }}>
                  {state.contact}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
