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
  'https://n8n.srv969821.hstgr.cloud/webhook/e9714c18-2d7f-4ea7-836c-ec25f6f49dcc';
const WEBHOOK_TIMEOUT_MS = 120000;

const driveHostPattern = /(?:^|\.)drive\.google\.com$/i;
const googleUserContentPattern = /(?:^|\.)googleusercontent\.com$/i;

const normalizeRemoteImageUrl = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    const url = new URL(value);

    if (driveHostPattern.test(url.hostname)) {
      const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)\//);
      const idFromPath = fileMatch ? fileMatch[1] : null;
      const idFromQuery = url.searchParams.get('id');
      const fileId = idFromPath || idFromQuery;

      if (fileId) {
        const sizeParam = url.searchParams.get('sz') || 'w2048';
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=${sizeParam}`;
      }
    }

    if (googleUserContentPattern.test(url.hostname)) {
      const sizeMatch = url.pathname.match(/=s(\d+)(?:-c)?$/);
      if (sizeMatch) {
        return value.replace(/=s\d+(?:-c)?$/, '=s2048');
      }
    }

    return value;
  } catch {
    return value;
  }
};

const shouldBypassFetch = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const url = new URL(value);
    return driveHostPattern.test(url.hostname) || googleUserContentPattern.test(url.hostname);
  } catch {
    return false;
  }
};

const resolveImageSource = (response, seen = new WeakSet()) => {
  if (!response) {
    return null;
  }

  if (typeof response === 'string') {
    const value = response.trim();
    if (!value) {
      return null;
    }
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        return resolveImageSource(JSON.parse(value), seen);
      } catch {
        // Continue with raw string below.
      }
    }
    return value;
  }

  if (Array.isArray(response)) {
    for (const item of response) {
      const resolved = resolveImageSource(item, seen);
      if (resolved) {
        return resolved;
      }
    }
    return null;
  }

  if (typeof response !== 'object') {
    return null;
  }

  if (seen.has(response)) {
    return null;
  }
  seen.add(response);

  const knownImageKeys = [
    'imageSrc',
    'imageSource',
    'image',
    'imageUrl',
    'image_url',
    'webContentLink',
    'webContentURL',
    'webContentUrl',
    'mediaLink',
    'downloadUrl',
    'download_url',
    'thumbnailLink',
    'thumbnailUrl',
    'thumbnail',
    'webViewLink',
    'webViewURL',
    'webViewUrl',
    'webView',
    'url',
    'fileUrl',
    'file_url'
  ];

  const nestedKeys = ['body', 'data', 'result', 'results', 'payload', 'resource', 'resources'];

  for (const key of knownImageKeys) {
    if (response[key]) {
      return resolveImageSource(response[key], seen);
    }
  }

  for (const key of nestedKeys) {
    if (!response[key]) {
      continue;
    }

    const resolved = resolveImageSource(response[key], seen);
    if (resolved) {
      return resolved;
    }
  }

  for (const value of Object.values(response)) {
    const resolved = resolveImageSource(value, seen);
    if (resolved) {
      return resolved;
    }
  }

  if (response.fileName) {
    try {
      const base = new URL(WEBHOOK_URL);
      return `${base.origin}/${response.fileName}`;
    } catch {
      return null;
    }
  }

  return null;
};

const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

const fetchAsDataUrl = async (url) => {
  const response = await fetch(url, { mode: 'cors' });
  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}`);
  }

  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const prepareImageAsset = async (response) => {
  const resolved = resolveImageSource(response);
  const trimmed = typeof resolved === 'string' ? resolved.trim() : resolved;
  const normalized =
    typeof trimmed === 'string' && trimmed ? normalizeRemoteImageUrl(trimmed) : trimmed;

  if (!normalized) {
    return { src: null, externalUrl: null, error: null };
  }

  if (isDataUrl(normalized)) {
    return { src: normalized, externalUrl: null, error: null };
  }

  const base64Like = typeof normalized === 'string' && /^[A-Za-z0-9+/=\s]+$/.test(normalized);
  if (base64Like && normalized.replace(/\s/g, '').length > 100) {
    const compact = normalized.replace(/\s/g, '');
    return {
      src: `data:image/png;base64,${compact}`,
      externalUrl: null,
      error: null
    };
  }

  if (shouldBypassFetch(normalized)) {
    return {
      src: normalized,
      externalUrl: typeof trimmed === 'string' ? trimmed : normalized,
      error: null
    };
  }

  try {
    const dataUrl = await fetchAsDataUrl(normalized);
    if (!dataUrl) {
      throw new Error('Empty data URL returned while processing remote image.');
    }
    return {
      src: dataUrl,
      externalUrl: typeof trimmed === 'string' ? trimmed : normalized,
      error: null
    };
  } catch (error) {
    console.warn('Unable to load remote image asset.', error);
    return {
      src: normalized,
      externalUrl: typeof trimmed === 'string' ? trimmed : normalized,
      error: null
    };
  }
};

const sendWebhookPayload = async (payload) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

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

    const contentType = response.headers?.get('content-type') || '';
    let data = null;
    let rawText = null;

    try {
      rawText = await response.clone().text();
    } catch (readError) {
      console.warn('Could not read webhook response body.', readError);
    }

    if (rawText) {
      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(rawText);
        } catch (jsonError) {
          console.warn('Failed to parse webhook JSON response.', jsonError);
          data = rawText;
        }
      } else if (contentType.startsWith('text/')) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = rawText;
        }
      }
    }

    if (!response.ok) {
      const error = new Error(`Webhook responded with status ${response.status}`);
      error.response = data;
      throw error;
    }

    return { ok: true, data };
  } catch (error) {
    window.clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error(
        `Webhook did not respond within ${WEBHOOK_TIMEOUT_MS / 1000} seconds.`
      );
      timeoutError.code = 'webhook-timeout';
      console.error(timeoutError.message);
      return { ok: false, data: null, error: timeoutError };
    }
    console.error('Webhook request failed.', error);
    return { ok: false, data: null, error };
  }
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

    let webhookResponse = null;
    let webhookDelivered = false;
    let imageAsset = { src: null, externalUrl: null, error: null };

    try {
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

      const result = await sendWebhookPayload(webhookPayload);
      console.info('Webhook invocation result:', result);
      webhookDelivered = result.ok;
      webhookResponse = result.data;

      if (!webhookDelivered) {
        console.warn('Webhook payload could not be delivered.', result.error);
      }

      if (webhookDelivered) {
        imageAsset = await prepareImageAsset(webhookResponse);
      } else if (result.error?.code === 'webhook-timeout') {
        imageAsset = { src: null, externalUrl: null, error: 'webhook-timeout' };
      } else if (webhookResponse) {
        imageAsset = await prepareImageAsset(webhookResponse);
      }
    } catch (error) {
      console.error('Failed to generate ad preview.', error);
      if (!imageAsset.error) {
        imageAsset = { src: null, externalUrl: null, error: 'webhook-error' };
      }
    }

    const baseAd = generateAdCopy(form);

    const imagePrompt =
      (webhookResponse && webhookResponse.body && webhookResponse.body.prompt) ||
      webhookResponse?.prompt ||
      null;
    const imageFileName =
      webhookResponse?.fileName ||
      webhookResponse?.body?.fileName ||
      webhookResponse?.body?.file_name ||
      null;

    const enrichedAd = {
      ...baseAd,
      imageSrc: imageAsset.src,
      imageExternalUrl: imageAsset.externalUrl,
      imagePrompt,
      imageFileName,
      imageAlt: form.brandName
        ? `Generated creative for ${form.brandName}`
        : 'Generated creative preview',
      imageError: imageAsset.error,
      webhookDelivered,
      webhookResponse: webhookResponse ?? null
    };

    setCurrentAd(enrichedAd);
    setHistory((prev) => [enrichedAd, ...prev].slice(0, 10));
    setIsGenerating(false);
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
