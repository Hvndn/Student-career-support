<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<style>
    .group:hover .group-hover-opacity-100 {
        opacity: 1 !important;
    }
    .transition-all {
        transition: all 0.2s ease-in-out;
    }
    .hover-scale:hover {
        transform: scale(1.2);
    }
</style>

<div class="container py-4">
    <!-- Header Thông tin cá nhân -->
    <div class="glass-panel p-4 mb-4">
        <div class="row align-items-center">
            <div class="col-md-auto text-center mb-3 mb-md-0">
                <div class="position-relative d-inline-block">
                    <img src="${not empty student.avatarUrl ? student.avatarUrl : 'https://ui-avatars.com/api/?name=' += student.user.fullName += '&background=4f46e5&color=fff&size=128'}" 
                         class="rounded-circle shadow-sm border border-4 border-white" style="width: 128px; height: 128px; object-fit: cover;" alt="Avatar">
                    <button class="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm" 
                            data-bs-toggle="modal" data-bs-target="#updateAvatarModal">
                        <i class="fa-solid fa-camera"></i>
                    </button>
                </div>
            </div>
            <div class="col-md">
                <h2 class="fw-bold mb-1">${student.user.fullName}</h2>
                <p class="text-primary fw-semibold mb-2">
                    <i class="fa-solid fa-graduation-cap me-2"></i> ${student.major} @ ${student.university}
                </p>
                <div class="d-flex flex-wrap gap-3 text-muted small">
                    <span><i class="fa-solid fa-envelope me-1"></i> ${student.user.email}</span>
                    <span><i class="fa-solid fa-calendar-check me-1"></i> Tốt nghiệp: ${student.graduationYear}</span>
                    <span class="badge badge-soft-success rounded-pill px-3">GPA: 3.8/4.0</span>
                </div>
            </div>
            <div class="col-md-auto mt-3 mt-md-0">
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                        <i class="fa-solid fa-user-pen me-1"></i> Sửa hồ sơ
                    </button>
                    <a href="/student/profile/export-pdf" class="btn btn-primary shadow-sm">
                        <i class="fa-solid fa-file-pdf me-1"></i> Xuất PDF
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <!-- Cột Trái: Học vấn & Kinh nghiệm -->
        <div class="col-lg-8">
            <!-- Học vấn -->
            <div class="card mb-4 border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold"><i class="fa-solid fa-book-open text-primary me-2"></i> Học vấn</h5>
                    <button class="btn btn-sm btn-soft-primary" data-bs-toggle="modal" data-bs-target="#addEduModal">
                        <i class="fa-solid fa-plus"></i> Thêm
                    </button>
                </div>
                <div class="card-body pt-0">
                    <c:forEach var="edu" items="${educations}">
                        <div class="d-flex gap-3 mb-4 last-child-mb-0 position-relative group">
                            <div class="bg-light rounded-3 p-3 text-center" style="min-width: 65px; height: 65px;">
                                <i class="fa-solid fa-building-columns fs-3 text-muted"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <h6 class="fw-bold mb-1">${edu.schoolName}</h6>
                                    <a href="/student/profile/education/delete/${edu.id}" class="text-danger opacity-0 group-hover-opacity-100 transition-all" 
                                       onclick="return confirm('Bạn có chắc chắn muốn xóa thông tin học vấn này?')">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </a>
                                </div>
                                <p class="mb-1 text-muted small">${edu.degree} - ${edu.major}</p>
                                <span class="badge badge-soft-primary small">
                                    <fmt:parseDate value="${edu.startDate}" pattern="yyyy-MM-dd" var="sDate" type="date"/>
                                    <fmt:formatDate value="${sDate}" pattern="MM/yyyy"/> - 
                                    <c:choose>
                                        <c:when test="${not empty edu.endDate}">
                                            <fmt:parseDate value="${edu.endDate}" pattern="yyyy-MM-dd" var="eDate" type="date"/>
                                            <fmt:formatDate value="${eDate}" pattern="MM/yyyy"/>
                                        </c:when>
                                        <c:otherwise>Hiện tại</c:otherwise>
                                    </c:choose>
                                </span>
                            </div>
                        </div>
                    </c:forEach>
                    <c:if test="${empty educations}">
                        <div class="text-center py-4 text-muted">
                            <i class="fa-solid fa-folder-open display-4 opacity-25 d-block mb-3"></i>
                            <p>Chưa có thông tin học vấn nào.</p>
                        </div>
                    </c:if>
                </div>
            </div>

            <!-- Kinh nghiệm -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold"><i class="fa-solid fa-briefcase text-primary me-2"></i> Kinh nghiệm làm việc</h5>
                    <button class="btn btn-sm btn-soft-primary" data-bs-toggle="modal" data-bs-target="#addExpModal">
                        <i class="fa-solid fa-plus"></i> Thêm
                    </button>
                </div>
                <div class="card-body pt-0">
                    <c:forEach var="exp" items="${experiences}">
                        <div class="d-flex gap-3 mb-4 last-child-mb-0">
                            <div class="bg-light rounded-3 p-3 text-center" style="min-width: 65px; height: 65px;">
                                <i class="fa-solid fa-laptop-code fs-3 text-muted"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <h6 class="fw-bold mb-1">${exp.jobTitle}</h6>
                                    <a href="/student/profile/experience/delete/${exp.id}" class="text-danger opacity-0 group-hover-opacity-100 transition-all"
                                       onclick="return confirm('Bạn có chắc chắn muốn xóa kinh nghiệm này?')">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </a>
                                </div>
                                <p class="mb-1 fw-semibold text-dark small">${exp.companyName}</p>
                                <div class="mb-2">
                                    <span class="badge badge-soft-success small">
                                        <fmt:parseDate value="${exp.startDate}" pattern="yyyy-MM-dd" var="sDate" type="date"/>
                                        <fmt:formatDate value="${sDate}" pattern="MM/yyyy"/> - 
                                        <c:choose>
                                            <c:when test="${not empty exp.endDate}">
                                                <fmt:parseDate value="${exp.endDate}" pattern="yyyy-MM-dd" var="eDate" type="date"/>
                                                <fmt:formatDate value="${eDate}" pattern="MM/yyyy"/>
                                            </c:when>
                                            <c:otherwise>Hiện tại</c:otherwise>
                                        </c:choose>
                                    </span>
                                </div>
                                <p class="text-muted small">${exp.description}</p>
                            </div>
                        </div>
                    </c:forEach>
                    <c:if test="${empty experiences}">
                        <div class="text-center py-4 text-muted">
                            <i class="fa-solid fa-user-clock display-4 opacity-25 d-block mb-3"></i>
                            <p>Hãy thêm kinh nghiệm làm việc để làm nổi bật hồ sơ!</p>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>

        <!-- Cột Phải: Kỹ năng & Dự án -->
        <div class="col-lg-4">
            <!-- Kỹ năng -->
            <div class="card mb-4 border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold"><i class="fa-solid fa-bolt text-warning me-2"></i> Kỹ năng</h5>
                    <button class="btn btn-sm btn-soft-primary" data-bs-toggle="modal" data-bs-target="#addSkillModal">
                        <i class="fa-solid fa-plus"></i> Thêm
                    </button>
                </div>
                <div class="card-body pt-0">
                    <div class="d-flex flex-wrap gap-2 mb-3">
                        <c:forEach var="ss" items="${student.skills}">
                            <div class="badge badge-soft-primary p-2 d-flex align-items-center rounded-pill">
                                <span class="me-2">${ss.skill.name}</span>
                                <span class="badge bg-primary rounded-pill small me-2">${ss.level}</span>
                                <a href="/student/profile/skills/delete/${ss.skill.id}" class="text-danger text-decoration-none hover-scale"
                                   onclick="return confirm('Gỡ kỹ năng này khỏi hồ sơ?')">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                </a>
                            </div>
                        </c:forEach>
                    </div>
                    <c:if test="${empty student.skills}">
                        <p class="text-muted small text-center py-3">Chưa cập nhật kỹ năng.</p>
                    </c:if>
                </div>
            </div>

            <!-- Dự án tiêu biểu -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold"><i class="fa-solid fa-code-fork text-primary me-2"></i> Dự án cá nhân</h5>
                    <button class="btn btn-sm btn-soft-primary" data-bs-toggle="modal" data-bs-target="#addProjectModal">
                        <i class="fa-solid fa-plus"></i> Thêm
                    </button>
                </div>
                <div class="card-body pt-0">
                    <c:forEach var="proj" items="${myProjects}">
                        <div class="border-start border-3 border-primary ps-3 mb-3 position-relative group">
                            <div class="d-flex justify-content-between mb-1">
                                <h6 class="fw-bold mb-0">${proj.name}</h6>
                                <a href="/student/profile/projects/delete/${proj.id}" class="text-danger opacity-0 group-hover-opacity-100 transition-all"
                                   onclick="return confirm('Bạn có chắc chắn muốn xóa dự án này?')">
                                    <i class="fa-solid fa-trash-can"></i>
                                </a>
                            </div>
                            <p class="text-muted small mb-2 text-truncate-2">${proj.description}</p>
                            <a href="${proj.repositoryUrl}" target="_blank" class="text-decoration-none small fw-bold">
                                <i class="fa-brands fa-github me-1"></i> Xem Repository
                            </a>
                        </div>
                    </c:forEach>
                    <c:if test="${empty myProjects}">
                        <p class="text-muted small text-center py-3">Thêm dự án để nhà tuyển dụng thấy năng lực thực tế của bạn.</p>
                    </c:if>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ================= MODALS ================= -->

<!-- Modal Sửa hồ sơ nhanh -->
<div class="modal fade" id="editProfileModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="/student/profile/education/update" method="post" class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Chỉnh sửa hồ sơ nhanh</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-bold">Trường đại học</label>
                    <input type="text" class="form-control" name="university" value="${student.university}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Chuyên ngành</label>
                    <input type="text" class="form-control" name="major" value="${student.major}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Năm tốt nghiệp (Dự kiến)</label>
                    <input type="number" class="form-control" name="gradYear" value="${student.graduationYear}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Link ảnh đại diện (URL)</label>
                    <input type="url" class="form-control" name="avatarUrl" value="${student.avatarUrl}" placeholder="https://example.com/photo.jpg">
                    <div class="form-text small">Dán link ảnh online của bạn vào đây.</div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Hủy</button>
                <button type="submit" class="btn btn-primary px-4">Lưu thay đổi</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Thêm Kỹ năng -->
<div class="modal fade" id="addSkillModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="/student/profile/skills/add" method="post" class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Thêm kỹ năng mới</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-bold">Chọn kỹ năng</label>
                    <select name="skillId" class="form-select border-0 bg-light" required>
                        <c:forEach var="sk" items="${skills}">
                            <option value="${sk.id}">${sk.name} (${sk.category})</option>
                        </c:forEach>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Trình độ</label>
                    <select name="level" class="form-select border-0 bg-light" required>
                        <option value="BEGINNER">Cơ bản (Beginner)</option>
                        <option value="INTERMEDIATE">Khá (Intermediate)</option>
                        <option value="ADVANCED">Thành thạo (Advanced)</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="submit" class="btn btn-primary w-100 py-2">Xác nhận thêm</button>
            </div>
        </form>
    </div>
</div>

<!-- Thêm dự án Modal -->
<div class="modal fade" id="addProjectModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="/student/profile/projects/add" method="post" class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Thêm dự án tiêu biểu</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-bold">Tên dự án</label>
                    <input type="text" name="name" class="form-control" placeholder="E-commerce App, Smart Home..." required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Mô tả ngắn</label>
                    <textarea name="description" class="form-control" rows="3" placeholder="Tóm tắt công nghệ và vai trò của bạn..."></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Link Repository (Github/Gitlab)</label>
                    <input type="url" name="repositoryUrl" class="form-control" placeholder="https://github.com/...">
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="submit" class="btn btn-primary w-100 py-2">Thêm dự án</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Thêm Học vấn (Chi tiết) -->
<div class="modal fade" id="addEduModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="/student/profile/education/add" method="post" class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Thêm thông tin học vấn</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-bold">Trường học</label>
                    <input type="text" name="schoolName" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Chuyên ngành</label>
                    <input type="text" name="major" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Bằng cấp</label>
                    <input type="text" name="degree" class="form-control" placeholder="Cử nhân, Kỹ sư...">
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Bắt đầu</label>
                        <input type="date" name="startDate" class="form-control" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Kết thúc</label>
                        <input type="date" name="endDate" class="form-control">
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="submit" class="btn btn-primary w-100 py-2">Thêm học vấn</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Thêm Kinh nghiệm (Chi tiết) -->
<div class="modal fade" id="addExpModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="/student/profile/experience/add" method="post" class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Thêm kinh nghiệm mới</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label fw-bold">Vị trí công việc</label>
                    <input type="text" name="jobTitle" class="form-control" placeholder="Thực tập sinh, Dev..." required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Tên công ty / Tổ chức</label>
                    <input type="text" name="companyName" class="form-control" required>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Từ tháng/năm</label>
                        <input type="date" name="startDate" class="form-control" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label fw-bold">Đến tháng/năm</label>
                        <input type="date" name="endDate" class="form-control">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Mô tả công việc</label>
                    <textarea name="description" class="form-control" rows="3"></textarea>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="submit" class="btn btn-primary w-100 py-2">Thêm kinh nghiệm</button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Cập nhật Ảnh đại diện -->
<div class="modal fade" id="updateAvatarModal" tabindex="-1">
    <div class="modal-dialog">
        <form action="/student/profile/avatar/update" method="post" enctype="multipart/form-data" class="modal-content border-0 shadow">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Thay đổi ảnh đại diện</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="text-center mb-4">
                    <img src="${not empty student.avatarUrl ? student.avatarUrl : 'https://ui-avatars.com/api/?name=' += student.user.fullName += '&background=4f46e5&color=fff&size=120'}" 
                         class="rounded-circle border" style="width: 120px; height: 120px; object-fit: cover;" alt="Preview">
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Chọn ảnh từ máy tính</label>
                    <input type="file" class="form-control" name="avatarFile" accept="image/*" required>
                    <div class="form-text small">Hỗ trợ các định dạng JPG, PNG, GIF.</div>
                </div>
            </div>
            <div class="modal-footer border-0">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Đóng</button>
                <button type="submit" class="btn btn-primary px-4">Cập nhật ngay</button>
            </div>
        </form>
    </div>
</div>
