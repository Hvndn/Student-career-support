<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-5">
    <!-- Search Section -->
    <div class="glass-panel p-4 mb-5 shadow-sm">
        <form action="/jobs" method="GET" class="row g-3">
            <div class="col-md-5">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                    <input type="text" name="keyword" class="form-control border-start-0 ps-0" 
                           placeholder="Tên công việc hoặc từ khóa..." value="${keyword}">
                </div>
            </div>
            <div class="col-md-4">
                <div class="input-group">
                    <span class="input-group-text bg-white border-end-0 text-muted">
                        <i class="fa-solid fa-location-dot"></i>
                    </span>
                    <input type="text" name="location" class="form-control border-start-0 ps-0" 
                           placeholder="Hà Nội, TP. HCM..." value="${location}">
                </div>
            </div>
            <div class="col-md-3">
                <button type="submit" class="btn btn-primary w-100 shadow-sm py-2">
                    Tìm kiếm ngay
                </button>
            </div>
        </form>
    </div>

    <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-lg-3 mb-4">
            <div class="card border-0 shadow-sm sticky-top" style="top: 100px;">
                <div class="card-body p-4">
                    <h6 class="fw-bold mb-4">Lọc theo loại hình</h6>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="jobType" id="typeAll" checked>
                        <label class="form-check-label" for="typeAll">Tất cả</label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="jobType" id="typeFullTime">
                        <label class="form-check-label" for="typeFullTime">Toàn thời gian</label>
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" name="jobType" id="typeIntern">
                        <label class="form-check-label" for="typeIntern">Thực tập sinh</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Job List -->
        <div class="col-lg-9">
            <h5 class="fw-bold mb-4">Tìm thấy ${jobs.size()} công việc</h5>
            
            <c:forEach var="job" items="${jobs}">
                <div class="card border-0 shadow-sm mb-4 hover-translate overflow-hidden">
                    <div class="card-body p-4">
                        <div class="row align-items-center">
                            <div class="col-md-2 text-center mb-3 mb-md-0">
                                <div class="bg-light rounded-4 p-3 d-inline-block">
                                    <i class="fa-solid fa-building fs-1 text-primary"></i>
                                </div>
                            </div>
                            <div class="col-md-7">
                                <h5 class="fw-bold mb-1">${job.title}</h5>
                                <p class="text-primary fw-semibold mb-2">${job.companyName}</p>
                                <div class="d-flex gap-3 text-muted small">
                                    <span><i class="fa-solid fa-location-dot me-1"></i> ${job.location}</span>
                                    <span><i class="fa-solid fa-wallet me-1"></i> ${job.salary}</span>
                                    <span><i class="fa-solid fa-clock me-1"></i> ${job.jobType}</span>
                                </div>
                            </div>
                            <div class="col-md-3 text-md-end mt-3 mt-md-0">
                                <a href="/jobs/${job.id}" class="btn btn-outline-primary px-4 rounded-pill">Chi tiết</a>
                            </div>
                        </div>
                    </div>
                </div>
            </c:forEach>

            <c:if test="${empty jobs}">
                <div class="text-center py-5 glass-panel">
                    <div class="bg-light rounded-circle p-4 d-inline-block mb-4">
                        <i class="fa-solid fa-box-open fs-1 text-muted"></i>
                    </div>
                    <h5>Không tìm thấy công việc phù hợp</h5>
                    <p class="text-muted">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                </div>
            </c:if>
        </div>
    </div>
</div>
