SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO categories (name, slug, icon, description, status, created_at, updated_at) VALUES
('Công nghệ thông tin', 'it-software', 'computer', 'Phát triển phần mềm, mạng, bảo mật và giải pháp công nghệ.', 'ACTIVE', NOW(), NOW()),
('Kinh doanh / Marketing', 'business-marketing', 'trending_up', 'Quản trị kinh doanh, truyền thông và nghiên cứu thị trường.', 'ACTIVE', NOW(), NOW()),
('Tài chính / Ngân hàng', 'finance-accounting', 'account_balance', 'Dịch vụ tài chính, kế toán, kiểm toán và ngân hàng.', 'ACTIVE', NOW(), NOW()),
('Kỹ thuật / Công nghệ', 'engineering', 'engineering', 'Cơ khí, điện tử, sản xuất và quy trình kỹ thuật.', 'ACTIVE', NOW(), NOW()),
('Ngôn ngữ / Biên dịch', 'languages-translation', 'translate', 'Dịch thuật, giảng dạy ngôn ngữ và quan hệ quốc tế.', 'ACTIVE', NOW(), NOW()),
('Y tế / Dược phẩm', 'healthcare-medical', 'medical_services', 'Dịch vụ chăm sóc sức khỏe, y khoa và dược phẩm.', 'ACTIVE', NOW(), NOW()),
('Quản trị nhân sự', 'hr-administration', 'groups', 'Quản lý nguồn nhân lực, tuyển dụng và đào tạo.', 'ACTIVE', NOW(), NOW()),
('Du lịch / Khách sạn', 'tourism-hospitality', 'hotel', 'Dịch vụ lữ hành, quản lý nhà hàng và khách sạn.', 'ACTIVE', NOW(), NOW()),
('Thiết kế / Sáng tạo', 'design-creative', 'palette', 'Thiết kế đồ họa, thời trang, nội thất và nghệ thuật.', 'ACTIVE', NOW(), NOW()),
('Kiến trúc / Xây dựng', 'architecture-construction', 'construction', 'Quy hoạch kiến trúc, thi công và quản lý dự án xây dựng.', 'ACTIVE', NOW(), NOW());
