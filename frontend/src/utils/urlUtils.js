/**
 * Tiện ích xử lý URL để hiển thị hình ảnh từ Backend.
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    
    // Nếu là ảnh base64 (khi vừa chọn file từ máy) thì giữ nguyên
    if (path.startsWith('data:')) {
        return path;
    }
    
    // Nếu đường dẫn bắt đầu bằng /uploads, thêm URL của Backend (port 8080)
    if (path.startsWith('/uploads')) {
        return `http://localhost:8080${path}`;
    }
    
    // Các trường hợp khác (ví dụ: URL tuyệt đối bên ngoài)
    return path;
};
