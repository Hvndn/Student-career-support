<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<div class="row justify-content-center align-items-center min-vh-100">
    <div class="col-lg-10">
        <div class="glass-panel overflow-hidden">
            <div class="row g-0">
                <div class="col-md-5 bg-gradient-accent d-none d-md-flex flex-column justify-content-center p-5 text-white">
                    <div class="mb-4">
                        <i class="fa-solid fa-user-plus fs-1"></i>
                    </div>
                    <h2 class="display-6 fw-bold mb-4">Tham gia UniTalent ngay</h2>
                    <p class="opacity-75 mb-4">Tạo hồ sơ chuyên nghiệp, kết nối với nhà tuyển dụng hàng đầu và nhận gợi ý việc làm phù hợp nhất với năng lực của bạn.</p>
                    <ul class="list-unstyled">
                        <li class="mb-3"><i class="fa-solid fa-circle-check me-2"></i> Tạo CV chuyên nghiệp</li>
                        <li class="mb-3"><i class="fa-solid fa-circle-check me-2"></i> Theo dõi trạng thái ứng tuyển</li>
                        <li class="mb-3"><i class="fa-solid fa-circle-check me-2"></i> Nhận thông báo phỏng vấn</li>
                    </ul>
                </div>
                <div class="col-md-7 p-5 bg-white bg-opacity-75">
                    <div class="mb-4">
                        <h3 class="fw-bold text-dark mb-2">Đăng ký Sinh viên</h3>
                        <p class="text-muted">Bắt đầu hành trình sự nghiệp của bạn</p>
                    </div>

                    <c:if test="${not empty error}">
                        <div class="alert alert-danger border-0 shadow-sm badge-soft-danger rounded-3">${error}</div>
                    </c:if>

                    <form action="/students/register" method="post">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Họ và tên</label>
                                <input type="text" class="form-control" name="fullName" placeholder="Nguyễn Văn A" required />
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Mã sinh viên</label>
                                <input type="text" class="form-control" name="studentCode" placeholder="20211234" required />
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Email sinh viên</label>
                            <input type="email" class="form-control" name="email" placeholder="example@student.vn" required />
                            <div class="form-text small">Khuyên dùng email tên miền .edu</div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold">Mật khẩu</label>
                            <input type="password" class="form-control" name="password" placeholder="********" required />
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-3 fw-bold mb-4">
                            Đăng ký tài khoản <i class="fa-solid fa-rocket ms-2"></i>
                        </button>
                    </form>

                    <div class="text-center pt-3 border-top">
                        <p class="small text-muted mb-2">Bạn là Nhà tuyển dụng? 
                            <a href="/employer/register" class="text-primary fw-bold text-decoration-none border-bottom border-primary">Đăng ký tại đây</a>
                        </p>
                        <p class="small text-muted">Đã có tài khoản? 
                            <a href="/login" class="text-primary fw-bold text-decoration-none">Đăng nhập ngay</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
