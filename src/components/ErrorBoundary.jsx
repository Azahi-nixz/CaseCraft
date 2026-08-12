import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error("[CaseCraft ErrorBoundary]", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message ?? "Unknown error";

    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "'Nunito', sans-serif",
        padding: "40px 24px",
        textAlign: "center",
        gap: 20,
      }}>
        <div style={{ fontSize: "5rem", animation: "bob 1.5s ease-in-out infinite alternate" }}>💥</div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "1.5rem",
          fontWeight: 900,
          background: "linear-gradient(135deg, var(--pink), var(--purple))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Something went wrong!
        </div>
        <div style={{
          maxWidth: 480,
          padding: "16px 20px",
          background: "rgba(231,76,110,0.1)",
          border: "1px solid rgba(231,76,110,0.3)",
          borderRadius: 12,
          fontSize: "0.88rem",
          color: "#e74c6e",
          wordBreak: "break-word",
        }}>
          {msg}
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", maxWidth: 380 }}>
          This is an isolated crash — your session data may still be intact.
          Click below to attempt recovery.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={this.handleReset}
          >
            🔄 Try to Recover
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => window.location.reload()}
          >
            ↺ Full Reload
          </button>
        </div>
        <style>{`
          @keyframes bob {
            from { transform: scale(0.9) rotate(-5deg); }
            to   { transform: scale(1.1) rotate(5deg); }
          }
        `}</style>
      </div>
    );
  }
}
