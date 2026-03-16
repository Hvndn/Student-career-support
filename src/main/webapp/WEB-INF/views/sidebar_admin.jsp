<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="sidebar">

<div>

<div class="logo mb-4 d-flex align-items-center gap-2">
<div class="bg-danger text-white p-2 rounded">🛡️</div>

<div>
<strong class="text-danger">UniTalent</strong><br><small class="text-muted">Quản trị hệ thống</small>
</div>
</div>

<div class="menu">

<a href="/admin/dashboard"
class="${activePage == 'dashboard' ? 'active' : ''}">
<i class="fa-solid fa-gauge-high"></i>
Tổng quan
</a>

<a href="/admin/dashboard#users"
class="${activePage == 'users' ? 'active' : ''}">
<i class="fa-solid fa-users"></i>
Người dùng
</a>

<a href="/admin/dashboard#companies"
class="${activePage == 'companies' ? 'active' : ''}">
<i class="fa-solid fa-building"></i>
Doanh nghiệp
</a>

<a href="/admin/dashboard#skills"
class="${activePage == 'skills' ? 'active' : ''}">
<i class="fa-solid fa-list-check"></i>
Danh mục Kỹ năng
</a>

</div>
</div>

<div class="d-flex align-items-center gap-2">
<img src="https://i.pravatar.cc/40" class="rounded-circle">

<div>
<strong>Admin</strong>
<br>
<small class="text-muted">Quản trị viên</small>
</div>
</div>

</div>
