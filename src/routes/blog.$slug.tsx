import { createFileRoute, Link } from "@tanstack/react-router";
import { getPost, formatDate } from "@/lib/blog-posts";
import { AdSlot, PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = getPost(params.slug);
    return { meta: [
      { title: post ? post.title + " | Quem Vai Trocar?" : "Artigo não encontrado | Quem Vai Trocar?" },
      { name: "description", content: post?.excerpt ?? "Leia dicas sobre maternidade, cuidados e desenvolvimento infantil." },
      ...(post ? [{ property: "og:image", content: post.cover }] : []),
    ]};
  },
  component: BlogArticle,
});

function BlogArticle() {
  const { slug } = Route.useParams();
  const post = getPost(slug);
  if (!post) return <PageShell><h1>Artigo não encontrado</h1><p>Este conteúdo pode ter sido movido.</p><Link to="/blog" className="btn-primary inline-block">Voltar ao blog</Link></PageShell>;
  return <PageShell>
    <article className="article-layout">
      <Link to="/blog" className="text-link">← Voltar ao blog</Link>
      <header className="article-header"><span className="eyebrow">{post.category} · {post.readMinutes} min de leitura</span><h1>{post.title}</h1><p className="article-excerpt">{post.excerpt}</p><p className="article-date">Publicado em {formatDate(post.date)}</p></header>
      <img className="article-cover" src={post.cover} alt={post.coverAlt} />
      <AdSlot label="Espaço para anúncios" />
      <div className="article-body">{post.body.map((block, index) => {
        if (block.type === "p") return <p key={index}>{block.text}</p>;
        if (block.type === "h2") return <h2 key={index}>{block.text}</h2>;
        if (block.type === "h3") return <h3 key={index}>{block.text}</h3>;
        if (block.type === "ul") return <ul key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
        if (block.type === "tip") return <aside key={index} className="article-tip"><strong>Uma dica importante</strong><p>{block.text}</p></aside>;
        if (block.type === "ad") return <AdSlot key={index} />;
        return <aside key={index} className="article-cta"><h2>Dividir os cuidados pode ser mais leve</h2><p>Use a roleta para decidir, de um jeito descontraído, quem fica com a próxima troca.</p><a href="/#roleta" className="btn-primary inline-block">Experimentar a roleta</a></aside>;
      })}</div>
      <AdSlot />
      <p className="article-disclaimer">Conteúdo educativo e geral. Não substitui avaliação, diagnóstico ou orientação individual de profissionais de saúde.</p>
    </article>
  </PageShell>;
}
