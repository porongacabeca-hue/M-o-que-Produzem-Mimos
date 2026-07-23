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
app.post('/api/gemini/party-ideas', async (req, res) => {
  try {
    const { partyType, theme, honoreeName, age, guestCount, preferences } = req.body;

    if (!partyType || !theme) {
      return res.status(400).json({ error: 'Tipo de festa e tema são obrigatórios.' });
    }

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
      model: 'gemini-3.6-flash',
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
    console.error('Erro na API de Ideias de Festas:', error);
    return res.status(500).json({
      error: 'Não foi possível gerar as ideias com IA no momento. Verifique se a chave GEMINI_API_KEY está configurada nos Secrets.',
      details: error?.message || 'Erro interno no servidor.',
    });
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
