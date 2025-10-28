import React, { useMemo, useState } from 'react';
import AdForm from './components/AdForm.jsx';
import AdPreview from './components/AdPreview.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import PromptTips from './components/PromptTips.jsx';
import { generateAdCopy, getPromptTemplate, getPlatformDetails } from './utils/generateAd.js';

const defaultForm = {
  brandName: '',
  brandColors: ['#6C47FF'],
  font: '',
  socialPlatform: 'instagram',
  goal: '',
  headline: '',
  brandContext: '',
  brandFeel: '',
  brandMood: '',
  visualStyle: '',
  keywords: '',
  logo: null
};

const WEBHOOK_URL =
  'https://n8n.srv969821.hstgr.cloud/webhook-test/e9714c18-2d7f-4ea7-836c-ec25f6f49dcc';

const sendWebhookPayload = async (payload) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      mode: 'cors'
    });

    window.clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook responded with status ${response.status}`);
    }

    return true;
  } catch (primaryError) {
    window.clearTimeout(timeoutId);
    console.error('Primary webhook request failed.', primaryError);

    try {
      const encoded = new URLSearchParams();
      encoded.append('payload', JSON.stringify(payload));

      const fallbackResponse = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encoded.toString(),
        mode: 'cors'
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback webhook responded with status ${fallbackResponse.status}`);
      }

      return true;
    } catch (secondaryError) {
      console.error('Fallback webhook request failed.', secondaryError);

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload)
        });
        return true;
      } catch (tertiaryError) {
        console.error('No-cors webhook attempt failed.', tertiaryError);
      }

      if (navigator.sendBeacon) {
        try {
          const blob = new Blob([JSON.stringify(payload)], {
            type: 'application/json'
          });
          const beaconSent = navigator.sendBeacon(WEBHOOK_URL, blob);
          if (beaconSent) {
            return true;
          }
        } catch (beaconError) {
          console.error('Beacon webhook attempt failed.', beaconError);
        }
      }
    }
  }

  return false;
};

const App = () => {
  const [form, setForm] = useState(defaultForm);
  const [currentAd, setCurrentAd] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const promptTemplate = useMemo(() => getPromptTemplate(form), [form]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);

    const platformDetails = getPlatformDetails(form.socialPlatform);
    const webhookPayload = {
      brandName: form.brandName,
      brandColors: form.brandColors || [],
      font: form.font,
      socialPlatform: form.socialPlatform,
      socialPlatformLabel: platformDetails.label,
      goal: form.goal,
      headline: form.headline,
      brandContext: form.brandContext,
      brandFeel: form.brandFeel,
      brandMood: form.brandMood,
      visualStyle: form.visualStyle,
      keywords: form.keywords,
      aspectRatio: platformDetails.aspectRatio,
      logo: form.logo
        ? {
            name: form.logo.name,
            size: form.logo.size,
            type: form.logo.type,
            lastModified: form.logo.lastModified
          }
        : null,
      submittedAt: new Date().toISOString()
    };

    const webhookDelivered = await sendWebhookPayload(webhookPayload);

    if (!webhookDelivered) {
      console.warn('Webhook payload could not be delivered.');
    }

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
          <img
            className="brand-mark"
            src="/assets/contento vector morado.svg"
            alt="Contento logo"
          />
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
