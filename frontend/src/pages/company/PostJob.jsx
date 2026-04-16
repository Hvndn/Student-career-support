import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import RichTextEditor from '../../components/common/RichTextEditor';
import { companyApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/company/PostJob.css';

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
    const [companyProfile, setCompanyProfile] = useState(null);
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
        salaryType: 'range',
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

    useEffect(() => {
        fetchCompanyData();
        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const fetchCompanyData = async () => {
        try {
            const res = await companyApi.getProfile();
            if (res.data.status === 'success') {
                setCompanyProfile(res.data.data);
                if (!id) {
                    setForm(prev => ({
                        ...prev,
                        contactName: res.data.data.fullName || prev.contactName,
                        contactEmail: res.data.data.email || prev.contactEmail,
                        contactPhone: res.data.data.phone || prev.contactPhone,
                    }));
                }
            }
        } catch (err) {
            console.error('Error fetching company:', err);
        }
    };

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
            }
        } catch (err) {
            console.error('Fetch job error:', err);
            showToast('Lỗi khi tải thông tin tin đăng!', 'error');
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
        if (form.deadline) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (new Date(form.deadline) < today) {
                showToast('Ngày hạn chót không thể trước ngày hôm nay!', 'error');
                return;
            }
        }

        if (!draft) {
            const required = ['title', 'industry', 'level', 'experience', 'region', 'location', 'description', 'requirements', 'deadline'];
            if (required.some(k => !form[k])) {
                showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'error');
                return;
            }
        }

        setSubmitting(true);
        try {
            const payload = {
                ...form,
                quantity: parseInt(form.quantity) || 1,
                minSalary: form.salaryType === 'agreement' ? null : (form.minSalary ? parseFloat(form.minSalary) : null),
                maxSalary: form.salaryType === 'agreement' ? null : (form.maxSalary ? parseFloat(form.maxSalary) : null),
                skills: selectedSkills,
                status: draft ? 'draft' : 'pending'
            };

            const response = id 
                ? await companyApi.updateJob(id, payload)
                : await companyApi.postJob(payload);

            if (response.data.status === 'success') {
                showToast(id ? 'Cập nhật thành công!' : 'Đã đăng tin thành công!', 'success');
                setTimeout(() => navigate('/company/management'), 1500);
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Đã có lỗi xảy ra!', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const matchScore = (form.title && stripHtml(form.description).length > 50 && selectedSkills.length >= 3) ? 95 : form.title ? 65 : 35;
    const matchLabel = matchScore >= 80 ? 'Rất tiềm năng' : matchScore >= 60 ? 'Tiềm năng' : 'Cần cải thiện';
    const matchColor = matchScore >= 80 ? '#2563eb' : matchScore >= 60 ? '#f59e0b' : '#ef4444';

    if (loadingJob) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-wrapper">
                <CompanyNavbar />
                <main className="pj-wrapper">
                    <div className="pj-header-container intro-y">
                        <div className="pj-breadcrumb">
                            <Link to="/company/dashboard">DAU CONNECT</Link>
                            <span className="separator">/</span>
                            <Link to="/company/management">TIN TUYỂN DỤNG</Link>
                            <span className="separator">/</span>
                            <span className="active-crumb">{id ? 'CHỈNH SỬA' : 'TẠO MỚI'}</span>
                        </div>
                        <h1 className="pj-title">{id ? 'Chỉnh sửa Tin Tuyển Dụng' : 'Tạo Tin Tuyển Dụng Mới'}</h1>
                        <p className="pj-subtitle">Thu hút nhân tài bằng cách cung cấp thông tin chi tiết và chính xác.</p>
                    </div>

                    <div className="pj-body">
                        <div className="pj-col-form">
                            <div className="pj-card intro-y delay-1">
                                <div className="pj-card-title">
                                    <span className="pj-card-icon blue">01</span>
                                    Thông tin cơ bản
                                </div>
                                
                                <div className="pj-field">
                                    <label>Tiêu đề công việc *</label>
                                    <input
                                        className="pj-input"
                                        placeholder="Ví dụ: Senior Frontend Developer (ReactJS)"
                                        value={form.title}
                                        onChange={e => handleChange('title', e.target.value)}
                                    />
                                </div>

                                <div className="pj-row-3">
                                    <div className="pj-field">
                                        <label>Ngành nghề *</label>
                                        <select className="pj-select" value={form.industry} onChange={e => handleChange('industry', e.target.value)}>
                                            <option value="">Chọn ngành nghề</option>
                                            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="pj-field">
                                        <label>Cấp bậc *</label>
                                        <select className="pj-select" value={form.level} onChange={e => handleChange('level', e.target.value)}>
                                            <option value="">Chọn cấp bậc</option>
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div className="pj-field">
                                        <label>Hình thức *</label>
                                        <select className="pj-select" value={form.jobType} onChange={e => handleChange('jobType', e.target.value)}>
                                            {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="pj-row-2">
                                    <div className="pj-field">
                                        <label>Số lượng tuyển</label>
                                        <input type="number" className="pj-input" value={form.quantity} onChange={e => handleChange('quantity', e.target.value)} />
                                    </div>
                                    <div className="pj-field">
                                        <label>Giới tính ưu tiên</label>
                                        <select className="pj-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pj-card intro-y delay-2">
                                <div className="pj-card-title">
                                    <span className="pj-card-icon amber">02</span>
                                    Yêu cầu & Kỹ năng
                                </div>
                                <div className="pj-row-2">
                                    <div className="pj-field">
                                        <label>Kinh nghiệm *</label>
                                        <select className="pj-select" value={form.experience} onChange={e => handleChange('experience', e.target.value)}>
                                            <option value="">Chọn kinh nghiệm</option>
                                            {EXPERIENCES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                                        </select>
                                    </div>
                                    <div className="pj-field">
                                        <label>Bằng cấp</label>
                                        <select className="pj-select" value={form.qualification} onChange={e => handleChange('qualification', e.target.value)}>
                                            {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="pj-field">
                                    <label>Kỹ năng yêu cầu</label>
                                    <div className="pj-tags-input-container">
                                        {selectedSkills.map(skill => (
                                            <span key={skill} className="pj-tag-chip">
                                                {skill}
                                                <button type="button" onClick={() => handleSkillRemove(skill)} className="pj-tag-remove">×</button>
                                            </span>
                                        ))}
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
