<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-5">
    <div class="text-center mb-5">
        <h2 class="display-5 fw-bold mb-3">Đối tác của UniTalent</h2>
        <p class="text-muted fs-5">Kết nối với các tập đoàn hàng đầu tại Việt Nam và trên thế giới.</p>
    </div>

    <div class="row g-4">
        <c:forEach var="company" items="${companies}">
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm hover-translate glass-panel overflow-hidden">
                    <div class="card-body p-4 text-center">
                        <div class="bg-light rounded-circle p-4 d-inline-block mb-4 shadow-sm" style="width: 120px; height: 120px; line-height: 56px;">
                            <c:choose>
                                <c:when test="${not empty company.logoUrl}">
                                    <img src="${company.logoUrl}" alt="${company.name}" class="img-fluid rounded-circle">
                                </c:when>
                                <c:otherwise>
                                    <i class="fa-solid fa-building-user fs-1 text-primary"></i>
                                </c:otherwise>
                            </c:choose>
                        </div>
                        <h4 class="fw-bold mb-1">${company.name}</h4>
                        <p class="text-primary small fw-bold mb-3">
                            <i class="fa-solid fa-location-dot me-1"></i> ${company.address}
                        </p>
                        <p class="text-muted small mb-4 text-truncate-3">
                            ${company.description}
                        </p>
                        <div class="d-flex justify-content-center gap-2">
                            <a href="/companies/${company.id}" class="btn btn-outline-primary px-4 rounded-pill">Xem hồ sơ</a>
                        </div>
                    </div>
                </div>
            </div>
        </c:forEach>

        <c:if test="${empty companies}">
            <div class="col-12 text-center py-5">
                <div class="bg-light rounded-circle p-4 d-inline-block mb-4">
                    <i class="fa-solid fa-building-circle-exclamation fs-1 text-muted"></i>
                </div>
                <h5>Chưa có dữ liệu công ty</h5>
                <p class="text-muted">Dữ liệu đang được cập nhật, vui lòng quay lại sau.</p>
            </div>
        </c:if>
    </div>
</div>
