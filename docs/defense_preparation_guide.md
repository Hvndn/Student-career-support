# Kế Hoạch Chuẩn Bị Bảo Vệ Đồ Án (Defense Preparation Guide) - Job Portal

Đây là tài liệu hướng dẫn chiến lược giúp bạn chuẩn bị kỹ lưỡng từ Slide, kịch bản Demo hệ thống, cho đến cách kiểm soát tâm lý trước Hội đồng phản biện.

---

## 1. Cấu Trúc Slide Thuyết Trình (Tối đa 15 - 20 Slides)
Hội đồng thường không thích chữ nhiều. Hãy sử dụng mô hình, biểu đồ và sơ đồ luồng (Flowchart). Thời gian nói thường bị giới hạn từ **10 đến 15 phút**.

- **Slide 1: Trang bìa** (Tên đề tài "Hệ thống Hỗ trợ Nghề nghiệp Sinh viên", Tên SV, Tên GVHD).
- **Slide 2: Đặt vấn đề** (Sinh viên ra trường thiếu kênh tiếp cận CV chuyên nghiệp, nhà trường khó kết nối cựu sinh viên với công ty).
- **Slide 3: Mục tiêu dự án** (Tạo hệ sinh thái kết nối 3 bên: Sinh viên - Công ty - Admin nhà trường).
- **Slide 4: Các Chức năng Cốt lõi** (Actor: Student, Company, Admin).
- **Slide 5: Công nghệ sử dụng (Tech Stack)** 
  - Đưa Logo lên cho lẹ: Java Spring Boot, ReactJS, MySQL, JWT, TailwindCSS/VanillaCSS. Đừng đọc dông dài lịch sử ngôn ngữ.
- **Slide 6: Kiến trúc hệ thống** 
  - Vẽ Mô hình Client-Server, luồng đi của JSON / RESTful API gạch nối giữa Frontend và Backend.
- **Slide 7: Sơ đồ Cơ sở Dữ liệu (ERD)**
  - Chụp một góc ERD đẹp nhất (Góc: `users` - `students` - `applications` - `jobs`). 
- **Slide 8 & 9: Điểm nổi bật về Kỹ thuật** 
  - (Ví dụ: Cơ chế CV template xịn xò, thuật toán gợi ý/lọc kỹ năng, hoặc Security JWT Token).
- **Slide 10: Khó khăn gặp phải & Cách giải quyết** 
  - *Đây là slide ăn điểm tuyệt đối!* (Ví dụ: Lỗi N+1 Query làm server chậm -> em xài Join Fetch; Layout Responsive bị vỡ -> em xài Flexbox chặn Media query).
- **Slide 11: Demo Live** (Chỉ ghi chữ "DEMO CHƯƠNG TRÌNH" thật to).
- **Slide 12: Hướng phát triển tương lai** (Thêm tích hợp thanh toán, AI đọc CV, chat 1-1).
- **Slide 13: Lời Cảm Ơn**.

---

## 2. Kịch Bản Live Demo (Bắt Buộc Phải Chạy Mượt - 5 phút)
Đừng demo theo kiểu "bấm bừa". Hãy có kịch bản (Story-telling) xuyên suốt.

- **Bước 1: Giới thiệu người thứ nhất (Bạn Sinh Viên A - Tân sinh viên).**
  - Mở Tab trình duyệt số 1 ẩn danh.
  - Login tài khoản Sinh Viên A.
  - Bấm vào trang "Hồ sơ cá nhân / Tạo CV" -> Thêm nhanh 1 kỹ năng (ReactJS), 1 kinh nghiệm (Làm dự án ABC). Lưu lại màn hình báo Toast Xanh lá cực xịn.
- **Bước 2: Tìm diệt (Job Search).**
  - Qua list danh sách công việc, gõ thanh search chữ "React".
  - Bấm vào 1 Job (Ví dụ: Thực tập sinh Frontend React). Bấm Nộp đơn (Apply). Hệ thống báo thành công.
- **Bước 3: Người thứ hai (Nhà tuyển dụng B).**
  - Mở Tab trình duyệt 2 (Browser khác hoặc Incognito) đóng vai Công ty.
  - Đăng nhập. Vào trang "Dashboard Quản lý Ứng Viên".
  - Mở danh sách ứng viên mới thấy tài khoản bạn Sinh viên A. Bấm duyệt (Change Status = Accepted/Interview). Nhớ giải thích cho thầy cô thấy Data thay đổi Real-time hoặc Sync ngay lập tức.
- **Bước 4 (Nếu có): Check thông báo.**
  - Mở lại tab Sinh Viên, bấm vào cái Chuông xem có chữ "Công ty B đã mời bạn phỏng vấn" không.

---

## 3. Quản Trị Rủi Ro Kỹ Thuật (Backup Plan) ⚠️ Cực kỳ Quan Trọng

1. **Chuẩn bị Dữ liệu mẫu (Seeding Data):** Đừng đem cái Web trống rỗng lên Demo ròi loay hoay ngồi tạo tài khoản tốn thời gian. Cài sẵn ít nhất 5 Jobs, 5 Sinh Viên có ảnh Avatar xịn xò, tên tiếng Việt đẹp, 2 Công Ty xịn (VD: FPT, VNG) để trông thật rực rỡ và uy tín.
2. **Quay Video màn hình:** Ở nhà đêm trước khi bảo vệ, hãy Record lại toàn bộ 5 phút kịch bản Demo ở trên một cách tĩnh lặng. Nếu lên lớp trình chiếu mà đứt cáp mạng, rớt WiFi, Tomcat sập... mở video lên chữa cháy: *"Dạ do mạng trường có thiết lập Firewall chặn port Node.js của em, em xin phép mở bản Demo em quay hôm qua thay thế ạ"*.
3. **Mở sẵn Project Code trên VSCode hoặc IntelliJ:** Thầy cô hay chỉ bảo: "Mở code ra tôi xem em xử lý hàm lưu mật khẩu ở đâu?". Bạn phải rành các cấu trúc thư mục của mình để trong 5 giây tab qua và chỉ vào file `SecurityConfig.java` hoặc `StudentController.java`.
4. **Vệ sinh Trình duyệt:** Tắt hết các tiện ích AdsBlocker, IDM... vì đôi khi nó sẽ chặn luồng tải File ảnh hoặc gọi React làm dính lỗi CORS ngớ ngẩn.

---

## 4. Nghệ Thuật Trả Lời Vấn Đáp (Q&A)

1. **Hiểu rõ Giới hạn (Boundary):**
   - Không vòng vo nếu KHÔNG ĐÁP ỨNG ĐƯỢC. Nếu thầy cô hỏi "Hệ thống em có chịu tải 1 vạn ng truy cập ko?" -> Cứ thẳng thắn: *"Dạ với giới hạn đồ án sinh viên làm local máy cá nhân thì em chưa có điều kiện stress test cấu hình lớn, nhưng về thiết kế Stateless JWT thì hoàn toàn có thể scale theo mảng Cloud sau này"*. Sự chân thành cộng điểm tuyệt đối.
2. **Quy tắc 3 Giây:**
   - Khi nhận câu hỏi, gật đầu, hít 1 hơi và nghĩ ngợi trong 3 giây. Đừng vừa nghe xong nhảy vào tranh cãi với Giáo viên phản biện ngay lập tức.
3. **Thừa nhận lỗi nhưng dẫn dắt giải pháp (Yes, And...):**
   - Thầy: "Chỗ tìm kiếm này em chỉ dùng LIKE trong MySQL là quá chậm".
   - Bạn: "Dạ thầy góp ý hoàn toàn chính xác. Trong thiết kế hiện tại em mới xử lý bằng ORM cơ bản. Hướng khắc phục em đã tính nếu có thời gian nghiên cứu nâng cao sẽ gắn ElasticSearch kết hợp Logstash để bóc tách từ khoá tối ưu hơn ạ."
4. **Hiểu rõ Code của đồng đội:**
   - Nếu bạn code Frontend, đừng nói là "Phần Backend đó bạn H code em ko biết rành". Hãy nói: "Phần đó thiết kế API em và bạn H đã thống nhất dùng mô hình xyz, nhưng chi tiết hàm trong Java thì bạn H nắm cứng hơn, bạn H giải thích cho thầy được không ạ?".

**Nên Đọc Lại Kỹ:** Các file `docs/qa_interview_questions...` mà tôi đã soạn để có vốn từ vựng Kỹ Thuật (như *Stateless, N+1 Query, CORS policy, Re-render, Mock test*) bắn ra cho trôi chảy nhé!

Chúc bạn bảo vệ đỉnh cao, tự tin lấy Điểm A+!
