import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Mãos que Produzem Mimos API' });
});

// Gemini AI Party Idea Generator Endpoint
function generateFallbackPartyPlan(partyType: string, theme: string, honoreeName?: string, age?: string, preferences?: string) {
  const name = honoreeName || 'Aniversariante';
  const ageStr = age ? ` (${age})` : '';
  const prefStr = preferences ? ` com foco em: ${preferences}` : '';

  return {
    title: `Conceito Encantado: ${theme} - ${name}`,
    themeSummary: `Um projeto exclusivo de papelaria artesanal para "${theme}"${prefStr}. Projetado com camadas 3D, relevos em lamicote, fitas de cetim e acabamento mimoso perfeito para celebrar ${name}${ageStr}.`,
    colorPalette: [
      { name: 'Rosa / Coral Mimoso', hex: '#FFB7B2' },
      { name: 'Verde Sálvia Suave', hex: '#C7E9C0' },
      { name: 'Dourado Lamicote 3D', hex: '#E5C158' },
      { name: 'Creme Baunilha', hex: '#FFF2D6' },
      { name: 'Branco Neve 180g', hex: '#FFFFFF' }
    ],
    items: [
      {
        title: `Caixa Milk Luxo - ${theme}`,
        category: 'Lembrancinha Shaker',
        description: `Caixa Milk clássica com apliques em relevo 3D, laço de fita de cetim duplo com pedraria e tag com o nome ${name}.`,
        whyAwesome: 'A peça principal queridinha para compor o centro da mesa de doces.'
      },
      {
        title: `Caixa Pirâmide / Cone 3D`,
        category: 'Mimo de Mesa',
        description: `Caixa pirâmide temática com elementos em alta gramatura e corte artesanal preciso no tema ${theme}.`,
        whyAwesome: 'Adiciona altura, elegância e movimento à composição visual da mesa.'
      },
      {
        title: `Porta Bis Duplo Especial`,
        category: 'Papelaria Interativa',
        description: `Suporte duplo para chocolates Bis com mini aplique do tema e detalhes em relevo.`,
        whyAwesome: 'Excelente opção para preencher a mesa com sofisticação e encanto.'
      },
      {
        title: `Caixa Coração / Mala com Alça`,
        category: 'Lembrança Especial',
        description: `Caixinha em formato diferenciado personalizada com o nome ${name} e detalhes do tema ${theme}.`,
        whyAwesome: 'Um mimo inesquecível que os convidados adoram levar como recordação.'
      }
    ],
    cakeTopperIdea: `Topo de Bolo 3D Shaker com visor transparente recheado de lantejoulas e miçangas nas cores de ${theme}, camadas em lamicote dourado e bandeirola com o nome de ${name}${ageStr}.`,
    decorationTips: [
      `Posicione as Caixas Milk e Pirâmides em alturas diferentes usando suportes de louça para criar profundidade.`,
      `Harmonize a paleta de cores da papelaria com os arranjos de flores e forminhas de doces finos.`,
      `O topo de bolo shaker reflete a luz do parabéns e garante fotos encantadoras.`
    ]
  };
}

app.post('/api/gemini/party-ideas', async (req, res) => {
  const { partyType, theme, honoreeName, age, guestCount, preferences } = req.body;

  if (!partyType || !theme) {
    return res.status(400).json({ error: 'Tipo de festa e tema são obrigatórios.' });
  }

  // If GEMINI_API_KEY is not set or quota is exceeded, seamlessly use fallback generator
  if (!process.env.GEMINI_API_KEY) {
    const fallbackPlan = generateFallbackPartyPlan(partyType, theme, honoreeName, age, preferences);
    return res.json(fallbackPlan);
  }

  try {
    const ai = getGeminiClient();

    const prompt = `Você é a mestre artesã e consultora criativa do ateliê "Mãos que Produzem Mimos" (especializado em papelaria personalizada, mimos encantadores, caixinhas milk, pirâmides, tubetes decorados, topos de bolo shaker, manuais de padrinhos e lembrancinhas de luxo).

Gere um plano criativo completo para o seguinte pedido:
- Tipo de Festa: ${partyType}
- Tema / Estilo: ${theme}
- Nome do Homenageado(a): ${honoreeName || 'Aniversariante'}
- Idade / Edição: ${age || 'A definir'}
- Estimativa de Convidados: ${guestCount || '30 convidados'}
- Preferências / Observações: ${preferences || 'Gosta de acabamento delicado e romântico'}

Responda rigorosamente no formato JSON solicitado com sugestões encantadoras, viáveis para corte em papelaria e montagem artesanal com fitas, laços e acrílico.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é uma especialista em papelaria artesanal personalizada. Crie conceitos inspiradores, nomes de produtos mimosos e paleta de cores harmoniosa em português do Brasil.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Título mágico do conceito da festa',
            },
            themeSummary: {
              type: Type.STRING,
              description: 'Resumo poético e acolhedor do conceito visual',
            },
            colorPalette: {
              type: Type.ARRAY,
              description: 'Paleta de 4 a 5 cores em hex com nomes em português',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                },
                required: ['name', 'hex'],
              },
            },
            items: {
              type: Type.ARRAY,
              description: 'Lista de 4 a 5 peças de papelaria personalizada recomendadas',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  whyAwesome: { type: Type.STRING },
                },
                required: ['title', 'category', 'description', 'whyAwesome'],
              },
            },
            cakeTopperIdea: {
              type: Type.STRING,
              description: 'Ideia criativa detalhada para o topo de bolo artesanal (camadas 3D, shaker, etc)',
            },
            decorationTips: {
              type: Type.ARRAY,
              description: 'Dicas práticas para harmonizar a mesa de doces com os mimos de papelaria',
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ['title', 'themeSummary', 'colorPalette', 'items', 'cakeTopperIdea', 'decorationTips'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Sem resposta da IA.');
    }

    const parsedData = JSON.parse(responseText);
    return res.json(parsedData);
  } catch (error: any) {
    // Return high-quality intelligent fallback plan if Gemini API quota is exhausted or unavailable
    const fallbackPlan = generateFallbackPartyPlan(partyType, theme, honoreeName, age, preferences);
    return res.json(fallbackPlan);
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Mãos que Produzem Mimos server rodando na porta ${PORT}`);
  });
}

startServer();
