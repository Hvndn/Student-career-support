package com.fivecore.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Cấu trúc phản hồi chuẩn cho toàn bộ hệ thống API.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String status;    // success, error
    private String message;   // Thông báo cho người dùng
    private T data;           // Dữ liệu trả về (Object hoặc List)
    private String errorCode; // Mã lỗi (nếu có)

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .status("success")
                .message(message)
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return ApiResponse.<T>builder()
                .status("error")
                .message(message)
                .errorCode(errorCode)
                .build();
    }

    public boolean isSuccess() {
        return "success".equals(status);
    }
}
