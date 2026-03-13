<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Tìm việc làm</title>

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
    <link rel="stylesheet" href="/css/jobs.css" />
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->

      <% request.setAttribute("activePage","jobs"); %>

      <jsp:include page="sidebar_students.jsp" />

      <!-- MAIN -->

      <div class="main">
        <div class="top-search mb-4">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>

            <input
              type="text"
              placeholder="Tìm kiếm việc làm, công ty hoặc kỹ năng..."
            />
          </div>

          <div class="search-icons">
            <i class="fa-solid fa-bell"></i>

            <div class="avatar-mini"></div>
          </div>
        </div>
        <div class="breadcrumb-ui mb-2">
          Trang chủ
          <i class="fa-solid fa-angle-right"></i>
          Tìm kiếm việc làm
        </div>
        <!-- HEADER -->

        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="fw-bold">Việc làm dành cho Sinh viên</h4>

          <div>
            <button class="btn btn-primary btn-sm">Mới nhất</button>

            <button class="btn btn-light btn-sm">Lương cao</button>
          </div>
        </div>

        <p class="text-muted mb-4">
          Khám phá hơn 1,200+ cơ hội thực tập và việc làm part-time/full-time
          mới nhất.
        </p>

        <div class="row">
          <!-- FILTER -->

          <div class="col-md-3">
            <div class="filter-box">
              <h6 class="fw-bold mb-3">
                <i class="fa-solid fa-filter"></i>
                Bộ lọc chi tiết
              </h6>

              <label class="form-label">Ngành nghề</label>

              <select class="form-select mb-3">
                <option>Công nghệ thông tin</option>
                <option>Marketing</option>
                <option>Thiết kế</option>
              </select>

              <label class="form-label">Mức lương</label>

              <div class="form-check">
                <input class="form-check-input" type="radio" />
                <label class="form-check-label">Dưới 5 triệu</label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="radio" />
                <label class="form-check-label">5 - 10 triệu</label>
              </div>

              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" />
                <label class="form-check-label">Trên 10 triệu</label>
              </div>

              <label class="form-label">Loại hình</label>

              <div class="d-flex gap-2 mb-3">
                <span class="badge bg-primary">Full-time</span>
                <span class="badge bg-light text-dark">Internship</span>
                <span class="badge bg-light text-dark">Part-time</span>
              </div>

              <label class="form-label">Thành phố</label>

              <input class="form-control mb-3" value="Hồ Chí Minh" />

              <label class="form-label">Kỹ năng yêu cầu</label>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" />
                <label class="form-check-label">English Communication</label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" />
                <label class="form-check-label">UI/UX Design</label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" />
                <label class="form-check-label">Critical Thinking</label>
              </div>
            </div>
          </div>

          <!-- JOB LIST -->

          <div class="col-md-9">
            <!-- JOB 1 -->

            <div class="job-card">
              <div class="bookmark">
                <i class="fa-regular fa-bookmark"></i>
              </div>
              <div class="d-flex justify-content-between">
                <div class="d-flex gap-3">
                  <div class="company-logo">UX</div>

                  <div>
                    <strong> UX/UI Designer Intern (Hè 2024) </strong>

                    <div class="text-muted small">Google Vietnam</div>

                    <div class="salary small">8.000.000 - 12.000.000 VND</div>

                    <div class="small text-muted">
                      Quận 1, TP. Hồ Chí Minh • Đăng 2 giờ trước
                    </div>

                    <div class="job-tags mt-2">
                      <span>FIGMA</span>
                      <span>ENGLISH</span>
                      <span>PROTOTYPE</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-outline-secondary btn-sm">
                    Chi tiết
                  </button>

                  <button class="btn btn-primary btn-sm">
                    Ứng tuyển nhanh
                  </button>
                </div>
              </div>
            </div>

            <!-- JOB 2 -->

            <div class="job-card">
              <div class="d-flex justify-content-between">
                <div class="d-flex gap-3">
                  <div class="company-logo">DM</div>

                  <div>
                    <strong> Digital Marketing Part-time </strong>

                    <div class="text-muted small">Shopee Vietnam</div>

                    <div class="salary small">5.000.000 - 7.000.000 VND</div>

                    <div class="small text-muted">
                      Quận 7, TP. Hồ Chí Minh • Đăng hôm qua
                    </div>

                    <div class="job-tags mt-2">
                      <span>CONTENT</span>
                      <span>SEO</span>
                      <span>SOCIAL</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-outline-secondary btn-sm">
                    Chi tiết
                  </button>

                  <button class="btn btn-primary btn-sm">
                    Ứng tuyển nhanh
                  </button>
                </div>
              </div>
            </div>

            <!-- JOB 3 -->

            <div class="job-card">
              <div class="d-flex justify-content-between">
                <div class="d-flex gap-3">
                  <div class="company-logo">FPT</div>

                  <div>
                    <strong> Thực tập sinh Java Web </strong>

                    <div class="text-muted small">FPT Software</div>

                    <div class="salary small">Thỏa thuận</div>

                    <div class="small text-muted">
                      Quận 9, TP. Hồ Chí Minh • Đăng 3 ngày trước
                    </div>

                    <div class="job-tags mt-2">
                      <span>JAVA</span>
                      <span>SPRING BOOT</span>
                      <span>SQL</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-outline-secondary btn-sm">
                    Chi tiết
                  </button>

                  <button class="btn btn-primary btn-sm">
                    Ứng tuyển nhanh
                  </button>
                </div>
              </div>
            </div>

            <!-- PAGINATION -->

            <nav class="mt-4">
              <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                  <a class="page-link">«</a>
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
                  <a class="page-link">»</a>
                </li>
              </ul>
            </nav>
            <footer class="footer-ui mt-5">
              <div class="row">
                <div class="col-md-4">
                  <h6 class="text-primary fw-bold">CareerHub</h6>

                  <p class="text-muted small">
                    Nền tảng kết nối sinh viên với những cơ hội nghề nghiệp hàng
                    đầu Việt Nam.
                  </p>
                </div>

                <div class="col-md-3">
                  <strong>Dành cho ứng viên</strong>

                  <ul>
                    <li>Tìm việc làm</li>
                    <li>Tạo CV online</li>
                    <li>Cẩm nang nghề nghiệp</li>
                  </ul>
                </div>

                <div class="col-md-3">
                  <strong>Dành cho Nhà tuyển dụng</strong>

                  <ul>
                    <li>Đăng tin tuyển dụng</li>
                    <li>Tìm kiếm tài năng</li>
                    <li>Giải pháp HR</li>
                  </ul>
                </div>

                <div class="col-md-2">
                  <strong>Kết nối với chúng tôi</strong>

                  <div class="d-flex gap-2 mt-2">
                    <i class="fa-brands fa-facebook"></i>
                    <i class="fa-brands fa-linkedin"></i>
                    <i class="fa-brands fa-github"></i>
                  </div>
                </div>
              </div>

              <div class="text-center text-muted small mt-4">
                © 2024 CareerHub. Tất cả quyền được bảo lưu.
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
