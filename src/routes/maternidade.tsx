import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getMaternityGuide, type MaternityGuide } from "../lib/maternity.functions";
import logoAsset from "@/assets/logo.png.asset.json";


export const Route = createFileRoute("/maternidade")({
  head: () => ({
    meta: [
      { title: "Universo da Maternidade — Guia da Fase" },
      { name: "description", content: "Tópicos personalizados sobre desenvolvimento, sono, alimentação e cuidados baseados na idade do seu bebê." },
      { property: "og:title", content: "Universo da Maternidade" },
      { property: "og:description", content: "Um guia acolhedor e personalizado para a fase do seu bebê." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MaternityPage,
});

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function saveLS(key: string, v: unknown) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* */ }
}

// Convert age (months + optional days for <1mo) → synthetic ISO birthDate
function ageToBirthDate(months: number, days: number): string {
  const now = new Date();
  const target = new Date(now);
  if (months === 0) {
    target.setDate(now.getDate() - Math.max(0, days));
  } else {
    target.setMonth(now.getMonth() - months);
  }
  return target.toISOString().slice(0, 10);
}

function ageLabel(months: number, days: number): string {
  if (months === 0) return `${days} dia(s)`;
  if (months < 12) return `${months} mês(es)`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m === 0 ? `${y} ano(s)` : `${y} ano(s) e ${m} mês(es)`;
}

function MaternityPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [ageDays, setAgeDays] = useState<number>(15);
  const [guide, setGuide] = useState<MaternityGuide | null>(null);
  const [cachedFor, setCachedFor] = useState<string>("");

  // Form-only state (before saving)
  const [formMonths, setFormMonths] = useState<number | "">("");
  const [formDays, setFormDays] = useState<number>(15);

  const birthDate = useMemo(
    () => (ageMonths === null ? "" : ageToBirthDate(ageMonths, ageDays)),
    [ageMonths, ageDays]
  );

  const mutation = useMutation({
    mutationFn: async (input: { birthDate: string; babyName: string }) =>
      await getMaternityGuide({ data: input }),
    onSuccess: (data, vars) => {
      setGuide(data);
      const cacheKey = `${vars.birthDate}|${new Date().toDateString()}`;
      saveLS("maternity_guide", { key: cacheKey, data });
      setCachedFor(cacheKey);
    },
  });

  useEffect(() => {
    setBabyName(loadLS("babyName", ""));
    const m = loadLS<number | null>("babyAgeMonths", null);
    const d = loadLS<number>("babyAgeDays", 15);
    setAgeMonths(m);
    setAgeDays(d);
    if (m !== null) {
      setFormMonths(m);
      setFormDays(d);
    }
    const cached = loadLS<{ key: string; data: MaternityGuide } | null>("maternity_guide", null);
    if (cached && m !== null) {
      const bd = ageToBirthDate(m, d);
      const todayKey = `${bd}|${new Date().toDateString()}`;
      if (cached.key === todayKey) {
        setGuide(cached.data);
        setCachedFor(todayKey);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (ageMonths === null) return;
    if (!birthDate) return;
    const todayKey = `${birthDate}|${new Date().toDateString()}`;
    if (cachedFor === todayKey) return;
    if (mutation.isPending) return;
    mutation.mutate({ birthDate, babyName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, birthDate]);

  const handleSaveAge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formMonths === "") return;
    const m = Number(formMonths);
    const d = m === 0 ? Math.min(30, Math.max(1, Number(formDays) || 1)) : 15;
    saveLS("babyAgeMonths", m);
    saveLS("babyAgeDays", d);
    setAgeMonths(m);
    setAgeDays(d);
  };

  const hasAge = ageMonths !== null;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="btn-ghost inline-flex items-center gap-2 text-xs sm:text-sm py-2 px-3.5">
            <span aria-hidden>←</span> Voltar para a Roleta
          </Link>
          <Link
            to="/"
            aria-label="Voltar para a tela inicial"
            className="flex items-center justify-center rounded-full p-1 transition hover:opacity-90"
          >
            <span className="flex h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full bg-card ring-2 ring-primary/20 shadow-xs">
              <img src={logoAsset.url} alt="Quem vai trocar?" className="h-full w-full object-cover scale-110" />
            </span>
          </Link>
        </div>

        <header className="mt-4 text-center">
          <span className="badge-maternal mb-2">🌷 Apoio ao Desenvolvimento</span>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl text-foreground">
            {babyName ? <>Guia da fase de <span className="text-primary">{babyName}</span></> : "Guia da fase do bebê"}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Tópicos carinhosos e personalizados para a idade atual — feitos com acolhimento, sem substituir o pediatra.
          </p>
        </header>



        {!hasAge && (
          <form onSubmit={handleSaveAge} className="card-soft mt-8 space-y-5 p-6 sm:p-8 animate-pop">
            <div>
              <h2 className="font-display text-2xl font-semibold">Qual a idade do bebê? 💛</h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Não pedimos data de nascimento por segurança — só a idade nos ajuda a gerar o guia da fase.
              </p>
            </div>

            <div>
              <label htmlFor="age-months" className="mb-2 block text-sm font-semibold">Idade do bebê</label>
              <select
                id="age-months"
                value={formMonths}
                onChange={(e) => setFormMonths(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full rounded-2xl border border-border bg-background px-5 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-ring"
              >
                <option value="" disabled>Selecione…</option>
                <option value={0}>Menos de 1 mês</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m} {m === 1 ? "mês" : "meses"}</option>
                ))}
              </select>
            </div>

            {formMonths === 0 && (
              <div className="animate-pop">
                <label htmlFor="age-days" className="mb-2 block text-sm font-semibold">Quantos dias?</label>
                <input
                  id="age-days"
                  type="number"
                  min={1}
                  max={30}
                  value={formDays}
                  onChange={(e) => setFormDays(Number(e.target.value))}
                  className="w-full rounded-2xl border border-border bg-background px-5 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-ring"
                />
                <p className="mt-1 text-xs text-muted-foreground">Entre 1 e 30 dias.</p>
              </div>
            )}

            <div className="flex justify-end">
              <button type="submit" className="btn-primary" disabled={formMonths === ""}>
                Gerar guia
              </button>
            </div>
          </form>
        )}

        {hasAge && (
          <div className="mt-8 space-y-6">
            <div className="card-soft flex flex-wrap items-center justify-between gap-3 p-5 animate-pop">
              <div className="text-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Idade atual</div>
                <div className="font-display text-lg font-semibold">
                  {guide?.ageLabel || ageLabel(ageMonths!, ageDays)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    saveLS("babyAgeMonths", null);
                    setAgeMonths(null);
                    setGuide(null);
                    setFormMonths("");
                  }}
                  className="btn-ghost text-sm"
                >
                  Alterar idade
                </button>
                <button
                  onClick={() => {
                    setGuide(null);
                    setCachedFor("");
                    mutation.mutate({ birthDate, babyName });
                    router.invalidate();
                  }}
                  disabled={mutation.isPending}
                  className="btn-primary text-sm disabled:opacity-60"
                >
                  {mutation.isPending ? "Gerando…" : "Atualizar"}
                </button>
              </div>
            </div>

            {mutation.isPending && !guide && <LoadingGuide babyName={babyName} />}

            {mutation.isError && (
              <div className="card-soft p-6 text-sm animate-pop">
                <p className="font-semibold text-primary">Ops, não conseguimos gerar o guia agora.</p>
                <p className="mt-1 text-muted-foreground">
                  {(mutation.error as Error)?.message || "Tente novamente em alguns instantes."}
                </p>
                <button className="btn-primary mt-4 text-sm" onClick={() => mutation.mutate({ birthDate, babyName })}>
                  Tentar de novo
                </button>
              </div>
            )}

            {guide && (
              <>
                <div className="card-soft p-6 sm:p-8 animate-pop">
                  <p className="font-display text-lg leading-relaxed text-foreground">
                    {guide.intro}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ShareButton
                      title={`Guia da fase ${guide.ageLabel || ageLabel(ageMonths!, ageDays)}`}
                      text={buildFullShareText(guide, babyName)}
                    />
                    <CopyButton text={buildFullShareText(guide, babyName)} label="Copiar tudo" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {guide.topics.map((t, i) => (
                    <article
                      key={i}
                      className="card-soft flex flex-col gap-3 p-6 animate-pop transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-2xl">
                          {t.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            {t.category}
                          </div>
                          <h3 className="font-display text-xl font-semibold leading-tight">{t.title}</h3>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                      {t.tips?.length > 0 && (
                        <ul className="mt-1 space-y-1.5">
                          {t.tips.map((tip, j) => (
                            <li key={j} className="flex gap-2 text-sm">
                              <span aria-hidden className="mt-0.5 text-primary">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                        <ShareButton title={t.title} text={buildTopicShareText(t)} compact />
                        <CopyButton text={buildTopicShareText(t)} compact />
                      </div>
                    </article>
                  ))}
                </div>

                {ageMonths !== null && ageMonths >= 1 && ageMonths <= 24 && (
                  <div className="card-soft p-6 text-center animate-pop">
                    <p className="text-sm text-muted-foreground">Veja também o guia completo desta idade:</p>
                    <a
                      href={`/bebe-${ageMonths}-${ageMonths === 1 ? "mes" : "meses"}`}
                      className="btn-primary mt-3 inline-flex text-sm"
                    >
                      Guia do bebê de {ageMonths} {ageMonths === 1 ? "mês" : "meses"}
                    </a>
                  </div>
                )}

                <p className="pb-4 text-center text-xs text-muted-foreground">
                  ⚠️ Este conteúdo possui caráter educativo e não substitui orientação profissional.
                </p>
              </>

            )}

          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------
// Loading skeleton with soft breathing effect
// -----------------------------
function LoadingGuide({ babyName }: { babyName: string }) {
  const messages = [
    "Preparando dicas com carinho…",
    "Consultando o universo da maternidade…",
    "Organizando conteúdos para a fase…",
    "Quase pronto! 💛",
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 1800);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="card-soft p-6 sm:p-8 animate-pop" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--primary)_22%,transparent)] animate-ping" />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-xl">
            💛
          </span>
        </span>
        <div>
          <p className="font-display text-lg font-semibold">
            {babyName ? `Montando o guia para ${babyName}` : "Montando o guia"}
          </p>
          <p key={idx} className="text-sm text-muted-foreground animate-pop">{messages[idx]}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))] animate-pulse"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// -----------------------------
// Share & Copy helpers
// -----------------------------
function buildTopicShareText(t: MaternityGuide["topics"][number]): string {
  const tips = t.tips?.length ? "\n\n" + t.tips.map((x) => `• ${x}`).join("\n") : "";
  return `${t.title}\n\n${t.description}${tips}\n\n— Quem Vai Trocar? (trocafraldas.online)`;
}

function buildFullShareText(g: MaternityGuide, babyName: string): string {
  const head = babyName ? `Guia da fase de ${babyName} — ${g.ageLabel}` : `Guia da fase — ${g.ageLabel}`;
  const body = g.topics.map((t) => {
    const tips = t.tips?.length ? "\n" + t.tips.map((x) => `• ${x}`).join("\n") : "";
    return `▸ ${t.title}\n${t.description}${tips}`;
  }).join("\n\n");
  return `${head}\n\n${g.intro}\n\n${body}\n\n— Quem Vai Trocar? (trocafraldas.online)`;
}

function ShareButton({ title, text, compact }: { title: string; text: string; compact?: boolean }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
      if (nav.share) {
        await nav.share({ title, text });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch { /* user cancelled */ }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary " +
        (compact ? "" : "sm:text-sm")
      }
      aria-label="Compartilhar"
    >
      <span aria-hidden>{done ? "✓" : "↗"}</span>
      {done ? "Compartilhado" : "Compartilhar"}
    </button>
  );
}

function CopyButton({ text, label = "Copiar", compact }: { text: string; label?: string; compact?: boolean }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch { /* ignore */ }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary " +
        (compact ? "" : "sm:text-sm")
      }
      aria-label={label}
    >
      <span aria-hidden>{done ? "✓" : "⧉"}</span>
      {done ? "Copiado" : label}
    </button>
  );
}
