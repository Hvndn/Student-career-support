# Bộ 50 Câu Hỏi Vấn Đáp - Phần 3: Chuyên Sâu Về Kiểm Thử Phần Mềm (Software Testing) (Câu 151 - 200)

Tài liệu này bổ sung 50 câu hỏi tập trung hoàn toàn vào mảng Đảm bảo chất lượng (QA) và Kiểm thử (Testing). Dành riêng cho giáo viên phản biện xoáy sâu vào cách bạn đã kiểm soát chất lượng code, bảo mật và hiệu năng của hệ thống Job Portal.

---

## XI. Khái quát về Kiểm Thử Phần Mềm (Câu 151 - 160)

**151. Tại sao hệ thống Job Portal của bạn lại cần đến Kiểm thử phần mềm (Testing)?**
**Trả lời:** Nhằm phát hiện sớm lỗi (bug) trước khi đẩy dự án lên môi trường Production cho Sinh Viên sử dụng thực tế. Đảm bảo dữ liệu như CV, đơn ứng tuyển không bị rò rỉ, mất mát hoặc thao tác nhầm lẫn.

**152. Có những Mức độ kiểm thử (Levels of Testing) cơ bản nào trong quy trình chuẩn?**
**Trả lời:** Có 4 mức độ: Unit Testing (Kiểm thử mức Đơn vị) -> Integration Testing (Kiểm thử Tích hợp) -> System Testing (Kiểm thử mức Hệ thống) -> Acceptance Testing (Kiểm thử Chấp nhận).

**153. Black-box Testing và White-box Testing khác nhau ở điểm nào?**
**Trả lời:** 
- Black-box (Hộp đen): Người test đóng vai trò người dùng (Ví dụ QA test trực tiếp giao diện trên Web Browser mà ko quan tâm code). 
- White-box (Hộp trắng): Người test phải biết rõ thuật toán, viết hàm test chọc trực tiếp vào code (Developer thường viết).

**154. Regression Test (Kiểm thử Hồi quy) là gì? Khi sửa chức năng Update CV, tại sao bạn cần nó?**
**Trả lời:** Là việc kiểm tra lại sau khi bạn sửa/bổ sung code mới, nhằm đảm bảo "code mới thêm không làm hỏng code cũ". Khi sửa Update CV, phải test xem lỡ nó có làm hỏng hàm Delete CV liên đới không.

**155. Kịch bản test (Test Case) điển hình bao gồm những thành phần nào?**
**Trả lời:** ID, Tên chức năng (VD: Login), Điều kiện tiên quyết (Pre_condition), Các bước thực hiện (Steps), Kết quả mong đợi (Expected Result) và Kết quả thực tế (Actual Result).

**156. Sự khác biệt cơ bản giữa Manual Testing (Thủ công) và Automation Testing (Tự động)?**
**Trả lời:** Manual là lấy tay bấm từng nút trên Web. Tốn công và hay dính lỗi do con người, khó tái lập liên tục. Automation là viết Code/Script để máy tự giả lập trình duyệt chạy 1 ngàn lần, nhanh nháy mắt.

**157. Test Driven Development (TDD) là gì? Team bạn có áp dụng không?**
**Trả lời:** TDD là phương pháp viết hàm Test "lỗi" trước để quy định chức năng, sau đó viết code thực tế để pass qua hàm Test đó. Thường dự án sinh viên tụi em bỏ qua TDD để chạy nhanh hơn nhưng trong doanh nghiệp thì bắt buộc.

**158. Báo cáo lỗi (Bug Report) bắt buộc phải có những gì để DEV fix được lỗi?**
**Trả lời:** Môi trường test (Browser nào, Phone nào), Giả lập lại bước thao tác bị lỗi (Steps to reproduce), và nếu được đính kèm Screenshot / Video / Console Log lỗi.

**159. "Smoke Test" là gì trong quy trình tung bản cập nhật mới lên Server web?**
**Trả lời:** Là bài test "rút gọn siêu nhanh" khi deploy lên Server để kiểm tra xem Web có vô được trang chủ và nút Login có chạy ko. Nếu qua Smoke Test thì test kỹ, nếu xịt thì rút luồng sập code luôn tránh mất thời gian.

**160. Boundary Value Analysis (Phân tích giá trị biên) có ứng dụng gì khi test Form lương ở hệ thống Job Portal?**
**Trả lời:** Nếu quy định `min_salary` là 5 - 100 USD. Em không test số 50, mà em bắt buộc phải test các số ở lằn ranh: `4, 5, 100, 101` xem Backend có bắt đúng lỗi Validation không.

---

## XII. Backend & Unit Testing trong Spring Boot (Câu 161 - 170)

**161. Để viết Unit Test trong dự án Spring Boot, em dùng công cụ gì?**
**Trả lời:** Sử dụng framework `JUnit 5` kết hợp với `Mockito`.

**162. Vai trò của thư viện Mockito là gì? Tại sao phải "Mock"?**
**Trả lời:** Trong Unit Test, hàm chỉ test lõi Logic của 1 Service. Lỡ như database không mở/sập thì code sẽ báo lỗi DB. Dùng `@Mock` để giả mạo (Fake) hành vi của JPA Database, ép nó trả ra kết quả như ý ngay không cần kết nối tới MySQL.

**163. Khi em Unit test hàm tính % kỹ năng matching Job, em viết test trên Controller hay Service?**
**Trả lời:** Bắt buộc viết ở `Service Layer`. Controller chỉ lo định tuyến HTTP HTTPs nên ko cần thiết, Service mới thực sự chứ Business Logic xử lý toán học hoặc thuật toán matching.

**164. Phương pháp `@DataJpaTest` trong Spring Boot dùng để làm gì?**
**Trả lời:** Dùng để test tầng Repository (ORM, SQL). Nó sẽ tự động load một database nhẹ ngay trên in-memory RAM (ví dụ H2) lưu tạm rồi xóa ngay để thử móc nối DB thay cho MySQL rườm rà.

**165. Kiểm thử API tự động với `@SpringBootTest` và `MockMvc` có cơ chế nào?**
**Trả lời:** `@AutoConfigureMockMvc` cho phép bắn một request HTTP giả mạo dạng "GET /api/jobs" chọc vô Endpoint của Java y như Postman, sau đó `andExpect(status().isOk())` để coi nó có ói ra mã 200 ko.

**166. Sự khác biệt giữa `@Mock` và `@Spy` trong Mockito?**
**Trả lời:** `@Mock` tạo ra bản nhái 100% của object, mọi hàm trong đó đều rỗng/trả ra null nếu chưa cài đặt. `@Spy` là wrap (nhái) từ 1 Object thật phần tử, gọi hàm nào nó gọi mã thực tế trừ phi mình Override riêng biệt 1 hàm nào đó của nó. 

**167. Code Coverage (Độ phủ mã nguồn) là gì? Tại sao phải quan tâm?**
**Trả lời:** Tỉ lệ % dòng code thực tế được các hàm Test quét qua (chạy thư viện JaCoCo sẽ đo được). VD coverage 80% có nghĩa 80% luồng if/else đã được test kỹ, 20% vẫn tiềm ẩn sập lỗi không mong chờ.

**168. Khi một Unit Test Pass trên máy Local nhưng rớt khi lên Github Action CI, bị sao?**
**Trả lời:** 90% lỗi do Cấu hình Môi trường (Environment). Có thể máy bạn xài JDK 17, còn trên máy Github Action xài JDK 11, hoặc máy CSDL của máy Github Action khác Timezones, ko thể load test Data chuẩn. 

**169. Nếu em test hàm nộp đơn ứng tuyển chứa hàm gửi Email `sendEmail()` bên trong, em có thật sự gửi email rác ra mạng ngoài không?**
**Trả lời:** Dạ không, lúc đó em móc (mock) hàm `MailSender` đó thành cái bóng im lặng kiểu `doNothing().when(mailSender).sendEmail(...)` để chặn gửi thư thực té gây thảm họa Spams. 

**170. Validation của @Valid ở DTO request có thể tự test ở Controller bằng Java được không?**
**Trả lời:** Có, trong MockMvc khi gọi hàm POST truyền chuỗi json thiếu trường, mình expect(status().isBadRequest()) là tự hiểu tầng Controller đã xả ra lỗi 400 Bad Request một cách tuyệt đối chính xác mượt mà. 

---

## XIII. Frontend Testing & API Testing (Câu 171 - 185)

**171. Em xài tool gì để test tay các API Backend khi vừa code xong?**
**Trả lời:** `Postman` hoặc giao diện được host mặc định của `Swagger UI` trỏ thẳng vô URL cục bộ localhost:8080.

**172. Tính năng "Thêm Authentication" bằng Bearer Token trong Postman hoạt động thế nào?**
**Trả lời:** Bấm login ra một chuỗi JWT. Vô tab Authorization của Collection Postman, chọn Bearer Token, dán vô đó để tự động ép vào HTTP AuthorizationHeader vô mọi Request tiếp theo để tránh Request mỏi tay.

**173. Test Frontend (ReactJS) khác với Backend ở khía cạnh nào lớn nhất?**
**Trả lời:** Khía cạnh UI (User Interface) và User Interaction (tương tác bấm/chạm). FE không chỉ mảng logic JS mà phải test xem nút Button có màu gì, có hiện đúng chữ "Login Successful" chưa thay vì check 2+2=4.

**174. Công cụ nào thường dùng để thiết lập quá trình Test cho Frontend React?**
**Trả lời:** Thư viện `Jest` kết hợp với `React Testing Library` (RTL) hoặc framework E2E mạnh mẽ Cypress. 

**175. React Testing Library test dựa trên cái gì?**
**Trả lời:** Dựa trên tư duy của người đối diện. Nghĩa là viết hàm test "nhìn vô màn hình tìm giùm tao chữ Submit và bấm vô đó", mảng logic bên trong State ẩn thế nào ko quan tâm. 

**176. Nếu em gõ username sai nhập password đúng, form nên hiện lỗi gì (Negative test case)?**
**Trả lời:** Giao UI hiện chữ "Thông tin đăng nhập không hợp lệ". Test case này kiểm chứng frontend bắt lỗi API 401 trả về báo status thất bại từ service Auth chuẩn chưa.

**177. Bắt buộc test chức năng tải File CV bằng gì cho chuẩn?**
**Trả lời:** Tạo một file giả File/Blob trong test code đút thẳng vào hàm `fireEvent.change()`. Thử nghiệm ném file dung lượng thật quá 5MB xem cái UI Alert toast nó có rớt xuống báo lỗi File quá to ko.

**178. E2E Testing (Kiểm thử chức năng nhúng End-to-End) có nghĩa là sao?**
**Trả lời:** Test giống y như 1 con người ngoài rạp. Máy tự mở trình duyệt Chrome -> điền http://localhost:3000 -> Nhấn Ghi danh -> Điền mail -> Đọc email DB -> Test một luồng mạch hoàn chỉnh cho đến khi thành công lưu thẳng vô MySQL thật.

**179. Nhược điểm chí tử của E2E Automation Testing so với Unit Test?**
**Trả lời:** Unit testing chạy mili-giây, còn E2E testing cực chậm (vì phải bung Browser, đợi animation CSS mượt chạy), và rất giòn (flaky) – đổi cái ID ở file HTML cái là tạch nguyên dãy test E2E.

**180. Khái niệm Mock Service Worker (MSW) trong việc test Frontend?**
**Trả lời:** Là chặn tầng kết nối mạng của FE khi test. Frontend gọi API nhưng thực ra là gọi cái trạm MSW ảo nó trả giả lập HTTP JSON data mà ko cần mở server BE thật lên cho phiền. 

**181. Nêu một Test Case cho quy trình tạo và thiết kế mẫu CV trên hệ thống Web?**
**Trả lời:** Step1: Vào page CV. Step2: Bấm "+ Kinh nghiệm làm việc". Step3: Nhập cty trống rỗng + bấm lưu. Expected result: Toast "Yêu cầu Tên công ty không để trống" không được phép chèn dòng vô Database.

**182. Cross-browser Testing nghĩa là gì trong nền móng FrontEnd Web?**
**Trả lời:** Đảm bảo Job Portal mở lên bằng Google Chrome, Firefox, Safari (Trên Macbook), Microsoft Edge đều load và cân đối layout CSS giống nhau, không bị vỡ bố cục Sidebar.

**183. Responsive Test làm như thế nào?**
**Trả lời:** Thay đổi độ rộng của Browser Chrome xuống mức < 768px (Điện thoại). Xem thanh menu có ẩn lại thành icon Hamburger kẹp không, danh sách Job view dọc grid có xuống hàng chuẩn tự động ôm layout không. 

**184. Snapshot Testing trong ReactJS có lợi ích gì?**
**Trả lời:** Jest sẽ chụp nội dung DOM file JobCard thành 1 file text đính kèm cứng. Tương lai anh dev nào vô mở lỡ tay tay xoá 1 thẻ `div`, Jest rống lên báo là Component đã bị biến dạng layout so với snapshot lưu 2 tháng trước.

**185. Xử lý UI Test liên quan đến Animation hoặc Delay (vd: Loading Skeleton) ra sao?**
**Trả lời:** Trong test dùng hàm bất đồng bộ `waitFor()` hoặc `findBy()` để code test đợi vài mili giây chờ màn loading trôi hết xong mới test coi có data load lên UI thật ko.

---

## XIV. Kiểm thử Hiệu Năng, Chịu Tải & Bảo Mật (Câu 186 - 200)

**186. Load Testing (Kiểm thử Chịu tải) cho Server Job Portal có tác dụng gì?**
**Trả lời:** Xác định giới hạn của Backend (VD: Tomcat chịu nổi 500 sinh viên truy cập vô chức năng Search tìm việc cùng lúc trong 1 giây không). Nếu sập phải kiếm cách Cache Redis hoặc Scale thêm server con.

**187. Tool nào hữu ích nhất để thực hiện Load Testing?**
**Trả lời:** `JMeter` của Apache hoặc Tool script đời mới `K6` hay `Locust`. Giả lập cả ngàn request HTTP ảo đâm thẳng mặt IP server đồ án từ mọi góc độ.

**188. Stress Test khác với Load Test chỗ nào?**
**Trả lời:** Load Test là test coi sức chịu tải tối đa đạt tới ngưỡng thông thường chưa. Stress Test là "nhồi máu cơ tim", bơm quá tải liên tục xem tới giây thứ bao nhiêu Server sập khói ngỏm DB, và khi sập nó có hồi sinh khôi phục an toàn (Recover) không.

**189. Định nghĩa bài toán Bottleneck khi thực hiện Đo Hiệu Năng hệ thống?**
**Trả lời:** Hiệu suất tổng hệ thống bị kìm hãm ở phân đoạn cùi bắp nhất. Backend Tomcat có thể cân 1,000 requests, Frontend siêu nhẹ, nhưng Database MySQL max connection chỉ set 50 -> DB sập thì toàn bộ Web sập theo dây chuyền (Bottleneck tại IO Database). 

**190. Kiểm thử bảo mật (Security Testing) hệ thống xác minh cơ chế SQL Injection ra sao?**
**Trả lời:** Vào ô search công việc, gõ thử chuỗi `' OR '1'='1`. Nếu nó Bypass qua filter truy vấn ra tất tần tật Database sinh viên ra ngoài có nghĩa sập tường lửa SQLi. Nếu nó báo "Không tìm thấy nội dung hợp lệ", nghĩa là JPA parameterized chống injection an toàn.

**191. Khắc phục tấn công DDoS băng thông có test được không?**
**Trả lời:** Đội nhỏ hiếm khi test vì phá hỏng kết nối Local. Trên Production, chặn IP rate limit, cài Cloudflare đứng trước cản traffic Bot rác trước khi chạm vô Hosting code đồ án. 

**192. Xác thực Penetration Testing (Pen Test) về chuẩn token JWT thế nào?**
**Trả lời:** Chạy script mở khóa header Payload. Thay đổi role từ `"role":"student"` thành `"role":"admin"`, băm thử mà không có Secret Key nó sẽ sai signature. Đâm cái token fake đó vô API xóa người dùng nếu BE trả 401 Unauthorized -> Đã pass Test chuẩn bảo mật! 

**193. Để test chức năng API 1 user update Data của user khác bằng cách đổi ID param. Em gọi phương pháp này là gì?**
**Trả lời:** Privilege Escalation / Broken Access Control testing. Ví dụ user A xài thẻ token A nhưng bắn PUT request báo `/api/students/id_cua_b/cv`. Nêu BE quên check tính đồng thuận token = id_cua_b nó sẽ bị hổng logic. 

**194. UX Testing có nằm trong phạm trù QA không hay ở Designer?**
**Trả lời:** Cả hai. Testing không chỉ có tìm lỗi (Bug) mà xem người dùng có xài dễ không. Nút Tạo Job quá bé kẹp trong mép trái khó bấm, Form CV ko tự save nháp. Đo trải nghiệm bằng cách bấm máy điện thoại thực tế (không phải fake bằng DevTools). 

**195. Ứng dụng "Monkey Testing" vào UI Job Portal là sao ta?**
**Trả lời:** Cài 1 tool trên máy cho nó click điên cuồng ngẫu nhiên, kéo xé bầm dập form tạo CV, chèn các ký tự emoij Trung Quốc ngoằn nghoèo ngẫu hứng. Xem nó có đánh gãy màn hình ko! Tên gọi bình dân là Test phá hoại. 

**196. Test Coverage của React và Test Coverage của Java khác biệt gì ko?**
**Trả lời:** Coverage của Java tính theo Lệnh/Branch logical (Bao nhiêu % file .java được chạy). Còn UI Coverage của React khó tin tuyệt đối vì có thể quét qua hàm `return {}` dòng render JSX là ăn % Coverage, chưa chắc nút đó bấm đã ăn vào chức năng xịn. 

**197. Có kỹ thuật Performance Test ở React FrontEnd giúp người dùng load nhanh hơn không?**
**Trả lời:** Dùng Google Lighthouse. Nó xổ ra score đánh giá Performance Web dựa trên thuật toán dồn Paint ảnh FCP hoặc LCP (Largest Contentful Paint) từ 1đ đến 100đ. Web nào trên 90đ thì cực trơn và load siêu nhanh. 

**198. API Pagination (phân trang) trên list job khi xài số âm /jobs?page=-1 nó sẽ gây ra phản ứng gì thì ĐẠT CHUẨN MỰC TỐT Test case?**
**Trả lời:** Nó phải trả về code `400 Bad Request` hoặc nó auto trả về Page Index mặc định = 0 do cơ chế fix đệm. Còn nếu nó throw cái `IllegalArgumentException` đỏ loét ra lỗi đơ màn 500 InternerServer Error thì FAIRED test! 

**199. QA Tester dùng Swagger đóng vai trò thế nào trong vòng đời Sprint dự án mình?**
**Trả lời:** Developer code gõ thêm các Annotation vào BE. Lật trang host tự động tạo file tài liệu giao tiếp OpenAPI Swagger UI. QA Tester đọc Swagger để hiểu định dạng gửi JSON đi mới thiết kế đc Test cases Postman đầy đủ field được mà ko cần phiền Dev giảng lại logic. Mảng tự động document đỉnh nhất. 

**200. Theo bạn nhận định, Job Portal/CV Builder có nên chi 30% quỹ thời gian để tự động hóa (Automation Test) không hay làm Manual?**
**Trả lời:** Tùy scale. Ở quy mô Đồ Án Tốt Nghiệp mỳ ăn liền, Manual Testing trên list Case Test tay lẹ nhất để xoay xở chạy báo cáo. Ở vòng chạy Product xịn (Doanh thu xịn), nếu cái CV Builder sửa 1 tí nó rêm toàn bộ màn hình, lúc đó Auto E2E Cypress + Jest là sống còn!
___
*Bộ câu hỏi này giúp sinh viên khẳng định với các thầy cô trong hội đồng rằng mình có tư duy làm Product thực thụ chứ không phải chỉ là Coder đục mã mù quáng.*
