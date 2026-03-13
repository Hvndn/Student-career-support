<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Đăng ký Nhà tuyển dụng</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <style>
      body {
        background: linear-gradient(135deg, #eef2ff, #f5f7fb);
        font-family: system-ui;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 1s ease;
      }

      /* card */

      .container-box {
        width: 1100px;
        background: white;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        display: flex;
        animation: slideUp 0.8s ease;
      }

      /* LEFT */

      .left {
        flex: 1;
        background: linear-gradient(135deg, #3b6eea, #2f5ad6);
        color: white;
        padding: 60px 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }

      .left::before {
        content: "";
        position: absolute;
        width: 350px;
        height: 350px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        top: -100px;
        right: -100px;
      }

      .left::after {
        content: "";
        position: absolute;
        width: 250px;
        height: 250px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 50%;
        bottom: -80px;
        left: -80px;
      }

      .left h1 {
        font-size: 46px;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .left p {
        opacity: 0.9;
        max-width: 420px;
      }

      /* RIGHT */

      .right {
        flex: 1;
        padding: 60px;
      }

      /* input */

      .form-control {
        height: 48px;
        border-radius: 10px;
        transition: all 0.3s;
      }

      .form-control:focus {
        border-color: #3b6eea;
        box-shadow: 0 0 0 3px rgba(59, 110, 234, 0.2);
      }

      /* button */

      .btn-primary {
        height: 48px;
        border-radius: 10px;
        font-weight: 600;
        background: linear-gradient(135deg, #3b6eea, #2f5ad6);
        border: none;
        transition: 0.3s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(59, 110, 234, 0.4);
      }

      /* link */

      .small a {
        text-decoration: none;
        color: #3b6eea;
        font-weight: 500;
      }

      .small a:hover {
        text-decoration: underline;
      }

      /* animations */

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          transform: translateY(40px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    </style>
  </head>

  <body>
    <div class="container-box">
      <!-- LEFT PANEL -->

      <div class="left">
        <h1>Kết nối nhân tài</h1>

        <p>
          Nền tảng tuyển dụng SaaS hàng đầu giúp doanh nghiệp tìm kiếm và quản
          lý ứng viên tiềm năng một cách hiệu quả nhất.
        </p>

        <div class="mt-5 small">Hơn 2,000+ doanh nghiệp đã tin dùng</div>
      </div>

      <!-- RIGHT PANEL -->

      <div class="right">
        <h3 class="mb-2">Đăng ký Nhà tuyển dụng</h3>

        <p class="text-muted mb-4">
          Bắt đầu xây dựng đội ngũ trong mơ của bạn ngay hôm nay.
        </p>

        <form action="/employer/register" method="post">
          <div class="mb-3">
            <label>Họ và tên người đại diện</label>
            <input
              type="text"
              class="form-control"
              name="fullname"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div class="mb-3">
            <label>Tên công ty</label>
            <input
              type="text"
              class="form-control"
              name="companyName"
              placeholder="Công ty TNHH ABC"
            />
          </div>

          <div class="mb-3">
            <label>Email doanh nghiệp</label>
            <input
              type="email"
              class="form-control"
              name="email"
              placeholder="hr@company.com"
            />
          </div>

          <div class="mb-3">
            <label>Số điện thoại</label>
            <input
              type="text"
              class="form-control"
              name="phone"
              placeholder="0901 234 567"
            />
          </div>

          <div class="mb-3">
            <label>Mật khẩu</label>
            <input
              type="password"
              class="form-control"
              name="password"
              placeholder="********"
            />
          </div>

          <div class="form-check mb-4">
            <input class="form-check-input" type="checkbox" />
            <label class="form-check-label small">
              Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và
              <a href="#">Chính sách bảo mật</a>
            </label>
          </div>

          <button class="btn btn-primary w-100">Đăng ký ngay</button>
        </form>

        <hr class="my-4" />

        <div class="text-center small">
          <p>
            Bạn là Sinh viên?
            <a href="/students/register">Đăng ký tại đây</a>
          </p>

          <p>
            Đã có tài khoản?
            <a href="/login">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
