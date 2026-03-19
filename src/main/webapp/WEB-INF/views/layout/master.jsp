<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${param.pageTitle != null ? param.pageTitle : 'UniTalent - Nền tảng tuyển dụng sinh viên'}</title>
    
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Bootstrap 5.3.3 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome 6.5.1 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css">
    <style>
        :root {
            --primary-color: #4f46e5;
            --secondary-color: #7c3aed;
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f8fafc;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
        }
        .bg-soft-primary { background-color: rgba(79, 70, 229, 0.1); }
        .bg-soft-success { background-color: rgba(16, 185, 129, 0.1); }
        .bg-soft-warning { background-color: rgba(245, 158, 11, 0.1); }
        .text-primary { color: #4f46e5 !important; }
        .btn-primary { background-color: #4f46e5; border-color: #4f46e5; }
        .btn-primary:hover { background-color: #4338ca; border-color: #4338ca; }
    </style>
</head>
<body>
    <jsp:include page="header.jsp" />

    <c:set var="isFullWidth" value="${param.isFullWidth == 'true'}" />

    <div class="${isFullWidth ? '' : 'container mt-4 mb-5'}">
        <c:choose>
            <c:when test="${not empty param.content}">
                <jsp:include page="${param.content}" />
            </c:when>
            <c:otherwise>
                <%-- Fallback nếu không có content --%>
                <div class="py-5 text-center">
                    <p class="text-muted">Nội dung đang được cập nhật...</p>
                </div>
            </c:otherwise>
        </c:choose>
    </div>

    <footer class="bg-dark text-white py-5 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4 mb-md-0">
                    <h5 class="fw-bold text-primary mb-3">UniTalent</h5>
                    <p class="text-white-50 small">Kết nối doanh nghiệp với sinh viên tài năng. Nền tảng tuyển dụng số 1 cho thế hệ Gen Z tại Việt Nam.</p>
                </div>
                <div class="col-md-2 mb-4 mb-md-0">
                    <h6 class="fw-bold mb-3">Sản phẩm</h6>
                    <ul class="list-unstyled small">
                        <li class="mb-2"><a href="/" class="text-white-50 text-decoration-none">Trang chủ</a></li>
                        <li class="mb-2"><a href="/jobs" class="text-white-50 text-decoration-none">Việc làm</a></li>
                        <li class="mb-2"><a href="/companies" class="text-white-50 text-decoration-none">Công ty</a></li>
                    </ul>
                </div>
                <div class="col-md-3 mb-4 mb-md-0">
                    <h6 class="fw-bold mb-3">Liên hệ</h6>
                    <ul class="list-unstyled small text-white-50">
                        <li class="mb-2"><i class="fa-solid fa-envelope me-2"></i> contact@unitalent.vn</li>
                        <li class="mb-2"><i class="fa-solid fa-phone me-2"></i> +84 123 456 789</li>
                    </ul>
                </div>
                <div class="col-md-3">
                    <h6 class="fw-bold mb-3">Theo dõi</h6>
                    <div class="d-flex gap-3">
                        <a href="#" class="text-white-50 fs-5"><i class="fa-brands fa-facebook"></i></a>
                        <a href="#" class="text-white-50 fs-5"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="#" class="text-white-50 fs-5"><i class="fa-brands fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <hr class="my-4 border-secondary opacity-25">
            <div class="text-center text-white-50 extra-small">
                &copy; 2026 UniTalent. All rights reserved.
            </div>
        </div>
    </footer>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
