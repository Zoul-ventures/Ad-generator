import React, { useMemo } from 'react';

const baseTips = [
  {
    id: 'cta',
    condition: (form) => !form.callToAction,
    title: 'Add a call-to-action',
    detail: 'Specific CTAs boost conversions - try "Start free trial" or "Book a demo".'
  },
  {
    id: 'audience',
    condition: (form) => !form.targetAudience,
    title: 'Describe your audience',
    detail: 'Mention their role, motivation, or pain points for targeted language.'
  },
  {
    id: 'features',
    condition: (form) => !form.keywords,
    title: 'List 2-3 top benefits',
    detail: 'Use commas to separate feature highlights you want surfaced.'
  }
];

const buildQuickStart = (form) => {
  const suggestions = [];
  if (!form.productDescription) {
    suggestions.push('Add a short product description');
  }
  if (!form.primaryGoal) {
    suggestions.push('Select a campaign goal to shape messaging');
  }
  if (form.platform === 'linkedin' && form.tone !== 'informative') {
    suggestions.push('LinkedIn works well with an informative tone');
  }
  if (form.platform === 'tiktok' && form.tone === 'informative') {
    suggestions.push('Try a playful tone for short-form video platforms');
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
          <p>Quick reminders to help the AI deliver sharper copy.</p>
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
              <p>Your brief covers the essentials. Generate to see magic.</p>
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
