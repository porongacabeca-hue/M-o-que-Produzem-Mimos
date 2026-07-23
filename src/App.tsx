import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShortcuts } from './components/CategoryShortcuts';
import { Catalog } from './components/Catalog';
import { HistorySection } from './components/HistorySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AiPartyPlanner } from './components/AiPartyPlanner';
import { BudgetDrawer } from './components/BudgetDrawer';
import { ClientAuthModal } from './components/ClientAuthModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { AtelierAdminModal } from './components/AtelierAdminModal';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';
import { Product, ProductCategory, BudgetItem, CustomerUser } from './types';
import { getCurrentCustomerUser, ensureCustomerDocInFirestore } from './lib/ordersService';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ShoppingBag, MessageCircle, UserCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'todos' | 'historia' | 'ia'>('todos');
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => getCurrentCustomerUser());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const localUser = getCurrentCustomerUser();
      if (firebaseUser) {
        // Automatically create or load customer profile in Firestore 'clientes' collection
        const fullUser = await ensureCustomerDocInFirestore(firebaseUser);
        setCurrentUser(fullUser);
      } else if (!localUser) {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  const [cartItems, setCartItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('mimos_budget_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isAtelierAdminOpen, setIsAtelierAdminOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mimos_budget_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const handleSelectCategory = (cat: ProductCategory | 'todos' | 'historia' | 'ia') => {
    setActiveCategory(cat);

    if (cat === 'historia') {
      const element = document.getElementById('historia');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (cat === 'ia') {
      const element = document.getElementById('gerador-ia');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const element = document.getElementById('catalogo');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (
    product: Product,
    quantity: number,
    theme: string,
    childName?: string,
    age?: string,
    notes?: string
  ) => {
    const newItem: BudgetItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      theme: theme || 'Tema a combinar no WhatsApp',
      childName,
      age,
      notes,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleAddCustomIdeaToCart = (
    title: string,
    description: string,
    theme: string,
    honoreeName?: string,
    age?: string
  ) => {
    const customProduct: Product = {
      id: `custom-ia-${Date.now()}`,
      title: `[Mimo IA] ${title}`,
      category: 'festas',
      subCategory: 'caixinhas',
      description,
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
      badge: 'Gerado com IA',
      suggestedQuantities: [10, 20, 30],
      customizationOptions: ['Tema', 'Nome', 'Idade'],
    };

    handleAddToCart(
      customProduct,
      10,
      theme,
      honoreeName,
      age,
      `Ideia sugerida pela Inteligência Artificial Gemini para o tema ${theme}.`
    );
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleLoginSuccess = (user: CustomerUser) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setIsCustomerDashboardOpen(true);
  };

  const handleOrderCreatedFromBudget = (user: CustomerUser) => {
    setCurrentUser(user);
    setIsCustomerDashboardOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-[#ffe4e8] selection:text-[#e63946] flex flex-col justify-between">
      
      {/* Header Bar */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenClientDashboard={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setIsCustomerDashboardOpen(true);
          }
        }}
        onOpenClientLogin={() => setIsAuthModalOpen(true)}
        onOpenAtelierAdmin={() => setIsAtelierAdminOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={() => handleSelectCategory('todos')}
          onOpenAiPlanner={() => handleSelectCategory('ia')}
        />

        {/* Customer Status Banner */}
        <div className="bg-[#ffe4e8]/60 border-y border-pink-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-gray-900">Acompanhamento do Pedido em Tempo Real (Mercado Livre Style):</span>
              <span className="text-gray-600 hidden md:inline">
                Acompanhe o status do seu orçamento, da produção e veja as fotos do produto final no seu painel!
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsCustomerDashboardOpen(true);
                  }
                }}
                className="px-3 py-1 bg-[#e63946] text-white rounded-lg font-bold hover:bg-[#d62839] cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{currentUser ? 'Ver Meus Pedidos' : 'Acessar Área do Cliente'}</span>
              </button>

              <button
                onClick={() => setIsAtelierAdminOpen(true)}
                className="px-2.5 py-1 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 cursor-pointer flex items-center gap-1 text-[11px] shadow-2xs"
                title="Painel Administrativo do Ateliê"
              >
                <Sparkles className="w-3 h-3" />
                <span>Admin Ateliê</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shortcuts for 4 Main Categories */}
        <CategoryShortcuts
          onSelectCategory={(cat) => handleSelectCategory(cat as any)}
        />

        {/* Product Catalog & Budget Cart Request */}
        <Catalog
          products={PRODUCTS}
          selectedCategory={activeCategory === 'historia' || activeCategory === 'ia' ? 'todos' : activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onAddToCart={handleAddToCart}
        />

        {/* Story Section */}
        <HistorySection />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* Virtual AI Assistant Section */}
        <AiPartyPlanner onAddCustomIdeaToCart={handleAddCustomIdeaToCart} />
      </main>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />

      {/* Budget Request Drawer */}
      <BudgetDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreatedFromBudget}
      />

      {/* Client Authentication Modal */}
      <ClientAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Customer Dashboard / Meus Pedidos Modal */}
      <CustomerDashboardModal
        isOpen={isCustomerDashboardOpen}
        onClose={() => setIsCustomerDashboardOpen(false)}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onOpenAtelierAdmin={() => {
          setIsCustomerDashboardOpen(false);
          setIsAtelierAdminOpen(true);
        }}
        onProfileUpdated={(updatedUser) => {
          setCurrentUser(updatedUser);
        }}
        onUserLogout={() => {
          setCurrentUser(null);
          setIsCustomerDashboardOpen(false);
        }}
      />

      {/* Atelier Admin Panel Modal */}
      <AtelierAdminModal
        isOpen={isAtelierAdminOpen}
        onClose={() => setIsAtelierAdminOpen(false)}
      />

      {/* Floating Action Buttons (Mobile & Desktop) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Floating Customer Dashboard Button */}
        <button
          onClick={() => {
            if (!currentUser) setIsAuthModalOpen(true);
            else setIsCustomerDashboardOpen(true);
          }}
          className="w-13 h-13 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border-2 border-white"
          title="Minha Área / Meus Pedidos"
        >
          <UserCheck className="w-6 h-6" />
        </button>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/5511999999999?text=Ol%C3%A1,%20gostaria%20de%20solicitar%20um%20or%C3%A7amento%20de%20mimos%20e%20lembrancinhas!"
          target="_blank"
          rel="noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border-2 border-white"
          title="Falar no WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>

        {/* Floating Budget Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative w-13 h-13 rounded-full bg-[#e63946] hover:bg-[#d62839] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer border-2 border-white"
          title="Ver Carrinho de Orçamento"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center border border-white">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}

