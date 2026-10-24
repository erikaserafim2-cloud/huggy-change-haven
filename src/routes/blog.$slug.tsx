import { createFileRoute, Link } from "@tanstack/react-router";
import { getPost, formatDate } from "@/lib/blog-posts";
import { AdSlot, PageShell } from "@/components/SiteChrome";
import { pageHead } from "@/lib/page-head";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getPost(params.slug);
    const head = pageHead(post ? post.title + " | Troca Fraldas Online" : "Artigo não encontrado | Troca Fraldas Online", post?.excerpt ?? "Leia dicas sobre cuidados infantis.", `/blog/${params.slug}`, "article");
    return { ...head, meta: [...head.meta, ...(!post ? [{ name: "robots", content: "noindex" }] : [])] };
  },
  component: BlogArticle,
});

function BlogArticle() {
  const { slug } = Route.useParams();
  const post = getPost(slug);
  if (!post) return <PageShell><h1>Artigo não encontrado</h1><p>Este conteúdo pode ter sido movido.</p><Link to="/blog" className="btn-primary inline-block">Voltar ao blog</Link></PageShell>;
  return <PageShell>
    <article className="article-layout">
      <Link to="/universo-da-maternidade" className="text-link">← Universo da Maternidade</Link>
      <header className="article-header">
        <span className="badge-maternal mb-2">{post.category} · {post.readMinutes} min de leitura</span>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">{post.title}</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{post.excerpt}</p>
        <p className="mt-2 text-xs text-muted-foreground">Publicado em {formatDate(post.date)}</p>
      </header>
      <img className="article-cover" src={post.cover} alt={post.coverAlt} />
      <AdSlot label="Espaço para anúncios" />
      <div className="article-body">{post.body.map((block, index) => {
        if (block.type === "p") return <p key={index}>{block.text}</p>;
        if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
        if (block.type === "ul") return <ul key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
        if (block.type === "tip") return <aside key={index} className="article-tip"><strong>Uma dica importante</strong><p>{block.text}</p></aside>;
        if (block.type === "ad") return <AdSlot key={index} />;
        return <aside key={index} className="article-cta"><h2>Experimente a Roleta da Fralda</h2><p>Uma brincadeira para dividir a próxima troca entre os cuidadores disponíveis, sem adiar o cuidado com o bebê.</p><Button asChild className="btn-primary h-auto whitespace-normal"><Link to="/" hash="roleta">Experimentar a roleta</Link></Button></aside>;
      })}</div>
      <AdSlot />
      <p className="article-disclaimer">Conteúdo educativo e geral. Não substitui avaliação, diagnóstico ou orientação individual de profissionais de saúde.</p>
    </article>
  </PageShell>;
}
