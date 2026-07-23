import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  MessageCircle, 
  LogOut, 
  Plus, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Gift,
  Settings
} from 'lucide-react';
import { CustomerUser, OrderModel } from '../types';
import { 
  subscribeCustomerOrders, 
  logoutCustomerUser, 
  seedSampleOrderForUser 
} from '../lib/ordersService';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { OrderTimeline } from './OrderTimeline';
import { FinalPhotosGallery } from './FinalPhotosGallery';
import { UserProfileModal } from './UserProfileModal';

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onOpenLogin: () => void;
  onOpenAtelierAdmin: () => void;
  onProfileUpdated?: (updatedUser: CustomerUser) => void;
  onUserLogout?: () => void;
}

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenLogin,
  onOpenAtelierAdmin,
  onProfileUpdated,
  onUserLogout,
}) => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [activeTab, setActiveTab] = useState<'ativos' | 'historico'>('ativos');
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || !currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const identifier = currentUser.phone || currentUser.uid || currentUser.email || '';
    const unsubscribe = subscribeCustomerOrders(identifier, (customerOrders) => {
      setOrders(customerOrders);
      setLoading(false);
    }, currentUser.uid);

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('SignOut error:', err);
    }
    logoutCustomerUser();
    if (onUserLogout) {
      onUserLogout();
    }
    onClose();
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl border border-pink-200 space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-pink-100 text-[#e63946] flex items-center justify-center mx-auto shadow-xs">
            <Heart className="w-7 h-7 fill-[#e63946]" />
          </div>

          <h3 className="font-serif font-bold text-lg text-gray-900">
            Área do Cliente • Meus Mimos
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
            Faça login com seu WhatsApp e Nome para visualizar seus orçamentos, linha do tempo do pedido e fotos reais dos seus mimos!
          </p>

          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="w-full py-3 bg-[#e63946] hover:bg-[#d62839] text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer"
          >
            Entrar com WhatsApp
          </button>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => o.status !== 'entregue' && o.status !== 'cancelado');
  const pastOrders = orders.filter((o) => o.status === 'entregue' || o.status === 'cancelado');

  const displayedOrders = activeTab === 'ativos' ? activeOrders : pastOrders;

  const handleSeedSample = async () => {
    const sample = await seedSampleOrderForUser(currentUser);
    alert(`Pedido exemplo ${sample.orderNumber} adicionado à sua conta com sucesso!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[88vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-pink-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#ffe4e8] via-pink-100 to-[#ffe4e8] p-5 border-b border-pink-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-[#e63946] flex items-center justify-center font-bold shadow-sm border border-pink-200">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-gray-900 text-lg">
                  Olá, {currentUser.name}! 🌸
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                  Cliente Cadastrado
                </span>
              </div>
              <p className="text-xs text-gray-600">
                WhatsApp: <strong>{currentUser.phone}</strong> {currentUser.cityState ? `• ${currentUser.cityState}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Meus Dados / Gerenciar Perfil Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-1.5 bg-white border border-pink-300 text-gray-800 hover:text-[#e63946] hover:bg-pink-50 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
              title="Gerenciar meus dados pessoais e endereço"
            >
              <Settings className="w-3.5 h-3.5 text-[#e63946]" />
              <span>⚙️ Meus Dados</span>
            </button>

            {/* Atelier Admin Button Toggle */}
            <button
              onClick={onOpenAtelierAdmin}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Acessar o Painel do Ateliê para alterar status e enviar fotos"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel do Ateliê (Admin)</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-white/90 border border-pink-200 text-gray-700 hover:text-red-600 hover:bg-red-50 cursor-pointer text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
              title="Sair da Conta (SignOut)"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sair</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-pink-50/50 border-b border-pink-100 px-5 py-2.5 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ativos')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'ativos'
                  ? 'bg-[#e63946] text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pedidos em Andamento ({activeOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('historico')}
              className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'historico'
                  ? 'bg-[#e63946] text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Histórico de Compras Anteriores ({pastOrders.length})</span>
            </button>
          </div>

          <button
            onClick={handleSeedSample}
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#e63946] bg-white border border-pink-200 px-3 py-1.5 rounded-xl hover:bg-pink-100 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gerar Exemplo para Testar</span>
          </button>
        </div>

        {/* Orders Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-pink-50/20">
          {loading ? (
            <div className="py-20 text-center text-gray-400 space-y-2">
              <div className="w-8 h-8 border-3 border-[#e63946] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Carregando seus mimos e pedidos do Firestore...</p>
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-pink-200 p-8 space-y-3 max-w-md mx-auto my-6 shadow-sm">
              <Gift className="w-12 h-12 text-pink-300 mx-auto" />
              <h4 className="font-serif font-bold text-base text-gray-900">
                {activeTab === 'ativos'
                  ? 'Você não possui pedidos em andamento no momento'
                  : 'Nenhum pedido finalizado no histórico'}
              </h4>
              <p className="text-xs text-gray-500">
                Explore nosso catálogo, monte seu orçamento de mimos e solicite o acompanhamento em tempo real!
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  onClick={handleSeedSample}
                  className="px-4 py-2.5 bg-[#e63946] text-white font-bold rounded-xl text-xs shadow-xs hover:bg-[#d62839] cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Pedido Exemplo com Fotos</span>
                </button>
              </div>
            </div>
          ) : (
            displayedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-pink-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Order Header Card */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-pink-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-extrabold text-gray-900 text-lg">
                        Pedido {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          order.status === 'solicitado'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : order.status === 'em_producao'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : order.status === 'pronto'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : order.status === 'entregue'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {order.status === 'solicitado' && '📄 Solicitado'}
                        {order.status === 'em_producao' && '✂️ Em Produção'}
                        {order.status === 'pronto' && '🎁 Pronto para Entrega'}
                        {order.status === 'entregue' && '✅ Entregue com Sucesso'}
                        {order.status === 'cancelado' && '❌ Cancelado'}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      Solicitado em: {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Date & Location Badges */}
                  <div className="flex items-center gap-2 text-xs">
                    {order.eventDate && (
                      <span className="bg-pink-50 text-gray-700 px-3 py-1 rounded-xl border border-pink-100 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#e63946]" />
                        <span>Data Festa: {order.eventDate}</span>
                      </span>
                    )}
                    {order.cityState && (
                      <span className="bg-pink-50 text-gray-700 px-3 py-1 rounded-xl border border-pink-100 font-semibold flex items-center gap-1 hidden sm:flex">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        <span>{order.cityState}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Mercado Livre Style Timeline */}
                <div>
                  <h5 className="font-serif font-bold text-gray-800 text-xs mb-1">
                    Acompanhamento do Pedido (Estilo Mercado Livre):
                  </h5>
                  <OrderTimeline currentStatus={order.status} history={order.statusHistory} />
                </div>

                {/* Final Photos Gallery Section */}
                <FinalPhotosGallery photos={order.finalPhotos} orderNumber={order.orderNumber} />

                {/* Items in Order */}
                <div className="space-y-2 pt-2 border-t border-pink-100">
                  <span className="font-serif font-bold text-gray-900 text-xs block">
                    Mimos do Pedido ({order.items.length} itens):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-pink-50/40 border border-pink-100 flex items-start gap-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 space-y-0.5 text-xs">
                          <h6 className="font-bold text-gray-900">{item.product.title}</h6>
                          <p className="text-[11px] text-pink-600 font-semibold">
                            Tema: {item.theme}
                          </p>
                          {item.childName && (
                            <p className="text-[10px] text-gray-500">
                              Nome/Idade: {item.childName} {item.age ? `(${item.age})` : ''}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] bg-white border border-pink-200 px-2 py-0.5 rounded-lg font-bold text-gray-800">
                              Qtd: {item.quantity} un
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-gray-500">
                    Precisa alterar a data ou tirar dúvidas sobre este pedido?
                  </div>

                  <a
                    href={`https://wa.me/5511999999999?text=Ol%C3%A1%20Ateli%C3%AA%20M%C3%A3os%20que%20Produzem%20Mimos!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20meu%20pedido%20${order.orderNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar no WhatsApp sobre o {order.orderNumber}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-pink-50 border-t border-pink-100 text-center text-[11px] text-gray-500">
          <span>🌸 Mãos que Produzem Mimos • Papelaria Personalizada & Lembrancinhas com Amor</span>
        </div>

      </div>

      {/* User Profile & LGPD Management Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onProfileUpdated={(updatedUser) => {
            if (onProfileUpdated) onProfileUpdated(updatedUser);
          }}
          onAccountDeleted={() => {
            setIsProfileModalOpen(false);
            if (onUserLogout) onUserLogout();
            handleLogout();
          }}
        />
      )}
    </div>
  );
};
