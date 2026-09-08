import { useEffect, useRef } from 'react';
import { CheckCircle, Info, WarningCircle, X, XCircle } from '@phosphor-icons/react';
import '../styles/Toast.css';

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container" role="region" aria-label="Notificações" aria-live="polite">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />)}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, toast.duration ?? 4000);
    return () => clearTimeout(timerRef.current);
  }, [onClose, toast.duration]);

  const icons = {
    sucesso: CheckCircle,
    erro: XCircle,
    aviso: WarningCircle,
    info: Info,
  };
  const Icon = icons[toast.type] ?? icons.info;

  return (
    <div className={`toast toast-${toast.type ?? 'info'}`} role="alert">
      <span className="toast-icon" aria-hidden="true"><Icon size={19} weight="fill" /></span>
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar notificação"><X size={16} /></button>
      <div className="toast-progress" />
    </div>
  );
}
