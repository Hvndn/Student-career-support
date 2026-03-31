<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-4">
    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="card border-0 shadow-sm overflow-hidden">
                <div class="card-header bg-primary py-4 text-white">
                    <h4 class="mb-0 fw-bold"><i class="fa-solid fa-id-card-clip me-2"></i>Quản lý Hồ sơ Doanh nghiệp</h4>
                </div>
                <div class="card-body p-4 p-md-5">
                    <c:if test="${param.success != null}">
                        <div class="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
                            <i class="fa-solid fa-circle-check me-2"></i>Cập nhật thông tin thành công!
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    </c:if>

                    <form action="/company/profile/update" method="POST" enctype="multipart/form-data">
                        <div class="row g-4">
                            <!-- Logo Section -->
                            <div class="col-12 text-center mb-4">
                                <div class="position-relative d-inline-block">
                                    <div class="bg-light rounded-circle p-1 shadow-sm border overflow-hidden d-flex align-items-center justify-content-center" style="width: 160px; height: 160px;">
                                        <c:choose>
                                            <c:when test="${not empty company.logoUrl}">
                                                <img id="logoPreview" src="${company.logoUrl}" alt="Logo" class="img-fluid rounded-circle" style="object-fit: cover; width: 100%; height: 100%;">
                                            </c:when>
                                            <c:otherwise>
                                                <i class="fa-solid fa-building fs-1 text-muted"></i>
                                            </c:otherwise>
                                        </c:choose>
                                    </div>
                                    <label for="logoFile" class="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0 shadow" style="width: 38px; height: 38px; padding-top: 8px;">
                                        <i class="fa-solid fa-camera"></i>
                                        <input type="file" id="logoFile" name="logoFile" class="d-none" accept="image/*" onchange="previewImage(this)">
                                    </label>
                                </div>
                                <p class="small text-muted mt-3">Tải lên logo doanh nghiệp (định dạng: JPG, PNG, GIF)</p>
                            </div>

                            <!-- Basic Info -->
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-uppercase">Tên doanh nghiệp</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa-solid fa-building text-primary"></i></span>
                                    <input type="text" name="name" class="form-control" value="${company.name}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-uppercase">Website</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa-solid fa-globe text-primary"></i></span>
                                    <input type="url" name="website" class="form-control" value="${company.website}" placeholder="https://example.com">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-uppercase">Email liên hệ</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa-solid fa-envelope text-primary"></i></span>
                                    <input type="email" name="email" class="form-control" value="${company.email}" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label fw-bold small text-uppercase">Số điện thoại</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa-solid fa-phone text-primary"></i></span>
                                    <input type="tel" name="phone" class="form-control" value="${company.phone}">
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-bold small text-uppercase">Địa chỉ trụ sở</label>
                                <div class="input-group">
                                    <span class="input-group-text bg-white"><i class="fa-solid fa-map-location-dot text-primary"></i></span>
                                    <input type="text" name="address" class="form-control" value="${company.address}" required>
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-bold small text-uppercase">Giới thiệu về doanh nghiệp</label>
                                <textarea name="description" class="form-control" rows="6" placeholder="Nhập mô tả về văn hóa, lịch sử và tầm nhìn của công ty...">${company.description}</textarea>
                            </div>

                            <div class="col-12 text-end mt-4">
                                <a href="/company/dashboard" class="btn btn-light px-4 me-2 rounded-3">Hủy bỏ</a>
                                <button type="submit" class="btn btn-primary px-5 rounded-3 fw-bold">Lưu thay đổi</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function previewImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('logoPreview');
            if (preview) {
                preview.src = e.target.result;
            } else {
                // If there was no image before, create it
                const container = input.closest('.position-relative').querySelector('.bg-light');
                container.innerHTML = '<img id="logoPreview" src="' + e.target.result + '" class="img-fluid rounded-circle" style="object-fit: cover; width: 100%; height: 100%;">';
            }
        }
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
