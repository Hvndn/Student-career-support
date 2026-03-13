<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Hồ sơ sinh viên</title>

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

    <link rel="stylesheet" href="/css/profile.css" />
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->
      <% request.setAttribute("activePage","profile"); %>

      <jsp:include page="sidebar_students.jsp" />

      <!-- MAIN CONTENT -->

      <div class="main">
        <!-- PROFILE HEADER -->

        <div class="card-custom mb-4">
          <div class="profile-header">
            <img
              class="avatar"
              src="https://randomuser.me/api/portraits/women/44.jpg"
            />

            <div class="profile-info">
              <div class="info-name">Nguyễn Văn A</div>

              <div class="major text-primary">
                Sinh viên Công nghệ thông tin
              </div>

              <div class="profile-meta">
                <span
                  ><i class="fa-solid fa-location-dot"></i> Hà Nội, Việt
                  Nam</span
                >
                <span
                  ><i class="fa-solid fa-envelope"></i> nva@student.edu</span
                >
              </div>
            </div>

            <div class="ms-auto d-flex gap-2 profile-actions">
              <button class="btn btn-outline-secondary">
                <i class="fa-solid fa-pen"></i> Chỉnh sửa hồ sơ
              </button>

              <button class="btn btn-primary">
                <i class="fa-solid fa-download"></i> Tải CV PDF
              </button>
            </div>
          </div>
        </div>

        <!-- STATS -->

        <div class="row mb-4">
          <!-- GPA -->
          <div class="col-md-3">
            <div class="card-custom stat-box">
              <div class="stat-icon">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>

              <div>
                <small>GPA Tích lũy</small>
                <h5>3.65 / 4.0</h5>
              </div>
            </div>
          </div>

          <!-- Năm học -->
          <div class="col-md-3">
            <div class="card-custom stat-box">
              <div class="stat-icon">
                <i class="fa-solid fa-calendar"></i>
              </div>

              <div>
                <small>Năm học</small>
                <h5>Năm thứ 3</h5>
              </div>
            </div>
          </div>

          <!-- Tín chỉ -->
          <div class="col-md-3">
            <div class="card-custom stat-box">
              <div class="stat-icon">
                <i class="fa-solid fa-book"></i>
              </div>

              <div>
                <small>Tín chỉ</small>
                <h5>98 / 132</h5>
              </div>
            </div>
          </div>

          <!-- Xếp hạng -->
          <div class="col-md-3">
            <div class="card-custom stat-box">
              <div class="stat-icon">
                <i class="fa-solid fa-chart-line"></i>
              </div>

              <div>
                <small>Xếp hạng</small>
                <h5>Top 5%</h5>
              </div>
            </div>
          </div>
        </div>

        <!-- MAIN GRID -->

        <div class="row">
          <!-- LEFT SIDE -->
          <div class="col-md-8">
            <!-- EDUCATION -->
            <div class="card-custom mb-4">
              <h6>Quản lý học vấn</h6>
              <hr />

              <div class="edu-item">
                <div class="edu-icon">
                  <i class="fa-solid fa-building-columns"></i>
                </div>

                <div>
                  <strong>Đại học Bách Khoa Hà Nội</strong>
                  <div class="text-muted">Công nghệ thông tin</div>
                  <small>2021 - Hiện tại</small>
                </div>
              </div>

              <hr />

              <div class="edu-item">
                <div class="edu-icon">
                  <i class="fa-solid fa-school"></i>
                </div>

                <div>
                  <strong>THPT Amsterdam</strong>
                  <div class="text-muted">Chuyên Toán</div>
                  <small>2018 - 2021</small>
                </div>
              </div>
            </div>

            <!-- EXPERIENCE -->
            <div class="card-custom">
              <h6>Kinh nghiệm làm việc</h6>
              <hr />

              <b>Thực tập sinh Web</b>
              <div class="text-muted">FPT Software</div>
              <small>2023</small>

              <ul>
                <li>Phát triển UI React</li>
                <li>Tích hợp API</li>
              </ul>
            </div>
          </div>

          <!-- RIGHT SIDE -->
          <div class="col-md-4">
            <!-- CAREER GOAL -->
            <div class="card-custom mb-4">
              <div class="card-title">
                <i class="fa-solid fa-bullseye"></i>
                Mục tiêu nghề nghiệp
              </div>

              <p class="text-muted small italic">
                "Mong muốn trở thành một Fullstack Developer chuyên nghiệp
                trong 2 năm tới. Tập trung vào việc xây dựng các sản phẩm có
                tính thực tế cao."
              </p>

              <ul class="goal-list">
                <li>
                  <i class="fa-solid fa-circle-check"></i> Làm việc tại công ty
                  đa quốc gia
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i> Đạt chứng chỉ AWS
                  Cloud
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i> Master React &
                  Node.js
                </li>
              </ul>
            </div>

            <!-- SKILLS -->
            <div class="card-custom mb-4">
              <div class="card-title">
                <i class="fa-solid fa-code"></i>
                Kỹ năng chuyên môn
              </div>

              <div class="skill-tags">
                <span>ReactJS</span>
                <span>Tailwind CSS</span>
                <span>JavaScript</span>
                <span>NodeJS</span>
                <span>SQL Server</span>
                <span>Git / GitHub</span>
                <span>English IELTS 7.0</span>
              </div>
            </div>

            <!-- LINKS -->
            <div class="card-custom">
              <div class="card-title">
                <i class="fa-solid fa-link"></i>
                Liên kết
              </div>

              <div class="link-list">
                <div>
                  <i class="fa-brands fa-linkedin"></i> linkedin.com/nguyenvana
                </div>
                <div>
                  <i class="fa-brands fa-github"></i> github.com/nguyenvana
                </div>
                <div>
                  <i class="fa-solid fa-globe"></i> portfolio-nguyenvana.dev
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
