// ─────────────────────────────────────────────────────────────────────────────
// AI Model Registry
// Three provider buckets: openrouter, openai, ollama
// ─────────────────────────────────────────────────────────────────────────────

export const AI_MODELS = {

  // ── OpenRouter (use sk-or-… key) ──────────────────────────────────────────
  openrouter: [
    // Free models (verified :free suffix or $0 pricing)
    {
      id: "nousresearch/hermes-3-llama-3.1-405b:free",
      name: "Hermes 3 Llama 405B",
      provider: "Nous Research",
      cost: "Free",
      description: "Best free option — strong long-form academic writing",
      recommended: true,
    },
    {
      id: "meta-llama/llama-3.1-8b-instruct:free",
      name: "Llama 3.1 8B",
      provider: "Meta",
      cost: "Free",
      description: "Fast and capable, good balance of quality and speed",
      recommended: true,
    },
    {
      id: "meta-llama/llama-3.2-3b-instruct:free",
      name: "Llama 3.2 3B",
      provider: "Meta",
      cost: "Free",
      description: "Lightweight, quick — fine for shorter documents",
      recommended: false,
    },
    {
      id: "google/gemma-4-26b-a4b-it:free",
      name: "Gemma 2 9B",
      provider: "Google",
      cost: "Free",
      description: "Google's verified-free model, solid for structured content",
      recommended: false,
    },
    {
      id: "mistralai/mistral-7b-instruct:free",
      name: "Mistral 7B",
      provider: "Mistral AI",
      cost: "Free",
      description: "Compact and fast, good for concise writing",
      recommended: false,
    },
    {
      id: "microsoft/phi-3-mini-128k-instruct:free",
      name: "Phi 3 Mini 128K",
      provider: "Microsoft",
      cost: "Free",
      description: "Very long context window, good for multi-section docs",
      recommended: false,
    },
    {
      id: "liquid/lfm-2.5-2.6b:free",
      name: "LiquidAI LFM 7B",
      provider: "Liquid AI",
      cost: "Free",
      description: "Designed for long-context tasks and multilingual output",
      recommended: true,
    },
    {
      id: "deepseek/deepseek-r1:free",
      name: "DeepSeek R1",
      provider: "DeepSeek",
      cost: "Free",
      description: "Strong reasoning model, very capable for academic writing",
      recommended: true,
    },
    // Paid models
    {
      id: "openai/gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "OpenAI",
      cost: "$0.15/1M tokens",
      description: "Most affordable paid option, very reliable output",
      recommended: true,
    },
    {
      id: "openai/gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      cost: "$5/1M tokens",
      description: "Best quality via OpenRouter",
      recommended: false,
    },
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      cost: "$3/1M tokens",
      description: "Excellent for long-form writing and nuanced language",
      recommended: false,
    },
    {
      id: "google/gemini-flash-1.5",
      name: "Gemini Flash 1.5",
      provider: "Google",
      cost: "$0.075/1M tokens",
      description: "Google's fast and cheap model with huge context",
      recommended: false,
    },
  ],

  // ── OpenAI Direct (use sk-… key) ─────────────────────────────────────────
  // ⚠️  OpenAI has NO free tier — all models require a paid account.
  //     To use GPT models for free, use OpenRouter (sk-or-…) instead.
  openai: [
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "OpenAI",
      cost: "$0.15 / 1M tokens",
      description: "Cheapest OpenAI option. Good quality for most case studies.",
      recommended: true,
    },
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      cost: "$5 / 1M tokens",
      description: "OpenAI's flagship model. Best output quality.",
      recommended: false,
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "OpenAI",
      cost: "$10 / 1M tokens",
      description: "Previous generation flagship. Still very capable.",
      recommended: false,
    },
  ],

  // ── Ollama (self-hosted, FREE) ────────────────────────────────────────────
  ollama: [
    {
      id: "llama3",
      name: "Llama 3 8B",
      provider: "Meta (local)",
      cost: "Free (self-hosted)",
      description: "Best all-round local model. Run: ollama pull llama3",
      recommended: true,
    },
    {
      id: "llama3.1",
      name: "Llama 3.1 8B",
      provider: "Meta (local)",
      cost: "Free (self-hosted)",
      description: "Improved Llama with better instruction following",
      recommended: true,
    },
    {
      id: "llama3.2",
      name: "Llama 3.2 3B",
      provider: "Meta (local)",
      cost: "Free (self-hosted)",
      description: "Lightweight, good for slower machines",
      recommended: false,
    },
    {
      id: "mistral",
      name: "Mistral 7B",
      provider: "Mistral AI (local)",
      cost: "Free (self-hosted)",
      description: "Fast and capable, great for academic writing",
      recommended: true,
    },
    {
      id: "deepseek-r1:7b",
      name: "DeepSeek R1 7B",
      provider: "DeepSeek (local)",
      cost: "Free (self-hosted)",
      description: "Strong reasoning — excellent for structured documents",
      recommended: true,
    },
    {
      id: "gemma2",
      name: "Gemma 2 9B",
      provider: "Google (local)",
      cost: "Free (self-hosted)",
      description: "Google's open model, solid writing quality",
      recommended: false,
    },
    {
      id: "phi3",
      name: "Phi 3 Mini",
      provider: "Microsoft (local)",
      cost: "Free (self-hosted)",
      description: "Very small footprint, runs on any machine",
      recommended: false,
    },
    {
      id: "qwen2.5:7b",
      name: "Qwen 2.5 7B",
      provider: "Alibaba (local)",
      cost: "Free (self-hosted)",
      description: "Excellent multilingual support — great for non-English docs",
      recommended: true,
    },
    {
      id: "custom",
      name: "Custom model name…",
      provider: "Ollama (local)",
      cost: "Free (self-hosted)",
      description: "Type any model you've pulled with: ollama pull <name>",
      recommended: false,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Returns the model list for the given API key / provider type */
export function getAvailableModels(apiKey = "") {
  const k = apiKey.trim().toLowerCase();
  if (k === "ollama" || k === "" || k === "local") return AI_MODELS.ollama;
  if (k.startsWith("sk-or-")) return AI_MODELS.openrouter;
  if (k.startsWith("sk-"))    return AI_MODELS.openai;
  return AI_MODELS.openrouter; // fallback
}

/** Returns the ID of the first recommended model for a given key */
export function getDefaultModel(apiKey = "") {
  const models = getAvailableModels(apiKey);
  return models.find((m) => m.recommended)?.id ?? models[0]?.id ?? "";
}

/** Returns full model info object for a given id */
export function getModelInfo(modelId, apiKey = "") {
  return getAvailableModels(apiKey).find((m) => m.id === modelId) ?? null;
}

/** Returns "ollama" | "openai" | "openrouter" */
export function getProviderLabel(apiKey = "") {
  const k = apiKey.trim().toLowerCase();
  if (k === "ollama" || k === "" || k === "local") return "ollama";
  if (k.startsWith("sk-or-")) return "openrouter";
  if (k.startsWith("sk-"))    return "openai";
  return "openrouter";
}
