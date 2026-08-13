import { useState, useRef } from "react";
import CustomPromptModal from "./CustomPromptModal";

export default function SubtopicsEditor({ subtopics, setSubtopics }) {
  const [newLabel, setNewLabel] = useState("");
  const [editingPromptId, setEditingPromptId] = useState(null);
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  function toggleCheck(id) {
    setSubtopics((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function updateLabel(id, val) {
    setSubtopics((prev) =>
      prev.map((s) => (s.id === id ? { ...s, label: val } : s))
    );
  }

  function deleteItem(id) {
    setSubtopics((prev) => prev.filter((s) => s.id !== id));
  }

  function addNew() {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    const id = `custom_${Date.now()}`;
    setSubtopics((prev) => [...prev, { id, label: trimmed, required: false, enabled: true, custom: true }]);
    setNewLabel("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addNew();
  }

  function onDragStart(index) { dragItem.current = index; }
  function onDragEnter(index) { dragOver.current = index; }
  function onDragEnd() {
    const list = [...subtopics];
    const dragged = list.splice(dragItem.current, 1)[0];
    list.splice(dragOver.current, 0, dragged);
    dragItem.current = null;
    dragOver.current = null;
    setSubtopics(list);
  }

  function saveCustomPrompt(sectionId, prompt) {
    setSubtopics((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, customPrompt: prompt } : s))
    );
    setEditingPromptId(null);
  }

  const enabledCount = subtopics.filter((s) => s.enabled !== false).length;

  return (
    <>
      <div className="subtopics-list">
        {subtopics.map((s, index) => {
          const isEnabled = s.enabled !== false;
          return (
            <div
              key={s.id}
              className={`subtopic-item${isEnabled ? "" : " disabled"}`}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragEnter={() => onDragEnter(index)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              style={{ opacity: isEnabled ? 1 : 0.45 }}
            >
              <span className="drag-handle" title="Drag to reorder">⠿</span>
              <input
                type="checkbox"
                className="subtopic-check"
                checked={isEnabled}
                onChange={() => toggleCheck(s.id)}
                title={s.required ? "Required section" : "Toggle section"}
              />
              {s.custom ? (
                <input
                  className="subtopic-name custom-name"
                  value={s.label}
                  onChange={(e) => updateLabel(s.id, e.target.value)}
                  placeholder="Section name…"
                />
              ) : (
                <span className="subtopic-name">{s.label}</span>
              )}
              {s.required && <span className="subtopic-badge">required</span>}
              {s.customPrompt && <span className="subtopic-badge custom-badge">custom prompt</span>}
              
              <div className="subtopic-actions">
                <button
                  className="icon-btn prompt-btn"
                  onClick={() => setEditingPromptId(s.id)}
                  title="Add custom prompt"
                >
                  💡
                </button>
                {s.custom && (
                  <button
                    className="icon-btn del"
                    onClick={() => deleteItem(s.id)}
                    title="Remove"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="add-topic-row" style={{ marginTop: 4 }}>
        <input
          className="field-input"
          placeholder="＋ Add custom section…"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={addNew} style={{ borderRadius: 10, padding: "10px 18px" }}>
          Add
        </button>
      </div>

      <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: 4 }}>
        {enabledCount} section{enabledCount !== 1 ? "s" : ""} enabled · drag to reorder · 💡 for custom prompts
      </div>

      {editingPromptId && (
        <CustomPromptModal
          section={subtopics.find((s) => s.id === editingPromptId)}
          onSave={(prompt) => saveCustomPrompt(editingPromptId, prompt)}
          onCancel={() => setEditingPromptId(null)}
        />
      )}
    </>
  );
}
