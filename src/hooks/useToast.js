import { useState, useCallback, useRef, useEffect } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  // Track all pending timeouts so we can clear them on unmount (memory leak fix)
  const timers = useRef(new Set());

  useEffect(() => {
    // Cleanup ALL pending timers when the hook's component unmounts
    return () => {
      timers.current.forEach((id) => clearTimeout(id));
      timers.current.clear();
    };
  }, []);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(timer);
    }, duration);

    timers.current.add(timer);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}
