import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Search, 
  Save, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Settings, 
  Building2, 
  Home, 
  Mail,
  ShieldAlert,
  Sparkles,
  Loader2
} from 'lucide-react';
import { CustomerUser } from '../types';
import { 
  saveCustomerProfile, 
  fetchCustomerProfileFromFirestore, 
  deleteClientAccountAndAnonymize 
} from '../lib/ordersService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser;
  onProfileUpdated: (updatedUser: CustomerUser) => void;
  onAccountDeleted: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  onAccountDeleted,
}) => {
  // Profile form state
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [cep, setCep] = useState(currentUser.cep || '');
  const [endereco, setEndereco] = useState(currentUser.endereco || '');
  const [numero, setNumero] = useState(currentUser.numero || '');
  const [complemento, setComplemento] = useState(currentUser.complemento || '');
  const [bairro, setBairro] = useState(currentUser.bairro || '');
  const [cidade, setCidade] = useState(currentUser.cidade || '');
  const [estado, setEstado] = useState(currentUser.estado || '');

  // UI state
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFirestore, setIsLoadingFirestore] = useState(false);
  const [cepMessage, setCepMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete account confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Synchronize state and load automatically from Firestore when modal opens
  useEffect(() => {
    if (currentUser && isOpen) {
      // Set initial values from local state
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setCep(currentUser.cep || '');
      setEndereco(currentUser.endereco || '');
      setNumero(currentUser.numero || '');
      setComplemento(currentUser.complemento || '');
      setBairro(currentUser.bairro || '');
      setCidade(currentUser.cidade || '');
      setEstado(currentUser.estado || '');

      // Automatically fetch latest data from Firestore 'clientes' collection
      setIsLoadingFirestore(true);
      fetchCustomerProfileFromFirestore(currentUser.uid, currentUser.phone)
        .then((remoteData) => {
          if (remoteData) {
            if (remoteData.name) setName(remoteData.name);
            if (remoteData.phone) setPhone(remoteData.phone);
            if (remoteData.email) setEmail(remoteData.email);
            if (remoteData.cep) setCep(remoteData.cep);
            if (remoteData.endereco) setEndereco(remoteData.endereco);
            if (remoteData.numero) setNumero(remoteData.numero);
            if (remoteData.complemento) setComplemento(remoteData.complemento);
            if (remoteData.bairro) setBairro(remoteData.bairro);
            if (remoteData.cidade) setCidade(remoteData.cidade);
            if (remoteData.estado) setEstado(remoteData.estado);
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar dados do Firestore:', err);
        })
        .finally(() => {
          setIsLoadingFirestore(false);
        });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Search CEP via ViaCEP API
  const handleSearchCep = async (inputCep?: string) => {
    const targetCep = (inputCep !== undefined ? inputCep : cep).replace(/\D/g, '');
    if (targetCep.length !== 8) {
      setCepMessage({ type: 'error', text: 'Informe um CEP válido com 8 dígitos.' });
      return;
    }

    setIsSearchingCep(true);
    setCepMessage(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${targetCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepMessage({ type: 'error', text: 'CEP não encontrado. Preencha os campos manualmente.' });
      } else {
        setEndereco(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
        setCepMessage({ type: 'success', text: 'Endereço localizado com sucesso!' });
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
      setCepMessage({ type: 'error', text: 'Não foi possível buscar o CEP automaticamente.' });
    } finally {
      setIsSearchingCep(false);
    }
  };

  // Auto trigger CEP search on 8 digits
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCep(val);
    const clean = val.replace(/\D/g, '');
    if (clean.length === 8) {
      handleSearchCep(val);
    }
  };

  // Submit profile update form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, preencha pelo menos Nome e WhatsApp.');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    const cityStateVal = cidade && estado ? `${cidade} - ${estado}` : currentUser.cityState || '';

    const updatedUser: CustomerUser = {
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      cep: cep.trim(),
      endereco: endereco.trim(),
      numero: numero.trim(),
      complemento: complemento.trim(),
      bairro: bairro.trim(),
      cidade: cidade.trim(),
      estado: estado.trim(),
      cityState: cityStateVal,
      updatedAt: new Date().toISOString(),
    };

    try {
      const saved = await saveCustomerProfile(updatedUser);
      onProfileUpdated(saved);
      setSaveSuccess(true);
      alert('✅ Confirmação do Firestore: Dados salvos e verificados com sucesso no banco de dados do Firebase!');
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Erro ao salvar e verificar perfil no banco de dados:', err);
      alert(`❌ ERRO NO BANCO DE DADOS FIREBASE:\n\n${err?.message || 'Os dados não puderam ser gravados ou verificados no Firestore.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Execute LGPD account deletion
  const handleConfirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteClientAccountAndAnonymize(currentUser.uid, currentUser.phone);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      onAccountDeleted();
    } catch (err) {
      console.error('Erro ao deletar conta:', err);
      alert('Não foi possível excluir o cadastro no momento. Tente novamente.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ffe4e8] via-pink-100 to-[#ffe4e8] p-5 border-b border-pink-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#e63946] flex items-center justify-center font-bold shadow-xs border border-pink-200">
              <Settings className="w-5 h-5 text-[#e63946]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-lg flex items-center gap-2">
                ⚙️ Meus Dados & Perfil
              </h3>
              <p className="text-xs text-gray-600">
                Gerencie seus dados pessoais, endereço de entrega e privacidade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-700">

          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">Dados do perfil atualizados com sucesso no ateliê!</span>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="font-bold text-sm text-gray-900 border-b border-pink-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#e63946]" />
              <span>Informações Pessoais</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria Clara Silva"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  WhatsApp / Telefone *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 11 99999-9999"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-bold mb-1">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="font-bold text-sm text-gray-900 border-b border-pink-100 pb-2 pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e63946]" />
                <span>Endereço de Entrega dos Mimos</span>
              </div>
              <span className="text-[11px] text-gray-400 font-normal">Integração ViaCEP</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  CEP (Busca Automática)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      maxLength={9}
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="Ex: 01001-000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearchCep()}
                    disabled={isSearchingCep}
                    className="px-4 py-2.5 bg-pink-100 hover:bg-pink-200 text-[#e63946] font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {isSearchingCep ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#e63946]" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>Buscar CEP</span>
                  </button>
                </div>

                {cepMessage && (
                  <p className={`mt-1.5 text-[11px] font-semibold ${
                    cepMessage.type === 'success' ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {cepMessage.text}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">
                    Endereço / Logradouro
                  </label>
                  <input
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Ex: Rua das Flores"
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Ex: 123"
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Ex: Bloco B / Apto 42"
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Ex: Jardim Paulista"
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full px-2.5 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      UF
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={estado}
                      onChange={(e) => setEstado(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full px-2.5 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-[#e63946] hover:bg-[#d62839] text-white font-bold rounded-2xl text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações do Perfil'}</span>
              </button>
            </div>
          </form>

          {/* LGPD Section */}
          <div className="mt-8 pt-6 border-t border-pink-200 bg-red-50/50 p-4 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>Conformidade com a LGPD (Direito ao Esquecimento)</span>
            </div>
            <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
              Você pode solicitar a exclusão definitiva dos seus dados de acesso do ateliê a qualquer momento. Os dados pessoais da sua conta serão removidos permanentemente. Históricos fiscais e de produção dos pedidos já realizados são mantidos de forma anônima.
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Apagar Meu Cadastro</span>
              </button>
            </div>
          </div>

        </div>

        {/* Delete Confirmation Modal Overlay */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-200 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h4 className="font-serif font-bold text-gray-900 text-lg">
                Excluir Conta Permanentemente?
              </h4>

              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Tem certeza? Esta ação apagará seus dados de acesso permanentemente.
              </p>

              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-xl text-left leading-relaxed">
                🌸 Seus dados de acesso e login serão removidos do Firebase Auth e da base do ateliê. Os orçamentos anteriores permanecerão anônimos no sistema do ateliê para controle histórico.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{isDeleting ? 'Excluindo...' : 'Sim, Apagar Cadastro'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
