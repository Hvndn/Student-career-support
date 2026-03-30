import React, { useState, useEffect, useRef } from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { companyApi } from '../../api';
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
            
            // Append all fields from formData
            Object.keys(formData).forEach(key => {
                if (key !== 'logo' && formData[key] !== null && formData[key] !== undefined) {
                    dataToSubmit.append(key, formData[key]);
                }
            });

            // If a new file was selected, append it as 'logoFile'
            if (selectedFile) {
                dataToSubmit.append('logoFile', selectedFile);
            }

            await companyApi.updateProfile(dataToSubmit);
            setProfile(formData);
            setSelectedFile(null);
            setIsEditing(false);
            
            // Emit custom event for Topbar to refresh
            window.dispatchEvent(new CustomEvent('companyProfileUpdated'));
            
            showToast('Cập nhật hồ sơ công ty thành công!', 'success');
        } catch (err) {
            console.error('Update failed:', err);
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
                                    <img src={formData.logo} alt="Logo" />
                                ) : (
                                    <div className="avatar-placeholder">🏢</div>
                                )}
                                {isEditing && <button className="avatar-edit-btn" type="button">📸</button>}
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
                                <button 
                                    className={`btn-action ${isEditing ? 'btn-cancel' : 'btn-edit'}`}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? 'Hủy bản sửa' : 'Chỉnh sửa hồ sơ'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="profile-main-grid">
                        <div className="profile-sections-container">
                            <form onSubmit={handleSubmit}>
                                {/* Basic Info Section */}
                                <div className="profile-section-card glass">
                                    <h3><span className="icon">🏢</span> Thông tin chung</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Tên doanh nghiệp (hiển thị)</label>
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

                                {/* Contact Section */}
                                <div className="profile-section-card glass">
                                    <h3><span className="icon">📞</span> Liên hệ & Địa chỉ</h3>
                                    <div className="form-grid">
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
                                            <input 
                                                type="text" name="address" 
                                                value={formData.address} onChange={handleChange} 
                                                disabled={!isEditing}
                                                placeholder="Nhập địa chỉ đầy đủ..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* About Section */}
                                <div className="profile-section-card glass">
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

                                {isEditing && (
                                    <div className="form-actions">
                                        <button type="submit" className="btn-save">Lưu tất cả thay đổi</button>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="profile-sidebar-blocks">
                            <div className="info-block glass">
                                <h4>Trạng thái xác thực</h4>
                                <div className="verification-status verified">
                                    <span className="v-icon">✓</span> Đã xác thực email
                                </div>
                                <div className="verification-status pending">
                                    <span className="v-icon">!</span> Chưa xác thực tư cách pháp nhân
                                </div>
                                <button className="btn-verify-now">Xác thực ngay</button>
                            </div>

                            <div className="info-block glass">
                                <h4>Mẹo cho hồ sơ</h4>
                                <p className="tip-text">Hồ sơ có mô tả chi tiết và hình ảnh thực tế thường thu hút hơn 45% lượt ứng tuyển chất lượng.</p>
                            </div>
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

export default CompanyProfile;
