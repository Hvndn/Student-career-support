import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EmployerPricing.css';

const EmployerPricing = () => {
  const [cartQuantities, setCartQuantities] = useState({
    tinCoBan: 1,
    tinTuyenNhanh: 1,
    tuyenGap: 1,
    tieuDeDo: 1,
  });

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateQuantity = (key, delta) => {
    setCartQuantities(prev => ({
      ...prev,
      [key]: Math.max(1, prev[key] + delta)
    }));
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="employer-pricing-page fade-in">
      {/* Custom Navbar */}
      <nav className="employer-nav compact-nav" style={{marginBottom: 0}}>
        <div className="nav-container">
          <Link to="/employer" className="brand-logo">
            <strong>Curator Recruit</strong>
          </Link>
          <div className="nav-links">
            <Link to="/employer#features">Tính năng</Link>
            <Link to="/employer/pricing" className="active">Bảng giá</Link>
            <Link to="/employer#solutions">Tìm ứng viên</Link>
            <Link to="/employer#resources">Tài nguyên</Link>
          </div>
          <div className="nav-auth">
            <Link to="/" className="switch-role">Dành cho Người tìm việc</Link>
            <Link to="/login" className="login-btn">Đăng nhập</Link>
            <Link to="/register" className="register-btn">Đăng ký</Link>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <h1>Bảng giá linh hoạt cho <span className="text-blue">Nhà tuyển dụng</span></h1>
          <p>Lựa chọn gói dịch vụ phù hợp nhất để tối ưu hiệu quả tuyển dụng và xây dựng thương hiệu doanh nghiệp.</p>
        </div>
      </section>

      {/* Anchor Navigation with Icons */}
      <div className={`pricing-anchors-container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="pricing-anchors">
          <button onClick={() => scrollToSection('tin-dang')} className="anchor-item">
            <span className="anchor-icon">📝</span>
            <span>Tin đăng tuyển dụng</span>
          </button>
          <button onClick={() => scrollToSection('gia-tang')} className="anchor-item">
            <span className="anchor-icon">🚀</span>
            <span>Gia tăng độ hiển thị</span>
          </button>
          <button onClick={() => scrollToSection('hieu-ung')} className="anchor-item">
            <span className="anchor-icon">✨</span>
            <span>Hiệu ứng nổi bật tin</span>
          </button>
          <button onClick={() => scrollToSection('diem-dich-vu')} className="anchor-item">
            <span className="anchor-icon">💎</span>
            <span>Điểm dịch vụ</span>
          </button>
          <button onClick={() => scrollToSection('thuong-hieu')} className="anchor-item">
            <span className="anchor-icon">🏢</span>
            <span>Quảng bá thương hiệu</span>
          </button>
        </div>
      </div>

      <div className="pricing-sections-wrapper">
        {/* Section 1: Tin đăng tuyển dụng */}
        <section id="tin-dang" className="pricing-block">
          <h2 className="section-title">Tin đăng tuyển dụng</h2>
          <div className="service-list">
            
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon-box bg-purple" style={{color: '#9333ea'}}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="service-title-info">
                  <h3>Tin cơ bản</h3>
                  <p>Tin của bạn được đăng trên hệ thống trong 4 tuần, chưa bao gồm dịch vụ nâng cấp/hiệu ứng.</p>
                </div>
              </div>
              <div className="service-body">
                <div className="service-control">
                  <label>Số lượng</label>
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity('tinCoBan', -1)}>-</button>
                    <span>{cartQuantities.tinCoBan}</span>
                    <button onClick={() => updateQuantity('tinCoBan', 1)}>+</button>
                  </div>
                </div>
                <div className="service-control">
                  <label>Thời lượng</label>
                  <strong>4 tuần</strong>
                </div>
                <div className="service-price">
                  <span>Giá bán</span>
                  <div className="price-value">1,720,000 đ</div>
                </div>
                <div className="service-action">
                  <button className="btn-add-cart">🛒 Thêm vào giỏ</button>
                </div>
              </div>
            </div>

            <div className="service-card highlight-card">
              <div className="badge-hot">🔥 MỚI</div>
              <div className="service-header">
                <div className="service-icon-box bg-orange" style={{color: '#ea580c'}}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <div className="service-title-info">
                  <h3>Tin tuyển nhanh</h3>
                  <p>Tin đăng hiển thị tại mục "Việc đi làm ngay" trên trang chủ.</p>
                </div>
              </div>
              <div className="service-body">
                <div className="service-control">
                  <label>Số lượng</label>
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity('tinTuyenNhanh', -1)}>-</button>
                    <span>{cartQuantities.tinTuyenNhanh}</span>
                    <button onClick={() => updateQuantity('tinTuyenNhanh', 1)}>+</button>
                  </div>
                </div>
                <div className="service-control">
                  <label>Thời lượng</label>
                  <strong>1 tuần</strong>
                </div>
                <div className="service-price">
                  <span>Giá bán</span>
                  <div className="price-old">3,690,000 đ</div>
                  <div className="price-value highlight">2,583,000 đ</div>
                </div>
                <div className="service-action">
                  <button className="btn-add-cart">🛒 Thêm vào giỏ</button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Gia tăng độ hiển thị */}
        <section id="gia-tang" className="pricing-block">
          <h2 className="section-title">Gia tăng độ hiển thị <span className="tag-yellow">TRENDING</span></h2>
          <div className="service-list">
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon-box bg-blue" style={{color: '#2563eb'}}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>
                </div>
                <div className="service-title-info">
                  <h3>Trang chủ - Tuyển gấp</h3>
                  <p>Sử dụng cùng tin cơ bản: hiển thị tại mục "Việc làm tuyển gấp" trên trang chủ.</p>
                </div>
              </div>
              <div className="service-body">
                <div className="service-control">
                  <label>Số lượng</label>
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity('tuyenGap', -1)}>-</button>
                    <span>{cartQuantities.tuyenGap}</span>
                    <button onClick={() => updateQuantity('tuyenGap', 1)}>+</button>
                  </div>
                </div>
                <div className="service-control">
                  <label>Thời lượng</label>
                  <select className="duration-select">
                    <option>1 Tuần</option>
                    <option>2 Tuần</option>
                  </select>
                </div>
                <div className="service-price">
                  <span>Giá bán</span>
                  <div className="price-value">3,260,000 đ</div>
                </div>
                <div className="service-action">
                  <button className="btn-add-cart">🛒 Thêm vào giỏ</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Hiệu ứng nổi bật tin */}
        <section id="hieu-ung" className="pricing-block">
          <h2 className="section-title">Hiệu ứng nổi bật tin</h2>
          <div className="service-list">
            <div className="service-card">
              <div className="service-header">
                <div className="service-icon-box bg-red" style={{color: '#dc2626'}}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div className="service-title-info">
                  <h3>Tiêu đề đỏ, in đậm</h3>
                  <p>Làm nổi bật tiêu đề tin tuyển dụng trong danh sách kết quả tìm kiếm.</p>
                </div>
              </div>
              <div className="service-body">
                <div className="service-control">
                  <label>Số lượng</label>
                  <div className="quantity-box">
                    <button onClick={() => updateQuantity('tieuDeDo', -1)}>-</button>
                    <span>{cartQuantities.tieuDeDo}</span>
                    <button onClick={() => updateQuantity('tieuDeDo', 1)}>+</button>
                  </div>
                </div>
                <div className="service-control">
                  <label>Thời lượng</label>
                  <select className="duration-select">
                    <option>1 Tuần</option>
                  </select>
                </div>
                <div className="service-price">
                  <span>Giá bán</span>
                  <div className="price-value">550,000 đ</div>
                </div>
                <div className="service-action">
                  <button className="btn-add-cart">🛒 Thêm vào giỏ</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dummies for scrolling content bounds */}
        <section id="diem-dich-vu" className="pricing-block" style={{minHeight: '200px'}}>
            <h2 className="section-title">Điểm dịch vụ</h2>
            <p style={{color: '#64748b'}}>Đang cập nhật...</p>
        </section>
        
        <section id="thuong-hieu" className="pricing-block" style={{minHeight: '200px'}}>
            <h2 className="section-title">Quảng bá thương hiệu</h2>
            <p style={{color: '#64748b'}}>Đang cập nhật...</p>
        </section>
      </div>

      {/* Floating Cart (Bottom) */}
      <div className="floating-cart">
        <div className="cart-left">
          <button className="cart-btn">🛒 0 sản phẩm <span style={{marginLeft: '10px'}}>^</span></button>
        </div>
        <div className="cart-right">
          <span className="vat-note">Tổng giá (Chưa bao gồm thuế VAT):</span>
          <strong className="total-price">0 đ</strong>
          <button className="btn-checkout">Đặt hàng ➔</button>
        </div>
      </div>
      
    </div>
  );
};

export default EmployerPricing;

