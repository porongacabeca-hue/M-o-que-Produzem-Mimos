import React, { useState } from 'react';
import { X, User, Phone, MapPin, Heart, Sparkles, CheckCircle2, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { CustomerUser } from '../types';
import { saveCustomerProfile } from '../lib/ordersService';
import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CustomerUser) => void;
  initialPhone?: string;
  initialName?: string;
}

export const ClientAuthModal: React.FC<ClientAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialPhone = '',
  initialName = '',
}) => {
  const [authMethod, setAuthMethod] = useState<'google_email' | 'whatsapp'>('google_email');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Profile state
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [cityState, setCityState] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const userProfile: CustomerUser = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'Cliente Mimos',
        email: firebaseUser.email || '',
        phone: firebaseUser.phoneNumber || phone || '11999999999',
        photoURL: firebaseUser.photoURL || '',
        cityState: cityState || 'São Paulo - SP',
      };

      const saved = await saveCustomerProfile(userProfile);
      setIsSubmitting(false);
      onLoginSuccess(saved);
      onClose();
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setErrorMsg(
          'Domínio do preview não autorizado no Firebase Console. Para liberar o Google Sign-In, adicione o domínio do seu aplicativo nas configurações de Authentication do Firebase. Enquanto isso, utilize E-mail/Senha ou Acesso Rápido por WhatsApp abaixo!'
        );
      } else {
        setErrorMsg(err.message || 'Não foi possível conectar com o Google. Tente novamente.');
      }
      setIsSubmitting(false);
    }
  };

  // Email/Password Form Submit Handler
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor, preencha o E-mail e a Senha.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let firebaseUser;
      if (isRegisterMode) {
        if (!name.trim()) {
          setErrorMsg('Informe seu nome completo para realizar o cadastro.');
          setIsSubmitting(false);
          return;
        }
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = userCred.user;
        await updateProfile(firebaseUser, { displayName: name.trim() });
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = userCred.user;
      }

      const userProfile: CustomerUser = {
        uid: firebaseUser.uid,
        name: name.trim() || firebaseUser.displayName || 'Cliente Mimos',
        email: firebaseUser.email || email.trim(),
        phone: phone.trim() || '11999999999',
        cityState: cityState.trim(),
      };

      const saved = await saveCustomerProfile(userProfile);
      setIsSubmitting(false);
      onLoginSuccess(saved);
      onClose();
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setErrorMsg('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este e-mail já está em uso. Faça login.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setErrorMsg(err.message || 'Erro ao realizar login. Verifique os dados e tente novamente.');
      }
      setIsSubmitting(false);
    }
  };

  // WhatsApp / Quick Login Handler
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Por favor, informe seu Nome e Telefone WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const userProfile: CustomerUser = {
        name: name.trim(),
        phone: phone.trim(),
        cityState: cityState.trim(),
      };

      const saved = await saveCustomerProfile(userProfile);
      setIsSubmitting(false);
      onLoginSuccess(saved);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Erro ao acessar. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ffe4e8] to-pink-100 p-6 border-b border-pink-200 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-white/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-white text-[#e63946] flex items-center justify-center mx-auto mb-2 shadow-sm border border-pink-200">
            <Heart className="w-6 h-6 fill-[#e63946]" />
          </div>

          <h3 className="font-serif font-bold text-xl text-gray-900">
            Área do Cliente • Meus Mimos
          </h3>
          <p className="text-xs text-[#e63946] font-semibold mt-1">
            Autenticação Segura Firebase Auth
          </p>
        </div>

        {/* Method Toggle Buttons */}
        <div className="flex border-b border-pink-100 text-xs font-bold bg-pink-50/50">
          <button
            onClick={() => {
              setAuthMethod('google_email');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              authMethod === 'google_email'
                ? 'bg-white text-[#e63946] border-b-2 border-[#e63946]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Google / E-mail
          </button>
          <button
            onClick={() => {
              setAuthMethod('whatsapp');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-center transition-all cursor-pointer ${
              authMethod === 'whatsapp'
                ? 'bg-white text-[#e63946] border-b-2 border-[#e63946]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Acesso Rápido (WhatsApp)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">

          {errorMsg && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Aviso de Domínio do Firebase</span>
              </div>
              <p className="leading-relaxed">{errorMsg}</p>
              {errorMsg.includes('Domínio do preview') && (
                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.hostname);
                      alert(`Domínio "${window.location.hostname}" copiado para a área de transferência! Adicione-o no Console do Firebase > Authentication > Settings > Authorized Domains.`);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] cursor-pointer shadow-2xs"
                  >
                    📋 Copiar Domínio ({window.location.hostname})
                  </button>
                </div>
              )}
            </div>
          )}

          {authMethod === 'google_email' ? (
            <div className="space-y-4">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-2xl border border-gray-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-3 text-xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Entrar com o Google</span>
              </button>

              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-pink-200" />
                <span className="text-[10px] text-gray-400 font-bold uppercase">ou use E-mail e Senha</span>
                <div className="flex-1 h-px bg-pink-200" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                {isRegisterMode && (
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      Seu Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required={isRegisterMode}
                        placeholder="Ex: Maria Clara"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Endereço de E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">
                    Sua Senha *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                    />
                  </div>
                </div>

                {isRegisterMode && (
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">
                      WhatsApp (para acompanhar orçamentos)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                      <input
                        type="tel"
                        placeholder="Ex: 11 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#e63946] hover:bg-[#d62839] text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs mt-3"
                >
                  {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>
                    {isSubmitting
                      ? 'Processando...'
                      : isRegisterMode
                      ? 'Cadastrar Minha Conta'
                      : 'Entrar no Painel do Cliente'}
                  </span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                    className="text-[#e63946] font-bold hover:underline cursor-pointer text-xs"
                  >
                    {isRegisterMode
                      ? 'Já tem uma conta? Clique aqui para Entrar'
                      : 'Não tem conta? Clique para criar uma agora mesmo'}
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-2xl flex items-center gap-2.5 text-gray-700">
                <Sparkles className="w-4 h-4 text-[#e63946] shrink-0" />
                <span>
                  Entre com seu <strong>WhatsApp e Nome</strong> para visualizar rapidamente seus mimos!
                </span>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Seu WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 11 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Cidade / Estado (opcional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex: São Paulo - SP"
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 focus:outline-hidden focus:border-[#e63946] text-xs font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#e63946] hover:bg-[#d62839] text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Entrando...' : 'Acessar Meus Pedidos'}</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-pink-50/50 border-t border-pink-100 text-center text-[11px] text-gray-500">
          <span>🌸 Mãos que Produzem Mimos • Transparência e carinho em cada etapa</span>
        </div>
      </div>
    </div>
  );
};
