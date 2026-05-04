import React, { useState, useEffect, useRef } from 'react';
import SearchableSelect from '../common/SearchableSelect';
import toast from 'react-hot-toast';
import RichTextEditor from '../common/RichTextEditor';
import { companyApi, jobApi, studentApi } from '../../api';
import { vietnamLocations } from '../../utils/vietnamLocations';
import { getImageUrl } from '../../utils/urlUtils';

const LEVELS = ['Thực tập sinh', 'Nhân viên', 'Trưởng nhóm', 'Phó phòng', 'Trưởng phòng', 'Giám đốc', 'Tổng giám đốc/Điều hành'];
const EXPERIENCES = ['Chưa có kinh nghiệm', 'Dưới 1 năm', '1 năm', '2 năm', '3 năm', '4 năm', '5 năm', 'Trên 5 năm'];
const QUALIFICATIONS = ['Không yêu cầu', 'Trung học', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Sau đại học'];
const JOB_TYPES = [
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' },
    { value: 'intern', label: 'Thực tập' },
    { value: 'remote', label: 'Từ xa' },
    { value: 'contract', label: 'Hợp đồng' }
];

const SUGGESTED_SKILLS = {
    'Công nghệ thông tin': ['Java', 'Python', 'ReactJS', 'NodeJS', 'SQL', 'Git', 'AWS', 'Docker', 'Spring Boot', 'TypeScript', 'C++', 'PHP', 'Kubernetes', 'MongoDB', 'Redis'],
    'Marketing': ['SEO', 'Content Marketing', 'Google Ads', 'Facebook Ads', 'Social Media', 'Data Analysis', 'Email Marketing', 'Copywriting', 'TikTok Ads', 'Zalo Ads'],
    'Thiết kế': ['Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'After Effects', 'Design Thinking', 'InDesign', 'Canva', 'Sketch', 'Blender'],
    'Tài chính': ['Excel', 'Data Analysis', 'Accounting', 'Risk Management', 'Financial Planning', 'ERP', 'SAP', 'Power BI', 'Bloomberg'],
    'Kế toán/Kiểm toán': ['MISA', 'Fast Accounting', 'Excel', 'Kế toán thuế', 'IFRS', 'VAS', 'Kiểm toán nội bộ', 'SAP'],
    'Kinh doanh/Bán hàng': ['CRM', 'Negotiation', 'Communication', 'Presentation', 'Sales Strategy', 'Market Research', 'KPI', 'B2B', 'B2C'],
    'Hành chính/Nhân sự': ['HRM', 'Recruitment', 'Payroll', 'MS Office', 'Employee Relations', 'Training', 'C&B', 'HRIS', 'Labor Law'],
    'Giáo dục/Đào tạo': ['Curriculum Design', 'E-learning', 'LMS', 'Presentation', 'Communication', 'MS Office'],
    'Y tế/Dược': ['Dược lý', 'Chăm sóc sức khỏe', 'EHR', 'GMP', 'GDP', 'Tiếng Anh Y khoa'],
    'Xây dựng': ['AutoCAD', 'Revit', 'SketchUp', 'MS Project', 'Quản lý dự án', 'Dự toán công trình'],
    'Kiến trúc/Nội thất': ['AutoCAD', '3ds Max', 'SketchUp', 'Revit', 'Lumion', 'Photoshop'],
    'Du lịch/Nhà hàng': ['OPERA', 'Hospitality', 'Customer Service', 'Tiếng Anh', 'Tiếng Trung', 'Bartending'],
    'Sản xuất/Vận hành': ['Lean Manufacturing', 'Kaizen', '5S', 'ISO', 'PLC', 'Quản lý chất lượng', 'SCM'],
};

const JobForm = ({ jobData, onSuccess, onCancel, isPage = false }) => {
    const fileInputRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [selectedBannerFile, setSelectedBannerFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    
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
        bannerUrl: '',
        status: 'open',
        specificAddress: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catRes, skillRes] = await Promise.all([
                    jobApi.getCategories(),
                    studentApi.getSkills()
                ]);
                if (catRes.data.status === 'success') {
                    setCategories(catRes.data.data);
                }
                if (skillRes.data.status === 'success') {
                    setAllSkills(skillRes.data.data);
                }
            } catch (err) {
                console.error('Lỗi khi lấy metadata:', err);
            }
        };
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (jobData) {
            setForm(prev => {
                const updated = {
                    ...prev,
                    ...jobData,
                    title: jobData.title || '',
                    industry: jobData.industry || '',
                    level: jobData.level || '',
                    region: jobData.region || '',
                    location: jobData.location || '',
                    description: jobData.description || '',
                    requirements: jobData.requirements || '',
                    benefits: jobData.benefits || '',
                    deadline: jobData.deadline || '',
                    minSalary: jobData.minSalary !== null ? String(jobData.minSalary) : '',
                    maxSalary: jobData.maxSalary !== null ? String(jobData.maxSalary) : '',
                    salaryType: jobData.salaryType || (jobData.minSalary || jobData.maxSalary ? 'range' : 'agreement'),
                    quantity: String(jobData.quantity || 1),
                    jobType: (jobData.jobType || 'fulltime').toLowerCase(),
                };
                return updated;
            });

            if (Array.isArray(jobData.skills)) setSelectedSkills(jobData.skills);
            if (jobData.bannerUrl) setBannerPreview(getImageUrl(jobData.bannerUrl));
            
            if (jobData.region) {
                const foundProv = vietnamLocations.find(p => p.name === jobData.region);
                if (foundProv) {
                    setWards(foundProv.wards || []);
                    if (jobData.location && jobData.location.includes(',')) {
                        const wardPart = jobData.location.split(',')[0].trim();
                        const foundWard = (foundProv.wards || []).find(d => d.name === wardPart);
                        if (foundWard) setSelectedWard(foundWard.name);
                    }
                }
            }
        }
    }, [jobData]);

    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleRegionChange = (regionName) => {
        setForm(f => ({ ...f, region: regionName, location: '' }));
        setSelectedWard('');
        const foundProv = vietnamLocations.find(p => p.name === regionName);
        setWards(foundProv ? (foundProv.wards || []) : []);
    };

    const handleWardChange = (wardName) => {
        setSelectedWard(wardName);
        setForm(f => ({ ...f, location: wardName ? `${wardName}, ${f.region}` : '' }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSkillAdd = (val = skillInput) => {
        const trimmed = val.trim().replace(/,$/, '');
        if (trimmed && !selectedSkills.includes(trimmed)) {
            setSelectedSkills([...selectedSkills, trimmed]);
        }
        setSkillInput('');
    };

    const handleSkillInputChange = (e) => {
        const val = e.target.value;
        if (val.endsWith(',')) {
            handleSkillAdd(val);
        } else {
            setSkillInput(val);
        }
    };

    const handleSkillRemove = (skill) => setSelectedSkills(selectedSkills.filter(s => s !== skill));

    const getSkillSuggestions = () => {
        if (!form.industry) return [];
        
        // 1. Lấy từ database (đã fetch về)
        const dbSuggestions = allSkills
            .filter(s => s.category === form.industry && !selectedSkills.includes(s.name))
            .map(s => s.name);

        // 2. Lấy từ hardcoded (nếu db ít quá hoặc không khớp tên category hoàn toàn)
        // Cố gắng tìm key gần đúng nhất
        const hardcodedKey = Object.keys(SUGGESTED_SKILLS).find(k => 
            k.toLowerCase().includes(form.industry.toLowerCase()) || 
            form.industry.toLowerCase().includes(k.toLowerCase())
        );
        
        const hardcodedSuggestions = hardcodedKey ? SUGGESTED_SKILLS[hardcodedKey] : [];
        
        // Gộp lại và loại bỏ trùng, lấy tối đa 12 cái
        const combined = Array.from(new Set([...dbSuggestions, ...hardcodedSuggestions]))
            .filter(s => !selectedSkills.includes(s));
            
        return combined.slice(0, 12);
    };

    const handleSubmit = async (isDraft = false) => {
        // Final check before sending
        if (!form.title || !form.industry || !form.region || !form.description) {
            toast.error('Vui lòng điền đủ: Tiêu đề, Lĩnh vực, Địa điểm, Mô tả');
            return;
        }

        const payload = {
            ...form,
            quantity: parseInt(form.quantity) || 1,
            minSalary: form.salaryType === 'agreement' ? null : (form.minSalary ? parseFloat(form.minSalary) : null),
            maxSalary: form.salaryType === 'agreement' ? null : (form.maxSalary ? parseFloat(form.maxSalary) : null),
            skills: selectedSkills,
            status: isDraft ? 'draft' : (jobData?.status || 'open')
        };

        // Explicitly ensure all required fields are present in payload
        payload.title = form.title;
        payload.industry = form.industry;
        payload.region = form.region;
        payload.description = form.description;

        console.log("Final Payload to API:", payload);

        setSubmitting(true);
        try {
            if (selectedBannerFile) {
                const res = await companyApi.uploadBanner(selectedBannerFile);
                if (res.data.status === 'success') payload.bannerUrl = res.data.data;
            }

            const response = jobData?.id 
                ? await companyApi.updateJob(jobData.id, payload)
                : await companyApi.postJob(payload);

            if (response.data.status === 'success') {
                toast.success(jobData ? 'Cập nhật thành công!' : 'Đăng tin thành công!');
                onSuccess();
            }
        } catch (err) {
            console.error("Submit Error:", err);
            toast.error(err.response?.data?.message || 'Lỗi hệ thống khi lưu tin!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`job-form-container ${isPage ? 'is-page' : ''}`}>
            {/* Banner Section */}
            <div className="pjm-banner-upload" onClick={() => fileInputRef.current.click()}>
                {bannerPreview ? (
                    <img src={bannerPreview} alt="Job Banner" className="pjm-banner-preview" />
                ) : (
                    <div className="pjm-banner-placeholder">
                        <i className="fa-regular fa-image"></i>
                        <span>Nhấn để chọn ảnh bìa (Banner)</span>
                        <small>Kích thước khuyến nghị: 1200x400px (16:9)</small>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.gif,.bmp,.svg,.tiff,.jfif,.ico" className="pjm-upload-input" style={{ display: 'none' }} />
            </div>

            {/* Basic Info */}
            <div className="pjm-section">
                <div className="pjm-section-title"><i className="fa-solid fa-circle-info"></i> Thông tin cơ bản</div>
                <div className="pjm-field">
                    <label>Tiêu đề công việc *</label>
                    <input className="pjm-input" placeholder="Ví dụ: Senior React Developer..." value={form.title} onChange={e => handleChange('title', e.target.value)} />
                </div>
                <div className="pjm-row">
                    <div className="pjm-field">
                        <label>Lĩnh vực *</label>
                        <select className="pjm-select" value={form.industry} onChange={e => handleChange('industry', e.target.value)}>
                            <option value="">Chọn lĩnh vực...</option>
                            {categories.map(cat => (
                                <option key={cat.id || cat.name} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="pjm-field">
                        <label>Cấp bậc</label>
                        <select className="pjm-select" value={form.level} onChange={e => handleChange('level', e.target.value)}>
                            <option value="">Chọn cấp bậc...</option>
                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="pjm-field">
                        <label>Hình thức làm việc</label>
                        <select className="pjm-select" value={form.jobType} onChange={e => handleChange('jobType', e.target.value)}>
                            {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Location & Salary */}
            <div className="pjm-section">
                <div className="pjm-section-title"><i className="fa-solid fa-money-bill-wave"></i> Chế độ & Địa điểm</div>
                <div className="pjm-row">
                    <div className="pjm-field">
                        <label>Tỉnh/Thành phố *</label>
                        <SearchableSelect
                            options={vietnamLocations.map(p => p.name)}
                            value={form.region}
                            onChange={handleRegionChange}
                            placeholder="Tìm hoặc chọn Tỉnh/Thành phố..."
                        />
                    </div>
                    <div className="pjm-field">
                        <label>Xã/Phường *</label>
                        <SearchableSelect
                            options={wards.map(d => d.name)}
                            value={selectedWard}
                            onChange={handleWardChange}
                            placeholder={wards.length === 0 ? 'Chọn Tỉnh/Thành trước...' : 'Tìm hoặc chọn Xã/Phường...'}
                            disabled={wards.length === 0}
                        />
                    </div>
                    <div className="pjm-field">
                        <label>Hạn chót nộp hồ sơ</label>
                        <input type="date" className="pjm-input" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} />
                    </div>
                </div>

                <div className="pjm-field" style={{ marginTop: '1rem' }}>
                    <label>Địa chỉ cụ thể (Số nhà, tên đường...)</label>
                    <input 
                        className="pjm-input" 
                        placeholder="Ví dụ: 123 Nguyễn Văn Linh, P. Thạch Thang..." 
                        value={form.specificAddress} 
                        onChange={e => handleChange('specificAddress', e.target.value)} 
                    />
                </div>

                <div className="pjm-row">
                    <div className="pjm-field">
                        <label>Mức lương</label>
                        <select className="pjm-select" value={form.salaryType} onChange={e => handleChange('salaryType', e.target.value)}>
                            <option value="range">Khoảng lương</option>
                            <option value="agreement">Thỏa thuận</option>
                        </select>
                    </div>
                    {form.salaryType === 'range' && (
                        <>
                            <div className="pjm-field">
                                <label>Lương tối thiểu (VNĐ)</label>
                                <input type="number" className="pjm-input" placeholder="Ví dụ: 10000000" value={form.minSalary} onChange={e => handleChange('minSalary', e.target.value)} />
                            </div>
                            <div className="pjm-field">
                                <label>Lương tối đa (VNĐ)</label>
                                <input type="number" className="pjm-input" placeholder="Ví dụ: 20000000" value={form.maxSalary} onChange={e => handleChange('maxSalary', e.target.value)} />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Contact Person */}
            <div className="pjm-section">
                <div className="pjm-section-title"><i className="fa-solid fa-user-tie"></i> Thông tin người liên hệ</div>
                <div className="pjm-row">
                    <div className="pjm-field">
                        <label>Họ tên người liên hệ</label>
                        <input 
                            className="pjm-input" 
                            placeholder="Ví dụ: Nguyễn Văn A" 
                            value={form.contactName} 
                            onChange={e => handleChange('contactName', e.target.value)} 
                        />
                    </div>
                    <div className="pjm-field">
                        <label>Số điện thoại</label>
                        <input 
                            className="pjm-input" 
                            placeholder="Ví dụ: 0912345678" 
                            value={form.contactPhone} 
                            onChange={e => handleChange('contactPhone', e.target.value)} 
                        />
                    </div>
                    <div className="pjm-field">
                        <label>Email liên hệ</label>
                        <input 
                            className="pjm-input" 
                            placeholder="Ví dụ: contact@company.com" 
                            value={form.contactEmail} 
                            onChange={e => handleChange('contactEmail', e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="pjm-section">
                <div className="pjm-section-title"><i className="fa-solid fa-file-lines"></i> Nội dung chi tiết</div>
                <div className="pjm-field">
                    <label>Mô tả công việc *</label>
                    <RichTextEditor value={form.description} onChange={val => handleChange('description', val)} />
                </div>
                <div className="pjm-field">
                    <label>Yêu cầu ứng viên</label>
                    <RichTextEditor value={form.requirements} onChange={val => handleChange('requirements', val)} />
                </div>
            </div>

            {/* Skills */}
            <div className="pjm-section">
                <div className="pjm-section-title">
                    <i className="fa-solid fa-tags"></i> 
                    Kỹ năng yêu cầu
                    <span className="pjm-title-hint">(Dùng để AI so khớp ứng viên)</span>
                </div>
                
                <div className="pjm-skills-wrapper">
                    {/* Added Tags Above */}
                    <div className="pjm-added-tags">
                        {selectedSkills.length > 0 ? (
                            selectedSkills.map(s => (
                                <span key={s} className="pjm-tag">
                                    {s} <button type="button" onClick={() => handleSkillRemove(s)}>×</button>
                                </span>
                            ))
                        ) : (
                            <span className="pjm-no-skills">Chưa có kỹ năng nào được thêm</span>
                        )}
                    </div>

                    <div className="pjm-tag-input-wrap">
                        <i className="fa-solid fa-plus"></i>
                        <input 
                            className="pjm-tag-input-v2" 
                            placeholder="Nhập kỹ năng (ví dụ: ReactJS) rồi nhấn Enter hoặc dấu phẩy..." 
                            value={skillInput} 
                            onChange={handleSkillInputChange}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd())}
                            onBlur={() => handleSkillAdd()}
                        />
                    </div>

                    {/* Suggestions */}
                    {form.industry && getSkillSuggestions().length > 0 && (
                        <div className="pjm-skill-suggestions">
                            <span className="pjm-sug-label">Gợi ý cho {form.industry}:</span>
                            <div className="pjm-sug-list">
                                {getSkillSuggestions().map(s => (
                                        <button 
                                            key={s} 
                                            type="button" 
                                            className="pjm-sug-item"
                                            onClick={() => setSelectedSkills([...selectedSkills, s])}
                                        >
                                            + {s}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pjm-footer">
                {onCancel && (
                    <button type="button" className="pjm-btn-cancel" onClick={onCancel}>
                        <i className="fa-solid fa-xmark"></i> Hủy bỏ
                    </button>
                )}
                <div style={{ flex: 1 }}></div>
                <button type="button" className="pjm-btn-draft" onClick={() => handleSubmit(true)} disabled={submitting}>Lưu bản nháp</button>
                <button type="button" className="pjm-btn-submit" onClick={() => handleSubmit(false)} disabled={submitting}>
                    {submitting ? 'Đang lưu...' : (jobData ? 'Lưu thay đổi' : 'Đăng bản tin')}
                </button>
            </div>
        </div>
    );
};

export default JobForm;
