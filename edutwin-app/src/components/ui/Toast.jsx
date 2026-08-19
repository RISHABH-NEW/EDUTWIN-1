import { CheckCircle, AlertCircle, Info, Trophy } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  achievement: Trophy,
};

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-primary-50 border-primary-200 text-primary-800',
  achievement: 'bg-amber-50 border-amber-200 text-amber-800',
};

export default function Toast({ message, type = 'success' }) {
  const Icon = icons[type] || icons.info;
  const color = colors[type] || colors.info;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-elevated
      animate-slide-in-right ${color}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
