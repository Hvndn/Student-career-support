<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Đăng nhập hệ thống</title>
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: #f3f6fb; min-height: 100vh; }
        .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-box { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 0 40px rgba(0,0,0,0.08); max-width: 900px; width: 100%; }
        .left-panel { background: linear-gradient(135deg, #dce7ff, #edf3ff); padding: 40px; text-align: center; }
        .left-panel img { max-width: 100%; border-radius: 12px; }
        .right-panel { padding: 50px; }
        .form-control { height: 48px; border-radius: 8px; }
        .btn-login { height: 48px; border-radius: 8px; font-weight: 600; }
        .social-btn { height: 45px; border-radius: 8px; }
        .brand { font-weight: 700; font-size: 22px; color: #1d4ed8; }
    </style>
</head>
<body>

<div class="container login-container">
    <div class="row login-box">
        <!-- LEFT -->
        <div class="col-md-6 left-panel d-none d-md-block">
            <div class="brand mb-4">🎓 SinhVienCareer</div>
            <img src="${pageContext.request.contextPath}/images/login/grow.png">
            <h4 class="mt-4 fw-bold">Nâng tầm năng lực - Kết nối tương lai</h4>
            <p class="text-muted mt-2">Nền tảng hỗ trợ sinh viên tìm kiếm việc làm và quản lý lộ trình nghề nghiệp.</p>
        </div>

        <!-- RIGHT -->
        <div class="col-md-6 right-panel">
            <h3 class="fw-bold mb-2">Chào mừng trở lại</h3>
            <p class="text-muted mb-4">Vui lòng nhập thông tin để đăng nhập</p>

            <c:if test="${not empty error}">
                <div class="alert alert-danger">${error}</div>
            </c:if>
            <c:if test="${not empty message}">
                <div class="alert alert-success">${message}</div>
            </c:if>

            <form method="post" action="${pageContext.request.contextPath}/login">
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="text" name="username" class="form-control" placeholder="Nhập email" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mật khẩu</label>
                    <input type="password" name="password" class="form-control" placeholder="Nhập mật khẩu" required>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="remember">
                        <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
                    </div>
                    <a href="#" class="text-decoration-none">Quên mật khẩu?</a>
                </div>
                <button class="btn btn-primary w-100 btn-login mb-3">Đăng nhập</button>
                <div class="text-center text-muted mb-3">Hoặc đăng nhập với</div>

                <div class="d-flex gap-2 mb-4">
                    <button type="button" class="btn btn-outline-danger w-100 social-btn d-flex align-items-center justify-content-center gap-2">
                        <img src="${pageContext.request.contextPath}/images/login/Google.png" width="20"> Google
                    </button>
                    <button type="button" class="btn btn-outline-primary w-100 social-btn d-flex align-items-center justify-content-center gap-2">
                        <img src="${pageContext.request.contextPath}/images/login/phone.png" width="20"> Số điện thoại
                    </button>
                </div>

                <div class="text-center">
                    <div class="mb-2">
                        Chưa có tài khoản? <a href="${pageContext.request.contextPath}/register" class="fw-semibold text-decoration-none">Tham gia ngay</a>
                    </div>
                    <div class="text-muted small">
                        <a href="/terms" class="text-decoration-none text-muted">Điều khoản</a> &nbsp;|&nbsp;
                        <a href="/policy" class="text-decoration-none text-muted">Chính sách</a> &nbsp;|&nbsp;
                        <a href="/support" class="text-decoration-none text-muted">Hỗ trợ</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
