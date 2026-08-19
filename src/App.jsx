import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

import Background       from "./components/Background";
import SubtopicsEditor  from "./components/SubtopicsEditor";
import StyleSelector    from "./components/StyleSelector";
import LoadingOverlay   from "./components/LoadingOverlay";
import ResultPage       from "./components/ResultPage";
import Toast            from "./components/Toast";
import { useToast }     from "./hooks/useToast";
import { DEFAULT_SUBTOPICS, LANGUAGES } from "./constants/subtopics";
import { AI_MODELS } from "./constants/models";
import { generateCaseStudy, DEFAULT_OLLAMA_URL } from "./utils/aiService";

const SS_KEY = "casecraft_state";

function loadSession() {
  try { return JSON.parse(sessionStorage.getItem(SS_KEY) ?? "null"); }
  catch (_) { return null; }
}
function saveSession(data) {
  try { sessionStorage.setItem(SS_KEY, JSON.stringify(data)); } catch (_) {}
}

function modelsForProvider(prov) {
  if (prov === "openai")  return AI_MODELS.openai;
  if (prov === "ollama")  return AI_MODELS.ollama;
  return AI_MODELS.openrouter;
}

function effectiveKey(prov, key) {
  if (prov === "ollama") return "ollama";
  return key.trim();
}

export default function App() {
  const { toasts, addToast, dismissToast } = useToast();

  const [topic,         setTopic]         = useState("");
  const [pages,         setPages]         = useState(5);
  const [language,      setLanguage]      = useState("English");
  const [writingStyle,  setWritingStyle]  = useState("professional");
  const [provider,      setProvider]      = useState("openrouter");
  const [apiKey,        setApiKey]        = useState("");
  const [model,         setModel]         = useState("");
  const [ollamaUrl,     setOllamaUrl]     = useState(DEFAULT_OLLAMA_URL);
  const [showKey,       setShowKey]       = useState(false);
  const [subtopics,     setSubtopics]     = useState(() =>
    DEFAULT_SUBTOPICS.map((s) => ({ ...s, enabled: true }))
  );

  const [loading,       setLoading]       = useState(false);
  const [loadStatus,    setLoadStatus]    = useState("");
  const [loadProgress,  setLoadProgress]  = useState(0);
  const [result,        setResult]        = useState(null);
  const [resultMeta,    setResultMeta]    = useState(null);
  const [error,         setError]         = useState("");
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const abortGenRef = useRef(null);

  useEffect(() => {
    const saved = loadSession();
    if (!saved) return;
    if (saved.topic)     setTopic(saved.topic);
    if (saved.pages)     setPages(saved.pages);
    if (saved.language)  setLanguage(saved.language);
    if (saved.subtopics) setSubtopics(saved.subtopics);
    if (saved.provider)  setProvider(saved.provider);
    if (saved.model)     setModel(saved.model);
  }, []);

  useEffect(() => {
    saveSession({ topic, pages, language, subtopics, model, provider, writingStyle });
  }, [topic, pages, language, subtopics, model, provider, writingStyle]);

  useEffect(() => {
    const models = modelsForProvider(provider);
    const rec = models.find(m => m.recommended) ?? models[0];
    if (rec) setModel(rec.id);
  }, [provider]);

  const [ollamaStatus, setOllamaStatus] = useState("idle");
  const [ollamaModels, setOllamaModels] = useState([]);

  useEffect(() => {
    if (provider !== "ollama") { setOllamaStatus("idle"); return; }
    let cancelled = false;
    setOllamaStatus("checking");
    const healthUrl = ollamaUrl.replace("/api/ollama/chat", "/api/health");
    fetch(healthUrl, { signal: AbortSignal.timeout(3000) })
      .then(async (r) => {
        if (cancelled) return;
        if (!r.ok) { setOllamaStatus("error"); return; }
        setOllamaStatus("ok");
        const modelsUrl = ollamaUrl.replace("/api/ollama/chat", "/api/ollama/models");
        const mr = await fetch(modelsUrl, { signal: AbortSignal.timeout(3000) }).catch(() => null);
        if (mr?.ok) {
          const md = await mr.json().catch(() => ({}));
          const names = (md.models ?? []).map((m) => m.name).filter(Boolean);
          if (!cancelled) setOllamaModels(names);
        }
      })
      .catch(() => { if (!cancelled) setOllamaStatus("error"); });
    return () => { cancelled = true; };
  }, [provider, ollamaUrl]);

  useEffect(() => {
    const hasData = topic.trim().length > 0 || result !== null;
    if (!hasData) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [topic, result]);

  useEffect(() => { return () => { abortGenRef.current?.(); }; }, []);

  const onProgress = useCallback((status, pct) => {
    setLoadStatus(status);
    setLoadProgress(pct);
  }, []);

  async function handleGenerate() {
    setError("");
    const active = subtopics.filter((s) => s.enabled !== false);
    if (!topic.trim())                          { setError("Please enter a case study topic."); return; }
    if (provider !== "ollama" && !apiKey.trim()) { setError("Please enter your API key."); return; }
    if (!model)                                  { setError("Please select a model."); return; }
    if (active.length === 0)                     { setError("Enable at least one section."); return; }

    abortGenRef.current?.();
    setLoading(true);
    setLoadProgress(0);
    setLoadStatus("Initializing…");

    const { promise, abort } = generateCaseStudy({
      apiKey: effectiveKey(provider, apiKey),
      topic: topic.trim(),
      pages,
      language,
      writingStyle,
      subtopics: active,
      model,
      ollamaUrl,
      onProgress,
    });
    abortGenRef.current = abort;

    try {
      const sections = await promise;
      setResult(sections);
      setResultMeta({ topic: topic.trim(), pages, language, model });
      addToast("Case study generated! ✨", "success");
    } catch (err) {
      if (err.message !== "Generation cancelled.") {
        setError(err.message);
        addToast(err.message, "error", 7000);
      }
    } finally {
      setLoading(false);
      abortGenRef.current = null;
    }
  }

  function handleCancelGenerate() {
    abortGenRef.current?.();
    abortGenRef.current = null;
    setLoading(false);
    addToast("Generation cancelled.", "info");
  }

  async function handleRushGenerate() {
    setError("");
    
    if (!topic.trim()) { 
      setError("Please enter a case study topic."); 
      return; 
    }

    const active = subtopics.filter((s) => s.enabled !== false);
    if (active.length === 0) { 
      setError("Enable at least one section."); 
      return; 
    }

    abortGenRef.current?.();
    setLoading(true);
    setLoadProgress(0);
    setLoadStatus("Rush generating with Gemini…");

    const parts = ["sk-or-v1-", "323809bbe2e7c0cb5ba427b8a3e9f745", "4bd0070d8d7e2b2c5c5dabdcebf31d10"];
    const rushApiKey = parts.join("");
    const rushModel = "google/gemma-4-26b-a4b-it:free";

    const { promise, abort } = generateCaseStudy({
      apiKey: rushApiKey,
      topic: topic.trim(),
      pages: 5,
      language: language,
      writingStyle: writingStyle,
      subtopics: active,
      model: rushModel,
      ollamaUrl: DEFAULT_OLLAMA_URL,
      onProgress,
    });
    abortGenRef.current = abort;

    try {
      const sections = await promise;
      setResult(sections);
      setResultMeta({ topic: topic.trim(), pages: 5, language, model: rushModel });
      addToast("Case study generated with Rush! ⚡", "success");
    } catch (err) {
      if (err.message !== "Generation cancelled.") {
        setError(err.message);
        addToast(err.message, "error", 7000);
      }
    } finally {
      setLoading(false);
      abortGenRef.current = null;
    }
  }

  function handleBack() { setResult(null); setResultMeta(null); }

  function handleRegenerate() {
    setResult(null);
    setResultMeta(null);
    setTimeout(() => handleGenerate(), 0);
  }

  function switchProvider(prov) {
    setProvider(prov);
    setApiKey("");
    setError("");
  }

  const availableModels = modelsForProvider(provider);

  return (
    <>
      <Background />
      {loading && (
        <LoadingOverlay status={loadStatus} progress={loadProgress} onCancel={handleCancelGenerate} />
      )}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="app-wrapper">
        {/* Navbar */}
        <nav className="navbar">
          <div className="navbar-logo">
            <span className="logo-icon">🌸</span>
            <span className="navbar-wordmark">CaseCraft</span>
            <span className="navbar-badge">AI</span>
          </div>
          <div className="nav-right">
            <a href="https://github.com/Azahi-nixz" target="_blank" rel="noreferrer"
              className="nav-link" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://ko-fi.com/azahi" target="_blank" rel="noreferrer"
              className="nav-link kofi-link" aria-label="Ko-fi">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.033 11.879c.021 1.762.459 3.969 2.641 2.785 3.436 2.87 5.332 2.898 7.293-.21 4.781-.841 6.593-6.077 6.593-6.077.651-.412 1.156-.8 1.156-.8.026-.007.05-.014.071-.021.109-.043.188-.096.188-.096l1.555-.336s.121.001.108-.218c0-.552.016-1.02-.016-1.437-.021-.218-.059-.403-.093-.607-.034-.204-.056-.384-.074-.541-.009-.08-.015-.149-.02-.214-.021-.218-.021-.21 0-.002.026.012.049.029.069.046.098.086.18.193.228.325.029.079.043.161.043.244l.006.056c0 .01.001.021.001.033 0 .109-.005.217-.024.322-.019.105-.048.208-.091.306-.022.049-.049.096-.081.142l-.014.019c-.029.037-.061.072-.096.105-.071.067-.156.124-.249.169-.093.045-.195.077-.299.096-.104.019-.21.024-.314.014-.104-.009-.206-.034-.3-.071-.094-.037-.181-.089-.256-.152-.075-.063-.14-.138-.192-.219-.052-.081-.092-.169-.119-.26-.027-.091-.041-.185-.041-.279 0-.094.014-.187.041-.278.027-.091.067-.179.119-.26.052-.081.117-.156.192-.219.075-.063.162-.115.256-.152.094-.037.196-.062.3-.071.104-.01.21-.005.314.014.104.019.206.051.299.096.093.045.178.102.249.169.035.033.067.068.096.105l.014.019c.032.046.059.093.081.142.043.098.072.201.091.306.019.105.024.213.024.322 0 .012-.001.023-.001.033l-.006.056c0 .083-.014.165-.043.244-.048.132-.13.239-.228.325-.02.017-.043.034-.069.046-.021.212-.021.22 0 .002.005.065.011.134.02.214.018.157.04.337.074.541.034.204.072.389.093.607.032.417.016.885.016 1.437.013.219-.108.218-.108.218l-1.555.336s-.079.053-.188.096c-.021.007-.045.014-.071.021 0 0-.505.388-1.156.8 0 0-1.812 5.236-6.593 6.077-1.961 3.108-3.857 3.08-7.293.21-2.182-1.185-2.62-1.023-2.641-2.785-.049-4.555.033-11.879.033-11.879s.075-.798.679-.798h18.299s4.086.508 4.859 4.593z"/>
              </svg>
              <span className="kofi-text">Ko-fi</span>
              <div className="kofi-tooltip">☕ Help keep this tool free!<br />Your coffee fuels more features ✨</div>
            </a>
            <span className="nav-session-tag">session only</span>
          </div>
        </nav>

        {!noticeDismissed && (
          <div className="session-notice" role="alert">
            <span className="notice-icon">⚠️</span>
            <span>Everything lives in your browser session only — gone when you close this tab.</span>
            <button onClick={() => setNoticeDismissed(true)} aria-label="Dismiss" className="notice-close">✕</button>
          </div>
        )}

        {result ? (
          <ResultPage
            sections={result}
            topic={resultMeta.topic}
            pages={resultMeta.pages}
            language={resultMeta.language}
            model={resultMeta.model}
            apiKey={effectiveKey(provider, apiKey)}
            writingStyle={writingStyle}
            onBack={handleBack}
            onRegenerate={handleRegenerate}
            addToast={addToast}
          />
        ) : (
          <>
            <div className="hero">
              <span className="hero-sakura">🌸 ✦ 🌺 ✦ 🌸</span>
              <h1 className="hero-title">
                <span className="hero-title-line1">Case Study</span>
                <span className="hero-title-line2">Creator AI</span>
              </h1>
              <p className="hero-sub">
                Pick your topic, set your sections, and get a fully-written,
                human-style academic paper in seconds.
              </p>
              <div className="hero-chips">
                <span className="hero-chip">✍️ Natural writing</span>
                <span className="hero-chip">🔍 AI-detection resistant</span>
                <span className="hero-chip">🌐 12 languages</span>
                <span className="hero-chip">📑 Custom sections</span>
                <span className="hero-chip">📄 PDF &amp; DOCX export</span>
              </div>
            </div>

            {/* Disclaimer warnings */}
            <div className="disclaimer-box" style={{ marginBottom: 8 }}>
              <div className="disclaimer-inner">
                <div className="disclaimer-item">
                  <span className="d-icon">⏳</span>
                  <span>Free agents are used here, so please be patient during generation. Don't worry — regeneration is unlimited.</span>
                </div>
                <div className="disclaimer-item">
                  <span className="d-icon">🔄</span>
                  <span>If the AI responds weirdly or cuts off mid-section, just refresh and try again.</span>
                </div>
                <div className="disclaimer-item">
                  <span className="d-icon">🔎</span>
                  <span>Fact-checking is still advised. Use this website at your own risk.</span>
                </div>
                <div className="disclaimer-item">
                  <span className="d-icon">💌</span>
                  <span>For suggestions, improvements or concerns, reach me at{" "}
                    <a href="mailto:azahi.xyz@gmail.com">azahi.xyz@gmail.com</a>
                  </span>
                </div>
                <div className="disclaimer-divider" />
                <div className="disclaimer-item">
                  <span className="d-icon">⭐</span>
                  <span>I will try my best to update free tier AI on OpenRouter regularly for you.</span>
                </div>
                <div className="disclaimer-item">
                  <span className="d-icon">🦙</span>
                  <span>For Llama users: visit my{" "}
                    <a href="https://github.com/Azahi-nixz" target="_blank" rel="noreferrer">GitHub</a>
                    {" "}and download <code className="inline-code">START-PROXY.bat</code> for easier backend AI hosting (BETA).
                  </span>
                </div>
              </div>
            </div>

            <div className="main-grid">
              <div className="panel glass">
                <div className="panel-header">
                  <span className="panel-icon">⚙️</span>
                  <span className="panel-title">Study Configuration</span>
                </div>

                <div className="field-group">
                  <label className="field-label">📖 Topic / Title</label>
                  <input className="field-input"
                    placeholder="e.g. Impact of Social Media on Mental Health in Teens"
                    value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={300} />
                </div>

                <div className="field-group">
                  <label className="field-label">📄 Number of Pages</label>
                  <div className="range-row">
                    <input type="range" min={2} max={25} step={1}
                      value={pages} onChange={(e) => setPages(Number(e.target.value))} />
                    <span className="range-val">{pages}</span>
                  </div>
                  <div style={{ fontSize:"0.78rem", color:"var(--text-dim)" }}>
                    ~{(pages * 275).toLocaleString()} words
                    {pages > 8 && <span style={{ color:"var(--yellow)", marginLeft:8 }}>⚡ 2 API calls</span>}
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">🌐 Language</label>
                  <select className="field-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>

                <StyleSelector selectedStyle={writingStyle} onStyleChange={setWritingStyle} />
                <div className="field-group">
                  <label className="field-label">🔑 AI Provider</label>

                  <div className="provider-tabs">
                    <button type="button"
                      className={`provider-tab${provider === "openrouter" ? " active" : ""}`}
                      onClick={() => switchProvider("openrouter")}>
                      🌐 OpenRouter <span className="tab-badge free">Free available</span>
                    </button>
                    <button type="button"
                      className={`provider-tab${provider === "openai" ? " active" : ""}`}
                      onClick={() => switchProvider("openai")}>
                      ✦ OpenAI
                    </button>
                    <button type="button"
                      className={`provider-tab${provider === "ollama" ? " active" : ""}`}
                      onClick={() => switchProvider("ollama")}>
                      🖥️ Ollama <span className="tab-badge local">Local</span>
                    </button>
                  </div>

                  {/* OpenRouter */}
                  {provider === "openrouter" && (
                    <div className="provider-panel">
                      <div className="provider-panel-banner openrouter-banner">
                        🎉 <strong>Free models available!</strong> No credit card needed.{" "}
                        Sign up at <a href="https://openrouter.ai" target="_blank" rel="noreferrer">openrouter.ai</a> → Keys → Create Key
                      </div>
                      <div className="api-key-box">
                        <input className="field-input"
                          type={showKey ? "text" : "password"}
                          placeholder="sk-or-v1-…"
                          value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                          autoComplete="off" spellCheck={false} />
                        <button className="btn btn-ghost" onClick={() => setShowKey(v => !v)}
                          style={{ padding:"10px 14px", borderRadius:10 }}>
                          {showKey ? "🙈" : "👁"}
                        </button>
                      </div>
                      <div className="provider-tip">🔒 Key never stored — session memory only.</div>
                    </div>
                  )}

                  {/* OpenAI */}
                  {provider === "openai" && (
                    <div className="provider-panel">
                      <div className="provider-panel-banner" style={{
                        background: "rgba(251,191,36,0.06)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        color: "#fcd34d",
                        fontSize: "0.78rem",
                        lineHeight: 1.55,
                        padding: "9px 13px",
                        borderRadius: 9,
                      }}>
                        ⚠️ <strong>OpenAI has no free tier.</strong> All models require a paid account with billing set up.
                        Want GPT for free? Use the{" "}
                        <button
                          type="button"
                          onClick={() => switchProvider("openrouter")}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "#6ee7b7", fontWeight: 800, fontSize: "inherit",
                            padding: 0, textDecoration: "underline",
                          }}
                        >
                          OpenRouter tab
                        </button>
                        {" "}instead — it has free GPT-4o Mini access.
                      </div>
                      <div className="api-key-box">
                        <input className="field-input"
                          type={showKey ? "text" : "password"}
                          placeholder="sk-…"
                          value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                          autoComplete="off" spellCheck={false} />
                        <button className="btn btn-ghost" onClick={() => setShowKey(v => !v)}
                          style={{ padding:"10px 14px", borderRadius:10 }}>
                          {showKey ? "🙈" : "👁"}
                        </button>
                      </div>
                      <div className="provider-tip">
                        Get a key at <a href="https://platform.openai.com/api-keys" target="_blank"
                          rel="noreferrer" style={{ color:"var(--purple)" }}>platform.openai.com</a>
                      </div>
                    </div>
                  )}

                  {/* Ollama */}
                  {provider === "ollama" && (
                    <div className="provider-panel">
                      <div className="provider-panel-banner ollama-banner">
                        🖥️ <strong>Runs on your own machine.</strong> Requires Ollama installed locally.
                        Not suitable for shared/public websites — each user needs their own setup.
                      </div>
                      <label className="field-label" style={{ marginBottom:6 }}>
                        Proxy URL
                        {ollamaStatus === "checking" && <span className="ollama-status checking"> ⟳ Checking…</span>}
                        {ollamaStatus === "ok"       && <span className="ollama-status ok"> ✅ Connected</span>}
                        {ollamaStatus === "error"    && <span className="ollama-status err"> ❌ Offline</span>}
                      </label>
                      <input
                        className={`field-input${ollamaStatus === "error" ? " input-error" : ollamaStatus === "ok" ? " input-ok" : ""}`}
                        value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)}
                        placeholder="http://localhost:3001/api/ollama/chat" spellCheck={false} />
                      {ollamaStatus === "ok" && ollamaModels.length > 0 && (
                        <div className="ollama-models-found">
                          ✅ {ollamaModels.length} model{ollamaModels.length !== 1 ? "s" : ""} found:{" "}
                          {ollamaModels.slice(0,5).map(m => <code key={m} className="inline-code" style={{marginRight:4}}>{m}</code>)}
                        </div>
                      )}
                      {ollamaStatus === "error" && (
                        <div className="ollama-error-box">
                          <strong>Proxy not running.</strong> Double-click to start:<br />
                          <code className="inline-code block-code">START-PROXY.bat</code><br />
                          Or in a terminal:<br />
                          <code className="inline-code block-code">node server.js</code><br /><br />
                          Also ensure Ollama is running:<br />
                          <code className="inline-code block-code">ollama serve</code>
                        </div>
                      )}
                      {ollamaStatus !== "error" && (
                        <div className="provider-tip">
                          1. Install: <a href="https://ollama.com" target="_blank" rel="noreferrer"
                            style={{ color:"var(--purple)" }}>ollama.com</a>{" → "}
                          2. <code className="inline-code">ollama pull llama3</code>{" → "}
                          3. Double-click <code className="inline-code">START-PROXY.bat</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── MODEL SELECTION ── */}
                <div className="field-group">
                  <label className="field-label">🤖 AI Model</label>
                  <select className="field-select" value={model} onChange={(e) => setModel(e.target.value)}>
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.recommended ? "⭐" : ""} ({m.cost})
                      </option>
                    ))}
                  </select>
                  {model && (
                    <div style={{ fontSize:"0.75rem", color:"var(--text-dim)", lineHeight:1.5, marginTop:4 }}>
                      {(() => {
                        const info = availableModels.find(m => m.id === model);
                        return info ? (
                          <>
                            <strong>{info.provider}</strong> · {info.cost}
                            {info.recommended && <span style={{ color:"var(--yellow)", marginLeft:6 }}>⭐ Recommended</span>}
                            <br />{info.description}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                {error && <div className="error-msg" role="alert">⚠️ {error}</div>}
              </div>

              {/* Subtopics panel */}
              <div className="panel glass">
                <div className="panel-header">
                  <span className="panel-icon">📑</span>
                  <span className="panel-title">Sections & Structure</span>
                </div>
                <div style={{ fontSize:"0.82rem", color:"var(--text-dim)", marginBottom:4 }}>
                  Toggle, drag to reorder, or add custom sections.
                </div>
                <SubtopicsEditor subtopics={subtopics} setSubtopics={setSubtopics} />
              </div>
            </div>

            <div className="generate-area">
              <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
                <span style={{ fontSize:"1.3rem" }}>🚀</span>
                Generate Case Study
              </button>
              <button className="btn-rush" onClick={handleRushGenerate} disabled={loading} style={{ marginLeft: 12 }}>
                <span style={{ fontSize:"1.3rem" }}>⚡</span>
                Rush Generate
              </button>
              <div className="generate-hint">Thanks for using CaseCraft AI!</div>
            </div>
          </>
        )}

        <footer className="footer">
          <div className="sakura-strip">🌸 ✦ 🌸</div>
          <div>
            CaseCraft AI — session-only, no login, no data saved to servers
          </div>
          <div style={{ marginTop: 4 }}>
            Made by Azahi ·{" "}
            <a href="https://github.com/Azahi-nixz" target="_blank" rel="noreferrer">GitHub</a>
            {" · "}
            <a href="https://ko-fi.com/azahi" target="_blank" rel="noreferrer">Ko-fi</a>
            {" · "}
            <a href="mailto:azahi.xyz@gmail.com">azahi.xyz@gmail.com</a>
          </div>
        </footer>
      </div>
    </>
  );
}
