import { useState, useEffect } from "react";
import { getRandomAnimeFact } from "../constants/animeFacts";

export default function LoadingOverlay({ status, progress, onCancel }) {
  const [currentFact, setCurrentFact] = useState(getRandomAnimeFact());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(getRandomAnimeFact());
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-overlay">
      <div className="loading-anime">
        <div className="loading-spinner" />
        <div className="loading-dot" />
        <div className="loading-text">✨</div>
      </div>
      <div className="loading-title">Crafting your case study…</div>
      <div className="loading-status">
        <strong>{status}</strong>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="anime-fact" key={currentFact}>
        <span className="fact-icon">🎌</span>
        {currentFact}
      </div>
      {onCancel && (
        <button
          className="btn btn-secondary"
          onClick={onCancel}
          style={{ marginTop: 20 }}
        >
          ✕ Cancel
        </button>
      )}
    </div>
  );
}
