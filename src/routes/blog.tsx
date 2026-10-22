import { createFileRoute } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { AdSlot, BlogCard, PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [
    { title: "Blog e dicas para a rotina com bebês | Quem Vai Trocar?" },
    { name: "description", content: "Orientações práticas sobre trocas de fralda, cuidados com a pele, rotina e desenvolvimento infantil." },
  ]}),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return <PageShell>
    <header className="page-intro">
      <span className="badge-maternal mb-2">📖 Conteúdo para a vida real</span>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">
        Blog e dicas para a rotina com bebês
      </h1>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
        Informação prática e acolhedora para ajudar a família nos cuidados do dia a dia. Cada criança é única; em caso de dúvidas de saúde, converse com o pediatra.
      </p>
    </header>
    <AdSlot />
    <section className="blog-grid" aria-label="Artigos publicados">{posts.map(post => <BlogCard key={post.slug} post={post} />)}</section>
  </PageShell>;
}
