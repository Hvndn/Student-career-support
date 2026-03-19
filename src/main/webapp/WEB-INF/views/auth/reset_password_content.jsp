<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<div class="row justify-content-center align-items-center min-vh-100">
    <div class="col-md-6 col-lg-5">
        <div class="glass-panel p-5 bg-white bg-opacity-90 shadow-lg">
            <div class="text-center mb-4">
                <div class="bg-soft-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    <i class="fa-solid fa-key fs-1 text-success"></i>
                </div>
                <h3 class="fw-bold text-dark mb-2">Đặt lại mật khẩu</h3>
                <p class="text-muted">Nhập mật khẩu mới của bạn bên dưới.</p>
            </div>

            <c:if test="${not empty error}">
                <div class="alert alert-danger border-0 shadow-sm badge-soft-danger rounded-3 mb-4">${error}</div>
            </c:if>

            <form action="/reset-password" method="post">
                <input type="hidden" name="token" value="${token}" />
                
                <div class="mb-4">
                    <label class="form-label fw-bold">Mật khẩu mới</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0"><i class="fa-solid fa-lock text-primary"></i></span>
                        <input type="password" class="form-control" name="password" placeholder="Min. 8 ký tự" required />
                    </div>
                </div>

                <div class="mb-4">
                    <label class="form-label fw-bold">Xác nhận mật khẩu</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0"><i class="fa-solid fa-lock text-primary"></i></span>
                        <input type="password" class="form-control" placeholder="Nhập lại mật khẩu" required />
                    </div>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-3 fw-bold mb-3 shadow-sm">
                    Cập nhật mật khẩu <i class="fa-solid fa-check-circle ms-2 small"></i>
                </button>
            </form>
        </div>
    </div>
</div>