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
  return <PageShell><article className="prose-page"><span className="eyebrow">Transparência</span><h1>Política de Privacidade</h1><p><strong>Última atualização: 22 de outubro de 2026.</strong></p><p>Esta política explica, de forma geral, como funciona o site Quem Vai Trocar? e quais cuidados recomendamos ao utilizá-lo.</p><h2>Dados usados pela roleta</h2><p>O nome do bebê, a opção de personalização, os participantes e o placar da roleta são armazenados no localStorage do navegador para que a configuração continue disponível no mesmo dispositivo. Esses dados não são enviados ao servidor pela funcionalidade da roleta. Limpar os dados do site no navegador pode apagá-los.</p><h2>Cookies, anúncios e terceiros</h2><p>O site pode carregar serviços de terceiros, incluindo o Google AdSense para exibição de anúncios. Esses serviços podem usar cookies, identificadores ou tecnologias semelhantes conforme suas próprias políticas e configurações. Consulte a documentação e as opções de privacidade do Google para entender e gerenciar esse tratamento. A disponibilidade de anúncios e as tecnologias utilizadas podem variar.</p><h2>Formulários e contato</h2><p>Não envie informações sensíveis pelo site. Antes de disponibilizar um formulário de contato funcional, o responsável pelo site deve informar o canal de recebimento e como as mensagens serão armazenadas e protegidas.</p><h2>Seus controles</h2><p>Você pode limpar o armazenamento local e os cookies nas configurações do navegador. Isso pode remover preferências salvas e afetar funcionalidades. Para dúvidas sobre esta política, use a página de contato quando o canal de atendimento estiver configurado.</p><h2>Atualizações</h2><p>Esta política pode ser atualizada quando funcionalidades ou serviços mudarem. A data no início da página indica a revisão mais recente.</p><p>Esta página é uma descrição geral do funcionamento atual e deve ser revisada pelo responsável pelo site para refletir todos os fornecedores e configurações efetivamente utilizados.</p></article></PageShell>;
}
