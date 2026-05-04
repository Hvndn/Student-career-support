package com.fivecore.jobportal.service.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class StorageService {

    private final String baseUploadDir = "uploads";
    private final List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "webp", "pdf", "doc", "docx", "gif", "bmp", "svg", "tiff", "jfif", "ico");
    private final List<String> allowedMimeTypes = Arrays.asList(
        "image/jpeg", "image/png", "image/webp", "application/pdf",
        "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/gif", "image/bmp", "image/svg+xml", "image/tiff", "image/x-icon"
    );

    /**
     * Lưu file an toàn theo các bước:
     * 1. Kiểm tra file trống.
     * 2. Kiểm tra MIME type thực tế.
     * 3. Kiểm tra Extension hợp lệ.
     * 4. Tạo tên file ngẫu nhiên (UUID), loại bỏ tên gốc.
     * 5. Lưu ngoài webroot (nếu được cấu hình).
     */
    public String saveFile(MultipartFile file, String subDir) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 1. Validate MIME type
        String contentType = file.getContentType();
        if (contentType == null || !allowedMimeTypes.contains(contentType.toLowerCase())) {
            throw new RuntimeException("Định dạng file không được hỗ trợ: " + contentType);
        }

        // 2. Validate Extension & Prepare Name
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i > 0) {
            extension = originalFilename.substring(i + 1).toLowerCase();
        }

        if (!allowedExtensions.contains(extension)) {
            throw new RuntimeException("Đuôi file không hợp lệ: " + extension);
        }

        try {
            // Tạo thư mục nếu chưa tồn tại
            Path root = Paths.get(baseUploadDir, subDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // 3. Tạo tên file DUY NHẤT (UUID), loại bỏ tên gốc để bảo mật
            String fileName = UUID.randomUUID().toString() + "." + extension;
            Path filePath = root.resolve(fileName);

            // Lưu file
            Files.copy(file.getInputStream(), filePath);

            log.info("Đã lưu file an toàn: {}/{}", subDir, fileName);

            // Trả về đường dẫn để truy cập qua web
            return "/" + baseUploadDir + "/" + subDir + "/" + fileName;
        } catch (IOException e) {
            log.error("Lỗi khi lưu file: {}", e.getMessage());
            throw new RuntimeException("Không thể lưu file", e);
        }
    }

    public String saveAvatar(MultipartFile file) {
        return saveFile(file, "avatars");
    }
}
