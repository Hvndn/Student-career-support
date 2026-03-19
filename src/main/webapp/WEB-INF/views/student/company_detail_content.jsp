<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<div class="container py-5">
    <!-- Company Header -->
    <div class="glass-panel p-5 mb-5 shadow-lg border-0 overflow-hidden position-relative">
        <div class="row align-items-center position-relative" style="z-index: 2;">
            <div class="col-md-auto text-center mb-4 mb-md-0">
                <div class="bg-white rounded-circle p-1 shadow-sm d-inline-block">
                    <div class="bg-light rounded-circle p-4 d-flex align-items-center justify-content-center" style="width: 150px; height: 150px;">
                        <c:choose>
                            <c:when test="${not empty company.logoUrl}">
                                <img src="${company.logoUrl}" alt="${company.name}" class="img-fluid rounded-circle">
                            </c:when>
                            <c:otherwise>
                                <i class="fa-solid fa-building-user fs-1 text-primary"></i>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>
            <div class="col-md ms-md-4">
                <h1 class="display-5 fw-bold text-dark mb-2">${company.name}</h1>
                <div class="d-flex flex-wrap gap-3 mb-4">
                    <span class="badge badge-soft-primary px-3 py-2 rounded-pill">
                        <i class="fa-solid fa-location-dot me-2"></i>${company.address}
                    </span>
                    <c:if test="${not empty company.website}">
                        <a href="${company.website}" target="_blank" class="badge badge-soft-info px-3 py-2 rounded-pill text-decoration-none transition-all">
                            <i class="fa-solid fa-globe me-2"></i>Website Công ty
                        </a>
                    </c:if>
                    <span class="badge badge-soft-success px-3 py-2 rounded-pill">
                        <i class="fa-solid fa-users me-2"></i>Đang tuyển dụng
                    </span>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary px-4 rounded-pill shadow-sm">Theo dõi Công ty</button>
                    <c:if test="${not empty company.email}">
                        <a href="mailto:${company.email}" class="btn btn-outline-dark px-4 rounded-pill">Liên hệ</a>
                    </c:if>
                </div>
            </div>
        </div>
        <!-- Decorative Background Element -->
        <div class="position-absolute top-0 end-0 p-5 mt-n5 me-n5 opacity-10">
            <i class="fa-solid fa-building-columns" style="font-size: 300px;"></i>
        </div>
    </div>

    <div class="row">
        <!-- Left Column: Company Info -->
        <div class="col-lg-8">
            <div class="glass-panel p-4 mb-4">
                <h4 class="fw-bold mb-4 border-bottom pb-3">
                    <i class="fa-solid fa-circle-info text-primary me-2"></i>Giới thiệu doanh nghiệp
                </h4>
                <div class="text-muted lh-lg">
                    ${company.description}
                </div>
            </div>

            <div class="glass-panel p-4">
                <h4 class="fw-bold mb-4 border-bottom pb-3">
                    <i class="fa-solid fa-briefcase text-primary me-2"></i>Vị trí đang tuyển dụng
                </h4>
                <div class="row g-3">
                    <c:forEach var="job" items="${jobs}">
                        <div class="col-12">
                            <div class="card border-0 bg-light bg-opacity-50 hover-translate rounded-4 p-3 transition-all">
                                <div class="row align-items-center">
                                    <div class="col">
                                        <h5 class="fw-bold mb-1">${job.title}</h5>
                                        <div class="d-flex flex-wrap gap-2 small">
                                            <span class="text-primary"><i class="fa-solid fa-location-dot me-1"></i>${job.location}</span>
                                            <span class="text-success fw-bold"><i class="fa-solid fa-money-bill-wave me-1"></i>${job.salary}</span>
                                            <span class="text-muted"><i class="fa-solid fa-clock me-1"></i>${job.jobType}</span>
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <a href="/jobs/${job.id}" class="btn btn-soft-primary rounded-pill btn-sm px-4">Xem chi tiết</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                    <c:if test="${empty jobs}">
                        <div class="col-12 text-center py-4 text-muted">
                            Hiện công ty chưa đăng tin tuyển dụng nào mới.
                        </div>
                    </c:if>
                </div>
            </div>
        </div>

        <!-- Right Column: Quick Stats/Contact -->
        <div class="col-lg-4">
            <div class="glass-panel p-4 mb-4">
                <h5 class="fw-bold mb-3">Thông tin liên hệ</h5>
                <ul class="list-unstyled mb-0">
                    <li class="mb-3 d-flex align-items-center">
                        <div class="bg-soft-primary rounded-3 p-2 me-3">
                            <i class="fa-solid fa-envelope text-primary"></i>
                        </div>
                        <div>
                            <small class="text-muted d-block">Email</small>
                            <span class="fw-bold">${empty company.email ? 'Đang cập nhật' : company.email}</span>
                        </div>
                    </li>
                    <li class="mb-3 d-flex align-items-center">
                        <div class="bg-soft-success rounded-3 p-2 me-3">
                            <i class="fa-solid fa-phone text-success"></i>
                        </div>
                        <div>
                            <small class="text-muted d-block">Điện thoại</small>
                            <span class="fw-bold">${empty company.phone ? 'Đang cập nhật' : company.phone}</span>
                        </div>
                    </li>
                    <li class="d-flex align-items-center">
                        <div class="bg-soft-warning rounded-3 p-2 me-3">
                            <i class="fa-solid fa-map-location-dot text-warning"></i>
                        </div>
                        <div>
                            <small class="text-muted d-block">Trụ sở Công ty</small>
                            <span class="fw-bold small">${company.address}</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="glass-panel p-4">
                <h5 class="fw-bold mb-3">Về UniTalent</h5>
                <div class="bg-primary bg-opacity-10 rounded-4 p-3 border-start border-4 border-primary">
                    <p class="small text-muted mb-0">
                        UniTalent là nền tảng kết nối sinh viên và doanh nghiệp hàng đầu, giúp bạn tìm kiếm cơ hội nghề nghiệp phù hợp nhất với năng lực.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
