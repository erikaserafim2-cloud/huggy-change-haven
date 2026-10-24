import { createFileRoute } from "@tanstack/react-router";
import { MaternityBlog } from "@/components/MaternityBlog";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/universo-da-maternidade")({
  head: () => pageHead("Universo da Maternidade | Troca Fraldas Online", "Artigos sobre assaduras, vazamentos, rotina de trocas e desfralde, com informação prática e acolhedora para pais e cuidadores.", "/universo-da-maternidade"),
  component: MaternityBlog,
});