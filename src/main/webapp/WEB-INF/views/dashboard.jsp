<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!doctype html>
<html lang="vi" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>JobPortal - Tìm việc</title>

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
        background: white;
        padding: 40px;
        border-radius: 12px;
        margin-bottom: 20px;
      }

      .search-box {
        background: #f1f3f7;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        gap: 10px;
      }

      /* filter */

      .filter-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
      }

      /* job card */

      .job-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 15px;
        transition: 0.2s;
        border: 1px solid #eee;
      }

      .job-card:hover {
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      }

      .company-logo {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        background: #eaeaea;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
      }

      .tag {
        font-size: 12px;
        background: #eef2ff;
        color: #4f46e5;
        padding: 3px 8px;
        border-radius: 5px;
        margin-right: 5px;
      }

      /* footer */

      .footer {
        margin-top: 60px;
        background: white;
        padding: 40px;
      }
    </style>
  </head>

  <body>
    <!-- NAVBAR -->

    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center gap-2">
          <img src="/images/logo.png" width="32" />
          UniCareer
        </a>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item me-3">
            <a class="nav-link">Việc làm</a>
          </li>

          <li class="nav-item me-3">
            <a class="nav-link">Công ty</a>
          </li>

          <li class="nav-item me-3">
            <a class="nav-link">Cẩm nang</a>
          </li>

          <li class="nav-item me-3">
            <a class="nav-link">Của tôi</a>
          </li>

          <li class="nav-item me-2">
            <a href="/employer" class="btn btn-outline-dark">
              Nhà tuyển dụng
            </a>
          </li>

          <li class="nav-item me-2">
            <a href="/register" class="btn btn-primary"> Đăng ký </a>
          </li>

          <li class="nav-item">
            <a href="/login" class="btn btn-outline-secondary"> Đăng nhập </a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container mt-4">
      <!-- HERO -->

      <div class="hero">
        <h3 class="fw-bold">Cổng Tìm kiếm Việc làm cho Sinh viên</h3>

        <p class="text-muted">
          Khám phá hàng ngàn cơ hội thực tập và việc làm hấp dẫn cho tương lai
          của bạn
        </p>

        <div class="search-box mt-3">
          <input
            class="form-control"
            placeholder="Tìm kiếm chức danh, công nghệ, công ty..."
          />

          <button class="btn btn-primary">Tìm kiếm ngay</button>
        </div>
      </div>

      <div class="row">
        <!-- FILTER BAR -->

        <div class="bg-white p-3 rounded mb-4 border">
          <div class="row g-2">
            <div class="col-md-3">
              <select class="form-select">
                <option>Ngành nghề</option>
                <option>Công nghệ thông tin</option>
                <option>Marketing</option>
                <option>Thiết kế</option>
              </select>
            </div>

            <div class="col-md-2">
              <select class="form-select">
                <option>Địa điểm</option>
                <option>Hà Nội</option>
                <option>TP.HCM</option>
                <option>Đà Nẵng</option>
              </select>
            </div>

            <div class="col-md-2">
              <select class="form-select">
                <option>Mức lương</option>
                <option>Dưới 5 triệu</option>
                <option>5 - 10 triệu</option>
                <option>Trên 10 triệu</option>
              </select>
            </div>

            <div class="col-md-2">
              <select class="form-select">
                <option>Loại hình</option>
                <option>Thực tập</option>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
            </div>

            <div class="col-md-3">
              <button class="btn btn-primary w-100">Áp dụng bộ lọc</button>
            </div>
          </div>
        </div>

        <!-- JOB LIST -->

        <div class="col-md-12">
          <p class="text-muted">Tìm thấy 128 kết quả phù hợp</p>

          <!-- JOB -->

          <div class="job-card">
            <div class="d-flex">
              <div class="company-logo me-3">F</div>

              <div class="flex-grow-1">
                <h6 class="fw-bold">Thực tập sinh Java (Backend)</h6>

                <p class="text-muted small">
                  FPT Software • Hà Nội • 15 giờ trước
                </p>

                <span class="tag">Java</span>
                <span class="tag">Spring Boot</span>
                <span class="tag">SQL</span>
              </div>

              <div class="text-end">
                <p class="text-primary fw-bold">5 - 8 Triệu</p>

                <button class="btn btn-primary btn-sm mb-1">
                  Ứng tuyển nhanh
                </button>

                <br />

                <button class="btn btn-light btn-sm">💾 Lưu</button>
              </div>
            </div>
          </div>

          <!-- JOB -->

          <div class="job-card">
            <div class="d-flex">
              <div class="company-logo me-3">V</div>

              <div class="flex-grow-1">
                <h6 class="fw-bold">UI/UX Designer Junior</h6>

                <p class="text-muted small">
                  VNG Corporation • TP.HCM • 1 ngày trước
                </p>

                <span class="tag">Figma</span>
                <span class="tag">Design System</span>
              </div>

              <div class="text-end">
                <p class="text-primary fw-bold">10 - 15 Triệu</p>

                <button class="btn btn-primary btn-sm mb-1">
                  Ứng tuyển nhanh
                </button>

                <br />

                <button class="btn btn-light btn-sm">💾 Lưu</button>
              </div>
            </div>
          </div>

          <!-- PAGINATION -->

          <nav class="mt-4">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <a class="page-link">‹</a>
              </li>

              <li class="page-item active">
                <a class="page-link">1</a>
              </li>

              <li class="page-item">
                <a class="page-link">2</a>
              </li>

              <li class="page-item">
                <a class="page-link">3</a>
              </li>

              <li class="page-item">
                <a class="page-link">10</a>
              </li>

              <li class="page-item">
                <a class="page-link">›</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- FOOTER -->

    <div class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <h6 class="fw-bold">JobPortal</h6>
            <p class="text-muted">Nền tảng tìm kiếm việc làm cho sinh viên.</p>
          </div>

          <div class="col-md-3">
            <h6 class="fw-bold">Về JobPortal</h6>
            <p>Giới thiệu</p>
            <p>Liên hệ</p>
            <p>Điều khoản</p>
            <p>Bảo mật</p>
          </div>

          <div class="col-md-3">
            <h6 class="fw-bold">Dành cho ứng viên</h6>
            <p>Tìm việc</p>
            <p>Tạo CV</p>
            <p>Cẩm nang nghề nghiệp</p>
          </div>

          <div class="col-md-3">
            <h6 class="fw-bold">Kết nối</h6>
            <p>Facebook</p>
            <p>LinkedIn</p>
            <p>Email</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
