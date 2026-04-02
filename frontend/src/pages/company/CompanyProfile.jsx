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
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

const CompanyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        fullName: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        industry: '',
        companySize: '',
        foundingYear: '',
        description: '',
        logo: ''
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await companyApi.getProfile();
            if (res.data.status === 'success') {
                const data = res.data.data;
                setProfile(data);
                setFormData({
                    name: data.name || '',
                    fullName: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    website: data.website || '',
                    address: data.address || '',
                    industry: data.industry || '',
                    companySize: data.companySize || '',
                    foundingYear: data.foundingYear || '',
                    description: data.description || '',
                    logo: data.logoUrl || ''
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            showToast('Không thể tải thông tin hồ sơ. Vui lòng thử lại!', 'error');
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

    const handleLogoClick = () => {
        if (isEditing) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key !== 'logo' && formData[key] !== null && formData[key] !== undefined) {
                    dataToSubmit.append(key, formData[key]);
                }
            });

            if (selectedFile) {
                dataToSubmit.append('logoFile', selectedFile);
            }

            setIsUploading(true);
            await companyApi.updateProfile(dataToSubmit, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            });
            
            setProfile(formData);
            setSelectedFile(null);
            setIsEditing(false);
            setUploadProgress(0);
            setIsUploading(false);
            
            window.dispatchEvent(new CustomEvent('companyProfileUpdated'));
            showToast('Cập nhật hồ sơ công ty thành công!', 'success');
        } catch (err) {
            console.error('Update failed:', err);
            setIsUploading(false);
            setUploadProgress(0);
            showToast(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại!', 'error');
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
                
                <div className="cd-content profile-page">
                    <div className="profile-header-card glass">
                        <div className="profile-cover"></div>
                        <div className="profile-avatar-row">
                            <div className="profile-avatar" onClick={handleLogoClick} style={{ cursor: isEditing ? 'pointer' : 'default' }}>
                                {formData.logo ? (
                                    <img src={getImageUrl(formData.logo)} alt="Logo" />
                                ) : (
                                    <div className="avatar-placeholder">🏢</div>
                                )}
                                {isEditing && !isUploading && <button className="avatar-edit-btn" type="button">📸</button>}
                                {isUploading && (
                                    <div className="upload-progress-overlay">
                                        <div className="progress-spinner"></div>
                                        <span className="progress-text">{uploadProgress}%</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="profile-title-info">
                                <h2>{profile.name}</h2>
                                <p className="profile-industry-badge">{profile.industry || 'Lĩnh vực chưa cập nhật'}</p>
                            </div>
                            <div className="profile-header-actions">
                                {isEditing ? (
                                    <div className="acting-buttons">
                                        <button 
                                            type="button"
                                            className="btn-action btn-cancel"
                                            onClick={() => {
                                                setIsEditing(false);
                                                fetchProfile();
                                            }}
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button 
                                            type="submit" 
                                            form="profile-edit-form"
                                            className="btn-action btn-save-header"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        className="btn-action btn-edit"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Chỉnh sửa hồ sơ
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-content-body">
                        <form id="profile-edit-form" onSubmit={handleSubmit}>
                            {/* Row 1: General Info & Contact */}
                            <div className="info-row-top">
                                <div className="profile-section-card glass flex-half">
                                    <h3><span className="icon">🏢</span> Thông tin chung</h3>
                                    <div className="form-grid-compact">
                                        <div className="form-group">
                                            <label>Tên doanh nghiệp</label>
                                            <input 
                                                type="text" name="name" 
                                                value={formData.name} onChange={handleChange} 
                                                disabled={!isEditing}
                                                placeholder="Nhập tên doanh nghiệp..."
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Website</label>
                                            <input 
                                                type="text" name="website" 
                                                value={formData.website} onChange={handleChange} 
                                                disabled={!isEditing}
                                                placeholder="https://company.com"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Lĩnh vực hoạt động</label>
                                            <input 
                                                type="text" name="industry" 
                                                value={formData.industry} onChange={handleChange} 
                                                disabled={!isEditing}
                                                placeholder="Ví dụ: Công nghệ thông tin"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Quy mô nhân sự</label>
                                            <select 
                                                name="companySize" 
                                                value={formData.companySize} onChange={handleChange} 
                                                disabled={!isEditing}
                                            >
                                                <option value="">Chọn quy mô</option>
                                                <option value="1-50">1 - 50 nhân viên</option>
                                                <option value="51-150">51 - 150 nhân viên</option>
                                                <option value="151-500">151 - 500 nhân viên</option>
                                                <option value="501-1000">501 - 1000 nhân viên</option>
                                                <option value="1000+">Trên 1000 nhân viên</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Năm thành lập</label>
                                            <input 
                                                type="number" name="foundingYear" 
                                                value={formData.foundingYear} onChange={handleChange} 
                                                disabled={!isEditing}
                                                placeholder="YYYY"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-section-card glass flex-half">
                                    <h3><span className="icon">📞</span> Liên hệ</h3>
                                    <div className="form-grid-compact">
                                        <div className="form-group">
                                            <label>Email liên hệ</label>
                                            <input 
                                                type="email" name="email" 
                                                value={formData.email} onChange={handleChange} 
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            <input 
                                                type="text" name="phone" 
                                                value={formData.phone} onChange={handleChange} 
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Trụ sở chính</label>
                                            <textarea 
                                                name="address" 
                                                value={formData.address} onChange={handleChange} 
                                                disabled={!isEditing}
                                                placeholder="Nhập địa chỉ đầy đủ..."
                                                rows="4"
                                                style={{ resize: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: About Section */}
                            <div className="profile-section-card glass mt-4">
                                <h3><span className="icon">📝</span> Giới thiệu doanh nghiệp</h3>
                                <div className="form-group full-width">
                                    {isEditing ? (
                                        <div className="rich-editor-wrapper">
                                            <ReactQuill 
                                                theme="snow" 
                                                value={formData.description} 
                                                onChange={handleDescriptionChange} 
                                                modules={QUILL_MODULES} 
                                                placeholder="Mô tả về văn hóa, sứ mệnh và giá trị của công ty..." 
                                            />
                                        </div>
                                    ) : (
                                        <div className="ql-container ql-snow" style={{ border: 'none' }}>
                                            <div 
                                                className="description-preview ql-editor"
                                                dangerouslySetInnerHTML={{ __html: profile.description || 'Chưa có mô tả' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
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
        </div>
    );
};

export default CompanyProfile;
