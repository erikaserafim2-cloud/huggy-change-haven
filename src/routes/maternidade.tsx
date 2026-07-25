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
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="btn-ghost inline-flex items-center gap-2 text-sm">
            <span aria-hidden>←</span> Roleta
          </Link>
          <Link
            to="/"
            aria-label="Voltar para a tela inicial"
            className="flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]"
          >
            <span className="flex h-16 w-16 overflow-hidden rounded-full bg-card ring-2 ring-[color-mix(in_oklab,var(--primary)_20%,transparent)] sm:h-20 sm:w-20">
              <img src={logoAsset.url} alt="Quem vai trocar?" className="h-full w-full object-cover scale-110" />
            </span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Universo da Maternidade
          </span>
        </div>

        <header className="mt-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-3xl animate-bounce-soft">
            🌷
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            {babyName ? <>Guia da fase de <span className="text-primary">{babyName}</span></> : "Guia da fase do bebê"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tópicos personalizados para a idade atual — feitos com carinho, sem substituir o pediatra.
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

            {mutation.isPending && !guide && (
              <div className="card-soft grid gap-4 p-6 animate-pulse">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-5/6 rounded bg-muted" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className="h-32 rounded-2xl bg-muted" />
                  ))}
                </div>
              </div>
            )}

            {mutation.isError && (
              <div className="card-soft p-6 text-sm">
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {guide.topics.map((t, i) => (
                    <article
                      key={i}
                      className="card-soft flex flex-col gap-3 p-6 animate-pop"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-2xl">
                          {t.emoji}
                        </div>
                        <div>
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
                    </article>
                  ))}
                </div>

                <p className="pb-4 text-center text-xs text-muted-foreground">
                  ✨ Este guia é informativo e feito com carinho. Sempre consulte o pediatra para orientações específicas.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
