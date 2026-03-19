<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-2">
                    <li class="breadcrumb-item small"><a href="/company/dashboard" class="text-decoration-none text-muted">Dashboard</a></li>
                    <li class="breadcrumb-item small active" aria-current="page">Danh sách ứng viên</li>
                </ol>
            </nav>
            <h3 class="fw-bold text-dark">Ứng viên cho: <span class="text-primary">${not empty applicants ? applicants[0].jobTitle : 'Tin tuyển dụng'}</span></h3>
            <p class="text-muted mb-0">Quản lý và đánh giá các hồ sơ đã nộp cho vị trí này.</p>
        </div>
        <div class="d-flex gap-2">
            <button class="btn btn-outline-primary border-0 rounded-circle p-2" title="Làm mới">
                <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="btn btn-primary px-4 shadow-sm fw-bold rounded-pill">
                <i class="fa-solid fa-file-export me-2"></i> Xuất CSV
            </button>
        </div>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden" style="border-radius: 20px;">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="ps-4 py-3 text-uppercase small fw-bold text-muted border-0">Thông tin ứng viên</th>
                        <th class="py-3 text-uppercase small fw-bold text-muted text-center border-0">Ngày nộp</th>
                        <th class="py-3 text-uppercase small fw-bold text-muted text-center border-0">Trạng thái</th>
                        <th class="pe-4 py-3 text-uppercase small fw-bold text-muted text-end border-0">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="app" items="${applicants}">
                        <tr class="border-bottom">
                            <td class="ps-4 py-4">
                                <div class="d-flex align-items-center">
                                    <div class="position-relative me-3">
                                        <img src="https://ui-avatars.com/api/?name=${app.studentName}&background=random&color=fff&size=48" 
                                             class="rounded-circle shadow-sm" alt="${app.studentName}">
                                        <span class="position-absolute bottom-0 end-0 p-1 bg-success border border-light rounded-circle"></span>
                                    </div>
                                    <div>
                                        <h6 class="fw-bold mb-1 text-dark">${app.studentName}</h6>
                                        <div class="d-flex gap-2 align-items-center">
                                            <span class="badge bg-soft-primary text-primary extra-small px-2 py-1 rounded-pill">Hồ sơ sẵn sàng</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="py-4 text-center">
                                <div class="text-dark small fw-medium">
                                    <fmt:parseDate value="${app.appliedAt}" pattern="yyyy-MM-dd'T'HH:mm" var="parsedDate" type="both" />
                                    <fmt:formatDate value="${parsedDate}" pattern="dd/MM/yyyy" />
                                </div>
                                <div class="text-muted extra-small"><fmt:formatDate value="${parsedDate}" pattern="HH:mm" /></div>
                            </td>
                            <td class="py-4 text-center">
                                <form action="/company/management/applications/${app.id}/status" method="POST" class="d-inline-block">
                                    <select name="status" class="form-select form-select-sm rounded-pill px-3 border-0 bg-soft-${app.status == 'pending' ? 'warning' : (app.status == 'accepted' ? 'success' : (app.status == 'rejected' ? 'danger' : 'info'))} text-${app.status == 'pending' ? 'warning' : (app.status == 'accepted' ? 'success' : (app.status == 'rejected' ? 'danger' : 'info'))} fw-bold" 
                                            onchange="this.form.submit()" style="cursor: pointer;">
                                        <option value="pending" ${app.status == 'pending' ? 'selected' : ''}>Chờ duyệt</option>
                                        <option value="review" ${app.status == 'review' ? 'selected' : ''}>Đang xem xét</option>
                                        <option value="interview" ${app.status == 'interview' ? 'selected' : ''}>Phỏng vấn</option>
                                        <option value="accepted" ${app.status == 'accepted' ? 'selected' : ''}>Đã nhận</option>
                                        <option value="rejected" ${app.status == 'rejected' ? 'selected' : ''}>Từ chối</option>
                                    </select>
                                </form>
                            </td>
                            <td class="pe-4 py-4 text-end">
                                <div class="d-flex justify-content-end gap-2">
                                    <a href="#" class="btn btn-icon-only btn-soft-primary rounded-circle" title="Xem hồ sơ">
                                        <i class="fa-solid fa-address-card"></i>
                                    </a>
                                    <button class="btn btn-icon-only btn-soft-success rounded-circle" title="Hẹn phỏng vấn" 
                                            data-bs-toggle="modal" data-bs-target="#scheduleModal${app.id}">
                                        <i class="fa-solid fa-calendar-plus"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Schedule Modal (Optional structure for future tasks) -->
                        <div class="modal fade" id="scheduleModal${app.id}" tabindex="-1">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content border-0 shadow-lg" style="border-radius: 1.5rem;">
                                    <div class="modal-header border-0 pb-0">
                                        <h5 class="modal-title fw-bold">Đặt lịch phỏng vấn</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <form action="/company/management/applications/${app.id}/schedule" method="POST">
                                        <div class="modal-body p-4">
                                            <p class="text-muted small mb-4">Mời ứng viên <strong>${app.studentName}</strong> tham gia phỏng vấn.</p>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Thời gian</label>
                                                <input type="datetime-local" name="time" class="form-control rounded-3" required>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small fw-bold">Địa điểm/Link họp</label>
                                                <input type="text" name="location" class="form-control rounded-3" placeholder="Văn phòng công ty hoặc link Google Meet..." required>
                                            </div>
                                        </div>
                                        <div class="modal-footer border-0 pt-0 p-4">
                                            <button type="button" class="btn btn-light rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Hủy</button>
                                            <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Xác nhận</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                    
                    <c:if test="${empty applicants}">
                        <tr>
                            <td colspan="4" class="text-center py-5">
                                <div class="bg-light rounded-circle p-4 d-inline-block mb-3">
                                    <i class="fa-solid fa-user-slash fs-1 text-muted"></i>
                                </div>
                                <h5 class="fw-bold">Chưa có ứng viên nào</h5>
                                <p class="text-muted small">Tính năng này sẽ tự động cập nhật khi có sinh viên nộp đơn.</p>
                                <a href="/company/dashboard" class="btn btn-outline-primary btn-sm rounded-pill px-4">Về trang chủ</a>
                            </td>
                        </tr>
                    </c:if>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
    .bg-soft-primary { background-color: rgba(79, 70, 229, 0.1) !important; }
    .bg-soft-success { background-color: rgba(16, 185, 129, 0.1) !important; }
    .bg-soft-warning { background-color: rgba(245, 158, 11, 0.1) !important; }
    .bg-soft-danger { background-color: rgba(239, 68, 68, 0.1) !important; }
    .bg-soft-info { background-color: rgba(6, 182, 212, 0.1) !important; }
    
    .text-primary { color: #4f46e5 !important; }
    .text-success { color: #10b981 !important; }
    .text-warning { color: #f59e0b !important; }
    .text-danger { color: #ef4444 !important; }
    .text-info { color: #06b6d4 !important; }

    .btn-icon-only {
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        transition: all 0.2s;
    }
    .btn-icon-only:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .form-select-sm {
        font-size: 0.75rem;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }
    
    .table-hover tbody tr:hover {
        background-color: rgba(79, 70, 229, 0.01);
    }
</style>
