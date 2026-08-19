import { useState, useMemo, useEffect, useRef } from "react";
import { regenerateSection } from "../utils/aiService";
import { exportToPDF, exportToDOCX } from "../utils/exportUtils";

export default function ResultPage({
  sections,
  topic,
  pages,
  language,
  model,
  apiKey,
  writingStyle,
  onBack,
  onRegenerate,
  addToast,
}) {
  const [editing, setEditing]               = useState(false);
  const [editedSections, setEditedSections] = useState(() => sections);
  const [regenId, setRegenId]               = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setEditedSections(sections);
    setEditing(false);
  }, [sections]);

  useEffect(() => {
    return () => { abortRef.current?.(); };
  }, []);

  const wordCount = useMemo(
    () => editedSections.reduce((acc, s) => acc + s.body.split(/\s+/).filter(Boolean).length, 0),
    [editedSections]
  );

  function updateBody(id, val) {
    setEditedSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, body: val } : s))
    );
  }

  async function handleRegenSection(section) {
    abortRef.current?.();

    setRegenId(section.id);
    const { promise, abort } = regenerateSection({
      apiKey,
      topic,
      pages,
      language,
      writingStyle,
      section,
      model,
    });
    abortRef.current = abort;

    try {
      const newBody = await promise;
      setEditedSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, body: newBody } : s))
      );
      addToast(`"${section.label}" regenerated!`, "success");
    } catch (err) {
      if (err.message !== "Generation cancelled.") {
        addToast(`Regen failed: ${err.message}`, "error", 6000);
      }
    } finally {
      setRegenId(null);
      abortRef.current = null;
    }
  }

  async function handleExportPDF() {
    try {
      await exportToPDF(editedSections, topic, language, pages, wordCount);
      addToast("PDF exported! 📄", "success");
    } catch (err) {
      addToast(`PDF export failed: ${err.message}`, "error");
    }
  }

  async function handleExportDOCX() {
    try {
      await exportToDOCX(editedSections, topic, language, pages, wordCount);
      addToast("DOCX exported! 📄", "success");
    } catch (err) {
      addToast(`DOCX export failed: ${err.message}`, "error");
    }
  }
  function copyAll() {
    const text = editedSections.map((s) => `## ${s.label}\n\n${s.body}`).join("\n\n---\n\n");
    navigator.clipboard
      .writeText(text)
      .then(() => addToast("Copied to clipboard!", "success"))
      .catch(() => addToast("Clipboard access denied.", "error"));
  }

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadTxt() {
    const text = editedSections.map((s) => `## ${s.label}\n\n${s.body}`).join("\n\n---\n\n");
    const header = `CASE STUDY: ${topic.toUpperCase()}\nLanguage: ${language} | Pages: ${pages}\n${"=".repeat(60)}\n\n`;
    const slug = topic.replace(/\s+/g, "-").toLowerCase().slice(0, 60);
    downloadFile(header + text, `case-study-${slug}.txt`, "text/plain");
    addToast("Downloaded as .txt!", "success");
  }

  function downloadHtml() {
    const slug = topic.replace(/\s+/g, "-").toLowerCase().slice(0, 60);
    const sectionsHtml = editedSections
      .map((s) => {
        const paras = s.body
          .split("\n\n")
          .map((p) => `  <p>${p.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
          .join("\n");
        return `<section>\n  <h2>${s.label}</h2>\n${paras}\n</section>`;
      })
      .join("\n\n");

    const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8"/>
  <title>Case Study: ${topic}</title>
  <style>
    body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 24px;line-height:1.9;color:#222;}
    h1{font-size:1.8rem;margin-bottom:8px;}
    h2{font-size:1.2rem;font-weight:700;margin-top:36px;border-bottom:1px solid #ddd;padding-bottom:6px;}
    p{margin:12px 0;}
    .meta{font-size:0.85rem;color:#666;margin-bottom:32px;}
  </style>
</head>
<body>
  <h1>${topic}</h1>
  <p class="meta">Language: ${language} &nbsp;·&nbsp; Pages: ${pages} &nbsp;·&nbsp; ~${wordCount.toLocaleString()} words</p>
  ${sectionsHtml}
</body>
</html>`;
    downloadFile(html, `case-study-${slug}.html`, "text/html");
    addToast("Downloaded as .html!", "success");
  }

  return (
    <div className="result-page">
      <div className="result-toolbar">
        <div className="result-toolbar-left">
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn btn-ghost" onClick={onRegenerate}>🔄 Regenerate All</button>
        </div>
        <div className="result-toolbar-right">
          <button className="btn btn-secondary" onClick={() => setEditing((v) => !v)}>
            {editing ? "👁 Preview" : "✏️ Edit Mode"}
          </button>
          <button className="btn btn-ghost" onClick={copyAll}>📋 Copy</button>
          <button className="btn btn-ghost" onClick={downloadTxt}>⬇ .txt</button>
          <button className="btn btn-ghost" onClick={downloadHtml}>⬇ .html</button>
          <button className="btn btn-primary" onClick={handleExportPDF} title="Export as PDF">
            📄 PDF
          </button>
          <button className="btn btn-primary" onClick={handleExportDOCX} title="Export as DOCX">
            📝 DOCX
          </button>
        </div>
      </div>

      <div className="result-meta">
        <div className="meta-chip">📚 <span>{topic}</span></div>
        <div className="meta-chip">🌐 <span>{language}</span></div>
        <div className="meta-chip">📄 <span>{pages} page{pages !== 1 ? "s" : ""}</span></div>
        <div className="meta-chip">✍️ <span>~{wordCount.toLocaleString()} words</span></div>
        <div className="meta-chip">📑 <span>{editedSections.length} sections</span></div>
      </div>

      <div className="result-doc glass">
        <div className="doc-title-block">
          <div className="doc-label">Case Study</div>
          <h1 className="doc-main-title">{topic}</h1>
          <div className="doc-sub">
            {language} · {pages} page{pages !== 1 ? "s" : ""} · ~{wordCount.toLocaleString()} words
          </div>
        </div>

        {editedSections.map((s) => (
          <div key={s.id} className="doc-section">
            <div className="doc-section-title">
              <span className="section-marker">✦</span>
              <span style={{ flex: 1 }}>{s.label}</span>
              <button
                className="icon-btn regen-btn"
                title="Regenerate this section"
                disabled={regenId !== null}
                onClick={() => handleRegenSection(s)}
                style={{ marginLeft: 8 }}
              >
                {regenId === s.id ? (
                  <span className="spin-inline">⟳</span>
                ) : "🔁"}
              </button>
            </div>

            {editing ? (
              <textarea
                className="doc-section-body-edit"
                value={s.body}
                onChange={(e) => updateBody(s.id, e.target.value)}
                aria-label={`Edit ${s.label}`}
              />
            ) : regenId === s.id ? (
              <div className="section-regen-loading">
                <span className="spin-inline" style={{ fontSize: "1.3rem" }}>⟳</span>
                Regenerating this section…
              </div>
            ) : (
              <div className="doc-section-body">
                {s.body.split("\n\n").map((para, pi) => {
                  // Use a stable key derived from content position, not just index
                  const key = `${s.id}-p${pi}`;
                  return <p key={key}>{para.trim()}</p>;
                })}
              </div>
            )}
          </div>
        ))}

        {editing && (
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setEditing(false)}>
              ✅ Save & Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
