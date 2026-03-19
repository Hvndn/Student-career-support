<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<div class="row justify-content-center align-items-center min-vh-100">
    <div class="col-lg-12">
        <div class="glass-panel overflow-hidden border-0 shadow-lg">
            <div class="row g-0">
                <div class="col-md-4 bg-gradient-primary d-none d-md-flex flex-column justify-content-center p-5 text-white">
                    <div class="mb-4">
                        <i class="fa-solid fa-briefcase fs-1"></i>
                    </div>
                    <h2 class="display-6 fw-bold mb-4">Mở rộng quy mô doanh nghiệp</h2>
                    <p class="opacity-75 mb-4">Kết nối với nguồn nhân lực trẻ, được đào tạo bài bản và sẵn sàng cống hiến. UniTalent cung cấp giải pháp tuyển dụng toàn diện.</p>
                    <ul class="list-unstyled">
                        <li class="mb-3"><i class="fa-solid fa-check-double me-2 text-info"></i> Đăng tin tuyển dụng không giới hạn</li>
                        <li class="mb-3"><i class="fa-solid fa-check-double me-2 text-info"></i> Quản lý ứng viên thông minh</li>
                        <li class="mb-3"><i class="fa-solid fa-check-double me-2 text-info"></i> Lên lịch phỏng vấn tự động</li>
                    </ul>
                </div>
                <div class="col-md-8 p-5 bg-white bg-opacity-75">
                    <div class="mb-4">
                        <h3 class="fw-bold text-dark mb-2">Đăng ký Nhà tuyển dụng</h3>
                        <p class="text-muted">Bắt đầu xây dựng đội ngũ trong mơ của bạn</p>
                    </div>

                    <c:if test="${not empty error}">
                        <div class="alert alert-danger border-0 shadow-sm badge-soft-danger rounded-3">${error}</div>
                    </c:if>

                    <form action="/employer/register" method="post">
                        <div class="row g-3">
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Họ và tên người đại diện</label>
                                <input type="text" class="form-control" name="fullName" placeholder="Nguyễn Văn A" required />
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Tên doanh nghiệp</label>
                                <input type="text" class="form-control" name="companyName" placeholder="Công ty TNHH Tech Solutions" required />
                            </div>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Email doanh nghiệp</label>
                                <input type="email" class="form-control" name="email" placeholder="hr@company.com" required />
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label fw-bold">Số điện thoại</label>
                                <input type="text" class="form-control" name="phone" placeholder="090 123 4567" required />
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-bold">Mật khẩu</label>
                            <input type="password" class="form-control" name="password" placeholder="Min. 8 ký tự với chữ và số" required />
                        </div>

                        <div class="form-check mb-4">
                            <input class="form-check-input" type="checkbox" id="termsCheck" required>
                            <label class="form-check-label small text-muted" for="termsCheck">
                                Tôi đồng ý với <a href="#" class="text-primary text-decoration-none fw-bold">Điều khoản dịch vụ</a> và <a href="#" class="text-primary text-decoration-none fw-bold">Chính sách bảo mật</a>.
                            </label>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-3 fw-bold mb-4 shadow-sm">
                            Đăng ký tài khoản doanh nghiệp <i class="fa-solid fa-briefcase ms-2"></i>
                        </button>
                    </form>

                    <div class="text-center pt-3 border-top">
                        <p class="small text-muted mb-2">Bạn là Sinh viên? 
                            <a href="/students/register" class="text-primary fw-bold text-decoration-none">Đăng ký tại đây</a>
                        </p>
                        <p class="small text-muted">Đã có tài khoản? 
                            <a href="/employer/login" class="text-primary fw-bold text-decoration-none">Đăng nhập</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
