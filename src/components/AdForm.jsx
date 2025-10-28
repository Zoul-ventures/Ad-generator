import React, { useEffect, useMemo, useRef } from 'react';
import { getPlatformDetails, platformOptions } from '../utils/generateAd.js';

const FormField = ({ label, helper, children }) => (
  <label className="field">
    <div className="field-label">
      <span>{label}</span>
      {helper ? <span className="field-helper">{helper}</span> : null}
    </div>
    {children}
  </label>
);

const TextInput = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    className="input"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    type={type}
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

const isValidHex = (value) => /^#[0-9A-Fa-f]{6}$/.test(value);

const normalizeHex = (value) => {
  if (!value) {
    return '#000000';
  }
  let next = value.trim().toUpperCase();
  if (!next.startsWith('#')) {
    next = `#${next}`;
  }
  next = `#${next.slice(1).replace(/[^0-9A-F]/g, '').slice(0, 6)}`;
  if (next.length === 4) {
    const [, r, g, b] = next.split('');
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (next.length < 7) {
    return next;
  }
  return next.slice(0, 7);
};

const PlatformPicker = ({ value, onChange }) => (
  <div className="chip-list chip-list-grid">
    {platformOptions.map((option) => (
      <button
        key={option.value}
        type="button"
        className={`chip${value === option.value ? ' chip-active' : ''}`}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const ColorPaletteEditor = ({ colors, onColorChange, onAddColor, onRemoveColor }) => (
  <div className="color-palette">
    {colors.map((color, index) => {
      const pickerValue = isValidHex(color) ? color : '#000000';
      return (
        <div className="color-swatch-row" key={`${index}-${color}`}>
          <input
            type="color"
            className="color-swatch"
            value={pickerValue}
            onChange={(event) => onColorChange(index, event.target.value.toUpperCase())}
          />
          <input
            className="input color-hex-input"
            value={color}
            maxLength={7}
            onChange={(event) => onColorChange(index, normalizeHex(event.target.value))}
            placeholder="#000000"
          />
          {colors.length > 1 ? (
            <button
              type="button"
              className="button ghost color-remove"
              onClick={() => onRemoveColor(index)}
            >
              Remove
            </button>
          ) : null}
        </div>
      );
    })}
    {colors.length < 5 ? (
      <button type="button" className="button ghost color-add" onClick={onAddColor}>
        Add another color
      </button>
    ) : null}
  </div>
);

const AdForm = ({ form, onChange, onGenerate, onReset, isGenerating }) => {
  const logoInputRef = useRef(null);

  useEffect(() => {
    if (!form.logo && logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  }, [form.logo]);

  const handleChange = (key) => (value) => onChange({ ...form, [key]: value });

  const handleColorUpdate = (index, value) => {
    const next = [...(form.brandColors || ['#000000'])];
    next[index] = value;
    handleChange('brandColors')(next);
  };

  const handleAddColor = () => {
    const next = [...(form.brandColors || [])];
    next.push('#000000');
    handleChange('brandColors')(next);
  };

  const handleRemoveColor = (index) => {
    const next = [...(form.brandColors || [])].filter((_, idx) => idx !== index);
    handleChange('brandColors')(next.length ? next : ['#000000']);
  };

  const handleLogoUpload = (event) => {
    const [file] = event.target.files || [];
    onChange({ ...form, logo: file ?? null });
  };

  const handleLogoRemove = () => {
    onChange({ ...form, logo: null });
  };

  const selectedPlatform = useMemo(
    () => getPlatformDetails(form.socialPlatform || 'instagram'),
    [form.socialPlatform]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate();
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <header className="panel-header">
        <div>
          <h2>Craft your brand brief</h2>
          <p>Define the core visual and verbal cues before you generate new assets.</p>
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
          <FormField label="Brand name">
            <TextInput
              value={form.brandName}
              onChange={handleChange('brandName')}
              placeholder="e.g. Northwind Studio"
            />
          </FormField>

          <FormField label="Campaign goal">
            <TextInput
              value={form.goal}
              onChange={handleChange('goal')}
              placeholder="e.g. Launch our fall collection with a premium feel"
            />
          </FormField>

          <FormField
            label="Primary headline idea"
            helper="Optional starter copy to anchor the concept."
          >
            <TextInput
              value={form.headline}
              onChange={handleChange('headline')}
              placeholder="e.g. Elevate your everyday essentials"
            />
          </FormField>

          <FormField
            label="Brand font"
            helper="List the font family or style you want represented."
          >
            <TextInput
              value={form.font}
              onChange={handleChange('font')}
              placeholder="e.g. Neue Montreal, bold headers with light body"
            />
          </FormField>
        </div>

        <FormField
          label="Social platform"
          helper="Choose where this creative will primarily appear."
        >
          <PlatformPicker value={form.socialPlatform} onChange={handleChange('socialPlatform')} />
          <div className="platform-legend">
            <span>{selectedPlatform.label}</span>
            <span>Aspect ratio: {selectedPlatform.aspectRatio}</span>
          </div>
        </FormField>

        <FormField
          label="Brand context"
          helper="What is happening in the business that this brief should reflect?"
        >
          <Textarea
            value={form.brandContext}
            onChange={handleChange('brandContext')}
            placeholder="e.g. Pre-launch campaign teasing our modular lighting system for design-savvy homeowners."
            rows={3}
          />
        </FormField>

        <div className="field-grid">
          <FormField
            label="Brand feel"
            helper="Describe the texture or personality of the brand."
          >
            <TextInput
              value={form.brandFeel}
              onChange={handleChange('brandFeel')}
              placeholder="e.g. Elevated, tactile, tailored"
            />
          </FormField>

          <FormField
            label="Brand mood"
            helper="Give the emotional cues to steer messaging and design."
          >
            <TextInput
              value={form.brandMood}
              onChange={handleChange('brandMood')}
              placeholder="e.g. Optimistic, grounded, quietly confident"
            />
          </FormField>
        </div>

        <FormField
          label="Visual style"
          helper="Describe mood, textures, photography or illustration preferences."
        >
          <Textarea
            value={form.visualStyle}
            onChange={handleChange('visualStyle')}
            placeholder="e.g. High-contrast imagery, soft lighting, hero product close-ups"
            rows={3}
          />
        </FormField>

        <FormField
          label="Brand colors"
          helper="Select up to five core hex values that define your palette."
        >
          <ColorPaletteEditor
            colors={form.brandColors || ['#000000']}
            onColorChange={handleColorUpdate}
            onAddColor={handleAddColor}
            onRemoveColor={handleRemoveColor}
          />
        </FormField>

        <FormField
          label="Keywords"
          helper="Comma-separated buzzwords or phrases to weave into the copy."
        >
          <Textarea
            value={form.keywords}
            onChange={handleChange('keywords')}
            placeholder="e.g. premium finish, sustainable materials, limited edition"
          />
        </FormField>

        <FormField
          label="Logo upload"
          helper="PNG, JPG or SVG up to 2MB. The file stays on your device."
        >
          <div className="logo-upload">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="input file-input"
              onChange={handleLogoUpload}
            />
            {form.logo ? (
              <div className="file-meta">
                <span className="file-name">{form.logo.name}</span>
                <button type="button" className="button ghost file-remove" onClick={handleLogoRemove}>
                  Remove logo
                </button>
              </div>
            ) : (
              <span className="field-helper-inline">No logo selected yet.</span>
            )}
          </div>
        </FormField>
      </div>
    </form>
  );
};

export default AdForm;
