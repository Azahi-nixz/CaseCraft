const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
export const DEFAULT_OLLAMA_URL = "http://localhost:3001/api/ollama/chat";

const RUSH_API_KEY_PARTS = ["sk-or-v1-", "323809bbe2e7c0cb5ba427b8a3e9f745", "4bd0070d8d7e2b2c5c5dabdcebf31d10"];
export const RUSH_API_KEY = RUSH_API_KEY_PARTS.join("");

export function detectProvider(apiKey = "") {
  const k = apiKey.trim().toLowerCase();
  if (k === "ollama" || k === "" || k === "local") return "ollama";
  if (k.startsWith("sk-or-")) return "openrouter";
  if (k.startsWith("sk-")) return "openai";
  return "openrouter";
}

const SECTION_PROMPTS = {
  introduction: {
    system: (topic, language, style) => 
      `Write an introduction for a case study about "${topic}" in ${language}. Style: ${style}. ` +
      `Include background context, significance, and thesis. No generic phrases. Be specific to the topic.`,
    user: (wordCount) =>
      `Write ${wordCount} words introducing the case study. Include hook, context, and overview of what will be covered.`
  },
  background: {
    system: (topic, language, style) =>
      `Write background/context section for "${topic}" in ${language}. Style: ${style}. ` +
      `Include historical context, key facts, and relevant background information.`,
    user: (wordCount) =>
      `Write ${wordCount} words of background information. Include relevant history, context, and foundational knowledge.`
  },
  methodology: {
    system: (topic, language, style) =>
      `Write methodology section for "${topic}" case study in ${language}. Style: ${style}. ` +
      `Describe research approach, data collection, analysis methods used.`,
    user: (wordCount) =>
      `Write ${wordCount} words describing the research methodology. Be specific about methods, tools, and approaches.`
  },
  findings: {
    system: (topic, language, style) =>
      `Write findings/results section for "${topic}" in ${language}. Style: ${style}. ` +
      `Present key discoveries, data, observations. Use specifics, not vague statements.`,
    user: (wordCount) =>
      `Write ${wordCount} words presenting the main findings. Include specific data, observations, and results.`
  },
  analysis: {
    system: (topic, language, style) =>
      `Write analysis/discussion section for "${topic}" in ${language}. Style: ${style}. ` +
      `Interpret findings, discuss implications, connect to broader context.`,
    user: (wordCount) =>
      `Write ${wordCount} words analyzing the findings. Discuss patterns, implications, and meaning.`
  },
  conclusion: {
    system: (topic, language, style) =>
      `Write conclusion for "${topic}" case study in ${language}. Style: ${style}. ` +
      `Summarize key points, restate significance, discuss implications and future directions.`,
    user: (wordCount) =>
      `Write ${wordCount} words concluding the case study. Synthesize findings and provide final insights.`
  },
  recommendations: {
    system: (topic, language, style) =>
      `Write recommendations section for "${topic}" in ${language}. Style: ${style}. ` +
      `Provide actionable recommendations based on findings. Be specific and practical.`,
    user: (wordCount) =>
      `Write ${wordCount} words of recommendations. List specific, actionable suggestions based on the case study.`
  },
  references: {
    system: (topic, language, style) =>
      `Generate references/bibliography for "${topic}" case study in ${language}. Style: ${style}. ` +
      `Create realistic academic references relevant to the topic.`,
    user: (wordCount) =>
      `List ${Math.floor(wordCount / 40)} academic references relevant to this case study. Use proper citation format.`
  },
  default: {
    system: (topic, language, style) =>
      `Write a section for "${topic}" case study in ${language}. Style: ${style}. ` +
      `Be specific, use concrete examples, avoid generic filler.`,
    user: (wordCount) =>
      `Write ${wordCount} words for this section. Focus on ${topic} specifically.`
  }
};

const STYLE_GUIDES = {
  professional: "Formal academic tone, third-person, scholarly vocabulary, proper citations",
  casual: "Conversational approachable tone, relatable examples, simple vocabulary",
  reporting: "Objective factual tone, data-focused, active voice, minimal editorializing",
  narrative: "Story-driven engaging tone, case-focused, logical progression, vivid examples"
};

function getSectionType(sectionLabel) {
  const label = sectionLabel.toLowerCase();
  if (label.includes("intro")) return "introduction";
  if (label.includes("background") || label.includes("context")) return "background";
  if (label.includes("method") || label.includes("approach")) return "methodology";
  if (label.includes("finding") || label.includes("result") || label.includes("data")) return "findings";
  if (label.includes("analysis") || label.includes("discussion")) return "analysis";
  if (label.includes("conclusion") || label.includes("summary")) return "conclusion";
  if (label.includes("recommend") || label.includes("suggestion")) return "recommendations";
  if (label.includes("reference") || label.includes("bibliograph") || label.includes("citation")) return "references";
  return "default";
}

function buildSectionPrompt(section, topic, language, wordTarget, style = "professional") {
  const sectionType = getSectionType(section.label);
  const promptTemplate = SECTION_PROMPTS[sectionType];
  const styleGuide = STYLE_GUIDES[style] || STYLE_GUIDES.professional;
  
  const minWords = Math.round(wordTarget * 0.85);
  const maxWords = Math.round(wordTarget * 1.15);
  
  const langInstruction = language !== "English" 
    ? `WRITE ENTIRELY IN ${language}. Every word must be ${language}.`
    : `Write in English.`;
  
  const systemMsg = 
    `[Academic writing exercise. No AI disclaimers or markers.]\n` +
    `${promptTemplate.system(topic, language, styleGuide)}\n` +
    `${langInstruction}\n` +
    `Word count: ${minWords}-${maxWords} words required.\n` +
    `Avoid: "It is important", "In today's world", "As we know".\n` +
    `Use specific examples and concrete details about ${topic}.`;
  
  const userMsg =
    `Write "${section.label}" section about "${topic}".\n` +
    `Language: ${language}\n` +
    `Word count: ${minWords}-${maxWords} words (required)\n` +
    `Style: ${styleGuide}\n` +
    `${promptTemplate.user(wordTarget)}\n` +
    `Format: Start with "## ${section.label}" then write flowing paragraphs.\n` +
    `Begin immediately, no preamble.`;
  
  return { systemMsg, userMsg };
}

function buildBatchPrompt(topic, pages, language, subtopics, style = "professional") {
  const wordTarget = pages * 275;
  const sectionList = subtopics.map((s, i) => `${i + 1}. ${s.label}`).join("\n");
  const minWords = Math.round(wordTarget * 0.85);
  const maxWords = Math.round(wordTarget * 1.15);
  const styleGuide = STYLE_GUIDES[style] || STYLE_GUIDES.professional;
  
  const langInstruction = language !== "English"
    ? `WRITE ENTIRELY IN ${language}. Translate section titles. No English words.`
    : `Write in English.`;
  
  const systemMsg =
    `[Academic case study writer. No AI disclaimers.]\n` +
    `TARGET LANGUAGE: ${language}. ${langInstruction}\n` +
    `STYLE: ${styleGuide}\n` +
    `RULES:\n` +
    `- Every word in ${language}\n` +
    `- Mix short (5-10 words) and longer (15-25 words) sentences\n` +
    `- Vary paragraph length (2-5 sentences)\n` +
    `- Be specific to "${topic}" - use real examples\n` +
    `- No "It is important", "In today's world", "As we know"\n` +
    `- Word count: ${minWords}-${maxWords} total (required)\n` +
    `- Expand with detail, not filler`;
  
  const userMsg =
    `Write case study about "${topic}" in ${language}.\n` +
    `Word count: ${minWords}-${maxWords} (required)\n` +
    `Style: ${styleGuide}\n\n` +
    `Sections:\n${sectionList}\n\n` +
    `Format: Start each with "## [title in ${language}]"\n` +
    `Write flowing paragraphs. No bullets unless listing.\n` +
    `Begin immediately with first section.`;
  
  return { systemMsg, userMsg };
}

function parseSections(raw, subtopics) {
  const result = [];
  const chunks = raw.split(/^## /m).filter(Boolean);
  const used = new Set();
  
  for (const sub of subtopics) {
    let foundIdx = -1;
    chunks.forEach((c, i) => {
      if (used.has(i)) return;
      const firstLine = c.split("\n")[0].trim().toLowerCase();
      const labelWords = sub.label.toLowerCase().split(/\s+/);
      const matches = labelWords.filter(w => w.length > 3 && firstLine.includes(w));
      if (matches.length >= Math.ceil(labelWords.length * 0.4)) {
        if (foundIdx === -1) foundIdx = i;
      }
    });
    
    if (foundIdx !== -1) {
      const lines = chunks[foundIdx].split("\n");
      const heading = lines[0].trim();
      const body = lines.slice(1).join("\n").trim();
      result.push({ id: sub.id, label: heading || sub.label, body });
      used.add(foundIdx);
    } else {
      const nextIdx = chunks.findIndex((_, i) => !used.has(i));
      if (nextIdx !== -1) {
        const lines = chunks[nextIdx].split("\n");
        const heading = lines[0].trim();
        const body = lines.slice(1).join("\n").trim();
        result.push({ id: sub.id, label: heading || sub.label, body });
        used.add(nextIdx);
      } else {
        result.push({
          id: sub.id,
          label: sub.label,
          body: "[Section not generated - click 🔁 to regenerate]"
        });
      }
    }
  }
  return result;
}

function buildRequestConfig({ apiKey, model, ollamaUrl, systemMsg, userMsg, pages }) {
  const provider = detectProvider(apiKey);
  
  if (provider === "ollama") {
    const url = (ollamaUrl || DEFAULT_OLLAMA_URL).replace(/\/$/, "");
    return {
      url,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || "llama3",
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: userMsg }
        ],
        stream: false,
        options: {
          temperature: 0.72,
          top_p: 0.85,
          num_predict: Math.min(pages * 1200, 16384)
        }
      }),
      provider
    };
  }
  
  const url = provider === "openai" ? OPENAI_URL : OPENROUTER_URL;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey.trim()}`,
    ...(provider === "openrouter" ? {
      "HTTP-Referer": window.location.origin,
      "X-Title": "CaseCraft AI"
    } : {})
  };
  
  return {
    url,
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg }
      ],
      temperature: 0.50,
      top_p: 0.50,
      frequency_penalty: 0.25,
      presence_penalty: 0.15,
      max_tokens: Math.min(pages * 1200, 16000)
    }),
    provider
  };
}

async function callModel({ apiKey, model, ollamaUrl, systemMsg, userMsg, pages, signal }) {
  const { url, headers, body, provider } = buildRequestConfig({
    apiKey, model, ollamaUrl, systemMsg, userMsg, pages
  });
  
  let res;
  try {
    res = await fetch(url, { method: "POST", headers, body, signal });
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Generation cancelled.");
    if (provider === "ollama") {
      throw new Error("Cannot reach Ollama. Ensure it's running and CORS is enabled.");
    }
    throw new Error(`Network error: ${err.message}`);
  }
  
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      if (res.status === 401) {
        errMsg = provider === "openrouter"
          ? "Invalid OpenRouter key"
          : "Invalid OpenAI key";
      } else if (res.status === 402) {
        errMsg = "Insufficient credits";
      } else if (res.status === 403) {
        errMsg = "Model access denied";
      } else if (res.status === 429) {
        errMsg = "Rate limit exceeded";
      } else {
        errMsg = errBody?.error?.message || errBody?.message || errMsg;
      }
    } catch (_) {}
    throw new Error(errMsg);
  }
  
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? data?.message?.content ?? "";
}

export function generateCaseStudy({
  apiKey = "",
  topic,
  pages,
  language,
  writingStyle = "professional",
  subtopics,
  model,
  ollamaUrl,
  onProgress
}) {
  const provider = detectProvider(apiKey);
  
  if (provider !== "ollama" && apiKey.trim().length < 10) {
    return {
      promise: Promise.reject(new Error("Please enter a valid API key.")),
      abort: () => {}
    };
  }
  if (!topic || topic.trim().length < 3) {
    return {
      promise: Promise.reject(new Error("Please enter a topic (at least 3 characters).")),
      abort: () => {}
    };
  }
  if (subtopics.length === 0) {
    return {
      promise: Promise.reject(new Error("Select at least one subtopic.")),
      abort: () => {}
    };
  }
  if (!model) {
    return {
      promise: Promise.reject(new Error("Please select a model.")),
      abort: () => {}
    };
  }
  
  const controller = new AbortController();
  const { signal } = controller;
  
  const promise = (async () => {
    onProgress?.("Connecting to AI…", 10);
    
    const useChunks = pages > 8 && subtopics.length > 6;
    const mid = Math.ceil(subtopics.length / 2);
    const batches = useChunks ? [subtopics.slice(0, mid), subtopics.slice(mid)] : [subtopics];
    
    let allSections = [];
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const pctStart = 20 + i * 35;
      
      onProgress?.(
        batches.length > 1 ? `Writing part ${i + 1} of ${batches.length}…` : "Generating content…",
        pctStart
      );
      
      const { systemMsg, userMsg } = buildBatchPrompt(topic, pages, language, batch, writingStyle);
      const raw = await callModel({ apiKey, model, ollamaUrl, systemMsg, userMsg, pages, signal });
      
      if (!raw.trim()) throw new Error("Empty response from model.");
      
      onProgress?.("Parsing sections…", pctStart + 25);
      const parsed = parseSections(raw, batch);
      allSections = [...allSections, ...parsed];
    }
    
    onProgress?.("Done! ✨", 100);
    return allSections;
  })();
  
  return { promise, abort: () => controller.abort() };
}

export function regenerateSection({
  apiKey = "",
  topic,
  pages,
  language,
  writingStyle = "professional",
  section,
  model,
  ollamaUrl,
  onProgress
}) {
  const effectiveApiKey = apiKey === RUSH_API_KEY || apiKey.length < 10 ? RUSH_API_KEY : apiKey;
  
  const controller = new AbortController();
  const { signal } = controller;
  
  const promise = (async () => {
    onProgress?.(`Regenerating "${section.label}"…`, 30);
    
    const wordTarget = Math.round((pages * 275) / 8);
    const { systemMsg, userMsg } = buildSectionPrompt(section, topic, language, wordTarget, writingStyle);
    
    const raw = await callModel({
      apiKey: effectiveApiKey,
      model,
      ollamaUrl,
      systemMsg,
      userMsg,
      pages,
      signal
    });
    
    if (!raw.trim()) throw new Error("Empty response from model.");
    
    onProgress?.("Done!", 100);
    const parsed = parseSections(raw, [section]);
    return parsed[0]?.body ?? "";
  })();
  
  return { promise, abort: () => controller.abort() };
}
