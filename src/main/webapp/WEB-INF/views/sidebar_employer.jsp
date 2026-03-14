
<%@ page contentType="text/html;charset=UTF-8" %>

<div class="sidebar">

<div>

<h5 class="mb-4">
<i class="fa-solid fa-rocket"></i>
Recruiter Pro
</h5>

<a href="/employer/dashboard"
class="<%= "dashboard".equals(request.getAttribute("activePage")) ? "active" : "" %>">

<i class="fa-solid fa-chart-line"></i>
Bảng điều khiển

</a>

<a href="/employer/jobs"
class="<%= "jobs".equals(request.getAttribute("activePage")) ? "active" : "" %>">
<i class="fa-solid fa-briefcase"></i>
Tin tuyển dụng

</a>

<a href="/employer/candidates"
class="<%= "candidates".equals(request.getAttribute("activePage")) ? "active" : "" %>">

<i class="fa-solid fa-users"></i>
Ứng viên

</a>

<a href="/employer/interviews"
class="<%= "interviews".equals(request.getAttribute("activePage")) ? "active" : "" %>">

<i class="fa-solid fa-calendar-days"></i>
Lịch phỏng vấn

</a>

<a href="/employer/reports"
class="<%= "reports".equals(request.getAttribute("activePage")) ? "active" : "" %>">

<i class="fa-solid fa-chart-pie"></i>
Báo cáo & Phân tích

</a>

</div>

<div>

<button class="btn btn-primary w-100 mb-3">
<i class="fa-solid fa-plus"></i>
Đăng tin mới
</button>

<div class="d-flex align-items-center">

<img src="https://i.pravatar.cc/40"
class="rounded-circle me-2">

<div>

<div style="font-weight:600">
Hồ Văn Diện
</div>

<small class="text-muted">
HR Manager
</small>

</div>

</div>

</div>

</div>