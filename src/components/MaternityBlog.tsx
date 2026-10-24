import { Link } from "@tanstack/react-router";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { BlogCard, PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Baby, ArrowRight } from "lucide-react";

export function MaternityBlog() {
  return <PageShell>
    <header className="page-intro">
      <span className="badge-maternal mb-2">🌷 Informação e acolhimento</span>
      <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Universo da Maternidade</h1>
      <p className="mt-3 text-muted-foreground">Cuidados com a pele, trocas mais tranquilas e os primeiros passos do desfralde. Leituras para acompanhar a rotina de quem cuida.</p>
    </header>
    <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
      <Button asChild variant="outline" className="h-auto whitespace-normal py-3"><Link to="/maternidade"><Baby />Acompanhe o desenvolvimento dessa idade<ArrowRight /></Link></Button>
    </div>
    <section className="blog-grid" aria-label="Artigos sobre cuidados com o bebê">
      {BLOG_POSTS.map(post => <BlogCard key={post.slug} post={post} />)}
    </section>
    <p className="article-disclaimer mt-8">Este conteúdo possui caráter educativo e não substitui orientação profissional.</p>
  </PageShell>;
}