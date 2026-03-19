<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>

<style>
.sidebar-admin-layout {
    display: flex;
    min-height: 100vh;
}
.sidebar {
    width: 240px;
    min-height: 100vh;
    background: white;
    border-right: 1px solid #f1f5f9;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
}
.sidebar .logo { padding-top: 1rem; }
.sidebar .menu { display: flex; flex-direction: column; gap: 4px; margin-top: 2rem; }
.sidebar .menu a {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px;
    text-decoration: none; color: #64748b;
    font-size: 0.875rem; font-weight: 500;
    transition: all 0.2s;
}
.sidebar .menu a:hover, .sidebar .menu a.active {
    background: #fff1f2;
    color: #ef4444;
}
.admin-main {
    margin-left: 240px;
    flex: 1;
    padding: 2rem;
}
.stat-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.07);
    border-left: 4px solid transparent;
}
</style>

<div class="sidebar-admin-layout">
    <!-- Sidebar -->
    <div class="sidebar">
        <div>
            <div class="logo mb-4 d-flex align-items-center gap-2">
                <div class="bg-danger text-white p-2 rounded-3" style="width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                    <strong class="text-danger d-block" style="font-size:1rem;">UniTalent</strong>
                    <small class="text-muted">Admin Panel</small>
                </div>
            </div>
            <div class="menu">
                <a href="/admin/dashboard" class="active">
                    <i class="fa-solid fa-gauge-high"></i> Tổng quan
                </a>
                <a href="#section-users">
                    <i class="fa-solid fa-users"></i> Người dùng
                </a>
                <a href="#section-companies">
                    <i class="fa-solid fa-building"></i> Doanh nghiệp
                </a>
                <a href="#section-skills">
                    <i class="fa-solid fa-list-check"></i> Kỹ năng hệ thống
                </a>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2 pb-2">
            <div class="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style="width:40px;height:40px;">A</div>
            <div>
                <strong class="small d-block">Admin</strong>
                <small class="text-muted">Quản trị viên</small>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="admin-main">
        <!-- Header -->
        <div class="mb-4">
            <h3 class="fw-bold mb-1">Hệ thống Quản trị</h3>
            <p class="text-muted small">Giám sát toàn hệ thống và kiểm duyệt dữ liệu.</p>
        </div>

        <!-- Stats -->
        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="stat-card" style="border-left-color: #6366f1;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted small fw-bold">SINH VIÊN</span>
                        <i class="fa-solid fa-graduation-cap text-primary opacity-50"></i>
                    </div>
                    <h2 class="fw-bold mb-0">${stats.totalStudents}</h2>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card" style="border-left-color: #10b981;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted small fw-bold">DOANH NGHIỆP</span>
                        <i class="fa-solid fa-building text-success opacity-50"></i>
                    </div>
                    <h2 class="fw-bold mb-0">${stats.totalCompanies}</h2>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card" style="border-left-color: #f59e0b;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted small fw-bold">VIỆC LÀM</span>
                        <i class="fa-solid fa-briefcase text-warning opacity-50"></i>
                    </div>
                    <h2 class="fw-bold mb-0">${stats.totalJobs}</h2>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card" style="border-left-color: #ef4444;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted small fw-bold">ỨNG TUYỂN</span>
                        <i class="fa-solid fa-file-lines text-danger opacity-50"></i>
                    </div>
                    <h2 class="fw-bold mb-0">${stats.totalApplications}</h2>
                </div>
            </div>
        </div>

        <!-- Doanh nghiệp chờ duyệt -->
        <div class="card border-0 shadow-sm mb-4" id="section-companies">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold"><i class="fa-solid fa-building me-2 text-warning"></i>Doanh nghiệp chờ phê duyệt</h6>
                <span class="badge bg-warning text-dark fw-bold rounded-pill">${pendingCompanies.size()} yêu cầu</span>
            </div>
            <div class="card-body px-0 pt-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Tên công ty</th>
                                <th>Đại diện</th>
                                <th>Ngày đăng ký</th>
                                <th class="text-center pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="company" items="${pendingCompanies}">
                                <tr>
                                    <td class="ps-4">
                                        <div class="fw-bold">${company.name}</div>
                                        <div class="text-muted extra-small">${company.website}</div>
                                    </td>
                                    <td class="small">${company.user.fullName}</td>
                                    <td class="small"><fmt:formatDate value="${company.user.createdAt}" pattern="dd/MM/yyyy" /></td>
                                    <td class="text-center pe-4">
                                        <form action="/admin/companies/${company.user.id}/approve" method="POST" class="d-inline">
                                            <button type="submit" class="btn btn-sm btn-success px-3">Duyệt</button>
                                        </form>
                                        <form action="/admin/users/${company.user.id}/toggle-lock" method="POST" class="d-inline">
                                            <input type="hidden" name="lock" value="true">
                                            <button type="submit" class="btn btn-sm btn-outline-danger border-0 ms-1 px-3">Từ chối</button>
                                        </form>
                                    </td>
                                </tr>
                            </c:forEach>
                            <c:if test="${empty pendingCompanies}">
                                <tr>
                                    <td colspan="4" class="text-center py-5 text-muted">
                                        <i class="fa-solid fa-circle-check fs-1 text-success opacity-25 d-block mb-3"></i>
                                        Không có yêu cầu phê duyệt mới
                                    </td>
                                </tr>
                            </c:if>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Quản lý người dùng -->
        <div class="card border-0 shadow-sm mb-4" id="section-users">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold"><i class="fa-solid fa-users me-2 text-primary"></i>Quản lý Người dùng</h6>
                <span class="badge bg-primary rounded-pill">${users.size()} tài khoản</span>
            </div>
            <div class="card-body px-0 pt-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Họ tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th class="text-center pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="user" items="${users}">
                                <tr>
                                    <td class="ps-4 fw-bold">${user.fullName}</td>
                                    <td class="small text-muted">${user.email}</td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${user.role == 'student'}">
                                                <span class="badge bg-soft-primary text-primary fw-bold">Sinh viên</span>
                                            </c:when>
                                            <c:when test="${user.role == 'company'}">
                                                <span class="badge bg-soft-success text-success fw-bold">Doanh nghiệp</span>
                                            </c:when>
                                            <c:otherwise>
                                                <span class="badge bg-soft-danger text-danger fw-bold">Admin</span>
                                            </c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${user.active}">
                                                <span class="badge bg-success rounded-pill">Hoạt động</span>
                                            </c:when>
                                            <c:otherwise>
                                                <span class="badge bg-secondary rounded-pill">Đã khóa</span>
                                            </c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td class="text-center pe-4">
                                        <c:choose>
                                            <c:when test="${user.active}">
                                                <form action="/admin/users/${user.id}/toggle-lock" method="POST" class="d-inline">
                                                    <input type="hidden" name="lock" value="true">
                                                    <button type="submit" class="btn btn-sm btn-outline-danger border-0 px-3">Khóa</button>
                                                </form>
                                            </c:when>
                                            <c:otherwise>
                                                <form action="/admin/users/${user.id}/toggle-lock" method="POST" class="d-inline">
                                                    <input type="hidden" name="lock" value="false">
                                                    <button type="submit" class="btn btn-sm btn-outline-success border-0 px-3">Mở khóa</button>
                                                </form>
                                            </c:otherwise>
                                        </c:choose>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Quản lý Kỹ năng -->
        <div class="card border-0 shadow-sm" id="section-skills">
            <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h6 class="mb-0 fw-bold"><i class="fa-solid fa-list-check me-2 text-info"></i>Danh mục Kỹ năng Hệ thống</h6>
                <button class="btn btn-sm btn-primary px-3" data-bs-toggle="modal" data-bs-target="#addSkillModal">
                    <i class="fa-solid fa-plus me-1"></i> Thêm kỹ năng
                </button>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <c:forEach var="skill" items="${skills}">
                        <div class="col-md-4 col-lg-3">
                            <div class="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="fw-bold small">${skill.name}</div>
                                    <div class="text-muted extra-small">${skill.category}</div>
                                </div>
                                <div class="d-flex gap-1">
                                    <form action="/admin/skills/${skill.id}/delete" method="POST" class="d-inline">
                                        <button type="submit" class="btn btn-sm btn-icon p-1" onclick="return confirm('Xóa kỹ năng này?')">
                                            <i class="fa-solid fa-trash text-danger" style="font-size:0.8rem;"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </c:forEach>
                    <c:if test="${empty skills}">
                        <div class="col-12 text-center text-muted py-3">
                            <p>Chưa có kỹ năng nào. Hãy thêm kỹ năng mới!</p>
                        </div>
                    </c:if>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal Thêm Kỹ Năng -->
<div class="modal fade" id="addSkillModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
            <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">Thêm Kỹ năng Hệ thống</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="/admin/skills/create" method="POST">
                <div class="modal-body py-4">
                    <div class="mb-3">
                        <label class="form-label small fw-bold text-muted">TÊN KỸ NĂNG</label>
                        <input type="text" name="name" class="form-control bg-light border-0" placeholder="VD: ReactJS, Python..." required>
                    </div>
                    <div class="mb-0">
                        <label class="form-label small fw-bold text-muted">DANH MỤC</label>
                        <select name="category" class="form-select bg-light border-0">
                            <option value="Professional">Chuyên môn</option>
                            <option value="Soft Skill">Kỹ năng mềm</option>
                            <option value="Language">Ngoại ngữ</option>
                            <option value="Other">Khác</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Hủy</button>
                    <button type="submit" class="btn btn-primary px-4 shadow-sm fw-bold">Lưu kỹ năng</button>
                </div>
            </form>
        </div>
    </div>
</div>
