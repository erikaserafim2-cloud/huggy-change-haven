import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  birthDate: z.string().min(4), // ISO yyyy-mm-dd
  babyName: z.string().optional().default(""),
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

export const getMaternityGuide = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<MaternityGuide> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const age = computeAge(data.birthDate);
    const babyName = data.babyName?.trim() || "seu bebê";

    const systemPrompt = `Você é uma consultora carinhosa em maternidade, pediatria comportamental e desenvolvimento infantil, escrevendo em português brasileiro. Seu tom é acolhedor, humano, informativo e sem julgamentos. Você NÃO substitui um pediatra — sempre recomende consultar profissionais em casos específicos.`;

    const userPrompt = `Gere um guia curto e personalizado para uma mãe/pai cujo bebê ${babyName} tem exatamente ${age.label} (${age.days} dias / ${age.months} meses).

Retorne EXATAMENTE 4 tópicos ESSENCIAIS e específicos para essa idade, escolhidos entre: desenvolvimento (motor/cognitivo/emocional), sono, alimentação apropriada, brincadeiras/estímulos, saúde, segurança, vínculo, autocuidado parental.

Cada tópico deve ter:
- title: título curto e caloroso
- category: uma categoria (ex: "Desenvolvimento", "Sono", "Alimentação", "Brincadeiras", "Saúde", "Autocuidado", "Segurança", "Vínculo")
- emoji: 1 emoji representativo
- description: 2 frases curtas, acolhedoras
- tips: exatamente 2 dicas práticas bem curtas

Também retorne:
- ageLabel: "${age.label}"
- intro: 1 frase curta e afetuosa sobre essa fase.

Seja conciso. Respostas curtas.`;


    const schema = {
      type: "object",
      additionalProperties: false,
      properties: {
        ageLabel: { type: "string" },
        intro: { type: "string" },
        topics: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              category: { type: "string" },
              emoji: { type: "string" },
              description: { type: "string" },
              tips: { type: "array", items: { type: "string" } },
            },
            required: ["title", "category", "emoji", "description", "tips"],
          },
        },
      },
      required: ["ageLabel", "intro", "topics"],
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: "maternity_guide", strict: true, schema },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Muitas requisições. Tente novamente em instantes.");
      if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos no workspace.");
      throw new Error(`Falha ao gerar guia (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Resposta vazia da IA");
    const parsed = JSON.parse(content) as MaternityGuide;
    return { ...parsed, ageLabel: age.label };
  });
