<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-4">
    <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <div>
                <h3 class="fw-bold text-dark">
                    Chào mừng trở lại, <span class="text-primary">${companyName}</span> 
                </h3>
                <p class="text-muted">Xin chào ${fullName}, hãy xem tiến độ săn tìm nhân tài hôm nay.</p>
            </div>
            <a href="/company/profile" class="btn btn-outline-primary rounded-pill px-4">
                <i class="fa-solid fa-pen-to-square me-2"></i>Chỉnh sửa hồ sơ
            </a>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-4">
        <div class="col-md-3">
            <div class="glass-panel p-4 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-primary p-3 rounded-4 me-3">
                    <i class="fa-solid fa-briefcase fs-3 text-primary"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${activeJobsCount}</h2>
                    <p class="text-muted small mb-0">Tin đang tuyển</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="glass-panel p-4 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-success p-3 rounded-4 me-3">
                    <i class="fa-solid fa-users fs-3 text-success"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${totalCandidatesCount}</h2>
                    <p class="text-muted small mb-0">Tổng ứng viên</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="glass-panel p-4 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-warning p-3 rounded-4 me-3">
                    <i class="fa-solid fa-calendar-check fs-3 text-warning"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${pendingInterviewsCount}</h2>
                    <p class="text-muted small mb-0">Lịch phỏng vấn</p>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="glass-panel p-4 shadow-sm border-0 d-flex align-items-center">
                <div class="bg-soft-info p-3 rounded-4 me-3">
                    <i class="fa-solid fa-eye fs-3 text-info"></i>
                </div>
                <div>
                    <h2 class="fw-bold mb-0">${profileViewsCount}</h2>
                    <p class="text-muted small mb-0">Lượt xem hồ sơ</p>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-lg-8">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white border-0 py-3">
                    <h6 class="fw-bold mb-0">Thống kê tuyển dụng (7 ngày qua)</h6>
                </div>
                <div class="card-body">
                    <canvas id="recruitmentChart" style="height: 300px;"></canvas>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h6 class="fw-bold mb-0">Ứng viên mới nhất</h6>
                    <a href="/company/candidates" class="text-primary small fw-bold text-decoration-none">Xem tất cả</a>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light small">
                                <tr>
                                    <th class="ps-4">Ứng viên</th>
                                    <th>Vị trí</th>
                                    <th>Ngày nộp</th>
                                    <th class="pe-4">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="candidate" items="${recentCandidates}">
                                    <tr>
                                        <td class="ps-4">
                                            <div class="d-flex align-items-center gap-2">
                                                <img src="https://ui-avatars.com/api/?name=${candidate.fullName}&background=random" class="rounded-circle" width="32">
                                                <span class="small fw-bold">${candidate.fullName}</span>
                                            </div>
                                        </td>
                                        <td class="small">${candidate.jobTitle}</td>
                                        <td class="small text-muted">${candidate.appliedDate}</td>
                                        <td class="pe-4">
                                            <button class="btn btn-sm btn-soft-primary">Chi tiết</button>
                                        </td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white border-0 py-3">
                    <h6 class="fw-bold mb-0">Thông báo từ hệ thống</h6>
                </div>
                <div class="card-body">
                    <div class="d-flex gap-3 mb-3 pb-3 border-bottom">
                        <div class="bg-soft-success p-2 rounded-circle" style="width: 32px; height: 32px;">
                            <i class="fa-solid fa-check text-success small"></i>
                        </div>
                        <div>
                            <p class="small mb-0">Tin đăng <strong>"Java Developer"</strong> đã được duyệt.</p>
                            <span class="text-muted extra-small">2 giờ trước</span>
                        </div>
                    </div>
                    <div class="d-flex gap-3">
                        <div class="bg-soft-warning p-2 rounded-circle" style="width: 32px; height: 32px;">
                            <i class="fa-solid fa-triangle-exclamation text-warning small"></i>
                        </div>
                        <div>
                            <p class="small mb-0">Hồ sơ doanh nghiệp cần cập nhật thông báo thuế.</p>
                            <span class="text-muted extra-small">5 giờ trước</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-panel p-4 shadow-sm border-0 text-white" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);">
                <h6 class="fw-bold mb-3">Tăng tốc tuyển dụng?</h6>
                <p class="small opacity-75 mb-4">Sử dụng gói Employer Hub để được ưu tiên hiển thị tin tuyển dụng hàng đầu.</p>
                <button class="btn btn-light btn-sm w-100 fw-bold border-0 py-2">Nâng cấp ngay</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('recruitmentChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                    datasets: [{
                        label: 'Lượt ứng tuyển',
                        data: [12, 19, 15, 25, 22, 10, 8],
                        borderColor: '#4f46e5',
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(79, 70, 229, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { display: false } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    });
</script>
