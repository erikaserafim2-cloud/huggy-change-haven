import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getMaternityGuide, type MaternityGuide } from "../lib/maternity.functions";

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

function MaternityPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [babyName, setBabyName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [guide, setGuide] = useState<MaternityGuide | null>(null);
  const [cachedFor, setCachedFor] = useState<string>("");

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
    const name = loadLS("babyName", "");
    const bd = loadLS("babyBirthDate", "");
    setBabyName(name);
    setBirthDate(bd);
    const cached = loadLS<{ key: string; data: MaternityGuide } | null>("maternity_guide", null);
    if (cached && bd) {
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
    if (!birthDate) return;
    const todayKey = `${birthDate}|${new Date().toDateString()}`;
    if (cachedFor === todayKey) return;
    if (mutation.isPending) return;
    mutation.mutate({ birthDate, babyName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, birthDate]);

  const handleSaveDate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const bd = String(form.get("birthDate") || "");
    const bn = String(form.get("babyName") || "");
    if (!bd) return;
    saveLS("babyBirthDate", bd);
    saveLS("babyName", bn);
    setBirthDate(bd);
    setBabyName(bn);
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="btn-ghost inline-flex items-center gap-2 text-sm">
            <span aria-hidden>←</span> Roleta
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

        {!birthDate && (
          <form onSubmit={handleSaveDate} className="card-soft mt-8 space-y-5 p-6 sm:p-8 animate-pop">
            <div>
              <h2 className="font-display text-2xl font-semibold">Vamos começar 💛</h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Informe a data de nascimento do bebê para gerar um guia da fase.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Nome do bebê (opcional)</label>
              <input
                name="babyName"
                defaultValue={babyName}
                placeholder="Ex: Lucas"
                maxLength={20}
                className="w-full rounded-2xl border border-border bg-background px-5 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Data de nascimento</label>
              <input
                type="date"
                name="birthDate"
                required
                max={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-2xl border border-border bg-background px-5 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-ring"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Gerar guia</button>
            </div>
          </form>
        )}

        {birthDate && (
          <div className="mt-8 space-y-6">
            <div className="card-soft flex flex-wrap items-center justify-between gap-3 p-5 animate-pop">
              <div className="text-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Idade atual</div>
                <div className="font-display text-lg font-semibold">
                  {guide?.ageLabel || "Calculando…"}
                </div>
                <div className="text-xs text-muted-foreground">Nascimento: {new Date(birthDate).toLocaleDateString("pt-BR")}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    saveLS("babyBirthDate", "");
                    setBirthDate("");
                    setGuide(null);
                  }}
                  className="btn-ghost text-sm"
                >
                  Alterar data
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
