export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          <span className="toast-icon">
            {t.type === "success" && "✅"}
            {t.type === "error"   && "❌"}
            {t.type === "info"    && "🌟"}
            {t.type === "warn"    && "⚠️"}
          </span>
          <span className="toast-message">{t.message}</span>
          {onDismiss && (
            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              className="toast-close"
            >✕</button>
          )}
        </div>
      ))}
    </div>
  );
}
