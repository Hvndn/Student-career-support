import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { studentApi } from '../../api';
import { getTemplateComponent } from '../../components/student/templates/TemplateRegistry.jsx';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import '../../assets/css/student/CVBuilder.css';

// ─── tiny svg icons ────────────────────────────────────────────────────────
const IcoChevR = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
const IcoPlus = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IcoTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>;
const IcoSave = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const IcoDl = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const IcoBk = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
const IcoEye = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const IcoGear = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;

// ─── section list ──────────────────────────────────────────────────────────
const SECTIONS = [
  { key: 'personal', label: 'Thông tin cá nhân' },
  { key: 'contact', label: 'Liên hệ' },
  { key: 'bio', label: 'Mục tiêu nghề nghiệp' },
  { key: 'educations', label: 'Học vấn' },
  { key: 'experiences', label: 'Kinh nghiệm làm việc' },
  { key: 'projects', label: 'Dự án đã tham gia' },
  { key: 'activities', label: 'Hoạt động' },
  { key: 'certifications', label: 'Chứng chỉ' },
  { key: 'awards', label: 'Danh hiệu và giải thưởng' },
  { key: 'skills', label: 'Kỹ năng' },
  { key: 'interests', label: 'Sở thích' },
];

const COLORS = [
  '#0f409f', '#1d4ed8', '#16a34a', '#f59e0b', '#7c3aed', '#db2777',
  '#0891b2', '#334155', '#052668', '#065f46',
];

const CATS = [
  { key: 'ARTISTIC_1', label: 'Nghệ thuật' },
  { key: 'PRO_1', label: 'Chuyên nghiệp' }
];

// ─── tiny reusable field ───────────────────────────────────────────────────
const F = ({ label, value = '', onChange, multi = false, ph = '' }) => (
  <div className="cvb-f">
    <label className="cvb-fl">{label}</label>
    {multi
      ? <textarea className="cvb-fi" rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={ph} />
      : <input className="cvb-fi" type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={ph} />
    }
  </div>
);

// ─── right panel content per section ──────────────────────────────────────
const Editor = ({ section, cv, setCV, onAvatarClick }) => {
  //key value
  const s = (k, v) => setCV({ ...cv, [k]: v });
  const upItem = (field, i, k, v) => { const a = [...(cv[field] || [])]; a[i] = { ...a[i], [k]: v }; s(field, a); };
  const addItem = (field, blank) => s(field, [...(cv[field] || []), { ...blank, id: Date.now() }]);
  const delItem = (field, i) => { const a = [...(cv[field] || [])]; a.splice(i, 1); s(field, a); };

  if (section === 'personal') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">THÔNG TIN CÁ NHÂN</div>
      {/* avatar preview */}
      <div className="cvb-av-wrap" onClick={onAvatarClick} style={{ cursor: 'pointer' }}>
        <div className="cvb-av-circle">
          {(cv.avatar || cv.avatarUrl)
            ? <img src={cv.avatar || cv.avatarUrl} alt="ava" className="cvb-av-img" />
            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          }
        </div>
        <div className="cvb-av-label">Ảnh đại diện (Click để thay đổi)</div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <button className="cvb-add" style={{ width: '100%', justifyContent: 'center' }} onClick={onAvatarClick}>
          Tải ảnh lên từ máy tính
        </button>
      </div>
      <F label="Họ và Tên" value={cv.fullName} onChange={v => s('fullName', v)} ph="Nguyễn Văn A" />
      <F label="Vị trí ứng tuyển" value={cv.major} onChange={v => s('major', v)} ph="Sinh viên / Designer" />
      <F label="URL ảnh đại diện" value={cv.avatar || cv.avatarUrl} onChange={v => s('avatar', v)} ph="https://example.com/photo.jpg" />
      <F label="Ngày sinh" value={cv.dob} onChange={v => s('dob', v)} ph="01/01/2002" />
      <F label="Giới tính" value={cv.gender} onChange={v => s('gender', v)} ph="Nam / Nữ" />
    </div>
  );

  if (section === 'contact') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">LIÊN HỆ</div>
      <F label="Email" value={cv.email} onChange={v => s('email', v)} ph="email@example.com" />
      <F label="Điện thoại" value={cv.phone} onChange={v => s('phone', v)} ph="0901 234 567" />
      <F label="Địa chỉ" value={cv.address} onChange={v => s('address', v)} ph="Đà Nẵng, Việt Nam" />
      <F label="LinkedIn" value={cv.linkedin} onChange={v => s('linkedin', v)} ph="linkedin.com/in/ten-ban" />
      <F label="GitHub" value={cv.github} onChange={v => s('github', v)} ph="github.com/username" />
      <F label="Website" value={cv.website} onChange={v => s('website', v)} ph="mysite.com" />
    </div>
  );

  if (section === 'bio') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">MỤC TIÊU NGHỀ NGHIỆP</div>
      <p className="cvb-ep-hint">Viết 2–4 câu mô tả định hướng, động lực và giá trị bạn mang lại.</p>
      <F label="Nội dung" value={cv.bio} onChange={v => s('bio', v)} multi ph="Mong muốn tìm kiếm môi trường làm việc chuyên nghiệp để phát triển kỹ năng..." />
    </div>
  );

  if (section === 'educations') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">HỌC VẤN</div>
      {(cv.educations || []).map((e, i) => (
        <div key={e.id || i} className="cvb-card">
          <div className="cvb-card-hd"><span className="cvb-card-num">#{i + 1}</span><button className="cvb-del" onClick={() => delItem('educations', i)}><IcoTrash /></button></div>
          <F label="Tên trường" value={e.schoolName} onChange={v => upItem('educations', i, 'schoolName', v)} ph="Đại học Fivecore" />
          <F label="Chuyên ngành" value={e.major} onChange={v => upItem('educations', i, 'major', v)} ph="Công nghệ thông tin" />
          <F label="Bằng cấp" value={e.degree} onChange={v => upItem('educations', i, 'degree', v)} ph="Cử nhân / Thạc sĩ" />
          <div className="cvb-row2">
            <F label="Bắt đầu" value={e.startDate} onChange={v => upItem('educations', i, 'startDate', v)} ph="09/2021" />
            <F label="Kết thúc" value={e.endDate} onChange={v => upItem('educations', i, 'endDate', v)} ph="06/2025" />
          </div>
          <F label="GPA / Ghi chú" value={e.description} onChange={v => upItem('educations', i, 'description', v)} multi ph="GPA: 3.5/4.0" />
        </div>
      ))}
      <button className="cvb-add" onClick={() => addItem('educations', { schoolName: '', major: '', degree: '', startDate: '', endDate: '', description: '' })}><IcoPlus /> Thêm học vấn</button>
    </div>
  );

  if (section === 'experiences') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">KINH NGHIỆM LÀM VIỆC</div>
      {(cv.experiences || []).map((e, i) => (
        <div key={e.id || i} className="cvb-card">
          <div className="cvb-card-hd"><span className="cvb-card-num">#{i + 1}</span><button className="cvb-del" onClick={() => delItem('experiences', i)}><IcoTrash /></button></div>
          <F label="Vị trí / Chức danh" value={e.jobTitle} onChange={v => upItem('experiences', i, 'jobTitle', v)} ph="Frontend Developer" />
          <F label="Tên công ty" value={e.companyName} onChange={v => upItem('experiences', i, 'companyName', v)} ph="FPT Software" />
          <div className="cvb-row2">
            <F label="Bắt đầu" value={e.startDate} onChange={v => upItem('experiences', i, 'startDate', v)} ph="06/2023" />
            <F label="Kết thúc" value={e.endDate} onChange={v => upItem('experiences', i, 'endDate', v)} ph="Hiện tại" />
          </div>
          <F label="Mô tả công việc" value={e.description} onChange={v => upItem('experiences', i, 'description', v)} multi ph="Phát triển tính năng X, đạt kết quả Y..." />
        </div>
      ))}
      <button className="cvb-add" onClick={() => addItem('experiences', { jobTitle: '', companyName: '', startDate: '', endDate: 'Hiện tại', description: '' })}><IcoPlus /> Thêm kinh nghiệm</button>
    </div>
  );

  if (section === 'projects') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">DỰ ÁN ĐÃ THAM GIA</div>
      {(cv.projects || []).map((p, i) => (
        <div key={p.id || i} className="cvb-card">
          <div className="cvb-card-hd"><span className="cvb-card-num">#{i + 1}</span><button className="cvb-del" onClick={() => delItem('projects', i)}><IcoTrash /></button></div>
          <F label="Tên dự án" value={p.name || p.title || ''} onChange={v => upItem('projects', i, 'name', v)} ph="Hệ thống quản lý sinh viên" />
          <F label="Vai trò" value={p.role || ''} onChange={v => upItem('projects', i, 'role', v)} ph="Frontend Developer / Leader" />
          <div className="cvb-f">
            <label className="cvb-fl">Bắt đầu</label>
            <input className="cvb-fi" type="month"
              value={p.startDate ? (p.startDate.includes('-') ? p.startDate : (() => { const [m, y] = (p.startDate || '').split('/'); return y && m ? `${y}-${m.padStart(2, '0')}` : '' })()) : ''}
              onChange={e => { const [y, m] = e.target.value.split('-'); upItem('projects', i, 'startDate', e.target.value ? `${m}/${y}` : ''); }}
            />
          </div>
          <div className="cvb-f">
            <label className="cvb-fl">Kết thúc</label>
            <input className="cvb-fi" type="month"
              disabled={p.endDate === 'Nay'}
              value={(!p.endDate || p.endDate === 'Nay') ? '' : (p.endDate.includes('-') ? p.endDate : (() => { const [m, y] = (p.endDate || '').split('/'); return y && m ? `${y}-${m.padStart(2, '0')}` : '' })())}
              onChange={e => { const [y, m] = e.target.value.split('-'); upItem('projects', i, 'endDate', e.target.value ? `${m}/${y}` : ''); }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: '#64748b', cursor: 'pointer', marginTop: '4px' }}>
              <input type="checkbox" checked={p.endDate === 'Nay'} onChange={e => upItem('projects', i, 'endDate', e.target.checked ? 'Nay' : '')} />
              Hiện tại (Nay)
            </label>
          </div>
          <F label="Công nghệ" value={p.technologies || p.techStack || ''} onChange={v => upItem('projects', i, 'technologies', v)} ph="React, Spring Boot, MySQL" />
          <F label="Link GitHub" value={p.repositoryUrl || ''} onChange={v => upItem('projects', i, 'repositoryUrl', v)} ph="https://github.com/user/repo" />
          <F label="Link Demo" value={p.demoUrl || ''} onChange={v => upItem('projects', i, 'demoUrl', v)} ph="https://demo.example.com" />
          <F label="Mô tả dự án" value={p.description || p.responsibilities || ''} onChange={v => upItem('projects', i, 'description', v)} multi ph="Mô tả chức năng, kết quả đạt được..." />
        </div>
      ))}
      <button className="cvb-add" onClick={() => addItem('projects', { name: '', role: '', startDate: '', endDate: '', technologies: '', repositoryUrl: '', demoUrl: '', description: '' })}><IcoPlus /> Thêm dự án</button>
    </div>
  );

  if (section === 'activities') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">HOẠT ĐỘNG</div>
      {(cv.activities || []).map((a, i) => (
        <div key={a.id || i} className="cvb-card">
          <div className="cvb-card-hd"><span className="cvb-card-num">#{i + 1}</span><button className="cvb-del" onClick={() => delItem('activities', i)}><IcoTrash /></button></div>
          <F label="Tên hoạt động" value={a.name} onChange={v => upItem('activities', i, 'name', v)} ph="Tình nguyện viên / CLB Robotics" />
          <F label="Tổ chức" value={a.organization} onChange={v => upItem('activities', i, 'organization', v)} ph="Hội Sinh viên Đà Nẵng" />
          <F label="Vai trò" value={a.role} onChange={v => upItem('activities', i, 'role', v)} ph="Trưởng ban / Thành viên" />
          <div className="cvb-row2">
            <F label="Bắt đầu" value={a.startDate} onChange={v => upItem('activities', i, 'startDate', v)} ph="07/2022" />
            <F label="Kết thúc" value={a.endDate} onChange={v => upItem('activities', i, 'endDate', v)} ph="Hiện tại" />
          </div>
          <F label="Mô tả" value={a.description} onChange={v => upItem('activities', i, 'description', v)} multi ph="Tham gia tổ chức sự kiện..." />
        </div>
      ))}
      <button className="cvb-add" onClick={() => addItem('activities', { name: '', organization: '', role: '', startDate: '', endDate: '', description: '' })}><IcoPlus /> Thêm hoạt động</button>
    </div>
  );

  if (section === 'certifications') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">CHỨNG CHỈ</div>
      {(cv.certifications || []).map((c, i) => (
        <div key={c.id || i} className="cvb-card">
          <div className="cvb-card-hd"><span className="cvb-card-num">#{i + 1}</span><button className="cvb-del" onClick={() => delItem('certifications', i)}><IcoTrash /></button></div>
          <F label="Tên chứng chỉ" value={c.name} onChange={v => upItem('certifications', i, 'name', v)} ph="IELTS 7.0 / AWS SAA" />
          <F label="Đơn vị cấp" value={c.issuer} onChange={v => upItem('certifications', i, 'issuer', v)} ph="Coursera / AWS / TOEIC" />
          <div className="cvb-row2">
            <F label="Ngày cấp" value={c.issueDate} onChange={v => upItem('certifications', i, 'issueDate', v)} ph="05/2024" />
            <F label="Hết hạn" value={c.expirationDate} onChange={v => upItem('certifications', i, 'expirationDate', v)} ph="Vĩnh viễn" />
          </div>
          <F label="Link chứng chỉ" value={c.certificateUrl} onChange={v => upItem('certifications', i, 'certificateUrl', v)} ph="https://..." />
        </div>
      ))}
      <button className="cvb-add" onClick={() => addItem('certifications', { name: '', issuer: '', issueDate: '', expirationDate: '', certificateUrl: '' })}><IcoPlus /> Thêm chứng chỉ</button>
    </div>
  );

  if (section === 'awards') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">DANH HIỆU VÀ GIẢI THƯỞNG</div>
      {(cv.awards || []).map((a, i) => (
        <div key={a.id || i} className="cvb-card">
          <div className="cvb-card-hd"><span className="cvb-card-num">#{i + 1}</span><button className="cvb-del" onClick={() => delItem('awards', i)}><IcoTrash /></button></div>
          <F label="Tên danh hiệu" value={a.name} onChange={v => upItem('awards', i, 'name', v)} ph="Top 5 Chiến dịch Content..." />
          <F label="Năm / Thời gian" value={a.time} onChange={v => upItem('awards', i, 'time', v)} ph="2022" />
          <F label="Mô tả ngắn" value={a.description} onChange={v => upItem('awards', i, 'description', v)} multi ph="Giải thưởng do khoa/công ty trao tặng..." />
        </div>
      ))}
      <button className="cvb-add" onClick={() => addItem('awards', { name: '', time: '', description: '' })}><IcoPlus /> Thêm giải thưởng</button>
    </div>
  );

  if (section === 'skills') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">KỸ NĂNG</div>
      <p className="cvb-ep-hint">Thêm kỹ năng và chọn mức độ thành thạo.</p>
      <div className="cvb-skills-list">
        {(cv.skills || []).map((sk, i) => (
          <div key={sk.id || i} className="cvb-sk-row">
            <input className="cvb-fi cvb-sk-name" value={sk.name || sk.skillName || ''} onChange={e => upItem('skills', i, 'name', e.target.value)} placeholder="Tên kỹ năng (Java, Figma...)" />
            <select className="cvb-fi cvb-sk-lvl" value={sk.level || 'Intermediate'} onChange={e => upItem('skills', i, 'level', e.target.value)}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
            <button className="cvb-del" onClick={() => delItem('skills', i)}><IcoTrash /></button>
          </div>
        ))}
      </div>
      <button className="cvb-add" onClick={() => addItem('skills', { name: '', level: 'Intermediate' })}><IcoPlus /> Thêm thẻ kỹ năng</button>
    </div>
  );

  if (section === 'interests') return (
    <div className="cvb-ep">
      <div className="cvb-ep-title">SỞ THÍCH</div>
      <p className="cvb-ep-hint">Thêm các sở thích cá nhân để nhà tuyển dụng hiểu hơn về con người bạn.</p>
      <div className="cvb-skills-list">
        {(cv.interests || []).map((it, i) => (
          <div key={i} className="cvb-sk-row">
            <input className="cvb-fi" value={it || ''} onChange={e => {
              const a = [...(cv.interests || [])]; a[i] = e.target.value; s('interests', a);
            }} placeholder="Đọc sách, Chạy bộ..." />
            <button className="cvb-del" onClick={() => {
              const a = [...(cv.interests || [])]; a.splice(i, 1); s('interests', a);
            }}><IcoTrash /></button>
          </div>
        ))}
      </div>
      <button className="cvb-add" onClick={() => s('interests', [...(cv.interests || []), ''])}><IcoPlus /> Thêm sở thích</button>
    </div>
  );

  return null;
};

// ─── main component ────────────────────────────────────────────────────────
const CVBuilder = ({ initialData = null, readOnly = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const layoutParam = searchParams.get('layout');

  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(75);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [cvName, setCvName] = useState('CV MỚI CỦA TÔI');
  const [editingTitle, setEditingTitle] = useState(false);
  const avatarInputRef = useRef(null);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Starting upload for:", file.name);

    const formData = new FormData();
    formData.append('avatarFile', file);

    const loadingToast = toast.loading('Đang gửi ảnh lên...');
    try {
      const res = await studentApi.updateAvatar(formData);
      if (res.data?.status === 'success' || res.data?.success) {
        let newUrl = res.data.data;
        // Nếu là đường dẫn tương đối, đảm bảo có thể hiển thị được
        if (newUrl && newUrl.startsWith('/') && !newUrl.startsWith('http')) {
          // Giữ nguyên để proxy xử lý, hoặc thêm host nếu cần debug
          console.log("Avatar relative path detected:", newUrl);
        }
        setCV(prev => ({ ...prev, avatar: newUrl, avatarUrl: newUrl }));
        toast.success('Cập nhật ảnh đại diện thành công!', { id: loadingToast });
      } else {
        toast.error(res.data?.message || 'Lỗi từ máy chủ', { id: loadingToast });
      }
    } catch (error) {
      console.error('Upload error details:', error);
      const msg = error.response?.data?.message || error.message || 'Lỗi kết nối!';
      toast.error('Lỗi hệ thống: ' + msg, { id: loadingToast });
    }
  };

  // Fix: nếu id === 'new', sinh UUID mới và redirect để tránh xung đột localStorage
  useEffect(() => {
    if (id && !cv && !loading) {
      const newId = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      navigate(`/student/cv-builder/${newId}?${searchParams.toString()}`, { replace: true });
    }
  }, [id, cv, loading, navigate, searchParams]);

  useEffect(() => {
    if (id && searchParams.get('action') === 'download' && !loading && cv) {
      const timer = setTimeout(() => {
        handlePDF();
        // Xoá action sau khi trigger để không lặp lại
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('action');
        navigate(`${window.location.pathname}?${newParams.toString()}`, { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [id, searchParams, loading, cv]);

  useEffect(() => {
    if (initialData) {
      setCV(initialData);
      if (initialData._name) setCvName(initialData._name);
      setLoading(false);
      return;
    }

    studentApi.getProfile()
      .then(res => {
        const d = res.data?.data || {};
        const dbCv = d.cvData ? JSON.parse(d.cvData) : null;
        const cached = localStorage.getItem(`dau_cv_${id}`);

        let initialCV = null;

        if (cached) {
          // 1. Ưu tiên dữ liệu từ localStorage nếu đang edit chính CV đó
          initialCV = JSON.parse(cached);
        } else if (dbCv && dbCv.id === id) {
          // 2. Nếu không có cache, dùng dữ liệu từ DB nếu ID trùng khớp
          initialCV = dbCv;
        } else {
          // 3. Tạo mới hoàn toàn dựa trên Profile và mẫu dữ liệu (Sample Data)
          initialCV = {
            fullName: d.fullName || 'NGUYỄN VĂN A',
            major: d.major || 'Frontend Developer',
            email: d.email || 'nguyenvana@gmail.com',
            phone: d.phone || '0901 234 567',
            address: d.address || 'Hải Châu, Đà Nẵng',
            bio: d.bio || 'Tôi là một lập trình viên nhiệt huyết với đam mê tạo ra những trải nghiệm người dùng tuyệt vời. Mong muốn tìm kiếm cơ hội học hỏi và đóng góp cho các dự án sáng tạo.',
            avatar: d.avatarUrl || '',
            avatarUrl: d.avatarUrl || '',
            dob: '01/01/2000',
            gender: 'Nam',
            linkedin: 'linkedin.com/in/nguyenvana',
            github: 'github.com/nguyenvana',
            website: 'myportfolio.com',
            educations: d.educations?.length ? d.educations : [
              { id: 1, schoolName: 'ĐẠI HỌC FIVECORE', major: 'Công nghệ thông tin', degree: 'Cử nhân', startDate: '10/2018', endDate: '06/2022', description: 'Tốt nghiệp loại Giỏi, GPA 3.6/4.0' }
            ],
            experiences: d.experiences?.length ? d.experiences : [
              { id: 1, companyName: 'CÔNG TY CÔNG NGHỆ ABC', jobTitle: 'Thực tập sinh Frontend', startDate: '03/2022', endDate: 'Hiện tại', description: '- Hỗ trợ phát triển giao diện người dùng bằng ReactJS.\n- Phối hợp với team thiết kế để tối ưu hóa trải nghiệm người dùng.' }
            ],
            skills: d.skills?.length ? d.skills : [
              { id: 1, name: 'HTML/CSS/JS', level: 'Advanced' },
              { id: 2, name: 'ReactJS', level: 'Intermediate' },
              { id: 3, name: 'Thiết kế UI/UX', level: 'Intermediate' }
            ],
            certifications: d.certifications?.length ? d.certifications : [
              { id: 1, name: 'TOEIC - 800', issuer: 'IIG Việt Nam', issueDate: '2023', expirationDate: '2025', certificateUrl: '' }
            ],
            awards: [
              { id: 1, name: 'Sinh viên tiêu biểu năm 2021', time: '2021', description: 'Đạt thành tích xuất sắc trong học tập và rèn luyện.' }
            ],
            projects: [],
            activities: [
              { id: 1, name: 'Tình nguyện viên Mùa hè xanh', organization: 'Hội sinh viên', role: 'Thành viên', startDate: '07/2021', endDate: '08/2021', description: 'Tham gia hỗ trợ cộng đồng tại các vùng sâu vùng xa.' }
            ],
            interests: ['Đọc sách', 'Bơi lội', 'Chụp ảnh'],
            layoutKey: layoutParam || 'MODERN_1',
            themeColor: '#0f409f',
          };
        }

        // Nếu có layoutParam từ URL (vừa chọn mẫu), thì ghi đè layoutKey
        if (layoutParam) {
          initialCV.layoutKey = layoutParam;
        }

        setCV(initialCV);
        if (initialCV._name) setCvName(initialCV._name);
        else setCvName('CV MỚI CỦA TÔI');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, layoutParam]);

  const handleSave = async () => {
    if (!cv) return;
    const toastId = toast.loading('Đang lưu CV và tạo ảnh bìa...');
    //html2canvas 
    let thumbnail = cv.thumbnail;
    try {
      const el = document.querySelector('.cvb-canvas-inner');
      if (el) {
        // Đợi 500ms để đảm bảo layout & fonts render xong
        await new Promise(r => setTimeout(r, 500));

        const canvas = await html2canvas(el, {
          scale: 0.8,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const thumbCanvas = document.createElement('canvas');
        const width = 280;
        const height = (canvas.height / canvas.width) * width;
        thumbCanvas.width = width;
        thumbCanvas.height = height;
        const ctx = thumbCanvas.getContext('2d');
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(canvas, 0, 0, width, height);

        thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.6);
      }
    } catch (err) {
      console.warn("Failed to generate thumbnail:", err);
    }

    const saveData = { ...cv, thumbnail, _name: cvName, _updatedAt: new Date().toISOString() };

    // Save to Database
    try {
      await studentApi.updateProfile({ cvData: JSON.stringify(saveData) });
    } catch (dbErr) {
      console.error("Failed to save CV to database:", dbErr);
    }

    localStorage.setItem(`dau_cv_${id}`, JSON.stringify(saveData));
    setCV(saveData);
    toast.success('Đã lưu CV thành công!', { id: toastId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handlePDF = async () => {
    // Lưu trước khi xuất PDF (đợi lưu xong ảnh bìa)
    await handleSave();

    const el = document.querySelector('.cvb-canvas-inner > div');
    if (!el) { alert('Không tìm thấy nội dung CV để xuất!'); return; }

    html2pdf().set({
      margin: 0,
      filename: `CV_${(cv.fullName || 'CV').replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).from(el).save();
  };

  if (loading || !cv) return (
    <div className="cvb-loading">
      <div className="cvb-spin" /><p>Đang khởi tạo trình tạo CV...</p>
    </div>
  );
  //lấy mẫu CV từ registry
  const Template = getTemplateComponent(cv.layoutKey || 'MODERN_1');
  const hasContent = (key) => {
    if (['personal', 'contact', 'bio'].includes(key)) return !!(cv.fullName || cv.email || cv.bio);
    return (cv[key] || []).length > 0;
  };

  return (
    <div className="cvb-wrap">

      {/* ── HEADER ── */}
      {!readOnly && (
        <header className="cvb-header">
        <div className="cvb-header-l">
          <button className="cvb-back" onClick={() => navigate(-1)}><IcoBk /></button>
          <div>
            {editingTitle
              ? <input autoFocus className="cvb-title-inp"
                value={cvName} onChange={e => setCvName(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)} />
              : <div className="cvb-title" onClick={() => setEditingTitle(true)}>{cvName}</div>
            }
            <div className="cvb-brand">FiveCore CAREER BUILDER</div>
          </div>
        </div>
        <div className="cvb-header-r">
          <button className="cvb-hbtn cvb-hbtn-ghost"><IcoEye /> CV Online</button>
          <button className="cvb-hbtn cvb-hbtn-dark" onClick={handleSave}>
            <IcoSave />
            {saved ? 'Đã lưu ✓' : 'Lưu'}
          </button>
          <button className="cvb-hbtn cvb-hbtn-red" onClick={async () => { await handleSave(); navigate(-1); }}>
            <IcoDl /> Lưu &amp; Thoát
          </button>
        </div>
      </header>
      )}

      <div className={`cvb-body ${readOnly ? 'cvb-readonly' : ''}`}>

        {/* ── LEFT SIDEBAR ── */}
        {!readOnly && (
          <aside className="cvb-left">
          <div className="cvb-sv-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            CẤU TRÚC CV
          </div>

          <div className="cvb-nav">
            {SECTIONS.map(sec => (
              <button
                key={sec.key}
                className={`cvb-nav-item ${activeSection === sec.key ? 'active' : ''}`}
                onClick={() => setActiveSection(sec.key)}
              >
                <span className="cvb-nav-text">{sec.label}</span>
                <span className={`cvb-nav-dot ${hasContent(sec.key) ? 'has' : ''}`} />
                <span className="cvb-nav-arr"><IcoChevR /></span>
              </button>
            ))}
          </div>

          {/* drag handle hider */}
          <div className="cvb-nav-scroll-fade" />

          <div className="cvb-sv-label" style={{ marginTop: '4px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            GIAO DIỆN
          </div>

          <div className="cvb-design">
            <p className="cvb-dl">Màu thương hiệu</p>
            <div className="cvb-colors">
              {COLORS.map(c => (
                <button key={c} className={`cvb-col ${cv.themeColor === c ? 'on' : ''}`}
                  style={{ background: c }} onClick={() => setCV({ ...cv, themeColor: c })} />
              ))}
            </div>
            <p className="cvb-dl" style={{ marginTop: '14px' }}>Danh mục mẫu CV</p>
            <div className="cvb-cats">
              {CATS.map(cat => (
                <button key={cat.key} className={`cvb-cat ${cv.layoutKey === cat.key ? 'on' : ''}`}
                  onClick={() => setCV({ ...cv, layoutKey: cat.key })}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
        )}

        {/* ── CENTER CANVAS ── */}
        <main className="cvb-canvas">
          <div className="cvb-canvas-scroll">
            <div className="cvb-canvas-inner" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
              <Template
                profile={cv} cvData={cv}
                isEditMode={!readOnly}
                onUpdate={(d)=>!readOnly && setCV(d)}
                themeColor={cv.themeColor||'#0f409f'}
                onSectionClick={!readOnly ? setActiveSection : undefined}
                onAvatarClick={() => !readOnly && avatarInputRef.current?.click()}
              />
            </div>
          </div>

          {/* zoom bar */}
          <div className="cvb-zoom">
            <button className="cvb-zb" onClick={() => setZoom(z => Math.max(40, z - 5))}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </button>
            <span className="cvb-zv">—</span>
            <span className="cvb-zval">{zoom}%</span>
            <span className="cvb-zv">—</span>
            <button className="cvb-zb" onClick={() => setZoom(z => Math.min(130, z + 5))}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            </button>
            <button className="cvb-zfit" onClick={() => setZoom(75)}>⊡</button>
          </div>
        </main>

        {/* ── RIGHT EDITOR ── */}
        {!readOnly && (
          <aside className="cvb-right">
            <div className="cvb-right-hd">
              <span className="cvb-right-icon"><IcoGear/></span>
              <div>
                <div className="cvb-right-label">TRÌNH CHỈNH SỬA</div>
                <div className="cvb-right-sec">{SECTIONS.find(s=>s.key===activeSection)?.label}</div>
              </div>
            </div>
            <div className="cvb-right-body">
              <Editor section={activeSection} cv={cv} setCV={setCV} onAvatarClick={() => avatarInputRef.current?.click()}/>
            </div>
          </aside>
        )}

      </div>

      {/* Hidden Avatar Input */}
      <input
        type="file"
        ref={avatarInputRef}
        hidden
        accept="image/*"
        onChange={handleAvatarFileChange}
      />
    </div>
  );
};

export default CVBuilder;
