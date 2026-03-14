<%@ page contentType="text/html;charset=UTF-8" %>
<html lang="vi">
  <head>
    <title>Bảng điều khiển Nhà tuyển dụng</title>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    />

    <style>
      body {
        background: #f4f6f9;
      }

      .dashboard {
        display: flex;
      }

      .sidebar {
        width: 250px;
        background: white;
        height: 100vh;
        padding: 20px;
        border-right: 1px solid #eee;
      }

      .sidebar a {
        display: block;
        padding: 10px;
        text-decoration: none;
        color: #333;
        border-radius: 8px;
        margin-bottom: 10px;
      }

      .sidebar a:hover {
        background: #f0f2f5;
      }

      .main {
        flex: 1;
        padding: 30px;
      }

      .card-box {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .stat {
        font-size: 28px;
        font-weight: 700;
      }

      .chart {
        height: 250px;
        background: #eef2ff;
        border-radius: 10px;
      }
    </style>
  </head>

  <body>
    <div class="dashboard">
      <!-- SIDEBAR -->
      <div class="sidebar">
        <h5 class="mb-4">Recruiter Pro</h5>

        <a href="#">📊 Bảng điều khiển</a>
        <a href="#">📄 Tin tuyển dụng</a>
        <a href="#">👥 Ứng viên</a>
        <a href="#">📅 Lịch phỏng vấn</a>
        <a href="#">📈 Báo cáo</a>

        <hr />

        <button class="btn btn-primary w-100">+ Đăng tin mới</button>
      </div>

      <!-- MAIN -->
      <div class="main">
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card-box">
              Tin tuyển dụng hoạt động
              <div class="stat">24</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-box">
              Tổng số ứng viên
              <div class="stat">1,842</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card-box">
              Ứng viên mới hôm nay
              <div class="stat">45</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <div class="card-box">
              <h5>Tăng trưởng ứng viên</h5>

              <div class="chart d-flex align-items-end p-3">
                <div
                  style="
                    width: 40px;
                    height: 120px;
                    background: #c7d2fe;
                    margin-right: 10px;
                  "
                ></div>
                <div
                  style="
                    width: 40px;
                    height: 180px;
                    background: #c7d2fe;
                    margin-right: 10px;
                  "
                ></div>
                <div
                  style="
                    width: 40px;
                    height: 150px;
                    background: #c7d2fe;
                    margin-right: 10px;
                  "
                ></div>
                <div
                  style="
                    width: 40px;
                    height: 210px;
                    background: #3b82f6;
                    margin-right: 10px;
                  "
                ></div>
                <div
                  style="
                    width: 40px;
                    height: 130px;
                    background: #c7d2fe;
                    margin-right: 10px;
                  "
                ></div>
                <div
                  style="
                    width: 40px;
                    height: 90px;
                    background: #c7d2fe;
                    margin-right: 10px;
                  "
                ></div>
              </div>
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
      </div>
    </div>
  </body>
</html>
