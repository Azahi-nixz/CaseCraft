import { WRITING_STYLES } from "../constants/writingStyles";

export default function StyleSelector({ selectedStyle, onStyleChange }) {
  return (
    <div className="style-selector">
      <div className="style-selector-label">✍️ Writing Style</div>
      <div className="style-grid">
        {WRITING_STYLES.map((style) => (
          <button
            key={style.id}
            className={`style-card${selectedStyle === style.id ? " active" : ""}`}
            onClick={() => onStyleChange(style.id)}
            title={style.desc}
          >
            <span className="style-emoji">{style.label.split(" ")[0]}</span>
            <span className="style-name">{style.label.split(" ")[1]}</span>
            <span className="style-desc">{style.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
