import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({ meta: [
    { title: "Política de Privacidade | Quem Vai Trocar?" },
    { name: "description", content: "Entenda como o Quem Vai Trocar? trata dados locais, cookies e serviços de terceiros." },
  ]}),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <PageShell><article className="prose-page">
    <span className="badge-maternal mb-2">🔐 Transparência</span>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Política de Privacidade</h1>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
      <strong>Última atualização: 22 de outubro de 2026.</strong>
    </p>
    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Esta política explica, de forma geral, como funciona o site Quem Vai Trocar? e quais cuidados recomendamos ao utilizá-lo.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Dados usados pela roleta</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O nome do bebê, a opção de personalização, os participantes e o placar da roleta são armazenados no localStorage do navegador para que a configuração continue disponível no mesmo dispositivo. Esses dados não são enviados ao servidor pela funcionalidade da roleta. Limpar os dados do site no navegador pode apagá-los.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Cookies, anúncios e terceiros</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O site pode carregar serviços de terceiros, incluindo o Google AdSense para exibição de anúncios. Esses serviços podem usar cookies, identificadores ou tecnologias semelhantes conforme suas próprias políticas e configurações. Consulte a documentação e as opções de privacidade do Google para entender e gerenciar esse tratamento. A disponibilidade de anúncios e as tecnologias utilizadas podem variar.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Formulários e contato</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Não envie informações sensíveis pelo site. Antes de disponibilizar um formulário de contato funcional, o responsável pelo site deve informar o canal de recebimento e como as mensagens serão armazenadas e protegidas.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Seus controles</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Você pode limpar o armazenamento local e os cookies nas configurações do navegador. Isso pode remover preferências salvas e afetar funcionalidades. Para dúvidas sobre esta política, use a página de contato quando o canal de atendimento estiver configurado.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Atualizações</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Esta política pode ser atualizada quando funcionalidades ou serviços mudarem. A data no início da página indica a revisão mais recente.
    </p>
    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Esta página é uma descrição geral do funcionamento atual e deve ser revisada pelo responsável pelo site para refletir todos os fornecedores e configurações efetivamente utilizados.
    </p>
  </article></PageShell>;
}
