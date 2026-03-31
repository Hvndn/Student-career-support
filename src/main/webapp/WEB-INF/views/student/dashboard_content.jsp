<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-4">
    <div class="row mb-4">
        <div class="col-12">
            <h3 class="fw-bold text-dark">
                Chào mừng trở lại, <span class="text-primary">${fullName}</span> 👋
            </h3>
            <p class="text-muted">Dưới đây là tổng quan về lộ trình phát triển sự nghiệp của bạn.</p>
        </div>
    </div>

    <!-- Stats Row -->
    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="glass-panel p-4 h-100 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-primary p-3 rounded-4 me-3">
                    <i class="fa-solid fa-code fs-3 text-primary"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${skillCount}</h2>
                    <p class="text-muted mb-0">Kỹ năng đạt được</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="glass-panel p-4 h-100 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-success p-3 rounded-4 me-3">
                    <i class="fa-solid fa-diagram-project fs-3 text-success"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${projectCount}</h2>
                    <p class="text-muted mb-0">Dự án hoàn thành</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="glass-panel p-4 h-100 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-warning p-3 rounded-4 me-3">
                    <i class="fa-solid fa-paper-plane fs-3 text-warning"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${applicationCount}</h2>
                    <p class="text-muted mb-0">Đơn đã ứng tuyển</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <!-- Main Column -->
        <div class="col-lg-8">
            <!-- Profile Progress Card -->
            <div class="card border-0 shadow-sm mb-4 overflow-hidden">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-bold mb-0">Tiến độ hồ sơ chuyên nghiệp</h6>
                        <span class="badge bg-primary rounded-pill">75%</span>
                    </div>
                    <div class="progress mb-4" style="height: 10px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 75%"></div>
                    </div>
                    <div class="bg-light p-3 rounded-3 d-flex align-items-start small">
                        <i class="fa-solid fa-lightbulb text-warning me-3 mt-1 fs-5"></i>
                        <div>
                            <strong class="d-block mb-1">💡 Gợi ý cho bạn</strong>
                            Bổ sung thêm <strong>Chứng chỉ Tiếng Anh</strong> và <strong>Dự án cá nhân</strong> để tăng 40% khả năng được Nhà tuyển dụng chú ý.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recommended Jobs -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 class="mb-0 fw-bold">Việc làm gợi ý phù hợp</h6>
                    <a href="/jobs" class="text-primary small fw-bold text-decoration-none">Xem tất cả <i class="fa-solid fa-arrow-right small ms-1"></i></a>
                </div>
                <div class="card-body px-0 pt-0">
                    <div class="list-group list-group-flush">
                        <div class="list-group-item p-4 border-0 border-bottom">
                            <div class="d-flex gap-3">
                                <div class="bg-light p-3 rounded-3 text-center" style="width: 64px; height: 64px;">
                                    <i class="fa-brands fa-google fs-2 text-primary"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between">
                                        <h6 class="fw-bold mb-1">Frontend Developer (ReactJS)</h6>
                                        <span class="text-primary fw-bold">$800 - $1200</span>
                                    </div>
                                    <p class="text-muted small mb-2">Google Inc • TP. Hồ Chí Minh • Từ xa</p>
                                    <div class="d-flex gap-2">
                                        <span class="badge badge-soft-primary">React</span>
                                        <span class="badge badge-soft-primary">JavaScript</span>
                                        <span class="badge bg-soft-info text-info border-0 ms-auto">Match 95%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="list-group-item p-4 border-0">
                            <div class="d-flex gap-3">
                                <div class="bg-dark p-3 rounded-3 text-center" style="width: 64px; height: 64px;">
                                    <i class="fa-brands fa-apple fs-2 text-white"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between">
                                        <h6 class="fw-bold mb-1">UI/UX Design Intern</h6>
                                        <span class="text-primary fw-bold">Thỏa thuận</span>
                                    </div>
                                    <p class="text-muted small mb-2">Apple Vietnam • Hà Nội • Văn phòng</p>
                                    <div class="d-flex gap-2">
                                        <span class="badge badge-soft-primary">Figma</span>
                                        <span class="badge badge-soft-primary">UI Design</span>
                                        <span class="badge bg-soft-info text-info border-0 ms-auto">Match 88%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
            <!-- Notifications Card -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 class="mb-0 fw-bold">Thông báo mới</h6>
                    <span class="badge bg-danger rounded-pill">3</span>
                </div>
                <div class="card-body pt-0">
                    <div class="d-flex gap-3 mb-4">
                        <div class="bg-soft-primary p-2 rounded-circle" style="width: 40px; height: 40px; text-align: center;">
                            <i class="fa-solid fa-briefcase text-primary"></i>
                        </div>
                        <div>
                            <p class="small mb-1"><strong>FPT Software</strong> đã xem hồ sơ của bạn cho vị trí Java Intern.</p>
                            <span class="text-muted extra-small">10 phút trước</span>
                        </div>
                    </div>
                    <div class="d-flex gap-3 mb-4">
                        <div class="bg-soft-success p-2 rounded-circle" style="width: 40px; height: 40px; text-align: center;">
                            <i class="fa-solid fa-check-double text-success"></i>
                        </div>
                        <div>
                            <p class="small mb-1">Kỹ năng <strong>Java Core</strong> đã được hệ thống xác thực thành công.</p>
                            <span class="text-muted extra-small">2 giờ trước</span>
                        </div>
                    </div>
                    <button class="btn btn-light w-100 btn-sm fw-bold border-0 py-2">Xem tất cả</button>
                </div>
            </div>

            <!-- Quick Links / Actions -->
            <div class="glass-panel p-4 shadow-sm border-0 text-white bg-primary" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                <h6 class="fw-bold mb-3"><i class="fa-solid fa-bolt me-2 text-warning"></i> Thao tác nhanh</h6>
                <div class="d-grid gap-2">
                    <a href="/student/profile" class="btn btn-light btn-sm text-primary fw-bold border-0 py-2">Cập nhật hồ sơ</a>
                    <a href="/jobs" class="btn btn-white-outline btn-sm fw-bold border-0 py-2">Tìm việc làm ngay</a>
                </div>
            </div>
        </div>
    </div>
</div>
