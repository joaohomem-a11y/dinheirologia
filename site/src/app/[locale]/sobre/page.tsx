import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    pt: 'Sobre | Dinheirologia',
    en: 'About | Dinheirologia',
    es: 'Acerca de | Dinheirologia',
  };
  return { title: titles[locale] || titles.pt };
}

const CONTENT: Record<string, { title: string; blocks: { heading: string; text: string }[] }> = {
  pt: {
    title: 'Sobre o Dinheirologia',
    blocks: [
      {
        heading: 'Quem Somos',
        text: `O Dinheirologia nasceu em 2008, quando o mundo financeiro estava literalmente pegando fogo. Enquanto bancos quebravam e "especialistas" corriam em círculos, a gente já estava aqui, tentando fazer sentido do caos — e rindo dele.

Somos um portal de notícias e opinião sobre mercado financeiro, trading, investimentos e negócios. Mas não somos mais um site que repete o que a Bloomberg disse, traduz mal e coloca um título sensacionalista. Aqui a gente mastiga, digere e cospe a informação de um jeito que você realmente entende.`,
      },
      {
        heading: 'Nossa Filosofia',
        text: `Acreditamos em pele em jogo. Se você não arrisca, sua opinião vale tanto quanto a de um papagaio — repete bonito mas não entende nada.

Somos pró-mercado, pró-mérito, e acreditamos que o caminho para a prosperidade passa por trabalho duro, estudo constante e a humildade de saber que o mercado é maior que qualquer um de nós. Não vendemos ilusão de dinheiro fácil. O mercado é uma arena, e você precisa estar preparado pra apanhar antes de aprender a bater.

Como diria Nassim Taleb: "Se você não corre riscos por sua opinião, você não é nada."`,
      },
      {
        heading: 'O Que Você Encontra Aqui',
        text: `• Notícias do mercado financeiro reescritas com profundidade e humor ácido
• Análises que explicam o "economês" sem te tratar como idiota
• Calendário econômico com emojis (porque a vida é curta demais pra ser séria o tempo todo)
• Opinião de quem tem a pele em jogo, não de semideuses de redes sociais
• Conteúdo em português, inglês e espanhol — porque o mercado não tem fronteiras`,
      },
      {
        heading: 'João Homem',
        text: `O fundador do Dinheirologia é um trader que aprendeu nas ruas, não nos livros — embora tenha lido todos eles também. Sua filosofia é simples: "Um homem precisa ser gentil, controlado, mas precisa representar perigo também."

Todos os seus artigos são assinados como "Como Dirigir Uma Mercearia e Umas Coisinhas Que Aprendi Sobre Pescaria" — porque a vida te ensina mais do que qualquer MBA.`,
      },
    ],
  },
  en: {
    title: 'About Dinheirologia',
    blocks: [
      {
        heading: 'Who We Are',
        text: `Dinheirologia was born in 2008, when the financial world was literally on fire. While banks were collapsing and "experts" were running in circles, we were already here, trying to make sense of the chaos — and laughing at it.

We are a news and opinion portal covering financial markets, trading, investments, and business. But we're not just another site that repeats what Bloomberg said, translates it poorly, and slaps on a clickbait headline. We chew, digest, and spit out information in a way you actually understand.`,
      },
      {
        heading: 'Our Philosophy',
        text: `We believe in skin in the game. If you don't take risks, your opinion is worth as much as a parrot's — sounds pretty but means nothing.

We're pro-market, pro-merit, and believe the path to prosperity runs through hard work, constant study, and the humility to know the market is bigger than any of us. We don't sell easy money illusions. The market is an arena, and you need to be ready to take punches before you learn to throw them.

As Nassim Taleb says: "If you don't take risks for your opinion, you are nothing."`,
      },
      {
        heading: 'What You\'ll Find Here',
        text: `• Financial market news rewritten with depth and acid humor
• Analysis that explains financial jargon without treating you like an idiot
• Economic calendar with emojis (because life is too short to be serious all the time)
• Opinions from people with skin in the game, not social media demigods
• Content in Portuguese, English, and Spanish — because markets have no borders`,
      },
      {
        heading: 'João Homem',
        text: `The founder of Dinheirologia is a trader who learned in the streets, not in books — although he read all of them too. His philosophy is simple: "A man needs to be kind, controlled, but he needs to represent danger too."

All his articles are signed as "Como Dirigir Uma Mercearia e Umas Coisinhas Que Aprendi Sobre Pescaria" (How to Run a Grocery Store and a Few Things I Learned About Fishing) — because life teaches you more than any MBA.`,
      },
    ],
  },
  es: {
    title: 'Sobre Dinheirologia',
    blocks: [
      {
        heading: 'Quiénes Somos',
        text: `Dinheirologia nació en 2008, cuando el mundo financiero estaba literalmente en llamas. Mientras los bancos quebraban y los "expertos" corrían en círculos, nosotros ya estábamos aquí, intentando darle sentido al caos — y riéndonos de él.

Somos un portal de noticias y opinión sobre mercados financieros, trading, inversiones y negocios. Pero no somos otro sitio más que repite lo que dijo Bloomberg, lo traduce mal y le pone un titular sensacionalista. Aquí masticamos, digerimos y escupimos la información de una manera que realmente entiendes.`,
      },
      {
        heading: 'Nuestra Filosofía',
        text: `Creemos en tener piel en el juego. Si no arriesgas, tu opinión vale tanto como la de un loro — suena bonito pero no significa nada.

Somos pro-mercado, pro-mérito, y creemos que el camino a la prosperidad pasa por trabajo duro, estudio constante y la humildad de saber que el mercado es más grande que cualquiera de nosotros. No vendemos ilusiones de dinero fácil. El mercado es una arena, y necesitas estar listo para recibir golpes antes de aprender a darlos.

Como diría Nassim Taleb: "Si no arriesgas por tu opinión, no eres nada."`,
      },
      {
        heading: 'Qué Encontrarás Aquí',
        text: `• Noticias del mercado financiero reescritas con profundidad y humor ácido
• Análisis que explican la jerga financiera sin tratarte como idiota
• Calendario económico con emojis (porque la vida es demasiado corta para ser serio todo el tiempo)
• Opiniones de gente con piel en el juego, no semidioses de redes sociales
• Contenido en portugués, inglés y español — porque los mercados no tienen fronteras`,
      },
      {
        heading: 'João Homem',
        text: `El fundador de Dinheirologia es un trader que aprendió en las calles, no en los libros — aunque también los leyó todos. Su filosofía es simple: "Un hombre necesita ser gentil, controlado, pero necesita representar peligro también."

Todos sus artículos están firmados como "Como Dirigir Uma Mercearia e Umas Coisinhas Que Aprendi Sobre Pescaria" (Cómo Dirigir una Tienda y Unas Cositas que Aprendí Sobre la Pesca) — porque la vida te enseña más que cualquier MBA.`,
      },
    ],
  },
};

export default async function SobrePage({ params }: Props) {
  const { locale } = await params;
  const content = CONTENT[locale] || CONTENT.pt;

  return (
    <div className="max-w-article mx-auto px-4 py-12">
      <h1 className="font-serif text-headline-xl text-navy-900 mb-8 text-center">
        {content.title}
      </h1>

      <div className="border-t-3 border-dollar-800 mb-10" />

      {content.blocks.map((block, i) => (
        <section key={i} className="mb-10">
          <h2 className="font-serif text-headline-md text-navy-900 mb-4">{block.heading}</h2>
          <div className="font-body text-body-lg text-navy-700 whitespace-pre-line leading-relaxed">
            {block.text}
          </div>
          {i < content.blocks.length - 1 && (
            <div className="border-b border-rule-gray mt-10" />
          )}
        </section>
      ))}
    </div>
  );
}
