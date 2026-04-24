# TÀI LIỆU HỎI ĐÁP CHI TIẾT (DEEP Q&A) - ROLE SINH VIÊN

Tài liệu này tập trung vào vị trí code thực tế và tác động của chúng đến cơ sở dữ liệu.

---

## PHẦN 1: THỰC THỂ & CƠ SỞ DỮ LIỆU (DATABASE & ENTITY)

**1. Q: Thông tin chính của sinh viên được lưu ở bảng nào trong CSDL?**
*A: Bảng `students` (Định nghĩa tại file `Student.java`, dòng 13).*

**2. Q: Bảng `students` liên kết với bảng `users` qua trường nào?**
*A: Trường `user_id` (Dòng 25 trong `Student.java`). Đây là mối quan hệ `@OneToOne`.*

**3. Q: Trường nào dùng để lưu trữ dữ liệu JSON của CV Builder?**
*A: Trường `cv_data` (Dòng 76-77 trong `Student.java`). Kiểu dữ liệu là `LONGTEXT`.*

**4. Q: Danh sách các dự án cá nhân được lưu ở bảng nào và liên kết thế nào?**
*A: Bảng `projects`. Liên kết với `students` qua trường `student_id` (Mối quan hệ `@OneToMany`, dòng 87-89 trong `Student.java`).*

**5. Q: Khi xóa một sinh viên, các dữ liệu liên quan như học vấn, dự án có bị xóa không?**
*A: Có. Do sử dụng `cascade = CascadeType.ALL` tại các dòng 79, 83, 87, 91 trong `Student.java`.*

**6. Q: Trường `resume_url` dùng để làm gì?**
*A: Lưu đường dẫn file PDF mà sinh viên tự đính kèm lên server (Dòng 53-54 trong `Student.java`).*

**7. Q: Bảng `applications` lưu thông tin gì và liên quan đến sinh viên ra sao?**
*A: Lưu thông tin ứng tuyển việc làm. Liên kết với `students` tại dòng 91-92 của `Student.java`.*

**8. Q: Tại sao trường `bio` lại dùng `columnDefinition = "TEXT"`?**
*A: (Dòng 41, `Student.java`). Để cho phép lưu trữ đoạn giới thiệu bản thân dài hơn 255 ký tự.*

---

## PHẦN 2: CONTROLLER & API (VỊ TRÍ CODE)

**9. Q: API lấy thông tin hồ sơ sinh viên nằm ở đâu?**
*A: File `StudentProfileRestController.java`, phương thức `getProfile` (Dòng 44-53).*

**10. Q: API nào thực hiện việc đính kèm file CV PDF?**
*A: Phương thức `updateResume` tại dòng 162-179 trong file `StudentProfileRestController.java`.*

**11. Q: API thêm mới một dự án (Project) nằm ở dòng nào?**
*A: Dòng 242-247, phương thức `addProject` trong `StudentProfileRestController.java`.*

**12. Q: Phương thức nào dùng để lấy ID của sinh viên hiện tại từ token?**
*A: Phương thức `getCurrentStudentId` (Dòng 38-42) trong `StudentProfileRestController.java`.*

**13. Q: API xóa một kỹ năng nằm ở dòng nào?**
*A: Dòng 234-239, phương thức `deleteSkill` trong `StudentProfileRestController.java`.*

**14. Q: API xuất hồ sơ ra file PDF là gì?**
*A: `@GetMapping("/export-pdf")` tại dòng 182-188 trong `StudentProfileRestController.java`.*

**15. Q: API cập nhật ảnh đại diện (Avatar) tác động đến bảng nào?**
*A: Phương thức `updateAvatar` (Dòng 124-141). Tác động thay đổi trường `avatar_url` trong bảng `students`.*

---

## PHẦN 3: LOGIC XỬ LÝ (SERVICE LAYER)

**16. Q: Logic dọn dẹp thẻ HTML trước khi xuất PDF nằm ở file nào?**
*A: File `PdfExportService.java`, sử dụng `replaceAll` để xóa thẻ HTML tại dòng 64-69.*

**17. Q: Logic cập nhật URL CV vào database nằm ở đâu?**
*A: File `ProfileService.java`, phương thức `updateResumeUrl` (Dòng 92-95).*

**18. Q: Làm thế nào để thêm kỹ năng vào chuỗi JSON `cv_data`?**
*A: Phương thức `addSkill` trong `ProfileService.java` (Sử dụng ObjectMapper để parse và update JSON).*

**19. Q: Phương thức xóa một dự án trong Service nằm ở dòng nào?**
*A: File `ProfileService.java`, phương thức `deleteProject` (Dòng 88-91).*

**20. Q: `StorageService` lưu file vào thư mục nào trên server?**
*A: Thư mục `uploads/` (Được cấu hình thông qua `rootLocation` trong `StorageService.java`).*

---

## PHẦN 4: FRONTEND & GIAO DIỆN (REACT)

**21. Q: Hàm xử lý việc upload file CV trong React nằm ở đâu?**
*A: File `Profile.jsx`, hàm `handleResumeUpload` (Dòng 100-118).*

**22. Q: Component nào hiển thị toàn bộ hồ sơ sinh viên?**
*A: File `Profile.jsx` (Component chính `StudentProfile`).*

**23. Q: Logic hiển thị số lượng CV (BẢN CV) ở stat box nằm ở dòng nào?**
*A: Dòng 255-258 trong `Profile.jsx`. Kiểm tra `(profile.cvData || profile.resumeUrl)`.*

**24. Q: Nút "Xem CV" mở file PDF bằng cách nào?**
*A: Sử dụng thẻ `<a>` với `getImageUrl(profile.resumeUrl)` tại dòng 381 trong `Profile.jsx`.*

**25. Q: Làm thế nào để chuyển đổi giữa CV hệ thống và file đính kèm trên giao diện?**
*A: Code tại dòng 371-397 trong `Profile.jsx` chia làm 2 khối riêng biệt cho Online CV và Attached File.*

**26. Q: API call để xóa kỹ năng ở Frontend nằm ở file nào?**
*A: File `api.js`, hàm `deleteSkill` (Thực hiện request `DELETE /student/profile/skills/{name}`).*

---

## PHẦN 5: TÁC ĐỘNG CSDL (DATABASE IMPACT)

**27. Q: Khi sinh viên nhấn "Thêm học vấn", bảng nào bị ảnh hưởng?**
*A: Thêm 1 bản ghi mới vào bảng `educations` có `student_id` tương ứng.*

**28. Q: Khi sinh viên đổi ảnh đại diện, những gì thay đổi trong DB?**
*A: Trường `avatar_url` trong bảng `students` được cập nhật giá trị mới.*

**29. Q: Việc xóa một dự án ảnh hưởng đến bảng nào?**
*A: Xóa bản ghi có ID tương ứng trong bảng `projects`.*

**30. Q: Khi tạo CV trực tuyến, dữ liệu lưu vào đâu?**
*A: Toàn bộ cấu trúc được đóng gói thành JSON và lưu vào trường `cv_data` của bảng `students` (Dòng 76-77, `Student.java`).*

---

## PHẦN 6: ĐƠN ỨNG TUYỂN (APPLICATIONS)

**31. Q: Thực thể `Application` đại diện cho bảng nào trong CSDL?**
*A: Bảng `applications` (Định nghĩa tại `Application.java`, dòng 14).*

**32. Q: Làm thế nào để biết một đơn ứng tuyển thuộc về sinh viên nào?**
*A: Thông qua trường `student_id` (Dòng 26, `Application.java`). Đây là khóa ngoại liên kết tới bảng `students`.*

**33. Q: Trạng thái mặc định của một đơn ứng tuyển mới là gì và định nghĩa ở đâu?**
*A: Trạng thái `pending`. Được định nghĩa tại dòng 38 trong `Application.java`.*

**34. Q: Các trạng thái có thể có của một đơn ứng tuyển (Enum) nằm ở dòng nào?**
*A: Dòng 63-65 trong `Application.java` (gồm: pending, review, suitable, interview, accepted, rejected).*

**35. Q: Khi ứng tuyển, sinh viên có thể gửi kèm thư ngỏ không? Lưu ở đâu?**
*A: Có. Lưu ở trường `coverLetter` (Kiểu `TEXT`, dòng 41 trong `Application.java`).*

**36. Q: API lấy danh sách các công việc sinh viên đã ứng tuyển nằm ở đâu?**
*A: (Tùy thuộc vào controller), thường nằm ở `JobApplicationRestController.java`. Tác động truy vấn bảng `applications` lọc theo `student_id`.*

**37. Q: Trường `applied_at` trong bảng `applications` được tự động sinh ra như thế nào?**
*A: Sử dụng annotation `@CreationTimestamp` tại dòng 46 trong `Application.java`.*

**38. Q: Một đơn ứng tuyển liên kết với công việc nào qua trường gì?**
*A: Trường `job_id` (Dòng 31, `Application.java`), liên kết tới bảng `jobs`.*

**39. Q: Nếu sinh viên xóa tài khoản, các đơn ứng tuyển có bị xóa không?**
*A: Có. Do cấu hình `orphanRemoval = true` tại dòng 91-92 trong `Student.java`.*

**40. Q: Làm sao để lưu lại file CV riêng cho mỗi lần ứng tuyển?**
*A: Sử dụng trường `cv_url` tại dòng 43-44 trong `Application.java`.*

---

## PHẦN 7: VIỆC LÀM ĐÃ LƯU (SAVED JOBS)

**41. Q: Tính năng "Lưu việc làm" tác động đến bảng nào?**
*A: Bảng `saved_jobs` (Định nghĩa tại `SavedJob.java`).*

**42. Q: Bảng `saved_jobs` có những trường quan trọng nào?**
*A: `id`, `student_id`, `job_id` và `saved_at`.*

**43. Q: Quan hệ giữa Sinh viên và Việc làm đã lưu được định nghĩa ở đâu trong code?**
*A: File `Student.java`, dòng 99-101 (Mối quan hệ `@OneToMany` với `SavedJob`).*

**44. Q: Làm thế nào để kiểm tra một công việc đã được sinh viên lưu hay chưa?**
*A: Backend thực hiện truy vấn `SELECT COUNT(*)` từ bảng `saved_jobs` với cặp điều kiện `student_id` và `job_id`.*

**45. Q: Khi sinh viên nhấn "Bỏ lưu", lệnh SQL nào được thực thi?**
*A: `DELETE FROM saved_jobs WHERE student_id = ? AND job_id = ?`.*

---

## PHẦN 8: CHỨNG CHỈ & KINH NGHIỆM (CERTIFICATIONS & EXPERIENCE)

**46. Q: Thông tin chứng chỉ của sinh viên được lưu ở đâu?**
*A: Bảng `certifications` (Định nghĩa tại `Certification.java`).*

**47. Q: API thêm chứng chỉ nằm ở dòng code nào?**
*A: File `StudentProfileRestController.java`, dòng 191-202 (Phương thức `addCertification`).*

**48. Q: Trường `certificate_url` dùng để làm gì?**
*A: Lưu đường dẫn tới ảnh hoặc file scan của chứng chỉ (Dòng 199, `StudentProfileRestController.java`).*

**49. Q: Kinh nghiệm làm việc liên kết với Sinh viên như thế nào?**
*A: Qua bảng `experiences`, trường `student_id` (Định nghĩa tại `Student.java`, dòng 83-85).*

**50. Q: Khi cập nhật một chứng chỉ, code Service nào được gọi?**
*A: `certificationService.updateCertification` (Được gọi từ dòng 207 của `StudentProfileRestController.java`).*

---

## PHẦN 9: BẢO MẬT & PHÂN QUYỀN (SECURITY)

**51. Q: Làm thế nào để đảm bảo chỉ có Role Sinh viên mới gọi được các API này?**
*A: Cấu hình trong `SecurityConfig.java` sử dụng `.requestMatchers("/api/student/**").hasRole("STUDENT")`.*

**52. Q: Token JWT của sinh viên chứa thông tin gì để Backend nhận diện?**
*A: Chứa `email` (subject) và `authorities` (vai trò). Backend dùng email này để tìm `userId` và từ đó suy ra `studentId`.*

**53. Q: Code lấy email từ SecurityContext nằm ở đâu?**
*A: `authentication.getName()` (Dòng 39 trong `StudentProfileRestController.java`).*

**54. Q: Nếu một công ty cố tình gọi API cập nhật hồ sơ sinh viên thì sao?**
*A: Hệ thống sẽ trả về lỗi `403 Forbidden` do Spring Security chặn lại từ tầng Filter.*

**55. Q: Mật khẩu của sinh viên được lưu dưới dạng gì trong bảng `users`?**
*A: Được mã hóa bằng `BCryptPasswordEncoder` trước khi lưu (Không bao giờ lưu text thuần).*

---

## PHẦN 10: HỆ THỐNG & CẤU HÌNH (SYSTEM)

**56. Q: Cấu hình database (URL, Username, Password) nằm ở file nào?**
*A: File `application.properties` (Dòng 7-9).*

**57. Q: Thư mục chứa file upload được cấu hình ở đâu để có thể truy cập qua URL?**
*A: File `WebConfig.java` (Sử dụng `addResourceHandlers`).*

**58. Q: Dependency nào hỗ trợ việc tự động tạo Getter/Setter?**
*A: Thư viện **Lombok** (Sử dụng các annotation như `@Data` tại dòng 14, `Student.java`).*

**59. Q: Làm thế nào để Backend trả về định dạng JSON chuẩn cho Frontend?**
*A: Sử dụng lớp `ApiResponse<T>` (Dòng 45, 56 trong `StudentProfileRestController.java`) để bao bọc dữ liệu.*

**60. Q: CORS được cấu hình ở đâu để Frontend React có thể gọi API Backend?**
*A: File `WebConfig.java` hoặc `SecurityConfig.java` sử dụng `.cors()`.*

---

## PHẦN 11: CHI TIẾT HỌC VẤN (EDUCATION DETAILS)

**61. Q: Thực thể `Education` đại diện cho bảng nào trong CSDL?**
*A: Bảng `educations` (Định nghĩa tại `Education.java`).*

**62. Q: Làm sao để ràng buộc một bản ghi học vấn phải thuộc về một sinh viên?**
*A: Sử dụng `@JoinColumn(name = "student_id", nullable = false)` tại lớp `Education`.*

**63. Q: Các trường dữ liệu về thời gian trong Học vấn được lưu dưới kiểu dữ liệu nào?**
*A: Kiểu `LocalDate` (Dòng 59-60, `StudentProfileResponse.java`).*

**64. Q: API cập nhật học vấn sử dụng phương thức HTTP nào?**
*A: Phương thức `PUT` tại dòng 97 trong `StudentProfileRestController.java`.*

**65. Q: Khi xóa một học vấn, code gọi đến phương thức nào trong Service?**
*A: `profileService.deleteEducation(id, studentId)` (Dòng 115, `StudentProfileRestController.java`).*

---

## PHẦN 12: CHỨNG CHỈ (CERTIFICATIONS)

**66. Q: Bảng `certifications` liên kết với sinh viên qua trường nào?**
*A: Trường `student_id` (Định nghĩa trong thực thể `Certification`).*

**67. Q: Trường `issuer` trong chứng chỉ dùng để lưu gì?**
*A: Lưu tên tổ chức cấp chứng chỉ (Dòng 196, `StudentProfileRestController.java`).*

**68. Q: Chứng chỉ có ngày hết hạn không? Lưu ở trường nào?**
*A: Có. Lưu ở trường `expirationDate` (Dòng 198, `StudentProfileRestController.java`).*

**69. Q: API thêm chứng chỉ nhận dữ liệu từ Client qua đối tượng nào?**
*A: Đối tượng `CertificationRequest` (Dòng 192, `StudentProfileRestController.java`).*

**70. Q: Thao tác xóa chứng chỉ tác động đến bản ghi nào trong DB?**
*A: Xóa bản ghi có ID tương ứng trong bảng `certifications` (Dòng 220, `StudentProfileRestController.java`).*

---

## PHẦN 13: DỰ ÁN CHI TIẾT (PROJECT DETAILS)

**71. Q: Dự án cá nhân có trường `technologies`, nó lưu dữ liệu gì?**
*A: Lưu danh sách các công nghệ/ngôn ngữ/công cụ sử dụng trong dự án dưới dạng chuỗi văn bản.*

**72. Q: Tại sao trong dự án lại có thêm trường `responsibilities`?**
*A: Để sinh viên mô tả chi tiết các nhiệm vụ cụ thể mà họ đã thực hiện trong dự án đó.*

**73. Q: API xóa dự án sử dụng tham số gì từ URL?**
*A: Tham số `{id}` (Dòng 249, `StudentProfileRestController.java`).*

**74. Q: Việc thêm dự án mới ảnh hưởng đến bảng nào?**
*A: Thêm 1 dòng dữ liệu vào bảng `projects`.*

**75. Q: Làm thế nào để đảm bảo sinh viên chỉ xóa được dự án của mình?**
*A: Backend kiểm tra `studentId` từ Token có khớp với `student_id` của bản ghi dự án hay không trước khi xóa.*

---

## PHẦN 14: MAPPER & DTO (DỮ LIỆU TRUNG GIAN)

**76. Q: Lớp `StudentProfileMapper` sử dụng thư viện nào để tự động hóa?**
*A: Thường sử dụng MapStruct hoặc viết thủ công bằng code Java để chuyển đổi đối tượng.*

**77. Q: `StudentProfileResponse` chứa thông tin từ những bảng nào?**
*A: Tổng hợp dữ liệu từ bảng `users`, `students`, `educations`, `projects`, `certifications`.*

**78. Q: Tại sao không gửi trực tiếp thực thể `Student` về Frontend?**
*A: Để tránh lộ thông tin nhạy cảm, tránh lỗi vòng lặp JSON (Circular Reference) và giảm kích thước dữ liệu truyền tải.*

**79. Q: Trường `cvData` trong DTO được lấy từ đâu?**
*A: Lấy từ trường `cv_data` trong thực thể `Student` (Dòng 39, `StudentProfileResponse.java`).*

**80. Q: `EducationDto` (lớp con trong `StudentProfileResponse`) dùng để làm gì?**
*A: Định nghĩa cấu trúc dữ liệu học vấn rút gọn để hiển thị trên giao diện Profile.*

---

## PHẦN 15: VALIDATION (KIỂM TRA DỮ LIỆU)

**81. Q: Annotation `@Valid` tại dòng 74 của `StudentProfileRestController.java` có tác dụng gì?**
*A: Kích hoạt việc kiểm tra các ràng buộc dữ liệu (như `@NotBlank`, `@NotNull`) đã định nghĩa trong `EducationRequest`.*

**82. Q: Nếu dữ liệu gửi lên không hợp lệ, hệ thống trả về mã lỗi gì?**
*A: Trả về mã lỗi `400 Bad Request`.*

**83. Q: `@RequestBody` dùng để làm gì trong các API cập nhật?**
*A: Để Spring tự động chuyển đổi thân của yêu cầu HTTP (JSON) thành đối tượng Java tương ứng.*

**84. Q: Làm sao để kiểm tra file upload không được để trống?**
*A: Sử dụng câu lệnh `if (file == null || file.isEmpty())` (Dòng 167, `StudentProfileRestController.java`).*

**85. Q: Lỗi "Vui lòng chọn file CV" được trả về khi nào?**
*A: Khi người dùng nhấn upload mà chưa chọn file hoặc file có kích thước bằng 0 (Dòng 168).*

---

## PHẦN 16: FRONTEND STATE & LOGIC

**86. Q: State `profile` trong `Profile.jsx` ban đầu có giá trị là gì?**
*A: Giá trị ban đầu là `null` (Dòng 52, `Profile.jsx`).*

**87. Q: Khi nào hàm `fetchProfile` được gọi?**
*A: Được gọi trong `useEffect` ngay sau khi component `Profile` được hiển thị lần đầu tiên.*

**88. Q: Biến `isUploading` giúp ích gì cho trải nghiệm người dùng?**
*A: Giúp vô hiệu hóa nút bấm (disabled) và hiển thị thông báo "Đang tải lên..." để tránh người dùng nhấn nhiều lần.*

**89. Q: Làm thế nào để mở modal thêm học vấn?**
*A: Set state `setShowEducationForm(true)` khi người dùng nhấn nút "+ Thêm".*

**90. Q: Hàm `handleResumeUpload` thực hiện gọi API nào?**
*A: Gọi hàm `uploadResume(formData)` được định nghĩa trong `api.js`.*

---

## PHẦN 17: PHÂN QUYỀN TRUY CẬP (ACCESS CONTROL)

**91. Q: Tại sao Controller `StudentProfileRestController` lại dùng `@RequestMapping("/api/student/profile")`?**
*A: Để gom nhóm tất cả các API liên quan đến hồ sơ sinh viên vào một đường dẫn chung dễ quản lý và phân quyền.*

**92. Q: Một sinh viên có thể xem hồ sơ của sinh viên khác qua API này không?**
*A: Không. Vì API luôn lấy `studentId` từ Token của người đang đăng nhập (Dòng 38-42).*

**93. Q: Vai trò `ROLE_STUDENT` được kiểm tra ở đâu?**
*A: Được Spring Security kiểm tra tại tầng Filter dựa trên cấu hình trong `SecurityConfig`.*

**94. Q: Chuyện gì xảy ra nếu Token hết hạn khi đang gọi API?**
*A: Hệ thống trả về lỗi `401 Unauthorized`, Frontend sẽ xóa Token và đẩy người dùng về trang Login.*

**95. Q: JWT được lưu ở đâu phía Client?**
*A: Thường được lưu trong `localStorage` hoặc `sessionStorage` (Dòng 17, `StudentHeader.jsx`).*

---

## PHẦN 18: TỔNG KẾT MODULE SINH VIÊN

**96. Q: Sinh viên có mấy cách để cung cấp hồ sơ năng lực cho nhà tuyển dụng?**
*A: 2 cách: Tự thiết kế Online qua CV Builder hoặc đính kèm file PDF có sẵn.*

**97. Q: Dữ liệu "Kỹ năng chuyên môn" được hiển thị từ đâu?**
*A: Từ mảng `skills` trong `StudentProfileResponse` (Lấy dữ liệu từ trường JSON `cv_data`).*

**98. Q: Chức năng "Video giới thiệu" tác động đến bảng nào?**
*A: Cập nhật trường `video_url` trong bảng `students`.*

**99. Q: Tổng hợp lại, một `StudentProfileResponse` đầy đủ bao gồm bao nhiêu phần chính?**
*A: Gồm 6 phần: Thông tin cơ bản, Học vấn, Chứng chỉ, Kỹ năng, Dự án và Các liên kết mạng xã hội.*

**100. Q: Mã nguồn Backend của tính năng này chủ yếu nằm ở package nào?**
*A: Package `com.fivecore.jobportal.controller.api.student` và `com.fivecore.jobportal.service.auth`.*
