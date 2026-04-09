# Bộ 100 Câu Hỏi Vấn Đáp Nâng Cao - Phần 2 (Câu 51 - 150)

Tài liệu này cung cấp thêm 100 câu hỏi đào sâu vào các khía cạnh kỹ thuật chi tiết của dự án Job Portal (Student Career Support). Các câu hỏi được thiết kế ngắn gọn, đi thẳng vào trọng tâm để dùng cho bước "hỏi xoáy đáp xoay" của hội đồng bảo vệ.

---

## VI. Kiến trúc Hệ thống & Thuật toán (Câu 51 - 65)

**51. Nếu dự án đổi từ Monolithic sang Microservices, bạn sẽ tách những service nào?**
**Trả lời:** Tách thành User Service (Auth/Profile), Job Service (Quản lý tin tuyển dụng), và Notification Service.

**52. Hệ thống của bạn có khả năng chịu tải (Scalability) linh hoạt không?**
**Trả lời:** Nhờ thiết kế Stateless (dùng JWT thay vì Session), Backend dễ dàng nhân bản (Scale out) qua nhiều server bằng Load Balancer mà không lo mất trạng thái đăng nhập.

**53. API Rate Limiting là gì? Tại sao cần nó ở trang Apply Job?**
**Trả lời:** Là giới hạn số lần gọi API trong một khoảng thời gian. Để tránh ứng viên spam nộp hàng trăm CV vào 1 công việc trong vài giây gây nghẽn DB.

**54. Làm thế nào để implement chức năng Tìm kiếm (Search) việc làm nhanh hơn?**
**Trả lời:** Thay vì truy vấn trực tiếp DB bằng `LIKE %keyword%`, nên dùng Full-Text Search của MySQL hoặc tích hợp ElasticSearch.

**55. Thuật toán gợi ý việc làm (Recommendation) có thể nâng cấp như thế nào?**
**Trả lời:** Dùng AI/Machine Learning (ví dụ thuật toán lọc cộng tác - Collaborative Filtering) hoăc dùng TF-IDF để đo độ tương đồng giữa nội dung CV và mô tả công việc (Job Description).

**56. Bạn quản lý Cache như thế nào cho các Job phổ biến?**
**Trả lời:** Sử dụng Redis. Khi có request lấy danh sách Job mới nhất, BE check Redis trước, nếu chưa có (Cache Miss) mới chọc xuống DB, giúp giảm tải MySQL.

**57. Làm thế nào để biết một chức năng (như sửa CV) chạy chậm ở Frontend hay Backend?**
**Trả lời:** Mở thẻ Network trong Chrome DevTools. Xem thời gian TTFB (Time to First Byte) của API. Nếu TTFB lâu là do Backend/DB chậm. Nếu TTFB cực nhanh nhưng UI giật lag là do Frontend render kém.

**58. Sự khác biệt giữa Short Polling và WebSockets? Tại sao chọn WebSockets cho tin nhắn?**
**Trả lời:** Short Polling là client liên tục hỏi server xem có tin mới không (tốn tài nguyên). WebSockets duy trì 1 ống kết nối hai chiều, khi có tin, Server chủ động đẩy xuống ngay lập tức (Real-time).

**59. Cron Job/Task Scheduling được ứng dụng vào đâu trong hệ thống?**
**Trả lời:** Quét và tự động thay đổi trạng thái (status) các công việc (Jobs) đã qua ngày `deadline` từ `open` thành `closed` vào lúc 12h đêm mỗi ngày.

**60. Khi hệ thống gặp rủi ro sập Server, bạn khắc phục/backup DB thế nào?**
**Trả lời:** Cấu hình tự động Dump MySQL backup ra file SQL mỗi ngày đưa lên AWS S3 hoặc cấu hình cơ chế Master-Slave Replication cho DB.

**61. Làm sao để đánh giá code của bạn là Clean Code?**
**Trả lời:** Dựa trên chuẩn SOLID, tên biến/hàm gợi nhớ rõ ràng (Self-documenting), không lặp code (DRY), các component ở FE tái sử dụng cao và hàm BE được phân lớp rạch ròi.

**62. Hệ thống làm sao xử lý Deadlock nếu 2 Admin cùng duyệt 1 bài đăng?**
**Trả lời:** Dùng cơ chế khóa (Locking) trong DB (Optimistic Lock với `@Version` trong JPA) để hệ thống báo lỗi Conflict cho người submit sau.

**63. Event-Driven Architecture mang lại lợi ích gì cho việc gửi thông báo?**
**Trả lời:** Khi sinh viên Apply, Service Apply sẽ gửi 1 Event. Service Notification bắt Event đó xử lý gửi đi, giúp giảm độ trễ của API Apply mà không cần chờ.

**64. Tính năng theo dõi hoạt động (Audit log) của Admin thực hiện ra sao?**
**Trả lời:** Tạo một bảng `audit_logs` lưu trữ `user_id`, `action` (như "Xoá Job"), và `timestamp`. Trong Spring có thể dùng Spring Data Envers.

**65. Dự án giải quyết bài toán Data Integrity (Tính toàn vẹn) nhờ công cụ gì?**
**Trả lời:** Sử dụng Foreign Keys ở tầng DB, Enum Constraints, và các Data Type Validation (`@NotNull`, `@Size`) ở tầng Backend.

---

## VII. Cơ Sở Dữ Liệu (MySQL / Data Layer) (Câu 66 - 85)

**66. Sự khác nhau giữa `VARCHAR(255)` và `TEXT` trong thiết kế bảng?**
**Trả lời:** `VARCHAR` được lưu trong row bộ nhớ và có thể đánh Index dễ dàng. `TEXT` lưu off-page phù hợp cho đoạn text dài (như Description) nhưng đọc sẽ tốn I/O hơn và khó đánh index trực tiếp.

**67. Index được đánh trên cột nào để trang Job Search tối ưu nhất?**
**Trả lời:** Bạn nên đánh Index ở bảng `jobs` tại các cột thường xuyên nằm trong mệnh đề WHERE như `status`, `job_type`, và `company_id`.

**68. Giải thích Join Fetch và cách nó giảm N+1 Query.**
**Trả lời:** Fetch Join tải toàn bộ Entity cha và con trong 1 câu SQL `INNER JOIN` duy nhất, thay vì JPA mặc định tự kích hoạt N câu select riêng rẽ cho tập con.

**69. Bảng trung gian `student_skills` tại sao cần có cột Id riêng?**
**Trả lời:** Bố trí thêm Id định danh vật lý (Surrogate Key) thay vì dùng Composite Key (student_id + skill_id) sẽ giúp mở rộng hệ thống tốt hơn hoặc liên kết entity bằng Object ID trong Hibernate dễ hơn.

**70. Tại sao `earned_credits` và `total_credits` lại lưu cứng dưới bảng Student? Nó không nên được tính hàm SUM từ môn học?**
**Trả lời:** Đây là kỹ thuật Denormalization. Việc tính tổng tốn chi phí CPU, nên ta lưu kết quả sẵn xuống bảng để lấy hiển thị lên profile nhanh ngay.

**71. Sự khác biệt giữa `DATETIME` và `TIMESTAMP` ở các bảng?**
**Trả lời:** `TIMESTAMP` tự động convert timezone sang UTC lưu xuống DB và đổi lại timezone của User khi đọc lên. `DATETIME` thì lưu đúng cứng theo giá trị được nhập. Nên dùng TIMESTAMP cho thời gian toàn cầu.

**72. Trigger trong MySQL là gì? Dự án bạn cần dùng không?**
**Trả lời:** Giúp tự động thực thi khi có sự kiện (Insert, Update). Thường trong Spring Boot tụi em xử lý logic bằng Event Listener thay vì dùng Trigger DB để gom chung logic vào mã nguồn.

**73. Tại sao giá lương `min_salary`, `max_salary` được set kiểu `DECIMAL(38,2)`?**
**Trả lời:** Kiểu Sinh viên và cty giao dịch tài chính yêu cầu sự chính xác, `DECIMAL` lưu fixpoint không bị sai số làm tròn dấm dớ như kiểu `FLOAT` hay `DOUBLE`.

**74. Dùng Unique Key ở cấu trúc bảng `companies` cho `user_id` giải quyết bài toán gì?**
**Trả lời:** Đảm bảo quan hệ chặt chẽ 1 - 1, ngăn chặn việc 1 user account có thể vô tình tạo ra được 2 profile Company khác nhau dưới DB.

**75. Bảng `notifications` có trường `is_read`. Làm sao upate 100 thông báo thành đã đọc cùng lúc?**
**Trả lời:** Gửi API với mảng ID (bulk update), Backend dùng JPA `@Modifying` + `@Query("UPDATE ... WHERE id IN :ids")` để chạy chỉ bằng 1 câu lệnh SQL thay vì dùng vòng lặp FOR gọi hàm Save().

**76. Để đếm số view của 1 Job (jobs.views), mỗi lần truy cập update +1 có gây bottle-neck không?**
**Trả lời:** Có. Update dòng liên tục tạo Table/Row lock. Tối ưu bằng cách dồn View count vào bộ đệm Redis và sau 5 phút chạy Cronjob sync từ Redis về MySQL 1 lần.

**77. Phân tích chức năng lưu Ứng viên (`saved_candidates`) đối với công ty?**
**Trả lời:** Lưu trạng thái 1-N. Bảng phụ lưu ID ứng viên và ID công ty. Tới lúc hiển thị, Backend join list đó trả cho Frontend hiển thị ứng viên ưa thích.

**78. Làm sao giới hạn chức năng ứng tuyển (applications) (ví sinh viên không thể apply 1 job 2 lần)?**
**Trả lời:** Đặt `UNIQUE Constraint` trên kết hợp 2 cột `(student_id, job_id)` trong DB và throw exception tại Controller báo lỗi cho UI.

**79. CascadeType.ALL trong entity JPA nghĩa là gì?**
**Trả lời:** Khi thay đổi entity Cha (Student), các Entity con (Skills, Education) tự động nhận hành động thay đổi/xoá theo cha, không cần code gọi repository của con.

**80. Cấu trúc DB nào để hỗ trợ Multiple Language (Ví dụ web Job cho người Nhật và Anh)?**
**Trả lời:** Tạo bảng Localization (Ví dụ `skills_translations` chứa `skill_id, language_code, name_translated`) hoặc lưu field JSON format ở cột `name`.

---

## VIII. Backend Development (Spring Boot / Java) (Câu 81 - 105)

**81. `@RestController` khác gì `@Controller`?**
**Trả lời:** `@RestController` là tập hợp của `@Controller` và `@ResponseBody`. Tự động chuyển đổi các Object Java trả về thành JSON.

**82. Vòng đời của một Request trong hệ thống Spring MVC là gì?**
**Trả lời:** Request -> Client -> Filter -> DispatcherServlet -> Interceptor -> Controller -> Service -> Repository -> Database. Và ngược lại.

**83. Dependency Injection (DI) áp dụng như thế nào trong dự án?**
**Trả lời:** Dùng từ khoá `@Autowired` (Hoặc thông qua Constructor) để Spring tự khởi tạo và tiêm Object (Bean) như UserRepository vào trong UserService, giảm tính phụ thuộc gắt (Loose coupling).

**84. Tại sao Bean mặc định trong Spring lại mang tính Singleton?**
**Trả lời:** Để tránh tạo ra hàng ngàn object UserService khi có hàng ngàn User đang request. Giúp tiết kiệm cực kỳ nhiều Memory.

**85. Làm sao map DTO với Entity nhanh nhất?**
**Trả lời:** Sử dụng các thư viện như `MapStruct` hoặc `ModelMapper`.

**86. Ý nghĩa của `@PathVariable` và `@RequestParam`?**
**Trả lời:** `@PathVariable` lấy value trực tiếp từ URL path template (`/jobs/{id}`). `@RequestParam` lấy qua query string ở cuối url (`/jobs?type=intern`).

**87. Tác dụng của Hibernate L1 Cache và L2 Cache? Dự án có dùng không?**
**Trả lời:** L1 Cache chạy ở từng phiên Session để chống gọi trùng query cùng 1 record. L2 Cache là Global. Để tăng hiệu năng lấy metadata (Tỉnh thành, Ngành nghề) dự án có bật L2 Cache (như Ehcache).

**88. JWT Token thường chứa 3 phần nào?**
**Trả lời:** Header (Thuật toán ký), Payload (Chứa Email, Role, ID), và Signature (Chữ ký điện tử hash từ Secret Key để chống làm giả).

**89. Tại sao Secret Key mã hoá JWT phải giữ kỹ và không push lên Github?**
**Trả lời:** Nếu lấy được Secret Key, Hacker sẽ tự sinh ra token có Payload `role=ADMIN` đánh sập hệ thống. Thường bỏ nó vào file `.env` không push.

**90. Sự khác biệt giữa `CrudRepository` và `JpaRepository`?**
**Trả lời:** `JpaRepository` con của PagingAndSortingRepository (và Crud), bổ sung các hàm trả về List và hỗ trợ xả cache `flush()`, phân trang tốt hơn.

**91. Bạn debug một lỗi NullPointerException trên server Spring như thế nào?**
**Trả lời:** Đọc log Tomcat/Console của server, dò tới đúng dòng Code nổ bug, check giá trị null và bọc Validator hoặc check `if(obj != null)`.

**92. Xử lý File Upload trong Spring Boot cần các module nào?**
**Trả lời:** Request nhận `@RequestParam("file") MultipartFile file`. Sau đó dùng cơ chế TransferTo để lưu file vật lý hoặc gửi qua Stream API.

**93. Mã hoá mật khẩu bằng thuật toán nào để an toàn nhất? MD5 có an toàn không?**
**Trả lời:** Không dùng MD5 vì dễ bị tra cứu ngược (Rainbow table). Nên dùng `BCryptPasswordEncoder` (Spring) hoặc Argone2 vì nó có hàm xáo trộn `salt` và tuỳ chỉnh mức độ quét chậm hệ thống (Work factor).

**94. Exception phân quyền `401 Unauthorized` và `403 Forbidden` khác nhau gì?**
**Trả lời:** 401: Chưa đăng nhập, không có token. 403: Đã đăng nhập nhưng Role của user không đủ quyền gọi API.

**95. Làm sao BE Validate email nhập đúng định dạng?**
**Trả lời:** Thêm `@Email` vào DTO Request và xài `@Valid` lúc nhận RequestBody.

**96. Tại sao API GET không nên có RequestBody?**
**Trả lời:** Chuẩn RESTful và RFC không khuyến khích GET dùng Body, vì sẽ bị cache xoá đi và Load Balancer có thể làm thất lạc data. Hãy dùng Query params.

**97. Khác biệt giữa POST và PUT trong ngữ cảnh quản lý CV của sinh viên?**
**Trả lời:** POST gọi Create lúc nộp mới CV. PUT/PATCH dùng khi Sinh viên Update CV (Chỉnh sửa ID nào đó đã tồn tại). PUT thay thế toàn bộ record, PATCH update 1 phần record.

**98. Khi tạo Company từ backend thành công, làm sao để ID tự nhảy rồi trả về FE?**
**Trả lời:** Ở Entity `@GeneratedValue(strategy = GenerationType.IDENTITY)`. Sau lệnh repository.save(entity), cái ID tự động set vào chính cục Entity để return.

**99. Cơ chế Soft Delete (Xóa mềm) nên implement trong Spring Data như thế nào?**
**Trả lời:** Gắn Annotation `@SQLDelete` (thay vì Delete thành Update status) và `@Where(clause="deleted=false")` ở đỉnh class Entity. Mọi truy vấn sẽ tự động bỏ qua record đã xóa.

**100. Stream API Java 8 được xài ở đâu trong dự án?**
**Trả lời:** Ở các service Data để map list từ Entity sang DTO thay cho vòng lặp FOR. Ngắn gọn, súc tích (ví dụ: `list.stream().map(mapper).collect(Collectors.toList());`).

**101. Làm sao Backend check tính hợp lệ của Token Reset Password?**
**Trả lời:** Dựa vô token String tìm dưới `password_reset_tokens` DB. So sánh thời điểm hiện tại `LocalDateTime.now()` với hạn `expiry_date` xem hết chưa.

**102. Chạy bất đồng bộ trong Spring Boot? (Async)**
**Trả lời:** Annotation `@Async`. Bỏ lên hàm gửi Email quên mật khẩu để Client nhận response Success ngay lập tức, trong khi thực tế code gửi Email (tốn 3 giây) vẫn đang chạy nền ngầm.

**103. Spring Profiles là gì? Cấu hình dự án của bạn ntn?**
**Trả lời:** Là cách thiết lập cấu hình biến đổi từng môi trường. Dùng `application-dev.yml` trỏ vô MySQL local, `application-prod.yml` trỏ vào MySQL cloud AWS.

**104. Jackson Library trong Spring đóng vai trò gì?**
**Trả lời:** Mapping Serialization (Java -> JSON) và Deserialization (JSON -> Java).

**105. Hướng giải quyết nếu Sinh Viên gửi file CV nặng 50MB làm sập băng thông?**
**Trả lời:** Cấu hình Max file size config properties: `spring.servlet.multipart.max-file-size=5MB`. Vượt mức sẽ văng SizeLimitExceededException ở mức Request, không kịp vào code.

---

## IX. Frontend Development (ReactJS) (Câu 106 - 130)

**106. Tại sao React dùng JSX? Chức năng JSX là gì?**
**Trả lời:** JSX giúp viết mã như viết HTML bên trong JS file Component, giúp Developer định hình DOM tree trực quan. Trình biên dịch Babel sẽ dịch nó sang các hàm `React.createElement`. 

**107. React Virtual DOM hoạt động ra sao và tăng tốc cho Job Portal thế nào?**
**Trả lời:** Khi có list Job mới về, React dựng 1 mô hình DOM ảo bộ nhớ (V-DOM). React chạy "Diffing" so sánh với V-DOM cũ, sau đó chỉ cập nhật (Update) chính xác những Node thay đổi lên nút DOM thực của Trình duyệt. Rất tiết kiệm tài nguyên.

**108. Các component UI trong dự án trao đổi Data (Prop Drilling) như thế nào?**
**Trả lời:** Truyền tham số con xuống dưới, nhưng qua 3-4 phân tầng thì dùng Redux / React Context API để đẩy data vào Global dùng chung.

**109. `useMemo` và `useCallback` giải quyết bài toán gì khi User click lọc Job liên tục?**
**Trả lời:** Ngăn ngừa việc Re-render cũng như khởi tạo mảng / hàm lại từ đầu vô tội vạ làm giật trình duyệt. `useMemo` nhớ giá trị data lọc, `useCallback` nhớ tham chiếu hàm filter khi truyền vào child component.

**110. CSR (Client-Side Rendering) của dự án này khác gì SSR (Server-Side Rendering)?**
**Trả lời:** CSR sẽ tải 1 cục file bọc JS lúc ban đầu về trắng tinh, JS chạy trong Browser mới request API dọn HTML lên. SSR sẽ gọi Data trên Server gộp HTML rồi nhét xuống Browser (tốt cho SEO hơn).

**111. Bạn format định dạng Ngày/Giờ ở UI bằng cách nào?**
**Trả lời:** Dùng bộ thư viện `date-fns` hoặc `moment.js` (hoặc plain JS Date API). Parse time API gửi xuống (`2024-05-12T10:00:00Z`) thành `12/05/2024 10:00 AM`.

**112. File `.env` của Frontend chứa thông tin gì?**
**Trả lời:** Điển hình là biến `REACT_APP_API_BASE_URL` trỏ đến IP/Domain của con Tomcat Backend (vd: `http://localhost:8080/api/v1`).

**113. Cách chống Re-render UI thừa thãi khi nhập form?**
**Trả lời:** Sử dụng react-hook-form (Uncontrolled Component/Ref mechanism) để không phải kích hoạt State render lại sau từng thao tác nhấn phím trên 10 ô input của form tạo CV.

**114. Layout tĩnh (Header, Sidebar, Footer) được cấu hình ntn với React Router?**
**Trả lời:** Set layout tổng bằng 1 Component có chứa `<Outlet />`. Khi thay đổi route, layout đứng in không bị chớp, chỉ thay Component bên trong ở khu vực `<Outlet/>`.

**115. Component Sidebar CV của Dashboard CSS thế nào để luôn hiện thị trên màn hình cuộn?**
**Trả lời:** Sử dụng CSS `position: sticky; top: 0` trên container của Sidebar.

**116. Đặt class Vanilla CSS cần tuân thủ quy tắc nào để dự án không loạn CSS chéo?**
**Trả lời:** Đặt theo Rule BEM (Block, Element, Modifier). Ví dụ class: `job-card__title--active`.

**117. Xử lý logic Login ở Frontend: Luồng đi?**
**Trả lời:** Đón response API trả về Object { user, token }. Lưu Token vào thư mục LocalStorage, update State Global isAuth = true. React Router Redirect sang page Role tương ứng (DashBoard student/company).

**118. Làm sao giữ User Login qua các lần F5 F5 Browser?**
**Trả lời:** Component App chính bọc 1 cái `useEffect(x => lấy token Storage, gọi api check me)`. Nếu token ok, nạp lại vào Global State ngay lúc mở App lên. 

**119. JWT decode trực tiếp ở FE được không?**
**Trả lời:** Được (Ví dụ xài thư viện `jwt-decode`). Do chuỗi Payload của JWT không mã hoá (chỉ base64), FE có thể decode lấy `role` ra xem ngay tại client mà ko cần gọi API Me (nhưng chỉ lấy thông tin, FE ko lừa gạt BE được).

**120. Lỗi CORS chỉ chặn Browser hay chặn cả Postman?**
**Trả lời:** Trình duyệt Web (Chrome, Edge...) là nơi sinh ra luật CORS để chặn đọc Request bảo vệ user, còn tool như Postman đi direct server ko bị dính CORS Policy.

**121. Tối ưu UX/UI với Suspense/Lazy load hoạt động ra sao?**
**Trả lời:** Component React nào ngầm chưa được User bấm vào (như Page Profile trong khi đang ở Page Home), thì code JS của page đó chưa được load. Bấm vô nó mới giật JS về (`React.lazy()`) tiết kiệm 50% băng thông lúc F5.

**122. Cách bạn xử lí Icon / Vector ảnh cho UI Job Portal hiển thị nét?**
**Trả lời:** 100% icon nhỏ và logo hệ thống ưu tiên sử dụng SVG hoặc FontIcon thay vì chèn ảnh Raster (JPG, PNG) để scale ko vỡ nét và nhẹ băng thông.

**123. Quản lý Theme Color / Typography?**
**Trả lời:** Em sử dụng CSS Variables (Ví dụ `--primary-color: #3B82F6;`) chèn trên file `index.css` root, từ đó các Component tái sử dụng bằng hàm `var(--primary-color)`.

**124. Cách Frontend báo lỗi từ form Validator một cách đẹp đẽ cho User?**
**Trả lời:** Không dùng vòng Alert() trình duyệt xấu xí. Sử dụng Toast Notification library (như react-hot-toast, react-toastify).

**125. Cấu trúc Component Tái sử dụng (Reusable Components) thực tế gồm những gì?**
**Trả lời:** Bọn em tách các `Button`, `InputLabel`, `JobCard`, `ModalConfirm` ra riêng và truyền Config qua props (`onClick`, `text`, `variant="danger"`).

**126. Chức năng Upload Avtar làm sao cho người dùng view hình thật trước khi dìm Gửi Server?**
**Trả lời:** Dùng JS Window DOM hàm `URL.createObjectURL(file)` để tạo link local hiển thị view trước (Preview mode). Sau khi OK xong mới submit API bằng FormData.

**127. Tránh Duplicate key khi xuất Render Loop cái Array (như loop List Jobs)?**
**Trả lời:** Prop `key={job.id}`. React theo dõi Key này trong Virtual DOM. Nếu không có hoặc cho key ngẫu nhiên bằng Math, hệ thống cảnh báo và dễ sinh lỗi render chéo thẻ.

**128. Bạn phân rã (Destructuring) Object JS để Code đẹp như thế nào?**
**Trả lời:** Gõ `const { id, title, salary } = job` thay vì phải call `job.id`, `job.title` ở 40 chỗ trong Component. Code sạch hơn rất nhiều.

**129. Làm Web responsive trên Mobile thì dùng kỹ thuật CSS nào chủ yếu?**
**Trả lời:** CSS Flexbox, CSS Grid và Media Queries (`@media (max-width: 768px)`). Đổi layout Job List từ dạng Bảng Table sang dạng Card xếp dọc.

**130. Trình duyệt Cache làm sai dữ liệu (Stale Data), FE khống chế ntn?**
**Trả lời:** Tích hợp React Query để config thời gian dữ liệu sống tự động xả rác refetch, hoặc thêm params Random vô URL GET API đuôi `?t=19245`.

---

## X. Triển Khai, Kiểm thử & Soft Skills Thực Tế (Câu 131 - 150)

**131. Postman Mock server đóng vai trò gì khi Code kẹp Frontend & Backend dev?**
**Trả lời:** FE không cần chờ BE làm xong API. Hai bên chốt kiểu JSON JsonContract rồi tạo Fake API Mock trên Postman để FE làm giao diện trước, chừng nào BE xong đổi host cắm dây vào là chạy.

**132. Bạn xử lý Conflict code Github với Member đồng sáng lập thế nào?**
**Trả lời:** Update nhanh pull `git Origin main`. Tìm đúng file bị gõ đè, sử dụng Resolve Editor của VSCode để "Chấp nhận dòng nào, Khước từ dòng nào" (Accept Incoming/Current) -> Commit lại.

**133. Ý nghĩa của Unit Test là gì trong Project nhỏ?**
**Trả lời:** Đảm bảo khi sửa đổi Tính năng B, Tính năng A không bị gẫy đổ (Regression Error). Mất công lúc rảnh, nhưng khi Project sát deadline thì nó vô giá giữ nhịp phát triển.

**134. Khái niệm Continuous Integration (CI)?**
**Trả lời:** Mỗi khi push code lên Git, tự máy chủ GitAction sẽ build source, chạy kiểm tra lỗi Unit Test xem có nổ không. Qua thì mới cho nút Merge Code.

**135. Dockerize 1 dự án Spring Boot thực hiện ntn?**
**Trả lời:** Viết `Dockerfile` copy file `target/app.jar` vào hệ điều hành alpine/java-jre lõi bên trong Docker, expose cổng 8080 và định cấu hình Entrypoint để chạy `java -jar`. 

**136. Để tăng thứ hạng Tìm Kiếm SEO của Job portal, Frontend React xử lý gì?**
**Trả lời:** Setup Meta tags Head chuẩn (Title mô tả job, OG meta content FB/X) qua `react-helmet`. Nhưng đặc thù CSR thì phải tích hợp Prerender/NextJS mới lấy Index Google tốt.

**137. API Gateway đứng ở vị trí nào trong bản đồ hệ thống?**
**Trả lời:** Ở Microservices hay Hệ thống tổng đài lớn, API Gateway là người chặn mọi Request đầu tiên vào để Định tuyến và Kiểm đếm Request (Gatekeeper). Dự án em thì không có, Client call thẳng Tomcat.

**138. Thất bại lớn nhất trong quá trình xây dựng đồ án?**
**Trả lời:** Lúc đầu thiết kế Database quá liền khối (ví dụ để hết Array Data vào trường VARCHAR), dẫn tới việc phải đập Database quy hoạch chuẩn hoá lại (chia nhiều bảng Student con) gây mất trắng 1 tuần làm API lại toàn bộ.

**139. Đánh giá bảo mật SQL Injection trên Backend?**
**Trả lời:** Hoàn toàn an toàn. Spring Data JPA xài cơ chế Hibernate Parameterized Query, biến tham số user nhập sẽ không bị chuỗi nối vô SQL thô gây lũng đoạn Query.

**140. Cách đánh bật lỗ hổng XSS (Cross Site Scripting) cho mục Text Mổ Tả Công Việc (Job Description)?**
**Trả lời:** React tự động escape HTML khi xuất dữ liệu ra JSX `<div> { job.desc } </div>`. Nếu xài `dangerouslySetInnerHTML` thì FE phải quấn chuỗi vào lib `DOMPurify` sanitizer.

**141. Nêu ví dụ về Lỗ Hổng Logic Nghiệp Vụ (Business Logic Flaw)?**
**Trả lời:** Thí dụ không bắt buộc Check User ID lúc sửa hồ sơ. User A nhập tham số `userId=2` của Sinh Viên B để hack pass sinh viên B. Backend phải check `Token UserId == Request UserId`.

**142. Bảng nào trong DB sẽ to nhanh nhất và cách Archive Data (Lưu trữ)?**
**Trả lời:** Bảng Notifications và Messages (nếu có). Sau 6 tháng có thể chạy script lưu xuống DB cứng phân tán giá rẻ hoặc Backup băng xoá bớt trên Table Active để duy trì tốc độ đọc.

**143. Trưởng nhóm hay PM phân chia Công việc theo phương pháp nào?**
**Trả lời:** Lên Trello (hoặc Jira). Dùng Agile Scrum phân các task nhỏ chạy theo chu kỳ Sprint 1 tuần, đánh giá Sprint review cuối tuần.

**144. Một tính năng "Hay" (Nice-to-have) tụi em đã bỏ qua vì thời gian gấp?**
**Trả lời:** CV Export sang File PDF đẹp định dạng A4 xịn, thay đổi Template đa dạng (cần convert library trên browser), và Tích hợp Login With Google (OAuth2). 

**145. Cấu hình HTTPS (SSL) được xử lý ở đâu?**
**Trả lời:** Lúc deploy, cài domain lên Reverse Proxy Nginx ở server, cất chứng chỉ SSL do Let'sEncrypt phát hành. Ứng dụng Backend/Frontend vẫn nằm sau lớp HTTP ngầm.

**146. Kỹ thuật Logging của BE có gì nổi bật hơn cái System.out.print()?**
**Trả lời:** Bọn em dùng SLF4J (Logback). Log có gắn cấp độ (INFO, WARN, ERROR), lưu phân mảnh theo Ngày (`Ngày nào lưu file .log ngày nấy`), giúp CheckBug Production dễ òm thay vì phải soi trên màn hình Console trôi nhanh.

**147. Chức năng thống kê biểu đồ của Admin Dashboard được làm như thế nào?**
**Trả lời:** Cấp API Data trả về dạng bảng dữ liệu Mảng Time-series (Count List Doanh thu/ Lượt nộp CV theo từng tháng). FE lấy array đó gắn vào config thư viện biểu đồ như Recharts.js / Chart.js.

**148. Frontend dự án bạn đang build ra thành phẩm là gì và cho vào đâu để Host?**
**Trả lời:** Lệnh `npm run build` xuất ra gói file cứng HTML CSS, file JS Chunk (minify). Thả các file tĩnh này lên Vercel hoăc NGINX local là tự chạy không cầu kỳ.

**149. Có cần mã hoá đường truyền dữ liệu trong hệ thống giữa FE và BE không?**
**Trả lời:** Không cần mình tự code AES chi. Chỉ cần cả website được trỏ lên HTTPS TLS Protocol v1.3 thì gói Packet HTTP bay trên không trung đã được tự mã hoá (Mạng Viettel chặng giữa ko nhìn trộm được Password nữa).

**150. Cuối năm, em tự cho đồ án của cá nhân / team mình đạt bao nhiêu điểm và vì sao?**
**Trả lời:** (_Đây là câu chốt của Giảng Viên - Sinh viên tự gáy cho hoành tráng nhưng khiêm tốn nhé_). "Em mạnh dạn cho đồ án đạt điểm cao (8-9đ), vì tính ứng dụng thật cực lớn, hệ thống full-stack tự tay code, nắm bắt rõ design pattern, hiểu sâu được thiết kế Database chuẩn thay vì chỉ copy/paste framework."
___
*Chúc các bạn bảo vệ Đồ án tốt nghiệp / Môn học thành công mỹ mãn! Chủ động dẫn dắt thầy cô đi theo luồng hiểu biết vững vàng của mình nhé!*
