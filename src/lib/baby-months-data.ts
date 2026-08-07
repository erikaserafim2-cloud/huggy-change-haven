// SEO content per month (1-24). Kept intentionally editable and expandable.
// Each entry provides material for /bebe-<n>-meses landing pages.

export type MonthSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type MonthFaq = { q: string; a: string };

export type MonthContent = {
  month: number;
  slug: string; // e.g. "bebe-3-meses"
  title: string; // H1
  metaTitle: string; // <title>
  metaDescription: string; // meta description
  intro: string;
  development: MonthSection;
  skills: MonthSection;
  play: MonthSection;
  routine: MonthSection;
  sleep: MonthSection;
  feeding: MonthSection;
  faq: MonthFaq[];
};

const ageLabel = (m: number) => (m === 1 ? "1 mês" : `${m} meses`);

// Phase-based generator — keeps content coherent by developmental window
// while remaining specific to each month. Content is educational and
// generalista; nunca substitui o pediatra.
function build(month: number): MonthContent {
  const label = ageLabel(month);
  const slug = `bebe-${month}-${month === 1 ? "mes" : "meses"}`;

  // Phase buckets
  const phase =
    month <= 3 ? "recem" :
    month <= 6 ? "descoberta" :
    month <= 9 ? "exploracao" :
    month <= 12 ? "primeiros-passos" :
    month <= 18 ? "andarilho" :
    "pequeno-explorador";

  const development: Record<string, MonthSection> = {
    recem: {
      title: `Desenvolvimento do bebê com ${label}`,
      paragraphs: [
        `Nos primeiros meses, o bebê ainda está se adaptando ao mundo fora do útero. Aos ${label}, o cérebro forma milhares de conexões por segundo, e cada olhar, cheiro e toque conta como aprendizado.`,
        `O tônus muscular do pescoço vai ganhando força aos poucos, e o bebê começa a fixar o olhar em rostos próximos, especialmente da mãe e do pai.`,
      ],
      bullets: [
        "Reconhece a voz dos cuidadores mais próximos",
        "Reflexos primitivos (Moro, sucção, preensão) ainda muito ativos",
        "Consegue enxergar bem a cerca de 20–30 cm de distância",
        "Chora como principal forma de comunicação",
      ],
    },
    descoberta: {
      title: `Desenvolvimento do bebê com ${label}`,
      paragraphs: [
        `Entre 4 e 6 meses, o bebê descobre o próprio corpo e o mundo à volta com muito mais intenção. Aos ${label}, ele já sustenta melhor a cabeça, rola e leva quase tudo à boca.`,
        `É uma fase de grande evolução sensorial: sons, texturas e cores ganham significado novo a cada dia.`,
      ],
      bullets: [
        "Sustenta a cabeça com firmeza quando de bruços",
        "Começa a rolar de um lado para o outro",
        "Balbucia sons repetidos (ba-ba, ma-ma)",
        "Alcança e segura objetos com intenção",
      ],
    },
    exploracao: {
      title: `Desenvolvimento do bebê com ${label}`,
      paragraphs: [
        `Aos ${label}, o bebê está em plena exploração. Muitos já sentam sem apoio, engatinham ou se arrastam, e adoram passar objetos de uma mão para a outra.`,
        `A curiosidade dispara: tudo é motivo para investigar, empilhar, derrubar e recomeçar.`,
      ],
      bullets: [
        "Senta sem apoio por períodos maiores",
        "Engatinha, se arrasta ou 'anda' no bumbum",
        "Responde ao próprio nome",
        "Começa a entender 'não' pelo tom de voz",
      ],
    },
    "primeiros-passos": {
      title: `Desenvolvimento do bebê com ${label}`,
      paragraphs: [
        `Entre 10 e 12 meses, o bebê ensaia os primeiros passos com apoio e ganha independência a cada semana. Aos ${label}, ele já entende muito mais do que consegue falar.`,
        `A comunicação por gestos, apontar e imitar se torna a principal ponte com o mundo dos adultos.`,
      ],
      bullets: [
        "Fica em pé com apoio e dá passos laterais",
        "Diz as primeiras palavras com sentido (mamã, papá)",
        "Aponta para objetos que quer",
        "Imita gestos simples como tchau e bater palmas",
      ],
    },
    andarilho: {
      title: `Desenvolvimento da criança com ${label}`,
      paragraphs: [
        `Entre 13 e 18 meses, a criança está firme nos primeiros passos e explora o ambiente com autonomia. Aos ${label}, o vocabulário cresce rápido e a personalidade começa a aparecer.`,
        `É a fase das descobertas motoras: subir, descer, empurrar e puxar tudo o que encontra pela frente.`,
      ],
      bullets: [
        "Anda sozinho com equilíbrio crescente",
        "Aumenta o vocabulário para 5–20 palavras",
        "Reconhece partes do corpo quando nomeadas",
        "Faz birras quando contrariado — é normal",
      ],
    },
    "pequeno-explorador": {
      title: `Desenvolvimento da criança com ${label}`,
      paragraphs: [
        `Entre 19 e 24 meses, a criança vive o auge da autonomia inicial. Aos ${label}, ela combina duas palavras, corre, sobe escadas com apoio e brinca de faz de conta.`,
        `A ideia de 'meu' fica forte, e é natural que ela queira decidir tudo por conta própria.`,
      ],
      bullets: [
        "Forma frases curtas de 2–3 palavras",
        "Sobe e desce degraus com apoio",
        "Brinca de faz de conta (dar comida ao urso, atender telefone)",
        "Testa limites — parte saudável do desenvolvimento",
      ],
    },
  };

  const skills: Record<string, MonthSection> = {
    recem: {
      title: `Principais habilidades da fase (${label})`,
      paragraphs: [
        `As habilidades desta fase são sutis e envolvem principalmente o vínculo com os cuidadores e o desenvolvimento sensorial inicial.`,
      ],
      bullets: [
        "Acompanha objetos com o olhar por curtos períodos",
        "Reage a sons altos com sobressalto",
        "Começa a sorrir socialmente (por volta de 6 semanas)",
        "Leva as mãozinhas à boca",
      ],
    },
    descoberta: {
      title: `Principais habilidades da fase (${label})`,
      paragraphs: [
        `Neste período, as habilidades motoras e sociais avançam juntas — o bebê interage muito mais com o ambiente e as pessoas.`,
      ],
      bullets: [
        "Ri alto em resposta a estímulos divertidos",
        "Segura objetos e transfere de uma mão para outra",
        "Começa a reconhecer o próprio nome",
        "Preparação para a introdução alimentar (a partir dos 6 meses)",
      ],
    },
    exploracao: {
      title: `Principais habilidades da fase (${label})`,
      paragraphs: [
        `Aos ${label}, o bebê ganha independência motora e começa a testar causa e efeito com brinquedos e objetos.`,
      ],
      bullets: [
        "Pinça superior em desenvolvimento (pegar objetos pequenos)",
        "Bate objetos entre si e explora sons",
        "Procura brinquedos escondidos (permanência do objeto)",
        "Estranhamento — reconhece pessoas próximas vs. desconhecidas",
      ],
    },
    "primeiros-passos": {
      title: `Principais habilidades da fase (${label})`,
      paragraphs: [
        `As habilidades motoras finas e a comunicação dão saltos importantes nesta janela.`,
      ],
      bullets: [
        "Pinça fina bem desenvolvida — segura migalhas com precisão",
        "Entrega objetos quando pedido",
        "Aponta para pedir ou compartilhar interesse",
        "Faz gestos comunicativos (tchau, jogar beijo)",
      ],
    },
    andarilho: {
      title: `Principais habilidades da fase (${label})`,
      paragraphs: [
        `A criança expande a autonomia com ações práticas e cotidianas.`,
      ],
      bullets: [
        "Bebe em copo com auxílio",
        "Rabisca em papel com giz grosso",
        "Empilha 2–3 blocos",
        "Segue comandos simples (‘pega a bola’, ‘dá pra mim’)",
      ],
    },
    "pequeno-explorador": {
      title: `Principais habilidades da fase (${label})`,
      paragraphs: [
        `A imitação e a linguagem simbólica ganham espaço central.`,
      ],
      bullets: [
        "Aponta imagens em livros quando nomeadas",
        "Chuta bola sem cair",
        "Tira sapatos e meias sozinho",
        "Começa a demonstrar interesse pelo desfralde",
      ],
    },
  };

  const play: Record<string, MonthSection> = {
    recem: {
      title: `Brincadeiras para o bebê de ${label}`,
      paragraphs: [
        `Nesta fase, brincar é conectar. Toque, canto e contato pele a pele são as melhores brincadeiras.`,
      ],
      bullets: [
        "Cantar e conversar olhando nos olhos",
        "Tummy time (barriguinha para baixo) por curtos períodos",
        "Móbiles com contraste preto e branco",
        "Massagem shantala após o banho",
      ],
    },
    descoberta: {
      title: `Brincadeiras para o bebê de ${label}`,
      paragraphs: [
        `Estimule os sentidos com brinquedos leves e seguros para levar à boca.`,
      ],
      bullets: [
        "Chocalhos e brinquedos de morder",
        "Espelho infantil para descobrir o próprio rosto",
        "Cantigas com gestos (‘aranha pequenininha’)",
        "Livros de tecido com texturas diferentes",
      ],
    },
    exploracao: {
      title: `Brincadeiras para o bebê de ${label}`,
      paragraphs: [
        `Aos ${label}, brincadeiras de esconder e encontrar são as favoritas.`,
      ],
      bullets: [
        "Achou! (cadê? achou!) com paninho",
        "Empilhar copinhos e derrubar",
        "Caixa com objetos seguros para tirar e colocar",
        "Brinquedos que fazem sons ao apertar",
      ],
    },
    "primeiros-passos": {
      title: `Brincadeiras para o bebê de ${label}`,
      paragraphs: [
        `Brincadeiras que estimulam o andar e a coordenação são bem-vindas.`,
      ],
      bullets: [
        "Empurrar carrinho ou andador de apoio",
        "Encaixar formas simples",
        "Ler livros grossos apontando figuras",
        "Bolas grandes para rolar e chutar",
      ],
    },
    andarilho: {
      title: `Brincadeiras para a criança de ${label}`,
      paragraphs: [
        `Atividades que envolvem imitação e movimento são as favoritas.`,
      ],
      bullets: [
        "Dançar músicas infantis",
        "Encaixes e blocos de montar grandes",
        "Massinha de modelar caseira, sob supervisão",
        "Brincar de casinha, imitando rotinas",
      ],
    },
    "pequeno-explorador": {
      title: `Brincadeiras para a criança de ${label}`,
      paragraphs: [
        `Faz de conta e desafios motores marcam essa fase.`,
      ],
      bullets: [
        "Dar 'comidinha' ao urso ou boneca",
        "Rabiscar com giz grosso",
        "Brincadeiras de imitar (bombeiro, médico, cozinheiro)",
        "Circuitos simples com almofadas para pular e passar por baixo",
      ],
    },
  };

  const routine: Record<string, MonthSection> = {
    recem: {
      title: `Rotina do bebê com ${label}`,
      paragraphs: [
        `A rotina neste início é muito flexível. O bebê alterna entre mamar, dormir e curtos momentos acordado.`,
        `Vale seguir os sinais do bebê antes do relógio.`,
      ],
    },
    descoberta: {
      title: `Rotina do bebê com ${label}`,
      paragraphs: [
        `A partir dos 4 meses, muitas famílias começam a perceber padrões mais claros de sono e mamada.`,
        `Rituais simples — banho, luz baixa, canção — ajudam a criança a se organizar.`,
      ],
    },
    exploracao: {
      title: `Rotina do bebê com ${label}`,
      paragraphs: [
        `Aos ${label}, a rotina passa a incluir refeições sólidas, sonecas mais previsíveis e um bom tempo de brincadeira no chão.`,
      ],
    },
    "primeiros-passos": {
      title: `Rotina do bebê com ${label}`,
      paragraphs: [
        `A rotina geralmente tem 2 sonecas ao longo do dia e três refeições principais, além dos lanches.`,
      ],
    },
    andarilho: {
      title: `Rotina da criança com ${label}`,
      paragraphs: [
        `Uma soneca à tarde costuma dar conta do descanso. Rotinas previsíveis ajudam a reduzir birras.`,
      ],
    },
    "pequeno-explorador": {
      title: `Rotina da criança com ${label}`,
      paragraphs: [
        `A criança já entende sequências (‘primeiro banho, depois jantar’). Envolvê-la nas tarefas cotidianas fortalece a autonomia.`,
      ],
    },
  };

  const sleep: Record<string, MonthSection> = {
    recem: {
      title: `Sono do bebê de ${label}`,
      paragraphs: [
        `Nesta fase, o bebê dorme entre 14 e 17 horas por dia, em ciclos curtos e sem distinguir dia e noite.`,
      ],
      bullets: [
        "Coloque para dormir de barriga para cima, sempre",
        "Berço livre de travesseiros, cobertas soltas e brinquedos",
        "Ambiente com temperatura agradável (22–24 °C)",
      ],
    },
    descoberta: {
      title: `Sono do bebê de ${label}`,
      paragraphs: [
        `A regressão do sono dos 4 meses é comum: o sono amadurece e fica mais parecido com o do adulto.`,
      ],
      bullets: [
        "Ritual de sono ajuda a sinalizar a hora de dormir",
        "Sonecas de manhã, meio da tarde e fim da tarde",
        "Evite estímulos fortes na hora antes do sono",
      ],
    },
    exploracao: {
      title: `Sono do bebê de ${label}`,
      paragraphs: [
        `A maioria dos bebês nesta fase faz 2–3 sonecas e dorme entre 11 e 12 horas à noite (com despertares).`,
      ],
    },
    "primeiros-passos": {
      title: `Sono do bebê de ${label}`,
      paragraphs: [
        `Duas sonecas costumam dar conta do descanso. Consistência no horário é mais importante do que rigidez.`,
      ],
    },
    andarilho: {
      title: `Sono da criança de ${label}`,
      paragraphs: [
        `Muitas crianças fazem a transição para 1 soneca por dia. O total de sono fica entre 11 e 14 horas.`,
      ],
    },
    "pequeno-explorador": {
      title: `Sono da criança de ${label}`,
      paragraphs: [
        `Uma soneca de 1–2 horas no início da tarde e um sono noturno de 10–12 horas costumam funcionar bem.`,
      ],
    },
  };

  const feeding: Record<string, MonthSection> = {
    recem: {
      title: `Alimentação do bebê com ${label}`,
      paragraphs: [
        `A recomendação da Organização Mundial da Saúde é aleitamento materno exclusivo até os 6 meses.`,
        `Se o aleitamento não for possível, a orientação da fórmula infantil deve vir do pediatra.`,
      ],
    },
    descoberta: {
      title: `Alimentação do bebê com ${label}`,
      paragraphs: [
        month < 6
          ? `Até os 6 meses, o leite (materno ou fórmula) é o único alimento necessário. Água, chás e sucos não são recomendados.`
          : `A partir dos 6 meses inicia-se a introdução alimentar, mantendo o leite materno como base.`,
      ],
      bullets: month >= 6 ? [
        "Ofereça frutas, legumes e cereais em consistência amassada",
        "Introduza um novo alimento por vez para observar reações",
        "Sem sal, açúcar ou mel no primeiro ano",
      ] : undefined,
    },
    exploracao: {
      title: `Alimentação do bebê com ${label}`,
      paragraphs: [
        `Aos ${label}, o bebê já experimenta variedade de alimentos e desenvolve preferências. A texturas podem evoluir para pedacinhos macios.`,
      ],
      bullets: [
        "Refeições em família favorecem o aprendizado",
        "Ofereça água em copinho ao longo do dia",
        "Continue com aleitamento materno em livre demanda",
      ],
    },
    "primeiros-passos": {
      title: `Alimentação do bebê com ${label}`,
      paragraphs: [
        `Perto de 1 ano, o bebê pode compartilhar quase todos os alimentos da família, respeitando temperos suaves e formatos seguros.`,
      ],
      bullets: [
        "Evite alimentos que causam engasgo (uva inteira, salsicha em rodela, castanhas)",
        "Ofereça talheres para explorar",
        "Sem sal e açúcar como regra até 2 anos",
      ],
    },
    andarilho: {
      title: `Alimentação da criança com ${label}`,
      paragraphs: [
        `A criança come praticamente o mesmo cardápio da família. É comum reduzir o apetite após 1 ano — respeitar a fome é importante.`,
      ],
      bullets: [
        "Ofereça variedade sem forçar",
        "Evite ultraprocessados e bebidas açucaradas",
        "Refeições no mesmo lugar, sem telas, favorecem melhor alimentação",
      ],
    },
    "pequeno-explorador": {
      title: `Alimentação da criança com ${label}`,
      paragraphs: [
        `A seletividade alimentar pode aparecer — é uma fase, não uma manha. Insista com carinho e sem chantagem.`,
      ],
      bullets: [
        "Envolva a criança no preparo, quando possível",
        "Ofereça o mesmo alimento em preparações diferentes",
        "Modele: coma junto o que gostaria que ela comesse",
      ],
    },
  };

  const faq: Record<string, MonthFaq[]> = {
    recem: [
      { q: `Quantas horas o bebê de ${label} dorme?`, a: `Em média 14–17 horas por dia, distribuídas em ciclos curtos entre mamadas.` },
      { q: `Meu bebê chora muito, é normal?`, a: `Sim. O choro é a principal forma de comunicação. Se vier acompanhado de febre, vômito ou letargia, procure o pediatra.` },
      { q: `Posso oferecer água?`, a: `Não. Até os 6 meses o leite (materno ou fórmula) é suficiente para hidratação.` },
    ],
    descoberta: [
      { q: `Quando começar a introdução alimentar?`, a: `A partir dos 6 meses, mantendo o leite materno em livre demanda.` },
      { q: `É normal o bebê acordar mais à noite?`, a: `Sim, a regressão do sono dos 4 meses é comum e reflete o amadurecimento do sono.` },
      { q: `Posso deixar o bebê sentado com apoio?`, a: `Por curtos períodos e sempre supervisionado, sem forçar posturas.` },
    ],
    exploracao: [
      { q: `Meu bebê ainda não engatinha, tem problema?`, a: `Cada bebê tem seu ritmo. Alguns pulam o engatinhar. Converse com o pediatra se houver outras preocupações.` },
      { q: `Posso oferecer água em copinho?`, a: `Sim, junto às refeições complementares.` },
      { q: `Quantas sonecas por dia?`, a: `Em geral 2–3 sonecas, totalizando 3–4 horas de sono diurno.` },
    ],
    "primeiros-passos": [
      { q: `Meu bebê ainda não anda com 1 ano, é atraso?`, a: `Não. A maioria das crianças anda entre 10 e 18 meses. Se houver dúvidas, converse com o pediatra.` },
      { q: `Posso oferecer leite de vaca?`, a: `A recomendação é aguardar até 1 ano completo, salvo orientação médica diferente.` },
      { q: `Quando parar com a mamadeira?`, a: `Idealmente até 1 ano, transicionando para copo. Consulte o pediatra e o odontopediatra.` },
    ],
    andarilho: [
      { q: `Birra é normal nessa idade?`, a: `Sim. A criança testa limites porque ainda não sabe lidar com frustrações. Acolha o sentimento com firmeza.` },
      { q: `Devo iniciar o desfralde?`, a: `A maioria das crianças demonstra sinais de prontidão entre 18 e 30 meses. Observe os sinais e não force.` },
      { q: `Pode assistir TV nessa idade?`, a: `Sociedades pediátricas recomendam evitar telas antes dos 2 anos, exceto videochamadas com familiares.` },
    ],
    "pequeno-explorador": [
      { q: `Quantas palavras a criança deve falar?`, a: `Por volta dos 24 meses, espera-se um vocabulário de 50 palavras e combinações de 2 palavras.` },
      { q: `Pode dormir na cama dos pais?`, a: `É uma decisão da família. Se for co-sleeping, siga recomendações de segurança do sono.` },
      { q: `Quando começar a escolinha?`, a: `Depende da família e da criança. Não há idade certa; observe o vínculo e a adaptação.` },
    ],
  };

  const introByPhase: Record<string, string> = {
    recem: `Aos ${label}, o bebê ainda está se adaptando ao mundo. Cada gesto, olhar e mamada é parte de uma construção delicada de vínculo, sono e alimentação. Neste guia você encontra o que esperar do desenvolvimento, das brincadeiras e da rotina nesta fase tão especial.`,
    descoberta: `O bebê de ${label} está em uma fase de grandes descobertas sensoriais. As habilidades motoras evoluem, o sorriso social vira gargalhada e o mundo ganha novos significados. Veja o que esperar do desenvolvimento, sono, alimentação e brincadeiras.`,
    exploracao: `Aos ${label}, a curiosidade domina o dia. O bebê senta, pega, explora, prova. É a fase em que a rotina se organiza um pouco mais e a introdução alimentar entra em ritmo. Confira as principais orientações.`,
    "primeiros-passos": `O bebê de ${label} está prestes a — ou já dando — os primeiros passos. A comunicação amadurece, o vínculo se fortalece e o mundo se abre. Neste guia, você acompanha desenvolvimento, sono, alimentação, brincadeiras e as dúvidas mais comuns.`,
    andarilho: `Aos ${label}, a criança anda, corre, explora e testa limites. É uma fase intensa e cheia de conquistas. Veja um panorama sobre o desenvolvimento, rotina, sono e alimentação nesta idade.`,
    "pequeno-explorador": `Com ${label}, a criança combina palavras, brinca de faz de conta e ganha autonomia. Aqui você encontra um resumo carinhoso e prático sobre desenvolvimento, sono, alimentação e as principais dúvidas dos pais.`,
  };

  return {
    month,
    slug,
    title: `Bebê de ${label}: desenvolvimento, sono e cuidados`,
    metaTitle: `Bebê de ${label}: desenvolvimento, sono e brincadeiras`,
    metaDescription: `Guia completo sobre o bebê de ${label}: o que esperar do desenvolvimento, habilidades, brincadeiras, rotina, sono, alimentação e dúvidas comuns dos pais.`,
    intro: introByPhase[phase],
    development: development[phase],
    skills: skills[phase],
    play: play[phase],
    routine: routine[phase],
    sleep: sleep[phase],
    feeding: feeding[phase],
    faq: faq[phase],
  };
}

export const MONTHS_CONTENT: MonthContent[] = Array.from({ length: 24 }, (_, i) => build(i + 1));

export function getMonthContent(month: number): MonthContent | null {
  if (!Number.isInteger(month) || month < 1 || month > 24) return null;
  return MONTHS_CONTENT[month - 1];
}

export const SITE_URL = "https://trocafraldas.online";
