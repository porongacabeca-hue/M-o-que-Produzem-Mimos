import React from 'react';
import { 
  Heart, 
  Scissors, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  MapPin, 
  Mail, 
  Phone,
  Sparkles
} from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'todos' | 'historia' | 'ia') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-gradient-to-b from-white to-[#ffe4e8]/50 border-t border-[#ffe4e8] pt-12 pb-8 text-gray-700 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffe4e8] text-[#e63946] flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-gray-900 leading-tight">
                  Mãos que Produzem
                </span>
                <span className="block text-[10px] font-sans font-semibold tracking-widest text-[#e63946] uppercase">
                  Mimos & Lembrancinhas
                </span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans">
              Ateliê de papelaria personalizada, caixinhas mimosas, topos de bolo shaker 3D e lembrancinhas encantadoras feitas à mão com amor em cada detalhe.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-pink-200 text-[#e63946] hover:bg-[#e63946] hover:text-white transition-colors flex items-center justify-center"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-pink-200 text-[#e63946] hover:bg-[#e63946] hover:text-white transition-colors flex items-center justify-center"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white border border-pink-200 text-[#e63946] hover:bg-[#e63946] hover:text-white transition-colors flex items-center justify-center font-bold"
                title="X (Twitter)"
              >
                X
              </a>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors flex items-center justify-center"
                title="WhatsApp Direct Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-3">Menu de Navegação</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onSelectCategory('festas')}
                  className="hover:text-[#e63946] transition-colors cursor-pointer"
                >
                  🎉 Festas & Datas Comemorativas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('casamentos')}
                  className="hover:text-[#e63946] transition-colors cursor-pointer"
                >
                  💍 Casamentos & Corporativo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('papelaria')}
                  className="hover:text-[#e63946] transition-colors cursor-pointer"
                >
                  ✂️ Papelaria Criativa (caixinhas, topos, tubetes)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('historia')}
                  className="hover:text-[#e63946] transition-colors cursor-pointer"
                >
                  📖 Minha História
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('ia')}
                  className="hover:text-purple-700 font-semibold text-purple-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Assistente Virtual IA
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Specialties */}
          <div>
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-3">Nossos Mimos</h4>
            <ul className="space-y-1.5 text-gray-600">
              <li>• Caixinhas Milk com Laço Duplo</li>
              <li>• Topos de Bolo Shaker Interativos</li>
              <li>• Tubetes Decorados com Saia de Cetim</li>
              <li>• Caixas Pirâmide & Sushi 3D</li>
              <li>• Manuais dos Padrinhos de Casamento</li>
              <li>• Lembrancinhas de Batizado com Terço</li>
            </ul>
          </div>

          {/* Col 4: Contact & Atendimento */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-gray-900 text-sm mb-3">Atendimento Acolhedor</h4>
            
            <div className="flex items-start gap-2.5 text-gray-600">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>WhatsApp Direct: (11) 99999-9999</span>
            </div>

            <div className="flex items-start gap-2.5 text-gray-600">
              <Mail className="w-4 h-4 text-[#e63946] shrink-0 mt-0.5" />
              <span>contato@maosqueproduzemmimos.com.br</span>
            </div>

            <div className="flex items-start gap-2.5 text-gray-600">
              <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <span>Ateliê com envio expresso para todo o Brasil.</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-pink-200/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Mãos que Produzem Mimos. Feito com</span>
            <Heart className="w-3.5 h-3.5 fill-[#e63946] text-[#e63946]" />
            <span>para suas celebrações.</span>
          </div>

          <p className="text-gray-400">
            Papelaria Personalizada & Lembrancinhas com IA
          </p>
        </div>

      </div>
    </footer>
  );
};
