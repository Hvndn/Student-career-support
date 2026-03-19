<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<div class="row justify-content-center align-items-center min-vh-100 py-5">
    <div class="col-lg-10 col-xl-9">
        <div class="glass-card overflow-hidden border-0">
            <div class="row g-0">
                <div class="col-md-6 bg-slate-900 d-none d-md-flex flex-column justify-content-center p-5 text-white position-relative overflow-hidden">
                    <div class="position-absolute top-0 end-0 p-5 opacity-10">
                        <i class="fa-solid fa-briefcase display-1"></i>
                    </div>
                    <div class="mb-4">
                        <div class="bg-primary rounded-4 d-inline-block p-3 shadow-lg">
                            <i class="fa-solid fa-building-user fs-1 text-white"></i>
                        </div>
                    </div>
                    <h2 class="display-5 fw-extrabold mb-4 leading-tight">Tìm kiếm <span class="text-gradient">Nhân tài</span> đột phá</h2>
                    <p class="lead opacity-75 mb-5">Tiếp cận cộng đồng sinh viên năng động, tài năng và xây dựng đội ngũ kế thừa mạnh mẽ cho doanh nghiệp của bạn.</p>
                    
                    <div class="mt-auto glass-card p-4 border-white border-opacity-10 bg-white bg-opacity-5">
                        <div class="d-flex align-items-center gap-3">
                            <i class="fa-solid fa-bolt text-warning fs-4"></i>
                            <span class="small fw-bold">Tối ưu hóa 40% thời gian tuyển dụng ứng viên Gen Z</span>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 p-5 bg-white">
                    <div class="mb-5">
                        <span class="badge-premium mb-3">Dành cho doanh nghiệp</span>
                        <h3 class="fw-extrabold text-dark mb-2">Quản trị Tuyển dụng</h3>
                        <p class="text-slate-500">Tiếp cận nguồn nhân lực chất lượng cao</p>
                    </div>

                    <c:if test="${not empty error}">
                        <div class="alert alert-danger border-0 shadow-sm badge-premium rounded-3 bg-danger bg-opacity-10 text-danger mb-4">${error}</div>
                    </c:if>

                    <form action="/employer/login" method="post">
                        <div class="mb-4">
                            <label class="form-label fw-bold text-slate-700">Email công ty</label>
                            <div class="position-relative">
                                <i class="fa-solid fa-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400"></i>
                                <input type="email" name="email" class="form-control-modern ps-5" placeholder="hr@yourcompany.com" required>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold text-slate-700">Mật khẩu</label>
                            <div class="position-relative">
                                <i class="fa-solid fa-key position-absolute top-50 start-0 translate-middle-y ms-3 text-slate-400"></i>
                                <input type="password" name="password" class="form-control-modern ps-5" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-5">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="remember-employer">
                                <label class="form-check-label small text-slate-500" for="remember-employer">Ghi nhớ đăng nhập</label>
                            </div>
                            <a href="/forgot-password" class="small text-primary text-decoration-none fw-bold">Quên mật khẩu?</a>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-3 shadow-xl mb-4">
                            <span>Đăng nhập hệ thống</span>
                            <i class="fa-solid fa-rocket"></i>
                        </button>
                    </form>

                    <div class="text-center pt-3 border-top border-slate-100">
                        <p class="text-slate-500 small">Chưa có tài khoản tuyển dụng? 
                            <a href="/employer/register" class="text-primary fw-bold text-decoration-none">Đăng ký doanh nghiệp</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
