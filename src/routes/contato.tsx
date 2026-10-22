import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [
    { title: "Contato | Quem Vai Trocar?" },
    { name: "description", content: "Entre em contato com a equipe do Quem Vai Trocar?." },
  ]}),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return <PageShell><section className="prose-page">
    <span className="badge-maternal mb-2">📧 Estamos por aqui</span>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl text-foreground">Contato</h1>
    <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
      Tem uma sugestão, encontrou um erro ou quer conversar sobre o projeto? Use o formulário abaixo.
    </p>
    <form className="contact-form mt-6" onSubmit={event => { event.preventDefault(); window.location.href = "mailto:?subject=" + encodeURIComponent("Contato pelo Quem Vai Trocar?") + "&body=" + encodeURIComponent("Nome: " + name + "\nE-mail: " + email + "\n\nMensagem:\n" + message); }}>
      <label htmlFor="contact-name">Nome</label>
      <input id="contact-name" name="name" autoComplete="name" required value={name} onChange={event => setName(event.target.value)} />
      <label htmlFor="contact-email">E-mail</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
      <label htmlFor="contact-message">Mensagem</label>
      <textarea id="contact-message" name="message" required rows={6} value={message} onChange={event => setMessage(event.target.value)} />
      <button className="btn-primary" type="submit">Preparar mensagem</button>
      <p className="form-note">Ao clicar, o site tenta abrir o aplicativo de e-mail configurado no seu dispositivo. O destinatário ainda precisa ser configurado pelo responsável pelo site; sem isso, a mensagem não será enviada automaticamente.</p>
    </form>
  </section></PageShell>;
}
