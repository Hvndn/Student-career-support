<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="vi" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Dashboard</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <style>
      body {
        background: #f5f7fb;
        font-family: system-ui;
      }

      /* layout */

      .dashboard {
        display: flex;
        min-height: 100vh;
      }

      /* sidebar */

      .sidebar {
        width: 250px;
        background: white;
        border-right: 1px solid #eee;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
      }

      .menu a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
        color: #374151;
        text-decoration: none;
        margin-bottom: 5px;
      }

      .menu a:hover {
        background: #f1f5ff;
      }

      .menu .active {
        background: #eef2ff;
        color: #2563eb;
      }

      /* content */

      .main {
        flex: 1;
        padding: 25px;
      }

      /* topbar */

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .search {
        background: white;
        border-radius: 8px;
        padding: 8px 12px;
        border: 1px solid #eee;
        width: 350px;
      }

      /* stat cards */

      .stat-card {
        background: white;
        border-radius: 10px;
        padding: 18px;
        border: 1px solid #eee;
      }

      .stat-number {
        font-size: 22px;
        font-weight: 700;
      }

      /* project */

      .project-card {
        background: white;
        border-radius: 10px;
        padding: 15px;
        border: 1px solid #eee;
      }

      .project-img {
        height: 120px;
        background: #eee;
        border-radius: 8px;
        margin-bottom: 10px;
      }

      /* table */

      .table-card {
        background: white;
        border-radius: 10px;
        padding: 15px;
        border: 1px solid #eee;
      }

      /* badges */

      .badge-review {
        background: #fef3c7;
        color: #92400e;
      }

      .badge-interview {
        background: #dcfce7;
        color: #166534;
      }
    </style>
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->

      <div class="sidebar">
        <div>
          <div class="logo mb-4">
            <div class="bg-primary text-white p-2 rounded">🎓</div>

            <div>
              <strong>UniCareer</strong><br />
              <small class="text-muted">Cổng thông tin sinh viên</small>
            </div>
          </div>

          <div class="menu">
            <a class="active"> 🏠 Tổng quan </a>

            <a> 💼 Tìm việc làm </a>

            <a> 📄 CV của tôi </a>

            <a> 👤 Hồ sơ </a>

            <a> 📨 Đơn ứng tuyển </a>
          </div>
        </div>

        <div class="d-flex align-items-center gap-2">
          <img src="https://i.pravatar.cc/40" class="rounded-circle" />

          <div>
            <strong th:text="${user}">Nguyễn Văn A</strong>

            <br />

            <small class="text-muted">Sinh viên năm 4</small>
          </div>
        </div>
      </div>

      <!-- MAIN -->

      <div class="main">
        <!-- TOPBAR -->

        <div class="topbar">
          <input
            class="search form-control"
            placeholder="Tìm kiếm công việc, kỹ năng..."
          />

          <button class="btn btn-primary">+ Tạo CV mới</button>
        </div>

        <h4 class="fw-bold">
          Chào buổi sáng, <span th:text="${user}">Nguyễn Văn A</span>!
        </h4>

        <p class="text-muted mb-4">
          Cùng xem tiến độ và cơ hội nghề nghiệp hôm nay của bạn.
        </p>
        <
        <!-- STATS -->

        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="stat-card">
              <small class="text-muted">Hoàn thiện hồ sơ</small>

              <div class="stat-number">85%</div>

              <small class="text-success">+5% tuần này</small>
            </div>
          </div>

          <div class="col-md-3">
            <div class="stat-card">
              <small class="text-muted">Kỹ năng</small>

              <div class="stat-number">12</div>

              <small class="text-success">+2 mới</small>
            </div>
          </div>

          <div class="col-md-3">
            <div class="stat-card">
              <small class="text-muted">Dự án cá nhân</small>

              <div class="stat-number">04</div>

              <small class="text-success">+1 mới</small>
            </div>
          </div>

          <div class="col-md-3">
            <div class="stat-card">
              <small class="text-muted">Đã ứng tuyển</small>

              <div class="stat-number">08</div>

              <small class="text-primary">2 đang chờ</small>
            </div>
          </div>
        </div>

        <!-- PROJECTS -->
        <div class="row g-3 mb-4">
          <!-- LEFT COLUMN -->

          <div class="col-md-4">
            <!-- PROFILE PROGRESS -->

            <div class="stat-card mb-3">
              <div class="d-flex justify-content-between">
                <h6 class="fw-bold">Tiến độ hồ sơ</h6>

                <a class="text-primary small">Chỉnh sửa</a>
              </div>

              <div class="mt-3">
                <div class="d-flex justify-content-between small mb-1">
                  <span>Thông tin cá nhân</span>
                  <span class="text-success">Hoàn thành</span>
                </div>

                <div class="d-flex justify-content-between small mb-1">
                  <span>Học vấn</span>
                  <span class="text-success">Hoàn thành</span>
                </div>

                <div class="d-flex justify-content-between small mb-3">
                  <span>Kinh nghiệm</span>
                  <span class="text-warning">Cần bổ sung</span>
                </div>

                <div class="bg-light p-2 rounded small text-muted">
                  Thêm ít nhất 1 kinh nghiệm làm việc để tăng độ tin cậy hồ sơ.
                </div>
              </div>
            </div>

            <!-- SKILLS -->

            <div class="stat-card">
              <div class="d-flex justify-content-between mb-2">
                <h6 class="fw-bold">Kỹ năng</h6>

                <button class="btn btn-sm btn-light">+</button>
              </div>

              <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-light text-dark">Java</span>
                <span class="badge bg-light text-dark">Spring Boot</span>
                <span class="badge bg-light text-dark">ReactJS</span>
                <span class="badge bg-light text-dark">SQL</span>
                <span class="badge bg-light text-dark">TailwindCSS</span>
                <span class="badge bg-light text-dark">Docker</span>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->

          <div class="col-md-8">
            <div class="stat-card">
              <div class="d-flex justify-content-between mb-3">
                <h6 class="fw-bold">Dự án nổi bật</h6>

                <a class="text-primary small">Xem tất cả</a>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <div class="project-card">
                    <div class="project-img"></div>

                    <h6 class="fw-bold">Personal Portfolio v2</h6>

                    <p class="small text-muted">
                      Xây dựng trang web cá nhân hiển thị các dự án và kỹ năng.
                    </p>

                    <span class="badge bg-light text-dark">React</span>
                    <span class="badge bg-light text-dark">Framer</span>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="project-card">
                    <div class="project-img"></div>

                    <h6 class="fw-bold">E-Commerce API</h6>

                    <p class="small text-muted">
                      Backend cho hệ thống thương mại điện tử.
                    </p>

                    <span class="badge bg-light text-dark">Java</span>
                    <span class="badge bg-light text-dark">Postgres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- APPLICATIONS -->

        <div class="table-card">
          <div class="d-flex justify-content-between mb-3">
            <h6 class="fw-bold">Ứng tuyển gần đây</h6>

            <a class="text-primary small"> Xem tất cả </a>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Vị trí & Công ty</th>

                <th>Ngày nộp</th>

                <th>Trạng thái</th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <strong>Fullstack Intern</strong><br />
                  <small class="text-muted">FPT Software</small>
                </td>

                <td>12/05/2024</td>

                <td>
                  <span class="badge badge-review"> Đang xét duyệt </span>
                </td>

                <td>...</td>
              </tr>

              <tr>
                <td>
                  <strong>Java Developer</strong><br />
                  <small class="text-muted">VNG Corporation</small>
                </td>

                <td>08/05/2024</td>

                <td>
                  <span class="badge badge-interview"> Phỏng vấn </span>
                </td>

                <td>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>
