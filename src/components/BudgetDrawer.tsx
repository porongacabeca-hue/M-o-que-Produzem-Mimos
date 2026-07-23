import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ShoppingBag, 
  Calendar, 
  User, 
  MapPin, 
  FileText,
  Sparkles,
  Gift
} from 'lucide-react';
import { BudgetItem, CustomerInfo, CustomerUser } from '../types';
import { 
  createOrderInFirestore, 
  saveCustomerProfile, 
  getCurrentCustomerUser 
} from '../lib/ordersService';
import { auth } from '../lib/firebase';

interface BudgetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: BudgetItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderCreated?: (user: CustomerUser) => void;
}

export const BudgetDrawer: React.FC<BudgetDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
}) => {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    eventDate: '',
    cityState: '',
    generalNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existing = getCurrentCustomerUser();
    if (existing) {
      setCustomer((prev) => ({
        ...prev,
        name: existing.name || prev.name,
        phone: existing.phone || prev.phone,
        cityState: existing.cityState || prev.cityState,
      }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format WhatsApp message, save to Firestore & launch WhatsApp
  const handleSendToWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Seu carrinho de orçamento está vazio. Adicione pelo menos um produto!');
      return;
    }

    if (!customer.name.trim() || !customer.phone.trim()) {
      alert('Por favor, preencha seu Nome e Telefone WhatsApp para receber o atendimento.');
      return;
    }

    setIsSubmitting(true);

    const userUid = auth.currentUser?.uid || '';

    // Save customer profile to Firestore
    const userProfile: CustomerUser = {
      uid: userUid,
      name: customer.name.trim(),
      phone: customer.phone.trim(),
      cityState: customer.cityState.trim(),
    };

    const savedUser = await saveCustomerProfile(userProfile);

    // Save Order in Firestore (collections 'orcamentos' and 'orders')
    const newOrder = await createOrderInFirestore({
      uid: userUid,
      customerPhone: savedUser.phone,
      customerName: savedUser.name,
      eventDate: customer.eventDate.trim(),
      cityState: customer.cityState.trim(),
      generalNotes: customer.generalNotes.trim(),
      items: cartItems,
    });

    // Build WhatsApp Message
    let message = `*Olá, Mãos que Produzem Mimos!* 🌸\nGostaria de solicitar o Orçamento *${newOrder.orderNumber}*:\n\n`;
    message += `👤 *Cliente:* ${customer.name}\n`;
    message += `📱 *WhatsApp:* ${customer.phone}\n`;
    if (customer.eventDate) message += `📅 *Data da Festa:* ${customer.eventDate}\n`;
    if (customer.cityState) message += `📍 *Cidade/UF:* ${customer.cityState}\n`;
    message += `\n*🎁 ITENS DO ORÇAMENTO:*\n`;

    cartItems.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.product.title}*\n`;
      message += `   • Quantidade: ${item.quantity} unidades\n`;
      message += `   • Tema: ${item.theme}\n`;
      if (item.childName) message += `   • Nome: ${item.childName}\n`;
      if (item.age) message += `   • Idade: ${item.age}\n`;
      if (item.notes) message += `   • Obs: ${item.notes}\n`;
    });

    if (customer.generalNotes) {
      message += `\n📝 *Observações Gerais:* ${customer.generalNotes}\n`;
    }

    message += `\nAguardo seu retorno e valores! Muito obrigada! ❤️`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;

    setIsSubmitting(false);
    onClearCart();
    onClose();

    window.open(whatsappUrl, '_blank');

    if (onOrderCreated) {
      onOrderCreated(savedUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 bg-[#ffe4e8] border-b border-pink-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#e63946] flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-lg">
                Seu Orçamento
              </h3>
              <p className="text-xs text-[#e63946] font-medium">
                {cartItems.length} {cartItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-gray-700">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Gift className="w-12 h-12 text-pink-300 mx-auto" />
              <h4 className="font-serif font-bold text-base text-gray-800">
                Seu carrinho de orçamento está vazio
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore nosso catálogo e adicione os mimos e caixinhas para sua celebração!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-[#e63946] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#d62839] cursor-pointer"
              >
                Voltar ao Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Selected Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-pink-100">
                  <span className="font-bold text-gray-900 text-xs">Mimos Selecionados</span>
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-red-500 hover:underline cursor-pointer"
                  >
                    Esvaziar Lista
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100 relative space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{item.product.title}</h4>
                          <p className="text-[11px] text-pink-600 font-semibold mt-0.5">
                            Tema: {item.theme}
                          </p>
                          {item.childName && (
                            <p className="text-[10px] text-gray-500">
                              Nome/Idade: {item.childName} {item.age ? `(${item.age})` : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remover Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-pink-100/60 text-[11px]">
                      <span className="text-gray-500">Quantidade:</span>
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-pink-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 5))}
                          className="text-gray-500 hover:text-[#e63946] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-gray-900 px-1">{item.quantity} un</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 5)}
                          className="text-gray-500 hover:text-[#e63946] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Contact Form */}
              <form onSubmit={handleSendToWhatsApp} className="space-y-3 pt-3 border-t border-pink-100">
                <span className="font-bold text-gray-900 block text-xs mb-1">
                  Seus Dados para o Orçamento:
                </span>

                <div>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Seu Nome Completo *"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp (ex: 11 99999-9999) *"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Data da Festa"
                      value={customer.eventDate}
                      onChange={(e) => setCustomer({ ...customer, eventDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cidade / Estado"
                      value={customer.cityState}
                      onChange={(e) => setCustomer({ ...customer, cityState: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                    <textarea
                      rows={2}
                      placeholder="Observações adicionais ou dúvidas..."
                      value={customer.generalNotes}
                      onChange={(e) => setCustomer({ ...customer, generalNotes: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>
                </div>

                {/* Final Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Orçamento via WhatsApp</span>
                </button>
              </form>
            </>
          )}

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-pink-50/60 border-t border-pink-100 text-center text-[11px] text-gray-500">
          <span>🌸 Mãos que Produzem Mimos • Resposta rápida no WhatsApp</span>
        </div>

      </div>
    </div>
  );
};
