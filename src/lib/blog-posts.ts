import rotinaImg from "@/assets/blog/rotina-trocas.jpg";
import assadurasImg from "@/assets/blog/assaduras.jpg";
import desfraldeImg from "@/assets/blog/desfralde.jpg";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "cta" }
  | { type: "ad" };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: "Rotina" | "Cuidados" | "Desenvolvimento";
  cover: string;
  coverAlt: string;
  date: string; // ISO
  readMinutes: number;
  body: BlogBlock[];
}

export const BLOG_CATEGORIES = ["Rotina", "Cuidados", "Desenvolvimento"] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "rotina-de-trocas-de-fralda",
    title: "Como montar a rotina perfeita de trocas de fralda",
    excerpt:
      "Quantas trocas por dia, como organizar o trocador e como dividir a tarefa em família sem sobrecarregar ninguém.",
    category: "Rotina",
    cover: rotinaImg,
    coverAlt: "Trocador de bebê aconchegante com fraldas dobradas, ursinho e relógio",
    date: "2026-10-14",
    readMinutes: 7,
    body: [
      { type: "p", text: "Nos primeiros meses, a troca de fralda é uma das tarefas que mais se repetem no dia. Um recém-nascido pode precisar de 8 a 12 trocas a cada 24 horas — e, quando não existe um mínimo de organização, ela vira fonte de cansaço e até de discussão em casa. A boa notícia: com alguns ajustes simples, a troca pode virar um momento tranquilo e até de conexão com o bebê." },
      { type: "h2", text: "Quantas trocas o bebê precisa por dia?" },
      { type: "p", text: "A frequência muda bastante com a idade. Como referência geral:" },
      { type: "ul", items: [
        "0 a 3 meses: entre 8 e 12 trocas por dia, geralmente após cada mamada.",
        "3 a 6 meses: entre 6 e 8 trocas por dia.",
        "6 a 12 meses: entre 5 e 7 trocas, com a introdução alimentar mudando o padrão das fezes.",
        "Acima de 1 ano: entre 4 e 6 trocas, até o início do desfralde.",
      ] },
      { type: "tip", text: "Mais importante do que o número exato é não deixar a fralda suja por muito tempo: umidade e contato com fezes são as principais causas de assadura." },
      { type: "h2", text: "Organize o trocador antes de precisar" },
      { type: "p", text: "Ter tudo ao alcance da mão evita deixar o bebê sozinho no trocador, mesmo que por segundos — uma regra de segurança essencial. Monte um kit fixo com:" },
      { type: "ul", items: [
        "Fraldas do tamanho certo (de 5 a 10 unidades à vista).",
        "Algodão e água morna ou lenços umedecidos sem perfume.",
        "Pomada de barreira (óxido de zinco ou similar).",
        "Uma muda de roupa reserva e um paninho de boca.",
        "Um brinquedo pequeno para distrair o bebê na fase em que ele começa a se mexer.",
      ] },
      { type: "cta" },
      { type: "h2", text: "Crie momentos fixos ao longo do dia" },
      { type: "p", text: "Associar as trocas a eventos que já acontecem — acordar, depois da mamada, antes do banho e antes de dormir — ajuda o cérebro (o seu e o do bebê) a entender o ritmo do dia. Com o tempo, o bebê passa a reconhecer a sequência e tende a ficar mais calmo." },
      { type: "h3", text: "E durante a madrugada?" },
      { type: "p", text: "À noite, a ideia é trocar com o mínimo de estímulo: luz baixa, voz suave e sem brincadeiras. Se a fralda estiver apenas um pouco molhada e o bebê dormindo bem, muitas famílias optam por fraldas noturnas de maior absorção, trocando só quando há fezes ou desconforto." },
      { type: "ad" },
      { type: "h2", text: "Divida a tarefa de forma justa" },
      { type: "p", text: "A sobrecarga costuma cair sobre uma pessoa só. Combinar turnos (por exemplo, quem não amamenta assume as trocas noturnas) ou usar uma forma divertida de sortear a vez reduz atritos e envolve todos os cuidadores — inclusive avós e irmãos mais velhos, com supervisão." },
      { type: "h3", text: "Transforme a troca em vínculo" },
      { type: "p", text: "Converse, cante, nomeie as partes do corpo e faça contato visual. Esses minutos repetidos dezenas de vezes por semana são uma oportunidade real de estímulo da linguagem e do afeto." },
      { type: "tip", text: "Este conteúdo tem caráter educativo e não substitui a orientação do pediatra." },
    ],
  },
  {
    slug: "dicas-para-evitar-assaduras",
    title: "Dicas práticas para evitar assaduras no bebê",
    excerpt:
      "Entenda por que a assadura aparece, como prevenir no dia a dia e quais sinais indicam que é hora de procurar o pediatra.",
    category: "Cuidados",
    cover: assadurasImg,
    coverAlt: "Pomada, discos de algodão, toalha macia e patinho de borracha em um cantinho de banho",
    date: "2026-10-07",
    readMinutes: 6,
    body: [
      { type: "p", text: "A dermatite da fralda, popularmente chamada de assadura, é uma das queixas mais comuns no primeiro ano de vida. Ela acontece quando a pele delicada do bebê fica exposta por muito tempo à umidade, ao atrito e às enzimas presentes na urina e nas fezes. Na maior parte das vezes, dá para prevenir com cuidados simples." },
      { type: "h2", text: "Por que a assadura aparece?" },
      { type: "ul", items: [
        "Fralda molhada ou suja por muito tempo.",
        "Atrito da fralda apertada contra a pele.",
        "Diarreia ou mudanças na alimentação (como a introdução de frutas ácidas).",
        "Uso de antibióticos, que favorece fungos.",
        "Lenços ou produtos com perfume e álcool.",
      ] },
      { type: "h2", text: "Prevenção no dia a dia" },
      { type: "h3", text: "1. Troque com frequência" },
      { type: "p", text: "A regra de ouro é não esperar a fralda ficar cheia. Sempre que houver fezes, troque imediatamente." },
      { type: "h3", text: "2. Limpe com delicadeza" },
      { type: "p", text: "Prefira algodão com água morna, principalmente nos primeiros meses. Limpe da frente para trás (especialmente em meninas) e evite esfregar: dê batidinhas leves." },
      { type: "h3", text: "3. Deixe a pele secar" },
      { type: "p", text: "Antes de fechar a nova fralda, deixe a região secar naturalmente por alguns minutos. Momentos curtos sem fralda, sobre uma toalha, ajudam muito." },
      { type: "ad" },
      { type: "h3", text: "4. Use pomada de barreira" },
      { type: "p", text: "Uma camada fina de pomada com óxido de zinco cria uma proteção entre a pele e a umidade. Não é preciso remover toda a pomada a cada troca — apenas a parte suja." },
      { type: "h3", text: "5. Ajuste o tamanho da fralda" },
      { type: "p", text: "Fraldas apertadas aumentam o atrito; folgadas demais vazam. Marcas vermelhas na cintura e nas coxas indicam que é hora de subir o tamanho." },
      { type: "cta" },
      { type: "h2", text: "Quando procurar o pediatra" },
      { type: "ul", items: [
        "A vermelhidão não melhora em 2 ou 3 dias de cuidados.",
        "Surgem bolhas, feridas abertas ou pus.",
        "Há pontinhos vermelhos espalhados ao redor (sinal comum de fungo).",
        "O bebê tem febre ou parece muito incomodado.",
      ] },
      { type: "tip", text: "Este conteúdo tem caráter educativo e não substitui a orientação do pediatra ou dermatologista." },
    ],
  },
  {
    slug: "desfralde-sem-estresse",
    title: "Desfralde sem estresse: quando e como começar",
    excerpt:
      "Os sinais de prontidão, um passo a passo gentil e como lidar com os escapes sem culpa — para a criança e para a família.",
    category: "Desenvolvimento",
    cover: desfraldeImg,
    coverAlt: "Penico verde-claro ao lado de livrinhos infantis e um coelhinho de pelúcia",
    date: "2026-09-30",
    readMinutes: 8,
    body: [
      { type: "p", text: "O desfralde é um marco importante e, como todo marco do desenvolvimento, não tem data certa. A maioria das crianças mostra prontidão entre 18 meses e 3 anos. Forçar antes da hora costuma prolongar o processo; respeitar os sinais torna tudo mais rápido e leve." },
      { type: "h2", text: "Sinais de que a criança está pronta" },
      { type: "ul", items: [
        "Fica com a fralda seca por 2 horas ou mais.",
        "Avisa, com palavras ou gestos, que fez xixi ou cocô.",
        "Demonstra incômodo com a fralda suja.",
        "Consegue subir e baixar a calça com alguma ajuda.",
        "Tem curiosidade pelo banheiro e imita os adultos.",
        "Entende instruções simples, como “vamos sentar no penico”.",
      ] },
      { type: "tip", text: "Evite iniciar em períodos de grandes mudanças: chegada de um irmão, mudança de casa ou início na escola." },
      { type: "h2", text: "Passo a passo gentil" },
      { type: "h3", text: "1. Apresente o penico" },
      { type: "p", text: "Deixe o penico à vista por alguns dias antes de usar. Deixe a criança sentar de roupa, brincar perto e escolher um adesivo para decorá-lo." },
      { type: "h3", text: "2. Crie uma rotina de tentativas" },
      { type: "p", text: "Convide para sentar ao acordar, depois das refeições e antes do banho — por poucos minutos, sem pressão. Livrinhos e músicas ajudam." },
      { type: "cta" },
      { type: "h3", text: "3. Troque a fralda por calcinha ou cueca durante o dia" },
      { type: "p", text: "Quando houver alguns acertos, passe para roupas íntimas durante o dia. A sensação de molhado ajuda a criança a perceber o corpo. A fralda noturna pode continuar por mais tempo — o controle noturno costuma vir meses depois." },
      { type: "ad" },
      { type: "h2", text: "Como lidar com os escapes" },
      { type: "p", text: "Escapes fazem parte. Reaja com calma, sem broncas, castigos ou comparações. Diga algo como “tudo bem, da próxima vez a gente tenta no penico” e envolva a criança na troca de roupa de forma natural." },
      { type: "h3", text: "Comemore as conquistas" },
      { type: "p", text: "Elogios sinceros e um quadro de estrelinhas funcionam melhor do que recompensas grandes. O objetivo é a criança se sentir capaz, não pressionada." },
      { type: "h2", text: "Quando conversar com o pediatra" },
      { type: "p", text: "Se após os 4 anos a criança ainda não tiver controle diurno, se houver dor ao urinar, prisão de ventre frequente ou regressão repentina após meses de desfralde, vale buscar orientação." },
      { type: "tip", text: "Este conteúdo tem caráter educativo e não substitui a orientação profissional." },
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
