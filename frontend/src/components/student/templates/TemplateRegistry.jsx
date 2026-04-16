import ArtisticTemplate from './ArtisticTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import React from 'react';

/**
 * Fallback Component khi không tìm thấy mẫu hoặc hệ thống đang được làm mới.
 */
const FallbackTemplate = () => (
  <div style={{ 
    padding: '40px', 
    textAlign: 'center', 
    color: '#64748b',
    background: '#f8fafc',
    borderRadius: '12px',
    margin: '20px',
    border: '2px dashed #e2e8f0'
  }}>
    <h2 style={{ color: '#1e293b' }}>Hệ thống đang được cập nhật</h2>
    <p>Các mẫu CV chuyên nghiệp mới đang được thiết kế và sẽ sớm có mặt.</p>
  </div>
);

/**
 * Registry liên kết layoutKey (từ backend DB) với React Component.
 */
export const TEMPLATE_REGISTRY = {
  'ARTISTIC_1': ArtisticTemplate,
  'PRO_1':      ProfessionalTemplate,
};

/**
 * Helper: lấy component theo layoutKey, fallback về FallbackTemplate.
 */
export const getTemplateComponent = (layoutKey) => {
  const comp = TEMPLATE_REGISTRY[layoutKey];
  if (!comp) {
    console.warn(`[TemplateRegistry] Không tìm thấy hoặc hệ thống đang trống cho key: "${layoutKey}"`);
    return FallbackTemplate;
  }
  return comp;
};
