<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<div class="container py-5">
    <div class="row mb-4">
        <div class="col-12 text-center text-md-start">
            <h3 class="fw-bold text-dark">Việc làm đã ứng tuyển</h3>
            <p class="text-muted">Theo dõi trạng thái các hồ sơ bạn đã nộp.</p>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-12">
            <div class="card border-0 shadow-sm overflow-hidden" style="border-radius: 20px;">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead>
                                <tr class="bg-light border-0">
                                    <th class="ps-4 py-3 text-uppercase small fw-bold text-muted border-0">Vị trí & Công ty</th>
                                    <th class="py-3 text-uppercase small fw-bold text-muted text-center border-0">Ngày ứng tuyển</th>
                                    <th class="py-3 text-uppercase small fw-bold text-muted text-center border-0">Trạng thái</th>
                                    <th class="pe-4 py-3 text-uppercase small fw-bold text-muted text-end border-0">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="app" items="${applications}">
                                    <tr class="border-bottom-0">
                                        <td class="ps-4 py-4">
                                            <div class="d-flex align-items-center">
                                                <div class="bg-soft-primary p-3 rounded-4 me-3 d-none d-sm-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                                    <i class="fa-solid fa-briefcase text-primary"></i>
                                                </div>
                                                <div>
                                                    <h6 class="fw-bold mb-1 text-dark">${app.jobTitle}</h6>
                                                    <p class="text-primary small mb-0 fw-semibold">${app.companyName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-4 text-center">
                                            <span class="text-muted small">
                                                <i class="fa-regular fa-calendar-check me-1"></i>
                                                <fmt:parseDate value="${app.appliedAt}" pattern="yyyy-MM-dd'T'HH:mm" var="parsedDate" type="both" />
                                                <fmt:formatDate value="${parsedDate}" pattern="dd/MM/yyyy" />
                                            </span>
                                        </td>
                                        <td class="py-4 text-center">
                                            <c:choose>
                                                <c:when test="${app.status == 'pending'}">
                                                    <span class="badge bg-soft-warning text-warning px-3 py-2 rounded-pill fw-medium">Đang chờ</span>
                                                </c:when>
                                                <c:when test="${app.status == 'review'}">
                                                    <span class="badge bg-soft-info text-info px-3 py-2 rounded-pill fw-medium">Đang xem xét</span>
                                                </c:when>
                                                <c:when test="${app.status == 'interview'}">
                                                    <span class="badge bg-soft-primary text-primary px-3 py-2 rounded-pill fw-medium">Phỏng vấn</span>
                                                </c:when>
                                                <c:when test="${app.status == 'accepted'}">
                                                    <span class="badge bg-soft-success text-success px-3 py-2 rounded-pill fw-medium">Đã nhận</span>
                                                </c:when>
                                                <c:when test="${app.status == 'rejected'}">
                                                    <span class="badge bg-soft-danger text-danger px-3 py-2 rounded-pill fw-medium">Từ chối</span>
                                                </c:when>
                                                <c:otherwise>
                                                    <span class="badge bg-soft-secondary text-secondary px-3 py-2 rounded-pill fw-medium">${app.status}</span>
                                                </c:otherwise>
                                            </c:choose>
                                        </td>
                                        <td class="pe-4 py-4 text-end">
                                            <a href="/jobs/${app.jobId}" class="btn btn-outline-primary btn-sm rounded-pill px-3 hover-scale">
                                                Chi tiết <i class="fa-solid fa-arrow-right-long ms-1"></i>
                                            </a>
                                        </td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>
                    </div>
                    
                    <c:if test="${empty applications}">
                        <div class="text-center py-5">
                            <div class="bg-light rounded-circle p-4 d-inline-block mb-4 shadow-sm">
                                <i class="fa-solid fa-paper-plane fs-1 text-muted"></i>
                            </div>
                            <h5 class="fw-bold">Bạn chưa ứng tuyển công việc nào</h5>
                            <p class="text-muted mb-4">Khám phá các cơ hội nghề nghiệp và nộp đơn ngay hôm nay.</p>
                            <a href="/jobs" class="btn btn-primary px-5 py-2 rounded-pill shadow-sm">Tìm việc làm ngay</a>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-soft-primary { background-color: rgba(79, 70, 229, 0.1); }
    .bg-soft-warning { background-color: rgba(245, 158, 11, 0.1); }
    .bg-soft-info { background-color: rgba(6, 182, 212, 0.1); }
    .bg-soft-success { background-color: rgba(16, 185, 129, 0.1); }
    .bg-soft-danger { background-color: rgba(239, 68, 68, 0.1); }
    .bg-soft-secondary { background-color: rgba(107, 114, 128, 0.1); }
    
    .hover-scale { transition: transform 0.2s; }
    .hover-scale:hover { transform: scale(1.05); }
    
    .table-hover tbody tr:hover {
        background-color: rgba(79, 70, 229, 0.02);
    }
</style>
