import React from 'react';
import CompanySidebar from '../../components/CompanySidebar';
import CompanyTopbar from '../../components/CompanyTopbar';
import '../../assets/css/CompanyCandidateNotifications.css';

const CompanyCandidateNotifications = () => {
    return (
        <div className="company-dashboard-container">
            <CompanySidebar />
            <div className="company-main-content">
                <CompanyTopbar title="Ứng viên" />
                <main className="cd-main">
                    <div className="candidate-notifications-page">
                        <div className="notif-header">
                            <h2 className="title-with-count">Thông báo hồ sơ phù hợp</h2>
                            <p className="subtitle">Nhận thông báo tự động ngay khi có ứng viên mới phù hợp với tiêu chí tuyển dụng của bạn.</p>
                        </div>

                        <div className="notification-settings-card glass">
                            <div className="setting-info-box">
                                <div className="info-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="#7c3aed" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <div className="info-text">
                                    <h4>Thông báo hồ sơ ứng viên phù hợp qua email (0/5)</h4>
                                    <p>Hệ thống sẽ tự động quét và gửi những ứng viên tiềm năng nhất dựa trên bộ lọc mà bạn đã thiết lập.</p>
                                </div>
                            </div>

                            <div className="setup-guide">
                                <h5>Làm thế nào để nhận thông báo?</h5>
                                <ol className="guide-steps">
                                    <li>Truy cập trang <strong>Tìm ứng viên mới</strong>.</li>
                                    <li>Sử dụng các bộ lọc (Vị trí, Kỹ năng, Địa điểm...) để tìm kiếm ứng viên phù hợp.</li>
                                    <li>Nhấn <strong>"Lưu bộ lọc"</strong> và bật tùy chọn <strong>"Nhận thông báo qua email"</strong>.</li>
                                </ol>
                                <button className="btn-go-search" onClick={() => window.location.href='/company/candidates/search'}>
                                    Đi tới trang tìm ứng viên
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                            </div>
                        </div>

                        <div className="notification-status-panel">
                            <div className="status-item">
                                <div className="status-label">Trạng thái thông báo</div>
                                <div className="status-value active">Đang hoạt động</div>
                            </div>
                            <div className="status-item">
                                <div className="status-label">Email nhận tin</div>
                                <div className="status-value">hr@company.com</div>
                            </div>
                            <div className="status-item">
                                <div className="status-label">Tần suất nhận</div>
                                <div className="status-value">Hàng ngày</div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CompanyCandidateNotifications;
