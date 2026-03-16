<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<nav class="navbar navbar-expand-lg navbar-modern sticky-top shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold text-primary fs-3 d-flex align-items-center gap-2" href="/">
            <div class="bg-primary rounded-3 p-1 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                <i class="fa-solid fa-graduation-cap text-white fs-4"></i>
            </div>
            <span class="text-gradient">UniTalent</span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/">Khám phá</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/jobs">Việc làm</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/companies">Công ty</a>
                </li>
            </ul>
            <ul class="navbar-nav align-items-center gap-2">
                <sec:authorize access="isAuthenticated()">
                    <li class="nav-item dropdown">
                        <a class="btn btn-light dropdown-toggle px-4 shadow-sm" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown">
                            <i class="fa-solid fa-user-astronaut text-primary"></i>
                            <span class="ms-1"><sec:authentication property="principal.username"/></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end glass-card border-0 mt-3 p-2 shadow-xl" style="min-width: 240px;">
                            <sec:authorize access="hasAuthority('ROLE_STUDENT')">
                                <li><a class="dropdown-item rounded-3 py-2 mb-1" href="/student/dashboard"><i class="fa-solid fa-shapes me-2 text-primary"></i>Bảng điều khiển</a></li>
                                <li><a class="dropdown-item rounded-3 py-2 mb-1" href="/student/profile"><i class="fa-solid fa-id-badge me-2 text-primary"></i>Hồ sơ cá nhân</a></li>
                            </sec:authorize>
                            
                            <sec:authorize access="hasAuthority('ROLE_COMPANY')">
                                <li><a class="dropdown-item rounded-3 py-2 mb-1" href="/company/dashboard"><i class="fa-solid fa-rocket me-2 text-success"></i>Trung tâm Tuyển dụng</a></li>
                                <li><a class="dropdown-item rounded-3 py-2 mb-1" href="/company/profile"><i class="fa-solid fa-id-card me-2 text-success"></i>Hồ sơ doanh nghiệp</a></li>
                                <li><a class="dropdown-item rounded-3 py-2" href="/company/jobs/post"><i class="fa-solid fa-circle-plus me-2 text-success"></i>Đăng tin mới</a></li>
                            </sec:authorize>

                            <sec:authorize access="hasAuthority('ROLE_ADMIN')">
                                <li><a class="dropdown-item rounded-3 py-2" href="/admin/dashboard"><i class="fa-solid fa-shield-halved me-2 text-danger"></i>Quản trị hệ thống</a></li>
                            </sec:authorize>

                            <li><hr class="dropdown-divider opacity-50"></li>
                            <li>
                                <form action="/logout" method="POST" class="m-0">
                                    <sec:csrfInput/>
                                    <button type="submit" class="dropdown-item rounded-3 py-2 text-danger"><i class="fa-solid fa-power-off me-2"></i>Đăng xuất</button>
                                </form>
                            </li>
                        </ul>
                    </li>
                </sec:authorize>

                <sec:authorize access="isAnonymous()">
                    <li class="nav-item">
                        <a class="nav-link fw-bold px-3 py-2 text-slate-600 hover-translate" href="/login">Đăng nhập</a>
                    </li>
                    <li class="nav-item ms-lg-2">
                        <a class="btn btn-primary px-4 py-2 shadow-premium rounded-pill" href="/students/register">
                            <span>Bắt đầu miễn phí</span>
                            <i class="fa-solid fa-arrow-right ms-2 small"></i>
                        </a>
                    </li>
                </sec:authorize>
            </ul>
        </div>
    </div>
</nav>
