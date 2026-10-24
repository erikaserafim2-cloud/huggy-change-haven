import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/sobre")({
  head: () => pageHead("Sobre Nós | Troca Fraldas Online", "Conheça nosso objetivo: apoiar pais e cuidadores na divisão das trocas de fralda e compartilhar informação acolhedora sobre cuidados infantis.", "/sobre"),
  component: AboutPage,
});

function AboutPage() {
  return <PageShell><article className="prose-page">
    <span className="badge-maternal mb-2">🌸 Nossa proposta</span>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Sobre Nós</h1>
    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O Quem Vai Trocar? nasceu para tornar uma tarefa cotidiana da vida com um bebê um pouco mais leve. Nossa roleta ajuda a família a combinar, de forma descontraída, quem assume a próxima troca de fralda.
    </p>
    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Além da ferramenta, reunimos conteúdos práticos sobre rotina, cuidados com a pele e desenvolvimento infantil, com linguagem acessível para mães, pais e outros cuidadores.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Como produzimos conteúdo</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Buscamos oferecer informação clara e útil para apoiar decisões do dia a dia. Conteúdos sobre saúde têm caráter educativo e não substituem avaliação individual de pediatras ou outros profissionais qualificados.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Transparência</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      As informações personalizadas da roleta, como nome do bebê, participantes e placar, são guardadas no armazenamento local do navegador deste dispositivo. O site também pode carregar serviços de terceiros, como ferramentas de publicidade, que possuem suas próprias políticas.
    </p>
    <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Quer falar conosco? Visite a página de <Link to="/contacto" className="text-link">contato</Link> ou consulte nossa <Link to="/politica-de-privacidade" className="text-link">Política de Privacidade</Link>.
    </p>
  </article></PageShell>;
}
