import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const platformPalette = {
  instagram: 'palette-instagram',
  reels: 'palette-reels',
  youtube: 'palette-youtube',
  facebook: 'palette-facebook',
  linkedin: 'palette-linkedin',
  tiktok: 'palette-tiktok',
  email: 'palette-email',
  'brand brief': 'palette-brief'
};

const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-icon">AI</div>
    <h3>Your AI ad will appear here</h3>
    <p>
      Complete the brief and hit <span className="inline-code">Generate ad</span> to see copy
      optimised for your channel.
    </p>
  </div>
);

const VariantList = ({ variants }) => {
  if (!variants?.length) {
    return null;
  }

  return (
    <div className="variant-list">
      <h4>Alternatives & snippets</h4>
      <ul>
        {variants.map((variant, index) => (
          <li key={index}>{variant}</li>
        ))}
      </ul>
    </div>
  );
};

const PromptCard = ({ prompt, title = 'Prompt sent to your AI', badge = 'Editable' }) => {
  if (!prompt) {
    return null;
  }

  return (
    <div className="prompt-card">
      <div className="prompt-header">
        <h4>{title}</h4>
        {badge ? <span className="prompt-badge">{badge}</span> : null}
      </div>
      <pre>{prompt}</pre>
    </div>
  );
};

const AdPreview = ({ ad, onCopy, copied }) => (
  <section className="panel preview-panel">
    <header className="panel-header">
      <div>
        <h2>Preview & prompt</h2>
        <p>Review, tweak, and copy your AI generated ad content.</p>
      </div>
      {ad ? (
        <button className="button ghost" type="button" onClick={() => onCopy(ad)}>
          {copied ? 'Copied!' : 'Copy ad'}
        </button>
      ) : null}
    </header>

    <div className="panel-body panel-body-scroll">
      <AnimatePresence mode="wait">
        {ad ? (
          <motion.article
            key={ad.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={clsx('ad-card', platformPalette[ad.platform] || 'palette-brief')}
          >
            <span className="platform-tag">{ad.platformLabel || ad.platform}</span>
            {ad.aspectRatio ? (
              <span className="aspect-tag">Aspect ratio: {ad.aspectRatio}</span>
            ) : null}
            <h3>{ad.headline}</h3>
            {ad.imageSrc ? (
              <div className="image-preview">
                <img
                  src={ad.imageSrc}
                  alt={ad.imageAlt || ad.imageFileName || `${ad.platformLabel || 'Ad'} preview`}
                />
                {(ad.imageFileName || ad.imageExternalUrl) && (
                  <div className="image-meta">
                    {ad.imageFileName ? <span>Asset: {ad.imageFileName}</span> : null}
                    {ad.imageExternalUrl ? (
                      <a href={ad.imageExternalUrl} target="_blank" rel="noopener noreferrer">
                        Open full-size
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            ) : ad.imageError ? (
              <div className="image-warning">
                <strong>
                  {ad.imageError === 'cors-blocked'
                    ? 'Image blocked by cross-origin policy'
                    : ad.imageError === 'webhook-timeout'
                    ? 'Webhook timed out before delivering an image'
                    : 'Image asset unavailable'}
                </strong>
                <p>
                  {ad.imageError === 'cors-blocked'
                    ? 'The remote server is preventing this page from displaying the generated image.'
                    : ad.imageError === 'webhook-timeout'
                    ? 'The webhook took too long to respond. Try generating again in a moment.'
                    : 'The webhook did not include a previewable image for this request.'}
                  {ad.imageExternalUrl ? (
                    <>
                      {' '}
                      <a href={ad.imageExternalUrl} target="_blank" rel="noopener noreferrer">
                        Open image in a new tab
                      </a>
                      .
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}
            <p className="ad-body">{ad.body}</p>
            <button type="button" className="cta-button">
              {ad.callToAction}
            </button>

            <VariantList variants={ad.variants} />
          </motion.article>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <EmptyState />
          </motion.div>
        )}
      </AnimatePresence>

      {ad?.imagePrompt ? (
        <PromptCard
          prompt={ad.imagePrompt}
          title="Prompt returned from webhook"
          badge={ad.imageFileName || 'Webhook'}
        />
      ) : null}
    </div>
  </section>
);

export default AdPreview;
