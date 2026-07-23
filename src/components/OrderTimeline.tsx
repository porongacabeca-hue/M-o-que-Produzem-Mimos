import React from 'react';
import { 
  FileText, 
  Scissors, 
  PackageCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { OrderStatus, OrderStatusHistory } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history: OrderStatusHistory[];
}

interface StepConfig {
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    key: 'solicitado',
    label: 'Solicitado',
    description: 'Orçamento recebido',
    icon: FileText,
  },
  {
    key: 'em_producao',
    label: 'Em Produção',
    description: 'Arte e montagem artesanal',
    icon: Scissors,
  },
  {
    key: 'pronto',
    label: 'Pronto',
    description: 'Embalado com carinho',
    icon: PackageCheck,
  },
  {
    key: 'entregue',
    label: 'Entregue',
    description: 'Entregue ao cliente',
    icon: CheckCircle2,
  },
];

const getStatusIndex = (status: OrderStatus): number => {
  switch (status) {
    case 'solicitado': return 0;
    case 'em_producao': return 1;
    case 'pronto': return 2;
    case 'entregue': return 3;
    case 'cancelado': return -1;
    default: return 0;
  }
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, history }) => {
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelado';

  if (isCancelled) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs my-2">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-bold block text-sm">Pedido Cancelado</span>
          <p className="text-[11px] text-red-600">Este pedido foi cancelado pelo cliente ou ateliê.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-4 bg-pink-50/40 border border-pink-100 rounded-2xl p-4 sm:p-5">
      {/* Progress Line & Step Indicators */}
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-pink-200/80 -z-0 rounded-full" />

        {/* Active Progress Overlay Line */}
        <div 
          className="absolute top-5 left-6 h-1 bg-[#e63946] transition-all duration-500 rounded-full -z-0"
          style={{
            width: currentIndex <= 0 ? '0%' : `${(currentIndex / (STEPS.length - 1)) * 92}%`,
          }}
        />

        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          // Find timestamp from history if available
          const historyEntry = history?.find((h) => h.status === step.key);

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center text-center group">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${
                  isCurrent
                    ? 'bg-[#e63946] text-white ring-4 ring-pink-200 scale-110 shadow-md'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-300 border-2 border-pink-200'
                }`}
              >
                <StepIcon className="w-5 h-5" />
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'text-[#e63946]'
                    : isCompleted
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>

              {/* Step Subtitle / Description */}
              <span className="text-[10px] text-gray-500 max-w-[80px] hidden sm:block mt-0.5 leading-tight">
                {step.description}
              </span>

              {/* Timestamp badge if history exists */}
              {historyEntry && (
                <span className="text-[9px] bg-white border border-pink-100 text-gray-500 rounded-full px-2 py-0.5 mt-1 shadow-2xs font-mono">
                  {new Date(historyEntry.timestamp).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Latest Status Note Banner */}
      {history && history.length > 0 && (
        <div className="mt-5 p-3 rounded-xl bg-white border border-pink-200 flex items-start gap-2.5 text-xs text-gray-700 shadow-2xs">
          <Clock className="w-4 h-4 text-[#e63946] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-gray-900 text-xs block">
              Última atualização do Ateliê:
            </span>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              {history[history.length - 1]?.note || 'Pedido em processamento.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
