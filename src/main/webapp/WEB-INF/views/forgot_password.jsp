<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Quên mật khẩu</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <style>
      body {
        background: #f5f7fb;
        font-family: system-ui;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.8s ease;
      }

      .container-box {
        width: 1050px;
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
        background: linear-gradient(135deg, #ff5a1f, #ff3d00);
        color: white;
        padding: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
      }

      .left h1 {
        font-size: 42px;
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

      .form-control {
        height: 48px;
        border-radius: 10px;
        transition: 0.3s;
      }

      .form-control:focus {
        border-color: #ff5a1f;
        box-shadow: 0 0 0 3px rgba(255, 90, 31, 0.2);
      }

      .btn-primary {
        height: 48px;
        border-radius: 10px;
        background: linear-gradient(135deg, #ff5a1f, #ff3d00);
        border: none;
        font-weight: 600;
        transition: 0.3s;
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(255, 90, 31, 0.4);
      }

      /* animation */

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
      <!-- LEFT -->

      <div class="left">
        <h1>Mở khóa tiềm năng nghề nghiệp của bạn</h1>

        <p>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu và tiếp tục hành
          trình phát triển sự nghiệp.
        </p>

        <div class="mt-5 small">© 2026 Student Career Support System</div>
      </div>

      <!-- RIGHT -->

      <div class="right">
        <h3 class="mb-3">Quên mật khẩu?</h3>

        <p class="text-muted mb-4">
          Nhập email của bạn để nhận liên kết khôi phục mật khẩu.
        </p>

        <form action="/forgot-password" method="post">
          <div class="mb-4">
            <label>Địa chỉ Email</label>

            <input
              type="email"
              class="form-control"
              name="email"
              placeholder="ten-cua-ban@gmail.com"
              required
            />
          </div>

          <button class="btn btn-primary w-100">Gửi yêu cầu →</button>
        </form>

        <hr class="my-4" />

        <div class="text-center small">
          <a href="/login"> ← Quay lại đăng nhập </a>
        </div>
      </div>
    </div>
  </body>
</html>
