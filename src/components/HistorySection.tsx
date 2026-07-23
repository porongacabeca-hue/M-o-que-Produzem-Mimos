import React from 'react';
import { Heart, Sparkles, Scissors, Smile, Award } from 'lucide-react';

export const HistorySection: React.FC = () => {
  return (
    <section id="historia" className="py-16 bg-white border-t border-[#ffe4e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Craft Studio Image & Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-[#ffe4e8] bg-white">
                <img
                  src="/src/assets/images/mimos_craft_studio_1784757708393.jpg"
                  alt="Ateliê Mãos que Produzem Mimos"
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Decorative floating stats box */}
              <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-pink-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#ffe4e8] text-[#e63946] flex items-center justify-center font-bold">
                  <Heart className="w-6 h-6 fill-[#e63946]" />
                </div>
                <div>
                  <span className="block font-serif font-bold text-gray-900 text-lg">+1.500</span>
                  <span className="text-xs text-gray-500 font-medium">Festas Encantadas</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Warm Trajectory Narrative */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffe4e8] text-[#e63946] text-xs font-bold uppercase tracking-wider">
              <Scissors className="w-4 h-4 rotate-45" />
              <span>Minha História</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              De um Sonho Mimoso para a Mesa da Sua Família
            </h2>

            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
              <p>
                O ateliê <strong className="text-gray-900 font-serif">Mãos que Produzem Mimos</strong> nasceu do desejo de transformar festas em capítulos inesquecíveis da vida. Tudo começou na mesa da nossa própria casa, dobrando a primeira caixinha e amarrando laços com a paciência e a delicadeza de quem faz para os próprios filhos.
              </p>

              <p>
                Acreditamos que uma papelaria personalizada vai muito além do papel: é o brilho nos olhos dos convidados ao chegarem na festa, a recordação guardada com carinho na gaveta dos avós e o sorriso do aniversariante ao ver seu nome em camadas 3D e efeito shaker no topo do bolo.
              </p>

              <p>
                Cada corte de precisão, cada pedrinha colada e cada fita de cetim selecionada passa pelas nossas mãos com uma missão simples: <em className="text-[#e63946] font-semibold">entregar o carinho em forma de mimo.</em>
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-pink-100">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-[#e63946] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Papel Premium</h4>
                  <p className="text-xs text-gray-500">Alta gramatura (offset 180g) e impressão fotográfica.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-[#e63946] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Efeitos 3D & Shaker</h4>
                  <p className="text-xs text-gray-500">Acabamentos com glitter, acrílico e pedrarias.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-pink-50 text-[#e63946] shrink-0">
                  <Smile className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Atendimento Humano</h4>
                  <p className="text-xs text-gray-500">Acompanhamento direto via WhatsApp.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
