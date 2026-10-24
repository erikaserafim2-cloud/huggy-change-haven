import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => pageHead("Política de Privacidade | Troca Fraldas Online", "Saiba como funcionam os dados locais, cookies, anúncios de terceiros e opções de privacidade no Troca Fraldas Online.", "/politica-de-privacidade"),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <PageShell><article className="prose-page">
    <span className="badge-maternal mb-2">🔐 Transparência</span>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Política de Privacidade</h1>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
      <strong>Última atualização: 24 de outubro de 2026.</strong>
    </p>
    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Esta política explica, de forma geral, como funciona o site Quem Vai Trocar? e quais cuidados recomendamos ao utilizá-lo.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Dados usados pela roleta</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O nome do bebê, a opção de personalização, os participantes, o placar e as preferências de idade ficam exclusivamente no localStorage do navegador deste dispositivo. A roleta não envia esses dados ao servidor. Eles não são sincronizados entre dispositivos e podem ser apagados ao limpar os dados do site.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Cookies, anúncios e terceiros</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O site pode carregar serviços de terceiros, incluindo o Google AdSense para exibição de anúncios. Esses serviços podem usar cookies, identificadores ou tecnologias semelhantes conforme suas próprias políticas e configurações. O Google pode usar cookies para apresentar anúncios com base em visitas anteriores a este e a outros sites. Você pode gerenciar a personalização em adssettings.google.com. A política do Google sobre sites parceiros está disponível em policies.google.com/technologies/partner-sites. A disponibilidade de anúncios e as tecnologias utilizadas podem variar.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Guia por idade e geração de conteúdo</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">Ao solicitar um guia personalizado, uma idade aproximada é enviada ao serviço de geração de conteúdo Groq. O nome salvo do bebê não é enviado nessa solicitação. A idade informada não é uma data de nascimento real. O resultado é guardado localmente para evitar novas consultas desnecessárias. Os artigos do blog podem ser lidos sem informar idade ou nome.</p>
    <p><a className="text-link" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Privacidade dos serviços Google</a> · <a className="text-link" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Preferências de anúncios</a> · <Link to="/contacto" className="text-link">Contacto</Link></p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Formulários e contato</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      O formulário prepara uma mensagem para pamelacrisribeiro71@gmail.com no aplicativo de e-mail do seu dispositivo. O envio só acontece quando você o confirma nesse aplicativo. O site não recebe nem armazena o nome, o e-mail ou a mensagem do formulário. Após o envio, o provedor de e-mail trata a mensagem conforme sua política. Envie apenas o necessário para responder à sua solicitação e não inclua dados sensíveis de crianças.
    </p>
    <h2 className="mt-6 font-display text-2xl font-bold text-foreground">Seus controles</h2>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
      Você pode limpar o armazenamento local e os cookies nas configurações do navegador. Isso pode remover preferências salvas e afetar funcionalidades. Para dúvidas ou solicitações sobre mensagens enviadas, use a página de contacto ou escreva para pamelacrisribeiro71@gmail.com.
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
