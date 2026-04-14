import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import CreativeTemplate from './CreativeTemplate';
import React from 'react';

/**
 * Registry liên kết layoutKey (từ backend DB) với React Component.
 * Các key phải khớp EXACTLY với giá trị trong bảng cv_templates.
 *
 * DANH SÁCH LAYOUT KEY:
 *  MODERN_1    → Hiện đại Classic (2 cột, sidebar màu)
 *  MODERN_2    → Hiện đại Sáng tạo (biến thể MODERN)
 *  PRO_1       → Chuyên nghiệp Basic
 *  PRO_2       → Chuyên nghiệp Plus
 *  CLASSIC_1   → Đơn giản / Tối giản
 *  CREATIVE_1  → Ấn tượng / Sáng tạo
 *  HARVARD_1   → Harvard Format
 *  ATS_1       → ATS Friendly
 */
export const TEMPLATE_REGISTRY = {
  'MODERN_1':   ModernTemplate,
  'MODERN_2':   ModernTemplate,
  'PRO_1':      ProfessionalTemplate,
  'PRO_2':      ProfessionalTemplate,
  'CLASSIC_1':  ProfessionalTemplate,  // Dùng Professional với layout đơn giản
  'CREATIVE_1': CreativeTemplate,
  'HARVARD_1':  ProfessionalTemplate,  // Chuẩn academic
  'ATS_1':      ProfessionalTemplate,  // ATS-friendly = no images
};

/**
 * Helper: lấy component theo layoutKey, fallback về ModernTemplate nếu không tìm thấy.
 */
export const getTemplateComponent = (layoutKey) => {
  const comp = TEMPLATE_REGISTRY[layoutKey];
  if (!comp) {
    console.warn(`[TemplateRegistry] Không tìm thấy template cho key: "${layoutKey}", dùng MODERN_1 mặc định.`);
    return ModernTemplate;
  }
  return comp;
};
