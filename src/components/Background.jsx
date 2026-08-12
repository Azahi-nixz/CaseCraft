import { useMemo, useEffect, useRef } from "react";

export default function Background() {
  const blobRef = useRef(null);

  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top:    `${Math.random() * 100}%`,
      left:   `${Math.random() * 100}%`,
      size:   `${(Math.random() * 2 + 0.8).toFixed(1)}px`,
      delay:  `${(Math.random() * 4).toFixed(2)}s`,
      dur:    `${(Math.random() * 3 + 2).toFixed(2)}s`,
      opacity: (Math.random() * 0.5 + 0.2).toFixed(2),
    }))
  , []);

  const particles = useMemo(() => {
    const colors = ["#ff6eb4", "#9b59f7", "#00e5cc", "#ffe066", "#4fc3f7"];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left:  `${(Math.random() * 100).toFixed(1)}%`,
      size:  `${(Math.random() * 5 + 3).toFixed(1)}px`,
      color: colors[i % colors.length],
      delay: `${(Math.random() * 10).toFixed(2)}s`,
      dur:   `${(Math.random() * 8 + 7).toFixed(2)}s`,
    }));
  }, []);

  useEffect(() => {
    const handler = () => {
      const state = document.hidden ? "paused" : "running";
      document.querySelectorAll(".star-field span, .particle").forEach((el) => {
        el.style.animationPlayState = state;
      });
      if (blobRef.current) {
        blobRef.current.querySelectorAll("div").forEach((el) => {
          el.style.animationPlayState = state;
        });
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return (
    <>
      <div
        ref={blobRef}
        style={{
          position: "fixed", inset: 0, zIndex: 0,
          pointerEvents: "none", overflow: "hidden",
        }}
      >
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      <div className="star-field">
        {stars.map((s) => (
          <span
            key={s.id}
            style={{
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              "--d": s.dur,
              "--o": s.opacity,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              "--dur": p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}
