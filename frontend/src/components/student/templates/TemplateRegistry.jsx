import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import CreativeTemplate from './CreativeTemplate';
import React from 'react';

/**
 * Placeholder for a second template to demonstrate switching
 */
const ClassicTemplate = (props) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2 style={{ color: props.themeColor }}>Classic Template (Coming Soon)</h2>
    <p>This is a placeholder for the Classic/ATS layout.</p>
    <p>Current layoutKey: <strong>CLASSIC_1</strong></p>
  </div>
);

/**
 * Registry of all available CV layouts.
 * Maps layoutKey (from DB) to React components.
 */
export const TEMPLATE_REGISTRY = {
  'MODERN_1': ModernTemplate,
  'MODERN_2': ModernTemplate,
  'PRO_1': ProfessionalTemplate,
  'PRO_2': ProfessionalTemplate,
  'CLASSIC_1': ClassicTemplate,
  'CREATIVE_1': CreativeTemplate,
  'HARVARD_1': ProfessionalTemplate,
  'ATS_1': ProfessionalTemplate,
};

/**
 * Helper to get component by key
 */
export const getTemplateComponent = (layoutKey) => {
  return TEMPLATE_REGISTRY[layoutKey] || ModernTemplate;
};
