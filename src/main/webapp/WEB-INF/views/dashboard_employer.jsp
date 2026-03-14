<%@ page contentType="text/html;charset=UTF-8" %>
<html lang="vi">
  <head>
    <title>Bảng điều khiển Nhà tuyển dụng</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      rel="stylesheet"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      rel="stylesheet"
    />

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="/css/dashboard_employer.css" rel="stylesheet" />
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->

      <% request.setAttribute("activePage","dashboard"); %>

      <jsp:include page="sidebar_employer.jsp" />

      <!-- MAIN -->

      <div class="main">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <input
            class="form-control w-50"
            placeholder="Tìm kiếm ứng viên, tin tuyển dụng..."
          />

          <div>
            <i class="fa-regular fa-bell me-3"></i>

            <i class="fa-regular fa-circle-question"></i>
          </div>
        </div>
        <!-- STAT CARDS -->

        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card-box">
              <div class="d-flex justify-content-between">
                <div>
                  Tin tuyển dụng hoạt động
                  <div class="stat">24</div>
                </div>

                <i class="fa-solid fa-bullhorn fa-2x text-primary"></i>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-box">
              <div class="d-flex justify-content-between">
                <div>
                  Tổng số ứng viên
                  <div class="stat">1,842</div>
                </div>

                <i class="fa-solid fa-users fa-2x text-success"></i>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-box">
              <div class="d-flex justify-content-between">
                <div>
                  Ứng viên mới hôm nay
                  <div class="stat">45</div>
                </div>

                <i class="fa-solid fa-user-plus fa-2x text-warning"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- CHART + INTERVIEW -->

        <div class="row mb-4">
          <div class="col-md-8">
            <div class="card-box">
              <h5>Tăng trưởng ứng viên theo tuần</h5>

              <canvas id="chart"></canvas>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-box">
              <h5>Lịch phỏng vấn</h5>

              <hr />

              <p>
                <b>Phạm Anh Quân</b><br />
                Senior UI/UX Designer<br />
                14:00 - 15:00
              </p>

              <hr />

              <p>
                <b>Nguyễn Thùy Linh</b><br />
                Marketing Specialist<br />
                09:30 - 10:30
              </p>

              <hr />

              <p>
                <b>Lê Hoàng Nam</b><br />
                Fullstack Developer<br />
                16:00 - 17:00
              </p>
            </div>
          </div>
        </div>

        <!-- TABLE -->

        <div class="table-box">
          <h5>Ứng viên chờ duyệt</h5>

          <table class="table">
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Vị trí</th>
                <th>Kinh nghiệm</th>
                <th>Trạng thái</th>
                <th>Thao tác nhanh</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td class="d-flex align-items-center">
                  <img
                    src="https://i.pravatar.cc/40?img=1"
                    class="rounded-circle me-2"
                  />

                  <div>
                    <b>Trần Văn A</b><br />
                    <small class="text-muted">tranvana@example.com</small>
                  </div>
                </td>

                <td>Product Designer</td>

                <td>5 năm</td>

                <td>
                  <span class="badge bg-warning text-dark"> ĐANG CHỜ </span>
                </td>

                <td>
                  <i class="fa-solid fa-eye text-primary me-2"></i>

                  <i class="fa-solid fa-check text-success me-2"></i>

                  <i class="fa-solid fa-xmark text-danger"></i>
                </td>
              </tr>

              <tr>
                <td class="d-flex align-items-center">
                  <img
                    src="https://i.pravatar.cc/40?img=2"
                    class="rounded-circle me-2"
                  />

                  <div>
                    <b>Lê Thị B</b><br />
                    <small class="text-muted">lethib@example.com</small>
                  </div>
                </td>

                <td>Frontend Developer</td>

                <td>3 năm</td>

                <td>
                  <span class="badge bg-warning text-dark"> ĐANG CHỜ </span>
                </td>

                <td>
                  <i class="fa-solid fa-eye text-primary me-2"></i>

                  <i class="fa-solid fa-check text-success me-2"></i>

                  <i class="fa-solid fa-xmark text-danger"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      const ctx = document.getElementById("chart");

      new Chart(ctx, {
        type: "bar",

        data: {
          labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],

          datasets: [
            {
              label: "Ứng viên",

              data: [12, 19, 14, 24, 15, 10, 11],

              backgroundColor: "#3b82f6",
            },
          ],
        },
      });
    </script>
  </body>
</html>
