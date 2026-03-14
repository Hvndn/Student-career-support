<%@ page contentType="text/html;charset=UTF-8" %>
<html lang="vi">
  <head>
    <title>Đăng tin tuyển dụng</title>

    <link rel="stylesheet" href="/css/dashboard_employer.css" />

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      rel="stylesheet"
    />

    <style>
      .section-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
        transition: 0.25s;
      }

      .section-card:hover {
        transform: translateY(-3px);
      }

      .section-title {
        font-weight: 600;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
    </style>
  </head>

  <body>
    <div class="dashboard">
      <% request.setAttribute("activePage","jobs"); %>

      <jsp:include page="sidebar_employer.jsp" />

      <div class="main">
        <div class="content-wrapper">

        <h4 class="mb-4">Đăng tin tuyển dụng mới</h4>

        <!-- THÔNG TIN CHUNG -->

        <div class="section-card">
          <div class="section-title">
            <i class="fa-solid fa-circle-info text-primary"></i>

            Thông tin chung
          </div>

          <div class="mb-3">
            <label class="form-label">Tiêu đề công việc</label>

            <input
              class="form-control"
              placeholder="Ví dụ: Thực tập sinh Frontend Developer"
            />
          </div>

          <div class="row">
            <div class="col-md-6">
              <label class="form-label">Lĩnh vực</label>

              <select class="form-select">
                <option>Công nghệ thông tin</option>
                <option>Marketing</option>
                <option>Kinh doanh</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Hình thức làm việc</label>

              <div>
                <input type="radio" name="type" /> Toàn thời gian

                <input type="radio" name="type" class="ms-3" /> Bán thời gian

                <input type="radio" name="type" class="ms-3" /> Thực tập
              </div>
            </div>
          </div>
        </div>

        <!-- LƯƠNG -->

        <div class="section-card">
          <div class="section-title">
            <i class="fa-solid fa-location-dot text-danger"></i>

            Mức lương & Địa điểm
          </div>

          <div class="row">
            <div class="col-md-4">
              <label>Mức lương</label>

              <div class="d-flex">
                <input class="form-control me-2" placeholder="Min" />

                <input class="form-control" placeholder="Max" />
              </div>
            </div>

            <div class="col-md-4">
              <label>Khu vực</label>

              <select class="form-select">
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
                <option>TP.HCM</option>
              </select>
            </div>

            <div class="col-md-4">
              <label>Chế độ làm việc</label>

              <select class="form-select">
                <option>Làm việc tại văn phòng</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
          </div>
        </div>

        <!-- MÔ TẢ -->

        <div class="section-card">
          <div class="section-title">
            <i class="fa-solid fa-file-lines text-success"></i>

            Mô tả chi tiết
          </div>

          <textarea
            class="form-control mb-3"
            rows="4"
            placeholder="Mô tả công việc..."
          ></textarea>

          <div class="row">
            <div class="col-md-6">
              <label>Yêu cầu ứng viên</label>

              <textarea class="form-control" rows="3"></textarea>
            </div>

            <div class="col-md-6">
              <label>Quyền lợi</label>

              <textarea class="form-control" rows="3"></textarea>
            </div>
          </div>
        </div>

        <!-- SKILL -->

        <div class="section-card">
          <div class="section-title">
            <i class="fa-solid fa-lightbulb text-warning"></i>

            Yêu cầu nâng cao
          </div>

          <div class="row">
            <div class="col-md-6">
              <label>Kỹ năng</label>

              <input class="form-control" placeholder="Thêm kỹ năng..." />
            </div>

            <div class="col-md-3">
              <label>Kinh nghiệm</label>

              <select class="form-select">
                <option>Không yêu cầu</option>
                <option>1 năm</option>
                <option>2 năm</option>
              </select>
            </div>

            <div class="col-md-3">
              <label>Hạn nộp</label>

              <input type="date" class="form-control" />
            </div>
          </div>
        </div>

        <div class="text-end">
          <button class="btn btn-light me-2">Lưu bản nháp</button>

          <button class="btn btn-primary">Đăng tin ngay</button>
        </div>
      </div>
   
    </div>
  </body>
</html>
