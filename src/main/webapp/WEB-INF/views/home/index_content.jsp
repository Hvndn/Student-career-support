<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<style>
    .hero-mesh {
        background-color: #ffffff;
        background-image: 
            radial-gradient(at 0% 0%, hsla(221, 83%, 53%, 0.1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(221, 83%, 53%, 0.05) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(221, 83%, 53%, 0.1) 0, transparent 50%);
        min-height: 80vh;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
    }
    
    .hero-shape {
        position: absolute;
        z-index: 0;
        filter: blur(60px);
        border-radius: 50%;
        opacity: 0.5;
    }

    .glass-feature {
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 2rem;
        transition: all 0.3s ease;
    }

    .glass-feature:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    }
</style>

<div class="hero-mesh">
    <div class="container position-relative">
        <div class="row align-items-center min-vh-75">
            <div class="col-lg-7 text-center text-lg-start mb-5 mb-lg-0">
                <div class="badge-premium d-inline-block mb-4">
                    <i class="fa-solid fa-sparkles me-1 text-warning"></i>
                    Thế hệ tuyển dụng 5.0
                </div>
                <h1 class="display-2 fw-extrabold mb-4 leading-tight">
                    Tìm kiếm <span class="text-gradient">Tài năng</span><br>
                    Định hình <span class="text-gradient">Tương lai</span>
                </h1>
                <p class="lead text-slate-600 mb-5 pe-lg-5 fs-4">
                    Nền tảng kết nối sinh viên và doanh nghiệp hàng đầu, hỗ trợ bởi trí tuệ nhân tạo để tìm ra bến đỗ sự nghiệp hoàn hảo nhất.
                </p>
                <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                    <a href="/students/register" class="btn btn-primary btn-lg p-4 px-5 shadow-xl">
                        <span>Bắt đầu hành trình</span>
                        <i class="fa-solid fa-chevron-right fs-small"></i>
                    </a>
                    <a href="/jobs" class="btn btn-light btn-lg p-4 px-5">
                        <i class="fa-solid fa-briefcase"></i>
                        Xem việc làm
                    </a>
                </div>
                
                <div class="mt-5 pt-4">
                    <div class="d-flex align-items-center gap-4 opacity-75">
                        <div class="d-flex -space-x-2">
                            <div class="bg-primary rounded-circle border border-2 border-white text-white d-flex align-items-center justify-content-center shadow-sm" style="width: 45px; height: 45px; margin-right: -15px;">A</div>
                            <div class="bg-success rounded-circle border border-2 border-white text-white d-flex align-items-center justify-content-center shadow-sm" style="width: 45px; height: 45px; margin-right: -15px;">B</div>
                            <div class="bg-warning rounded-circle border border-2 border-white text-white d-flex align-items-center justify-content-center shadow-sm" style="width: 45px; height: 45px;">C</div>
                        </div>
                        <p class="mb-0 small fw-bold text-slate-500">+10.000 sinh viên đã tin dùng</p>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-5 text-center">
                <div class="position-relative">
                    <!-- Floating Elements -->
                    <div class="glass-card p-4 position-absolute animate-float" style="top: -20px; right: -20px; z-index: 10; width: 180px;">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <div class="bg-success rounded-circle" style="width: 10px; height: 10px;"></div>
                            <span class="small fw-bold">Live Matches</span>
                        </div>
                        <h5 class="mb-0 fw-bold">+241</h5>
                    </div>
                    
                    <div class="glass-card p-5 shadow-2xl overflow-hidden border-0" style="border-radius: 3rem;">
                        <div class="bg-primary-light rounded-circle p-4 d-inline-block mb-4">
                            <i class="fa-solid fa-robot fs-1 text-primary"></i>
                        </div>
                        <h3 class="fw-bold mb-3">AI Discovery</h3>
                        <p class="text-slate-500 mb-4">Hệ thống AI đang phân tích hồ sơ của bạn để đưa ra những gợi ý tốt nhất.</p>
                        <div class="progress rounded-pill bg-slate-100" style="height: 12px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 85%"></div>
                        </div>
                        <div class="d-flex justify-content-between mt-2 small fw-bold">
                            <span>Matching...</span>
                            <span>85%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container py-5 my-5">
    <div class="row g-4 justify-content-center mt-n5">
        <div class="col-md-3">
            <div class="glass-card p-4 text-center border-0">
                <h2 class="fw-extrabold text-primary mb-1">500+</h2>
                <p class="text-slate-500 small mb-0 fw-bold">Doanh nghiệp</p>
            </div>
        </div>
        <div class="col-md-3">
            <div class="glass-card p-4 text-center border-0">
                <h2 class="fw-extrabold text-primary mb-1">2000+</h2>
                <p class="text-slate-500 small mb-0 fw-bold">Tin tuyển dụng</p>
            </div>
        </div>
        <div class="col-md-3">
            <div class="glass-card p-4 text-center border-0">
                <h2 class="fw-extrabold text-primary mb-1">50k+</h2>
                <p class="text-slate-500 small mb-0 fw-bold">Lượt ứng tuyển</p>
            </div>
        </div>
    </div>

    <div class="text-center my-5 py-5">
        <span class="badge-premium mb-3">Tính năng nổi bật</span>
        <h2 class="display-4 fw-extrabold">Tại sao chọn UniTalent?</h2>
    </div>

    <div class="row g-4">
        <div class="col-md-4">
            <div class="glass-card p-5 h-100 text-center border-0">
                <div class="bg-slate-100 rounded-4 p-4 d-inline-block mb-4 text-primary">
                    <i class="fa-solid fa-address-card fs-1"></i>
                </div>
                <h4 class="fw-bold mb-3">Profile Thông minh</h4>
                <p class="text-slate-500">Tự động tối ưu hóa CV dựa trên từ khóa và yêu cầu của thị trường lao động.</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="glass-card p-5 h-100 text-center border-0">
                <div class="bg-slate-100 rounded-4 p-4 d-inline-block mb-4 text-success">
                    <i class="fa-solid fa-handshake-angle fs-1"></i>
                </div>
                <h4 class="fw-bold mb-3">Kết nối trực tiếp</h4>
                <p class="text-slate-500">Chat trực tiếp với bộ phận HR của các tập đoàn hàng đầu ngay trên nền tảng.</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="glass-card p-5 h-100 text-center border-0">
                <div class="bg-slate-100 rounded-4 p-4 d-inline-block mb-4 text-warning">
                    <i class="fa-solid fa-bolt fs-1"></i>
                </div>
                <h4 class="fw-bold mb-3">Ứng tuyển cực nhanh</h4>
                <p class="text-slate-500">Hệ thống ứng tuyển 1-click giúp bạn không bỏ lỡ bất kỳ cơ hội hấp dẫn nào.</p>
            </div>
        </div>
    </div>
</div>
