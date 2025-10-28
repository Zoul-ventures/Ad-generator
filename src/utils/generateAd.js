const platformPresets = {
  instagram: {
    label: 'Instagram',
    aspectRatio: '1080x1080',
    creativeNote: 'Square feed placements love bold focal points and layered typography.',
    paletteClass: 'palette-instagram'
  },
  reels: {
    label: 'Reels / Stories',
    aspectRatio: '1080x1920',
    creativeNote: 'Vertical storytelling works best with motion-first framing and captions.',
    paletteClass: 'palette-reels'
  },
  youtube: {
    label: 'YouTube',
    aspectRatio: '1920x1080 (16:9)',
    creativeNote: 'Wide cinematic compositions should highlight a strong central subject.',
    paletteClass: 'palette-youtube'
  },
  facebook: {
    label: 'Facebook',
    aspectRatio: '1200x630',
    creativeNote: 'Feed visuals benefit from conversational copy and clear focal elements.',
    paletteClass: 'palette-facebook'
  },
  linkedin: {
    label: 'LinkedIn',
    aspectRatio: '1200x627',
    creativeNote: 'Lead with credibility and clean layouts to resonate with professionals.',
    paletteClass: 'palette-linkedin'
  }
};

const platformFallback = platformPresets.instagram;

export const platformOptions = Object.entries(platformPresets).map(([value, config]) => ({
  value,
  label: config.label,
  aspectRatio: config.aspectRatio
}));

export const getPlatformDetails = (platform) =>
  platformPresets[platform] ?? platformFallback;

export const getAspectRatio = (platform) => getPlatformDetails(platform).aspectRatio;

const pickRandom = (list, fallback) =>
  list[Math.floor(Math.random() * list.length)] || fallback;

const toTitleCase = (text) =>
  text
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const uniqueId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const parseKeywords = (keywords) =>
  keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

const isHexColor = (value) => /^#[0-9A-F]{6}$/i.test(value);

const describePalette = (colors) => {
  const valid = (colors || [])
    .map((color) => (typeof color === 'string' ? color.trim().toUpperCase() : ''))
    .filter(isHexColor);

  if (!valid.length) {
    return null;
  }

  if (valid.length === 1) {
    return `${valid[0]} as the hero hue`;
  }

  const [primary, ...rest] = valid;
  if (rest.length === 1) {
    return `${primary} anchored by ${rest[0]}`;
  }

  return `${primary} anchored by ${rest.slice(0, -1).join(', ')} and ${rest[rest.length - 1]}`;
};

const ensureSentence = (text) => {
  if (!text) {
    return '';
  }
  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
};

const ctaLibrary = [
  {
    matches: ['launch', 'introduce', 'debut', 'new', 'drop'],
    options: ['Explore the launch', "See what's new", 'Preview the drop']
  },
  {
    matches: ['shop', 'buy', 'purchase', 'retail', 'store', 'collection'],
    options: ['Shop the collection', 'Add to cart', 'Discover the lineup']
  },
  {
    matches: ['sign', 'register', 'join', 'subscribe', 'waitlist'],
    options: ['Join the waitlist', 'Sign up today', 'Subscribe for updates']
  },
  {
    matches: ['learn', 'guide', 'education', 'webinar', 'class'],
    options: ['Reserve your spot', 'Get the guide', 'Save your seat']
  },
  {
    matches: ['download', 'app', 'tool', 'platform'],
    options: ['Download now', 'Try the platform', 'Start your free demo']
  }
];

const defaultCtas = ['Discover more', 'Learn more', 'See the story', 'Explore now'];

const deriveCallToAction = (goal) => {
  if (!goal) {
    return pickRandom(defaultCtas, 'Discover more');
  }

  const normalized = goal.toLowerCase();
  for (const entry of ctaLibrary) {
    if (entry.matches.some((keyword) => normalized.includes(keyword))) {
      return pickRandom(entry.options, defaultCtas[0]);
    }
  }

  return pickRandom(defaultCtas, 'Discover more');
};

export const generateAdCopy = (form) => {
  const platformKey = form.socialPlatform || 'instagram';
  const platformInfo = getPlatformDetails(platformKey);

  const {
    brandName,
    brandColors = [],
    font,
    goal,
    headline,
    brandContext,
    brandFeel,
    brandMood,
    visualStyle,
    keywords
  } = form;

  const brandLabel = brandName?.trim() ? brandName.trim() : 'Your brand';
  const paletteDescription = describePalette(brandColors);
  const keywordList = parseKeywords(keywords || '');
  const resolvedHeadline = headline?.trim()
    ? headline.trim()
    : goal
    ? `${toTitleCase(goal)} with ${brandLabel}`
    : `Make ${brandLabel} impossible to ignore`;

  const intro = brandContext?.trim()
    ? ensureSentence(brandContext)
    : ensureSentence(
        goal
          ? `${brandLabel} is shaping this campaign to ${goal.trim()}`
          : `${brandLabel} is building momentum for an upcoming moment`
      );

  const platformLine = ensureSentence(platformInfo.creativeNote);
  const paletteLine = paletteDescription
    ? ensureSentence(`Palette cues: ${paletteDescription}`)
    : '';
  const feelLine = ensureSentence(
    `Brand feel: ${brandFeel?.trim() || 'Refined and confident with premium touches'}`
  );
  const moodLine = ensureSentence(
    `Brand mood: ${brandMood?.trim() || 'Optimistic, energetic, and modern'}`
  );
  const visualLine = ensureSentence(
    `Visual style: ${visualStyle?.trim() || 'High-contrast imagery with tactile details'}`
  );
  const fontLine = font?.trim() ? ensureSentence(`Typography: ${font.trim()}`) : '';
  const keywordsLine = keywordList.length
    ? ensureSentence(`Keywords to weave in: ${keywordList.join(', ')}`)
    : '';
  const aspectLine = ensureSentence(`Recommended aspect ratio: ${platformInfo.aspectRatio}`);

  const bodySegments = [
    intro,
    platformLine,
    paletteLine,
    feelLine,
    moodLine,
    visualLine,
    fontLine,
    keywordsLine,
    aspectLine
  ].filter(Boolean);

  const body = bodySegments.join(' ');
  const callToAction = deriveCallToAction(goal);

  const variants = [
    `${platformInfo.label} focus: ${platformInfo.creativeNote}`,
    `Brand feel -> ${brandFeel?.trim() || 'Refined & confident'}`,
    `Moodboard -> ${brandMood?.trim() || 'Optimistic / Energetic / Modern'}`,
    keywordList.length
      ? `Keywords in rotation: ${keywordList.join(' | ')}`
      : 'Keywords in rotation: premium | confident | modern'
  ];

  return {
    id: uniqueId(),
    createdAt: new Date().toISOString(),
    platform: platformKey,
    platformLabel: platformInfo.label,
    aspectRatio: platformInfo.aspectRatio,
    headline: resolvedHeadline,
    body,
    callToAction,
    variants
  };
};

export const getPromptTemplate = (form) => {
  const colors = (form.brandColors || []).filter(isHexColor);
  const keywordList = parseKeywords(form.keywords || '');
  const platformInfo = getPlatformDetails(form.socialPlatform || 'instagram');

  const lines = [
    `Create polished brand-forward ad copy for ${form.brandName || 'a brand'}.`,
    form.brandContext ? `Brand context: ${form.brandContext}` : '',
    form.goal ? `Campaign goal: ${form.goal}` : '',
    form.brandFeel ? `Brand feel: ${form.brandFeel}` : '',
    form.brandMood ? `Brand mood: ${form.brandMood}` : '',
    form.headline ? `Headline direction: ${form.headline}` : '',
    colors.length ? `Brand colors (hex): ${colors.join(', ')}` : '',
    form.font ? `Typography preference: ${form.font}` : '',
    form.visualStyle ? `Visual style guidance: ${form.visualStyle}` : '',
    keywordList.length ? `Keywords to incorporate: ${keywordList.join(', ')}` : '',
    `Primary platform: ${platformInfo.label}`,
    `Recommended aspect ratio: ${platformInfo.aspectRatio}`,
    form.logo?.name ? `Logo asset available: ${form.logo.name}` : '',
    'Return a compelling headline, a two-sentence body, and a CTA that matches the goal.'
  ];

  return lines.filter(Boolean).join('\n');
};
