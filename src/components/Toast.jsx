export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          <span>
            {t.type === "success" && "✅ "}
            {t.type === "error"   && "❌ "}
            {t.type === "info"    && "💫 "}
            {t.type === "warn"    && "⚠️ "}
            {t.message}
          </span>
          {onDismiss && (
            <button
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "inherit", fontSize: "0.9rem", marginLeft: 10,
                opacity: 0.7, padding: "0 2px",
              }}
            >✕</button>
          )}
        </div>
      ))}
    </div>
  );
}
