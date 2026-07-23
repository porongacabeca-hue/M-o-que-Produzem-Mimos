import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Loader2, 
  Palette, 
  Gift, 
  CheckCircle2, 
  Plus, 
  AlertCircle,
  Lightbulb,
  PartyPopper
} from 'lucide-react';
import { PartyIdeaRequest, PartyIdeaResponse, Product } from '../types';

interface AiPartyPlannerProps {
  onAddCustomIdeaToCart: (
    title: string,
    description: string,
    theme: string,
    honoreeName?: string,
    age?: string
  ) => void;
}

export const AiPartyPlanner: React.FC<AiPartyPlannerProps> = ({ onAddCustomIdeaToCart }) => {
  const [formData, setFormData] = useState<PartyIdeaRequest>({
    partyType: 'Aniversário Infantil',
    theme: '',
    honoreeName: '',
    age: '',
    guestCount: '30 convidados',
    preferences: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ideaResult, setIdeaResult] = useState<PartyIdeaResponse | null>(null);
  const [addedItemTitles, setAddedItemTitles] = useState<string[]>([]);

  const partyTypeOptions = [
    'Aniversário Infantil',
    'Chá de Bebê / Chá Revelação',
    'Batizado & Primeira Comunhão',
    'Casamento & Noivado',
    'Aniversário 15 Anos',
    'Evento Corporativo & Fim de Ano',
    'Mêsversário',
  ];

  const presetThemes = [
    'Bosque Encantado',
    'Safari Baby / Jardim',
    'Princesas / Reino Encantado',
    'BOHO Chic Floral',
    'Super-Heróis Retro',
    'Astronauta & Galáxia',
    'Aventuras no Mar / Sereia',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.theme.trim()) {
      setError('Por favor, digite ou selecione um tema/estilo para a festa.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/party-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao comunicar com o servidor.');
      }

      setIdeaResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao gerar ideias de festa com IA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdeaItemToCart = (itemTitle: string, itemDesc: string) => {
    onAddCustomIdeaToCart(
      itemTitle,
      itemDesc,
      formData.theme,
      formData.honoreeName,
      formData.age
    );
    setAddedItemTitles((prev) => [...prev, itemTitle]);
  };

  return (
    <section id="gerador-ia" className="py-14 bg-gradient-to-b from-[#ffe4e8]/40 via-white to-pink-50/50 border-t border-[#ffe4e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
            <span>Inteligência Artificial Google Gemini</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Assistente Virtual - Gerador de Ideias de Festas
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Dúvidas sobre como decorar a mesa de mimos? Informe o tema e o tipo de celebração que a nossa IA vai criar uma consultoria personalizada com paleta de cores e mimos perfeitos!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-pink-200 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-gray-700">
              
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  1. Tipo de Festa / Celebração:
                </label>
                <select
                  value={formData.partyType}
                  onChange={(e) => setFormData({ ...formData, partyType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-xs font-medium focus:outline-hidden focus:border-[#e63946]"
                >
                  {partyTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  2. Estilo ou Tema Desejado: *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Bosque Encantado, Dinossauros Baby, Minimalista Floral..."
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946] bg-pink-50/20"
                />

                {/* Preset suggestions pills */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-gray-400 self-center mr-1">Sugestões:</span>
                  {presetThemes.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: preset })}
                      className="text-[10px] px-2 py-1 rounded-lg bg-pink-50 hover:bg-[#ffe4e8] text-gray-700 hover:text-[#e63946] border border-pink-100 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Nome do Homenageado(a):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Beatriz"
                    value={formData.honoreeName}
                    onChange={(e) => setFormData({ ...formData, honoreeName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946] bg-pink-50/20"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Idade / Ano:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1 Aninho"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946] bg-pink-50/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  3. Preferências de Acabamento & Mimos:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de bastante efeito shaker, laços duplos e cores em tons pastéis..."
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946] bg-pink-50/20"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-[#e63946] hover:bg-[#d62839] disabled:bg-gray-300 text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Criando Ideias com a IA Gemini...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Gerar Ideias de Mimos com IA</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Results Display Column */}
          <div className="lg:col-span-7 space-y-6">
            {!ideaResult && !loading && (
              <div className="bg-white p-8 rounded-3xl border border-pink-100 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-50 text-[#e63946] flex items-center justify-center mx-auto">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Sua Consultoria Criativa Aparecerá Aqui
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Preencha o formulário ao lado com o tema da sua festa e clique em "Gerar Ideias de Mimos com IA". A IA vai sugerir combinações encantadoras de papelaria artesanal para você!
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white p-12 rounded-3xl border border-pink-100 shadow-sm text-center space-y-4 animate-pulse">
                <Sparkles className="w-10 h-10 text-[#e63946] animate-bounce mx-auto" />
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Nossa IA está desenhando seu projeto mimoso...
                </h3>
                <p className="text-xs text-gray-500">
                  Analisando temas, paletas harmoniosas e recortes 3D especiais.
                </p>
              </div>
            )}

            {ideaResult && !loading && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-200 shadow-xl space-y-6 animate-in fade-in duration-300">
                
                {/* Result Header */}
                <div className="border-b border-pink-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                      Plano Personalizado IA
                    </span>
                    <span className="text-xs text-gray-400 font-medium">Mãos que Produzem Mimos</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 mt-2">
                    {ideaResult.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mt-1 italic leading-relaxed">
                    "{ideaResult.themeSummary}"
                  </p>
                </div>

                {/* Color Palette */}
                <div>
                  <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
                    <Palette className="w-4 h-4 text-[#e63946]" />
                    <span>Paleta de Cores Recomendada:</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ideaResult.colorPalette.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-pink-50/50 rounded-xl border border-pink-100">
                        <span 
                          className="w-6 h-6 rounded-full border border-black/10 shadow-xs shrink-0" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <span className="block font-bold text-[11px] text-gray-800">{color.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{color.hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cake Topper Idea */}
                <div className="bg-[#ffe4e8]/50 p-4 rounded-2xl border border-pink-200">
                  <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 mb-1">
                    <PartyPopper className="w-4 h-4 text-[#e63946]" />
                    <span>Conceito do Topo de Bolo Shaker 3D:</span>
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {ideaResult.cakeTopperIdea}
                  </p>
                </div>

                {/* Suggested Custom Paper Craft Items */}
                <div>
                  <h4 className="font-serif font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
                    <Gift className="w-4 h-4 text-[#e63946]" />
                    <span>Peças de Papelaria Criativas Sugeridas:</span>
                  </h4>

                  <div className="space-y-3">
                    {ideaResult.items.map((item, idx) => {
                      const isAdded = addedItemTitles.includes(item.title);
                      return (
                        <div key={idx} className="p-4 rounded-2xl border border-pink-100 bg-gray-50/50 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-gray-900">{item.title}</span>
                              <span className="text-[10px] bg-pink-100 text-[#e63946] px-2 py-0.5 rounded-md font-semibold">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            <p className="text-[11px] text-emerald-700 font-medium mt-1">✨ Por que encanta: {item.whyAwesome}</p>
                          </div>

                          <button
                            onClick={() => handleAddIdeaItemToCart(item.title, item.description)}
                            disabled={isAdded}
                            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-[#e63946] hover:bg-[#d62839] text-white shadow-xs'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>No Orçamento</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Adicionar ao Orçamento</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Decoration Tips */}
                <div className="pt-2 border-t border-pink-100">
                  <h4 className="font-bold text-xs text-gray-900 mb-2">Dicas de Harmonização da Mesa:</h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {ideaResult.decorationTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#e63946] font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
