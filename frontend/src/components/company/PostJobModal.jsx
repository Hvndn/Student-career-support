import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from '../common/RichTextEditor';
import { companyApi } from '../../api';
import { vietnamLocations } from '../../utils/vietnamLocations';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/company/PostJobModal.css';

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

const PostJobModal = ({ isOpen, onClose, jobToEdit, onSuccess }) => {
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
        region: '', // Tỉnh/Thành
        location: '', // Địa chỉ cụ thể
        description: '',
        requirements: '',
        benefits: '',
        deadline: '',
        bannerUrl: '',
        status: 'open'
    });

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    
    // For cascaded location select
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (jobToEdit) {
                // Edit Mode
                setForm({
                    title: jobToEdit.title || '',
                    industry: jobToEdit.industry || '',
                    level: jobToEdit.level || '',
                    jobType: (jobToEdit.jobType || 'fulltime').toLowerCase(),
                    quantity: String(jobToEdit.quantity || 1),
                    gender: jobToEdit.gender || 'Không yêu cầu',
                    experience: jobToEdit.experience || '',
                    qualification: jobToEdit.qualification || 'Đại học',
                    minSalary: jobToEdit.minSalary || '',
                    maxSalary: jobToEdit.maxSalary || '',
                    salaryType: jobToEdit.salaryType || 'range',
                    region: jobToEdit.region || '',
                    location: jobToEdit.location || '',
                    description: jobToEdit.description || '',
                    requirements: jobToEdit.requirements || '',
                    benefits: jobToEdit.benefits || '',
                    deadline: jobToEdit.deadline || '',
                    bannerUrl: jobToEdit.bannerUrl || '',
                    status: jobToEdit.status || 'open'
                });
                
                if (Array.isArray(jobToEdit.skills)) {
                    setSelectedSkills(jobToEdit.skills);
                }

                if (jobToEdit.bannerUrl) {
                    setBannerPreview(getImageUrl(jobToEdit.bannerUrl));
                } else {
                    setBannerPreview(null);
                }

                // If region exists, try to load districts
                if (jobToEdit.region) {
                    const foundProv = vietnamLocations.find(p => p.name === jobToEdit.region);
                    if (foundProv) setDistricts(foundProv.districts);
                }

            } else {
                // Create Mode - Reset form
                resetForm();
            }
        }
    }, [isOpen, jobToEdit]);

    const resetForm = () => {
        setForm({
            title: '', industry: '', level: '', jobType: 'fulltime', quantity: '1', gender: 'Không yêu cầu',
            experience: '', qualification: 'Đại học', minSalary: '', maxSalary: '', salaryType: 'range',
            region: '', location: '', description: '', requirements: '', benefits: '', deadline: '', bannerUrl: '', status: 'open'
        });
        setSelectedSkills([]);
        setBannerPreview(null);
        setSelectedBannerFile(null);
        setDistricts([]);
        setSelectedDistrict('');
    };

    const handleChange = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
    };

    const handleRegionChange = (regionName) => {
        setForm(f => ({ ...f, region: regionName, location: '' })); // Reset location when region changes
        setSelectedDistrict('');
        const foundProv = vietnamLocations.find(p => p.name === regionName);
        if (foundProv) {
            setDistricts(foundProv.districts);
        } else {
            setDistricts([]);
        }
    };

    const handleDistrictChange = (districtName) => {
        setSelectedDistrict(districtName);
        // Cập nhật địa chỉ đầy đủ (Ví dụ: tên đường + quận + tỉnh)
        setForm(f => ({ ...f, location: districtName ? `${districtName}, ${f.region}` : '' }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    // Skills logic
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

    const uploadBanner = async (file) => {
        try {
            const res = await companyApi.uploadBanner(file);
            if (res.data.status === 'success') {
                return res.data.data; // trả về url
            }
            return null;
        } catch (error) {
            console.error("Lỗi upload banner", error);
            return null;
        }
    };

    const handleSubmit = async (isDraft = false) => {
        if (!form.title || !form.industry || !form.region || !form.description) {
            alert('Vui lòng điền các trường bắt buộc (*)');
            return;
        }

        setSubmitting(true);
        try {
            let finalBannerUrl = form.bannerUrl;

            // Nếu người dùng chọn ảnh mới, upload trước
            if (selectedBannerFile) {
                const uploadedUrl = await uploadBanner(selectedBannerFile);
                if (uploadedUrl) {
                    finalBannerUrl = uploadedUrl;
                } else {
                    console.warn('Upload banner thất bại, sẽ giữ nguyên banner cũ hoặc không có banner.');
                }
            }

            const payload = {
                ...form,
                quantity: parseInt(form.quantity) || 1,
                minSalary: form.salaryType === 'agreement' ? null : (form.minSalary ? parseFloat(form.minSalary) : null),
                maxSalary: form.salaryType === 'agreement' ? null : (form.maxSalary ? parseFloat(form.maxSalary) : null),
                skills: selectedSkills,
                bannerUrl: finalBannerUrl,
                status: isDraft ? 'draft' : 'open'
            };

            const response = jobToEdit 
                ? await companyApi.updateJob(jobToEdit.id, payload)
                : await companyApi.postJob(payload);

            if (response.data.status === 'success') {
                alert(jobToEdit ? 'Cập nhật tin thành công!' : 'Đã đăng tin thành công!');
                onSuccess();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Đã có lỗi xảy ra!');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="pjm-overlay" onClick={onClose}>
            <div className="pjm-container" onClick={e => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="pjm-header">
                    <h2><i className="fa-solid fa-briefcase"></i> {jobToEdit ? 'Chỉnh sửa Tin Tuyển Dụng' : 'Đăng Tin Mới'}</h2>
                    <button className="btn-close-modal" onClick={onClose}><i className="fa-solid fa-times"></i></button>
                </div>

                {/* Modal Body */}
                <div className="pjm-body">
                    
                    {/* Banner Section */}
                    <div 
                        className="pjm-banner-upload" 
                        onClick={() => fileInputRef.current.click()}
                    >
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Job Banner" className="pjm-banner-preview" />
                        ) : (
                            <div className="pjm-banner-placeholder">
                                <i className="fa-regular fa-image"></i>
                                <span>Nhấn để chọn ảnh bìa (Banner)</span>
                                <small>Kích thước khuyến nghị: 1200x400px (16:9)</small>
                            </div>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="pjm-upload-input"
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="pjm-section">
                        <div className="pjm-section-title"><i className="fa-solid fa-circle-info"></i> Thông tin cơ bản</div>
                        <div className="pjm-row">
                            <div className="pjm-field" style={{ gridColumn: 'span 2' }}>
                                <label>Tiêu đề công việc *</label>
                                <input className="pjm-input" placeholder="Ví dụ: Senior React Developer..." value={form.title} onChange={e => handleChange('title', e.target.value)} />
                            </div>
                        </div>
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Ngành nghề *</label>
                                <select className="pjm-select" value={form.industry} onChange={e => handleChange('industry', e.target.value)}>
                                    <option value="">Chọn ngành...</option>
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
                                <select 
                                    className="pjm-select" 
                                    value={selectedDistrict} 
                                    onChange={e => handleDistrictChange(e.target.value)}
                                    disabled={districts.length === 0}
                                >
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

                    {/* Requirements & Skills */}
                    <div className="pjm-section">
                        <div className="pjm-section-title"><i className="fa-solid fa-list-check"></i> Yêu cầu & Kỹ năng</div>
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Kinh nghiệm yêu cầu</label>
                                <select className="pjm-select" value={form.experience} onChange={e => handleChange('experience', e.target.value)}>
                                    <option value="">Chọn kinh nghiệm...</option>
                                    {EXPERIENCES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                                </select>
                            </div>
                            <div className="pjm-field">
                                <label>Bằng cấp</label>
                                <select className="pjm-select" value={form.qualification} onChange={e => handleChange('qualification', e.target.value)}>
                                    {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        <div className="pjm-field">
                            <label>Từ khóa kỹ năng (Nhấn Enter để thêm)</label>
                            <div className="pjm-tags-container">
                                {selectedSkills.map(skill => (
                                    <span key={skill} className="pjm-tag">
                                        {skill}
                                        <button type="button" onClick={() => handleSkillRemove(skill)}>×</button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    className="pjm-tag-input"
                                    placeholder="Thêm kỹ năng..."
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ',') {
                                            e.preventDefault();
                                            handleSkillAdd();
                                        }
                                    }}
                                    onBlur={handleSkillAdd}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Markdown / Rich Text Editors */}
                    <div className="pjm-section">
                        <div className="pjm-section-title"><i className="fa-solid fa-file-lines"></i> Nội dung chi tiết</div>
                        <div className="pjm-field" style={{ marginBottom: '1rem' }}>
                            <label>Mô tả công việc *</label>
                            <RichTextEditor value={form.description} onChange={val => handleChange('description', val)} placeholder="Mô tả công việc cụ thể..." />
                        </div>
                        <div className="pjm-field" style={{ marginBottom: '1rem' }}>
                            <label>Yêu cầu ứng viên</label>
                            <RichTextEditor value={form.requirements} onChange={val => handleChange('requirements', val)} placeholder="Yêu cầu cụ thể..." />
                        </div>
                        <div className="pjm-field">
                            <label>Quyền lợi được hưởng</label>
                            <RichTextEditor value={form.benefits} onChange={val => handleChange('benefits', val)} placeholder="Chế độ đãi ngộ, phúc lợi..." />
                        </div>
                    </div>

                    {/* Additional Options (Quantity & Gender) */}
                    <div className="pjm-section">
                        <div className="pjm-section-title"><i className="fa-solid fa-users"></i> Yêu cầu khác</div>
                        <div className="pjm-row">
                            <div className="pjm-field">
                                <label>Số lượng tuyển</label>
                                <input type="number" className="pjm-input" value={form.quantity} min="1" onChange={e => handleChange('quantity', e.target.value)} />
                            </div>
                            <div className="pjm-field">
                                <label>Giới tính ưu tiên</label>
                                <select className="pjm-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                                    <option value="Không yêu cầu">Không yêu cầu</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="pjm-footer">
                    <button className="pjm-btn-draft" onClick={() => handleSubmit(true)} disabled={submitting}>
                        Lưu bản nháp
                    </button>
                    <button className="pjm-btn-submit" onClick={() => handleSubmit(false)} disabled={submitting}>
                        {submitting ? 'Đang xử lý...' : (jobToEdit ? 'Lưu thay đổi' : 'Đăng bản tin')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostJobModal;
