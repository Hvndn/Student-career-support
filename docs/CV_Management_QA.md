# TÀI LIỆU CÂU HỎI PHỎNG VẤN & BÁO CÁO KỸ THUẬT - QUẢN LÝ CV (STUDENT)

Tài liệu này tổng hợp 30 câu hỏi và trả lời chuyên sâu về mặt lập trình (Backend & Frontend) liên quan đến tính năng Quản lý CV và Hồ sơ sinh viên trong hệ thống.

---

### NHÓM 1: KIẾN TRÚC & LUỒNG DỮ LIỆU (ARCHITECTURE & FLOW)

**1. Luồng dữ liệu khi sinh viên cập nhật thông tin CV diễn ra như thế nào?**
*Dữ liệu được nhập từ form React (`Profile.jsx`), gửi qua Axios tới Controller (`StudentProfileRestController`). Tại đây, Service (`ProfileService`) sẽ xử lý logic và lưu vào database thông qua Repository (`StudentRepository`).*

**2. Tại sao bạn lại chọn lưu kỹ năng (Skills) dưới dạng JSON trong `cv_data` thay vì bảng quan hệ riêng?**
*Để tăng tính linh hoạt. Sinh viên có thể tự định nghĩa bất kỳ kỹ năng nào mà không bị giới hạn bởi danh mục cứng nhắc trong database, đồng thời giảm số lượng câu lệnh JOIN khi truy vấn hồ sơ.*

**3. `StudentProfileResponse` đóng vai trò gì trong hệ thống?**
*Đây là một DTO (Data Transfer Object) giúp đóng gói dữ liệu từ nhiều thực thể khác nhau (Student, User, Project, Education) thành một cấu trúc duy nhất để gửi về Frontend, giúp tối ưu hiệu năng và bảo mật.*

**4. Làm thế nào để đảm bảo sinh viên chỉ có thể sửa CV của chính mình?**
*Backend sử dụng Spring Security để lấy `studentId` từ `Authentication` object (JWT). Mọi thao tác cập nhật đều dựa trên ID này thay vì tin tưởng vào ID gửi từ phía Client.*

**5. Tại sao lại tách các API upload file (Avatar, Video, Resume) riêng biệt?**
*Vì các thao tác này xử lý dữ liệu nhị phân (`MultipartFile`). Việc tách riêng giúp code gọn hơn, dễ xử lý lỗi upload đặc thù và không làm nặng API cập nhật thông tin văn bản thông thường.*

---

### NHÓM 2: XỬ LÝ BACKEND (JAVA & SPRING BOOT)

**6. Bạn sử dụng thư viện nào để xuất file PDF từ hệ thống?**
*Dự án sử dụng thư viện **OpenPDF** (một nhánh của iText). Nó cho phép tạo tài liệu PDF động từ mã nguồn Java một cách mạnh mẽ.*

**7. Làm thế nào để hiển thị được tiếng Việt có dấu trong file PDF xuất ra?**
*Tôi phải nạp font hệ thống hỗ trợ Unicode (như `arial.ttf`) thông qua lớp `BaseFont` và thiết lập encoding là `IDENTITY_H`.*

**8. Cách hệ thống xử lý các thẻ HTML (như `<p>`, `<br>`) khi xuất từ Bio ra PDF?**
*Tôi sử dụng Regex trong `PdfExportService` để loại bỏ các thẻ HTML và thay thế thẻ `<br>` bằng ký tự xuống dòng `\n`, đảm bảo văn bản trong PDF là thuần túy.*

**9. Tại sao bạn sử dụng `@Transactional` trong các hàm xử lý tại `ProfileService`?**
*Để đảm bảo tính toàn vẹn dữ liệu (Atomicity). Nếu quá trình lưu gặp lỗi giữa chừng, toàn bộ các thay đổi sẽ được rollback, tránh tình trạng dữ liệu bị "rác" hoặc sai lệch.*

**10. Lớp `StudentProfileMapper` có tác dụng gì?**
*Nó thực hiện việc chuyển đổi từ `Entity` (đối tượng database) sang `DTO` (đối tượng gửi đi). Việc này giúp ẩn đi các thông tin nhạy cảm (như password) và định dạng lại dữ liệu cho Frontend.*

**11. Hệ thống lưu trữ các file (Avatar, CV PDF) được tải lên ở đâu?**
*Hiện tại hệ thống lưu trữ tại thư mục `uploads/` trong root project. Đường dẫn được cấu hình trong `WebConfig` để ánh xạ với URL `/uploads/**`.*

**12. Làm thế nào để tránh việc file upload bị trùng tên trên server?**
*Trong `StorageService`, tôi sử dụng `UUID.randomUUID()` để tạo tên file ngẫu nhiên và duy nhất trước khi lưu vào bộ nhớ.*

**13. Bạn kiểm soát định dạng file upload (PDF cho CV, Image cho Avatar) như thế nào?**
*Kiểm tra cả `MIME type` (thông qua `file.getContentType()`) và phần mở rộng file (`extension`) dựa trên danh sách trắng (`allowedExtensions`) tại Backend.*

**14. Ý nghĩa của trường `cv_data` (LONGTEXT) trong bảng `students` là gì?**
*Dùng để lưu trữ cấu trúc JSON của CV Builder trực tuyến (màu sắc, font chữ, bố cục template) mà sinh viên đã tùy chỉnh.*

**15. Tại sao bạn sử dụng `columnDefinition = "TEXT"` cho trường `bio`?**
*Vì mô tả bản thân có thể rất dài, vượt quá giới hạn 255 ký tự của kiểu `String/Varchar` mặc định, nên cần dùng kiểu `TEXT` của MySQL.*

---

### NHÓM 3: XỬ LÝ FRONTEND (REACT & CSS)

**16. Bạn xử lý việc upload file PDF trong React như thế nào?**
*Sử dụng thẻ `<input type="file" />` ẩn, dùng `FormData` để đóng gói file và gửi qua `Axios` với header `multipart/form-data`.*

**17. Làm thế nào để hiển thị bản xem trước cho CV PDF đã đính kèm?**
*Sử dụng thẻ `<a>` với thuộc tính `target="_blank"`. Trình duyệt sẽ tự động mở PDF bằng trình đọc PDF tích hợp.*

**18. Tại sao bạn sử dụng `material-symbols-outlined` cho các biểu tượng thay vì dùng ảnh?**
*Đây là icon font của Google, giúp tối ưu tốc độ tải trang, dễ dàng thay đổi màu sắc/kích thước bằng CSS và không bị vỡ nét trên màn hình độ phân giải cao.*

**19. Cách bạn xử lý trạng thái "Đang tải" (Loading) khi upload file?**
*Sử dụng state `isUploading`. Khi bắt đầu sẽ set là `true` để hiển thị spinner, sau khi hoàn tất (dù thành công hay lỗi) sẽ set về `false`.*

**20. Bạn sử dụng Hook nào để quản lý dữ liệu Profile?**
*Sử dụng `useState` để lưu trữ dữ liệu và `useEffect` để gọi API lấy dữ liệu ngay khi trang web được tải lên.*

**21. Làm thế nào để cập nhật giao diện ngay lập tức sau khi xóa một kỹ năng?**
*Sau khi API xóa trả về thành công, tôi gọi hàm `reload()` để lấy lại toàn bộ dữ liệu mới nhất từ server và cập nhật vào state.*

**22. CSS `backdrop-filter: blur(12px)` trong menu người dùng có tác dụng gì?**
*Tạo hiệu ứng kính mờ (Glassmorphism), giúp menu trông hiện đại và tách biệt rõ ràng với phần nội dung phía dưới.*

**23. Tại sao lại dùng `multipart/form-data` thay vì gửi file dưới dạng Base64?**
*Dùng Base64 sẽ làm kích thước file tăng thêm khoảng 33%, gây tốn băng thông và CPU của server để giải mã. `multipart/form-data` là chuẩn tối ưu cho truyền tải file.*

---

### NHÓM 4: CHI TIẾT DỰ ÁN & MỞ RỘNG

**24. Bạn đã mở rộng thực thể Project như thế nào để phục vụ nhiều ngành nghề?**
*Tôi đã thêm các trường: `role` (vai trò), `technologies` (công cụ/công nghệ), `responsibilities` (trách nhiệm chi tiết) để mô tả dự án đầy đủ hơn.*

**25. Cách xử lý ngày tháng (StartDate, EndDate) trong CV?**
*Dữ liệu được lưu dưới dạng `LocalDate` ở Backend và gửi về Frontend dưới dạng chuỗi `YYYY-MM-DD`, sau đó được hiển thị định dạng lại cho người dùng.*

**26. Làm sao để phân biệt giữa "CV Hệ thống" và "CV Đính kèm"?**
*Trong database, `cv_data` lưu thông tin bản trực tuyến, còn `resume_url` lưu đường dẫn file PDF đính kèm. Giao diện sẽ hiển thị cả hai mục để sinh viên lựa chọn.*

**27. Hệ thống bảo mật thông tin liên lạc (Email, Phone) trong CV như thế nào?**
*Thông tin này được lấy từ bảng `users` liên kết với `students`, đảm bảo tính thống nhất và chỉ hiển thị khi có sự cho phép hoặc khi xuất PDF.*

**28. Ý nghĩa của các annotation Lombok như `@Data`, `@Builder` trong code?**
*`@Data` tự động tạo Getter/Setter; `@Builder` giúp khởi tạo đối tượng nhanh chóng và rõ ràng hơn (Fluent API).*

**29. Làm thế nào để mapping Project từ Entity sang DTO một cách thủ công?**
*Tôi duyệt qua danh sách `projects` của `Student`, khởi tạo từng `ProjectDto` và gán các giá trị tương ứng từ `Entity` sang.*

**30. Hướng phát triển tiếp theo cho phần quản lý CV này là gì?**
*Tích hợp AI để gợi ý từ khóa kỹ năng, thêm nhiều mẫu (template) PDF đa dạng hơn và hỗ trợ đa ngôn ngữ (Việt - Anh).*
