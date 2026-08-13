import { useState } from "react";

export default function CustomPromptModal({ section, onSave, onCancel }) {
  const [prompt, setPrompt] = useState(section.customPrompt || "");

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Custom Prompt for "{section.label}"</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <p className="modal-hint">
          Write specific instructions for how you want this section to be generated. 
          Include tone, focus areas, examples, or any special requirements.
        </p>

        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Focus on the business implications... Include specific metrics... Make it conversational..."
          rows="8"
        />

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(prompt)}
            disabled={!prompt.trim()}
          >
            Save Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
