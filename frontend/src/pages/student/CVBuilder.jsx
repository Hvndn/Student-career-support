import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { studentApi } from '../../api';
import { getTemplateComponent } from '../../components/student/templates/TemplateRegistry.jsx';
import html2pdf from 'html2pdf.js';
import '../../assets/css/student/CVBuilder.css';

const CVBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const layoutParam = searchParams.get('layout');
  const [profile, setProfile] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [primaryColor, setPrimaryColor] = useState('#1e293b');
  const [saveStatus, setSaveStatus] = useState('Bản nháp');

  // Load data
  useEffect(() => {
    studentApi.getProfile()
      .then(res => {
        const data = res.data.data;
        setProfile(data);
        
        const savedCV = localStorage.getItem(`dau_cv_${id}`);
        if (savedCV) {
          setCvData(JSON.parse(savedCV));
        } else {
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
            avatar: data.avatar || data.avatarUrl,
            layoutKey: layoutParam || 'MODERN_1',
            themeColor: '#1e293b'
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

  const handleUpdateCV = (newData) => {
    setCvData(newData);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cv-template-render');
    const opt = {
      margin: 0,
      filename: `CV_${cvData.fullName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading || !cvData) return <div className="builder-loading">Đang chuẩn bị trình tạo CV...</div>;

  return (
    <div className="dau-builder-layout">
      <header className="builder-header">
        <div className="header-left">
           <button className="btn-back" onClick={() => navigate('/student/cv-template')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
           </button>
           <div className="title-box">
             <h2 className="cv-name">CHỈNH SỬA TRỰC TIẾP</h2>
             <span className="brand-sub">{saveStatus.toUpperCase()} • BẤM VÀO CHỮ ĐỂ SỬA</span>
           </div>
        </div>
        <div className="header-right">
           <button className="btn-save" onClick={handleSave} style={{ background: '#0f172a' }}>
             <span className="material-symbols-outlined">save</span> Lưu bản nháp
           </button>
           <button className="btn-save" onClick={handleDownloadPDF} style={{ background: 'var(--accent-color, #2563eb)' }}>
             <span className="material-symbols-outlined">download</span> Tải xuống PDF
           </button>
        </div>
      </header>

      <div className="builder-body">
        <aside className="structure-sidebar">
           <div className="section-title">THIẾT KẾ & MÀU SẮC</div>
           <div className="design-setting">
              <label style={{ fontSize: '8pt', color: '#64748b', marginBottom: '10px', display: 'block' }}>MÀU CHỦ ĐẠO</label>
              <div className="color-palette">
                 {['#8b1538', '#1e293b', '#3b82f6', '#10b981', '#f59e0b', '#dc2626', '#7c3aed', '#db2777'].map(c => (
                   <button key={c} className={`color-dot ${primaryColor === c ? 'active' : ''}`} style={{background: c}} onClick={() => { setPrimaryColor(c); setCvData({...cvData, themeColor: c}); }} />
                 ))}
              </div>
              
              <div className="builder-hint" style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '8px', fontSize: '9pt', color: '#475569', lineHeight: '1.5' }}>
                 <p><strong>💡 Mẹo:</strong></p>
                 <ul style={{ paddingLeft: '15px', marginTop: '5px' }}>
                    <li>Bấm trực tiếp vào văn bản trên CV để sửa.</li>
                    <li>Di chuột lên các mục để xóa.</li>
                    <li>PDF tải về sẽ giống 100% như bạn thấy.</li>
                 </ul>
              </div>
           </div>
        </aside>

        <main className="preview-container" style={{ flex: 1, background: '#e2e8f0', padding: '40px' }}>
           <div className="preview-canvas-wrapper" style={{ 
               transformOrigin: 'top center',
               transform: `scale(${zoom/100})`,
               boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
               margin: '0 auto'
           }}>
              <div className="builder-canvas">
                {cvData && (() => {
                  const TemplateComponent = getTemplateComponent(cvData.layoutKey || 'MODERN_1');
                  return (
                    <TemplateComponent 
                      profile={profile}
                      cvData={cvData}
                      isEditMode={true}
                      onUpdate={handleUpdateCV}
                      themeColor={cvData.themeColor || primaryColor}
                      zoom={zoom}
                    />
                  );
                })()}
              </div>
           </div>
           
           <div className="zoom-controls">
              <button onClick={() => setZoom(Math.max(50, zoom - 10))}>-</button>
              <span className="zoom-value">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(150, zoom + 10))}>+</button>
           </div>
        </main>
      </div>
    </div>
  );
};

export default CVBuilder;
