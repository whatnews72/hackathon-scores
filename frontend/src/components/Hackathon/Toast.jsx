import { useToast } from '../../hooks/useToast';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toasts" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className="toast"
          style={{ marginBottom: '1rem' }}
          onClick={() => removeToast(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
