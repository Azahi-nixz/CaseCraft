import { useMemo } from "react";

export default function AnimatedHero() {
  const particles = useMemo(() => {
    const shapes = ["✨", "🌸", "💫", "⭐", "🎌"];
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      symbol: shapes[Math.floor(Math.random() * shapes.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      size: Math.random() * 2 + 0.5,
    }));
  }, []);

  return (
    <div className="animated-hero-container">
      <div className="hero-video-overlay">
        {particles.map((p) => (
          <div
            key={p.id}
            className="hero-particle"
            style={{
              left: `${p.left}%`,
              "--delay": `${p.delay}s`,
              "--duration": `${p.duration}s`,
              "--size": `${p.size}rem`,
            }}
          >
            {p.symbol}
          </div>
        ))}
      </div>
      
      <div className="hero-glow-sphere hero-glow-1" />
      <div className="hero-glow-sphere hero-glow-2" />
      <div className="hero-glow-sphere hero-glow-3" />
    </div>
  );
}
