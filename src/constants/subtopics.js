export const DEFAULT_SUBTOPICS = [
  { id: "intro",        label: "Introduction",                   required: true  },
  { id: "synopsis",     label: "Synopsis / Executive Summary",   required: true  },
  { id: "background",   label: "Background of the Study",        required: true  },
  { id: "problem",      label: "Statement of the Problem",       required: true  },
  { id: "objectives",   label: "Objectives of the Study",        required: true  },
  { id: "scope",        label: "Scope and Limitations",          required: false },
  { id: "lit_review",   label: "Review of Related Literature",   required: false },
  { id: "methodology",  label: "Research Methodology",           required: true  },
  { id: "data",         label: "Data Presentation & Analysis",   required: true  },
  { id: "findings",     label: "Findings and Discussion",        required: true  },
  { id: "conclusion",   label: "Conclusion",                     required: true  },
  { id: "recommend",    label: "Recommendations",                required: false },
  { id: "references",   label: "References / Bibliography",      required: true  },
];

export const WRITING_STYLES = [
  { id: "professional", label: "📊 Professional", desc: "Formal academic tone, structured" },
  { id: "casual",       label: "💬 Casual", desc: "Relaxed, conversational approach" },
  { id: "reporting",    label: "📋 Reporting", desc: "Data-focused, objective findings" },
  { id: "narrative",    label: "📖 Narrative", desc: "Story-driven case analysis" },
];

export const LANGUAGES = [
  { code: "English",    label: "🇺🇸 English"    },
  { code: "Filipino",   label: "🇵🇭 Filipino"   },
  { code: "Spanish",    label: "🇪🇸 Spanish"    },
  { code: "French",     label: "🇫🇷 French"     },
  { code: "German",     label: "🇩🇪 German"     },
  { code: "Japanese",   label: "🇯🇵 Japanese"   },
  { code: "Chinese",    label: "🇨🇳 Chinese"    },
  { code: "Korean",     label: "🇰🇷 Korean"     },
  { code: "Arabic",     label: "🇸🇦 Arabic"     },
  { code: "Portuguese", label: "🇧🇷 Portuguese" },
  { code: "Italian",    label: "🇮🇹 Italian"    },
  { code: "Russian",    label: "🇷🇺 Russian"    },
];
