<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!doctype html>
<html lang="vi" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>Dashboard</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/css/dashboard.css" />

    <style>
      body {
        background: #f4f6fb;
        font-family: system-ui;
      }

      /* layout */

      .dashboard {
        display: flex;
        min-height: 100vh;
      }

      /* sidebar */

      .sidebar {
        width: 240px;
        background: white;
        border-right: 1px solid #eee;
        padding: 25px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
      }
      .sidebar {
        width: 240px;
        min-width: 180px;
        max-width: 400px;
        resize: horizontal;
        overflow: auto;
      }

      /* thanh kéo */

      .resizer {
        width: 4px;
        cursor: col-resize;
        background: transparent;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
      }

      .resizer:hover {
        background: #2563eb;
      }

      /* để sidebar có vị trí cho resizer */

      .sidebar {
        position: relative;
      }
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        margin-bottom: 30px;
      }

      .menu a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        color: #374151;
        text-decoration: none;
        margin-bottom: 5px;
        transition: 0.2s;
      }

      .menu a:hover {
        background: #eef2ff;
        transform: translateX(3px);
      }

      .menu .active {
        background: #eef2ff;
        color: #2563eb;
        font-weight: 600;
      }

      /* main */

      .main {
        flex: 1;
        padding: 30px;
      }

      /* topbar */

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .search {
        width: 350px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
      }

      /* cards */

      .card-ui {
        background: white;
        border-radius: 14px;
        padding: 20px;
        border: 1px solid #eee;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: 0.25s;
      }

      .card-ui:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
      }

      /* stats */

      .stat-number {
        font-size: 26px;
        font-weight: 700;
      }

      /* progress */

      .progress {
        height: 8px;
        border-radius: 20px;
      }

      /* job card */

      .job-card {
        background: white;
        border-radius: 12px;
        padding: 15px;
        border: 1px solid #eee;
        transition: 0.25s;
      }

      .job-card:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      /* event card */

      .event-card {
        background: linear-gradient(135deg, #4f7cff, #2f5ae7);
        color: white;
        border-radius: 14px;
        padding: 20px;
      }

      /* animation */

      .card-ui {
        animation: fadeUp 0.6s ease;
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .project-card {
        background: white;
        border-radius: 12px;
        padding: 15px;
        border: 1px solid #eee;
        transition: 0.25s;
      }

      .project-card:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }
      .icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.2s;
      }

      .icon-btn:hover {
        background: #f3f4f6;
        transform: translateY(-2px);
      }
      .notification {
        border-left: 2px solid #e5e7eb;
        padding-left: 20px;
        position: relative;
      }

      .notify-item {
        position: relative;
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
      }

      .notify-item .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        left: -26px;
        top: 6px;
      }

      .notify-item.blue .dot {
        background: #3b82f6;
      }

      .notify-item.green .dot {
        background: #10b981;
      }

      .notify-item.orange .dot {
        background: #f59e0b;
      }

      .time {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 3px;
      }
      .notification-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 20px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
      }
      .notification {
        border-left: 2px solid #e5e7eb;
        padding-left: 20px;
        position: relative;
      }

      .notify-item {
        position: relative;
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
      }

      .notify-item .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        left: -26px;
        top: 6px;
      }

      .notify-item.blue .dot {
        background: #3b82f6;
      }

      .notify-item.green .dot {
        background: #10b981;
      }

      .notify-item.orange .dot {
        background: #f59e0b;
      }

      .time {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 3px;
      }
    </style>
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->

      <div class="sidebar">
        <!-- resizer -->
        <div class="resizer"></div>
        <div>
          <div class="logo mb-4">
            <div class="bg-primary text-white p-2 rounded">🎓</div>

            <div>
              <strong>CareerHub</strong><br />
              <small class="text-muted">Cổng thông tin sinh viên</small>
            </div>
          </div>

          <div class="menu">
            <a class="active">
              <i class="fa-solid fa-table-columns"></i>
              Bảng điều khiển
            </a>

            <a>
              <i class="fa-solid fa-user"></i>
              Hồ sơ cá nhân
            </a>

            <a>
              <i class="fa-solid fa-briefcase"></i>
              Việc làm
            </a>

            <a>
              <i class="fa-solid fa-folder"></i>
              Dự án
            </a>

            <a>
              <i class="fa-solid fa-graduation-cap"></i>
              Kỹ năng & khóa học
            </a>
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
          <h4 class="fw-bold">
            Chào mừng trở lại,
            <span class="text-primary" th:text="${user}"> Nguyễn Văn A </span>
            👋
          </h4>
          <div class="d-flex gap-2">
            <button class="icon-btn">
              <i class="fa-solid fa-search"></i>
            </button>

            <button class="icon-btn">
              <i class="fa-solid fa-bell"></i>
            </button>
          </div>
        </div>

        <p class="text-muted mb-4">
          Hôm nay là một ngày tuyệt vời để phát triển sự nghiệp của bạn.
        </p>

        <div class="row g-4">
          <!-- LEFT CONTENT -->

          <div class="col-md-8">
            <!-- PROFILE PROGRESS -->

            <div class="stat-card mb-4">
              <div class="d-flex justify-content-between">
                <strong>Tiến độ hồ sơ chuyên nghiệp</strong>

                <span class="text-primary fw-bold">75%</span>
              </div>

              <div class="progress mt-3 mb-3">
                <div class="progress-bar bg-primary" style="width: 75%"></div>
              </div>

              <div class="bg-light p-3 rounded small">
                💡 Gợi ý hoàn thiện hồ sơ

                <ul class="mt-2 mb-0">
                  <li>Bổ sung chứng chỉ ngoại ngữ</li>

                  <li>Thêm Portfolio hoặc GitHub</li>
                </ul>
              </div>
            </div>
            <!-- STATS -->

            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="stat-card stat-left">
                  <div class="icon-box green">
                    <i class="fa-solid fa-shield-halved"></i>
                  </div>

                  <div class="stat-info">
                    <div class="stat-number">12</div>
                    <div class="stat-title">Kỹ năng</div>
                    <small class="text-success">+2 tháng này</small>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="stat-card stat-flex">
                  <div class="icon-box blue">
                    <i class="fa-solid fa-folder-open"></i>
                  </div>

                  <div class="stat-info">
                    <div class="stat-number">08</div>
                    <div class="stat-title">Dự án</div>
                    <small class="text-primary">3 đã hoàn thành</small>
                  </div>
                </div>
              </div>

              <div class="col-md-4">
                <div class="stat-card stat-flex">
                  <div class="icon-box purple">
                    <i class="fa-solid fa-paper-plane"></i>
                  </div>

                  <div class="stat-info">
                    <div class="stat-number">05</div>
                    <div class="stat-title">Đơn ứng tuyển</div>
                    <small class="text-purple">2 đang xem xét</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card job-section">
              <div class="d-flex justify-content-between mb-3">
                <h6 class="fw-bold">✨ Việc làm gợi ý cho bạn (US-020)</h6>

                <a class="text-primary small">Xem tất cả</a>
              </div>

              <!-- JOB 1 -->

              <div class="job-card">
                <div class="d-flex align-items-start gap-3">
                  <div class="job-logo"></div>

                  <div class="flex-grow-1">
                    <strong>UI/UX Designer Intern</strong>

                    <div class="small text-muted">
                      Figma Vietnam • TP. Hồ Chí Minh
                    </div>

                    <div class="mt-2">
                      <span class="badge bg-light text-dark">Figma</span>

                      <span class="badge bg-light text-dark"
                        >Design System</span
                      >

                      <span class="badge bg-primary">Trùng khớp 95%</span>
                    </div>
                  </div>

                  <span class="badge bg-success">Mới</span>
                </div>
              </div>

              <!-- JOB 2 -->

              <div class="job-card">
                <div class="d-flex align-items-start gap-3">
                  <div class="job-logo dark"></div>

                  <div class="flex-grow-1">
                    <strong>Frontend Developer (React)</strong>

                    <div class="small text-muted">
                      Google Operations • Từ xa
                    </div>

                    <div class="mt-2">
                      <span class="badge bg-light text-dark">ReactJS</span>

                      <span class="badge bg-light text-dark">TailwindCSS</span>

                      <span class="badge bg-primary">Trùng khớp 88%</span>
                    </div>
                  </div>

                  <div class="time">2 ngày trước</div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT PANEL -->

          <div class="col-md-4">
            <!-- NOTIFICATIONS -->

            <div class="stat-card notification-card">
              <div class="d-flex justify-content-between mb-3">
                <strong>Thông báo (US-019)</strong>

                <a class="text-primary small">Đánh dấu đã đọc</a>
              </div>

              <div class="notification">
                <div class="notify-item blue">
                  <div class="dot"></div>

                  <div>
                    <strong>Đơn ứng tuyển được xem xét</strong>

                    <div class="small text-muted">
                      Figma Vietnam đã xem hồ sơ của bạn
                    </div>

                    <div class="time">10 phút trước</div>
                  </div>
                </div>

                <div class="notify-item green">
                  <div class="dot"></div>

                  <div>
                    <strong>Kỹ năng mới được xác thực</strong>

                    <div class="small text-muted">
                      Kỹ năng ReactJS đã được xác thực
                    </div>

                    <div class="time">2 giờ trước</div>
                  </div>
                </div>

                <div class="notify-item orange">
                  <div class="dot"></div>

                  <div>
                    <strong>Nhắc nhở hoàn thiện hồ sơ</strong>

                    <div class="small text-muted">
                      Thêm chứng chỉ để tăng 25% cơ hội phỏng vấn
                    </div>
                  </div>
                </div>
              </div>

              <button class="btn btn-light w-100 mt-3">
                Xem tất cả thông báo
              </button>
            </div>

            <!-- EVENT -->

            <div class="event-card">
              <h6>Sự kiện sắp tới</h6>

              <div class="mt-3">
                <strong>Career Fair 2024</strong>

                <div class="small">Đại học Bách Khoa</div>

                <hr />

                <strong>Workshop: CV Writing</strong>

                <div class="small">Online qua Zoom</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
      const sidebar = document.querySelector(".sidebar");
      const resizer = document.querySelector(".resizer");

      let isResizing = false;

      resizer.addEventListener("mousedown", function () {
        isResizing = true;
      });

      document.addEventListener("mousemove", function (e) {
        if (!isResizing) return;

        let newWidth = e.clientX;

        if (newWidth > 180 && newWidth < 400) {
          sidebar.style.width = newWidth + "px";
        }
      });

      document.addEventListener("mouseup", function () {
        isResizing = false;
      });
    </script>
  </body>
</html>
