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
        <div className="loading-ring" />
        <div className="loading-ring" />
        <div className="loading-ring" />
        <div className="loading-emoji">📝</div>
      </div>
      <div className="loading-title">Crafting your case study…</div>
      <div className="loading-status">{status}</div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="anime-fact" key={currentFact}>
        <span className="fact-icon">✨</span>
        {currentFact}
      </div>
      {onCancel && (
        <button
          className="btn btn-ghost"
          onClick={onCancel}
          style={{ marginTop: 16 }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
