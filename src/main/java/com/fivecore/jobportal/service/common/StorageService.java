package com.fivecore.jobportal.service.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class StorageService {

    private final String baseUploadDir = "uploads";

    public String saveFile(MultipartFile file, String subDir) {
        if (file.isEmpty()) {
            return null;
        }

        try {
            // Tạo thư mục nếu chưa tồn tại
            Path root = Paths.get(baseUploadDir, subDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
            }

            // Tạo tên file duy nhất
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = root.resolve(fileName);

            // Lưu file
            Files.copy(file.getInputStream(), filePath);

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
