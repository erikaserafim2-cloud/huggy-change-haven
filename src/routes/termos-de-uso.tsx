import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({ meta: [
    { title: "Termos de Uso | Quem Vai Trocar?" },
    { name: "description", content: "Condições para usar a roleta e os conteúdos do Quem Vai Trocar?." },
  ]}),
  component: TermsPage,
});

function TermsPage() {
  return <PageShell><article className="prose-page"><span className="eyebrow">Uso responsável</span><h1>Termos de Uso</h1><p><strong>Última atualização: 22 de outubro de 2026.</strong></p><h2>Sobre o serviço</h2><p>O Quem Vai Trocar? oferece uma roleta recreativa para ajudar famílias a combinar quem fará a próxima troca de fralda, além de artigos informativos sobre rotina e cuidados infantis.</p><h2>Uso da roleta</h2><p>O resultado é aleatório e serve apenas como apoio lúdico. A ferramenta não substitui acordos entre cuidadores nem deve ser usada para decidir situações que exijam atenção imediata à segurança ou ao bem-estar da criança.</p><h2>Conteúdo informativo</h2><p>Os artigos têm finalidade educativa e geral. Não constituem aconselhamento médico, diagnóstico ou tratamento. Procure um profissional de saúde para dúvidas específicas e atendimento de urgência quando necessário.</p><h2>Disponibilidade e dados</h2><p>Podemos atualizar, corrigir ou retirar funcionalidades e conteúdos. As preferências da roleta ficam no armazenamento local do navegador e podem ser apagadas ao limpar os dados do site.</p><h2>Publicidade e links externos</h2><p>O site pode exibir publicidade ou incluir links para serviços de terceiros. Esses serviços são regidos por seus próprios termos e políticas. A presença de um anúncio não representa, por si só, recomendação profissional.</p><h2>Contato</h2><p>Para dúvidas sobre estes termos, consulte a página de contato após a configuração do canal de atendimento.</p></article></PageShell>;
}
