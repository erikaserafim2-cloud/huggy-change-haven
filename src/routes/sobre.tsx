import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [
    { title: "Sobre o Quem Vai Trocar? | Maternidade sem complicação" },
    { name: "description", content: "Conheça o propósito do Quem Vai Trocar?, uma ferramenta familiar acompanhada de conteúdo prático sobre cuidados infantis." },
  ]}),
  component: AboutPage,
});

function AboutPage() {
  return <PageShell><article className="prose-page"><span className="eyebrow">Nossa proposta</span><h1>Sobre o Quem Vai Trocar?</h1><p>O Quem Vai Trocar? nasceu para tornar uma tarefa cotidiana da vida com um bebê um pouco mais leve. Nossa roleta ajuda a família a combinar, de forma descontraída, quem assume a próxima troca de fralda.</p><p>Além da ferramenta, reunimos conteúdos práticos sobre rotina, cuidados com a pele e desenvolvimento infantil, com linguagem acessível para mães, pais e outros cuidadores.</p><h2>Como produzimos conteúdo</h2><p>Buscamos oferecer informação clara e útil para apoiar decisões do dia a dia. Conteúdos sobre saúde têm caráter educativo e não substituem avaliação individual de pediatras ou outros profissionais qualificados.</p><h2>Transparência</h2><p>As informações personalizadas da roleta, como nome do bebê, participantes e placar, são guardadas no armazenamento local do navegador deste dispositivo. O site também pode carregar serviços de terceiros, como ferramentas de publicidade, que possuem suas próprias políticas.</p><p>Quer falar conosco? Visite a página de <Link to="/contato" className="text-link">contato</Link> ou consulte nossa <Link to="/politica-de-privacidade" className="text-link">Política de Privacidade</Link>.</p></article></PageShell>;
}
