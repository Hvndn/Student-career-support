<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Đăng ký sinh viên</title>

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

      /* container */
      .container-box {
        width: 1000px;
        background: white;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        transform: translateY(20px);
        animation: slideUp 0.8s ease forwards;
      }

      /* left panel */
      .left {
        flex: 1;
        background: linear-gradient(135deg, #3b6eea, #2f5ad6);
        color: white;
        padding: 60px 40px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
      }

      .left::before {
        content: "";
        position: absolute;
        width: 300px;
        height: 300px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        top: -80px;
        right: -80px;
      }

      .left h1 {
        font-size: 42px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .left ul li {
        margin-bottom: 10px;
      }

      /* right panel */
      .right {
        flex: 1;
        padding: 60px 50px;
      }

      /* input */
      .form-control {
        height: 48px;
        border-radius: 8px;
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
        transition: all 0.3s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(59, 110, 234, 0.4);
      }

      /* link */
      a {
        text-decoration: none;
        color: #3b6eea;
        font-weight: 500;
      }

      a:hover {
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
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>
  </head>

  <body>
    <div class="container-box">
      <!-- LEFT -->
      <div class="left">
        <h1>UniNext</h1>
        <p>"Kiến tạo tương lai"</p>

        <ul class="mt-4">
          <li>Kết nối với hàng ngàn doanh nghiệp</li>
          <li>Xây dựng lộ trình sự nghiệp cá nhân</li>
          <li>Tiếp cận cơ hội thực tập độc quyền</li>
        </ul>
      </div>

      <!-- RIGHT -->
      <div class="right">
        <h3 class="mb-2">Đăng ký Sinh viên</h3>
        <p class="text-muted mb-4">
          Bắt đầu hành trình học tập và kết nối ngay hôm nay
        </p>

        <form action="/register/student" method="post">
          <div class="mb-3">
            <label>Họ và tên</label>
            <input
              type="text"
              class="form-control"
              name="fullname"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div class="mb-3">
            <label>Email sinh viên (.edu)</label>
            <input
              type="email"
              class="form-control"
              name="email"
              placeholder="ten-sinh-vien@student.edu.vn"
            />
          </div>

          <div class="mb-4">
            <label>Mật khẩu</label>
            <input
              type="password"
              class="form-control"
              name="password"
              placeholder="********"
            />
          </div>

          <button class="btn btn-primary w-100">Đăng ký ngay</button>
        </form>

        <div class="text-center mt-4">
          <p class="small">
            Bạn là Nhà tuyển dụng?
            <a href="/register/recruiter">Đăng ký tại đây</a>
          </p>

          <p class="small">
            Đã có tài khoản?
            <a href="/login">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
