import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../../api';
import CVTemplate from '../../components/student/CVTemplate';
import '../../assets/css/student/CVBuilder.css';

const CVBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PERSONAL');
  const [zoom, setZoom] = useState(100);
  const [primaryColor, setPrimaryColor] = useState('#1e293b');
  const [templateId, setTemplateId] = useState('blue');
  const [saveStatus, setSaveStatus] = useState('Bản nháp');

  // Load data
  useEffect(() => {
    studentApi.getProfile()
      .then(res => {
        const data = res.data.data;
        setProfile(data);
        
        // Try loading from localStorage first
        const savedCV = localStorage.getItem(`dau_cv_${id}`);
        if (savedCV) {
          setCvData(JSON.parse(savedCV));
        } else {
          // Initialize from profile
          setCvData({
            fullName: data.fullName,
            major: data.major,
            email: data.email,
            phone: data.phone,
            address: data.address,
            bio: data.bio,
            educations: data.educations || [],
            experiences: data.experiences || [],
            projects: data.projects || [],
            skills: data.skills || [],
            certifications: data.certifications || [],
            languages: data.languages || [],
            avatar: data.avatar || data.avatarUrl
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = () => {
    localStorage.setItem(`dau_cv_${id}`, JSON.stringify(cvData));
    setSaveStatus('Đã lưu');
    setTimeout(() => setSaveStatus('Bản nháp'), 2000);
  };

  const handleSaveAndExit = () => {
    handleSave();
    navigate('/student/cv-template');
  };

  if (loading || !cvData) return <div className="builder-loading">Đang chuẩn bị trình tạo CV...</div>;

  const updateField = (field, value) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field, blankItem) => {
    updateField(field, [...cvData[field], { ...blankItem, id: Date.now() }]);
  };

  const deleteItem = (field, idx) => {
    const newList = [...cvData[field]];
    newList.splice(idx, 1);
    updateField(field, newList);
  };

  const updateItem = (field, idx, key, value) => {
    const newList = [...cvData[field]];
    newList[idx] = { ...newList[idx], [key]: value };
    updateField(field, newList);
  };

  const renderEditor = () => {
    switch(activeTab) {
      case 'PERSONAL':
        return (
          <div className="editor-pane">
            <h3>THÔNG TIN CÁ NHÂN</h3>
            <div className="editor-group avatar-editor">
              <div className="avatar-preview-box">
                 <img src={cvData.avatar || "https://ui-avatars.com/api/?name=" + cvData.fullName} alt="Avatar" />
                 <button className="btn-change-photo">Đổi ảnh</button>
              </div>
            </div>
            <div className="editor-group">
              <label>HỌ VÀ TÊN</label>
              <input type="text" value={cvData.fullName || ''} onChange={(e) => updateField('fullName', e.target.value)} />
            </div>
            <div className="editor-group">
              <label>VỊ TRÍ ỨNG TUYỂN</label>
              <input type="text" value={cvData.major || ''} onChange={(e) => updateField('major', e.target.value)} />
            </div>
          </div>
        );
      case 'CONTACT':
        return (
          <div className="editor-pane">
            <h3>LIÊN HỆ</h3>
            <div className="editor-group">
              <label>SỐ ĐIỆN THOẠI</label>
              <input type="text" value={cvData.phone || ''} onChange={(e) => updateField('phone', e.target.value)} />
            </div>
            <div className="editor-group">
              <label>EMAIL</label>
              <input type="text" value={cvData.email || ''} onChange={(e) => updateField('email', e.target.value)} />
            </div>
            <div className="editor-group">
              <label>ĐỊA CHỈ</label>
              <input type="text" value={cvData.address || ''} onChange={(e) => updateField('address', e.target.value)} />
            </div>
          </div>
        );
      case 'OBJECTIVE':
         return (
           <div className="editor-pane">
              <h3>MỤC TIÊU NGHỀ NGHIỆP</h3>
              <div className="ai-assist-box">
                 <button className="btn-ai-write" onClick={() => updateField('bio', 'Sinh viên năng động, mong muốn tìm kiếm môi trường làm việc chuyên nghiệp để phát triển kỹ năng và đóng góp cho doanh nghiệp...')}>✨ VIẾT BẰNG AI</button>
              </div>
              <textarea rows="8" value={cvData.bio || ''} onChange={(e) => updateField('bio', e.target.value)} placeholder="Nhập mục tiêu..."></textarea>
           </div>
         );
      case 'EDUCATION':
        return (
          <div className="editor-pane">
            <h3>HỌC VẤN</h3>
            {cvData.educations.map((edu, idx) => (
              <div key={idx} className="editor-item-card">
                <div className="item-header">
                  <input className="item-title-input" value={edu.schoolName} onChange={(e) => updateItem('educations', idx, 'schoolName', e.target.value)} />
                  <button className="btn-delete-item" onClick={() => deleteItem('educations', idx)}>&times;</button>
                </div>
                <input placeholder="Chuyên ngành" value={edu.major} onChange={(e) => updateItem('educations', idx, 'major', e.target.value)} />
                <div className="row">
                   <input placeholder="Bắt đầu" value={edu.startDate} onChange={(e) => updateItem('educations', idx, 'startDate', e.target.value)} />
                   <input placeholder="Kết thúc" value={edu.endDate} onChange={(e) => updateItem('educations', idx, 'endDate', e.target.value)} />
                </div>
              </div>
            ))}
            <button className="btn-add-item" onClick={() => addItem('educations', { schoolName: 'Tên trường', major: '', startDate: '', endDate: '' })}>+ THÊM HỌC VẤN</button>
          </div>
        );
      case 'PROJECTS':
         return (
           <div className="editor-pane">
              <h3>DỰ ÁN ĐÃ THAM GIA</h3>
              {cvData.projects.map((proj, idx) => (
                <div key={idx} className="editor-item-card">
                  <div className="item-header">
                    <input className="item-title-input" value={proj.name} onChange={(e) => updateItem('projects', idx, 'name', e.target.value)} />
                    <button className="btn-delete-item" onClick={() => deleteItem('projects', idx)}>&times;</button>
                  </div>
                  <input placeholder="Vai trò" value={proj.role} onChange={(e) => updateItem('projects', idx, 'role', e.target.value)} />
                  <textarea placeholder="Mô tả..." value={proj.description} onChange={(e) => updateItem('projects', idx, 'description', e.target.value)} />
                  <button className="btn-ai-mini">✨ VIẾT BẰNG AI</button>
                </div>
              ))}
              <button className="btn-add-item" onClick={() => addItem('projects', { name: 'Tên dự án', role: '', description: '' })}>+ THÊM DỰ ÁN</button>
           </div>
         );
      default:
        return <div className="editor-pane">Chọn một phần để chỉnh sửa</div>;
    }
  };

  return (
    <div className="dau-builder-layout">
      <header className="builder-header">
        <div className="header-left">
           <button className="btn-back" onClick={() => navigate('/student/cv-template')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
           </button>
           <div className="title-box">
             <h2 className="cv-name">CV MỚI CỦA TÔI</h2>
             <span className="brand-sub">DAU CAREER BUILDER</span>
           </div>
        </div>
        <div className="header-right">
           <div className="save-indicator">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path></svg>
             CV ONLINE
           </div>
           <button className="btn-save" onClick={handleSave}>
             <span className="material-symbols-outlined">save</span> Lưu
           </button>
           <button className="btn-save-exit" onClick={handleSaveAndExit}>Lưu & Thoát</button>
        </div>
      </header>

      <div className="builder-body">
        <aside className="structure-sidebar">
           <div className="section-title">CẤU TRÚC CV</div>
           <nav className="structure-nav">
             {['PERSONAL', 'CONTACT', 'OBJECTIVE', 'EDUCATION', 'PROJECTS'].map(tab => (
               <button key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'PERSONAL' ? 'THÔNG TIN CÁ NHÂN' : tab === 'CONTACT' ? 'LIÊN HỆ' : tab === 'OBJECTIVE' ? 'MỤC TIÊU' : tab === 'EDUCATION' ? 'HỌC VẤN' : 'DỰ ÁN'}
                  <span className="status-tag">HIỆN</span>
               </button>
             ))}
           </nav>
           <div className="design-setting">
              <div className="color-palette">
                 {['#8b1538', '#1e293b', '#3b82f6', '#10b981', '#f59e0b', '#dc2626', '#7c3aed', '#db2777'].map(c => (
                   <button key={c} className={`color-dot ${primaryColor === c ? 'active' : ''}`} style={{background: c}} onClick={() => setPrimaryColor(c)} />
                 ))}
              </div>
              <div className="cat-grid">
                 {['ĐƠN GIẢN', 'CHUYÊN NGHIỆP', 'HIỆN ĐẠI', 'ẤN TƯỢNG', 'HARVARD', 'ATS'].map(cat => (
                   <button key={cat} className={`btn-cat ${cat === 'ĐƠN GIẢN' ? 'active' : ''}`}>{cat}</button>
                 ))}
              </div>
           </div>
        </aside>

        <main className="preview-container">
           <div className="preview-canvas-wrapper" style={{ transform: `scale(${zoom/100})` }}>
              <CVTemplate 
                profile={cvData}
                experiences={cvData.experiences}
                educations={cvData.educations}
                skills={cvData.skills}
                projects={cvData.projects}
                languages={cvData.languages}
                interests={cvData.interests}
                activities={cvData.activities}
                certifications={cvData.certifications}
                theme={{ accentColor: primaryColor }}
              />
           </div>
           <div className="zoom-controls">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))}>-</button>
              <span className="zoom-value">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(150, zoom + 10))}>+</button>
           </div>
        </main>

        <aside className="editor-sidebar">
           <div className="editor-header">TRÌNH CHỈNH SỬA</div>
           <div className="editor-content-scroll">{renderEditor()}</div>
        </aside>
      </div>
    </div>
  );
};

export default CVBuilder;
