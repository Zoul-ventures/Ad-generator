# Contento

Contento is a React single-page application for crafting high converting advertising copy with AI. The interface helps marketers collect structured campaign inputs, generates on-brand copy locally, and prepares a clean prompt to send to their preferred language model.

## Features

- Guided brief builder covering product description, target audience, tone, platform, and desired call-to-action.
- Instant mock AI generation with editable prompt preview and clipboard export.
- Variant snippets plus recent generation history for quick comparison.
- Prompt strategist side panel that suggests improvements while you type.
- Responsive, polished UI built with Vite + React 18 and Framer Motion animations.

## Getting Started

```bash
npm install
npm run dev
```

The Vite dev server opens at `http://localhost:5173/`. To create a production bundle run:

```bash
npm run build
npm run preview
```

> **Note:** The mock generator included in `src/utils/generateAd.js` stitches together sample copy so you can test the UI offline. Replace `generateAdCopy` with a real API call when integrating your AI provider.

## Project Structure

```
public/
  assets/                 # Logos, imagery, and static brand files
src/
  App.jsx                 # Layout + state orchestration
  main.jsx                # Vite entry point
  styles.css              # Global styling
  components/
    AdForm.jsx            # Brief builder form
    AdPreview.jsx         # Generated ad preview + prompt
    HistoryPanel.jsx      # Recent generations list
    PromptTips.jsx        # Prompt strategy suggestions
  utils/
    generateAd.js         # Mock AI generator + prompt helper
```

## Customisation Ideas

1. Replace the mock generator with fetch requests to OpenAI, Azure, or another LLM provider.
2. Persist `history` to localStorage or your backend so marketers can revisit ads.
3. Add brand voice presets and tone sliders to keep copy aligned with style guides.
4. Extend the preview card with platform specific character counters or image recommendations.

Enjoy building!
