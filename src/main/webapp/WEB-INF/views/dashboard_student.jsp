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
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/css/dashboard.css" />
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->
      <% request.setAttribute("activePage", "dashboard"); %>
      <jsp:include page="sidebar_students.jsp" />

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
  </body>
</html>
