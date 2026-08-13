import { useMemo, useEffect, useRef } from "react";
import "./Background.anime.css";

export default function Background() {
  const blobRef = useRef(null);

  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top:    `${Math.random() * 100}%`,
      left:   `${Math.random() * 100}%`,
      size:   `${(Math.random() * 3 + 1).toFixed(1)}px`,
      delay:  `${(Math.random() * 6).toFixed(2)}s`,
      dur:    `${(Math.random() * 4 + 3).toFixed(2)}s`,
      opacity: (Math.random() * 0.8 + 0.3).toFixed(2),
    }))
  , []);

  const particles = useMemo(() => {
    const colors = ["#ff006e", "#00d4ff", "#ffd60a", "#b700ff", "#ff1493"];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left:  `${(Math.random() * 100).toFixed(1)}%`,
      size:  `${(Math.random() * 8 + 4).toFixed(1)}px`,
      color: colors[i % colors.length],
      delay: `${(Math.random() * 15).toFixed(2)}s`,
      dur:   `${(Math.random() * 12 + 10).toFixed(2)}s`,
    }));
  }, []);

  const floatingObjects = useMemo(() => {
    const emojis = ["✨", "🎌", "🌸", "⭐", "💫", "🌊", "🎆", "🎇"];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      left: `${(Math.random() * 100).toFixed(1)}%`,
      delay: `${(Math.random() * 8).toFixed(2)}s`,
      dur: `${(Math.random() * 6 + 5).toFixed(2)}s`,
      size: `${(Math.random() * 3 + 1.2).toFixed(1)}rem`,
    }));
  }, []);

  useEffect(() => {
    const handler = () => {
      const state = document.hidden ? "paused" : "running";
      document.querySelectorAll(".star-field span, .particle, .floating-emoji").forEach((el) => {
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
        <div className="bg-blob bg-blob-4" />
        <div className="bg-blob bg-blob-5" />
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
              boxShadow: `0 0 12px ${p.color}`,
              "--dur": p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="floating-emojis">
        {floatingObjects.map((obj) => (
          <div
            key={obj.id}
            className="floating-emoji"
            style={{
              left: obj.left,
              "--size": obj.size,
              "--dur": obj.dur,
              animationDelay: obj.delay,
            }}
          >
            {obj.emoji}
          </div>
        ))}
      </div>
    </>
  );
}
