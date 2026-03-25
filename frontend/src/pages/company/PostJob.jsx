import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import { companyApi } from '../../api';
import '../../assets/css/PostJob.css';

const INDUSTRIES = ['Công nghệ thông tin', 'Marketing', 'Tài chính', 'Thiết kế', 'Kế toán', 'Giáo dục', 'Y tế'];
const JOB_TYPES = ['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Từ xa', 'Hợp đồng'];

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    industry: '',
    jobType: 'Toàn thời gian',
    salary: '',
    location: '',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
  });
  const [skills, setSkills] = useState(['FIGMA', 'UI DESIGN', 'TYPOGRAPHY', 'UX RESEARCH']);
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const s = skillInput.trim().toUpperCase();
      if (!skills.includes(s)) setSkills([...skills, s]);
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  const matchScore = form.title && form.description && skills.length >= 3 ? 92 : form.title ? 60 : 30;
  const matchLabel = matchScore >= 80 ? 'Rất tiềm năng' : matchScore >= 60 ? 'Tiềm năng' : 'Cần cải thiện';
  const matchColor = matchScore >= 80 ? '#2563eb' : matchScore >= 60 ? '#f59e0b' : '#ef4444';

  const handleSubmit = async (draft = false) => {
    // Validation
    if (!draft) {
      const missing = [];
      if (!form.title) missing.push('Tiêu đề');
      if (!form.industry) missing.push('Ngành nghề');
      if (!form.location) missing.push('Địa điểm');
      if (!form.description) missing.push('Mô tả');
      if (!form.requirements) missing.push('Yêu cầu');
      if (!form.deadline) missing.push('Hạn chót');

      if (missing.length > 0) {
        if (missing.length <= 2) {
          showToast(`Vui lòng nhập: ${missing.join(' và ')}`, 'error');
        } else {
          showToast('Vui lòng điền đầy đủ các thông tin bắt buộc', 'error');
        }
        return;
      }
    }

    setSubmitting(true);
    try {
      await companyApi.postJob({
        title: form.title, salary: form.salary, location: form.location,
        jobType: form.jobType, description: form.description, deadline: form.deadline,
        industry: form.industry, requirements: form.requirements, benefits: form.benefits,
        skills: skills,
        status: draft ? 'DRAFT' : 'PUBLISHED'
      });
      showToast(draft ? 'Đã lưu nháp thành công!' : 'Đã đăng tin thành công!', 'success');
      setTimeout(() => navigate('/company/dashboard'), 1500);
    } catch (err) {
      showToast('Đã có lỗi xảy ra. Vui lòng thử lại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '0.9rem', color: '#111827', outline: 'none',
    background: '#fff', fontFamily: "'Outfit', sans-serif",
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <div className="pj-layout">
      <CompanySidebar />

      <div className="pj-main">
        <CompanyTopbar activeTab="Jobs" />

        {/* Header Block */}
        <div className="pj-header-container">
          <header className="pj-page-header">
            <div>
              <p className="pj-breadcrumb">
                <Link to="/company/dashboard">QUẢN LÝ VIỆC LÀM</Link>
                <span className="separator">/</span>
                <span className="active-crumb">ĐĂNG TIN MỚI</span>
              </p>
              <p className="pj-breadcrumb-desc">Tiếp cận hàng ngàn sinh viên tài năng bằng cách đăng tin tuyển dụng chi tiết và hấp dẫn nhất.</p>
              <h1 className="pj-title">Đăng tin tuyển dụng mới</h1>
              <p className="pj-subtitle">Tạo một mô tả hấp dẫn để thu hút những ứng viên tài năng nhất. Điền thông tin bên dưới để bắt đầu hành trình tuyển dụng của bạn.</p>
            </div>
            <div className="pj-header-actions">
              <button className="pj-btn-draft" onClick={() => handleSubmit(true)} disabled={submitting}>
                Lưu nháp
              </button>
              <button className="pj-btn-publish" onClick={() => handleSubmit(false)} disabled={submitting}>
                {submitting ? 'Đang đăng...' : 'Đăng tin'}
              </button>
            </div>
          </header>
        </div>

        {/* Body */}
        <div className="pj-body">
          {/* Left: Form */}
          <div className="pj-col-form">

            {/* Section 1: Basic Info */}
            <div className="pj-card">
              <div className="pj-card-title">
                <span className="pj-card-icon blue">ℹ</span>
                Thông tin cơ bản
              </div>

              <div className="pj-field">
                <label>TIÊU ĐỀ JOB</label>
                <input
                  style={inputStyle}
                  placeholder="Vd: Senior Product Designer"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div className="pj-row2">
                <div className="pj-field">
                  <label>NGÀNH NGHỀ</label>
                  <select
                    style={{ ...inputStyle, appearance: 'auto' }}
                    value={form.industry}
                    onChange={e => set('industry', e.target.value)}
                  >
                    <option value="">Chọn ngành nghề</option>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="pj-field">
                  <label>LOẠI HÌNH</label>
                  <select
                    style={{ ...inputStyle, appearance: 'auto' }}
                    value={form.jobType}
                    onChange={e => set('jobType', e.target.value)}
                  >
                    {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="pj-row2">
                <div className="pj-field">
                  <label>MỨC LƯƠNG</label>
                  <div className="pj-input-icon">
                    <span>$</span>
                    <input
                      style={{ ...inputStyle, paddingLeft: '2rem', border: 'none', outline: 'none' }}
                      placeholder="Vd: 2,000 - 4,500"
                      value={form.salary}
                      onChange={e => set('salary', e.target.value)}
                    />
                  </div>
                </div>
                <div className="pj-field">
                  <label>ĐỊA ĐIỂM</label>
                  <div className="pj-input-icon">
                    <span>📍</span>
                    <input
                      style={{ ...inputStyle, paddingLeft: '2rem', border: 'none', outline: 'none' }}
                      placeholder="Hà Nội, Việt Nam (hoặc Remote)"
                      value={form.location}
                      onChange={e => set('location', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pj-field">
                <label>HẠN CHÓT NỘP HỒ SƠ</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={form.deadline}
                  onChange={e => set('deadline', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Section 2: Detailed Content */}
            <div className="pj-card">
              <div className="pj-card-title">
                <span className="pj-card-icon blue">📄</span>
                Nội dung chi tiết
              </div>

              {/* Mô tả */}
              <div className="pj-field">
                <label>MÔ TẢ CÔNG VIỆC</label>
                <div className="pj-editor">
                  <div className="pj-toolbar">
                    <button type="button" title="Bold"><strong>B</strong></button>
                    <button type="button" title="Italic"><em>I</em></button>
                    <button type="button" title="List">≡</button>
                    <button type="button" title="Quote">❝</button>
                  </div>
                  <textarea
                    placeholder="Nhập mô tả chi tiết các nhiệm vụ..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    style={{ ...inputStyle, border: 'none', borderRadius: '0 0 10px 10px', minHeight: '120px', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Yêu cầu */}
              <div className="pj-field">
                <label>YÊU CẦU ỨNG VIÊN</label>
                <div className="pj-editor">
                  <div className="pj-toolbar">
                    <button type="button"><strong>B</strong></button>
                    <button type="button">≡</button>
                  </div>
                  <textarea
                    placeholder="Nhập các kỹ năng, kinh nghiệm cần có..."
                    value={form.requirements}
                    onChange={e => set('requirements', e.target.value)}
                    style={{ ...inputStyle, border: 'none', borderRadius: '0 0 10px 10px', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Phúc lợi */}
              <div className="pj-field">
                <label>QUYỀN LỢI & PHÚC LỢI</label>
                <div className="pj-editor">
                  <div className="pj-toolbar">
                    <button type="button"><strong>B</strong></button>
                    <button type="button">≡</button>
                  </div>
                  <textarea
                    placeholder="Bảo hiểm, du lịch, thưởng cuối năm..."
                    value={form.benefits}
                    onChange={e => set('benefits', e.target.value)}
                    style={{ ...inputStyle, border: 'none', borderRadius: '0 0 10px 10px', minHeight: '100px', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Side Panels */}
          <div className="pj-col-side">
            {/* Skills */}
            <div className="pj-card">
              <div className="pj-card-title">
                <span className="pj-card-icon blue">🎯</span>
                Kỹ năng cần thiết
              </div>
              <p className="pj-side-desc">Thêm các từ khóa skill để giúp ứng viên đề đăng tin thấy tin tuyển dụng của bạn.</p>
              <input
                style={{ ...inputStyle, marginBottom: '0.8rem' }}
                placeholder="Gõ kỹ năng (vd: Figma, React)..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <div className="pj-skills-list">
                {skills.map(sk => (
                  <span key={sk} className="pj-skill-tag">
                    {sk}
                    <button onClick={() => removeSkill(sk)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Match Score */}
            <div className="pj-card pj-match-card">
              <h4>Tối ưu tin đăng</h4>
              <p>Nexus AI đánh giá nội dung của bạn đang đạt mức xuất sắc.</p>
              <div className="pj-match-row">
                <div className="pj-match-score" style={{ background: matchColor }}>
                  {matchScore}
                </div>
                <div>
                  <p className="pj-match-label">MATCH SCORE</p>
                  <p className="pj-match-desc">{matchLabel}</p>
                </div>
              </div>
              <div className="pj-checklist">
                <div className={`pj-check-item ${form.title ? 'done' : ''}`}>
                  <span>{form.title ? '✅' : '⚪'}</span> Tiêu đề rõ ràng
                </div>
                <div className={`pj-check-item ${skills.length >= 3 ? 'done' : ''}`}>
                  <span>{skills.length >= 3 ? '✅' : '⚪'}</span> Kỹ năng đầy đủ
                </div>
                <div className="pj-check-item hint">
                  <span>⚪</span> Thêm video giới thiệu <em>(Gợi ý)</em>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="pj-card pj-help-card">
              <p>Bạn gặp khó khăn khi viết?</p>
              <a href="#">Xem các tin mẫu ↗</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pj-footer">
          <div className="pj-footer-grid">
            <div>
              <strong>NEXUS TALENT</strong>
              <p>The Digital Curator for Careers. Connecting visionaries with high-impact opportunities.</p>
            </div>
            <div>
              <h5>PLATFORM</h5>
              <p><a href="#">Find Jobs</a></p>
              <p><a href="#">Companies</a></p>
              <p><a href="#">Resources</a></p>
            </div>
            <div>
              <h5>LEGAL</h5>
              <p><a href="#">Privacy Policy</a></p>
              <p><a href="#">Terms of Service</a></p>
              <p><a href="#">Cookie Policy</a></p>
            </div>
            <div>
              <h5>SUPPORT</h5>
              <p><a href="#">Help Center</a></p>
              <p><a href="#">Contact Us</a></p>
            </div>
          </div>
          <p className="pj-footer-copy">© 2024 NEXUS TALENT. THE DIGITAL CURATOR FOR CAREERS.</p>
        </footer>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`pj-toast ${toast.type}`}>
          <span className="pj-toast-icon">
            {toast.type === 'success' ? '✅' : '⚠️'}
          </span>
          <span className="pj-toast-message">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default PostJob;
