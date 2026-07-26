import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import logoAsset from "@/assets/logo.png.asset.json";
import ursinhoAsset from "@/assets/temas/ursinho.png.asset.json";
import safariAsset from "@/assets/temas/safari.png.asset.json";
import elefanteAsset from "@/assets/temas/elefante.png.asset.json";
import balaoAsset from "@/assets/temas/balao.png.asset.json";
import estrelaAsset from "@/assets/temas/estrela.png.asset.json";
import nuvemAsset from "@/assets/temas/nuvem.png.asset.json";

const THEME_IMAGES: Record<"ursinho" | "safari" | "elefante" | "balao" | "estrela" | "nuvem", string> = {
  ursinho: ursinhoAsset.url,
  safari: safariAsset.url,
  elefante: elefanteAsset.url,
  balao: balaoAsset.url,
  estrela: estrelaAsset.url,
  nuvem: nuvemAsset.url,
};

export const Route = createFileRoute("/cha-rifa")({
  head: () => ({
    meta: [
      { title: "Criador de Chá-Rifa — Quem vai trocar?" },
      { name: "description", content: "Monte a arte do seu chá-rifa de fraldas com painel de opções e baixe como imagem PNG." },
      { property: "og:title", content: "Criador de Chá-Rifa" },
      { property: "og:description", content: "Monte a arte do seu chá-rifa e baixe como imagem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChaRifaPage,
});

// -----------------------------
// Temas & paletas
// -----------------------------
type ThemeKey = "ursinho" | "safari" | "elefante" | "balao" | "estrela" | "nuvem";
type ColorKey = "rosa" | "azul" | "neutro" | "verde" | "lilas";

const THEMES: Record<ThemeKey, { label: string }> = {
  ursinho: { label: "Ursinho" },
  safari: { label: "Safári" },
  elefante: { label: "Elefantinho" },
  balao: { label: "Balão" },
  estrela: { label: "Estrelinha" },
  nuvem: { label: "Nuvenzinha" },
};

const COLORS: Record<
  ColorKey,
  { label: string; bg: string; card: string; accent: string; text: string; soft: string; ring: string; deep: string }
> = {
  rosa: {
    label: "Rosa Bebê",
    bg: "linear-gradient(160deg, #FFE4EC 0%, #FFF5F7 55%, #FFE9D6 100%)",
    card: "#ffffff",
    accent: "#E27196",
    text: "#7A3B54",
    soft: "#FBD5E0",
    ring: "#F1A4BC",
    deep: "#B24F73",
  },
  azul: {
    label: "Azul Bebê",
    bg: "linear-gradient(160deg, #DDEBFF 0%, #F1F7FF 55%, #E4F1FF 100%)",
    card: "#ffffff",
    accent: "#4E86C6",
    text: "#2F4C77",
    soft: "#CFE0F6",
    ring: "#9BBEE6",
    deep: "#345F92",
  },
  neutro: {
    label: "Neutro",
    bg: "linear-gradient(160deg, #F7EFE3 0%, #FBF6EE 55%, #F0E4D3 100%)",
    card: "#ffffff",
    accent: "#B98C63",
    text: "#5A4530",
    soft: "#EEDDC5",
    ring: "#D4B896",
    deep: "#8A6540",
  },
  verde: {
    label: "Verde Sálvia",
    bg: "linear-gradient(160deg, #E2EEDF 0%, #F1F7EF 55%, #E9F1E1 100%)",
    card: "#ffffff",
    accent: "#6B9970",
    text: "#3C5C40",
    soft: "#D3E5CE",
    ring: "#A9C7A7",
    deep: "#4E7452",
  },
  lilas: {
    label: "Lilás",
    bg: "linear-gradient(160deg, #ECE1F3 0%, #F6EFFB 55%, #E3D6EE 100%)",
    card: "#ffffff",
    accent: "#8B6DAE",
    text: "#4E3968",
    soft: "#DDCCE9",
    ring: "#B79CD1",
    deep: "#664B87",
  },
};

const TITLE_FONTS = [
  { key: "fraunces", label: "Elegante (serifada)", css: "'Fraunces', ui-serif, Georgia, serif" },
  { key: "sans", label: "Moderno (sem serifa)", css: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { key: "hand", label: "Manuscrito", css: "'Brush Script MT', 'Lucida Handwriting', cursive" },
  { key: "mono", label: "Máquina de escrever", css: "ui-monospace, 'Courier New', monospace" },
];

const NUMBER_COUNTS = [20, 60, 100, 200];

const DEFAULT_STATE = {
  babyName: "Bebê",
  theme: "ursinho" as ThemeKey,
  color: "rosa" as ColorKey,
  fontKey: "fraunces",
  count: 60,
  price: "5",
  prize: "R$ 200,00 no PIX",
  drawDate: "",
  howItWorks: "Cada número da rifa custa R$ 5. Escolha o seu, faça o PIX e boa sorte! O sorteio acontece pela Loteria Federal.",
  pix: "",
  contact: "",
};

const LS_KEY = "cha_rifa_state_v1";

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

  const palette = COLORS[state.color];
  const theme = THEMES[state.theme];
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
        <div className="relative flex items-center justify-center">
          <Link to="/" className="btn-ghost absolute left-0 inline-flex items-center gap-2 text-sm">
            <span aria-hidden>←</span> Voltar
          </Link>
          <Link to="/" aria-label="Tela inicial" className="rounded-full p-1 transition hover:opacity-90">
            <span className="flex h-24 w-24 overflow-hidden rounded-full bg-card ring-4 ring-[color-mix(in_oklab,var(--primary)_20%,transparent)] shadow-[var(--shadow-soft)] sm:h-28 sm:w-28">
              <img src={logoAsset.url} alt="Quem vai trocar?" className="h-full w-full object-cover scale-110" />
            </span>
          </Link>
        </div>

        <header className="mt-4 text-center">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Criador de Chá-Rifa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha as opções no painel e baixe a arte pronta para o WhatsApp.
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,360px] lg:items-start">
          {/* Preview */}
          <div className="order-2 flex justify-center lg:order-1">
            <div className="w-full max-w-[640px]">
              <div className="mb-2 text-center text-xs uppercase tracking-widest text-muted-foreground">
                Prévia
              </div>
              <div
                ref={previewRef}
                className="mx-auto overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]"
                style={{ background: palette.bg, color: palette.text, width: "100%", maxWidth: 640 }}
              >
                <RifaArt state={state} palette={palette} fontCss={font.css} />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                A imagem será exportada em alta resolução (2x).
              </p>
            </div>
          </div>

          {/* Painel lateral (direita) */}
          <aside className="card-soft order-1 space-y-5 self-start p-5 sm:p-6 lg:order-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">

            <Field label="Nome do bebê">
              <input
                className="input-soft"
                value={state.babyName}
                maxLength={40}
                onChange={e => update("babyName", e.target.value)}
                placeholder="Ex: Helena"
              />
            </Field>

            <Field label="Tema">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(THEMES) as ThemeKey[]).map(k => (
                  <button
                    key={k}
                    onClick={() => update("theme", k)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-sm transition ${
                      state.theme === k ? "border-primary ring-2 ring-primary/30" : "border-border hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <ThemeIllustration theme={k} palette={COLORS[state.color]} size={26} />
                    </span>
                    <span className="truncate font-medium">{THEMES[k].label}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Cor">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(COLORS) as ColorKey[]).map(k => (
                  <button
                    key={k}
                    onClick={() => update("color", k)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-sm transition ${
                      state.color === k ? "border-primary ring-2 ring-primary/30" : "border-border hover:bg-muted"
                    }`}
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-full ring-2 ring-white"
                      style={{ background: COLORS[k].accent }}
                    />
                    <span className="truncate font-medium">{COLORS[k].label}</span>
                  </button>
                ))}
              </div>
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
              <Field label="Valor (R$)">
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
                placeholder="Ex: R$ 200 no PIX"
              />
            </Field>

            <Field label="Como funciona">
              <textarea
                className="input-soft min-h-[80px] resize-none"
                value={state.howItWorks}
                maxLength={280}
                onChange={e => update("howItWorks", e.target.value)}
              />
            </Field>

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

            <button
              onClick={download}
              disabled={exporting}
              className="btn-primary w-full"
            >
              {exporting ? "Gerando..." : "Baixar como PNG"}
            </button>
          </aside>
        </div>

      </div>
    </div>
  );
}

// -----------------------------
// Componentes visuais
// -----------------------------
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
// Ilustrações SVG por tema
// -----------------------------
function ThemeIllustration({
  theme, palette, size = 200,
}: { theme: ThemeKey; palette: (typeof COLORS)[ColorKey]; size?: number }) {
  const a = palette.accent;
  const d = palette.deep;
  const s = palette.soft;
  const r = palette.ring;
  const common = { width: size, height: size, viewBox: "0 0 200 200" } as const;

  switch (theme) {
    case "ursinho":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          {/* orelhas */}
          <circle cx="65" cy="70" r="22" fill={d} />
          <circle cx="135" cy="70" r="22" fill={d} />
          <circle cx="65" cy="70" r="11" fill={s} />
          <circle cx="135" cy="70" r="11" fill={s} />
          {/* cabeça */}
          <circle cx="100" cy="110" r="55" fill={a} />
          {/* focinho */}
          <ellipse cx="100" cy="128" rx="26" ry="20" fill={s} />
          <ellipse cx="100" cy="120" rx="6" ry="4.5" fill={d} />
          {/* olhos */}
          <circle cx="82" cy="105" r="4.5" fill={d} />
          <circle cx="118" cy="105" r="4.5" fill={d} />
          {/* bochechas */}
          <circle cx="70" cy="122" r="6" fill={r} opacity="0.6" />
          <circle cx="130" cy="122" r="6" fill={r} opacity="0.6" />
          {/* boca */}
          <path d="M92 134 Q100 140 108 134" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* laço */}
          <path d="M80 60 L100 72 L120 60 L115 80 L85 80 Z" fill={d} opacity="0.7" />
        </svg>
      );
    case "elefante":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          {/* orelhas */}
          <ellipse cx="55" cy="105" rx="26" ry="32" fill={d} />
          <ellipse cx="145" cy="105" rx="26" ry="32" fill={d} />
          {/* corpo/cabeça */}
          <circle cx="100" cy="105" r="50" fill={a} />
          {/* tromba */}
          <path d="M100 140 Q100 175 130 170 Q140 168 138 158" stroke={a} strokeWidth="20" fill="none" strokeLinecap="round" />
          {/* olhos */}
          <circle cx="85" cy="100" r="4.5" fill={d} />
          <circle cx="115" cy="100" r="4.5" fill={d} />
          {/* bochechas */}
          <circle cx="78" cy="118" r="5" fill={r} opacity="0.6" />
          <circle cx="122" cy="118" r="5" fill={r} opacity="0.6" />
          {/* topete */}
          <path d="M90 55 Q100 40 110 55" stroke={d} strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "balao":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          {/* balão */}
          <ellipse cx="100" cy="75" rx="50" ry="58" fill={a} />
          <ellipse cx="85" cy="55" rx="12" ry="18" fill={s} opacity="0.7" />
          <path d="M60 118 L100 138 L140 118 L120 128 L100 138 L80 128 Z" fill={d} opacity="0.5" />
          {/* cordas */}
          <line x1="85" y1="130" x2="90" y2="155" stroke={d} strokeWidth="1.5" />
          <line x1="115" y1="130" x2="110" y2="155" stroke={d} strokeWidth="1.5" />
          <line x1="100" y1="132" x2="100" y2="155" stroke={d} strokeWidth="1.5" />
          {/* cesto */}
          <rect x="82" y="155" width="36" height="24" rx="4" fill={d} />
          <line x1="88" y1="155" x2="88" y2="179" stroke={s} strokeWidth="1" />
          <line x1="100" y1="155" x2="100" y2="179" stroke={s} strokeWidth="1" />
          <line x1="112" y1="155" x2="112" y2="179" stroke={s} strokeWidth="1" />
          {/* nuvens */}
          <circle cx="30" cy="150" r="10" fill="#ffffff" opacity="0.8" />
          <circle cx="42" cy="150" r="8" fill="#ffffff" opacity="0.8" />
          <circle cx="165" cy="160" r="10" fill="#ffffff" opacity="0.8" />
          <circle cx="175" cy="160" r="7" fill="#ffffff" opacity="0.8" />
        </svg>
      );
    case "estrela":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          {/* lua */}
          <path d="M120 40 A55 55 0 1 0 165 130 A45 45 0 1 1 120 40 Z" fill={a} />
          <circle cx="140" cy="70" r="3" fill={s} opacity="0.7" />
          <circle cx="150" cy="95" r="2.5" fill={s} opacity="0.7" />
          {/* estrelas */}
          <path d="M50 60 l4 10 l10 2 l-8 6 l3 10 l-9 -6 l-9 6 l3 -10 l-8 -6 l10 -2 z" fill={d} />
          <path d="M40 140 l3 7 l7 1 l-5 4 l2 7 l-7 -4 l-7 4 l2 -7 l-5 -4 l7 -1 z" fill={d} opacity="0.7" />
          <path d="M170 40 l2 5 l5 1 l-4 3 l1 5 l-4 -3 l-5 3 l2 -5 l-4 -3 l5 -1 z" fill={d} opacity="0.6" />
        </svg>
      );
    case "nuvem":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="110" rx="70" ry="35" fill={s} />
          <circle cx="65" cy="95" r="25" fill={s} />
          <circle cx="100" cy="80" r="30" fill={s} />
          <circle cx="135" cy="95" r="25" fill={s} />
          {/* rosto */}
          <circle cx="88" cy="105" r="4" fill={d} />
          <circle cx="112" cy="105" r="4" fill={d} />
          <circle cx="80" cy="115" r="5" fill={r} opacity="0.7" />
          <circle cx="120" cy="115" r="5" fill={r} opacity="0.7" />
          <path d="M92 120 Q100 128 108 120" stroke={d} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* gotas */}
          <path d="M70 155 Q66 168 74 168 Q78 168 74 155 Z" fill={a} />
          <path d="M100 165 Q96 178 104 178 Q108 178 104 165 Z" fill={a} />
          <path d="M130 155 Q126 168 134 168 Q138 168 134 155 Z" fill={a} />
        </svg>
      );
    case "safari":
      return (
        <svg {...common} xmlns="http://www.w3.org/2000/svg">
          {/* girafa */}
          <rect x="95" y="55" width="16" height="70" rx="6" fill={a} />
          <circle cx="103" cy="50" r="18" fill={a} />
          <circle cx="115" cy="45" r="3" fill={d} />
          <line x1="98" y1="35" x2="96" y2="28" stroke={d} strokeWidth="2" />
          <line x1="108" y1="35" x2="110" y2="28" stroke={d} strokeWidth="2" />
          <circle cx="96" cy="28" r="2.5" fill={d} />
          <circle cx="110" cy="28" r="2.5" fill={d} />
          {/* corpo */}
          <ellipse cx="103" cy="140" rx="45" ry="25" fill={a} />
          <rect x="70" y="150" width="8" height="25" rx="3" fill={a} />
          <rect x="128" y="150" width="8" height="25" rx="3" fill={a} />
          {/* manchas */}
          <circle cx="90" cy="135" r="5" fill={d} opacity="0.6" />
          <circle cx="110" cy="145" r="6" fill={d} opacity="0.6" />
          <circle cx="125" cy="132" r="4" fill={d} opacity="0.6" />
          <circle cx="103" cy="70" r="3" fill={d} opacity="0.6" />
          <circle cx="105" cy="90" r="3" fill={d} opacity="0.6" />
          {/* grama */}
          <path d="M30 175 Q35 165 40 175 Q45 165 50 175 Z" fill={d} opacity="0.5" />
          <path d="M150 175 Q155 165 160 175 Q165 165 170 175 Z" fill={d} opacity="0.5" />
        </svg>
      );
  }
}

function BackgroundPattern({ palette }: { palette: (typeof COLORS)[ColorKey] }) {
  // padrão suave e universal: pontinhos + curvas orgânicas
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>
    <g fill='${palette.accent}' opacity='0.08'>
      <circle cx='20' cy='20' r='2.5'/>
      <circle cx='70' cy='40' r='1.8'/>
      <circle cx='110' cy='25' r='2.2'/>
      <circle cx='40' cy='80' r='2'/>
      <circle cx='95' cy='95' r='2.6'/>
      <circle cx='125' cy='115' r='1.8'/>
      <circle cx='15' cy='120' r='2.2'/>
    </g>
    <g stroke='${palette.accent}' stroke-width='1.2' fill='none' opacity='0.09' stroke-linecap='round'>
      <path d='M0 60 Q35 45 70 60 T140 60'/>
      <path d='M0 110 Q35 95 70 110 T140 110'/>
    </g>
  </svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: url, backgroundRepeat: "repeat", backgroundSize: "140px 140px" }}
    />
  );
}

function RifaArt({
  state, palette, fontCss,
}: {
  state: typeof DEFAULT_STATE;
  palette: (typeof COLORS)[ColorKey];
  fontCss: string;
}) {
  const numbers = useMemo(() => Array.from({ length: state.count }, (_, i) => i + 1), [state.count]);
  const cols = state.count <= 20 ? 5 : state.count <= 60 ? 10 : state.count <= 100 ? 10 : 20;

  const drawDatePt = state.drawDate
    ? new Date(state.drawDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  return (
    <div className="relative p-6 sm:p-8">
      {/* Padrão de fundo delicado */}
      <BackgroundPattern palette={palette} />

      {/* Halo suave atrás da ilustração */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 rounded-full blur-2xl"
        style={{ width: 260, height: 260, background: palette.soft, opacity: 0.7 }}
      />

      {/* Ilustração grande do tema */}
      <div className="relative flex justify-center">
        <ThemeIllustration theme={state.theme} palette={palette} size={200} />
      </div>

      {/* Título */}
      <div className="relative -mt-2 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: palette.accent }}>
          Chá Rifa
        </div>
        <h2
          className="mt-1 text-4xl leading-tight sm:text-5xl"
          style={{ fontFamily: fontCss, color: palette.text, fontWeight: 700 }}
        >
          {state.babyName || "do Bebê"}
        </h2>

        {/* linha decorativa */}
        <div className="mx-auto mt-3 flex items-center justify-center gap-2" aria-hidden>
          <span className="h-px w-10" style={{ background: palette.ring }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: palette.accent }} />
          <span className="h-px w-10" style={{ background: palette.ring }} />
        </div>

        {/* Prêmio */}
        <div
          className="mx-auto mt-4 inline-flex flex-col items-center rounded-2xl px-6 py-2.5"
          style={{ background: palette.accent, color: "white" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Prêmio</span>
          <span className="text-lg font-bold leading-tight">{state.prize || "—"}</span>
        </div>
      </div>

      {/* Grid de números */}
      <div
        className="relative mx-auto mt-5 rounded-2xl p-3"
        style={{ background: palette.card, boxShadow: `inset 0 0 0 2px ${palette.soft}` }}
      >
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {numbers.map(n => (
            <div
              key={n}
              className="flex aspect-square items-center justify-center rounded-md text-[10px] font-bold sm:text-xs"
              style={{
                background: palette.soft,
                color: palette.text,
                border: `1px solid ${palette.ring}`,
              }}
            >
              {String(n).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="relative mt-5 grid gap-3 text-center sm:grid-cols-3">
        <InfoTile label="Valor" value={state.price ? `R$ ${state.price}` : "—"} palette={palette} />
        <InfoTile label="Números" value={String(state.count)} palette={palette} />
        <InfoTile label="Sorteio" value={drawDatePt || "a definir"} palette={palette} />
      </div>

      {/* Como funciona */}
      {state.howItWorks && (
        <p className="relative mt-4 rounded-xl p-3 text-center text-xs leading-relaxed"
          style={{ background: palette.card, color: palette.text, boxShadow: `inset 0 0 0 1px ${palette.soft}` }}>
          {state.howItWorks}
        </p>
      )}

      {/* Rodapé */}
      {(state.pix || state.contact) && (
        <div className="relative mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold"
          style={{ color: palette.text }}>
          {state.pix && (
            <span className="rounded-full px-3 py-1" style={{ background: palette.soft }}>
              PIX: {state.pix}
            </span>
          )}
          {state.contact && (
            <span className="rounded-full px-3 py-1" style={{ background: palette.soft }}>
              {state.contact}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value, palette }: { label: string; value: string; palette: (typeof COLORS)[ColorKey] }) {
  return (
    <div
      className="rounded-xl p-2"
      style={{ background: palette.card, boxShadow: `inset 0 0 0 1px ${palette.soft}` }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: palette.accent }}>{label}</div>
      <div className="mt-0.5 text-sm font-semibold" style={{ color: palette.text }}>{value}</div>
    </div>
  );
}
