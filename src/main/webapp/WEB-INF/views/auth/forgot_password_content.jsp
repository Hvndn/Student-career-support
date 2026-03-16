<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<div class="row justify-content-center align-items-center min-vh-100">
    <div class="col-md-6 col-lg-5 col-xl-4">
        <div class="glass-card p-5 text-center">
            <div class="mb-4">
                <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-lg animate-float" style="width: 80px; height: 80px;">
                    <i class="fa-solid fa-key fs-1 text-white"></i>
                </div>
                <h3 class="fw-extrabold text-dark mb-2">Quên mật khẩu?</h3>
                <p class="text-slate-500">Đừng lo lắng, hãy nhập email của bạn để bắt đầu khôi phục truy cập.</p>
            </div>

            <c:if test="${not empty error}">
                <div class="alert alert-danger border-0 shadow-sm badge-premium rounded-3 bg-danger bg-opacity-10 text-danger mb-4 text-start">${error}</div>
            </c:if>
            <c:if test="${not empty message}">
                <div class="alert alert-success border-0 shadow-sm badge-premium rounded-3 bg-success bg-opacity-10 text-success mb-4 text-start">${message}</div>
            </c:if>

            <form action="/forgot-password" method="post">
                <div class="mb-4 text-start">
                    <label class="form-label fw-bold text-slate-700">Địa chỉ Email</label>
                    <div class="position-relative">
                        <i class="fa-solid fa-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400"></i>
                        <input type="email" class="form-control-modern ps-5" name="email" placeholder="name@example.com" required />
                    </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-3 shadow-xl mb-4">
                    <span>Gửi yêu cầu khôi phục</span>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>

            <div class="pt-3 border-top border-slate-100">
                <a href="/login" class="text-primary fw-bold text-decoration-none small transition-all">
                    <i class="fa-solid fa-arrow-left me-2"></i> Quay lại Đăng nhập
                </a>
            </div>
        </div>
    </div>
</div>