<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h3 class="fw-bold text-dark">Quản lý Ứng viên</h3>
            <p class="text-muted mb-0">Theo dõi và đánh giá các hồ sơ ứng tuyển mới nhất.</p>
        </div>
        <div class="d-flex gap-2">
            <div class="input-group" style="width: 300px;">
                <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-search text-muted"></i></span>
                <input type="text" class="form-control border-start-0 ps-0" placeholder="Tìm ứng viên...">
            </div>
            <button class="btn btn-primary px-4 shadow-sm fw-bold">
                <i class="fa-solid fa-download me-2"></i> Xuất dữ liệu
            </button>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="glass-panel p-2 mb-4 d-flex gap-2">
        <button class="btn btn-light bg-white shadow-sm px-4 fw-bold text-primary">Tất cả</button>
        <button class="btn btn-link text-dark text-decoration-none px-4 opacity-75">Chờ duyệt</button>
        <button class="btn btn-link text-dark text-decoration-none px-4 opacity-75">Đã hẹn lịch</button>
        <button class="btn btn-link text-dark text-decoration-none px-4 opacity-75">Đã tuyển</button>
        <button class="btn btn-link text-dark text-decoration-none px-4 opacity-75">Từ chối</button>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="bg-light">
                    <tr>
                        <th class="ps-4 py-3">Thông tin ứng viên</th>
                        <th>Vị trí ứng tuyển</th>
                        <th>Ngày nộp</th>
                        <th>Đánh giá hệ thống</th>
                        <th>Trạng thái</th>
                        <th class="pe-4">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <c:forEach var="i" begin="1" end="5">
                        <tr>
                            <td class="ps-4">
                                <div class="d-flex align-items-center gap-3">
                                    <img src="https://i.pravatar.cc/150?u=${i}" class="rounded-circle" style="width: 44px; height: 44px;">
                                    <div>
                                        <div class="fw-bold">Ứng viên ${i}</div>
                                        <div class="text-muted extra-small">ungvien${i}@gmail.com</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="fw-bold small">Java Backend Intern</div>
                                <div class="text-muted extra-small">ID: #JB-101</div>
                            </td>
                            <td class="small">12/10/2023</td>
                            <td>
                                <div class="d-flex align-items-center gap-2">
                                    <div class="progress flex-grow-1" style="height: 6px; width: 80px;">
                                        <div class="progress-bar bg-success" style="width: 85%"></div>
                                    </div>
                                    <span class="small fw-bold">85%</span>
                                </div>
                            </td>
                            <td>
                                <span class="badge badge-soft-primary px-3 py-2">Chờ duyệt</span>
                            </td>
                            <td class="pe-4">
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-icon border-0" data-bs-toggle="dropdown"><i class="fa-solid fa-ellipsis-vertical text-muted"></i></button>
                                    <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                        <li><a class="dropdown-item py-2" href="#"><i class="fa-solid fa-eye me-2 text-primary"></i> Xem hồ sơ</a></li>
                                        <li><a class="dropdown-item py-2" href="#"><i class="fa-solid fa-calendar-plus me-2 text-success"></i> Hẹn phỏng vấn</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item py-2 text-danger" href="#"><i class="fa-solid fa-user-xmark me-2"></i> Từ chối</a></li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </c:forEach>
                </tbody>
            </table>
        </div>
        <div class="card-footer bg-white py-3 border-0 d-flex justify-content-between align-items-center">
            <div class="small text-muted">Hiển thị 5 của 124 ứng viên</div>
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item disabled"><a class="page-item rounded-circle border-0 mx-1" href="#"><i class="fa-solid fa-chevron-left"></i></a></li>
                    <li class="page-item active"><a class="page-link rounded-circle border-0 mx-1" href="#">1</a></li>
                    <li class="page-item"><a class="page-link rounded-circle border-0 mx-1" href="#">2</a></li>
                    <li class="page-item"><a class="page-link rounded-circle border-0 mx-1" href="#">3</a></li>
                    <li class="page-item"><a class="page-link rounded-circle border-0 mx-1" href="#"><i class="fa-solid fa-chevron-right"></i></a></li>
                </ul>
            </nav>
        </div>
    </div>
</div>
