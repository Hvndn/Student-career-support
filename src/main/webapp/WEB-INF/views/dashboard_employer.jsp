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

    <style>
      body {
        background: #f5f7fb;
        font-family: system-ui;
      }

      /* navbar */

      .navbar {
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
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

      /* feature */

      .feature {
        padding: 60px 0;
      }

      .feature-card {
        background: white;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      /* CTA */

      .cta {
        background: linear-gradient(120deg, #0f172a, #1e3a8a);
        color: white;
        padding: 60px;
        border-radius: 20px;
        text-align: center;
        margin: 80px 0;
      }

      footer {
        background: #f1f3f5;
        padding: 40px 0;
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
          <h2>50,000+</h2>
          <p>Sinh viên tài năng</p>
        </div>

        <div class="col-md-4">
          <h2>2,000+</h2>
          <p>Trường đại học</p>
        </div>

        <div class="col-md-4">
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
            <h5>Đăng tin nhanh chóng</h5>

            <p class="text-muted">
              Tiếp cận hàng nghìn sinh viên chỉ với vài cú click.
            </p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="feature-card">
            <h5>Bộ lọc thông minh</h5>

            <p class="text-muted">Lọc ứng viên theo kỹ năng và kinh nghiệm.</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="feature-card">
            <h5>Quản lý ứng viên</h5>

            <p class="text-muted">Quản lý toàn bộ quy trình tuyển dụng.</p>
          </div>
        </div>

        <div class="col-md-3">
          <div class="feature-card">
            <h5>Phân tích dữ liệu</h5>

            <p class="text-muted">
              Theo dõi hiệu quả tuyển dụng theo thời gian.
            </p>
          </div>
        </div>
      </div>
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

            <p>Kết nối nguồn nhân lực trẻ tài năng với doanh nghiệp.</p>
          </div>

          <div class="col-md-4">
            <h6>Sản phẩm</h6>

            <p>Tính năng</p>
            <p>Bảng giá</p>
          </div>

          <div class="col-md-4">
            <h6>Liên hệ</h6>

            <p>contact@unitalent.vn</p>
          </div>
        </div>
      </div>
    </footer>
  </body>
</html>
