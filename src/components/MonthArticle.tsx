import { Link } from "@tanstack/react-router";
import type { MonthContent } from "@/lib/baby-months-data";
import { SITE_URL } from "@/lib/baby-months-data";
import logoAsset from "@/assets/logo.png.asset.json";

type Props = { content: MonthContent };

export function MonthArticle({ content: c }: Props) {
  const url = `${SITE_URL}/${c.slug}`;

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:py-12">
        <div className="relative flex items-center justify-center">
          <Link to="/" className="btn-ghost absolute left-0 inline-flex items-center gap-2 text-sm">
            <span aria-hidden>←</span> Início
          </Link>
          <Link
            to="/"
            aria-label="Voltar para a tela inicial"
            className="flex items-center justify-center rounded-full p-1 transition hover:bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]"
          >
            <span className="flex h-24 w-24 overflow-hidden rounded-full bg-card ring-4 ring-[color-mix(in_oklab,var(--primary)_20%,transparent)] shadow-[var(--shadow-soft)] sm:h-28 sm:w-28">
              <img src={logoAsset.url} alt="Quem vai trocar?" className="h-full w-full object-cover scale-110" />
            </span>
          </Link>
        </div>

        <header className="mt-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Guia da fase</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{c.title}</h1>
          <p className="mt-4 text-muted-foreground">{c.intro}</p>
        </header>

        <article className="mt-10 space-y-8">
          <Section section={c.development} />
          <Section section={c.skills} />
          <Section section={c.play} />
          <Section section={c.routine} />
          <Section section={c.sleep} />
          <Section section={c.feeding} />

          <section className="card-soft p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Dúvidas comuns dos pais</h2>
            <div className="mt-4 space-y-4">
              {c.faq.map((f, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="card-soft p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Quer um guia personalizado com dicas do dia a dia?
            </p>
            <Link to="/maternidade" className="btn-primary mt-3 inline-flex text-sm">
              Abrir o Universo da Maternidade
            </Link>
          </div>

          <nav aria-label="Outros meses" className="card-soft p-6">
            <h2 className="font-display text-xl font-semibold">Explore outras idades</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {Array.from({ length: 24 }, (_, i) => i + 1).map((m) => {
                const slug = `bebe-${m}-${m === 1 ? "mes" : "meses"}`;
                const isCurrent = m === c.month;
                return (
                  <li key={m}>
                    <a
                      href={`/${slug}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={
                        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold transition " +
                        (isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary")
                      }
                    >
                      {m} {m === 1 ? "mês" : "meses"}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className="pb-6 text-center text-xs text-muted-foreground">
            ✨ Conteúdo educativo e geral. Não substitui a orientação do pediatra.
          </p>
        </article>
      </div>

      <JsonLd content={c} url={url} />
    </div>
  );
}

function Section({ section }: { section: MonthContent["development"] }) {
  return (
    <section className="card-soft p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span aria-hidden className="mt-0.5 text-primary">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function JsonLd({ content: c, url }: { content: MonthContent; url: string }) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.metaTitle,
    description: c.metaDescription,
    inLanguage: "pt-BR",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "Quem Vai Trocar?" },
    publisher: { "@type": "Organization", name: "Quem Vai Trocar?" },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}

export function monthHead(c: MonthContent) {
  const url = `${SITE_URL}/${c.slug}`;
  return {
    meta: [
      { title: c.metaTitle },
      { name: "description", content: c.metaDescription },
      { property: "og:title", content: c.metaTitle },
      { property: "og:description", content: c.metaDescription },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.metaTitle },
      { name: "twitter:description", content: c.metaDescription },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
