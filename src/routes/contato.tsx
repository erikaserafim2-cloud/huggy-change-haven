import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/ContactPage";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/contato")({
  head: () => pageHead("Contato | Troca Fraldas Online", "Fale com a equipe do Troca Fraldas Online para sugestões e dúvidas.", "/contato"),
  component: ContactPage,
});

