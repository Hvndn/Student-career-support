import React from 'react';
import CompanySidebar from '../../components/company/CompanySidebar';
import CompanyNavbar from '../../components/company/CompanyNavbar';
import '../../assets/css/company/CompanyCandidateNotifications.css';

// [FE Logic] Trang thông báo và hướng dẫn thiết lập nhận thông báo ứng viên phù hợp qua Email
const CompanyCandidateNotifications = () => {
    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyNavbar title="Thông báo hồ sơ" />
                <main className="cd-main">
                    <div className="candidate-notifications-page">
                        <div className="notif-header intro-y">
                            <h2>Thông báo hồ sơ phù hợp</h2>
                            <p className="subtitle">Hệ thống thông minh tự động tìm kiếm và thông báo cho bạn những ứng viên tiềm năng nhất mỗi ngày.</p>
                        </div>

                        <div className="notification-settings-card intro-y delay-1">
                            <div className="setting-info-box">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="#1e3a8a" strokeWidth="2" fill="none">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div className="info-text">
                                    <h4>Thông báo qua Email (0/5)</h4>
                                    <p>Tối ưu hóa quy trình tuyển dụng của bạn bằng cách nhận danh sách ứng viên chất lượng trực tiếp qua hòm thư điện tử.</p>
                                </div>
                            </div>

                            <div className="setup-guide">
                                <h5>Quy trình thiết lập đơn giản</h5>
                                <div className="guide-steps-container">
                                    <div className="step-card">
                                        <div className="step-number">01</div>
                                        <div className="step-icon"><i className="fa-solid fa-magnifying-glass"></i></div>
                                        <div className="step-text">Truy cập trang <strong>Tìm ứng viên mới</strong> để bắt đầu.</div>
                                    </div>
                                    <div className="step-card">
                                        <div className="step-number">02</div>
                                        <div className="step-icon"><i className="fa-solid fa-filter"></i></div>
                                        <div className="step-text">Thiết lập <strong>Bộ lọc</strong> (vị trí, kỹ năng...) phù hợp với tiêu chí.</div>
                                    </div>
                                    <div className="step-card">
                                        <div className="step-number">03</div>
                                        <div className="step-icon"><i className="fa-solid fa-bell"></i></div>
                                        <div className="step-text">Lưu bộ lọc và kích hoạt <strong>"Nhận thông báo qua email"</strong>.</div>
                                    </div>
                                </div>
                                <button className="btn-go-search" onClick={() => window.location.href='/company/management/candidates'}>
                                    Đi tới trang tìm ứng viên
                                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="notification-status-panel intro-y delay-2">
                            <div className="status-card">
                                <div className="status-label">Trạng thái</div>
                                <div className="status-value active">Đang hoạt động</div>
                            </div>
                            <div className="status-card">
                                <div className="status-label">Hòm thư nhận tin</div>
                                <div className="status-value">hr@company.com</div>
                            </div>
                            <div className="status-card">
                                <div className="status-label">Tần suất gửi</div>
                                <div className="status-value">Hàng ngày (08:00 AM)</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyCandidateNotifications;
