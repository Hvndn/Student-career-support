import React from 'react';
import { Link } from 'react-router-dom';
import "../../EmployerHome.css";

const EmployerHome = () => {
  return (
    <div className="employer-home fade-in">
      {/* Custom Navbar for Employer Landing Page */}
      <nav className="employer-nav">
        <div className="nav-container">
          <Link to="/employer" className="brand-logo">
            <strong>Curator Recruit</strong>
          </Link>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#solutions">Solutions</a>
            <a href="#resources">Resources</a>
            <Link to="/" className="switch-role">Dành cho Người tìm việc</Link>
          </div>
          <div className="nav-auth">
            <Link to="/login" className="login-btn">Đăng nhập</Link>
            <Link to="/register" className="register-btn">Đăng ký</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tuyển dụng nhân tài đột phá cùng <span className="text-blue">Nexus Talent</span>
          </h1>
          <p className="hero-subtitle">
            Nền tảng quản trị tuyển dụng thông minh giúp doanh nghiệp tìm thấy mảnh ghép hoàn hảo nhanh hơn 3 lần nhờ sức mạnh AI.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary-blue">Đăng ký ngay</Link>
            <button className="btn-secondary-light">Đặt lịch tư vấn</button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="dashboard-mockup">
            <div className="mockup-header">
              <div className="dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="mockup-body">
               <div className="mockup-line title-line"></div>
               <div className="mockup-card">dashboard<br/>Nexus</div>
               <div className="mockup-line"></div>
               <div className="mockup-line short"></div>
               <div className="mockup-line"></div>
            </div>
          </div>
          <div className="floating-card">
            <div className="card-icon">✓</div>
            <div className="card-text">
              <strong>Match Score 95%</strong>
              <p>Ứng viên tuyến kế toán phù hợp nhất đã được tìm thấy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <h2>2M+</h2>
          <p>ỨNG VIÊN TIỀM NĂNG</p>
        </div>
        <div className="stat-item">
          <h2 className="text-blue">50k+</h2>
          <p>DOANH NGHIỆP TIN DÙNG</p>
        </div>
        <div className="stat-item">
          <h2>95%</h2>
          <p>TỶ LỆ KHỚP LỆNH</p>
        </div>
        <div className="stat-item">
          <h2 className="text-blue">3.5x</h2>
          <p>TỐC ĐỘ TUYỂN DỤNG</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-header">
          <span className="section-tag">GIẢI PHÁP TỐI ƯU</span>
          <h2>Đặc quyền dành riêng cho Nhà tuyển dụng</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card main-feature">
            <div className="feature-icon blue-icon">🤖</div>
            <h3>AI Gợi ý Ứng viên Thông minh</h3>
            <p>Thuật toán Machine Learning tự động phân tích CV và xếp hạng ứng viên dựa trên độ tương thích thực tế với mô tả công việc.</p>
            <div className="feature-mockup mt-auto">
              <div className="mockup-row"><div className="avatar box"></div> <div className="bar"></div> <div className="score">98% Match</div></div>
              <div className="mockup-row"><div className="avatar box"></div> <div className="bar short"></div> <div className="score">85% Match</div></div>
            </div>
          </div>
          <div className="feature-column">
            <div className="feature-card solid-blue">
              <div className="feature-icon white-icon">⚡</div>
              <h3>Tích hợp đa kênh</h3>
              <p>Đăng tin một lần, phủ sóng tiếp thị xuất trên 50+ nền tảng mạng xã hội và báo chí.</p>
            </div>
            <div className="feature-card solid-green">
              <div className="feature-icon white-icon">📊</div>
              <h3>Báo cáo chi tiết</h3>
              <p>Hệ thống phân tích chuyển đổi ứng viên theo thời gian thực.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="pricing-header">
          <h2>Gói dịch vụ linh hoạt</h2>
          <p>Phù hợp cho mọi quy mô doanh nghiệp từ Startup đến Corporation.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <span className="plan-name">CƠ BẢN</span>
            <h3 className="plan-price">Free</h3>
            <ul className="plan-features">
              <li>✓ 03 Tin tuyển dụng/tháng</li>
              <li>✓ Quản lý hồ sơ cơ bản</li>
              <li className="disabled">× AI Gợi ý ứng viên</li>
            </ul>
            <button className="btn-outline-blue">Bắt đầu ngay</button>
          </div>
          <div className="price-card popular">
            <div className="popular-badge">PHỔ BIẾN NHẤT</div>
            <span className="plan-name text-blue">CHUYÊN NGHIỆP</span>
            <h3 className="plan-price">2.5M <span className="per-month">/tháng</span></h3>
            <ul className="plan-features">
              <li>✓ 15 Tin tuyển dụng/tháng</li>
              <li>✓ AI Gợi ý 50 ứng viên/vị trí</li>
              <li>✓ Nổi bật trên tin tuyển dụng</li>
              <li>✓ Tích hợp đa nền tảng</li>
            </ul>
            <button className="btn-primary-blue full-width">Chọn gói Pro</button>
          </div>
          <div className="price-card">
            <span className="plan-name text-blue">DOANH NGHIỆP</span>
            <h3 className="plan-price">Liên hệ</h3>
            <ul className="plan-features">
              <li>✓ Không giới hạn tin tuyển dụng</li>
              <li>✓ Tài khoản quản lý team (20+)</li>
              <li>✓ Support 24/7 riêng biệt</li>
            </ul>
            <button className="btn-outline-dark">Liên hệ Sales</button>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <p className="partners-title">ĐƯỢC TIN TƯỞNG BỞI CÁC DOANH NGHIỆP HÀNG ĐẦU</p>
        <div className="partners-logos">
          <div className="logo-placeholder">Partner Logo</div>
          <div className="logo-placeholder diamond"></div>
          <div className="logo-placeholder">Partner Logo</div>
          <div className="logo-placeholder square"></div>
          <div className="logo-placeholder circle"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Sẵn sàng để sở hữu đội ngũ mơ ước?</h2>
          <p>Đăng ký tài khoản nhà tuyển dụng ngay hôm nay và nhận ưu đãi 50% cho gói dịch vụ đầu tiên.</p>
          <div className="cta-actions">
            <button className="btn-white">Đăng ký ngay</button>
            <button className="btn-outline-white">Tư vấn giải pháp</button>
          </div>
        </div>
      </section>

      {/* Footer (Simplified for landing page) */}
      <footer className="employer-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>Curator Recruit</strong>
            <p>© 2024 Curator Recruit. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployerHome;
