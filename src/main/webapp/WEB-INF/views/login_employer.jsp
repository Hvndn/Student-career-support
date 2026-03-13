<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Đăng nhập Nhà tuyển dụng</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <style>
      body {
        background: #eef2f8;
        font-family: system-ui;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.8s ease;
      }

      .container-box {
        width: 1100px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        animation: slideUp 0.8s ease;
      }

      /* LEFT PANEL */

      .left {
        flex: 1;
        background: url("https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200")
          center/cover;
        position: relative;
        display: flex;
        align-items: flex-end;
        padding: 40px;
        color: white;
      }

      .left::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          135deg,
          rgba(30, 70, 200, 0.75),
          rgba(60, 110, 255, 0.85)
        );
      }

      .left-content {
        position: relative;
        z-index: 2;
      }

      .left h1 {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .left p {
        opacity: 0.9;
      }

      /* RIGHT PANEL */

      .right {
        flex: 1;
        padding: 60px 60px;
      }

      .form-control {
        height: 48px;
        border-radius: 8px;
        transition: all 0.3s;
      }

      .form-control:focus {
        border-color: #3b6eea;
        box-shadow: 0 0 0 3px rgba(59, 110, 234, 0.2);
      }

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
        box-shadow: 0 8px 20px rgba(59, 110, 234, 0.4);
      }

      .divider {
        text-align: center;
        margin: 20px 0;
        color: #888;
      }

      .social-btn {
        border: 1px solid #ddd;
        height: 45px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        cursor: pointer;
        transition: 0.3s;
      }

      .social-btn:hover {
        background: #f5f7fb;
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
          transform: translateY(30px);
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
        <div class="left-content">
          <h1>Tìm đúng nhân tài</h1>

          <p>
            Nền tảng tuyển dụng giúp doanh nghiệp kết nối với sinh viên tài năng
            và xây dựng đội ngũ mạnh mẽ cho tương lai.
          </p>
        </div>
      </div>

      <!-- RIGHT -->

      <div class="right">
        <h4 class="mb-1">RecruitPro</h4>

        <h2 class="fw-bold mb-2">Chào mừng Nhà tuyển dụng</h2>

        <p class="text-muted mb-4">
          Đăng nhập để quản lý tin tuyển dụng và kết nối với ứng viên tiềm năng.
        </p>

        <form action="/employer/login" method="post">
          <div class="mb-3">
            <label>Email doanh nghiệp</label>
            <input
              type="email"
              class="form-control"
              placeholder="hr@company.com"
            />
          </div>

          <div class="mb-3">
            <label>Mật khẩu</label>
            <div class="input-group">
              <input type="password" class="form-control" id="password" />
              <button
                class="btn btn-outline-secondary"
                type="button"
                onclick="togglePassword()"
              >
                👁
              </button>
            </div>
          </div>

          <div
            class="d-flex justify-content-between align-items-center mb-4 small"
          >
            <div><input type="checkbox" /> Ghi nhớ đăng nhập</div>

            <a href="#">Quên mật khẩu?</a>
          </div>

          <button class="btn btn-primary w-100">Đăng nhập</button>
        </form>

        <div class="divider">Hoặc tiếp tục với</div>

        <div class="row g-2 mb-4">
          <div class="col">
            <div class="social-btn">Google</div>
          </div>

          <div class="col">
            <div class="social-btn">GitHub</div>
          </div>
        </div>

        <div class="text-center small">
          Chưa có tài khoản?
          <a href="/register/recruiter">Đăng ký ngay</a>
        </div>
      </div>
    </div>

    <script>
      function togglePassword() {
        const input = document.getElementById("password");
        input.type = input.type === "password" ? "text" : "password";
      }
    </script>
  </body>
</html>
