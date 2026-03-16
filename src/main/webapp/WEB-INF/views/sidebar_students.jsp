<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>





<div class="sidebar">

<div>

<div class="logo mb-4 d-flex align-items-center gap-2">
<div class="bg-primary text-white p-2 rounded">🎓</div>

<div>
<strong class="text-primary">CareerHub</strong><br><small class="text-muted">Cổng thông tin sinh viên</small>
</div>
</div>

<div class="menu">

<a href="/student/dashboard"
class="${activePage == 'dashboard' ? 'active' : ''}">
<i class="fa-solid fa-table-columns"></i>
Bảng điều khiển
</a>

<a href="/student/profile"
class="${activePage == 'profile' ? 'active' : ''}">
<i class="fa-solid fa-user"></i>
Hồ sơ cá nhân
</a>

<a href="/student/jobs"
class="${activePage == 'jobs' ? 'active' : ''}">
<i class="fa-solid fa-briefcase"></i>
Việc làm
</a>

<a href="/student/projects"
class="${activePage == 'projects' ? 'active' : ''}">
<i class="fa-solid fa-folder"></i>
Dự án
</a>

<a href="/student/skills"
class="${activePage == 'skills' ? 'active' : ''}">
<i class="fa-solid fa-graduation-cap"></i>
Kỹ năng & khóa học
</a>

</div>
</div>

<div class="d-flex align-items-center gap-2">
<img src="https://i.pravatar.cc/40" class="rounded-circle">

<div>
<strong>${user}</strong>
<br>
<small class="text-muted">Sinh viên năm 4</small>
</div>
</div>

</div>