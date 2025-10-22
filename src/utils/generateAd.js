const toneDescriptors = {
  friendly: ['friendly', 'approachable', 'helpful'],
  bold: ['bold', 'energetic', 'punchy'],
  luxury: ['luxurious', 'refined', 'exclusive'],
  playful: ['playful', 'witty', 'fun'],
  informative: ['informative', 'clear', 'insightful']
};

const platformAngles = {
  facebook: {
    hook: 'Join thousands already enjoying',
    callToAction: 'Shop Now'
  },
  instagram: {
    hook: 'Stop scrolling and discover',
    callToAction: 'Explore Today'
  },
  tiktok: {
    hook: 'Trending now',
    callToAction: 'Watch & Shop'
  },
  linkedin: {
    hook: 'Unlock your advantage with',
    callToAction: 'Learn More'
  },
  email: {
    hook: 'Exclusive offer inside:',
    callToAction: 'Claim Offer'
  }
};

const toneCallsToAction = {
  friendly: ['Let\'s Go', 'Start Your Journey', 'Join the Community'],
  bold: ['Get Yours Now', 'Take Charge Today', 'Dominate Your Goals'],
  luxury: ['Experience the Difference', 'Elevate Your Lifestyle', 'Indulge Now'],
  playful: ['Dive In', 'Let the Fun Begin', 'Try the Magic'],
  informative: ['Discover the Details', 'See How It Works', 'Learn the Facts']
};

const benefitOpeners = [
  'Here\'s why it matters:',
  'You\'ll love it because:',
  'In a nutshell:',
  'Top reasons customers choose us:',
  'Quick wins we deliver:'
];

const transitionPhrases = [
  'No more settling for average.',
  'It\'s crafted for people who expect more.',
  'Imagine the difference in your day.',
  'Built to make every moment count.',
  'Because time is too precious for compromises.'
];

const formatKeyFeatures = (features) =>
  features
    .split(',')
    .map((feature) => feature.trim())
    .filter(Boolean);

const pickRandom = (list, fallback) =>
  list[Math.floor(Math.random() * list.length)] || fallback;

const toTitleCase = (text) =>
  text
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const uniqueId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const generateAdCopy = (form) => {
  const {
    productName,
    productDescription,
    targetAudience,
    tone,
    platform,
    callToAction,
    primaryGoal,
    keywords
  } = form;

  const platformConfig = platformAngles[platform] ?? platformAngles.facebook;
  const toneWords = toneDescriptors[tone] ?? toneDescriptors.friendly;
  const normalizedName = productName.trim() ? productName.trim() : 'your brand';
  const features = formatKeyFeatures(keywords || '');
  const toneCtaOptions = toneCallsToAction[tone] ?? toneCallsToAction.friendly;

  const headline = `${toTitleCase(
    pickRandom(toneWords, 'next-level')
  )} ${normalizedName} ${primaryGoal ? `for ${primaryGoal}` : ''}`.trim();

  const audienceLine = targetAudience
    ? `Perfect for ${targetAudience.trim()}.`
    : 'Perfect for anyone ready to upgrade.';
  const benefitIntro = pickRandom(benefitOpeners);
  const transition = pickRandom(transitionPhrases);

  const bodyLines = [
    productDescription && productDescription.trim()
      ? productDescription.trim()
      : `${normalizedName} delivers results that feel ${pickRandom(toneWords)}.`,
    transition,
    features.length
      ? `${benefitIntro} ${features.map((feature) => `- ${feature}`).join(' ')}`
      : '',
    audienceLine
  ].filter(Boolean);

  const body = bodyLines.join(' ');

  const finalCta =
    callToAction?.trim() || pickRandom(toneCtaOptions, platformConfig.callToAction);

  const variants = [
    `${pickRandom(toneWords)} vibes with ${normalizedName}. ${bodyLines[0]}`,
    `${normalizedName}: ${primaryGoal || 'Made for people who expect better.'}`,
    `${platformConfig.hook} ${normalizedName}. ${finalCta}!`
  ];

  return {
    id: uniqueId(),
    createdAt: new Date().toISOString(),
    platform,
    headline,
    body,
    callToAction: finalCta,
    variants
  };
};

export const getPromptTemplate = (form) => {
  const features = formatKeyFeatures(form.keywords || '');
  return [
    `Write a high-converting ${form.platform} ad for ${form.productName || 'a product'}.`,
    form.productDescription
      ? `Product details: ${form.productDescription}`
      : '',
    form.targetAudience ? `Audience: ${form.targetAudience}` : '',
    form.tone ? `Tone: ${form.tone}` : '',
    form.primaryGoal ? `Goal: ${form.primaryGoal}` : '',
    features.length ? `Highlight: ${features.join(', ')}` : '',
    form.callToAction ? `Use CTA: ${form.callToAction}` : ''
  ]
    .filter(Boolean)
    .join('\n');
};
