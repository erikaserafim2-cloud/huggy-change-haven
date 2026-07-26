import { createFileRoute } from "@tanstack/react-router";
import { getMonthContent } from "@/lib/baby-months-data";
import { MonthArticle, monthHead } from "@/components/MonthArticle";

const content = getMonthContent(4)!;

export const Route = createFileRoute("/bebe-4-meses")({
  head: () => monthHead(content),
  component: () => <MonthArticle content={content} />,
});
