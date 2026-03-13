<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <style>
      body { background: #f5f7fb; font-family: system-ui; }
      .dashboard { display: flex; min-height: 100vh; }
      .sidebar { width: 250px; background: white; border-right: 1px solid #eee; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
      .logo { display: flex; align-items: center; gap: 10px; font-weight: 700; }
      .menu a { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; color: #374151; text-decoration: none; margin-bottom: 5px; }
      .menu a:hover { background: #f1f5ff; }
      .menu .active { background: #eef2ff; color: #2563eb; }
      .main { flex: 1; padding: 25px; }
      .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .search { background: white; border-radius: 8px; padding: 8px 12px; border: 1px solid #eee; width: 350px; }
      .stat-card { background: white; border-radius: 10px; padding: 18px; border: 1px solid #eee; }
      .stat-number { font-size: 22px; font-weight: 700; }
      .project-card { background: white; border-radius: 10px; padding: 15px; border: 1px solid #eee; }
      .project-img { height: 120px; background: #eee; border-radius: 8px; margin-bottom: 10px; }
      .table-card { background: white; border-radius: 10px; padding: 15px; border: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="dashboard">
      <div class="sidebar">
        <div>
          <div class="logo mb-4">
            <div class="bg-primary text-white p-2 rounded">🎓</div>
            <div>
              <strong>UniCareer</strong><br />
              <small class="text-muted">Cổng thông tin sinh viên</small>
            </div>
          </div>
          <div class="menu">
            <a class="active"> 🏠 Tổng quan </a>
            <a> 💼 Tìm việc làm </a>
            <a> 📄 CV của tôi </a>
            <a> 👤 Hồ sơ </a>
            <a> 📨 Đơn ứng tuyển </a>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <img src="https://i.pravatar.cc/40" class="rounded-circle" />
          <div>
            <strong><c:out value="${user}"/></strong><br />
            <small class="text-muted">Sinh viên năm 4</small>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="topbar">
          <input class="search form-control" placeholder="Tìm kiếm công việc, kỹ năng..." />
          <button class="btn btn-primary">+ Tạo CV mới</button>
        </div>
        <h4 class="fw-bold">Chào buổi sáng, <span><c:out value="${user}"/></span>!</h4>
        <p class="text-muted mb-4">Cùng xem tiến độ và cơ hội nghề nghiệp hôm nay của bạn.</p>
        
        <div class="row g-3 mb-4">
          <div class="col-md-3"><div class="stat-card"><small class="text-muted">Hoàn thiện hồ sơ</small><div class="stat-number">85%</div><small class="text-success">+5% tuần này</small></div></div>
          <div class="col-md-3"><div class="stat-card"><small class="text-muted">Kỹ năng</small><div class="stat-number">12</div><small class="text-success">+2 mới</small></div></div>
          <div class="col-md-3"><div class="stat-card"><small class="text-muted">Dự án cá nhân</small><div class="stat-number">04</div><small class="text-success">+1 mới</small></div></div>
          <div class="col-md-3"><div class="stat-card"><small class="text-muted">Đã ứng tuyển</small><div class="stat-number">08</div><small class="text-primary">2 đang chờ</small></div></div>
        </div>
        
        <!-- Các phần khác tương tự... -->
      </div>
    </div>
  </body>
</html>
