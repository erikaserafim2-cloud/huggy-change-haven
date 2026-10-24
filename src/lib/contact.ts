import { z } from "zod";

export const CONTACT_EMAIL = "pamelacrisribeiro71@gmail.com";
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome.").max(100),
  email: z.string().trim().email("Informe um e-mail válido.").max(255),
  message: z.string().trim().min(1, "Escreva sua mensagem.").max(1000),
});

export function contactMailto(input: unknown) {
  const data = contactSchema.parse(input);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contato — Troca Fraldas Online")}&body=${encodeURIComponent(`Nome: ${data.name}\nE-mail: ${data.email}\n\n${data.message}`)}`;
}