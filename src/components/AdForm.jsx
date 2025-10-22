import React from 'react';
import clsx from 'clsx';

const toneOptions = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'bold', label: 'Bold' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'playful', label: 'Playful' },
  { value: 'informative', label: 'Informative' }
];

const platformOptions = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'email', label: 'Email Campaign' }
];

const goalOptions = [
  'Drive sales',
  'Increase signups',
  'Boost brand awareness',
  'Promote a launch',
  'Retain existing customers'
];

const FormField = ({ label, htmlFor, helper, children }) => (
  <label className="field">
    <div className="field-label">
      <span>{label}</span>
      {helper ? <span className="field-helper">{helper}</span> : null}
    </div>
    {children}
  </label>
);

const TonePicker = ({ value, onChange }) => (
  <div className="chip-list">
    {toneOptions.map((tone) => (
      <button
        key={tone.value}
        type="button"
        className={clsx('chip', value === tone.value && 'chip-active')}
        onClick={() => onChange(tone.value)}
      >
        {tone.label}
      </button>
    ))}
  </div>
);

const PlatformSelect = ({ value, onChange }) => (
  <div className="chip-list chip-list-grid">
    {platformOptions.map((platform) => (
      <button
        key={platform.value}
        type="button"
        className={clsx('chip', value === platform.value && 'chip-active')}
        onClick={() => onChange(platform.value)}
      >
        {platform.label}
      </button>
    ))}
  </div>
);

const GoalSelect = ({ value, onChange }) => (
  <select
    className="input"
    value={value}
    onChange={(event) => onChange(event.target.value)}
  >
    <option value="">Select a primary goal</option>
    {goalOptions.map((goal) => (
      <option key={goal} value={goal}>
        {goal}
      </option>
    ))}
  </select>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    className="input"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
  />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    className="textarea"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    rows={rows}
  />
);

const AdForm = ({ form, onChange, onGenerate, onReset, isGenerating }) => {
  const handleChange = (key) => (value) => onChange({ ...form, [key]: value });

  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate();
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <header className="panel-header">
        <div>
          <h2>Create your brief</h2>
          <p>Fill in the essentials and let the AI craft compelling ad copy.</p>
        </div>
        <div className="panel-actions">
          <button type="button" className="button ghost" onClick={onReset}>
            Reset
          </button>
          <button className="button primary" type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate ad'}
          </button>
        </div>
      </header>

      <div className="panel-body">
        <div className="field-grid">
          <FormField label="Product name" htmlFor="productName">
            <TextInput
              value={form.productName}
              onChange={handleChange('productName')}
              placeholder="e.g. Lumen Smart Planner"
            />
          </FormField>

          <FormField label="Primary goal" htmlFor="primaryGoal">
            <GoalSelect value={form.primaryGoal} onChange={handleChange('primaryGoal')} />
          </FormField>

          <FormField
            label="Product description"
            htmlFor="productDescription"
            helper="Explain what makes this offer shine."
          >
            <Textarea
              value={form.productDescription}
              onChange={handleChange('productDescription')}
              placeholder="Describe your product in a few sentences..."
              rows={4}
            />
          </FormField>

          <FormField
            label="Target audience"
            htmlFor="targetAudience"
            helper="Who are you speaking to?"
          >
            <Textarea
              value={form.targetAudience}
              onChange={handleChange('targetAudience')}
              placeholder="e.g. Busy marketing teams looking to automate reporting"
              rows={3}
            />
          </FormField>
        </div>

        <FormField label="Tone" htmlFor="tone" helper="Choose the energy for your ad.">
          <TonePicker value={form.tone} onChange={handleChange('tone')} />
        </FormField>

        <FormField label="Platform" htmlFor="platform" helper="We tailor the copy to fit.">
          <PlatformSelect value={form.platform} onChange={handleChange('platform')} />
        </FormField>

        <FormField
          label="Key benefits or features"
          htmlFor="keywords"
          helper="Comma-separated; we highlight up to five."
        >
          <Textarea
            value={form.keywords}
            onChange={handleChange('keywords')}
            placeholder="e.g. 24/7 insights, drag-and-drop editor, team dashboards"
          />
        </FormField>

        <FormField
          label="Preferred call-to-action"
          htmlFor="callToAction"
          helper="Leave blank to let the AI choose."
        >
          <TextInput
            value={form.callToAction}
            onChange={handleChange('callToAction')}
            placeholder="e.g. Start your free trial"
          />
        </FormField>
      </div>
    </form>
  );
};

export default AdForm;
