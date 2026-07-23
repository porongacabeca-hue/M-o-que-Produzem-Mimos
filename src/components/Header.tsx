import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Sparkles,
  Scissors,
  UserCheck,
  User
} from 'lucide-react';
import { ProductCategory, CustomerUser } from '../types';

interface HeaderProps {
  activeCategory: ProductCategory | 'todos' | 'historia' | 'ia';
  onSelectCategory: (cat: ProductCategory | 'todos' | 'historia' | 'ia') => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser?: CustomerUser | null;
  onOpenClientDashboard: () => void;
  onOpenClientLogin: () => void;
  onOpenAtelierAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenClientDashboard,
  onOpenClientLogin,
  onOpenAtelierAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (cat: ProductCategory | 'todos' | 'historia' | 'ia') => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ffe4e8] shadow-xs">
      {/* Top Banner */}
      <div className="bg-[#ffe4e8] text-[#e63946] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Heart className="w-3.5 h-3.5 fill-[#e63946]" />
        <span>Papelaria Personalizada feita à mão com carinho • Envio para todo o Brasil</span>
        <Heart className="w-3.5 h-3.5 fill-[#e63946]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('todos')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-full bg-[#ffe4e8] text-[#e63946] flex items-center justify-center shadow-xs border border-pink-200 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-tight">
                Mãos que Produzem
              </span>
              <span className="block text-xs font-sans font-semibold tracking-widest text-[#e63946] uppercase">
                Mimos & Lembrancinhas
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('festas')}
              className={`px-3.5 py-2 rounded-full transition-colors cursor-pointer ${
                activeCategory === 'festas' 
                  ? 'bg-[#ffe4e8] text-[#e63946] font-semibold' 
                  : 'text-gray-700 hover:text-[#e63946] hover:bg-pink-50'
              }`}
            >
              Festas
            </button>

            <button
              onClick={() => handleNavClick('casamentos')}
              className={`px-3.5 py-2 rounded-full transition-colors cursor-pointer ${
                activeCategory === 'casamentos' 
                  ? 'bg-[#ffe4e8] text-[#e63946] font-semibold' 
                  : 'text-gray-700 hover:text-[#e63946] hover:bg-pink-50'
              }`}
            >
              Casamentos
            </button>

            <button
              onClick={() => handleNavClick('papelaria')}
              className={`px-3.5 py-2 rounded-full transition-colors cursor-pointer ${
                activeCategory === 'papelaria' 
                  ? 'bg-[#ffe4e8] text-[#e63946] font-semibold' 
                  : 'text-gray-700 hover:text-[#e63946] hover:bg-pink-50'
              }`}
            >
              Papelaria Criativa
            </button>

            <button
              onClick={() => handleNavClick('historia')}
              className={`px-3.5 py-2 rounded-full transition-colors cursor-pointer ${
                activeCategory === 'historia' 
                  ? 'bg-[#ffe4e8] text-[#e63946] font-semibold' 
                  : 'text-gray-700 hover:text-[#e63946] hover:bg-pink-50'
              }`}
            >
              Minha História
            </button>

            <button
              onClick={() => handleNavClick('ia')}
              className={`px-3.5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 border ${
                activeCategory === 'ia'
                  ? 'bg-[#e63946] text-white border-[#e63946] shadow-sm'
                  : 'bg-pink-50/80 text-[#e63946] border-pink-200 hover:bg-[#ffe4e8]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerador IA</span>
            </button>
          </nav>

          {/* Social Icons + Customer Area + Budget Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Customer Area / Meus Pedidos Button */}
            {currentUser ? (
              <button
                onClick={onOpenClientDashboard}
                className="px-3.5 py-2 rounded-full bg-pink-100/80 border border-pink-200 text-gray-800 hover:bg-[#ffe4e8] transition-all cursor-pointer flex items-center gap-2 text-xs font-bold shadow-2xs"
                title="Acessar Painel do Cliente / Meus Pedidos"
              >
                <UserCheck className="w-4 h-4 text-[#e63946]" />
                <span className="hidden md:inline text-gray-900">{currentUser.name.split(' ')[0]}</span>
                <span className="text-[10px] bg-[#e63946] text-white px-2 py-0.5 rounded-full font-bold">
                  Meus Pedidos
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenClientLogin}
                className="px-3.5 py-2 rounded-full bg-white border border-pink-300 text-[#e63946] hover:bg-[#ffe4e8] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
              >
                <User className="w-4 h-4 text-[#e63946]" />
                <span>Área do Cliente</span>
              </button>
            )}

            {/* Cart / Orçamento Drawer Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#e63946] text-white hover:bg-[#d62839] transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title="Ver Carrinho de Orçamento"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-gray-900 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-[#e63946] hover:bg-pink-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#ffe4e8] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenClientDashboard();
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl bg-pink-50 border border-pink-200 text-[#e63946] font-bold text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>Área do Cliente / Meus Pedidos</span>
            </span>
            <span className="text-xs bg-[#e63946] text-white px-2 py-0.5 rounded-full">Status Vivo</span>
          </button>

          <button
            onClick={() => handleNavClick('todos')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm ${
              activeCategory === 'todos' ? 'bg-[#ffe4e8] text-[#e63946] font-bold' : 'text-gray-700'
            }`}
          >
            🏠 Ver Todos os Mimos
          </button>
          <button
            onClick={() => handleNavClick('festas')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm ${
              activeCategory === 'festas' ? 'bg-[#ffe4e8] text-[#e63946] font-bold' : 'text-gray-700'
            }`}
          >
            🎉 Festas & Datas Comemorativas
          </button>
          <button
            onClick={() => handleNavClick('casamentos')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm ${
              activeCategory === 'casamentos' ? 'bg-[#ffe4e8] text-[#e63946] font-bold' : 'text-gray-700'
            }`}
          >
            💍 Casamentos & Corporativo
          </button>
          <button
            onClick={() => handleNavClick('papelaria')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm ${
              activeCategory === 'papelaria' ? 'bg-[#ffe4e8] text-[#e63946] font-bold' : 'text-gray-700'
            }`}
          >
            ✂️ Papelaria Criativa (caixinhas, topos, tubetes)
          </button>
          <button
            onClick={() => handleNavClick('historia')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm ${
              activeCategory === 'historia' ? 'bg-[#ffe4e8] text-[#e63946] font-bold' : 'text-gray-700'
            }`}
          >
            📖 Minha História
          </button>
          <button
            onClick={() => handleNavClick('ia')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
              activeCategory === 'ia' ? 'bg-[#e63946] text-white font-bold' : 'bg-pink-50 text-[#e63946]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Assistente Virtual IA (Gerador de Ideias)
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
