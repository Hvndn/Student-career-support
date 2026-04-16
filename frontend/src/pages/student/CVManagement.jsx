import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentApi } from '../../api';
import '../../assets/css/student/CVManagement.css';

// ── Helpers ────────────────────────────────────────────────────────────────
const getAllLocalCVs = () => {
  const cvs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dau_cv_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        cvs.push({
          id: key.replace('dau_cv_', ''),
          title: data._name || 'CV không tên',
          updatedAt: data._updatedAt || null,
          layoutKey: data.layoutKey || 'MODERN_1',
          fullName: data.fullName || '',
          isPublic: data.isPublic || false,
          _raw: data,
        });
      } catch { /* skip bad entries */ }
    }
  }
  return cvs.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
};

const TEMPLATE_COLORS = {
  MODERN_1: '#8b1538', MODERN_2: '#1d4ed8', PRO_1: '#334e5a',
  ARTISTIC_1: '#2c73b3',
  PRO_2: '#374151', CREATIVE_1: '#7c3aed', HARVARD_1: '#047857',
  ATS_1: '#0891b2', CLASSIC_1: '#6b7280',
};

// ── CV Card ────────────────────────────────────────────────────────────────
const CVCard = ({ cv, onDelete }) => {
  const navigate = useNavigate();
  const color = TEMPLATE_COLORS[cv.layoutKey] || '#8b1538';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Xóa CV "${cv.title}"? Hành động này không thể hoàn tác.`)) {
      localStorage.removeItem(`dau_cv_${cv.id}`);
      onDelete(cv.id);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    // Mở builder rồi trigger PDF export từ đó
    navigate(`/student/cv-builder/${cv.id}?action=download`);
  };

  return (
    <div className="dau-cv-card" onClick={() => navigate(`/student/cv-builder/${cv.id}`)}>
      <div className="dau-cv-preview" style={{ borderTop: `5px solid ${color}` }}>
        {/* Hover overlay */}
        <div className="dau-cv-overlay">
          <button className="dau-btn-overlay-edit" onClick={(e) => { e.stopPropagation(); navigate(`/student/cv-builder/${cv.id}`); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Sửa CV
          </button>
          <button className="dau-btn-overlay-view" onClick={handleDownload}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Tải PDF
          </button>
        </div>

        {/* Real Thumbnail or Mock Fallback */}
        {cv._raw?.thumbnail ? (
          <img src={cv._raw.thumbnail} className="dau-cv-thumb-img" alt="CV Thumb" />
        ) : (
          <div className="dau-cv-thumb-content">
            <div className="dau-thumb-header" style={{ background: color + '20' }}>
              <div style={{ width: '40%', height: '8px', background: color, borderRadius: '4px', margin: '16px auto 0' }}/>
            </div>
            <div className="dau-thumb-body">
              <div className="dau-thumb-sidebar" style={{ background: color + '15' }}/>
              <div className="dau-thumb-main">
                <div className="dau-thumb-line"/>
                <div className="dau-thumb-line short"/>
                <div className="dau-thumb-line"/>
                <div className="dau-thumb-line short"/>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dau-cv-info">
        <h5>{cv.title}</h5>
        <p className="dau-cv-date">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {cv.updatedAt ? new Date(cv.updatedAt).toLocaleDateString('vi-VN') : 'Chưa lưu'}
        </p>
        {cv.fullName && <p className="dau-cv-owner">👤 {cv.fullName}</p>}
      </div>

      <div className="dau-cv-actions">
        <button className="dau-action-icon" title="Chỉnh sửa" onClick={(e) => { e.stopPropagation(); navigate(`/student/cv-builder/${cv.id}`); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button className="dau-action-icon" title="Tải xuống PDF" onClick={handleDownload}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button className="dau-action-icon dau-action-delete" title="Xóa CV" onClick={handleDelete}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  );
};

// ── Template Selector Modal ────────────────────────────────────────────────
const TemplateSelectorModal = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const navigate = useNavigate();

  const categories = ['Tất cả', 'Nghệ thuật', 'Hiện đại', 'Chuyên nghiệp', 'Đơn giản', 'Ấn tượng', 'Harvard', 'ATS'];

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    studentApi.getCvTemplates()
      .then(res => { if (res.data?.success) setTemplates(res.data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSelect = (layoutKey) => {
    const newId = `cv_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    navigate(`/student/cv-builder/${newId}?layout=${layoutKey}`);
    onClose();
  };

  if (!isOpen) return null;

  const filtered = templates.filter(t => categoryFilter === 'Tất cả' || t.category === categoryFilter);

  return (
    <div className="dau-modal-overlay" onClick={onClose}>
      <div className="dau-template-modal" onClick={e => e.stopPropagation()}>
        <div className="dau-modal-header">
          <div className="modal-title-group">
            <h3>Chọn mẫu thiết kế CV</h3>
            <p>Chọn một mẫu để bắt đầu tạo hồ sơ chuyên nghiệp của bạn</p>
          </div>
          <button onClick={onClose} className="dau-close-btn">&times;</button>
        </div>

        <div className="dau-modal-filters">
          {categories.map(cat => (
            <button key={cat} className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
              onClick={() => setCategoryFilter(cat)}>{cat}</button>
          ))}
        </div>

        <div className="dau-template-list premium-scroll">
          {loading ? (
            <div className="loader-box"><div className="loader"/></div>
          ) : filtered.length > 0 ? (
            filtered.map(t => (
              <div key={t.id} className="dau-template-option">
                <div className="dau-template-preview">
                  {t.thumbnailUrl && !t.thumbnailUrl.includes('undefined') ? (
                    <img src={t.thumbnailUrl} alt={t.name} onError={e => { e.target.style.display='none'; }}/>
                  ) : (
                    <div className="preview-placeholder" style={{ background: TEMPLATE_COLORS[t.layoutKey] + '15' }}>
                      <div style={{ textAlign:'center', color: TEMPLATE_COLORS[t.layoutKey] || '#8b1538' }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <div style={{fontSize:'.75rem',fontWeight:700,marginTop:'8px'}}>{t.name}</div>
                      </div>
                    </div>
                  )}
                  <div className="template-hover-overlay">
                    <button className="btn-preview-layout" onClick={() => handleSelect(t.layoutKey)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    </button>
                  </div>
                </div>
                <div className="dau-template-info">
                  <div className="template-meta">
                    <span className="dau-template-name">{t.name}</span>
                    <span className="template-cat">{t.category}</span>
                  </div>
                  <button className="dau-btn-select-template" onClick={() => handleSelect(t.layoutKey)}>
                    Dùng mẫu này
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-templates">
              <p>Không tìm thấy mẫu nào. <button style={{color:'#8b1538',background:'none',border:'none',cursor:'pointer',fontWeight:700}} onClick={() => handleSelect('MODERN_1')}>Dùng mẫu mặc định</button></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────
const CVManagement = () => {
  const [cvList, setCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    // Load từ localStorage (CV lưu local)
    setCvList(getAllLocalCVs());
    setLoading(false);
  }, []);

  const handleDelete = useCallback((id) => {
    setCvList(prev => prev.filter(cv => cv.id !== id));
  }, []);

  const filteredCVs = cvList.filter(cv =>
    cv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cv.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="dau-loading">Đang tải...</div>;

  return (
    <div className="dau-cv-management-wrapper">
      <div className="dau-cv-body">
        <div className="dau-cv-header-row">
          <div className="dau-cv-title-box">
            <span className="dau-tag-career">🚀 My Career Builder</span>
            <h1>Danh sách CV của bạn</h1>
            <p>Quản lý và tùy chỉnh các phiên bản hồ sơ của bạn cho từng nhà tuyển dụng</p>
          </div>
          <button className="dau-btn-create-cv" onClick={() => setShowTemplateSelector(true)}>
            <span className="dau-plus-icon">+</span> Tạo CV mới
          </button>
        </div>

        {/* Stats bar */}
        <div className="dau-cv-stats">
          <div className="dau-stat-item">
            <span className="dau-stat-num">{cvList.length}</span>
            <span className="dau-stat-label">CV đã tạo</span>
          </div>
          <div className="dau-stat-item">
            <span className="dau-stat-num">{cvList.filter(c => c.isPublic).length}</span>
            <span className="dau-stat-label">Công khai</span>
          </div>
        </div>

        <div className="dau-search-bar-container">
          <div className="dau-search-wrapper">
            <svg className="dau-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên CV hoặc tên của bạn..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCVs.length === 0 ? (
          <div className="dau-cv-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p>{searchTerm ? 'Không tìm thấy CV phù hợp' : 'Bạn chưa có CV nào. Hãy tạo CV đầu tiên!'}</p>
            {!searchTerm && (
              <button className="dau-btn-create-cv" style={{marginTop:'16px'}} onClick={() => setShowTemplateSelector(true)}>
                + Tạo CV đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="dau-cv-grid">
            {filteredCVs.map(cv => (
              <CVCard key={cv.id} cv={cv} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <TemplateSelectorModal
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
      />
    </div>
  );
};

export default CVManagement;
