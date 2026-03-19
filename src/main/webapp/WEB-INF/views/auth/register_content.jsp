<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="row justify-content-center align-items-center min-vh-100 py-5">
    <div class="col-lg-10 col-xl-8">
        <div class="glass-card overflow-hidden border-0">
            <div class="row g-0">
                <!-- Left Panel -->
                <div class="col-md-5 hero-mesh d-none d-md-flex flex-column justify-content-center p-5">
                    <div class="mb-4">
                        <div class="bg-primary rounded-4 d-inline-block p-3 shadow-lg animate-float">
                            <i class="fa-solid fa-user-plus fs-1 text-white"></i>
                        </div>
                    </div>
                    <h2 class="display-6 fw-extrabold mb-4">Bắt đầu hành trình <span class="text-gradient">sự nghiệp</span></h2>
                    <p class="text-slate-600 mb-4">Tạo tài khoản miễn phí và kết nối với hàng trăm cơ hội việc làm phù hợp.</p>
                    <div class="glass-card p-4 border-0 bg-white bg-opacity-50 rounded-3">
                        <div class="d-flex align-items-center gap-3">
                            <i class="fa-solid fa-circle-check fs-4 text-primary"></i>
                            <span class="fw-bold small">Hơn 5,000 sinh viên đã tìm được việc làm</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Role Selection or Form -->
                <div class="col-md-7 p-5 bg-white">

                    <c:if test="${empty registerRole}">
                        <%-- BƯỚC 1: Chọn vai trò --%>
                        <div class="mb-5">
                            <h3 class="fw-extrabold text-dark mb-1">Đăng ký tài khoản</h3>
                            <p class="text-muted small">Bạn muốn tham gia với tư cách nào?</p>
                        </div>

                        <div class="d-flex flex-column gap-3">
                            <a href="/register?role=student" class="text-decoration-none">
                                <div class="card border-2 border-primary rounded-4 p-4 hover-translate" style="cursor:pointer; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-4">
                                        <div class="bg-primary bg-opacity-10 rounded-3 p-3">
                                            <i class="fa-solid fa-user-graduate fs-2 text-primary"></i>
                                        </div>
                                        <div>
                                            <h5 class="fw-bold mb-1 text-dark">Sinh viên / Ứng viên</h5>
                                            <p class="text-muted small mb-0">Tìm việc làm, thực tập và xây dựng hồ sơ năng lực cá nhân</p>
                                        </div>
                                        <i class="fa-solid fa-chevron-right ms-auto text-muted"></i>
                                    </div>
                                </div>
                            </a>

                            <a href="/register?role=company" class="text-decoration-none">
                                <div class="card border-2 border-success rounded-4 p-4 hover-translate" style="cursor:pointer; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-4">
                                        <div class="bg-success bg-opacity-10 rounded-3 p-3">
                                            <i class="fa-solid fa-building fs-2 text-success"></i>
                                        </div>
                                        <div>
                                            <h5 class="fw-bold mb-1 text-dark">Nhà tuyển dụng</h5>
                                            <p class="text-muted small mb-0">Đăng tin tuyển dụng và tìm kiếm ứng viên phù hợp</p>
                                        </div>
                                        <i class="fa-solid fa-chevron-right ms-auto text-muted"></i>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div class="text-center pt-4 border-top mt-4">
                            <p class="text-muted small mb-0">Đã có tài khoản?
                                <a href="/login" class="text-primary fw-bold text-decoration-none">Đăng nhập ngay</a>
                            </p>
                        </div>
                    </c:if>

                    <c:if test="${registerRole == 'student'}">
                        <%-- BƯỚC 2a: Form đăng ký sinh viên --%>
                        <div class="mb-4">
                            <a href="/register" class="text-muted small text-decoration-none">
                                <i class="fa-solid fa-arrow-left me-1"></i> Quay lại
                            </a>
                            <h3 class="fw-extrabold text-dark mb-1 mt-3">Đăng ký Sinh viên</h3>
                            <p class="text-muted small">Điền đầy đủ thông tin bên dưới</p>
                        </div>

                        <c:if test="${not empty error}">
                            <div class="alert alert-danger border-0 rounded-3 bg-danger bg-opacity-10 text-danger mb-4">${error}</div>
                        </c:if>

                        <form method="post" action="/students/register">
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">HỌ VÀ TÊN</label>
                                <input type="text" name="fullName" class="form-control bg-light border-0" placeholder="Nguyễn Văn A" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">EMAIL</label>
                                <input type="email" name="email" class="form-control bg-light border-0" placeholder="email@example.com" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">MÃ SINH VIÊN</label>
                                <input type="text" name="studentCode" class="form-control bg-light border-0" placeholder="VD: SV2021001">
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted">MẬT KHẨU</label>
                                <input type="password" name="password" class="form-control bg-light border-0" placeholder="Ít nhất 6 ký tự" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 py-3 fw-bold shadow-sm mb-3">
                                <i class="fa-solid fa-user-plus me-2"></i> Tạo tài khoản Sinh viên
                            </button>
                            <p class="text-center text-muted small mb-0">Đã có tài khoản? 
                                <a href="/login" class="text-primary fw-bold text-decoration-none">Đăng nhập</a>
                            </p>
                        </form>
                    </c:if>

                    <c:if test="${registerRole == 'company'}">
                        <%-- BƯỚC 2b: Form đăng ký nhà tuyển dụng --%>
                        <div class="mb-4">
                            <a href="/register" class="text-muted small text-decoration-none">
                                <i class="fa-solid fa-arrow-left me-1"></i> Quay lại
                            </a>
                            <h3 class="fw-extrabold text-dark mb-1 mt-3">Đăng ký Nhà tuyển dụng</h3>
                            <p class="text-muted small">Điền đầy đủ thông tin doanh nghiệp</p>
                        </div>

                        <c:if test="${not empty error}">
                            <div class="alert alert-danger border-0 rounded-3 bg-danger bg-opacity-10 text-danger mb-4">${error}</div>
                        </c:if>

                        <form method="post" action="/employer/register">
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">TÊN NGƯỜI ĐẠI DIỆN</label>
                                <input type="text" name="fullName" class="form-control bg-light border-0" placeholder="Nguyễn Thị B" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">TÊN CÔNG TY</label>
                                <input type="text" name="companyName" class="form-control bg-light border-0" placeholder="Công ty TNHH ABC" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">EMAIL DOANH NGHIỆP</label>
                                <input type="email" name="email" class="form-control bg-light border-0" placeholder="hr@company.vn" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-bold small text-muted">SỐ ĐIỆN THOẠI</label>
                                <input type="tel" name="phone" class="form-control bg-light border-0" placeholder="0901 234 567">
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold small text-muted">MẬT KHẨU</label>
                                <input type="password" name="password" class="form-control bg-light border-0" placeholder="Ít nhất 6 ký tự" required>
                            </div>
                            <button type="submit" class="btn btn-success w-100 py-3 fw-bold shadow-sm mb-3">
                                <i class="fa-solid fa-building-user me-2"></i> Tạo tài khoản Doanh nghiệp
                            </button>
                            <p class="text-center text-muted small mb-0">Đã có tài khoản?
                                <a href="/login" class="text-primary fw-bold text-decoration-none">Đăng nhập</a>
                            </p>
                        </form>
                    </c:if>

                </div>
            </div>
        </div>
    </div>
</div>
