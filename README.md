# 🌸 CaseCraft AI

**AI-Powered Case Study Generator** with anime-inspired UI, human-style writing, and advanced jailbreak techniques.

## ✨ Key Features

### 🎯 **AI Generation (Anti-Detection)**
- **OOC Jailbreak Mode**: Uses "out-of-character" framing to prevent AI safety filters from interrupting mid-generation
- **Human-Style Prose**: Advanced prompt engineering with sentence rhythm variation, hedging language, rhetorical questions
- **AI-Detection Resistant**: Avoids common LLM patterns like "Additionally", "Furthermore", symmetrical structures
- **Multi-Language Support**: Generate case studies in 12+ languages (English, Spanish, Filipino, Japanese, etc.)

### 📑 **Structure & Customization**
- **Pre-loaded Academic Sections**: Introduction, Synopsis, Background, Problem Statement, Objectives, Methodology, etc.
- **Drag-to-Reorder**: Rearrange sections by dragging
- **Custom Sections**: Add your own section types beyond the defaults
- **Required/Optional Flags**: Core sections marked as required, others optional
- **Smart Chunking**: Large documents (8+ pages) split into multiple API calls to avoid truncation

### 🔧 **Technical Excellence**
- **Memory Leak Prevention**: All timeouts and fetch requests properly cancelled on unmount
- **AbortController**: In-flight AI requests can be cancelled instantly when user navigates away
- **Error Boundaries**: Full crash recovery with anime-style error screens
- **Performance Optimized**: Background animations pause when tab hidden, memoized computations
- **Session-Only Storage**: Everything stored in `sessionStorage` — no server persistence

### 🎨 **Anime-Style UI**
- **Glassmorphism Cards**: Frosted glass panels with backdrop blur
- **Animated Background**: Twinkling stars, floating particles, gradient blobs
- **Custom Typography**: Orbitron headers + Nunito body text
- **Purple/Pink Gradient Theme**: Cohesive anime-inspired color palette
- **Responsive Design**: Works on desktop, tablet, and mobile

### 🚀 **Generation Features**
- **Per-Section Regenerate**: Regenerate individual sections without losing the rest
- **Real-Time Progress**: Multi-step progress with status updates
- **Batch Processing**: Automatic chunking for large documents
- **Export Options**: Download as `.txt` or `.html` with proper formatting
- **Edit Mode**: In-browser editing with live preview toggle
- **Copy to Clipboard**: One-click copy of entire document

### 🔒 **Privacy & Security**
- **No Login Required**: Zero account setup
- **API Key Never Stored**: Keys held in memory only, cleared on tab close
- **Session Warning**: Clear notifications that data disappears on close
- **beforeunload Protection**: Browser warning when user has unsaved work

## 🛠 Tech Stack

- **React 19** + **Vite 8** (bleeding-edge)
- **Vanilla CSS** (no framework dependencies)
- **OpenAI** + **OpenRouter** API support
- **Modern Web APIs**: Clipboard, File Downloads, Visibility API

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd casecraft
   npm install
   ```

2. **Development**
   ```bash
   npm run dev
   # Opens http://localhost:5174
   ```

3. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

## 🔑 API Keys

Get a free API key from:
- **OpenRouter**: [openrouter.ai/keys](https://openrouter.ai/keys) — Access to multiple models including free tiers
- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) — Direct GPT access

The app auto-detects which API you're using based on your key prefix (`sk-or-*` = OpenRouter, `sk-*` = OpenAI).

## 📖 How It Works

### Jailbreak/OOC Method
The AI service wraps all prompts in a "roleplay" frame where the AI becomes "Dr. Marisol Vega", a fictional human researcher. This prevents:
- Mid-generation safety shutdowns
- Switching to bullet points without warning
- Generic "I'm an AI" disclaimers
- Content policy interruptions for academic topics

### Human-Style Generation
The prompt includes 12 specific rules that force natural writing patterns:
- Mixed sentence lengths (5-word and 30-word sentences)
- Varied paragraph rhythms
- Natural hedging ("arguably", "it appears")
- Rhetorical questions for engagement
- Forbidden LLM opener words
- Active/passive voice balance

### Performance Optimizations
- **Animation Pausing**: Background animations pause when tab hidden (saves CPU/GPU)
- **Memoized Computations**: Word counts, star positions calculated once
- **Stable Keys**: React list items use content-derived keys, not array indices
- **AbortController**: All fetch requests cancellable
- **Timer Cleanup**: All `setTimeout` calls tracked and cleared

## 🎯 Use Cases

- **Students**: Generate academic case studies for assignments
- **Researchers**: Create structured research documentation
- **Business**: Develop business case studies and reports
- **Writers**: Generate content frameworks in multiple languages
- **Academics**: Produce publication-ready case study drafts

## 🔧 Customization

### Adding New Languages
Edit `src/constants/subtopics.js`:
```javascript
export const LANGUAGES = [
  // Add new language
  { code: "Thai", label: "🇹🇭 Thai" },
  // ...
];
```

### Custom Section Types
The app comes with 13 pre-configured academic sections, but you can:
1. Use the UI to add custom sections
2. Edit the defaults in `src/constants/subtopics.js`
3. Modify the `DEFAULT_SUBTOPICS` array

### Styling Changes
All styles in `src/index.css` and `src/App.css` use CSS custom properties:
```css
:root {
  --pink: #ff6eb4;        /* Primary accent */
  --purple: #9b59f7;      /* Secondary accent */
  --bg: #0d0d1a;          /* Background */
  /* ... */
}
```

## 🐛 Error Handling

- **Network Failures**: Graceful degradation with user-friendly messages
- **API Errors**: Specific error messages from OpenAI/OpenRouter
- **React Crashes**: Error boundary with recovery options
- **Generation Cancellation**: Clean abort without memory leaks
- **Invalid Inputs**: Client-side validation before API calls

## 📱 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Required APIs**: Fetch, Clipboard, Web APIs
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Mobile Responsive**: Touch-friendly on phones and tablets

---

**Live Demo**: Running on `http://localhost:5174` 🚀

Built with ✨ and a lot of 🌸 anime vibes.