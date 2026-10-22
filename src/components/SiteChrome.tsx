import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell site-nav">
        <Link to="/" className="site-brand" aria-label="Quem Vai Trocar? página inicial">
          <span className="site-brand-mark">♡</span>
          <span>Quem Vai Trocar?<small>Maternidade sem complicação</small></span>
        </Link>
        <nav aria-label="Navegação principal" className="site-nav-links">
          <Link to="/">Início</Link>
          <a href="/#roleta">Roleta</a>
          <Link to="/blog">Blog e dicas</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/contato">Contato</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-grid">
        <div><strong>Quem Vai Trocar?</strong><p>Ferramentas leves e informação acolhedora para a rotina com bebês e crianças.</p></div>
        <div><strong>Explore</strong><Link to="/">Roleta da fralda</Link><Link to="/blog">Blog e dicas</Link><Link to="/maternidade">Universo da maternidade</Link></div>
        <div><strong>Informações</strong><Link to="/sobre">Sobre o projeto</Link><Link to="/contato">Contato</Link><Link to="/politica-de-privacidade">Privacidade</Link><Link to="/termos-de-uso">Termos de uso</Link></div>
      </div>
      <div className="site-shell site-footer-bottom">© {new Date().getFullYear()} Quem Vai Trocar? · Seus dados da roleta ficam armazenados no seu dispositivo.</div>
    </footer>
  );
}

export function AdSlot({ label = "Espaço para anúncios" }: { label?: string }) {
  return <aside className="ad-slot" aria-label={label}><span>{label}</span></aside>;
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="site-shell site-page">{children}</main>;
}

export function BlogCard({ post }: { post: { slug: string; title: string; excerpt: string; category: string; cover: string; coverAlt: string; date: string; readMinutes: number } }) {
  return (
    <article className="blog-card">
      <a href={`/blog/${post.slug}`} className="blog-card-image"><img src={post.cover} alt={post.coverAlt} loading="lazy" /></a>
      <div className="blog-card-copy">
        <span className="eyebrow">{post.category} · {post.readMinutes} min de leitura</span>
        <h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
        <p>{post.excerpt}</p>
        <a className="text-link" href={`/blog/${post.slug}`}>Ler artigo <span aria-hidden>→</span></a>
      </div>
    </article>
  );
}
