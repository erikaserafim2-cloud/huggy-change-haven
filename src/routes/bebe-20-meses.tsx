import { createFileRoute } from "@tanstack/react-router";
import { getMonthContent } from "@/lib/baby-months-data";
import { MonthArticle, monthHead } from "@/components/MonthArticle";

const content = getMonthContent(20)!;

export const Route = createFileRoute("/bebe-20-meses")({
  head: () => monthHead(content),
  component: () => <MonthArticle content={content} />,
});
