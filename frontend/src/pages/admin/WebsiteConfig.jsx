import React, { useState, useRef } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import '../../assets/css/admin/AdminManagement.css';
import '../../assets/css/admin/WebsiteConfig.css';

const WebsiteConfig = () => {
    const [activeTab, setActiveTab] = useState('general');
    const logoInputRef = useRef(null);
    const faviconInputRef = useRef(null);

    const [config, setConfig] = useState({
        systemName: 'CareerLink',
        tagline: 'Cổng kết nối việc làm sinh viên',
        logoUrl: '',
        faviconUrl: '',
        facebook: 'https://facebook.com/tranHuy',
        zalo: 'https://zalo.me/0856766210',
        hotline: '19007466',
        senderName: 'Ban Hỗ trợ Nghề nghiệp DAU',
        emailServer: 'smtp.gmail.com',
        emailPort: '587',
        emailAuth: 'niitbeo28@gmail.com',
        appPassword: '',
        seoTitle: 'CareerLink - Hệ thống tìm việc làm',
        seoDescription: 'Nền tảng kết nối sinh viên với các doanh nghiệp hàng đầu',
        seoKeywords: 'tìm việc làm, sinh viên, doanh nghiệp, đại học kiến trúc đà nẵng',
        googleAnalyticsId: 'G-XXXXXXXXXX',
        facebookPixelId: '123456789012345',
        enableProjectChallenges: true,
        enableCareerMentor: true,
        enableChat: true
    });

    const [previews, setPreviews] = useState({
        logo: null,
        favicon: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('Đã lưu cấu hình thành công!');
        console.log('Saved Config:', config);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-main-content">
                <AdminNavbar title="Quản lý Website" />
                <main className="admin-management-container">
                    <div className="management-header">
                        <div className="breadcrumb-dau">
                            DAU Connect <span className="separator">›</span> Quản lý Website
                        </div>
                        <h2 className="management-title">Quản lý Website</h2>
                    </div>

                    <div className="config-tabs">
                        <button 
                            className={`config-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            <span className="material-symbols-outlined">language</span>
                            Thông tin chung
                        </button>
                        <button 
                            className={`config-tab-btn ${activeTab === 'email' ? 'active' : ''}`}
                            onClick={() => setActiveTab('email')}
                        >
                            <span className="material-symbols-outlined">mail</span>
                            Cấu hình Email
                        </button>
                        <button 
                            className={`config-tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('seo')}
                        >
                            <span className="material-symbols-outlined">link</span>
                            SEO & Marketing
                        </button>
                        <button 
                            className={`config-tab-btn ${activeTab === 'module' ? 'active' : ''}`}
                            onClick={() => setActiveTab('module')}
                        >
                            <span className="material-symbols-outlined">layers</span>
                            Cấu hình Module
                        </button>
                    </div>

                    <div className="config-content">
                        {activeTab === 'general' && (
                            <form onSubmit={handleSave}>
                                <div className="config-section">
                                    <div className="config-section-title">
                                        <span className="material-symbols-outlined">computer</span>
                                        <h4>Danh tính Website</h4>
                                    </div>

                                    <div className="identity-grid">
                                        <div className="upload-group">
                                            <span className="upload-label">LOGO HỆ THỐNG</span>
                                            <div className="logo-upload-box" onClick={() => logoInputRef.current?.click()}>
                                                <input 
                                                    type="file" 
                                                    hidden 
                                                    ref={logoInputRef} 
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, 'logo')}
                                                />
                                                {previews.logo ? (
                                                    <img src={previews.logo} alt="Logo Preview" className="upload-preview" />
                                                ) : (
                                                    <div className="upload-placeholder">
                                                        <span className="material-symbols-outlined">image</span>
                                                        <p>NHẤP ĐỂ THAY ĐỔI</p>
                                                    </div>
                                                )}
                                                <div className="upload-overlay">
                                                    <span className="material-symbols-outlined">upload</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="upload-group">
                                            <span className="upload-label">FAVICON</span>
                                            <div className="logo-upload-box favicon" onClick={() => faviconInputRef.current?.click()}>
                                                <input 
                                                    type="file" 
                                                    hidden 
                                                    ref={faviconInputRef} 
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, 'favicon')}
                                                />
                                                {previews.favicon ? (
                                                    <img src={previews.favicon} alt="Favicon Preview" className="upload-preview" />
                                                ) : (
                                                    <div className="upload-placeholder favicon-ph">
                                                        <span className="material-symbols-outlined">drafts</span>
                                                        <p>THAY ĐỔI FAVICON</p>
                                                    </div>
                                                )}
                                                <div className="upload-overlay">
                                                    <span className="material-symbols-outlined">upload</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ flex: 1, minWidth: '300px' }}>
                                            <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                                <div className="config-form-group">
                                                    <label>TÊN HỆ THỐNG <span className="required-star">*</span></label>
                                                    <input 
                                                        type="text" 
                                                        className="config-input" 
                                                        name="systemName"
                                                        value={config.systemName}
                                                        onChange={handleInputChange}
                                                        placeholder="Nhập tên website..."
                                                        required
                                                    />
                                                </div>
                                                <div className="config-form-group">
                                                    <label>SLOGAN / TAGLINE</label>
                                                    <input 
                                                        type="text" 
                                                        className="config-input" 
                                                        name="tagline"
                                                        value={config.tagline}
                                                        onChange={handleInputChange}
                                                        placeholder="Nhập khẩu hiệu website..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="config-section">
                                    <div className="config-section-title">
                                        <span className="material-symbols-outlined">call</span>
                                        <h4>Thông tin liên hệ</h4>
                                    </div>

                                    <div className="config-form-grid">
                                        <div className="config-form-group">
                                            <label>FACEBOOK FANPAGE</label>
                                            <div className="config-input-wrapper">
                                                <span className="material-symbols-outlined">facebook</span>
                                                <input 
                                                    type="text" 
                                                    className="config-input" 
                                                    name="facebook"
                                                    value={config.facebook}
                                                    onChange={handleInputChange}
                                                    placeholder="https://facebook.com/..."
                                                />
                                            </div>
                                        </div>
                                        <div className="config-form-group">
                                            <label>ZALO OA / CHAT</label>
                                            <div className="config-input-wrapper">
                                                <span className="material-symbols-outlined">chat</span>
                                                <input 
                                                    type="text" 
                                                    className="config-input" 
                                                    name="zalo"
                                                    value={config.zalo}
                                                    onChange={handleInputChange}
                                                    placeholder="Mã/Link Zalo..."
                                                />
                                            </div>
                                        </div>
                                        <div className="config-form-group">
                                            <label>HOTLINE HỖ TRỢ</label>
                                            <div className="config-input-wrapper">
                                                <span className="material-symbols-outlined">phone_in_talk</span>
                                                <input 
                                                    type="text" 
                                                    className="config-input" 
                                                    name="hotline"
                                                    value={config.hotline}
                                                    onChange={handleInputChange}
                                                    placeholder="Số điện thoại hỗ trợ..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="config-save-btn">LƯU THAY ĐỔI</button>
                            </form>
                        )}

                        {activeTab === 'email' && (
                            <form onSubmit={handleSave}>
                                <div className="config-section">
                                    <div className="config-section-title">
                                        <span className="material-symbols-outlined">mail</span>
                                        <h4>Cấu hình Email thông báo</h4>
                                    </div>

                                    <div className="config-form-grid">
                                        <div className="config-form-group">
                                            <label>TÊN NGƯỜI GỬI HIỂN THỊ</label>
                                            <input 
                                                type="text" 
                                                className="config-input" 
                                                name="senderName"
                                                value={config.senderName}
                                                onChange={handleInputChange}
                                                placeholder="Nhập tên hiển thị khi gửi email..."
                                            />
                                        </div>
                                        <div className="config-form-group">
                                            <label>SMTP PORT</label>
                                            <input 
                                                type="text" 
                                                className="config-input" 
                                                name="emailPort"
                                                value={config.emailPort}
                                                onChange={handleInputChange}
                                                placeholder="Vd: 587, 465..."
                                            />
                                        </div>
                                        <div className="config-form-group">
                                            <label>SMTP SERVER</label>
                                            <div className="config-input-wrapper">
                                                <span className="material-symbols-outlined">dns</span>
                                                <input 
                                                    type="text" 
                                                    className="config-input" 
                                                    name="emailServer"
                                                    value={config.emailServer}
                                                    onChange={handleInputChange}
                                                    placeholder="Vd: smtp.gmail.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="config-form-group">
                                            <label>EMAIL TÀI KHOẢN (AUTH)</label>
                                            <input 
                                                type="email" 
                                                className="config-input" 
                                                name="emailAuth"
                                                value={config.emailAuth}
                                                onChange={handleInputChange}
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                        <div className="config-form-group">
                                            <label>MẬT KHẨU ỨNG DỤNG (APP PASSWORD)</label>
                                            <div className="config-input-wrapper">
                                                <span className="material-symbols-outlined">key</span>
                                                <input 
                                                    type="password" 
                                                    className="config-input" 
                                                    name="appPassword"
                                                    value={config.appPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="••••••••••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="config-save-btn">
                                    <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>save</span>
                                    Lưu cấu hình
                                </button>
                            </form>
                        )}

                        {activeTab === 'seo' && (
                            <form onSubmit={handleSave}>
                                <div className="config-section">
                                    <div className="config-section-title">
                                        <span className="material-symbols-outlined">search</span>
                                        <h4>Cài đặt SEO <span style={{fontSize: '0.8rem', fontWeight: 400, color: '#94a3b8', textTransform: 'none', marginLeft: '10px'}}>(Tối ưu hóa công cụ tìm kiếm)</span></h4>
                                    </div>

                                    <div className="config-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                        <div className="config-form-group">
                                            <label>META TITLE</label>
                                            <input 
                                                type="text" 
                                                className="config-input" 
                                                name="seoTitle"
                                                value={config.seoTitle}
                                                onChange={handleInputChange}
                                                placeholder="Tiêu đề trang web hiển thị trên Google..."
                                            />
                                        </div>
                                        <div className="config-form-group">
                                            <label>META DESCRIPTION</label>
                                            <textarea 
                                                className="config-input" 
                                                name="seoDescription"
                                                value={config.seoDescription}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Mô tả ngắn về trang web..."
                                                style={{ resize: 'vertical' }}
                                            />
                                        </div>
                                        <div className="config-form-group">
                                            <label>META KEYWORDS</label>
                                            <input 
                                                type="text" 
                                                className="config-input" 
                                                name="seoKeywords"
                                                value={config.seoKeywords || 'tìm việc làm, sinh viên, doanh nghiệp, đại học kiến trúc đà nẵng'}
                                                onChange={handleInputChange}
                                                placeholder="Từ khóa cách nhau bởi dấu phẩy..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="config-section">
                                    <div className="config-section-title">
                                        <span className="material-symbols-outlined">analytics</span>
                                        <h4>Tracking & Analytics</h4>
                                    </div>

                                    <div className="config-form-grid">
                                        <div className="config-form-group">
                                            <label>GOOGLE ANALYTICS ID</label>
                                            <input 
                                                type="text" 
                                                className="config-input" 
                                                name="googleAnalyticsId"
                                                value={config.googleAnalyticsId || 'G-XXXXXXXXXX'}
                                                onChange={handleInputChange}
                                                placeholder="G-XXXXXXXXXX"
                                            />
                                        </div>
                                        <div className="config-form-group">
                                            <label>FACEBOOK PIXEL ID</label>
                                            <input 
                                                type="text" 
                                                className="config-input" 
                                                name="facebookPixelId"
                                                value={config.facebookPixelId || '123456789012345'}
                                                onChange={handleInputChange}
                                                placeholder="Nhập ID Facebook Pixel..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="config-save-btn">
                                    <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>save</span>
                                    Lưu cấu hình
                                </button>
                            </form>
                        )}

                        {activeTab === 'module' && (
                            <form onSubmit={handleSave}>
                                <div className="config-section">
                                    <div className="config-section-title">
                                        <span className="material-symbols-outlined">layers</span>
                                        <h4>Tùy chọn hiển thị Module <span style={{fontSize: '0.8rem', fontWeight: 400, color: '#94a3b8', textTransform: 'none', marginLeft: '10px'}}>(Áp dụng cho toàn bộ hệ thống, bao gồm cả Admin)</span></h4>
                                    </div>

                                    <div className="module-list-container">
                                        <div className="module-item">
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={config.enableProjectChallenges}
                                                    onChange={(e) => setConfig({ ...config, enableProjectChallenges: e.target.checked })}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <div className="module-info">
                                                <h5>Hiển thị tính năng "Thử thách dự án"</h5>
                                                <p>Khi bật, sinh viên và doanh nghiệp sẽ thấy và tham gia các thử thách, dự án thực tế.</p>
                                            </div>
                                        </div>

                                        <div className="module-item">
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={config.enableCareerMentor}
                                                    onChange={(e) => setConfig({ ...config, enableCareerMentor: e.target.checked })}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <div className="module-info">
                                                <h5>Hiển thị tính năng "Cố vấn nghề nghiệp"</h5>
                                                <p>Khi bật, sinh viên sẽ thấy tính năng đặt lịch, xem danh sách cố vấn chuyên gia.</p>
                                            </div>
                                        </div>

                                        <div className="module-item">
                                            <label className="switch">
                                                <input 
                                                    type="checkbox" 
                                                    checked={config.enableChat}
                                                    onChange={(e) => setConfig({ ...config, enableChat: e.target.checked })}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <div className="module-info">
                                                <h5>Hiển thị tính năng "Tin nhắn / Chat"</h5>
                                                <p>Khi tắt, menu Tin nhắn sẽ ẩn trên toàn hệ thống cho sinh viên và doanh nghiệp.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="config-save-btn">
                                    <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>save</span>
                                    Lưu cấu hình
                                </button>
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default WebsiteConfig;
