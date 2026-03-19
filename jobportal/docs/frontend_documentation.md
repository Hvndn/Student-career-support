# Tài liệu Frontend - JobPortal

Tài liệu này chi tiết nhiệm vụ của các file frontend trong ứng dụng JobPortal, được phân loại theo đối tượng sử dụng.

## Mô hình Kiến trúc

Ứng dụng sử dụng phương pháp dựa trên template với JSP:

1.  **Master Template (`layout/master.jsp`)**: Khung xương chính của HTML. Định nghĩa `<head>`, CSS toàn cầu (Inter font, Bootstrap 5, Font Awesome, `main.css`) và các phần chung như header và footer.
2.  **Page Loader (`[module]/[page].jsp`)**: Một lớp bao bọc mỏng để nhúng `master.jsp` và truyền các tham số:
    *   `pageTitle`: Tiêu đề tùy chỉnh cho tab trình duyệt.
    *   `content`: Đường dẫn đến file `_content.jsp` tương ứng.
    *   `isFullWidth`: Boolean để xác định nội dung có được bao bọc trong container hay không.
3.  **Content View (`[module]/[page]_content.jsp`)**: Chứa nội dung HTML thực tế của trang.

---

## 1. Thành phần chung & Layout

Nằm trong `WEB-INF/views/layout/` và thư mục `views/` gốc.

| Tên File | Vai trò | Đối tượng sử dụng |
| :--- | :--- | :--- |
| `layout/master.jsp` | Khung layout tổng thể. Quản lý styles, scripts toàn cục. | Tất cả |
| `layout/header.jsp` | Thanh điều hướng động. Thay đổi link dựa trên việc đăng nhập và vai trò. | Tất cả |
| `sidebar_students.jsp` | Menu điều hướng dọc cho các trang của sinh viên. | Sinh viên |
| `sidebar_employer.jsp` | Menu điều hướng dọc cho các trang của nhà tuyển dụng. | Nhà tuyển dụng |

---

## 2. Module Xác thực (`auth/`)

Quản lý tất cả các quy trình đăng nhập, đăng ký và bảo mật.

| Tên File | Mô tả | Đối tượng sử dụng |
| :--- | :--- | :--- |
| `login_students_content.jsp` | Form đăng nhập phong cách glassmorphism cho sinh viên. | Sinh viên |
| `register_student_content.jsp` | Form đăng ký chi tiết cho sinh viên mới. | Sinh viên |
| `login_employer_content.jsp` | Form đăng nhập đơn giản cho nhà tuyển dụng. | Nhà tuyển dụng |
| `register_employer_content.jsp` | Form đăng ký cho các tổ chức/doanh nghiệp. | Nhà tuyển dụng |
| `forgot_password_content.jsp` | Form yêu cầu đặt lại mật khẩu qua email. | Tất cả |
| `reset_password_content.jsp` | Form thiết lập mật khẩu mới sau khi xác thực token. | Tất cả |

---

## 3. Module Sinh viên (`student/`)

Giao diện chính để sinh viên quản lý hồ sơ và tìm kiếm cơ hội.

| Tên File | Mô tả | Đối tượng sử dụng |
| :--- | :--- | :--- |
| `dashboard_content.jsp` | Tổng quan tiến trình hồ sơ, thống kê kỹ năng, dự án và việc làm gợi ý. | Sinh viên |
| `profile_content.jsp` | Xem và chỉnh sửa hồ sơ (CV). Bao gồm các modal cho Học vấn, Kinh nghiệm, Kỹ năng. | Sinh viên |
| `projects.jsp` | Danh sách và quản lý các dự án cá nhân của sinh viên. | Sinh viên |
| `skills.jsp` | Giao diện quản lý các kỹ năng chuyên môn và kỹ năng mềm. | Sinh viên |

---

## 4. Module Nhà tuyển dụng (`company/`)

Các công cụ dành cho nhà tuyển dụng để tìm kiếm và quản lý nhân tài.

| Tên File | Mô tả | Đối tượng sử dụng |
| :--- | :--- | :--- |
| `dashboard_content.jsp` | Thống kê tuyển dụng, số lượng ứng tuyển và các hoạt động gần đây. | Nhà tuyển dụng |
| `candidates_content.jsp` | Quản lý danh sách ứng viên, theo dõi trạng thái và chấm điểm độ phù hợp. | Nhà tuyển dụng |
| `post-job_content.jsp` | Form tạo và đăng tin tuyển dụng mới. | Nhà tuyển dụng |

---

## 5. Module Quản trị (`admin/`)

Quản lý và giám sát cấp hệ thống.

| Tên File | Mô tả | Đối tượng sử dụng |
| :--- | :--- | :--- |
| `dashboard_content.jsp` | Dashboard quản trị hiển thị tổng thống kê hệ thống, phê duyệt doanh nghiệp và quản lý dữ liệu kỹ năng. | Quản trị viên |

---

## 6. Tài sản tĩnh (`src/main/resources/static/`)

Các file CSS được phân loại để tạo giao diện hiện đại.

| Tên File | Vai trò | Đối tượng sử dụng |
| :--- | :--- | :--- |
| `css/main.css` | Styles toàn cục, biến và các class tiện ích (nút, thẻ). | Tất cả |
| `css/dashboard.css` | Styles chuyên biệt cho các bố cục dashboard nhiều dữ liệu. | Sinh viên, NTD, Admin |
| `css/profile.css` | Định dạng cho trang hồ sơ cá nhân tương tác. | Sinh viên |
| `css/sidebar.css` | Định nghĩa bố cục và hiệu ứng cho thanh điều hướng bên cạnh. | Sinh viên, NTD |
| `css/candidates.css` | Styles cho bảng và thẻ thông tin ứng viên. | Nhà tuyển dụng |
| `css/jobs.css` | Định dạng cho danh sách tin tuyển dụng. | Sinh viên, NTD |
