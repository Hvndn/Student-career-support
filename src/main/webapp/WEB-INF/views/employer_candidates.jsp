<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Danh sách ứng viên</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
    />

    <link rel="stylesheet" href="/css/dashboard_employer.css" />
    <link rel="stylesheet" href="/css/sidebar.css" />
    <link rel="stylesheet" href="/css/candidates.css" />
  </head>

  <body>
    <div class="dashboard">
      <% request.setAttribute("activePage","candidates"); %>

      <jsp:include page="sidebar_employer.jsp" />

     <div class="main">
  <div class="content-wrapper">

    <!-- HEADER -->
    <div class="page-header">

      <h4>Danh sách Ứng viên</h4>

      <div class="header-actions">

        <div class="search-box">
          <i class="fa-solid fa-search"></i>
          <input type="text" placeholder="Tìm kiếm theo tên, vị trí hoặc kỹ năng..." />
        </div>

        <button class="btn-add">
          <i class="fa-solid fa-user-plus"></i>
          Thêm ứng viên
        </button>

      </div>
    </div>


    <!-- FILTER BAR -->
    <div class="filter-bar">

      <div class="tabs">

        <button class="active">Tất cả</button>
        <button>Chờ duyệt</button>
        <button>Hẹn phỏng vấn</button>
        <button>Đã tuyển</button>
        <button>Từ chối</button>

      </div>

<div class="filters">

<select class="filter-select">
<option>Tất cả tin tuyển dụng</option>
</select>

<select class="filter-select">
<option>Thời gian: 30 ngày qua</option>
</select>

</div>

    </div>


    <!-- TABLE -->
    <div class="table-card">

      <table>

        <thead>

          <tr>
            <th>Họ và tên</th>
            <th>Tin tuyển dụng</th>
            <th>Ngày nộp</th>
            <th>Điểm phù hợp</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>

        </thead>

        <tbody>

          <tr>

            <td class="user">

              <img src="https://i.pravatar.cc/40?img=1">

              <div>
                <b>Nguyễn Văn An</b>
                <p>UI/UX Designer</p>
              </div>

            </td>

            <td>Thiết kế sản phẩm</td>

            <td>12/10/2023</td>

            <td>

              <div class="progress-bar">
                <div class="progress green" style="width:95%"></div>
              </div>

              95%

            </td>

            <td>
              <span class="status pending">Chờ duyệt</span>
            </td>

            <td class="actions">

              <i class="fa-solid fa-eye"></i>
              <i class="fa-solid fa-download"></i>
              <i class="fa-solid fa-ellipsis"></i>

            </td>

          </tr>

        </tbody>

      </table>

    </div>
<div class="table-footer">

<div class="table-info">
Đang hiển thị <b>1</b> trong số <b>124</b> ứng viên
</div>


    <!-- PAGINATION -->

    <div class="pagination">

      <button><</button>
      <button class="active">1</button>
      <button>2</button>
      <button>3</button>
      <button>></button>

    </div>

  </div>
</div>
  </body>
</html>
