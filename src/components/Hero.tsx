import React from 'react';
import { Sparkles, Heart, Gift, MessageCircle, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreCatalog: () => void;
  onOpenAiPlanner: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onOpenAiPlanner }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ffe4e8]/60 via-white to-pink-50/30 py-12 lg:py-16">
      {/* Decorative craft background elements */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-12 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-pink-200 text-[#e63946] text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Ateliê de Papelaria Personalizada & Mimos</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Amor em Cada Detalhe,{' '}
              <span className="text-[#e63946] relative inline-block">
                Lembranças
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-pink-300" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,5 100,15" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              para Toda a Vida
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Transformamos suas celebrações em cenários inesquecíveis. Caixinhas milk, topos de bolo shaker 3D, tubetes artesanais, convites de casamento e lembrancinhas feitas à mão com o carinho que sua família merece.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#e63946] hover:bg-[#d62839] text-white font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <Gift className="w-5 h-5" />
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAiPlanner}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-pink-50 text-[#e63946] border-2 border-pink-200 hover:border-[#e63946] font-semibold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Assistente Virtual IA</span>
              </button>
            </div>

            {/* Value Proposition Badges */}
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-pink-100 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <span className="block font-serif font-bold text-lg text-gray-900">100%</span>
                <span className="text-xs text-gray-500 font-medium">Feito à Mão</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif font-bold text-lg text-[#e63946]">Offset 180g</span>
                <span className="text-xs text-gray-500 font-medium">Papelaria Premium</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif font-bold text-lg text-emerald-600">WhatsApp</span>
                <span className="text-xs text-gray-500 font-medium">Orçamento Rápido</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Banner Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="/src/assets/images/mimos_hero_banner_1784757699639.jpg"
                  alt="Mãos que Produzem Mimos - Papelaria Personalizada"
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] sm:h-[440px] object-cover hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating Image Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-pink-100 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                        Kit Caixinhas & Mimos de Luxo
                      </h4>
                      <p className="text-xs text-gray-600">
                        Laços duplos de cetim, apliques 3D e acabamento impecável.
                      </p>
                    </div>
                    <span className="p-2 rounded-full bg-[#ffe4e8] text-[#e63946]">
                      <Heart className="w-5 h-5 fill-[#e63946]" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative floating badge top right */}
              <div className="absolute -top-4 -right-4 bg-amber-400 text-gray-900 px-4 py-2 rounded-2xl font-bold text-xs shadow-lg rotate-3 flex items-center gap-1.5 border border-white">
                <Sparkles className="w-4 h-4 fill-gray-900" />
                <span>Topos Shaker & Mimos 3D</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
