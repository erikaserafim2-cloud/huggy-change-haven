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
  return <PageShell><article className="prose-page">
    <span className="badge-maternal mb-2">📄 Uso responsável</span>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Termos de Uso</h1>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
      <strong>Última atualização: 22 de outubro de 2026.</strong>
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Sobre o serviço</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O Quem Vai Trocar? oferece uma roleta recreativa para ajudar famílias a combinar quem fará a próxima troca de fralda, além de artigos informativos sobre rotina e cuidados infantis.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Uso da roleta</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O resultado é aleatório e serve apenas como apoio lúdico. A ferramenta não substitui acordos entre cuidadores nem deve ser usada para decidir situações que exijam atenção imediata à segurança ou ao bem-estar da criança.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Conteúdo informativo</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Os artigos têm finalidade educativa e geral. Não constituem aconselhamento médico, diagnóstico ou tratamento. Procure um profissional de saúde para dúvidas específicas e atendimento de urgência quando necessário.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Disponibilidade e dados</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Podemos atualizar, corrigir ou retirar funcionalidades e conteúdos. As preferências da roleta ficam no armazenamento local do navegador e podem ser apagadas ao limpar os dados do site.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Publicidade e links externos</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O site pode exibir publicidade ou incluir links para serviços de terceiros. Esses serviços são regidos por seus próprios termos e políticas. A presença de um anúncio não representa, por si só, recomendação profissional.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Contato</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Para dúvidas sobre estes termos, consulte a página de contato após a configuração do canal de atendimento.
    </p>
  </article></PageShell>;
}
