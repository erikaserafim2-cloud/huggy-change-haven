import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/ContactPage";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/contacto")({
  head: () => pageHead("Contacto | Troca Fraldas Online", "Envie sugestões, dúvidas e feedback para o Troca Fraldas Online pelo nosso formulário de contacto.", "/contacto"),
  component: ContactPage,
});