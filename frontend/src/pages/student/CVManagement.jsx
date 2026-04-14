import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api';
import StudentSidebar from '../../components/student/StudentSidebar';
import '../../assets/css/student/CVManagement.css';

const CVCard = ({ id, title, date, template, isPublic }) => {
  const navigate = useNavigate();

  return (
    <div className="dau-cv-card">
      <div className={`dau-cv-preview template-${template}`}>
        {/* Overlay xuất hiện khi hover */}
        <div className="dau-cv-overlay">
           <button className="dau-btn-overlay-edit" onClick={() => navigate(`/student/cv-builder/${id}`)}>
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
             Sửa
           </button>
           <button className="dau-btn-overlay-view">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
             Xem
           </button>
        </div>

        {/* Status Badge */}
        <div className="dau-cv-status-badge">
           {isPublic ? (
             <><span className="dot">●</span> Công khai</>
           ) : (
             <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> Riêng tư</>
           )}
        </div>

        {/* Mocking CV content in thumbnail */}
        <div className="dau-cv-thumb-content">
          <div className="dau-thumb-header"></div>
          <div className="dau-thumb-body">
            <div className="dau-thumb-sidebar"></div>
            <div className="dau-thumb-main">
              <div className="dau-thumb-line"></div>
              <div className="dau-thumb-line short"></div>
              <div className="dau-thumb-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="dau-cv-info">
        <h5>{title}</h5>
        <p className="dau-cv-date">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Cập nhật: {date}
        </p>
      </div>
      <div className="dau-cv-actions">
        <button className={`dau-action-icon ${isPublic ? 'active' : ''}`} title="Trình trạng hiển thị">
          {isPublic ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
          )}
        </button>
        <button className="dau-action-icon" title="Tải xuống">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button className="dau-action-icon" title="Xóa">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
      {isPublic && <span className="dau-badge-public">● Công khai</span>}
    </div>
  );
};

const TemplateSelectorModal = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Tất cả');
  const navigate = useNavigate();

  const categories = ['Tất cả', 'Hiện đại', 'Chuyên nghiệp', 'Đơn giản', 'Ấn tượng', 'Harvard', 'ATS'];

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getCvTemplates();
      if (res.data && res.data.success) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách mẫu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (layoutKey) => {
    // Navigate to builder with layoutKey as param or via state
    navigate(`/student/cv-builder/new?layout=${layoutKey}`);
    onClose();
  };

  if (!isOpen) return null;

  const filteredTemplates = templates.filter(t => 
    categoryFilter === 'Tất cả' || t.category === categoryFilter
  );

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
             <button 
               key={cat} 
               className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
               onClick={() => setCategoryFilter(cat)}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className="dau-template-list premium-scroll">
           {loading ? (
             <div className="loader-box"><div className="loader"></div></div>
           ) : filteredTemplates.length > 0 ? (
             filteredTemplates.map(t => (
               <div key={t.id} className="dau-template-option">
                 <div className="dau-template-preview">
                    {t.thumbnailUrl && t.thumbnailUrl.startsWith('/') ? (
                      <img src={t.thumbnailUrl} alt={t.name} />
                    ) : (
                      <div className="preview-placeholder">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                    )}
                    <div className="template-hover-overlay">
                       <button className="btn-preview-layout">
                         <span className="material-symbols-outlined">zoom_in</span>
                       </button>
                    </div>
                 </div>
                 <div className="dau-template-info">
                    <div className="template-meta">
                      <span className="dau-template-name">{t.name}</span>
                      <span className="template-cat">{t.category}</span>
                    </div>
                    <button 
                      className="dau-btn-select-template"
                      onClick={() => handleSelectTemplate(t.layoutKey)}
                    >
                      Dùng mẫu này
                    </button>
                 </div>
               </div>
             ))
           ) : (
             <div className="no-templates">
               <span className="material-symbols-outlined">search_off</span>
               <p>Không tìm thấy mẫu nào trong danh mục này</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const CVManagement = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const mockCVs = [
    { id: 1, title: 'CV mới của tôi', date: '2/4/2026', template: 'blue', isPublic: false },
    { id: 2, title: 'CV mới của tôi', date: '24/3/2026', template: 'red', isPublic: false },
    { id: 3, title: 'CV mới của tôi', date: '22/3/2026', template: 'dark', isPublic: false },
    { id: 4, title: 'CV mới của tôi', date: '22/3/2026', template: 'gray', isPublic: false },
    { id: 5, title: 'CV mới của tôi', date: '28/3/2026', template: 'light', isPublic: true },
  ];

  useEffect(() => {
    studentApi.getProfile()
      .then(res => setProfile(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dau-loading">Đang tải...</div>;

  const filteredCVs = mockCVs.filter(cv => 
    cv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

           <div className="dau-search-bar-container">
              <div className="dau-search-wrapper">
                 <svg className="dau-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                 <input 
                   type="text" 
                   placeholder="Tìm kiếm theo tên bản CV..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="dau-cv-grid">
              {filteredCVs.map(cv => (
                <CVCard key={cv.id} {...cv} />
              ))}
           </div>
        </div>

        <TemplateSelectorModal 
          isOpen={showTemplateSelector} 
          onClose={() => setShowTemplateSelector(false)} 
        />
    </div>
  );
};

export default CVManagement;
