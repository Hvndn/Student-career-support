<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
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
      /* sidebar */

.filter-card{
border:1px solid #e5e7eb;
}

.cv-box{
background:#2563eb;
color:white;
padding:20px;
border-radius:12px;
}

/* job card layout */

.job-card{
display:flex;
justify-content:space-between;
align-items:center;
background:white;
border-radius:12px;
padding:20px;
margin-bottom:15px;
border:1px solid #e5e7eb;
transition:all .25s ease;
}

.job-card:hover{
transform:translateY(-4px);
box-shadow:0 12px 30px rgba(0,0,0,0.1);
}

/* left */

.job-left{
display:flex;
align-items:center;
gap:15px;
}

/* right */

.job-right{
text-align:right;
}

/* title */

.job-title{
font-weight:600;
margin-bottom:4px;
}

/* meta */

.job-meta{
font-size:13px;
color:#6b7280;
}

/* tags */

.tags span{
background:#eef2ff;
color:#2563eb;
font-size:12px;
padding:4px 8px;
border-radius:6px;
margin-right:5px;
}

/* salary */

.salary{
color:#2563eb;
font-weight:600;
margin-bottom:5px;
}

/* company */

.company-logo{
width:42px;
height:42px;
border-radius:10px;
background:#f1f5f9;
display:flex;
align-items:center;
justify-content:center;
font-weight:bold;
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
            <a href="/employer" class="btn btn-outline-dark">Nhà tuyển dụng</a>
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

  <!-- SIDEBAR FILTER -->

  <div class="col-md-3">

    <div class="filter-card">

      <h6 class="fw-bold mb-3">Bộ lọc chi tiết</h6>

      <label class="small">Ngành nghề</label>
      <select class="form-select mb-3">
        <option>Công nghệ thông tin</option>
        <option>Marketing</option>
        <option>Thiết kế</option>
      </select>

      <label class="small">Mức lương</label>

      <div class="form-check">
        <input class="form-check-input" type="radio">
        <label class="form-check-label small">Dưới 5 triệu</label>
      </div>

      <div class="form-check">
        <input class="form-check-input" type="radio">
        <label class="form-check-label small">5 - 10 triệu</label>
      </div>

      <div class="form-check mb-3">
        <input class="form-check-input" type="radio">
        <label class="form-check-label small">Trên 10 triệu</label>
      </div>

      <label class="small">Loại hình</label>

      <div class="mt-2">
        <span class="badge bg-light text-dark">Full-time</span>
        <span class="badge bg-light text-dark">Internship</span>
        <span class="badge bg-light text-dark">Part-time</span>
      </div>

    </div>


    <div class="cv-box mt-3">

      <h6>CV của bạn đã sẵn sàng?</h6>

      <p class="small">
        Tải CV để nhà tuyển dụng tìm thấy bạn.
      </p>

      <button class="btn btn-light w-100">
        Tạo CV ngay
      </button>

    </div>

  </div>

  <!-- JOB LIST -->

  <div class="col-md-9">

    <p class="text-muted">Tìm thấy 128 kết quả phù hợp</p>

    <!-- JOB 1 -->

    <div class="job-card">

      <div class="job-left">

        <div class="company-logo">F</div>

        <div>

          <h6 class="job-title">
            Thực tập sinh Java (Backend)
          </h6>

          <p class="job-meta">
            FPT Software • Hà Nội • 15 giờ trước
          </p>

          <div class="tags">

            <span>Java</span>
            <span>Spring Boot</span>
            <span>SQL</span>

          </div>

        </div>

      </div>

      <div class="job-right">

        <div class="salary">
          5 - 8 Triệu
        </div>

        <button class="btn btn-primary btn-sm">
          Ứng tuyển nhanh
        </button>

        <button class="btn btn-light btn-sm mt-1">
          💾 Lưu
        </button>

      </div>

    </div>


    <!-- JOB 2 -->

    <div class="job-card">

      <div class="job-left">

        <div class="company-logo">V</div>

        <div>

          <h6 class="job-title">
            UI/UX Designer Junior
          </h6>

          <p class="job-meta">
            VNG Corporation • TP.HCM • 1 ngày trước
          </p>

          <div class="tags">

            <span>Figma</span>
            <span>Design System</span>

          </div>

        </div>

      </div>

      <div class="job-right">

        <div class="salary">
          10 - 15 Triệu
        </div>

        <button class="btn btn-primary btn-sm">
          Ứng tuyển nhanh
        </button>

        <button class="btn btn-light btn-sm mt-1">
          💾 Lưu
        </button>

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
          <a class="page-link">›</a>
        </li>

      </ul>
    </nav>

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
