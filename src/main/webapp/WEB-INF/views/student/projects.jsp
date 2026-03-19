<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Dự án cộng đồng</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    />

    <link rel="stylesheet" href="/css/dashboard.css" />
    <link rel="stylesheet" href="/css/sidebar.css" />

    <style>
      .project-card {
        background: white;
        border-radius: 14px;
        border: 1px solid #e5e7eb;
        overflow: hidden;
        transition: 0.25s;
      }

      .project-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }

      .project-image {
        height: 150px;
        object-fit: cover;
        width: 100%;
      }

      .project-body {
        padding: 18px;
      }

      .tech-tags span {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 6px;
        margin-right: 5px;
        background: #eef2ff;
        color: #2563eb;
      }

      .tech-tags span.orange {
        background: #fff4e5;
        color: #f59e0b;
      }

      .tech-tags span.red {
        background: #ffe5e5;
        color: #ef4444;
      }

      .project-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        font-size: 14px;
        color: #6b7280;
      }

      .project-footer a {
        text-decoration: none;
        color: #2563eb;
      }

      .create-project {
        border: 2px dashed #e5e7eb;
        border-radius: 14px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #6b7280;
        cursor: pointer;
        transition: 0.25s;
      }

      .create-project:hover {
        border-color: #2563eb;
        color: #2563eb;
      }

      .filter-tags button {
        border: none;
        background: #f3f4f6;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        margin-right: 8px;
      }

      .filter-tags .active {
        background: #2563eb;
        color: white;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        border: 1px solid #e5e7eb;
        padding: 6px 12px;
        border-radius: 10px;
        transition: 0.2;
      }

      .search-box input {
        border: none;
        outline: none;
        font-size: 14px;
        width: 200px;
        background: transparent;
      }

      .search-box:focus-within {
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    </style>
  </head>

  <body>
    <div class="dashboard">
      <% request.setAttribute("activePage","projects"); %>

      <jsp:include page="sidebar_students.jsp" />

      <div class="main">
      <div class = "content">
        <!-- TOP NAV -->

        <div class="topbar mb-4">
          <div class="fw-semibold"><Strong>Dự án cộng đồng</Strong></div>

          <div class="d-flex align-items-center gap-3">
            <div class="search-box">
              <i class="fa-solid fa-search"></i>
              <input type="text" placeholder="Tìm kiếm dự án..." />
            </div>

            <button class="icon-btn">
              <i class="fa-solid fa-bell"></i>
            </button>
          </div>
        </div>
        <!-- HEADER -->

        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 class="fw-bold">Dự án thực tế</h4>

            <p class="text-muted">
              Khám phá và quản lý các sản phẩm sáng tạo từ cộng đồng sinh viên.
            </p>
          </div>

          <button class="btn btn-primary">
            <i class="fa-solid fa-plus"></i>
            Thêm dự án mới
          </button>
        </div>

        <!-- FILTER TAGS -->

        <div class="filter-tags mb-4">
          <button class="active">Tất cả</button>
          <button>ReactJS</button>
          <button>Node.js</button>
          <button>TailwindCSS</button>
          <button>Python</button>
          <button>Flutter</button>
          <button>Firebase</button>
        </div>

        <!-- PROJECT GRID -->

        <div class="row g-4">
          <!-- PROJECT 1 -->

          <div class="col-md-4">
            <div class="project-card">
              <img
                class="project-image"
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
              />

              <div class="project-body">
                <strong> Hệ thống Quản lý Thư viện Thông minh </strong>

                <p class="text-muted small mt-2">
                  Ứng dụng web giúp tự động hóa quy trình mượn trả sách.
                </p>

                <div class="tech-tags">
                  <span>React</span>
                  <span>NodeJS</span>
                  <span class="orange">MongoDB</span>
                </div>

                <div class="project-footer">
                  <span>
                    <a href="#"> <i class="fa-brands fa-github"></i> GitHub </a>
                  </span>

                  <a href="#"> Demo → </a>
                </div>
              </div>
            </div>
          </div>

          <!-- PROJECT 2 -->

          <div class="col-md-4">
            <div class="project-card">
              <img
                class="project-image"
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
              />

              <div class="project-body">
                <strong> App Giao hàng Đồ ăn Nhanh </strong>

                <p class="text-muted small mt-2">
                  Nền tảng kết nối sinh viên và các quán ăn quanh khu ký túc xá.
                </p>

                <div class="tech-tags">
                  <span>Flutter</span>
                  <span class="red">Firebase</span>
                  <span>Stripe</span>
                </div>

                <div class="project-footer">
                  <span>
                    <a href="#"> <i class="fa-brands fa-github"></i> GitHub </a>
                  </span>

                  <a href="#"> Demo → </a>
                </div>
              </div>
            </div>
          </div>

          <!-- PROJECT 3 -->

          <div class="col-md-4">
            <div class="project-card">
              <img
                class="project-image"
                src="https://images.unsplash.com/photo-1555421689-491a97ff2040"
              />

              <div class="project-body">
                <strong> Sàn Thương mại Đồ cũ Sinh viên </strong>

                <p class="text-muted small mt-2">
                  Website trao đổi và mua bán đồ dùng sinh viên.
                </p>

                <div class="tech-tags">
                  <span>NextJS</span>
                  <span>Tailwind</span>
                  <span>PostgreSQL</span>
                </div>

                <div class="project-footer">
                  <span>
                    <a href="#"> <i class="fa-brands fa-github"></i> GitHub </a>
                  </span>

                  <a href="#"> Demo → </a>
                </div>
              </div>
            </div>
          </div>

          <!-- CREATE PROJECT -->

          <div class="col-md-4">
            <div class="create-project">
              <i class="fa-solid fa-plus fa-2x mb-3"></i>

              <strong> Tạo dự án mới </strong>

              <p class="small text-muted">
                Chia sẻ ý tưởng của bạn với mọi người
              </p>
            </div>
          </div>
        </div>

        <!-- FOOTER -->

        <div class="footer mt-5">
          <div class="row">
            <div class="col-md-4">
              <h6 class="fw-bold text-primary">CareerHub</h6>
              <p class="text-muted small">
                Nền tảng kết nối sinh viên với những cơ hội nghề nghiệp hàng đầu
                Việt Nam.
              </p>
            </div>

            <div class="col-md-3">
              <strong>Dành cho ứng viên</strong>
              <ul class="list-unstyled small mt-2">
                <li>Tìm việc làm</li>
                <li>Tạo CV online</li>
                <li>Cẩm nang nghề nghiệp</li>
              </ul>
            </div>

            <div class="col-md-3">
              <strong>Dành cho nhà tuyển dụng</strong>
              <ul class="list-unstyled small mt-2">
                <li>Đăng tin tuyển dụng</li>
                <li>Tìm kiếm tài năng</li>
                <li>Giải pháp HR</li>
              </ul>
            </div>

            <div class="col-md-2">
              <strong>Kết nối</strong>
              <div class="d-flex gap-3 mt-2">
                <i class="fa-brands fa-facebook"></i>
                <i class="fa-brands fa-linkedin"></i>
                <i class="fa-brands fa-github"></i>
              </div>
            </div>
          </div>

          <hr />

          <div class="text-center small text-muted">
            © 2024 CareerHub. Tất cả quyền được bảo lưu.
          </div>
        </div>
        </div>
      </div>
    </div>
  </body>
</html>
