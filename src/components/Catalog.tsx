import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  Heart, 
  Info,
  Gift
} from 'lucide-react';
import { Product, ProductCategory, ProductSubCategory } from '../types';

interface CatalogProps {
  products: Product[];
  selectedCategory: ProductCategory | 'todos';
  onSelectCategory: (cat: ProductCategory | 'todos') => void;
  onAddToCart: (product: Product, quantity: number, theme: string, childName?: string, age?: string, notes?: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<ProductSubCategory | 'todas'>('todas');
  
  // Customization Modal State
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(10);
  const [modalTheme, setModalTheme] = useState('');
  const [modalChildName, setModalChildName] = useState('');
  const [modalAge, setModalAge] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [addedToastProduct, setAddedToastProduct] = useState<string | null>(null);

  // Filter Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
        return false;
      }
      // Subcategory Filter
      if (selectedSubCategory !== 'todas' && product.subCategory !== selectedSubCategory) {
        return false;
      }
      // Search Term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [products, selectedCategory, selectedSubCategory, searchTerm]);

  const handleOpenAddModal = (product: Product) => {
    setActiveModalProduct(product);
    setModalQuantity(product.suggestedQuantities[0] || 10);
    setModalTheme('');
    setModalChildName('');
    setModalAge('');
    setModalNotes('');
  };

  const handleConfirmAddToCart = () => {
    if (!activeModalProduct) return;

    onAddToCart(
      activeModalProduct,
      modalQuantity,
      modalTheme || 'Tema a combinar no WhatsApp',
      modalChildName,
      modalAge,
      modalNotes
    );

    setAddedToastProduct(activeModalProduct.title);
    setTimeout(() => setAddedToastProduct(null), 3000);
    setActiveModalProduct(null);
  };

  return (
    <section id="catalogo" className="py-12 bg-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-pink-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe4e8] text-[#e63946] text-xs font-bold uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Catálogo Interativo</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Escolha os Mimos do seu Orçamento
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Todos os nossos produtos são 100% personalizáveis com o nome, idade e tema desejado.
            </p>
          </div>

          {/* Toast Notification */}
          {addedToastProduct && (
            <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4" />
              <span>Adicionado ao orçamento: {addedToastProduct}!</span>
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-pink-100 mb-8 space-y-4">
          
          {/* Search Input & Main Category Tabs */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => onSelectCategory('todos')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'todos'
                    ? 'bg-[#e63946] text-white shadow-xs'
                    : 'bg-pink-50 text-gray-700 hover:bg-[#ffe4e8] hover:text-[#e63946]'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => onSelectCategory('festas')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'festas'
                    ? 'bg-[#e63946] text-white shadow-xs'
                    : 'bg-pink-50 text-gray-700 hover:bg-[#ffe4e8] hover:text-[#e63946]'
                }`}
              >
                Festas & Datas
              </button>
              <button
                onClick={() => onSelectCategory('casamentos')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'casamentos'
                    ? 'bg-[#e63946] text-white shadow-xs'
                    : 'bg-pink-50 text-gray-700 hover:bg-[#ffe4e8] hover:text-[#e63946]'
                }`}
              >
                Casamentos & Corp.
              </button>
              <button
                onClick={() => onSelectCategory('papelaria')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'papelaria'
                    ? 'bg-[#e63946] text-white shadow-xs'
                    : 'bg-pink-50 text-gray-700 hover:bg-[#ffe4e8] hover:text-[#e63946]'
                }`}
              >
                Papelaria Criativa
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mimosa, caixinha, topo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] bg-pink-50/30"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-pink-100/70 text-xs text-gray-600">
            <span className="font-bold flex items-center gap-1 text-gray-400 shrink-0 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
            </span>

            {[
              { id: 'todas', label: 'Todas as Peças' },
              { id: 'caixinhas', label: 'Caixinhas Milk/Cone' },
              { id: 'topos_bolo', label: 'Topos de Bolo 3D' },
              { id: 'tubetes', label: 'Tubetes' },
              { id: 'lembrancinhas', label: 'Lembrancinhas' },
              { id: 'kits_festa', label: 'Kits Completos' },
              { id: 'convites', label: 'Convites & Manuais' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubCategory(sub.id as any)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  selectedSubCategory === sub.id
                    ? 'border-[#e63946] text-[#e63946] font-bold bg-pink-50'
                    : 'border-pink-100 text-gray-600 hover:border-pink-300 hover:bg-white'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8">
            <Gift className="w-12 h-12 text-pink-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-gray-800">Nenhum mimo encontrado</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Tente buscar por outros termos ou redefinir seus filtros de categoria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubCategory('todas');
                onSelectCategory('todos');
              }}
              className="mt-4 px-4 py-2 bg-[#ffe4e8] text-[#e63946] text-xs font-bold rounded-xl hover:bg-pink-200 transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-xs hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image & Badges */}
                <div className="relative h-52 overflow-hidden bg-pink-50">
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#e63946] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                      {product.badge}
                    </span>
                  )}

                  <button
                    onClick={() => handleOpenAddModal(product)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-[#e63946] rounded-full shadow-xs hover:scale-110 transition-all cursor-pointer"
                    title="Favoritar / Ver Opções"
                  >
                    <Heart className="w-4 h-4 fill-pink-100 text-[#e63946]" />
                  </button>
                </div>

                {/* Product Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-pink-500 tracking-wider uppercase block mb-1">
                      {product.category === 'festas' ? 'Festa & Comemoração' : product.category === 'casamentos' ? 'Casamento & Corp' : 'Papelaria Criativa'}
                    </span>

                    <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#e63946] transition-colors leading-snug mb-2">
                      {product.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Add to Budget Button */}
                  <div className="pt-3 border-t border-pink-50 space-y-2">
                    <button
                      onClick={() => handleOpenAddModal(product)}
                      className="w-full py-2.5 px-4 bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-semibold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar ao Orçamento</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Customization & Add to Budget Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-[#ffe4e8] p-5 flex items-center justify-between border-b border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-[#e63946] flex items-center justify-center font-bold">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-base">
                    Adicionar ao Orçamento
                  </h3>
                  <p className="text-xs text-[#e63946] font-medium">
                    Personalização sem compromisso
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalProduct(null)}
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-700">
              
              {/* Product Info Preview */}
              <div className="flex items-start gap-4 p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{activeModalProduct.title}</h4>
                  <p className="text-gray-600 text-[11px] mt-0.5 line-clamp-2">{activeModalProduct.description}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block font-bold text-gray-900 mb-1.5">
                  Quantidade Desejada:
                </label>
                <div className="flex items-center gap-2">
                  {activeModalProduct.suggestedQuantities.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setModalQuantity(q)}
                      className={`px-3 py-1.5 rounded-xl border font-bold cursor-pointer transition-colors ${
                        modalQuantity === q
                          ? 'bg-[#e63946] text-white border-[#e63946]'
                          : 'border-pink-200 text-gray-700 bg-white hover:bg-pink-50'
                      }`}
                    >
                      {q} un
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    value={modalQuantity}
                    onChange={(e) => setModalQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-1.5 rounded-xl border border-pink-200 text-center font-bold text-gray-800"
                  />
                </div>
              </div>

              {/* Theme Input */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  Tema da Festa / Estilo Visual:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jardim Encantado, Safari, BOHO Chic, Mêsversário..."
                  value={modalTheme}
                  onChange={(e) => setModalTheme(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] bg-white text-xs"
                />
              </div>

              {/* Child Name & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Nome do Homenageado(a):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Helena, Lucas"
                    value={modalChildName}
                    onChange={(e) => setModalChildName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-900 mb-1">
                    Idade / Edição:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 3 Anos, Batizado"
                    value={modalAge}
                    onChange={(e) => setModalAge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] bg-white text-xs"
                  />
                </div>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="block font-bold text-gray-900 mb-1">
                  Observações ou Ajustes de Cores:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de laços na cor rosa bebê e detalhes dourados..."
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] bg-white text-xs"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveModalProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmAddToCart}
                className="px-6 py-2.5 bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Confirmar Mimo</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
