import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scissors, 
  CheckCircle2, 
  Plus, 
  Image as ImageIcon, 
  Search, 
  Sparkles, 
  Calendar, 
  User, 
  Tag, 
  Upload, 
  Clock 
} from 'lucide-react';
import { OrderModel, OrderStatus, CustomerUser } from '../types';
import { 
  subscribeAllOrders, 
  updateOrderStatusInFirestore, 
  addFinalPhotoToOrderInFirestore, 
  seedSampleOrderForUser 
} from '../lib/ordersService';

interface AtelierAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: CustomerUser | null;
}

const PRESET_PHOTOS = [
  {
    title: 'Caixinha Milk Luxo 3D',
    url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
    caption: 'Caixinhas Milk Luxo recortadas e montadas à mão com laço seco e apliques 3D.',
  },
  {
    title: 'Topo de Bolo Shaker 3D',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=800',
    caption: 'Topo de bolo shaker interativo com acrílico e lantejoulas brilhantes.',
  },
  {
    title: 'Kit Festa Embalado com Laço',
    url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800',
    caption: 'Kit completo de lembrancinhas mimosas embalado e pronto para envio.',
  },
  {
    title: 'Caixas Personalizadas & Doces',
    url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
    caption: 'Mimos de papelaria fina produzidos para mesa principal do evento.',
  },
  {
    title: 'Mimos com Laço Rosa Bebê',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    caption: 'Lembrancinhas decorativas em tom rosa bebê e fita de cetim artesanal.',
  },
];

export const AtelierAdminModal: React.FC<AtelierAdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  
  // Status edit state
  const [newStatus, setNewStatus] = useState<OrderStatus>('solicitado');
  const [statusNote, setStatusNote] = useState('');

  // Photo upload state
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = subscribeAllOrders((allOrders) => {
      setOrders(allOrders);
      if (allOrders.length > 0 && !selectedOrder) {
        setSelectedOrder(allOrders[0]);
        setNewStatus(allOrders[0].status);
      }
    });

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (selectedOrder) {
      const refreshed = orders.find((o) => o.id === selectedOrder.id);
      if (refreshed) {
        setSelectedOrder(refreshed);
        setNewStatus(refreshed.status);
      }
    }
  }, [orders]);

  if (!isOpen) return null;

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
  );

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await updateOrderStatusInFirestore(selectedOrder.id, newStatus, statusNote.trim());
    setStatusNote('');
    alert(`Status do pedido ${selectedOrder.orderNumber} atualizado para "${newStatus.replace('_', ' ').toUpperCase()}"!`);
  };

  const handleAddPhoto = async (url: string, caption?: string) => {
    if (!selectedOrder) return;
    if (!url.trim()) {
      alert('Por favor informe a URL da foto.');
      return;
    }

    await addFinalPhotoToOrderInFirestore(selectedOrder.id, url.trim(), caption?.trim());
    setPhotoUrlInput('');
    setPhotoCaptionInput('');
    alert(`Foto adicionada à galeria do pedido ${selectedOrder.orderNumber}!`);
  };

  const handleCreateSampleOrder = async () => {
    if (!currentUser) {
      alert('Por favor, faça login com seu nome/WhatsApp primeiro.');
      return;
    }

    const created = await seedSampleOrderForUser(currentUser);
    setSelectedOrder(created);
    setNewStatus(created.status);
    alert(`Pedido exemplo ${created.orderNumber} criado com sucesso!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-pink-200">
        
        {/* Header */}
        <div className="bg-[#ffe4e8] p-5 border-b border-pink-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e63946] text-white flex items-center justify-center shadow-xs font-bold">
              <Scissors className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-lg flex items-center gap-2">
                Painel do Ateliê • Gestão de Pedidos
                <span className="text-[10px] bg-amber-400 text-gray-900 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Modo Admin
                </span>
              </h3>
              <p className="text-xs text-[#e63946] font-medium">
                Altere os status do pedido estilo Mercado Livre e adicione fotos reais do produto entregue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateSampleOrder}
              className="px-3 py-1.5 bg-white border border-pink-300 text-[#e63946] hover:bg-pink-100 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Gerar Pedido Exemplo</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Column Orders List, Right Column Order Detail & Actions */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden text-xs">
          
          {/* Left Column: Orders List */}
          <div className="md:col-span-4 border-r border-pink-100 bg-pink-50/30 flex flex-col overflow-hidden p-4 space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedido ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
              />
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 space-y-2">
                  <p>Nenhum pedido encontrado no Ateliê.</p>
                  <button
                    onClick={handleCreateSampleOrder}
                    className="px-3 py-1.5 bg-[#e63946] text-white font-bold rounded-xl text-xs"
                  >
                    Criar Pedido Teste
                  </button>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrder(ord);
                        setNewStatus(ord.status);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? 'bg-white border-[#e63946] shadow-md ring-2 ring-pink-200'
                          : 'bg-white/80 border-pink-100 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-gray-900 text-xs">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            ord.status === 'solicitado'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'em_producao'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'pronto'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.status === 'entregue'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                        <User className="w-3.5 h-3.5 text-pink-500" />
                        <span className="font-semibold truncate">{ord.customerName}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>{ord.items.length} itens</span>
                        <span>{new Date(ord.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Order Detail & Status Management */}
          <div className="md:col-span-8 flex flex-col overflow-y-auto p-5 space-y-5 bg-white">
            {!selectedOrder ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20 space-y-2">
                <Scissors className="w-10 h-10 text-pink-300" />
                <p>Selecione um pedido na lista à esquerda para gerenciar.</p>
              </div>
            ) : (
              <>
                {/* Selected Order Summary Header */}
                <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-gray-900 text-base">
                        Pedido {selectedOrder.orderNumber}
                      </span>
                      <span className="text-xs bg-white text-[#e63946] border border-pink-200 px-2 py-0.5 rounded-full font-bold">
                        Cliente: {selectedOrder.customerName} ({selectedOrder.customerPhone})
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Data do Evento: {selectedOrder.eventDate || 'Não informada'} • Local: {selectedOrder.cityState || 'Não informado'}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/55${selectedOrder.customerPhone}?text=Ol%C3%A1%20${encodeURIComponent(selectedOrder.customerName)},%20sou%20do%20Ateli%C3%AA%20M%C3%A3os%20que%20Produzem%20Mimos%20sobre%20seu%20pedido%20${selectedOrder.orderNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>WhatsApp Cliente</span>
                  </a>
                </div>

                {/* Status Update Form */}
                <form onSubmit={handleStatusUpdate} className="p-4 rounded-2xl border border-pink-200 bg-white space-y-3">
                  <h4 className="font-serif font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#e63946]" />
                    <span>Atualizar Status do Pedido (Estilo Mercado Livre)</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'solicitado', label: '1. Solicitado' },
                      { key: 'em_producao', label: '2. Em Produção' },
                      { key: 'pronto', label: '3. Pronto' },
                      { key: 'entregue', label: '4. Entregue' },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setNewStatus(st.key as OrderStatus)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          newStatus === st.key
                            ? 'bg-[#e63946] text-white border-[#e63946] shadow-2xs'
                            : 'bg-pink-50/40 border-pink-200 text-gray-700 hover:bg-pink-100'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Nota de Status / Observação para o Cliente:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Arte gráfica aprovada! Cortando papéis e montando laços..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#e63946] hover:bg-[#d62839] text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Salvar Novo Status no Firestore</span>
                  </button>
                </form>

                {/* Add Final Photos Section */}
                <div className="p-4 rounded-2xl border border-pink-200 bg-white space-y-3">
                  <h4 className="font-serif font-bold text-gray-900 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    <span>Vincular Fotos Reais do Produto Final ao Pedido</span>
                  </h4>

                  {/* Preset Photos Quick Picker */}
                  <div>
                    <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
                      Fotos Prontas do Ateliê (Clique para Adicionar ao Pedido do Cliente):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {PRESET_PHOTOS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddPhoto(preset.url, preset.caption)}
                          className="group relative h-20 rounded-xl overflow-hidden border border-pink-200 cursor-pointer hover:border-[#e63946] transition-all"
                          title={preset.title}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 text-white text-[9px] font-bold flex items-center justify-center p-1 text-center opacity-90 group-hover:bg-black/60">
                            {preset.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom URL Input */}
                  <div className="pt-2 border-t border-pink-100 space-y-2">
                    <span className="text-[11px] font-bold text-gray-600 block">
                      Ou insira a URL de uma Foto personalizada:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="url"
                        placeholder="URL da imagem (https://...)"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                      />
                      <input
                        type="text"
                        placeholder="Legenda da foto (ex: Topo de bolo pronto)"
                        value={photoCaptionInput}
                        onChange={(e) => setPhotoCaptionInput(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-hidden focus:border-[#e63946]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPhoto(photoUrlInput, photoCaptionInput)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Adicionar Foto Customizada</span>
                    </button>
                  </div>

                  {/* Current Photos List */}
                  {selectedOrder.finalPhotos && selectedOrder.finalPhotos.length > 0 && (
                    <div className="pt-2 border-t border-pink-100">
                      <span className="text-[11px] font-bold text-gray-700 block mb-2">
                        Fotos já publicadas no pedido ({selectedOrder.finalPhotos.length}):
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {selectedOrder.finalPhotos.map((ph) => (
                          <div key={ph.id} className="h-16 rounded-lg overflow-hidden border border-pink-200 relative">
                            <img
                              src={ph.url}
                              alt="Produto final"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Breakdown */}
                <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/20 space-y-2">
                  <h4 className="font-serif font-bold text-gray-900 text-xs">
                    Itens deste Pedido ({selectedOrder.items.length}):
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-pink-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={it.product.image}
                            alt={it.product.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{it.product.title}</span>
                            <span className="text-pink-600 text-[10px]">
                              Tema: {it.theme} {it.childName ? `• Nome: ${it.childName}` : ''} {it.age ? `(${it.age})` : ''}
                            </span>
                          </div>
                        </div>
                        <span className="font-extrabold text-[#e63946] bg-pink-50 px-2 py-1 rounded-lg">
                          {it.quantity} un
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
