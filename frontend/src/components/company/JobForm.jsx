import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import RichTextEditor from '../common/RichTextEditor';
import { companyApi } from '../../api';
import { vietnamLocations } from '../../utils/vietnamLocations';
import { getImageUrl } from '../../utils/urlUtils';

const INDUSTRIES = ['Công nghệ thông tin', 'Marketing', 'Tài chính', 'Thiết kế', 'Kế toán/Kiểm toán', 'Giáo dục/Đào tạo', 'Y tế/Dược', 'Kinh doanh/Bán hàng', 'Hành chính/Nhân sự', 'Xây dựng', 'Kiến trúc/Nội thất', 'Du lịch/Nhà hàng', 'Sản xuất/Vận hành'];
const LEVELS = ['Thực tập sinh', 'Nhân viên', 'Trưởng nhóm', 'Phó phòng', 'Trưởng phòng', 'Giám đốc', 'Tổng giám đốc/Điều hành'];
const EXPERIENCES = ['Chưa có kinh nghiệm', 'Dưới 1 năm', '1 năm', '2 năm', '3 năm', '4 năm', '5 năm', 'Trên 5 năm'];
const QUALIFICATIONS = ['Không yêu cầu', 'Trung học', 'Trung cấp', 'Cao đẳng', 'Đại học', 'Sau đại học'];
const JOB_TYPES = [
    { value: 'fulltime', label: 'Toàn thời gian' },
    { value: 'parttime', label: 'Bán thời gian' },
    { value: 'intern', label: 'Thực tập' },
    { value: 'remote', label: 'Từ xa' },
    { value: 'freelance', label: 'Hợp đồng' }
];

const SUGGESTED_SKILLS = {
    'Công nghệ thông tin': ['Java', 'Python', 'ReactJS', 'NodeJS', 'SQL', 'Git', 'AWS', 'Docker', 'Spring Boot', 'TypeScript', 'C++', 'PHP'],
    'Marketing': ['SEO', 'Content Marketing', 'Google Ads', 'Facebook Ads', 'Social Media', 'Data Analysis', 'Email Marketing', 'Copywriting'],
    'Thiết kế': ['Photoshop', 'Illustrator', 'Figma', 'UI/UX', 'After Effects', 'Design Thinking', 'InDesign'],
    'Tài chính': ['Excel', 'Data Analysis', 'Accounting', 'Risk Management', 'Financial Planning', 'ERP'],
    'Kinh doanh/Bán hàng': ['CRM', 'Negotiation', 'Communication', 'Presentation', 'Sales Strategy', 'Market Research'],
    'Hành chính/Nhân sự': ['HRM', 'Recruitment', 'Payroll', 'MS Office', 'Employee Relations', 'Training']
};

const JobForm = ({ jobData, onSuccess, onCancel, isPage = false }) => {
    const fileInputRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [selectedBannerFile, setSelectedBannerFile] = useState(null);
    
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
        status: 'open'
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');

    useEffect(() => {
        if (jobData) {
            setForm({
                ...form,
                ...jobData,
                quantity: String(jobData.quantity || 1),
                jobType: (jobData.jobType || 'fulltime').toLowerCase(),
            });
            if (Array.isArray(jobData.skills)) setSelectedSkills(jobData.skills);
            if (jobData.bannerUrl) setBannerPreview(getImageUrl(jobData.bannerUrl));
            
            if (jobData.region) {
                const foundProv = vietnamLocations.find(p => p.name === jobData.region);
                if (foundProv) {
                    setDistricts(foundProv.districts);
                    // Try to extract district from location if possible, or just leave it
                }
            }
        }
    }, [jobData]);

    const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleRegionChange = (regionName) => {
        setForm(f => ({ ...f, region: regionName, location: '' }));
        setSelectedDistrict('');
        const foundProv = vietnamLocations.find(p => p.name === regionName);
        setDistricts(foundProv ? foundProv.districts : []);
    };

    const handleDistrictChange = (districtName) => {
        setSelectedDistrict(districtName);
        setForm(f => ({ ...f, location: districtName ? `${districtName}, ${f.region}` : '' }));
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

    const handleSubmit = async (isDraft = false) => {
        if (!form.title || !form.industry || !form.region || !form.description) {
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc (*)');
            return;
        }

        setSubmitting(true);
        try {
            let finalBannerUrl = form.bannerUrl;
            if (selectedBannerFile) {
                const res = await companyApi.uploadBanner(selectedBannerFile);
                if (res.data.status === 'success') finalBannerUrl = res.data.data;
            }

            const payload = {
                ...form,
                quantity: parseInt(form.quantity) || 1,
                minSalary: form.salaryType === 'agreement' ? null : (form.minSalary ? parseFloat(form.minSalary) : null),
                maxSalary: form.salaryType === 'agreement' ? null : (form.maxSalary ? parseFloat(form.maxSalary) : null),
                skills: selectedSkills,
                bannerUrl: finalBannerUrl,
                status: isDraft ? 'draft' : (jobData ? jobData.status : 'open')
            };

            const response = jobData?.id 
                ? await companyApi.updateJob(jobData.id, payload)
                : await companyApi.postJob(payload);

            if (response.data.status === 'success') {
                toast.success(jobData ? 'Cập nhật thành công!' : 'Đăng tin thành công!');
                onSuccess();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Đã có lỗi xảy ra!');
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
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="pjm-upload-input" style={{ display: 'none' }} />
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
                            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
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
                        <select className="pjm-select" value={form.region} onChange={e => handleRegionChange(e.target.value)}>
                            <option value="">Chọn Tỉnh/Thành</option>
                            {vietnamLocations.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="pjm-field">
                        <label>Quận/Huyện</label>
                        <select className="pjm-select" value={selectedDistrict} onChange={e => handleDistrictChange(e.target.value)} disabled={districts.length === 0}>
                            <option value="">Chọn Quận/Huyện</option>
                            {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                    </div>
                    <div className="pjm-field">
                        <label>Hạn chót nộp hồ sơ</label>
                        <input type="date" className="pjm-input" value={form.deadline} onChange={e => handleChange('deadline', e.target.value)} />
                    </div>
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
                    {form.industry && SUGGESTED_SKILLS[form.industry] && (
                        <div className="pjm-skill-suggestions">
                            <span className="pjm-sug-label">Gợi ý cho {form.industry}:</span>
                            <div className="pjm-sug-list">
                                {SUGGESTED_SKILLS[form.industry]
                                    .filter(s => !selectedSkills.includes(s))
                                    .slice(0, 8)
                                    .map(s => (
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
