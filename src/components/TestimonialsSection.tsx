import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-white to-pink-50/40 border-t border-[#ffe4e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe4e8] text-[#e63946] text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#e63946]" />
            <span>Opinião de Quem Confia</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Depoimentos de Nossos Clientes
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            A alegria de cada celebração é a nossa maior recompensa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-pink-200 absolute top-5 right-5 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed mb-4">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-pink-50 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#ffe4e8]"
                />
                <div>
                  <h4 className="font-serif font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-[11px] text-[#e63946] font-medium">{t.event}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
