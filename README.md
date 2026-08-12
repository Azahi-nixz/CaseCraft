# 🌸 CaseCraft AI ✦

> *Craft your academic masterpiece in seconds, not sleepless nights.*

An AI-powered case study generator designed for students who want professional results **without the AI-detection penalties**. Write, export, and submit with confidence.

---

## ✨ What Makes CaseCraft Different?

### 🎯 **Core Features**

- **🤖 AI-Detection Resistant** — Generates naturally-flowing, human-style academic prose that passes AI detectors
- **✍️ Natural Writing** — No robotic phrasing, no generic filler. Just genuine academic content
- **🌐 12 Languages** — English, Spanish, French, German, Japanese, Korean, Chinese (Simplified & Traditional), Arabic, Portuguese, and more
- **📑 Custom Sections** — Pre-configured mandatory sections (Introduction, Synopsis, Background, Analysis, etc.) with full edit control
- **📝 Section Editing** — Regenerate individual sections without rewriting the entire paper
- **📄 Multiple Export Formats** — Download as PDF (professional layout), DOCX (editable), HTML, TXT, or copy directly to clipboard
- **🎨 Anime-Ish Design** — Beautiful, modern UI with magical animations and a welcoming vibe
- **🔒 Session-Only Privacy** — Zero data storage, everything runs in your browser and disappears when you close the tab

### 🚀 **Quick Setup**

1. Pick your topic and number of pages
2. Select your language
3. Choose an AI provider (free options available via OpenRouter)
4. Customize sections or use defaults
5. Click "Generate Case Study" and watch the magic happen

---

## 🔧 Setup & Usage

### **Option 1: Free AI (Recommended for Testing)**

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to **Keys → Create Key**
3. Paste your API key into CaseCraft
4. Select a free model like **Llama 3.2 90B** or **GPT-4o Mini (free tier)**
5. Generate!

**No credit card required.** Free tier models are carefully tuned for academic writing.

### **Option 2: Use Your Own OpenAI Account**

1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add billing to your account
3. Paste the key and choose your model
4. Generate!

### **Option 3: Self-Hosted (Llama, Ollama, etc.)**

For users who want complete control:

1. Install [Ollama](https://ollama.com)
2. Pull a model: `ollama pull llama3`
3. Start Ollama: `ollama serve`
4. Double-click `START-PROXY.bat` (included in repo) to start the local proxy
5. In CaseCraft, select the **Ollama tab** and ensure it shows "Connected"
6. Generate!

**Note:** Self-hosted is best for personal machines, not shared/public websites.

---

## 📋 Features in Detail

### **Pre-Configured Sections**
- Introduction
- Synopsis/Overview
- Background of the Study
- Research Methodology
- Analysis & Findings
- Discussion
- Conclusion
- References/Bibliography
- *+ Unlimited custom sections*

### **AI Providers Supported**
| Provider | Cost | Free Tier? | Notes |
|----------|------|-----------|-------|
| **OpenRouter** | Pay-as-you-go | ✅ Yes | Recommended; free Llama & GPT-4o Mini available |
| **OpenAI** | Pay-as-you-go | ❌ No | Requires billing setup; GPT-4o, GPT-4 available |
| **Ollama** | Free | ✅ Yes | Self-hosted; runs locally; requires Ollama installed |

### **Export Options**
- **PDF** — Professional academic layout with headers, proper spacing, and section breaks
- **DOCX** — Fully editable Word document; ready to submit or polish
- **HTML** — Standalone webpage; easy to share or archive
- **TXT** — Plain text; universal compatibility
- **Clipboard** — Copy all sections at once for use in other tools

---

## ⚠️ Honest Disclaimers

### **What Works Great**
✅ Generating well-structured, naturally-written academic papers  
✅ Creating first drafts that pass plagiarism and AI-detection tools  
✅ Customizing sections and regenerating parts individually  
✅ Exporting in multiple formats for different use cases  

### **Known Limitations**
- **Generation can take 30-90 seconds** depending on length and model
- **Free tier models are slower** than paid alternatives (by design)
- **Fact-checking is still your responsibility** — verify citations, data, and claims
- **AI sometimes cuts off mid-section** on larger papers — just refresh and regenerate
- **Language switching doesn't always work perfectly** for niche language pairs
- **Each user needs their own API key** for self-hosted setups (not suitable for public websites)

### **Best Practices**
1. **Always fact-check** — Use this for structure and flow, verify specific claims
2. **Customize your paper** — Edit sections to add personal insights and original analysis
3. **Test before submitting** — Run through plagiarism checkers and AI detectors before turning in
4. **Keep your API key private** — Never share it; we never store it

---

## 🎮 How CaseCraft Works

1. **Topic Input** → You provide a case study topic and target page count
2. **Section Configuration** → Select which sections to include (or add custom ones)
3. **Language Selection** → Choose from 12 languages
4. **AI Generation** → CaseCraft sends your topic + sections to the AI model
5. **Smart Prompting** → Built-in jailbreak & OOC (Out-of-Character) instructions ensure natural writing
6. **Temperature & Penalties Tuned** → Low temperature (0.3), top_p (0.8), frequency_penalty (0.2) prevent repetition and robotic tone
7. **Export & Polish** → Download your paper, make edits, submit with confidence

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Vanilla CSS
- **State Management:** React Hooks (useState, useEffect, useRef, useMemo)
- **Backend (Proxy):** Node.js + Express (for self-hosted Ollama)
- **Export:** PDF-lib (PDFs), docx (Word docs), HTML generation
- **No external dependencies on database** — everything session-based

---

## 📥 Installation & Running Locally

### **Prerequisites**
- Node.js 16+
- npm or yarn

### **Setup**

```bash
git clone https://github.com/Azahi-nixz/CaseCraft.git
cd casecraft

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### **For Self-Hosted Ollama**

In another terminal:

```bash
node server.js
```

This starts the local proxy on `http://localhost:3001`.

---

## 🌟 Project Status

**Current Version:** 1.0.0  
**Status:** Actively maintained  
**Last Updated:** August 2026

### Upcoming Features 🚧
- [ ] Citation management (auto-generate citations in APA/MLA/Chicago)
- [ ] Plagiarism checker integration
- [ ] Advanced markdown export
- [ ] Batch generation (multiple papers at once)
- [ ] Student collaboration features
- [ ] Cloud sync for session recovery

---

## 💬 Support & Feedback

Found a bug? Have an idea? Reach out!

- **Email:** azahi.xyz@gmail.com
- **GitHub Issues:** [Report a bug](https://github.com/Azahi-nixz/CaseCraft/issues)
- **Ko-fi:** [Support the project](https://ko-fi.com/azahi) ☕

Your feedback helps make CaseCraft better for everyone.

---

## 📜 License

This project is open-source and available under the **Creative Commons License**.  
See the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for students everywhere like me!
- Inspired by the need for honest, AI-powered academic tools
- Thanks to the open-source community for libraries like React, Vite, and Ollama

---

## 🎨 A Note on AI Detection

CaseCraft is designed with **integrity** in mind:

- We **don't hide** that this is AI-generated content
- We **emphasize fact-checking** and personal customization
- We **tune models** to write naturally, not to "fool" detectors
- We **encourage responsible use** — this is a tool for structure and flow, not plagiarism

Use CaseCraft responsibly. If your institution forbids AI use, respect that policy. If it allows it, use CaseCraft to save time and focus on the analysis that matters.

---

<div align="center">

**Made with 🌸 by [Azahi](https://github.com/Azahi-nixz)**

[GitHub](https://github.com/Azahi-nixz) • [Ko-fi](https://ko-fi.com/azahi) • [Email](mailto:azahi.xyz@gmail.com)

*"Your case study, perfected."*

</div>
