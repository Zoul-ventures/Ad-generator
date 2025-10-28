import React, { useMemo } from 'react';

const DEFAULT_BRAND_COLOR = '#6C47FF';

const baseTips = [
  {
    id: 'goal',
    condition: (form) => !form.goal,
    title: 'Clarify the campaign goal',
    detail: 'Spell out the outcome you want - launch hype, sign-ups, sales - so copy leans into it.'
  },
  {
    id: 'context',
    condition: (form) => !form.brandContext,
    title: 'Share brand context',
    detail: 'A sentence about launches, partnerships, or seasonality keeps everyone aligned.'
  },
  {
    id: 'feel',
    condition: (form) => !form.brandFeel,
    title: 'Name the brand feel',
    detail: 'A few texture words (e.g. polished, grounded) make creative intent obvious.'
  },
  {
    id: 'mood',
    condition: (form) => !form.brandMood,
    title: 'Define the mood',
    detail: 'Emotional cues help writers match the energy—try 2-3 adjectives.'
  },
  {
    id: 'palette',
    condition: (form) =>
      (form.brandColors || []).filter((color) => color && color !== DEFAULT_BRAND_COLOR).length < 1,
    title: 'Expand the palette',
    detail: 'Add a secondary hex code so designers have flexibility for highlights and accents.'
  },
  {
    id: 'visualStyle',
    condition: (form) => !form.visualStyle,
    title: 'Describe the visual style',
    detail: 'Mention mood, lighting, or layout cues to steer imagery and art direction.'
  },
  {
    id: 'keywords',
    condition: (form) => !form.keywords,
    title: 'Drop in brand keywords',
    detail: 'Short comma-separated phrases keep messaging on-brand during generation.'
  },
  {
    id: 'logo',
    condition: (form) => !form.logo,
    title: 'Attach a logo',
    detail: 'Remind future you to keep the latest logo handy when sharing the brief.'
  }
];

const buildQuickStart = (form) => {
  const suggestions = [];

  if (!form.brandName) {
    suggestions.push('Add the brand name for personalized headlines.');
  }

  if (!form.brandContext) {
    suggestions.push('Set the brand context so the narrative is grounded.');
  }

  if (!form.headline) {
    suggestions.push('Seed a headline idea to anchor the tone of the copy.');
  }

  if (!form.font) {
    suggestions.push('Note headline and body fonts so typographers stay aligned.');
  }

  if (!form.brandFeel) {
    suggestions.push('Capture the brand feel with 2-3 descriptive words.');
  }

  if (!form.brandMood) {
    suggestions.push('Add the mood so imagery and copy land with the right emotion.');
  }

  if ((form.brandColors || []).length === 1) {
    suggestions.push('Consider adding one more accent color for versatility.');
  }

  return suggestions;
};

const PromptTips = ({ form }) => {
  const quickStart = useMemo(() => buildQuickStart(form), [form]);
  const actionable = useMemo(
    () => baseTips.filter((tip) => tip.condition(form)),
    [form]
  );

  return (
    <section className="panel tips-panel">
      <header className="panel-header">
        <div>
          <h2>Prompt strategist</h2>
          <p>Quick reminders to help your brief cover every creative angle.</p>
        </div>
      </header>
      <div className="panel-body">
        <ul className="tips-list">
          {actionable.map((tip) => (
            <li key={tip.id}>
              <h4>{tip.title}</h4>
              <p>{tip.detail}</p>
            </li>
          ))}
          {actionable.length === 0 ? (
            <li>
              <h4>Looking good!</h4>
              <p>Your brief covers the essentials. Generate to share it with the team.</p>
            </li>
          ) : null}
        </ul>
        {quickStart.length ? (
          <div className="quickstart">
            <h4>Quick wins</h4>
            <ul>
              {quickStart.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default PromptTips;
