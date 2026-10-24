import { useState } from "react";
import { Mail } from "lucide-react";
import { PageShell } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, contactSchema, contactMailto } from "@/lib/contact";

export function ContactPage() {
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState(false);
  return <PageShell><section className="prose-page">
    <span className="badge-maternal mb-2">📧 Estamos por aqui</span>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Contacto</h1>
    <p className="mt-3">Sua sugestão, dúvida ou relato de um problema ajuda a cuidar deste espaço.</p>
    <p className="mt-2">E-mail: <a className="text-link break-all" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
    <form className="contact-form" onSubmit={event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const result = contactSchema.safeParse(Object.fromEntries(form));
      if (!result.success) { setError(result.error.issues[0]?.message ?? "Confira os campos."); return; }
      setError("");
      window.location.href = contactMailto(result.data);
      setPrepared(true);
    }}>
      <label htmlFor="contact-name">Nome</label>
      <input id="contact-name" name="name" autoComplete="name" required maxLength={100} />
      <label htmlFor="contact-email">E-mail</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={255} />
      <label htmlFor="contact-message">Mensagem</label>
      <textarea id="contact-message" name="message" required maxLength={1000} rows={6} />
      {error && <p role="alert">{error}</p>}
      <Button className="btn-primary h-auto whitespace-normal" type="submit"><Mail />Preparar e-mail</Button>
      <p className="form-note">O formulário abre seu aplicativo de e-mail com a mensagem preenchida. Confirme o envio no aplicativo; o site não envia nem armazena a mensagem.</p>
      {prepared && <p role="status" className="form-note">Mensagem preparada. Se o aplicativo não abriu, envie diretamente ao e-mail acima.</p>}
    </form>
  </section></PageShell>;
}