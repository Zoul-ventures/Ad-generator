import React, { useMemo, useState } from 'react';
import AdForm from './components/AdForm.jsx';
import AdPreview from './components/AdPreview.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import PromptTips from './components/PromptTips.jsx';
import { generateAdCopy, getPromptTemplate } from './utils/generateAd.js';

const defaultForm = {
  productName: '',
  productDescription: '',
  targetAudience: '',
  tone: 'friendly',
  platform: 'facebook',
  callToAction: '',
  primaryGoal: '',
  keywords: ''
};

const App = () => {
  const [form, setForm] = useState(defaultForm);
  const [currentAd, setCurrentAd] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptTemplate = useMemo(() => getPromptTemplate(form), [form]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setCopied(false);

    window.setTimeout(() => {
      const newAd = generateAdCopy(form);
      setCurrentAd(newAd);
      setHistory((prev) => [newAd, ...prev].slice(0, 10));
      setIsGenerating(false);
    }, 400);
  };

  const handleHistorySelect = (adId) => {
    const selected = history.find((item) => item.id === adId);
    if (selected) {
      setCurrentAd(selected);
      setCopied(false);
    }
  };

  const handleCopy = async (ad) => {
    const content = `${ad.headline}\n\n${ad.body}\n\n${ad.callToAction}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy ad to clipboard.', error);
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-logo">AdForge</span>
          <span className="brand-badge">AI powered</span>
        </div>
        <nav className="app-nav">
          <a href="#brief">Brief</a>
          <a href="#preview">Preview</a>
          <a href="#history">History</a>
        </nav>
        <div className="header-actions">
          <button
            className="button primary"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate ad'}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Create persuasive ads in minutes with AI</h1>
          <p>
            Collect your campaign inputs, send them to any AI model, and instantly preview
            platform-ready copy tailored to your brand voice.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <span className="stat-value">3x</span>
            <span className="stat-label">Faster iterations</span>
          </div>
          <div>
            <span className="stat-value">10</span>
            <span className="stat-label">Recent ads tracked</span>
          </div>
          <div>
            <span className="stat-value">Unlimited</span>
            <span className="stat-label">Prompt flexibility</span>
          </div>
        </div>
      </section>

      <main className="workspace">
        <div className="workspace-main">
          <div id="brief">
            <AdForm
              form={form}
              onChange={setForm}
              onGenerate={handleGenerate}
              onReset={handleReset}
              isGenerating={isGenerating}
            />
          </div>
          <PromptTips form={form} />
        </div>

        <div className="workspace-side">
          <div id="preview">
            <AdPreview
              ad={currentAd}
              prompt={promptTemplate}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>
          <div id="history">
            <HistoryPanel
              history={history}
              onSelect={handleHistorySelect}
              activeId={currentAd?.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
