import { useState, type ReactNode } from "react";
import logoAsset from "@/assets/logo.png.asset.json";
const logo = logoAsset.url;
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Menu,
  X,
  Sparkles,
  Baby,
  Ticket,
  BookOpen,
  HelpCircle,
  Mail,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Início", icon: Baby },
    { to: "/#roleta", label: "Roleta", icon: Sparkles, hash: true },
    { to: "/cha-rifa", label: "Chá-Rifa", badge: "Novo", icon: Ticket },
    { to: "/universo-da-maternidade", label: "Blog / Maternidade", icon: BookOpen },
    { to: "/maternidade", label: "Guia por idade", icon: Heart },
    { to: "/sobre", label: "Sobre", icon: HelpCircle },
    { to: "/contacto", label: "Contacto", icon: Mail },
  ];

  return (
    <header className="site-header">
      <div className="site-shell site-nav">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="site-brand group"
          aria-label="Sorteador de Fraldas — página inicial"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="site-brand-mark !rounded-full overflow-hidden !bg-transparent !shadow-none p-0 transition group-hover:scale-105">
            <img src={logo} alt="" className="h-full w-full rounded-full object-cover" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Sorteador de Fraldas
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isCurrent = !link.hash && location.pathname === link.to;
            return link.hash ? (
              <a
                key={link.to}
                href={link.to}
                className="site-nav-link text-foreground/85 hover:text-primary hover:bg-primary/10 rounded-full px-3.5 py-2 text-sm font-semibold transition"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`site-nav-link relative rounded-full px-3.5 py-2 text-sm font-semibold transition flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-primary/12 text-primary font-bold shadow-xs"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/8"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-primary">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <a
            href="/#roleta"
            className="btn-primary ml-2 py-2 px-4 text-xs font-bold shadow-sm"
          >
            <span>Girar roleta</span>
            <span>🎡</span>
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="/#roleta"
            className="btn-primary py-1.5 px-3.5 text-xs font-bold"
          >
            Roleta 🎡
          </a>
          <Button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-card text-foreground transition hover:bg-primary/10"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-primary/15 bg-card/95 backdrop-blur-xl px-4 py-5 shadow-xl animate-pop">
          <nav aria-label="Menu móvel" className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isCurrent = !link.hash && location.pathname === link.to;

              const content = (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 font-semibold">{link.label}</span>
                  {link.badge && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {link.badge}
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </>
              );

              return link.hash ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl p-2.5 text-foreground hover:bg-primary/8 transition"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl p-2.5 transition ${
                    isCurrent
                      ? "bg-primary/15 text-primary font-bold"
                      : "text-foreground hover:bg-primary/8"
                  }`}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-grid">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white text-xs">
              ♡
            </span>
            <strong>Sorteador de Fraldas</strong>
          </div>
          <p>
            Um portal acolhedor dedicado a trazer leveza, bom humor e colaboração para a rotina diária com o bebê.
            Porque dividir os cuidados é um ato de amor!
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Dados salvos apenas no seu celular</span>
          </div>
        </div>

        <div>
          <strong>Ferramentas Amorosas</strong>
          <a href="/#roleta">🎡 Roleta da Fralda</a>
          <Link to="/cha-rifa">🎟️ Criador de Chá-Rifa</Link>
          <Link to="/universo-da-maternidade">🌷 Universo da Maternidade</Link>
          <Link to="/maternidade">🌱 Desenvolvimento por idade</Link>
          <Link to="/blog">📖 Blog & Guia de Cuidados</Link>
          <Link to="/bebe-1-mes">🍼 Fases mês a mês (1 a 24)</Link>
        </div>

        <div>
          <strong>Informações & Apoio</strong>
          <nav aria-label="Páginas institucionais">
            <Link to="/sobre">Sobre Nós</Link>
            <Link to="/contacto">Contacto</Link>
            <Link to="/politica-de-privacidade">Política de Privacidade</Link>
            <Link to="/termos-de-uso">Termos de Uso</Link>
          </nav>
        </div>
      </div>

      <div className="site-shell site-footer-bottom">
        <div>
          © {new Date().getFullYear()} Sorteador de Fraldas · Feito com carinho para mamães, papais e toda a rede de apoio.
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span>Feito para a vida real</span>
          <span className="text-primary">♡</span>
          <span>Sem fins de diagnóstico médico</span>
        </div>
      </div>
    </footer>
  );
}

export function AdSlot({ label = "Espaço para anúncios" }: { label?: string }) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <span className="flex items-center gap-1.5 text-muted-foreground/80">
        <Sparkles className="h-3.5 w-3.5 text-primary/60" />
        <span>{label}</span>
      </span>
    </aside>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="site-shell site-page">{children}</main>;
}

export function BlogCard({
  post,
}: {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    cover: string;
    coverAlt: string;
    date: string;
    readMinutes: number;
  };
}) {
  return (
    <article className="blog-card group">
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="blog-card-image">
        <img src={post.cover} alt={post.coverAlt} loading="lazy" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-primary shadow-xs">
          {post.category}
        </span>
      </Link>
      <div className="blog-card-copy">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary" />
            <span>{post.readMinutes} min de leitura</span>
          </span>
        </div>
        <h2 className="group-hover:text-primary transition">
          <Link to="/blog/$slug" params={{ slug: post.slug }}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <Link className="text-link mt-auto pt-2" to="/blog/$slug" params={{ slug: post.slug }}>
          <span>Ler artigo com carinho</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
