import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import logoAsset from "@/assets/logo.png.asset.json";
import { AdBanner } from "@/components/AdBanner";

const NAV = [
  { to: "/", label: "Home", hash: undefined },
  { to: "/", label: "Roleta", hash: "roleta" },
  { to: "/blog", label: "Blog / Dicas", hash: undefined },
  { to: "/sobre", label: "Sobre", hash: undefined },
  { to: "/contato", label: "Contato", hash: undefined },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const linkCls =
    "rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-secondary hover:text-foreground";
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Quem Vai Trocar? — página inicial">
          <img src={logoAsset.url} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-lg font-semibold text-foreground">Quem Vai Trocar?</span>
        </Link>
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link
                  to={n.to}
                  hash={n.hash}
                  className={linkCls}
                  activeOptions={{ exact: n.to === "/", includeHash: true }}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="rounded-full p-2 text-foreground md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </div>
      {open && (
        <nav aria-label="Navegação móvel" className="border-t border-border/60 md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link to={n.to} hash={n.hash} className={`${linkCls} block`} onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const colTitle = "mb-3 text-xs font-bold uppercase tracking-wider text-primary";
  const a = "text-sm text-foreground/75 transition hover:text-foreground";
  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <AdBanner slot="horizontal" label="Espaço para anúncios" />
      </div>
      <footer className="border-t border-border/60 bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logoAsset.url} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              <span className="font-display text-lg font-semibold">Quem Vai Trocar?</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Ferramentas e conteúdos acolhedores para mães, pais e cuidadores.
            </p>
          </div>
          <div>
            <h2 className={colTitle}>Ferramentas</h2>
            <ul className="space-y-2">
              <li><Link to="/" hash="roleta" className={a}>Roleta da fralda</Link></li>
              <li><Link to="/cha-rifa" className={a}>Criador de Chá-Rifa</Link></li>
              <li><Link to="/maternidade" className={a}>Universo da Maternidade</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={colTitle}>Blog</h2>
            <ul className="space-y-2">
              <li><Link to="/blog" className={a}>Todos os artigos</Link></li>
              <li><Link to="/blog" search={{ categoria: "Rotina" }} className={a}>Rotina</Link></li>
              <li><Link to="/blog" search={{ categoria: "Cuidados" }} className={a}>Cuidados</Link></li>
              <li><Link to="/blog" search={{ categoria: "Desenvolvimento" }} className={a}>Desenvolvimento</Link></li>
              <li><Link to="/bebe-1-mes" className={a}>Bebê mês a mês</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={colTitle}>Institucional</h2>
            <ul className="space-y-2">
              <li><Link to="/sobre" className={a}>Sobre</Link></li>
              <li><Link to="/contato" className={a}>Contato</Link></li>
              <li><Link to="/politica-de-privacidade" className={a}>Política de Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className={a}>Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60">
          <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground">
            © {year} Quem Vai Trocar? · Os dados da roleta ficam salvos somente no seu dispositivo.
          </p>
        </div>
      </footer>
    </>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">{children}</main>;
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 text-[17px] leading-relaxed text-foreground/85 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_a]:font-semibold [&_a]:text-primary [&_a]:underline">
      {children}
    </div>
  );
}

export function RouletteCta() {
  return (
    <aside className="my-8 flex flex-col items-start gap-3 rounded-3xl border border-border/70 bg-secondary/60 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-display text-xl font-semibold text-foreground">Não sabe quem troca agora?</p>
        <p className="text-sm text-foreground/75">Use nossa roleta e divida as trocas com leveza.</p>
      </div>
      <Link
        to="/"
        hash="roleta"
        className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
      >
        Girar a roleta 🎡
      </Link>
    </aside>
  );
}
