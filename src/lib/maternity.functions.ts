import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  birthDate: z.string().min(4), // ISO yyyy-mm-dd (derivada da idade em meses)
  babyName: z.string().optional().default(""),
  extraInfo: z.string().optional().default(""),
});

export type MaternityTopic = {
  title: string;
  category: string;
  emoji: string;
  description: string;
  tips: string[];
};

export type MaternityGuide = {
  ageLabel: string;
  intro: string;
  topics: MaternityTopic[];
};

// Categorias fixas exigidas pelo produto
const CATEGORIES = [
  { key: "desenvolvimento", label: "Desenvolvimento do bebê", emoji: "🌱" },
  { key: "brincadeiras", label: "Brincadeiras para a idade", emoji: "🧸" },
  { key: "sono", label: "Sono", emoji: "🌙" },
  { key: "alimentacao", label: "Alimentação", emoji: "🍼" },
  { key: "cuidados", label: "Cuidados e rotina", emoji: "🛁" },
  { key: "pais", label: "Dicas para os pais", emoji: "💛" },
] as const;

function computeAge(birthDate: string) {
  const b = new Date(birthDate);
  const now = new Date();
  const days = Math.max(0, Math.floor((now.getTime() - b.getTime()) / 86400000));
  const months = Math.floor(days / 30.4375);
  const years = Math.floor(months / 12);
  let label: string;
  if (days < 30) label = `${days} dia(s)`;
  else if (months < 24) label = `${months} mês(es)`;
  else label = `${years} ano(s) e ${months % 12} mês(es)`;
  return { days, months, years, label };
}

const SYSTEM_PROMPT =
  "Você é uma assistente virtual de maternidade. Forneça informações educativas e gerais. Não faça diagnósticos médicos. Não substitua acompanhamento profissional. Escreva em português brasileiro, com tom acolhedor, humano e sem julgamentos.";

export const getMaternityGuide = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<MaternityGuide> => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing GROQ_API_KEY");

    const age = computeAge(data.birthDate);
    const babyName = data.babyName?.trim() || "o bebê";
    const extra = data.extraInfo?.trim();

    const categoriesList = CATEGORIES.map((c) => `- ${c.key}: ${c.label}`).join("\n");

    const userPrompt = `Gere um guia curto e personalizado para uma mãe/pai cujo bebê (${babyName}) tem ${age.label} (${age.days} dias / ${age.months} meses).${extra ? `\n\nInformações extras fornecidas pelo usuário: ${extra}` : ""}

Retorne EXATAMENTE 6 tópicos, um para cada categoria abaixo, NESTA ORDEM e usando a "category" exata da lista:
${categoriesList}

Se a categoria "alimentacao" ainda não for aplicável (ex: recém-nascido em amamentação exclusiva), inclua mesmo assim com orientações gerais adequadas (ex: livre demanda, sinais de fome).

Cada tópico deve ter:
- title: título curto e caloroso, específico para a idade
- category: exatamente o valor da lista (desenvolvimento, brincadeiras, sono, alimentacao, cuidados, pais)
- emoji: 1 emoji representativo
- description: 2 frases curtas e acolhedoras
- tips: exatamente 2 dicas práticas curtas

Também retorne:
- ageLabel: "${age.label}"
- intro: 1 frase curta e afetuosa sobre essa fase.

Responda APENAS com JSON válido, sem texto extra, no formato:
{"ageLabel":"...","intro":"...","topics":[{"title":"...","category":"...","emoji":"...","description":"...","tips":["...","..."]}]}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Muitas requisições. Tente novamente em instantes.");
      if (res.status === 401) throw new Error("Chave da Groq inválida.");
      throw new Error(`Falha ao gerar guia (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");
    const parsed = JSON.parse(content) as MaternityGuide;

    // Garantir ordem e presença das 6 categorias fixas
    const byCat = new Map((parsed.topics ?? []).map((t) => [t.category, t]));
    const ordered: MaternityTopic[] = CATEGORIES.map((c) => {
      const found = byCat.get(c.key);
      if (found) return found;
      return {
        title: c.label,
        category: c.key,
        emoji: c.emoji,
        description: "Conteúdo indisponível no momento.",
        tips: [],
      };
    });

    return { ageLabel: age.label, intro: parsed.intro ?? "", topics: ordered };
  });
