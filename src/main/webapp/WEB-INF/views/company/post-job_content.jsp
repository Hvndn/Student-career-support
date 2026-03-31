<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-4 bg-primary p-5 text-white d-flex flex-column justify-content-center" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                        <i class="fa-solid fa-paper-plane fs-1 mb-4 opacity-75"></i>
                        <h2 class="fw-bold mb-3">Đăng tin Tuyển dụng</h2>
                        <p class="opacity-75">Chia sẻ cơ hội nghề nghiệp của doanh nghiệp bạn tới hàng ngàn sinh viên tài năng.</p>
                        <div class="mt-auto">
                            <div class="d-flex align-items-center gap-3 mb-3 small opacity-75">
                                <i class="fa-solid fa-check-circle"></i> Tiếp cận ứng viên phù hợp
                            </div>
                            <div class="d-flex align-items-center gap-3 mb-3 small opacity-75">
                                <i class="fa-solid fa-check-circle"></i> Đánh giá hồ sơ tự động
                            </div>
                            <div class="d-flex align-items-center gap-3 small opacity-75">
                                <i class="fa-solid fa-check-circle"></i> Quản lý phỏng vấn dễ dàng
                            </div>
                        </div>
                    </div>
                    <div class="col-md-8 p-5 bg-white">
                        <form:form modelAttribute="job" action="/company/jobs/post" method="POST">
                            <h5 class="fw-bold text-dark mb-4">Thông tin chi tiết tin đăng</h5>
                            
                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">TIÊU ĐỀ CÔNG VIỆC</label>
                                <form:input path="title" class="form-control form-control-lg bg-light border-0 px-3" placeholder="VD: Java Backend Developer Intern" required="true" />
                                <form:errors path="title" class="text-danger extra-small mt-1" />
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label small fw-bold text-muted">MỨC LƯƠNG</label>
                                    <form:input path="salary" class="form-control bg-light border-0 px-3" placeholder="VD: 5,000,000 - 10,000,000" />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label small fw-bold text-muted">LOẠI HÌNH</label>
                                    <form:select path="jobType" class="form-select bg-light border-0 px-3">
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="intern">Internship</option>
                                        <option value="freelance">Freelance</option>
                                    </form:select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">ĐỊA ĐIỂM LÀM VIỆC</label>
                                <form:input path="location" class="form-control bg-light border-0 px-3" placeholder="VD: Quận 1, TP. Hồ Chí Minh" />
                            </div>

                            <div class="mb-3">
                                <label class="form-label small fw-bold text-muted">HẠN CHÓT NỘP HỒ SƠ</label>
                                <form:input path="deadline" type="date" class="form-control bg-light border-0 px-3" />
                            </div>

                            <div class="mb-4">
                                <label class="form-label small fw-bold text-muted">MÔ TẢ CÔNG VIỆC & YÊU CẦU</label>
                                <form:textarea path="description" class="form-control bg-light border-0 px-3" rows="6" placeholder="Mô tả chi tiết công việc, yêu cầu kỹ năng và quyền lợi..." />
                            </div>

                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-primary px-5 py-2 fw-bold shadow-sm">Đăng tin ngay</button>
                                <a href="/company/dashboard" class="btn btn-light px-5 py-2 fw-bold text-muted border-0">Hủy bỏ</a>
                            </div>
                        </form:form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
