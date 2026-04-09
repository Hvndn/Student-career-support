# Phân tích Thiết kế Cơ sở Dữ liệu (Database Design Analysis) - Job Portal

Tài liệu này cung cấp cái nhìn tổng quan và chi tiết về cấu trúc cơ sở dữ liệu cho hệ thống Student Career Support / Job Portal. Hệ thống được thiết kế bằng MySQL (`InnoDB`) hỗ trợ quan hệ ràng buộc khóa ngoại đầy đủ.

## 1. Tổng quan Kiến trúc Dữ liệu
Cơ sở dữ liệu bao gồm **23 bảng**, được chia thành 4 nhóm chính:
- **Người dùng & Phân quyền (User Management):** Quản lý tài khoản chung cho Sinh viên, Công ty và Admin.
- **Hồ sơ Sinh viên (Student Profile):** Lưu trữ thông tin chi tiết về CV của sinh viên (học vấn, kinh nghiệm, kỹ năng, chứng chỉ...).
- **Tuyển dụng & Doanh nghiệp (Company & Jobs):** Quản lý thông tin công ty và bài đăng tuyển dụng.
- **Tương tác & Hệ thống (Interaction & System):** Quản lý việc nộp đơn, lưu công việc/ứng viên, nhắn tin và thông báo.

---

## 2. Chi tiết các Nhóm Dữ liệu (ERD Breakdown)

### A. Nhóm Người dùng (User Management)
Tâm điểm của hệ thống là bảng `users`. Mọi đối tượng tham gia hệ thống đều phải có tài khoản tại đây.
- **`users`**: Bảng gốc chứa tài khoản đăng nhập.
  - Các trường chính: `email` (Unique), `password_hash`, `full_name`, `role` (ENUM: `student`, `company`, `admin`), `is_active`.
- **`messages`**: Quản lý tin nhắn giữa các người dùng (`sender_id`, `receiver_id` đều liên kết với bảng `users`).
- **`notifications`**: Hệ thống thông báo trong app cho người dùng hiện tại (`user_id`).
- **`password_reset_tokens`**: Quản lý token phục hồi mật khẩu (có `expiry_date`).

### B. Nhóm Hồ sơ Sinh viên (Student Profile / CV Database)
Khi người dùng đăng ký quyền `student`, một bản ghi tương ứng được tạo trong `students`. Các thông tin vệ tinh phục vụ cho chức năng CV Builder / Profile bao gồm:
- **`students`**: Lưu trữ thông tin cơ bản: mã sinh viên (`student_code` - Unique), trường, chuyên ngành, GPA, học tín chỉ, avatar mạng xã hội (github/linkedin).
- **`educations`**: Quá trình học tập (Trường, chuyên ngành, bằng cấp, điểm số).
- **`experiences`**: Kinh nghiệm làm việc thực tế.
- **`projects` & `project_images`**: Các dự án sinh viên đã thực hiện (Kèm link Github, demo) và nhiều ảnh demo cho từng dự án.
- **`skills` & `student_skills`**: Từ điển kỹ năng (`skills`) và đánh giá mức độ của sinh viên (`student_skills`: ENUM level `beginner`, `intermediate`, `advanced`).
- **`certificates` / `certifications`**: Chứng chỉ đạt được (Có sự trùng lặp cần lưu ý, có 2 định nghĩa bảng gần giống nhau: `certificates` và `certifications`).
- **`activities`**: Hoạt động ngoại khóa, câu lạc bộ.
- **`languages`**: Ngôn ngữ và mức độ thành thạo.
- **`interests`**: Sở thích cá nhân.

### C. Nhóm Công ty & Việc làm (Company & Jobs)
Khi người dùng đăng ký quyền `company`, một hồ sơ nhà tuyển dụng được tạo tĩnh kết nối với `users`.
- **`companies`**: Thông tin chi tiết doanh nghiệp: tên, website, email LH, mô tả, logo, quy mô(`company_size`), năm thành lập, ngành nghề.
- **`jobs`**: Bài đăng tuyển dụng.
  - Các trường quan trọng: `job_type` (intern, parttime, fulltime), `status` (open, closed, archived), dải lương (`min_salary`, `max_salary`).
- **`job_skills`**: Kỹ năng yêu cầu cho từng công việc, liên kết với bảng từ điển `skills`.

### D. Luồng Tương tác & Ứng tuyển (Interaction Flow)
Các bảng ghi nhận hoạt động tương tác giữa Sinh viên và Công ty:
- **`applications`**: Tiến trình nộp đơn ứng tuyển của Sinh viên vào tin tuyển dụng.
  - Liên kết: `student_id` -> `job_id`.
  - Trạng thái `status` (ENUM): `pending`, `review`, `interview`, `accepted`, `rejected`.
- **`interviews`**: Lịch hẹn phỏng vấn, liên kết 1-nhiều với `applications` (Ngày giờ, địa điểm, kết quả).
- **`saved_jobs`**: Danh sách việc làm sinh viên đã đánh dấu lưu lại (Wishlist). Liên kết `job_id` và `student_id`.
- **`saved_candidates`**: Danh sách ứng viên (sinh viên) mà công ty đã ưu tiên/quan tâm. Liên kết `company_id` và `student_id`.

---

## 3. Phân tích Kiến trúc & Đề xuất (Architecture Review)

### Điểm mạnh (Strengths)
1. **Chuẩn hóa dữ liệu rất tốt (High Normalization):** Các mảng thông tin của sinh viên (học viện, kinh nghiệm, kỹ năng...) được tách ra thành các thực thể riêng biệt quan hệ 1-N theo `student_id`. Điều này hỗ trợ tối ưu hóa tính năng CV Builder và cá nhân hóa.
2. **Sử dụng DDL ràng buộc chặt chẽ:** Tận dụng tối đa kiểu dữ liệu khóa `ENUM` định sẵn trạng thái (`role`, `status`, `job_type`, `level`) giúp tránh sai sót và dính rác từ UI nhập liệu.
3. **Thiết kế hỗ trợ AI Matching Ranking:** Bảng `skills` hoạt động như một từ điển chung quy hợp lý cho cả Nhà Tuyển Dụng (`job_skills`) và Người Ứng Tuyển (`student_skills`). Nhờ đó, việc đánh giá % phù hợp giữa sinh viên và job cực kì nhẹ ở tầng Data.

### Điểm cần cải thiện (Areas for Improvement)
1. **Sự trùng lặp bảng Certificates:**
   - Hệ thống hiện lưu đồng thời 2 bảng: `certificates` và `certifications`. Thông tin thuộc tính của chúng gần như y hệt. Bạn nên hợp nhất lại thống nhất sử dụng 1 bảng duy nhất, hoặc định hướng lại rõ sự khác biệt của chúng để tránh code thừa ở tầng entity Backend.
2. **Thiếu cơ chế Soft Delete (Xóa mềm):**
   - Ngoại trừ `users` có cờ `is_active`, các bảng `jobs`, `applications` hiện đang dựa vào hàm xóa vật lý. Để đảm bảo tracking lịch sử và toàn vẹn trong phân tích thống kê lâu dài, nên cân nhắc thêm trường `is_deleted` (BOOLEAN).
3. **Đồng bộ hóa nhãn Timezones:**
   - Các bảng dùng cơ chế ghi nhận thời gian theo nhiều type khác nhau (`timestamp`, `datetime`, `datetime(6)`). Tốt nhất thống nhất lưu datetime kèm múi giờ hoặc `timestamp` toàn hệ thống. Mặc dù nó không gây lỗi code trực tiếp, tuy nhiên sẽ dễ gặp xung đột nếu triển khai DB đa vùng trong tương lai.
