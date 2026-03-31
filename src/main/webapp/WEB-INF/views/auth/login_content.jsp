<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<div class="row justify-content-center align-items-center min-vh-100 py-5">
    <div class="col-lg-10 col-xl-8">
        <div class="glass-card overflow-hidden border-0">
            <div class="row g-0">
                <!-- Left Panel -->
                <div class="col-md-5 hero-mesh d-none d-md-flex flex-column justify-content-center p-5 text-dark">
                    <div class="mb-4">
                        <div class="bg-primary rounded-4 d-inline-block p-3 shadow-lg animate-float">
                            <i class="fa-solid fa-rocket fs-1 text-white"></i>
                        </div>
                    </div>
                    <h2 class="display-6 fw-extrabold mb-4">Chào mừng đến <span class="text-gradient">UniTalent</span></h2>
                    <p class="text-slate-600 mb-4">Nền tảng kết nối tài năng và cơ hội nghề nghiệp hàng đầu Việt Nam.</p>
                    <div class="d-flex flex-column gap-2 mt-auto">
                        <div class="glass-card p-3 border-0 bg-white bg-opacity-50 d-flex align-items-center gap-3 rounded-3">
                            <i class="fa-solid fa-user-graduate text-primary"></i>
                            <span class="small fw-bold">Sinh viên – Tìm việc & hồ sơ năng lực</span>
                        </div>
                        <div class="glass-card p-3 border-0 bg-white bg-opacity-50 d-flex align-items-center gap-3 rounded-3">
                            <i class="fa-solid fa-building text-success"></i>
                            <span class="small fw-bold">Nhà tuyển dụng – Đăng tin & tìm ứng viên</span>
                        </div>
                        <div class="glass-card p-3 border-0 bg-white bg-opacity-50 d-flex align-items-center gap-3 rounded-3">
                            <i class="fa-solid fa-shield-halved text-danger"></i>
                            <span class="small fw-bold">Quản trị viên – Giám sát hệ thống</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Form -->
                <div class="col-md-7 p-5 bg-white">
                    <div class="mb-5">
                        <h3 class="fw-extrabold text-dark mb-1">Đăng nhập</h3>
                        <p class="text-muted small">Dùng chung cho sinh viên, nhà tuyển dụng và quản trị viên</p>
                    </div>

                    <c:if test="${not empty error}">
                        <div class="alert alert-danger border-0 rounded-3 bg-danger bg-opacity-10 text-danger mb-4">
                            <i class="fa-solid fa-triangle-exclamation me-2"></i>${error}
                        </div>
                    </c:if>
                    <c:if test="${not empty message}">
                        <div class="alert alert-success border-0 rounded-3 bg-success bg-opacity-10 text-success mb-4">
                            <i class="fa-solid fa-circle-check me-2"></i>${message}
                        </div>
                    </c:if>

                    <form method="post" action="/login">
                        <div class="mb-4">
                            <label class="form-label fw-bold text-slate-700">Email</label>
                            <div class="position-relative">
                                <i class="fa-solid fa-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400"></i>
                                <input type="email" name="email" class="form-control-modern ps-5" placeholder="email@example.com" required autofocus>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold text-slate-700">Mật khẩu</label>
                            <div class="position-relative">
                                <i class="fa-solid fa-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400"></i>
                                <input type="password" name="password" class="form-control-modern ps-5" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-5">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="remember">
                                <label class="form-check-label small text-muted" for="remember">Ghi nhớ đăng nhập</label>
                            </div>
                            <a href="/forgot-password" class="small text-primary fw-bold text-decoration-none">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-3 shadow-xl mb-4 fw-bold">
                            <i class="fa-solid fa-right-to-bracket me-2"></i> Đăng nhập
                        </button>

                        <div class="text-center pt-3 border-top">
                            <p class="text-muted small mb-0">Chưa có tài khoản?
                                <a href="/register" class="text-primary fw-bold text-decoration-none">Đăng ký ngay</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
