import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import CompanySidebar from '../components/CompanySidebar';
import CompanyTopbar from '../components/CompanyTopbar';
import RichTextEditor from '../components/RichTextEditor';
import { companyApi } from '../api';
import './PostJob.css';

const INDUSTRIES = ['Công nghệ thông tin', 'Marketing', 'Tài chính', 'Thiết kế', 'Kế toán/Kiểm toán', 'Giáo dục/Đào tạo', 'Y tế/Dược', 'Kinh doanh/Bán hàng', 'Hành chính/Nhân sự', 'Xây dựng', 'Kiến trúc/Nội thất', 'Du lịch/Nhà hàng', 'Sản xuất/Vận hành'];
const LEVELS = ['Thực tập sinh', 'Nhân viên', 'Trưởng nhóm', 'Phó phòng', 'Trưởng phòng', 'Giám đốc', 'Tổng giám đốc/Điều hành'];
const EXPERIENCES = ['Chưa có kinh nghiệm', 'Dưới 1 năm', '1 năm', '2 năm', '3 năm', '4 năm', '5 năm', 'Trên 5 năm'];
const QUALIFICATIONS = ['Không yêu cầu', 'Trung học', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Sau đại học'];
const REGIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Đồng Nai', 'Bắc Ninh', 'Long An'];
const JOB_TYPES = [
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' },
    { value: 'intern', label: 'Thực tập' },
    { value: 'remote', label: 'Từ xa' },
    { value: 'freelance', label: 'Hợp đồng' }
];
const GENDERS = ['Không yêu cầu', 'Nam', 'Nữ'];
const SKILLS_LIST = ['ReactJS', 'NodeJS', 'Java', 'Python', 'Figma', 'UI/UX', 'Marketing', 'English', 'SQL', 'Docker', 'AWS', 'Kubernetes'];

const PostJob = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loadingJob, setLoadingJob] = useState(!!id);
    const [form, setForm] = useState({
        title: '',
        industry: '',
        level: '',
        jobType: 'fulltime',
        quantity: '1',
        gender: 'Không yêu cầu',
        experience: '',
        qualification: 'Đại học',
        minSalary: '',
        maxSalary: '',
        salaryType: 'range', // range, agreement
        region: '',
        location: '',
        description: '',
        requirements: '',
        benefits: '',
        deadline: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    React.useEffect(() => {
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoadingJob(true);
            const response = await companyApi.getJobDetailsForEdit(id);
            if (response.data.status === 'success' && response.data.data) {
                const job = response.data.data;
                setForm({
                    title: job.title || '',
                    industry: job.industry || '',
                    level: job.level || '',
                    jobType: (job.jobType || 'fulltime').toLowerCase(),
                    quantity: String(job.quantity || 1),
                    gender: job.gender || 'Không yêu cầu',
                    experience: job.experience || '',
                    qualification: job.qualification || 'Đại học',
                    minSalary: job.minSalary || '',
                    maxSalary: job.maxSalary || '',
                    salaryType: job.salaryType || 'range',
                    region: job.region || '',
                    location: job.location || '',
                    description: job.description || '',
                    requirements: job.requirements || '',
                    benefits: job.benefits || '',
                    deadline: job.deadline || '',
                    contactName: job.contactName || '',
                    contactEmail: job.contactEmail || '',
                    contactPhone: job.contactPhone || '',
                });
                if (Array.isArray(job.skills)) {
                    setSelectedSkills(job.skills);
                }
            } else {
                showToast(response.data.message || 'Không thể tải thông tin tin đăng', 'error');
            }
        } catch (err) {
            console.error('Fetch job error:', err);
            showToast('Lỗi khi tải thông tin tin đăng. Vui lòng kiểm tra quyền truy cập!', 'error');
        } finally {
            setLoadingJob(false);
        }
    };

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    };

    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSkillToggle = (skill) => {
        if (!selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        } else {
            setSelectedSkills(selectedSkills.filter(s => s !== skill));
        }
    };

    const handleSkillAdd = () => {
        const val = skillInput.trim();
        if (val && !selectedSkills.includes(val)) {
            setSelectedSkills([...selectedSkills, val]);
        }
        setSkillInput('');
    };

    const handleSkillRemove = (skill) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skill));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleSkillAdd();
        }
    };

    const handleSubmit = async (draft = false) => {
        // Ràng buộc ngày hạn chót không được trước ngày đăng (hôm nay)
        if (form.deadline) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const deadlineDate = new Date(form.deadline);
            if (deadlineDate < today) {
                showToast('Ngày hạn chót không thể trước ngày hôm nay!', 'error');
                return;
            }
        }

        if (!draft) {
            const required = ['title', 'industry', 'level', 'experience', 'region', 'location', 'description', 'requirements', 'deadline'];
            const missing = required.filter(k => !form[k]);
            if (missing.length > 0) {
                showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'error');
                return;
            }
        }

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                quantity: form.quantity ? parseInt(form.quantity) : 1,
                minSalary: form.salaryType === 'agreement' ? null : (form.minSalary ? parseFloat(form.minSalary) : null),
                maxSalary: form.salaryType === 'agreement' ? null : (form.maxSalary ? parseFloat(form.maxSalary) : null),
                skills: selectedSkills,
                status: draft ? 'draft' : 'pending'
            };

            const response = id 
                ? await companyApi.updateJob(id, payload)
                : await companyApi.postJob(payload);

            if (response.data.status === 'success') {
                showToast(id ? 'Cập nhật tin tuyển dụng thành công!' : (draft ? 'Đã lưu nháp thành công!' : 'Đã đăng tin thành công!'), 'success');
                setTimeout(() => navigate('/company/management'), 1500);
            } else {
                showToast(response.data.message || 'Thao tác thất bại', 'error');
            }
        } catch (err) {
            console.error('Submit error:', err);
            showToast(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const matchScore = (form.title && stripHtml(form.description).length > 50 && stripHtml(form.requirements).length > 50 && selectedSkills.length >= 3) ? 95 : form.title ? 65 : 35;
    const matchLabel = matchScore >= 80 ? 'Rất tiềm năng' : matchScore >= 60 ? 'Tiềm năng' : 'Cần cải thiện';
    const matchColor = matchScore >= 80 ? '#2563eb' : matchScore >= 60 ? '#f59e0b' : '#ef4444';

    if (loadingJob) {
        return (
            <div className="company-dashboard-container">
                <CompanySidebar />
                <div className="company-main-content">
                    <CompanyTopbar />
                    <main className="cd-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <div className="loading-spinner"></div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="pj-layout">
            <CompanySidebar />
            <div className="pj-main">
                <CompanyTopbar activeTab="Jobs" />

                <div className="pj-header-container">
                    <header className="pj-page-header">
                        <p className="pj-breadcrumb">
                            <Link to="/company/management">QUẢN LÝ TIN ĐĂNG</Link>
                            <span className="separator">/</span>
                            <span className="active-crumb">{id ? 'CHỈNH SỬA TIN' : 'TẠO TIN MỚI'}</span>
                        </p>
                        <h1 className="pj-title">{id ? 'Chỉnh sửa Tin Tuyển Dụng' : 'Đăng Tin Tuyển Dụng'}</h1>
                        <p className="pj-subtitle">Vui lòng cập nhật đầy đủ thông tin để thu hút các ứng viên tiềm năng.</p>
                    </header>
                </div>

                <div className="pj-body">
                    <div className="pj-col-form">
                        {/* Section 1: Thông tin chung */}
                        <div className="pj-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="pj-card-title">
                                <span className="pj-card-icon blue">1</span>
                                Thông tin cơ bản
                            </div>
                            
                            <div className="pj-field">
                                <label>TIÊU ĐỀ CÔNG VIỆC <span className="text-red-500">*</span></label>
                                <input
                                    className="pj-input"
                                    placeholder="Vd: Senior Java Developer (Spring Boot)"
                                    value={form.title}
                                    onChange={e => handleChange('title', e.target.value)}
                                />
                            </div>

                            <div className="pj-row-3">
                                <div className="pj-field">
                                    <label>NGÀNH NGHỀ <span className="text-red-500">*</span></label>
                                    <select className="pj-select" value={form.industry} onChange={e => handleChange('industry', e.target.value)}>
                                        <option value="">Chọn ngành nghề</option>
                                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                    </select>
                                </div>
                                <div className="pj-field">
                                    <label>CẤP BẬC <span className="text-red-500">*</span></label>
                                    <select className="pj-select" value={form.level} onChange={e => handleChange('level', e.target.value)}>
                                        <option value="">Chọn cấp bậc</option>
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="pj-field">
                                    <label>HÌNH THỨC <span className="text-red-500">*</span></label>
                                    <select className="pj-select" value={form.jobType} onChange={e => handleChange('jobType', e.target.value)}>
                                        {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pj-row-2">
                                <div className="pj-field">
                                    <label>SỐ LƯỢNG TUYỂN</label>
                                    <input type="number" className="pj-input" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} />
                                </div>
                                <div className="pj-field">
                                    <label>GIỚI TÍNH</label>
                                    <select className="pj-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Yêu cầu & Kỹ năng */}
                        <div className="pj-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="pj-card-title">
                                <span className="pj-card-icon amber">2</span>
                                Yêu cầu chuyên môn
                            </div>
                            <div className="pj-row-2">
                                <div className="pj-field">
                                    <label>KINH NGHIỆM <span className="text-red-500">*</span></label>
                                    <select className="pj-select" value={form.experience} onChange={e => handleChange('experience', e.target.value)}>
                                        <option value="">Chọn kinh nghiệm</option>
                                        {EXPERIENCES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                                    </select>
                                </div>
                                <div className="pj-field">
                                    <label>BẰNG CẤP</label>
                                    <select className="pj-select" value={form.qualification} onChange={e => handleChange('qualification', e.target.value)}>
                                        {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pj-field">
                                <label>KỸ NĂNG TRỌNG TÂM (NHẬP TAY HOẶC CHỌN MẪU)</label>
                                
                                <div className="pj-tags-input-container shadow-inner">
                                    <div className="pj-tags-list">
                                        {selectedSkills.map(skill => (
                                            <span key={skill} className="pj-tag-chip">
                                                {skill}
                                                <button type="button" onClick={() => handleSkillRemove(skill)} className="pj-tag-remove">×</button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        className="pj-tag-input" 
                                        placeholder="Nhập kỹ năng và nhấn Enter..." 
                                        value={skillInput}
                                        onChange={e => setSkillInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onBlur={handleSkillAdd}
                                    />
                                </div>

                                <div className="pj-skills-suggestions mt-4">
                                    <p className="text-sm text-slate-500 mb-2 font-medium">✨ GỢI Ý CHO BẠN:</p>
                                    <div className="pj-skills-selector">
                                        {SKILLS_LIST.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => handleSkillToggle(skill)}
                                                className={`pj-skill-btn ${selectedSkills.includes(skill) ? 'active' : ''}`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Lương & Địa điểm */}
                        <div className="pj-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="pj-card-title">
                                <span className="pj-card-icon emerald">3</span>
                                Lương & Địa điểm
                            </div>
                            
                            <div className="pj-field">
                                <label>MỨC LƯƠNG</label>
                                <div className="pj-salary-options">
                                    <label className="pj-radio-group">
                                        <input
                                            type="radio"
                                            checked={form.salaryType === 'range'}
                                            onChange={() => handleChange('salaryType', 'range')}
                                        />
                                        <span>KHOẢNG LƯƠNG</span>
                                    </label>
                                    <label className="pj-radio-group">
                                        <input
                                            type="radio"
                                            checked={form.salaryType === 'agreement'}
                                            onChange={() => handleChange('salaryType', 'agreement')}
                                        />
                                        <span>THỎA THUẬN</span>
                                    </label>
                                </div>
                            </div>

                            {form.salaryType === 'range' && (
                                <div className="pj-row-2 animate-fade-in">
                                    <div className="pj-field">
                                        <label>TỪ (TRIỆU VNĐ)</label>
                                        <input type="number" className="pj-input" placeholder="Vd: 15" value={form.minSalary} onChange={e => handleChange('minSalary', e.target.value)} />
                                    </div>
                                    <div className="pj-field">
                                        <label>ĐẾN (TRIỆU VNĐ)</label>
                                        <input type="number" className="pj-input" placeholder="Vd: 25" value={form.maxSalary} onChange={e => handleChange('maxSalary', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            <div className="pj-row-2">
                                <div className="pj-field">
                                    <label>TỈNH / THÀNH PHỐ <span className="text-red-500">*</span></label>
                                    <select className="pj-select" value={form.region} onChange={e => handleChange('region', e.target.value)}>
                                        <option value="">Chọn khu vực</option>
                                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="pj-field">
                                    <label>ĐỊA CHỈ CHI TIẾT <span className="text-red-500">*</span></label>
                                    <input className="pj-input" placeholder="Vd: 123 Duy Tân, Cầu Giấy" value={form.location} onChange={e => handleChange('location', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Mô tả */}
                        <div className="pj-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="pj-card-title">
                                <span className="pj-card-icon purple">4</span>
                                Nội dung tuyển dụng
                            </div>

                            <div className="pj-field">
                                <label>MÔ TẢ CÔNG VIỆC <span className="text-red-500">*</span></label>
                                <RichTextEditor 
                                    value={form.description} 
                                    onChange={val => handleChange('description', val)}
                                    placeholder="Nhập trách nhiệm và công việc hàng ngày..."
                                />
                            </div>

                            <div className="pj-field">
                                <label>YÊU CẦU ỨNG VIÊN <span className="text-red-500">*</span></label>
                                <RichTextEditor 
                                    value={form.requirements} 
                                    onChange={val => handleChange('requirements', val)}
                                    placeholder="Kỹ năng chuyên môn, công cụ sử dụng..."
                                />
                            </div>

                            <div className="pj-field">
                                <label>QUYỀN LỢI ĐƯỢC HƯỞNG</label>
                                <RichTextEditor 
                                    value={form.benefits} 
                                    onChange={val => handleChange('benefits', val)}
                                    placeholder="Bảo hiểm, du lịch, thưởng..."
                                />
                            </div>
                        </div>

                        {/* Section 5: Liên hệ */}
                        <div className="pj-card shadow-sm hover:shadow-md transition-shadow">
                            <div className="pj-card-title">
                                <span className="pj-card-icon rose">5</span>
                                Thông tin nhận hồ sơ
                            </div>
                            <div className="pj-row-2">
                                <div className="pj-field">
                                    <label>HẠN CHÓT NỘP <span className="text-red-500">*</span></label>
                                    <input type="date" className="pj-input" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} />
                                </div>
                                <div className="pj-field">
                                    <label>NGƯỜI LIÊN HỆ</label>
                                    <input className="pj-input" value={form.contactName} onChange={e => handleChange('contactName', e.target.value)} />
                                </div>
                            </div>
                            <div className="pj-row-2">
                                <div className="pj-field">
                                    <label>EMAIL LIÊN HỆ</label>
                                    <input type="email" className="pj-input" value={form.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} />
                                </div>
                                <div className="pj-field">
                                    <label>SỐ ĐIỆN THOẠI</label>
                                    <input className="pj-input" value={form.contactPhone} onChange={e => handleChange('contactPhone', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="pj-bottom-actions pb-12">
                            <button className="pj-btn-draft" onClick={() => handleSubmit(true)} disabled={submitting}>Lưu bản nháp</button>
                            <button className="pj-btn-publish" onClick={() => handleSubmit(false)} disabled={submitting}>
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang xử lý...
                                    </span>
                                ) : 'Đăng tuyển ngay'}
                            </button>
                        </div>
                    </div>

                    <div className="pj-col-side">
                        <div className="pj-card pj-preview-card">
                            <div className="pj-preview-header">
                                <h3>
                                    <span className="icon">🎯</span> Xem trước nhanh
                                </h3>
                                <span className="pj-badge-live">Live</span>
                            </div>

                            <div className="pj-preview-content">
                                <div className="pj-preview-job-box">
                                    <div className="pj-preview-emp-logo">
                                        {form.title ? form.title.charAt(0).toUpperCase() : 'J'}
                                    </div>
                                    <div style={{ marginTop: '0.75rem' }}>
                                        <h4 className="pj-preview-title">{form.title || "Tiêu đề công việc"}</h4>
                                        <p className="pj-preview-company">Tên công ty của bạn</p>
                                    </div>

                                    <div className="pj-preview-meta">
                                        <div className="pj-meta-item">
                                            <span className="icon">💰</span>
                                            <span className="text salary">
                                                {form.salaryType === 'agreement' ? 'Thỏa thuận' : 
                                                 (form.minSalary || form.maxSalary ? 
                                                  `${form.minSalary || 0} - ${form.maxSalary || '?'} tr` : 'Mức lương')}
                                            </span>
                                        </div>
                                        <div className="pj-meta-item">
                                            <span className="icon">📍</span>
                                            <span className="text">{form.region || "Địa điểm"}</span>
                                        </div>
                                    </div>

                                    <div className="pj-preview-grid">
                                        <div className="pj-grid-item">
                                            <span className="label">Cấp bậc</span>
                                            <span className="val">{form.level || "---"}</span>
                                        </div>
                                        <div className="pj-grid-item">
                                            <span className="label">Kinh nghiệm</span>
                                            <span className="val">{form.experience || "---"}</span>
                                        </div>
                                    </div>

                                    <div className="pj-preview-skills">
                                        {selectedSkills.length > 0 ? (
                                            selectedSkills.slice(0, 3).map(s => <span key={s} className="pj-skill-mini">{s}</span>)
                                        ) : (
                                            <span style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>Chưa chọn kỹ năng...</span>
                                        )}
                                    </div>
                                </div>

                                <div className="pj-score-box">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div className="pj-score-circle" style={{ background: matchColor }}>
                                            {matchScore}
                                        </div>
                                        <div className="pj-score-text">
                                            <div className="label">Match Score</div>
                                            <div className="val">{matchLabel}</div>
                                        </div>
                                    </div>
                                    <div className="pj-score-list">
                                        <div className="pj-score-item">
                                            <span>Tiêu đề Job</span>
                                            <span>{form.title ? '✅' : '⚪'}</span>
                                        </div>
                                        <div className="pj-score-item">
                                            <span>Kỹ năng (≥ 3)</span>
                                            <span>{selectedSkills.length >= 3 ? '✅' : '⚪'}</span>
                                        </div>
                                         <div className="pj-score-item">
                                            <span>Nội dung chi tiết</span>
                                            <span>{stripHtml(form.description).length > 50 ? '✅' : '⚪'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pj-card mt-4 bg-gray-50/50">
                            <h4 className="text-gray-900 font-bold text-sm mb-3">Mẹo đăng tin hiệu quả</h4>
                            <ul className="text-xs text-gray-600 space-y-3">
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Nêu rõ các <strong>Dự án</strong> ứng viên sẽ tham gia để tăng tính hấp dẫn.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Mức lương công khai giúp tăng <strong>40%</strong> tỷ lệ ứng tuyển thành công.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Chọn đúng <strong>Skills</strong> giúp hệ thống AI gợi ý ứng viên chính xác hơn.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {toast.show && (
                <div className={`pj-toast ${toast.type} animate-slide-down`}>
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
