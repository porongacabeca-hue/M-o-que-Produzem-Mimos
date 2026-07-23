import React from 'react';
import { PartyPopper, Heart, Scissors, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryShortcutsProps {
  onSelectCategory: (category: ProductCategory | 'ia') => void;
}

export const CategoryShortcuts: React.FC<CategoryShortcutsProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'festas' as ProductCategory,
      title: 'Festas & Datas Comemorativas',
      subtitle: 'Kits infantis, temas encantadores, mês de aniversário e datas especiais',
      icon: PartyPopper,
      color: 'bg-pink-100 text-[#e63946]',
      border: 'hover:border-[#e63946]',
      badge: 'Popular',
    },
    {
      id: 'casamentos' as ProductCategory,
      title: 'Casamentos & Corporativo',
      subtitle: 'Manual dos padrinhos, convites rústico chic, lembranças empresariais',
      icon: Heart,
      color: 'bg-red-100 text-[#e63946]',
      border: 'hover:border-[#e63946]',
      badge: 'Elegante',
    },
    {
      id: 'papelaria' as ProductCategory,
      title: 'Papelaria Criativa',
      subtitle: 'Caixinhas Milk, Topos de Bolo Shaker 3D, Tubetes, Sacolinhas e Porta Bis',
      icon: Scissors,
      color: 'bg-amber-100 text-amber-700',
      border: 'hover:border-amber-400',
      badge: 'Ateliê 3D',
    },
    {
      id: 'ia' as const,
      title: 'Assistente IA (Ideias de Festas)',
      subtitle: 'Informe o tipo de festa e tema para receber sugestões de mimos e paleta de cores com Gemini',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      border: 'hover:border-purple-400',
      badge: 'Inteligência Artificial',
      isAi: true,
    },
  ];

  return (
    <section className="py-10 bg-white border-y border-[#ffe4e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#e63946] tracking-widest uppercase block mb-1">
            Nossas Especialidades
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Explore Nossas Categorias de Mimos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative bg-pink-50/40 hover:bg-white rounded-2xl p-6 border-2 border-pink-100 transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-between ${cat.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${cat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      cat.isAi 
                        ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                        : 'bg-white text-gray-600 border border-pink-200'
                    }`}>
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[#e63946] transition-colors mb-2">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-sans mb-4">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-pink-100/80 flex items-center justify-between text-xs font-bold text-[#e63946]">
                  <span>{cat.isAi ? 'Consultar IA' : 'Ver Produtos'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
