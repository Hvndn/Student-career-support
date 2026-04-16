import React, { useState, useEffect, useRef } from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { companyApi } from '../../api';
import { getImageUrl } from '../../utils/urlUtils';
import '../../assets/css/company/CompanyProfile.css';

const QUILL_MODULES = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const CompanyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        taxCode: '',
        industry: '',
        website: '',
        phone: '',
        representativeName: '',
        email: '',
        companySize: '',
        province: '',
        address: '',
        description: '',
        logo: ''
    });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const res = await companyApi.getProfile();
            if (res.data.status === 'success') {
                const data = res.data.data;
                setProfile(data);
                setFormData({
                    name: data.name || '',
                    taxCode: data.taxCode || '',
                    industry: data.industry || '',
                    website: data.website || '',
                    phone: data.phone || '',
                    representativeName: data.representativeName || data.fullName || '',
                    email: data.email || '',
                    companySize: data.companySize || '',
                    province: data.province || '',
                    address: data.address || '',
                    description: data.description || '',
                    logo: data.logoUrl || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            showToast('Không thể tải thông tin hồ sơ!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (content) => {
        setFormData(prev => ({ ...prev, description: content }));
    };

    const handleLogoClick = () => fileInputRef.current.click();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, logo: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'logo' && formData[key] !== null && formData[key] !== undefined) {
                    dataToSubmit.append(key, formData[key]);
                }
            });
            if (selectedFile) dataToSubmit.append('logoFile', selectedFile);

            await companyApi.updateProfile(dataToSubmit);
            setProfile(prev => ({ ...prev, ...formData }));
            setSelectedFile(null);
            window.dispatchEvent(new CustomEvent('companyProfileUpdated'));
            showToast('Cập nhật hồ sơ công ty thành công!', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Cập nhật thất bại!', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Đang tải thông tin doanh nghiệp...</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="cd-layout">
            <CompanySidebar />
            <div className="cd-main">
                <CompanyNavbar activeTab="Profile" />

                <div className="cp-page">
                    {/* Breadcrumb */}
                    <div className="cp-breadcrumb">
                        <span className="cp-bc-item">DAU Connect</span>
                        <span className="cp-bc-sep">›</span>
                        <span className="cp-bc-active">Hồ sơ công ty</span>
                    </div>

                    <h1 className="cp-page-title">Hồ sơ công ty</h1>

                    {/* Main 2-column layout */}
                    <div className="cp-layout">

                        {/* ===== LEFT COLUMN: Company Card ===== */}
                        <div className="cp-left-col">
                            {/* Avatar */}
                            <div className="cp-avatar-section">
                                <div className="cp-avatar-wrap" onClick={handleLogoClick} title="Nhấn để đổi logo">
                                    {formData.logo ? (
                                        <img src={getImageUrl(formData.logo)} alt="Logo" className="cp-avatar-img" />
                                    ) : (
                                        <div className="cp-avatar-default">🏢</div>
                                    )}
                                    <div className="cp-avatar-hover">
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="white" strokeWidth="2" fill="none">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                            <circle cx="12" cy="13" r="4"/>
                                        </svg>
                                    </div>
                                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                                </div>

                                <h2 className="cp-company-name">{profile?.name || formData.name || 'Tên công ty'}</h2>
                                <p className="cp-company-industry">{profile?.industry || 'Lĩnh vực chưa cập nhật'}</p>

                                <div className="cp-verified-badge">
                                    <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Đã xác minh
                                </div>
                            </div>

                            {/* Contact info list */}
                            <div className="cp-info-list">
                                {(profile?.email || formData.email) && (
                                    <div className="cp-info-item">
                                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#64748b" strokeWidth="2" fill="none">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                        <span>{profile?.email || formData.email}</span>
                                    </div>
                                )}
                                {(profile?.phone || formData.phone) && (
                                    <div className="cp-info-item">
                                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#64748b" strokeWidth="2" fill="none">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69l3-.08a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6.06 6.06l1.45-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                        </svg>
                                        <span>{profile?.phone || formData.phone}</span>
                                    </div>
                                )}
                                {(profile?.website || formData.website) && (
                                    <div className="cp-info-item">
                                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#64748b" strokeWidth="2" fill="none">
                                            <circle cx="12" cy="12" r="10"/>
                                            <line x1="2" y1="12" x2="22" y2="12"/>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                        </svg>
                                        <span className="cp-info-link">{(profile?.website || formData.website).replace(/https?:\/\//, '')}</span>
                                    </div>
                                )}
                                {(profile?.companySize || formData.companySize) && (
                                    <div className="cp-info-item">
                                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#64748b" strokeWidth="2" fill="none">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                        </svg>
                                        <span>{profile?.companySize || formData.companySize} Nhân viên</span>
                                    </div>
                                )}
                                {(profile?.address || formData.address) && (
                                    <div className="cp-info-item">
                                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#64748b" strokeWidth="2" fill="none">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        <span>{profile?.address || formData.address}</span>
                                    </div>
                                )}
                            </div>

                            {/* Company Activity Photos */}
                            <div className="cp-activity-section">
                                <div className="cp-activity-header">
                                    <span>Hoạt động công ty</span>
                                    <button className="cp-activity-edit" title="Chỉnh sửa ảnh">
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="cp-activity-grid">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="cp-activity-photo">
                                            <div className="cp-photo-placeholder">
                                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#cbd5e1" strokeWidth="1.5" fill="none">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                                    <polyline points="21 15 16 10 5 21"/>
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ===== RIGHT COLUMN: Edit Form ===== */}
                        <div className="cp-right-col">
                            <form id="cp-form" onSubmit={handleSubmit}>
                                <div className="cp-form-card">
                                    <h3 className="cp-form-title">Cập nhật hồ sơ doanh nghiệp</h3>

                                    <div className="cp-fields-grid">
                                        {/* Tên công ty */}
                                        <div className="cp-field-group">
                                            <label>Tên công ty <span className="cp-required">*</span></label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nhập tên công ty..." required />
                                        </div>

                                        {/* Mã số thuế */}
                                        <div className="cp-field-group">
                                            <label>Mã số thuế <span className="cp-required">*</span></label>
                                            <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} placeholder="0000000000" />
                                        </div>

                                        {/* Ngành nghề */}
                                        <div className="cp-field-group">
                                            <label>Ngành nghề <span className="cp-required">*</span></label>
                                            <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="Kiến trúc, Xây dựng..." />
                                        </div>

                                        {/* Website */}
                                        <div className="cp-field-group">
                                            <label>Website</label>
                                            <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="https://company.com" />
                                        </div>

                                        {/* Hotline / SĐT */}
                                        <div className="cp-field-group">
                                            <label>Hotline / SĐT</label>
                                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="0xxxxxxxxx" />
                                        </div>

                                        {/* Người đại diện */}
                                        <div className="cp-field-group">
                                            <label>Người đại diện <span className="cp-required">*</span></label>
                                            <input type="text" name="representativeName" value={formData.representativeName} onChange={handleChange} placeholder="Họ và tên người đại diện" />
                                        </div>

                                        {/* Email liên hệ */}
                                        <div className="cp-field-group">
                                            <label>Email liên hệ <span className="cp-required">*</span></label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@company.com" />
                                        </div>

                                        {/* Quy mô nhân sự */}
                                        <div className="cp-field-group">
                                            <label>Quy mô nhân sự</label>
                                            <select name="companySize" value={formData.companySize} onChange={handleChange}>
                                                <option value="">Chọn quy mô</option>
                                                <option value="1-50">1-50 Nhân viên</option>
                                                <option value="51-150">51-150 Nhân viên</option>
                                                <option value="100-999">100-999 Nhân viên</option>
                                                <option value="151-500">151-500 Nhân viên</option>
                                                <option value="501-1000">501-1000 Nhân viên</option>
                                                <option value="1000+">Trên 1000 Nhân viên</option>
                                            </select>
                                        </div>

                                        {/* Địa chỉ tỉnh */}
                                        <div className="cp-field-group">
                                            <label>Địa chỉ tỉnh</label>
                                            <select name="province" value={formData.province} onChange={handleChange}>
                                                <option value="">Chọn Tỉnh</option>
                                                <option value="Hà Nội">Hà Nội</option>
                                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                                <option value="Đà Nẵng">Đà Nẵng</option>
                                                <option value="Hải Phòng">Hải Phòng</option>
                                                <option value="Cần Thơ">Cần Thơ</option>
                                                <option value="Khác">Tỉnh/Thành khác</option>
                                            </select>
                                        </div>

                                        {/* Địa chỉ cụ thể */}
                                        <div className="cp-field-group">
                                            <label>Xã/Phường/Quận <span className="cp-required">*</span></label>
                                            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Nhập địa chỉ chi tiết..." />
                                        </div>
                                    </div>

                                    {/* Giới thiệu - full width */}
                                    <div className="cp-field-group cp-desc-group">
                                        <label>Lời thiệu công ty</label>
                                        <div className="cp-quill-wrapper">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.description}
                                                onChange={handleDescriptionChange}
                                                modules={QUILL_MODULES}
                                                placeholder="Giới thiệu về văn hóa, sứ mệnh và giá trị của công ty..."
                                            />
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <div className="cp-form-footer">
                                        <button type="submit" className="cp-btn-save" disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <div className="cp-btn-spinner"></div>
                                                    Đang lưu...
                                                </>
                                            ) : 'Lưu thông tin'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Toast */}
                {toast.show && (
                    <div className={`cp-toast ${toast.type}`}>
                        <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
                        <span>{toast.message}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
