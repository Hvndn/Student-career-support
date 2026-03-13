<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>



<style>
  /* SIDEBAR */
body{
  font-family:"Inter",sans-serif;
  font-size:14px;
}
.sidebar{
width:240px;
background:white;
border-right:1px solid #eee;
padding:25px;

position:fixed;
top:0;
left:0;
height:100vh;

display:flex;
flex-direction:column;
justify-content:space-between;
}
.main{
margin-left:240px;
padding:30px;
flex:1;
}
/* LOGO */

.logo{
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:30px;
}

.logo strong{
  font-size:16px;
  font-weight:700;
  color:#2563eb;
}

.logo small{
  font-size:12px;
  color:#6b7280;
}

.logo .bg-primary{
  width:36px;
  height:36px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:8px;
}

/* MENU */

.menu a{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:10px;
  color:#374151;
  text-decoration:none;
  margin-bottom:5px;
  transition:0.2s;
}

.menu a:hover{
  background:#eef2ff;
}

.menu .active{
  background:#eef2ff;
  color:#2563eb;
  font-weight:600;
}
</style>

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