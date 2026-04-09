# Bộ 50 Câu Hỏi Vấn Đáp (Q&A) - Đồ Án Student Career Support / Job Portal

Tài liệu thiết kế làm tài liệu tham khảo cho quá trình bảo vệ đồ án tốt nghiệp / môn học. Các câu hỏi bao quát từ tổng quan dự án, cơ sở dữ liệu, Backend (Spring Boot), Frontend (ReactJS) đến nghiệp vụ kỹ thuật phần mềm.

---

## Phần I. Tổng quan Dự án & Kiến trúc Hệ thống (Câu 1 - 10)

**1. Mục tiêu chính của dự án Student Career Support là gì?**
**Trả lời:** Nền tảng cầu nối giữa nhà trường/sinh viên và các doanh nghiệp tuyển dụng. Giúp sinh viên dễ dàng tạo CV, tìm kiếm việc làm, quản lý lộ trình ứng tuyển. Đồng thời giúp doanh nghiệp tiếp cận nguồn nhân sự chất lượng cao một cách chủ động.

**2. Hệ thống có những Actor (người dùng) chính nào và chức năng cốt lõi của họ là gì?**
**Trả lời:** 
- **Sinh viên (Student):** Tạo/Quản lý CV (Skills, Project, Education), tìm kiếm việc làm, nộp đơn ứng tuyển (Apply), theo dõi lịch phỏng vấn và trạng thái hồ sơ.
- **Doanh nghiệp (Company):** Tạo trang profile doanh nghiệp, đăng tin tuyển dụng, săn ứng viên (lưu hồ sơ), duyệt đơn ứng tuyển, lên lịch phỏng vấn.
- **Admin:** Quản lý hệ thống, kiểm duyệt doanh nghiệp và Job, kiểm soát tài khoản.

**3. Bạn sử dụng kiến trúc hệ thống tổng thể nào cho dự án?**
**Trả lời:** Dự án sử dụng mô hình **Client-Server** với kiến trúc **RESTful API**. Trong đó luồng xử lý Backend đóng vai trò như một API Server độc lập cấp quyền truy cập, tách biệt hoàn toàn biểu diễn dữ liệu UI trên Frontend (Tách rời Frontend và Backend - Headless config).

**4. Tại sao bạn lại chọn tech stack: Spring Boot (Backend) và React (Frontend)?**
**Trả lời:** 
- **Spring Boot:** Hệ sinh thái Java mạnh, dễ dàng cấu hình MVC tự động hóa, có Spring Data JPA xử lý ORM Database mạnh mẽ, Spring Security hỗ trợ bảo mật chuyên sâu. Rất phù hợp cho hệ thống cần tính nhất quán cao.
- **ReactJS:** Xây dựng Component tái sử dụng cao, cập nhật UI mượt mà với Virtual DOM, cộng đồng lớn, hỗ trợ xây dựng Dashboard hiệu quả.

**5. Chức năng CV Builder hoạt động với logic thế nào?**
**Trả lời:** Sinh viên nhập thông tin theo từng module (Kinh nghiệm, Học vấn, Kỹ năng, Project). Backend lưu trữ ở các bảng riêng biệt kết nối qua `student_id`. Frontend gọi API lấy toàn bộ thông tin đó, đưa vào một State tổng và fill vào các giao diện Template CV (Component Sidebar & Body).

**6. Quy trình nộp đơn ứng tuyển hoạt động như thế nào?**
**Trả lời:** Sinh viên tìm job -> click Apply. Hệ thống kiểm tra quyền. Nếu OK, tiến hành tạo một bản ghi vào bảng `applications` link `student_id` và `job_id` với status mặc định là `pending`. Ngay sau đó có thể record thêm 1 `notification` báo cho Doanh nghiệp.

**7. Tính năng gửi thông báo (Notification) là realtime hay polling?**
**Trả lời:** Trong phiên bản HTTP thông thường, nó hoạt động bằng cơ chế lấy thông báo mỗi khi tải trang hoặc short-polling. (Nếu có dùng WebSocket STOMP thì trả lời là Real-time thông qua socket đẩy trực tiếp xuống client).

**8. Làm sao để đảm bảo bảo mật Mật khẩu người dùng trong DB?**
**Trả lời:** Không lưu plain text. Sử dụng thuật toán băm (hashing) như **BCrypt** tích hợp sẵn trong Spring Security. Cơ chế có salt ngẫu nhiên mỗi lần băm nên dù 2 account chung mật khẩu, mã hash lưu dưới DB vẫn khác nhau.

**9. Quản lý source code vào luồng làm việc nhóm như thế nào?**
**Trả lời:** Sử dụng Git & GitHub. Dự án cấu hình `.gitignore` chuẩn. Quản lý nhánh qua Git Flow cơ bản: nhánh `main` cho deploy, nhánh `dev` để merge code các thành viên, người làm tính năng nào thì tạo nhánh feature riêng biệt.

**10. Xử lý tải file (Logo công ty, chứng chỉ) ntn?**
**Trả lời:** File được lưu trữ trên Server/Local Storage trong thư mục `/uploads` (hoặc Cloud S3). Còn trong Database chỉ lưu `image_url` – đường dẫn tương đối hoặc tuyệt đối tới file đó để Frontend render qua thẻ `<img>`.

---

## Phần II. Phân tích Thiết kế Cơ sở Dữ liệu - DB (Câu 11 - 20)

**11. Tại sao lại tách thông tin người dùng ra thành 3 bảng: `users`, `students` và `companies`?**
**Trả lời:** Bố cục này gọi là "Phân mảnh dọc theo kế thừa" (Subtyping). Bảng `users` giữ các thông tin chung về tài khoản (email, pass, role). Bảng `students` hoặc `companies` giữ các thuộc tính riêng biệt (sinh viên có niên khóa, điểm GPA; công ty có quy mô, mã số thuế) kết nối 1-1 qua `user_id`. Điều này giúp Database chuẩn hóa cao và tránh các cột Null vô ích.

**12. Các trạng thái của `applications` được quản lý ra sao?**
**Trả lời:** Sử dụng ENUM: `pending` (Đợi duyệt) -> `review` (Đang xem xét) -> `interview` (Hẹn phỏng vấn) -> `accepted` (Nhận) hoặc `rejected` (Từ chối). Cứ mỗi lần thay đổi, update cột status từ BE.

**13. Bảng `skills`, `student_skills` và `job_skills` có ý nghĩa như thế nào trong nghiệp vụ matching?**
**Trả lời:** `skills` là Từ điển Master table. Giữa Sinh viên và Kỹ năng là quan hệ N-N nên dùng bảng trung gian `student_skills`. Tương tự với Job có `job_skills`. Vì dùng chung bảng từ điển `skills`, hệ thống rất dễ Join 2 đầu để tìm ra mức độ % trùng khớp giữa sinh viên và Job bằng hàm đếm giao tập ID.

**14. Việc dùng Foreign Key (Khoá ngoại) mang lại gì?**
**Trả lời:** Mang lại sự "Toàn vẹn tham chiếu" (Referential Integrity). Tránh tình trạng Database có đơn ứng tuyển (`applications`) gắn với một tài khoản sinh viên đã không còn tồn tại.

**15. Tại sao không có ràng buộc Xóa mềm (Soft Delete) như trường `is_deleted` ở bảng jobs?**
**Trả lời:** Hiện tại Database lờ đi xóa mềm, mà chỉ có `is_active` ở bảng user. Nếu triển khai chuẩn, khi xóa job, nên update `is_deleted = true` thay vì `DROP` bản ghi, vì nếu `DROP` sẽ sinh ra lỗi cascade khóa ngoại với bảng applications đã có ứng viên nộp hoặc mất lịch sử thống kê.

**16. Sự dư thừa giữa bảng `certificates` và `certifications`?**
**Trả lời:** (Trả lời phụ thuộc vào bạn cấu hình): Có thể do design ban đầu dư. Hướng xử lý: Sẽ tiến hành Migrate xoá bỏ một bảng, merge data sang bảng còn lại vì các cấu trúc field y hệt nhau.

**17. Tại sao lại lưu `saved_jobs` vào DB mà không lưu ở LocalStorage phía Frontend?**
**Trả lời:** Lưu dưới DB đảm bảo người dùng truy cập từ điện thoại hay bất kỳ máy tính nào thì danh sách Job vẫn còn (Data persistence tính toàn vẹn đa thiết bị). Local Storage bị giới hạn ở 1 browser cứng.

**18. Quan hệ giữa `applications` và `interviews` là gì?**
**Trả lời:** Mối quan hệ 1-N. Mỗi lần ứng tuyển (application), công ty có thể tổ chức nhiều hơn 1 vòng phỏng vấn (interviews) ví dụ vòng chuyên môn, vòng nhân sự. `application_id` đóng vai trò khóa ngoại trong bảng `interviews`.

**19. Đã bao giờ lo ngại vấn đề hiệu suất N+1 Select khi query trên các bảng 1-N ở JPA chưa?**
**Trả lời:** Có. Do liên kết rất nhiều Object con (như Experience, Project) của một Student. Sẽ dùng kỹ thuật `JOIN FETCH` trong HQL/JPQL hoặc Entity Graph trong Spring Data JPA để truy vấn lấy ngay Data trong 1 vòng Query thay vì để nó bốc Lazy sinh ra 1+N Query.

**20. Dùng ENUM ở cấp độ Database (MySQL enum) thay vì bảng rời có nhược điểm gì?**
**Trả lời:** Nhược điểm là nếu muốn thay đổi Enum (Ví dụ thêm option mới `freelance` vào `job_type`) bắt buộc phải can thiệp lệnh `ALTER TABLE` vào lõi Database (Schema change), khó cấu hình hơn việc dùng thêm một bảng Lookup độc lập.

---

## Phần III. Backend & Spring Boot (Câu 21 - 35)

**21. Quy trình Xác Thực (Authentication) bằng JWT hoạt động ra sao?**
**Trả lời:** Client gửi Email/Pass -> BE check DB qua Spring Security AuthenticationManager -> OK thì JWT Utility Generate 1 chuỗi Token mã hóa chứa ID/Role và thời hạn -> Trả về Client. Lần sau gọi API, Client phải đính kèm Header `Authorization: Bearer <token>`.

**22. Vai trò của Filter trong Spring Security? (Ví dụ JwtRequestFilter)**
**Trả lời:** Đứng trước khi Request đi tới Controller. Filter này sẽ đọc chuỗi `Authorization`, chặn lấy Token, giải mã kiểm tra tính hợp lệ và thời hạn, sau đó thiết lập SecurityContextHolder (đánh dấu User đã verify), cho phép luồng chạy qua.

**23. Tại sao trong Spring Boot dùng thiết kế Repository -> Service -> Controller?**
**Trả lời:** Nguyên lý SOC (Separation of Concerns): 
- Repository: Lo giao tiếp tương tác với DB (JPA).
- Service: Chứa business logic (Ví dụ check điểm GPA, check quyền apply).
- Controller: Đón và định tuyến Request, validate đầu vào HTTP và Format HTTP Response. Giúp code không bị dồn chung.

**24. Tại sao lại cần chuyển đổi qua lại giữa Entity và DTO (Data Transfer Object)?**
**Trả lời:** Để che giấu cấu trúc DB thực tế, ẩn các thông tin mật (như password_hash), tránh vòng lặp Vô hạn (Infinite Recursion khi Serialize JSON giữa quan hệ N-N/1-N) và tuỳ biến Data gọn nhẹ hơn để gửi xuống Front-end.

**25. Cấu trúc Custom Error Exception handling của Backend như thế nào?**
**Trả lời:** Dùng Annotaion `@ControllerAdvice` và `@ExceptionHandler` để bắt lỗi toàn cầu (Global Exception Handler). Khi Service quăng ra `ResourceNotFoundException`, class này sẽ bắt được và trả về Status 404 chuẩn form JSON cấu trúc thay vì trả ra stack trace lỗi vặt của Java.

**26. Luồng Forgot Password hoạt động như thế nào?**
**Trả lời:** User nhập Email -> BE search có tồn tại không -> Random 1 UUID làm `token` lưu vào bảng `password_reset_tokens` cùng thời gian hết hạn (15 phút) -> Gắn UUID vào một đường link Frontend -> Gửi đường link đấy rớt vào Email đăng nhập ủa User (Java Mail Sender). User bấm link nhập Pass mới tiến hành update.

**27. @Transactional annotation có chức năng gì? Khi nào cần dùng cẩn thận?**
**Trả lời:** Đảo bảo nghiệp vụ toàn vẹn (ACID), thường gắn trên Service. Đặc tính 'All-or-Nothing'. Ví dụ nếu quá trình nộp Apply lỗi, thì các bước trừ tiền hay đếm View job trước đó phải tự động ROLLBACK.

**28. `CORS Policy` sinh ra khi nào? Hướng giải quyết ở BE?**
**Trả lời:** Khi Frontend (ví dụ chạy localhost:5173) gọi chéo sang Backend (localhost:8080) do trình duyệt cấm khác cổng/domain. Fix bằng `@CrossOrigin` trên Controller hoặc Config `CorsRegistry` toàn cầu trong Spring WebConfig cho phép các origin cụ thể.

**29. Làm sao để Map quan hệ Sinh viên và Skill bằng JPA?**
**Trả lời:** Dùng `@OneToMany` tới class trung gian kiểu `StudentSkillEntity` (vì bảng này có thêm field phụ là `level`), hoặc thẳng list Skill nếu dùng `@ManyToMany` trên biến Collection chứa Skill.

---

## Phần IV. Frontend (ReactJS) & UI/UX (Câu 30 - 40)

**30. Bạn dùng công cụ State Management nào ở Frontend và tại sao?**
**Trả lời:** Dùng Context API (nếu dự án nhỏ) hoặc Redux/Zustand để quản lý global state như Lưu trạng thái `userRole`, `token` người đang Login, hay `theme` (dark/light) để mọi pages đều xài được mà không phải truyền props chéo (Prop Drilling).

**31. `useEffect` được dùng trong case nào tại trang JobList?**
**Trả lời:** Gọi lấy Database lần đầu khi component mount (`[]`), cụ thể gọi tới API `/api/jobs` qua Axios để lấy list data Job nạp vào biến state `jobs` cho UI render HTML ra màn hình.

**32. Cách chống rò rỉ bộ nhớ (Memory Leak) khi xài useEffect?**
**Trả lời:** Trả về một block `return () => {}` ở cuối (Cleanup Function) để clears các Timer (setInterval) hoặc huỷ kết nối nếu Component bị huỷ bỏ khỏi DOM.

**33. React Router xử lý cơ chế Phân Quyền (Private Route) như thế nào?**
**Trả lời:** Bọc các Component Dashboard/Admin bằng một HOC (Higher-order Component) `ProtectedRoute`. Trong đó check biến `user.role`, nếu rỗng hoặc role sai quyền thì `Navigate` văng thẳng ra page Login ngược lại thì return thẻ `Outlet` / `children`.

**34. Form quản lý nhiều field như CV Form nên dùng gì để tối ưu render?**
**Trả lời:** Sử dụng các thư viện như `React Hook Form` kết hợp với `Yup/Zod` validation. Nó xài Uncontrolled Components tiết kiệm chu kì re-render thay vì cứ 1 phím gõ bằng onChange setState gây lag ứng dụng. 

**35. Tại sao bạn nhắc tới việc Convert UI từ Tailwind sang Vanilla CSS? Ưu nhược điểm là gì?**
**Trả lời:** 
- Tailwind: Lên style cực lẹ, class chung 1 dòng dễ trace trên HTML.
- Pure CSS: Giúp HTML Component DOM sạch thoáng hơn, tái cấu trúc logic file theo BEM (Block Element Modifier). Ở dự án này cần tuỳ chỉnh các animation mượt, glass-effect nên tách CSS riêng giúp quản lý Custom variables màu rành mạch cực tốt.

**36. Axios Interceptor mang vai trò trọng yếu nào trong code?**
**Trả lời:** Được cấu hình đứng giữ ở "Cổng môn".
- Req Interceptor: Tự động trỏ cái LocalStorage `token` kẹp vào HTTP Header, không cần phải file API nào củng viết thủ công.
- Res Interceptor: Bắt mọi Status Code lỗi toàn hệ thống. Ví dụ lỗi `401 Unauthorized` (Token hết hạn) thì chủ động trigger Logout và ép chuyển ra trang đăng nhập.

**37. Trải nghiệm người dùng (UX): Khi API Pending đang load, FE phải làm gì?**
**Trả lời:** Set biến state `isLoading = true`, lúc này React sẽ render ra cái View Skeleton Loading, hoặc Spinner Overlay tròn. Sau khi hàm Promise chạy `finally{}` set `loading = false` thì hiện data thật lên. Phải có UX này.

---

## Phần V. Kỹ năng mở rộng & Xử lý Nâng cao (Câu 38 - 50)

**38. Hiệu suất thuật toán Search: Làm sao để tối ưu ô Tìm kiếm tên Công Việc ko bị gọi API quá nhiều?**
**Trả lời:** Chạy kỹ thuật **Debounce**. Dừng việc gọi call API Search liên tục mỗi khi user nhấn 1 phím. Thay vào đó, đặt 1 timer `setTimeout(500ms)`, nếu sau 500ms mà user ko gõ tiếp thì mới Fire request fetch dữ liệu.

**39. Cách Server thực thi Filter Việc Làm (Sắp xếp, Mức lương...)?**
**Trả lời:** Sử dụng Query Parameters từ Client `GET /jobs?salaryMin=10&page=0`. Dưới Spring boot dùng `@RequestParam`, thả vào Spring Data `JpaSpecificationExecutor` để parse tự động các câu lệnh WHERE linh hoạt thành câu SQL theo điều kiện User click. 

**40. Chức năng upload file giới hạn và bảo mật ra sao?**
**Trả lời:** Backend phải validate File ext (`.png`, `.pdf`, `.jpg`), giới hạn `max-file-size` tầm 5MB để chống chọc thủng băng thông server (DoS), sau đó hash tạo tên file UUID độc nhất tránh trùng lặp đè tên lúc lưu xuống Folder hệ thống.

**41. Phân trang (Pagination) ở BE/FE bằng cách nào?**
**Trả lời:** Frontend cung cấp biến `page` (trang số) và `size` (tổng). Backend Spring Data JPA cấp object `Pageable` ném vô repository. Trả về cho FE object chứa cả chuỗi Data và metadata tổng số pages `totalPages` để FE vẽ thanh Button `< 1 2 3 >`. 

**42. Bạn test API bằng công cụ gì? Đã viết Unit Test chưa?**
**Trả lời:** Bọn em test End-to-End backend bằng Postman hoặc Swagger UI. Với Spring Boot có Unit Test trên JUnit5 + Mockito tách biệt môi trường ra check Service, ko phụ thuộc DB thực tế. 

**43. Validation dữ liệu cần thực hiện ở đâu? Tại sao?**
**Trả lời:** CẢ HAI 1 LÚC. Frontend validate ngay lúc type (UI/UX) cho user sửa liền, giảm tải server. Nhưng luôn luôn phải validate chốt cuối ở Backend (dùng `@Valid` + Object DTO) để ngăn chặn kẻ xấu chọc API bypass qua Frontend bằng tools.

**44. Phân phối code, cơ sở hạ tầng có tính CI/CD ko?**
**Trả lời:** Code nằm trên GitHub, deploy BackEnd lên các cloud provider (như AWS EC2, Heroku hoặc Render), Frontend render tĩnh ném qua Vercel. Database host online qua RDS MySQL Clevis/Aiven.

**45. Nếu hệ thống lớn lên với 10 triệu jobs và users, hệ thống cần cấu trúc lại như thế nào?**
**Trả lời:**
- Phá Monolithic thành Microservices. Tách Service User, Service Apply riêng.
- Nhập ElasticSearch để xử lý phần Query full text query của Job nhanh hơn MySQL `%LIKE%`.
- Lưu Cache Redis những Job Hot để tránh việc chọc vào ổ cứng (Disk DB) liên tục.

**46. Ứng viên apply sai lầm muốn Huỷ apply thì hệ thống xử lý góc độ Data ntn?**
**Trả lời:** Frontend gọi API huỷ. Backend update status từ `pending` sang một trạng thái Enum mới như `withdrawn` (thu hồi) hoặc `cancelled`. Chứ không được DROP DELETE dòng đó để còn có số liệu tracking HR.

**47. Khó khăn lớn nhất khi ghép nối ReactJS vào Spring Boot của dự án này?**
**Trả lời:** Đó là sự đồng nhất Contract DataType (Kiểu dữ liệu). Rất hay xảy ra trường hợp Java trả list Date format dạng Array (YYYY-MM-DD), nhưng FE JS lại báo lỗi parse, buộc phải sử dụng mapping đồng bộ format Date Jackson toàn cục.

**48. Phân vùng truy cập API an toàn (Authorization Layer)?**
**Trả lời:** Dùng `@PreAuthorize("hasRole('student')")` gắn trên Endpoint API apply jobs. Dù tài khoản Company có dò được URL này kẹp Token đi xuống củng sẽ bị chặn và quăng Exception 403 Forbidden.

**49. Hạn chế thiết kế hiện tại của Job Portal này nằm ở đâu?**
**Trả lời:** Chưa code Real-time Chat cho phỏng vấn 1-1, cần bổ sung socket.io/stomp. Thuật toán suggest việc làm vẫn là câu lênh SQL cơ bản chưa dùng Machine Learning / AI để matching resume ngữ nghĩa. 

**50. Điểm mà em tự hào hay hứng thú nhất trong Project này?**
**Trả lời:** Kiến trúc Headless, việc phân tích Normalize DB hợp lý, việc apply UI cực đẹp hỗ trợ tạo CV component có thể export chuẩn hoá làm nền tảng cạnh tranh trực tiếp vơi các nền tảng CV thực tế trên thị trường.

---
_Lưu ý: Sinh viên nên linh động sử dụng các câu trả lời trên, điều chỉnh dựa vào những gì mình thực sự code trong dự án đã diễn ra để có sự trải nghiệm thực tế khi đối đáp với hội đồng._
