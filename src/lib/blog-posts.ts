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
  "slug": "rotina-de-trocas-de-fralda",
  "title": "Como criar uma rotina de troca de fraldas sem birras",
  "excerpt": "Pequenos ajustes para acolher o bebê, organizar as trocas e dividir os cuidados com segurança.",
  "category": "Rotina",
  "cover": rotinaImg,
  "coverAlt": "Trocador organizado com fraldas, ursinho e relógio",
  "date": "2026-10-24",
  "readMinutes": 4,
  "body": [
    {
      "type": "p",
      "text": "Quando o bebê começa a virar, engatinhar e explorar, parar para trocar a fralda pode parecer uma interrupção enorme. Ele se contorce, tenta alcançar os pés ou protesta quando precisa ficar deitado. Isso não significa que esteja fazendo algo errado nem que você tenha falhado. Uma rotina previsível, com atenção ao conforto e à segurança, ajuda a transformar esses minutos em um cuidado mais tranquilo para todos."
    },
    {
      "type": "h2",
      "text": "Prepare o espaço antes de começar"
    },
    {
      "type": "p",
      "text": "Separe a fralda limpa, o material de higiene, uma roupa reserva e um saco para descarte antes de levar o bebê ao local de troca. Escolha uma superfície estável e fácil de limpar. Se ele já se movimenta bastante, um tapete próprio no chão pode ser uma alternativa segura, desde que esteja limpo e longe de objetos pequenos, tomadas e animais. A organização evita precisar buscar algo no meio do cuidado."
    },
    {
      "type": "p",
      "text": "Em uma superfície elevada, mantenha uma mão no bebê e permaneça ao lado dele o tempo todo. Cintos de trocador não substituem supervisão. Caso falte algum item, leve a criança com você em vez de deixá-la sozinha. Guarde pomadas e embalagens fora de seu alcance; aquilo que parece um objeto inofensivo para o adulto pode rapidamente ir parar na boca."
    },
    {
      "type": "h2",
      "text": "Observe o ritmo, não apenas o relógio"
    },
    {
      "type": "p",
      "text": "Verifique a fralda ao acordar, antes de sair e em outros momentos naturais da rotina. Troque quando estiver suja, muito molhada ou causando desconforto; a presença de fezes pede uma troca assim que possível. Não existe uma quantidade obrigatória igual para todos. Idade, alimentação, capacidade de absorção e características da criança mudam essa necessidade. Se notar redução importante de urina ou outros sinais de mal-estar, procure orientação."
    },
    {
      "type": "p",
      "text": "Se possível, evite iniciar a troca quando o bebê está muito cansado ou com fome. Quando ela não pode esperar, diminua os estímulos e use uma voz tranquila. À noite, mantenha iluminação suficiente para enxergar e movimentos suaves. O objetivo não é cumprir uma agenda perfeita, mas reconhecer as necessidades reais sem prolongar o contato da pele com sujeira e umidade."
    },
    {
      "type": "h2",
      "text": "Convide o bebê a participar"
    },
    {
      "type": "p",
      "text": "Avise o que vai acontecer: “Agora vamos colocar uma fralda limpa”. Crianças pequenas podem segurar uma fralda fechada ou escolher entre duas roupas. Um brinquedo lavável, sem partes pequenas, pode ocupar as mãos. Cante uma música curta, nomeie os movimentos e faça pausas quando perceber tensão. Essas pequenas escolhas dão espaço para a participação sem transferir à criança a responsabilidade pelo cuidado."
    },
    {
      "type": "p",
      "text": "Se ele tentar chutar ou virar, não transforme a troca em disputa. Ajuste sua posição, proteja o rosto e espere alguns segundos quando for seguro. Segurar com força ou repreender costuma aumentar a resistência. Para crianças que já ficam em pé com estabilidade, algumas trocas apenas de urina podem ser feitas nessa posição, com apoio e supervisão; para limpar fezes, escolha uma posição que permita higiene adequada."
    },
    {
      "type": "cta"
    },
    {
      "type": "h2",
      "text": "Divida os cuidados de forma possível"
    },
    {
      "type": "p",
      "text": "Converse com os outros cuidadores sobre horários, cansaço e disponibilidade. Um pode preparar o material enquanto outro troca; em outro momento, os papéis se invertem. Combinados claros ajudam mais que esperar que alguém perceba sozinho a sobrecarga. A roleta pode entrar como brincadeira entre adultos disponíveis, mas não deve atrasar uma troca necessária nem substituir acordos justos ou respeitar menos quem está exausto."
    },
    {
      "type": "h2",
      "text": "Quando a resistência merece atenção"
    },
    {
      "type": "p",
      "text": "Choro persistente durante toda troca pode indicar irritação da pele, frio, uma posição desconfortável ou outro incômodo. Observe se há vermelhidão, feridas ou dor ao movimentar alguma parte do corpo. Procure o pediatra quando a reação for muito diferente do habitual, houver febre ou sinais de dor. Ajustar a rotina ajuda, mas não substitui investigar desconfortos reais."
    },
    {
      "type": "tip",
      "text": "Não há troca perfeita: segurança, higiene delicada e presença importam mais que velocidade. Respeite o ritmo do bebê e também o seu."
    }
  ]
},
{
  "slug": "dicas-para-evitar-assaduras",
  "title": "Guia prático para evitar assaduras e vazamentos na fralda",
  "excerpt": "Como escolher o ajuste, limpar a pele com delicadeza e reconhecer quando buscar ajuda profissional.",
  "category": "Cuidados",
  "cover": assadurasImg,
  "coverAlt": "Materiais de higiene com algodão, toalha macia e pomada de barreira",
  "date": "2026-10-24",
  "readMinutes": 4,
  "body": [
    {
      "type": "p",
      "text": "Uma fralda que vaza e uma pele avermelhada costumam trazer dúvidas para quem cuida. Nem todo vazamento significa que a marca é ruim, e nem toda irritação melhora apenas com uma pomada. Ajuste, tempo de uso, higiene e sensibilidade da pele precisam ser observados juntos. Este guia reúne cuidados gerais para ajudar na rotina, sem substituir uma avaliação individual quando o bebê apresenta dor ou alterações persistentes."
    },
    {
      "type": "h2",
      "text": "Entenda o que irrita a pele"
    },
    {
      "type": "p",
      "text": "A região coberta pela fralda fica em contato com umidade, calor e atrito. Urina e fezes podem irritar a pele, principalmente quando a troca demora. Diarreia aumenta a frequência de limpeza e pode agravar o problema. Alguns produtos perfumados também provocam irritação. Embora a assadura seja comum, vermelhidão intensa, feridas ou lesões diferentes merecem atenção: existem outras causas que precisam de avaliação profissional."
    },
    {
      "type": "h2",
      "text": "Troque conforme a necessidade"
    },
    {
      "type": "p",
      "text": "Não espere uma fralda visivelmente cheia para verificar como o bebê está. Observe após as mamadas e nos momentos naturais do dia, sem tratar isso como uma regra rígida. Quando houver fezes, troque assim que possível. Durante a noite, considere sujeira, saturação, desconforto e condição da pele. Uma fralda de boa absorção ajuda, mas não torna seguro ignorar sinais de irritação ou deixar fezes em contato com a pele."
    },
    {
      "type": "h2",
      "text": "Limpe sem esfregar"
    },
    {
      "type": "p",
      "text": "Use água e material macio, ou lenços adequados à pele do bebê, preferencialmente sem perfume e sem álcool. Faça movimentos suaves da frente para trás e troque a área do algodão ou do lenço quando estiver suja. Evite esfregar repetidamente para remover resíduos. Nas dobras, limpe com cuidado e seque sem fricção. Não retraia à força o prepúcio; dúvidas sobre higiene genital devem ser conversadas com o pediatra."
    },
    {
      "type": "p",
      "text": "Antes de fechar a fralda, deixe a pele seca. Um intervalo curto sem fralda, em ambiente confortável e sob supervisão, pode reduzir a umidade. Não use secador, talco ou receitas caseiras: podem causar queimaduras, ser inalados ou irritar ainda mais. Higiene simples e delicada costuma ser mais adequada que uma sequência de muitos produtos, especialmente quando a pele já está sensível."
    },
    {
      "type": "h2",
      "text": "Confira tamanho e barreiras de proteção"
    },
    {
      "type": "p",
      "text": "A faixa de peso na embalagem é apenas uma referência. Observe o corpo da criança: cintura apertada, marcas profundas e dificuldade para fechar as abas sugerem ajuste inadequado. Uma fralda muito grande também pode deixar espaços nas pernas. Feche os lados de forma equilibrada, sem comprimir a barriga, e confira se as barreiras das pernas estão voltadas para fora. Trocar automaticamente por um tamanho maior nem sempre resolve."
    },
    {
      "type": "p",
      "text": "Se o vazamento acontece sempre no mesmo lugar, procure a causa. Na cintura, pode haver saturação ou fechamento frouxo; nas pernas, pode faltar vedação ou uma barreira estar dobrada. Em meninos, posicionar o pênis para baixo pode reduzir escapes pela frente. Teste um ajuste por vez e observe. Não sobreponha duas fraldas: isso pode piorar a vedação e aumentar calor e atrito."
    },
    {
      "type": "cta"
    },
    {
      "type": "h2",
      "text": "Proteção da pele e sinais de alerta"
    },
    {
      "type": "p",
      "text": "Produtos de barreira podem ajudar a proteger a pele da umidade. Escolha um produto apropriado para bebês e siga o rótulo e a orientação do profissional que acompanha a criança. Remova delicadamente a parte suja na próxima troca, sem raspar a pele para retirar toda a camada anterior. Não use corticoides, antibióticos ou antifúngicos por conta própria, pois o tratamento depende da causa."
    },
    {
      "type": "p",
      "text": "Procure o pediatra se a irritação não melhorar em poucos dias, se estiver piorando ou se aparecerem feridas, secreção, bolhas ou dor importante. Febre e mudança do estado geral também precisam de avaliação. Fotos podem ajudar a registrar a evolução para a consulta, mas não substituem o exame. Uma rotina cuidadosa reduz riscos; ainda assim, assaduras podem acontecer e não são motivo para culpar a família."
    },
    {
      "type": "tip",
      "text": "Anote quando os vazamentos ocorrem e quais produtos foram usados. Esse registro simples ajuda a perceber padrões e orientar uma conversa com o pediatra."
    }
  ]
},
{
  "slug": "desfralde-sem-estresse",
  "title": "Sinais de que o bebê está pronto para o desfralde",
  "excerpt": "Prontidão, tentativas gentis e acolhimento dos escapes: um caminho que respeita o desenvolvimento da criança.",
  "category": "Desenvolvimento",
  "cover": desfraldeImg,
  "coverAlt": "Penico infantil ao lado de livros e coelhinho de pelúcia",
  "date": "2026-10-24",
  "readMinutes": 4,
  "body": [
    {
      "type": "p",
      "text": "O desfralde costuma chegar acompanhado de perguntas: será que já está na hora, qual penico escolher e o que fazer quando há escapes? Comparar a criança com irmãos ou colegas pode aumentar a ansiedade. Aprender a reconhecer os sinais do corpo e usar o banheiro envolve desenvolvimento físico, comunicação e confiança. A idade sozinha não determina prontidão, e começar antes de a criança estar preparada pode tornar a experiência mais difícil."
    },
    {
      "type": "h2",
      "text": "Observe um conjunto de sinais"
    },
    {
      "type": "p",
      "text": "Algumas crianças começam a mostrar interesse entre o segundo e o terceiro ano, enquanto outras precisam de mais tempo. Observe se ela percebe xixi ou cocô, demonstra incômodo com a fralda suja, fica seca por intervalos maiores e consegue comunicar necessidades por palavras ou gestos. Curiosidade pelo banheiro e compreensão de orientações simples também podem ajudar. Nenhum desses sinais isolado funciona como um teste definitivo."
    },
    {
      "type": "p",
      "text": "A participação prática importa: conseguir sentar com estabilidade, levantar e colaborar para baixar a roupa facilita as tentativas. Crianças com diferenças de desenvolvimento podem precisar de adaptações e acompanhamento individual. Em vez de estabelecer um prazo, observe o conjunto e converse com o pediatra se tiver dúvidas. Estar pronto não significa acertar sempre nem deixar de usar fraldas de um dia para o outro."
    },
    {
      "type": "h2",
      "text": "Escolha um momento possível para a família"
    },
    {
      "type": "p",
      "text": "Mudança de casa, chegada de um irmão, doença ou início na escola podem exigir muita adaptação. Se possível, comece em um período relativamente tranquilo, quando os cuidadores conseguem acompanhar sem pressa. Combine palavras simples e atitudes semelhantes entre casa e escola. A criança não precisa receber cobranças diferentes de cada adulto. Também vale reconhecer quando o cansaço da família pede uma pausa e reorganização."
    },
    {
      "type": "h2",
      "text": "Apresente o banheiro sem pressão"
    },
    {
      "type": "p",
      "text": "Mostre o penico ou um redutor de assento adequado e deixe a criança explorar o objeto com supervisão. Se usar o vaso, ofereça apoio firme para os pés e mantenha um adulto por perto. Ela pode primeiro sentar vestida e depois experimentar sem fralda. Roupas fáceis de baixar ajudam na autonomia. Evite acessórios que deixem a posição instável ou aumentem o medo de cair."
    },
    {
      "type": "p",
      "text": "Convide para tentativas breves em momentos previsíveis, como ao acordar ou depois de uma refeição. Não mantenha a criança sentada até produzir alguma coisa nem insista diante de recusa. Um livro curto pode acompanhar esse momento, mas o objetivo é reconhecer o corpo, não ficar distraída por longos períodos. Lembre de lavar as mãos depois, com ajuda e de forma adequada à idade."
    },
    {
      "type": "h2",
      "text": "Acolha os escapes e valorize a comunicação"
    },
    {
      "type": "p",
      "text": "Escapes são parte do aprendizado. Troque a roupa com tranquilidade e diga algo simples: “Seu corpo está aprendendo; na próxima vez podemos tentar o banheiro”. Não use broncas, humilhações ou comparações. Valorize quando a criança avisa, tenta ou pede ajuda, mesmo que não chegue a tempo. Conquistas não precisam virar uma competição ou depender de presentes. Segurança emocional ajuda mais que pressão por resultados rápidos."
    },
    {
      "type": "cta"
    },
    {
      "type": "h2",
      "text": "Dia e noite podem ter ritmos diferentes"
    },
    {
      "type": "p",
      "text": "O controle durante o sono depende também de maturação e pode chegar depois do controle diurno. Manter fralda à noite não invalida o progresso do dia. Evite retirar líquidos de forma excessiva ou acordar repetidamente a criança só para cumprir uma meta. Converse com o pediatra sobre dúvidas noturnas e mantenha uma rotina confortável. Um protetor de colchão pode facilitar a limpeza sem transformar escapes em motivo de conflito."
    },
    {
      "type": "h2",
      "text": "Quando pausar ou procurar orientação"
    },
    {
      "type": "p",
      "text": "Se a criança passa a segurar fezes, demonstra dor, fica muito angustiada ou desenvolve prisão de ventre, interrompa a pressão e procure orientação. Dor ao urinar, escapes que aparecem após um período estável ou dificuldades persistentes também merecem avaliação. Voltar temporariamente à fralda pode ser uma escolha de cuidado, não um fracasso. O processo deve respeitar saúde, desenvolvimento e realidade da família, sem promessas de resultados em poucos dias."
    },
    {
      "type": "tip",
      "text": "O melhor momento é aquele em que a criança mostra prontidão e encontra adultos disponíveis para acompanhar com paciência, não uma data escolhida por comparação."
    }
  ]
}
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
