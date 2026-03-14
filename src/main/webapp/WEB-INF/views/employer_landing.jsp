<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>UniTalent</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet"
href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

    <style>
      body {
        background: #f5f7fb;
        font-family: system-ui;
      }

      /* navbar */

      .navbar {
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
        border-bottom: 1px solid #e5e7eb;
      }

      /* hero */

      .hero {
        padding: 80px 0;
      }

      .hero-title {
        font-size: 46px;
        font-weight: 700;
      }

      .hero-title span {
        color: #2563eb;
      }

      .hero-img {
        background: white;
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
      }

      .hero-img:hover {
        transform: translateY(-5px);
        box-shadow: 0 18px 35px rgba(0, 0, 0, 0.12);
      }

      /* stats */

      .stats {
        padding: 40px 0;
        text-align: center;
      }

      .stats h2 {
        color: #2563eb;
        font-weight: 700;
      }
      .stats-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 25px;
        transition: all 0.25s ease;
      }

      .stats-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      }
      /* feature */

      .feature {
        padding: 60px 0;
      }

      .feature-card {
        background: white;
        border-radius: 14px;
        padding: 25px;
        border: 1px solid #e5e7eb;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
        transition: all 0.25s ease;
      }

      .feature-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.12);
      }

      /* CTA */

      .cta {
        background: linear-gradient(120deg, #0f172a, #1e3a8a);
        color: white;
        padding: 60px;
        border-radius: 20px;
        text-align: center;
        margin: 80px 0;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
      }

      /* button animation */

      .btn {
        transition: all 0.2s ease;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.4);
      }

      .btn-light:hover {
        background: #f3f4f6;
        transform: translateY(-2px);
      }

      /* footer */

      footer {
        background: #f1f3f5;
        padding: 40px 0;
        border-top: 1px solid #e5e7eb;
      }
      /* feature icon */

.feature-icon{
  width:40px;
  height:40px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#eef2ff;
  color:#2563eb;
  border-radius:8px;
  font-size:18px;
  margin-bottom:10px;
}

/* feature card */

.feature-card{
  background:white;
  border-radius:14px;
  padding:25px;
  border:1px solid #e5e7eb;
  transition:all .25s ease;
}

.feature-card:hover{
  transform:translateY(-6px);
  box-shadow:0 15px 30px rgba(0,0,0,0.12);
}

/* company logo */

.company{
  text-align:center;
  padding:30px 0;
  color:#6b7280;
}

.company span{
  margin:0 20px;
  font-weight:500;
}

/* CTA */

.cta{
  background:linear-gradient(120deg,#0f172a,#1e3a8a);
  color:white;
  padding:60px;
  border-radius:20px;
  text-align:center;
  margin:80px auto;
  max-width:900px;
  box-shadow:0 20px 40px rgba(0,0,0,0.25);
}

/* footer */

footer{
  background:#f1f3f5;
  padding:50px 0;
  border-top:1px solid #e5e7eb;
}

.footer-title{
  font-weight:600;
  margin-bottom:10px;
}

.footer-text{
  color:#6b7280;
  font-size:14px;
}

.social i{
  font-size:18px;
  margin-right:12px;
  color:#6b7280;
}
    </style>
  </head>

  <body>
    <!-- NAVBAR -->

    <nav class="navbar navbar-expand-lg px-4">
      <a class="navbar-brand fw-bold">UniTalent</a>

      <ul class="navbar-nav ms-4">
        <li class="nav-item"><a class="nav-link">Tính năng</a></li>
        <li class="nav-item"><a class="nav-link">Bảng giá</a></li>
        <li class="nav-item"><a class="nav-link">Giải pháp</a></li>
        <li class="nav-item"><a class="nav-link">Về chúng tôi</a></li>
      </ul>

      <div class="ms-auto">
        <a href="/login" class="btn btn-outline-primary me-2">Đăng nhập</a>

        <a class="btn btn-primary">Bắt đầu miễn phí</a>
      </div>
    </nav>

    <!-- HERO -->

    <div class="container hero">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="hero-title">
            Tìm kiếm tài năng <br />
            <span>sinh viên</span> xuất sắc nhất
          </h1>

          <p class="text-muted mt-3">
            Giải pháp tuyển dụng thông minh giúp doanh nghiệp kết nối trực tiếp
            với sinh viên tài năng từ hơn 2000 trường đại học.
          </p>

          <div class="mt-4">
            <button class="btn btn-primary btn-lg">
              Đăng tin tuyển dụng ngay
            </button>

            <button class="btn btn-light btn-lg">Xem bản demo</button>
          </div>
        </div>

        <div class="col-md-6">
          <div class="hero-img">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              class="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- STATS -->

    <div class="container stats">
      <div class="row">
        <div class="col-md-4">
          <div class="stats-card">
            <h2>50,000+</h2>
            <p>Sinh viên tài năng</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="stats-card">
            <h2>2,000+</h2>
            <p>Trường đại học</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stats-card">
          <h2>95%</h2>
          <p>Tỷ lệ hài lòng</p>
        </div>
      </div>
    </div>

    <!-- FEATURES -->

    <div class="container feature">
      <h3 class="text-center mb-5">Tính năng ưu việt cho Nhà tuyển dụng</h3>

      <div class="row">
        <div class="col-md-3">
  <div class="feature-card">

    <div class="feature-icon">
      <i class="bi bi-lightning-fill"></i>
    </div>

    <h5>Đăng tin nhanh chóng</h5>

    <p class="text-muted">
      Tiếp cận hàng nghìn sinh viên chỉ với vài cú click.
    </p>

  </div>
</div>

        <div class="col-md-3">
          <div class="feature-card">
             <div class="feature-icon">
      <i class="bi bi-funnel-fill"></i>
    </div>
            <h5>Bộ lọc thông minh</h5>

            <p class="text-muted">Lọc ứng viên theo kỹ năng và kinh nghiệm.</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="feature-card">
             <div class="feature-icon">
      <i class="bi bi-people-fill"></i>
    </div>
            <h5>Quản lý ứng viên</h5>

            <p class="text-muted">Quản lý toàn bộ quy trình tuyển dụng.</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="feature-card">
             <div class="feature-icon">
      <i class="bi bi-bar-chart-fill"></i>
    </div>
            <h5>Phân tích dữ liệu</h5>

            <p class="text-muted">
              Theo dõi hiệu quả tuyển dụng theo thời gian.
            </p>
          </div>
        </div>
      </div>
    </div>
<div class="company">
  <p class="text-uppercase small text-muted mb-3">
    Đồng hành cùng các doanh nghiệp hàng đầu
  </p>

  <span><i class="bi bi-building"></i> FPT Software</span>
  <span><i class="bi bi-building"></i> Vingroup</span>
  <span><i class="bi bi-building"></i> Viettel</span>
  <span><i class="bi bi-wallet2"></i> MoMo</span>
  <span><i class="bi bi-broadcast"></i> VNPT</span>
</div>
    <!-- CTA -->

    <div class="container">
      <div class="cta">
        <h2>Sẵn sàng nâng tầm đội ngũ của bạn?</h2>

        <p class="mt-3">
          Tham gia cùng hàng nghìn doanh nghiệp đang tuyển dụng sinh viên xuất
          sắc.
        </p>

        <button class="btn btn-primary btn-lg mt-3">
          Đăng ký doanh nghiệp
        </button>

        <button class="btn btn-outline-light btn-lg mt-3">
          Liên hệ tư vấn
        </button>
      </div>
    </div>

    <!-- FOOTER -->

    <footer>
  <div class="container">

    <div class="row">

      <div class="col-md-4">

        <h5>UniTalent</h5>

        <p class="footer-text">
        Kết nối nguồn nhân lực trẻ tài năng với doanh nghiệp
        thông qua giải pháp công nghệ tuyển dụng đột phá.
        </p>

        <div class="social">
          <i class="bi bi-facebook"></i>
          <i class="bi bi-globe"></i>
          <i class="bi bi-linkedin"></i>
        </div>

      </div>

      <div class="col-md-4">

        <div class="footer-title">Sản phẩm</div>

        <p class="footer-text">Tính năng</p>
        <p class="footer-text">Bảng giá</p>
        <p class="footer-text">Dành cho sinh viên</p>
        <p class="footer-text">Ứng dụng di động</p>

      </div>

      <div class="col-md-4">

        <div class="footer-title">Liên hệ</div>

        <p class="footer-text">
        contact@unitalent.vn
        </p>

        <p class="footer-text">
        +84 123 456 789
        </p>

        <p class="footer-text">
        Tòa nhà Innovation, Quận 12, TP.HCM
        </p>

      </div>

    </div>

  </div>
</footer>
  </body>
</html>
