<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Kỹ năng & Khóa học</title>

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

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
      .skill-card {
        background: white;
        border-radius: 14px;
        padding: 20px;
        border: 1px solid #e5e7eb;
        margin-bottom: 20px;
      }

      .progress {
        height: 8px;
        border-radius: 10px;
      }

      .course-card {
        background: white;
        border-radius: 12px;
        padding: 15px;
        border: 1px solid #e5e7eb;
        margin-bottom: 12px;
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .course-card img {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        object-fit: cover;
      }

      .cert-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        padding: 12px;
        margin-bottom: 10px;
      }

      .cert-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cert-icon.orange {
        background: #fff4e5;
        color: #f59e0b;
      }
      .cert-icon.blue {
        background: #e6f0ff;
        color: #2563eb;
      }
      .cert-icon.green {
        background: #e7f9ed;
        color: #16a34a;
      }
      .course-card {
        transition: 0.25s;
        cursor: pointer;
      }

      .course-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }
      .cert-item {
        transition: 0.2s;
        cursor: pointer;
      }

      .cert-item:hover {
        background: #f8fafc;
      }
      .skill-analysis canvas {
        max-width: 180px;
        margin: auto;
      }
      .skill-item {
        margin-bottom: 20px;
      }

      .skill-item i {
        margin-right: 6px;
      }

      .skill-item small {
        font-size: 12px;
      }
      .progress-bar {
        transition: width 1s ease;
      }
    </style>
  </head>

  <body>
    <div class="dashboard">
      <% request.setAttribute("activePage","skills"); %>

      <jsp:include page="sidebar_students.jsp" />

      <div class="main">
        <div class="content">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 class="fw-bold">Kỹ năng & Khóa học</h4>
            <p class="text-muted">
              Quản lý lộ trình phát triển và nâng cao năng lực chuyên môn.
            </p>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-light">
              <i class="fa-solid fa-download"></i>
              Tải CV
            </button>

            <button class="btn btn-primary">
              <i class="fa-solid fa-plus"></i>
              Thêm kỹ năng mới
            </button>
          </div>
        </div>

        <div class="row">
          <!-- LEFT -->

          <div class="col-md-7">
            <!-- SKILLS -->

            <div class="skill-card">
              <div class="d-flex justify-content-between mb-3">
                <strong>
                  <i class="fa-solid fa-code text-primary"></i>
                  Kỹ năng của tôi</strong
                >
                <a class="small text-primary">Chỉnh sửa</a>
              </div>

              <div class="skill-item">
                <div class="d-flex justify-content-between">
                  <strong>
                    <i class="fa-solid fa-server text-primary"></i>
                    Java Backend
                  </strong>

                  <span class="text-muted">85%</span>
                </div>

                <div class="progress mt-2 mb-1">
                  <div class="progress-bar bg-primary" style="width: 85%"></div>
                </div>

                <small class="text-muted">
                  Thành thạo Spring Boot, Hibernate
                </small>
              </div>

              <div class="skill-item">
                <div class="d-flex justify-content-between">
                  <strong>
                    <i class="fa-brands fa-react text-info"></i>
                    React.js
                  </strong>

                  <span class="text-muted">70%</span>
                </div>

                <div class="progress mt-2 mb-1">
                  <div class="progress-bar bg-primary" style="width: 70%"></div>
                </div>

                <small class="text-muted"> Hooks, Redux Toolkit </small>
              </div>

              <div class="skill-item">
                <div class="d-flex justify-content-between">
                  <strong>
                    <i class="fa-solid fa-database text-warning"></i>
                    SQL & Database
                  </strong>

                  <span class="text-muted">60%</span>
                </div>

                <div class="progress mt-2 mb-1">
                  <div class="progress-bar bg-primary" style="width: 60%"></div>
                </div>

                <small class="text-muted">
                  Thiết kế schema, tối ưu query
                </small>
              </div>

              <div class="skill-item">
                <div class="d-flex justify-content-between">
                  <strong>
                    <i class="fa-solid fa-language text-success"></i>
                    English (IELTS)
                  </strong>

                  <span class="text-muted">75%</span>
                </div>

                <div class="progress mt-2 mb-1">
                  <div class="progress-bar bg-primary" style="width: 75%"></div>
                </div>

                <small class="text-muted">
                  Giao tiếp tốt, đọc hiểu tài liệu
                </small>
              </div>
            </div>

            <!-- RADAR -->

            <div class="skill-card skill-analysis">
              <div class="row align-items-center">
                <div class="col-md-4 text-center">
                  <canvas id="skillChart"></canvas>
                </div>

                <div class="col-md-8">
                  <p class="small text-muted">
                    Dựa trên mục tiêu: <strong>Fullstack Developer</strong>
                  </p>

                  <p class="small">
                    <i class="fa-solid fa-arrow-trend-up text-primary"></i>
                    Cần cải thiện: Cloud (AWS/Azure)
                  </p>

                  <p class="small text-muted">
                    Bạn đang thiếu 40% so với yêu cầu tuyển dụng.
                  </p>

                  <p class="small">
                    <i class="fa-solid fa-circle-check text-success"></i>
                    Vượt mong đợi: Logic lập trình
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT -->

          <div class="col-md-5">
            <!-- COURSES -->

            <div class="skill-card">
              <div class="d-flex justify-content-between">
                <strong>
                  <i class="fa-solid fa-book text-primary"></i>
                  Khóa học đề xuất</strong
                >
                <a class="small text-primary">Xem tất cả</a>
              </div>

              <div class="course-card">
                <img
                  src="https://images.unsplash.com/photo-1555949963-aa79dcee981c"
                />

                <div>
                  <strong>AWS Cloud Practitioner 2024</strong>
                  <div class="small text-muted">22 giờ</div>
                  <a class="small text-primary">Học ngay</a>
                </div>
              </div>

              <div class="course-card">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                />

                <div>
                  <strong>Advanced React Patterns</strong>
                  <div class="small text-muted">15 giờ</div>
                  <a class="small text-primary">Học ngay</a>
                </div>
              </div>
            </div>

            <!-- CERTIFICATES -->

            <div class="skill-card">
              <strong>
                <i class="fa-solid fa-award text-warning"></i>
                Chứng chỉ & Bằng cấp</strong
              >

              <div class="cert-item">
                <div class="d-flex gap-2 align-items-center">
                  <div class="cert-icon orange">
                    <i class="fa-solid fa-award"></i>
                  </div>

                  <div>
                    <strong>Java Professional Certificate</strong>
                    <div class="small text-muted">Oracle • 2023</div>
                  </div>
                </div>

                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </div>

              <div class="cert-item">
                <div class="d-flex gap-2 align-items-center">
                  <div class="cert-icon blue">
                    <i class="fa-solid fa-code"></i>
                  </div>

                  <div>
                    <strong>Meta Front-End Developer</strong>
                    <div class="small text-muted">Coursera • 2023</div>
                  </div>
                </div>

                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </div>

              <div class="cert-item">
                <div class="d-flex gap-2 align-items-center">
                  <div class="cert-icon green">
                    <i class="fa-solid fa-language"></i>
                  </div>

                  <div>
                    <strong>IELTS Academic 7.5</strong>
                    <div class="small text-muted">British Council • 2023</div>
                  </div>
                </div>

                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </div>

              <button class="btn btn-light w-100 mt-2">
                + Thêm chứng chỉ mới
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      const ctx = document.getElementById("skillChart");

      new Chart(ctx, {
        type: "radar",
        data: {
          labels: ["Backend", "Frontend", "Database", "Cloud", "English"],
          datasets: [
            {
              label: "Skill",
              data: [85, 70, 60, 40, 75],
              borderColor: "#2563eb",
              backgroundColor: "rgba(37,99,235,0.2)",
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { r: { beginAtZero: true, max: 100 } },
        },
      });
    </script>
  </body>
</html>
