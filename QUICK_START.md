# HƯỚNG DẪN KHỞI ĐỘNG NHANH

## Lỗi "JAVA_HOME not found" - Giải pháp Nhanh

Nếu bạn gặp lỗi "JAVA_HOME not found" khi chạy backend, hãy sử dụng một trong các cách sau:

### Cách 1: Sử dụng script với tự động phát hiện Java

```
cd BE
.\run-spring.cmd    (hoặc .\run-spring.ps1 trong PowerShell)
```

Script này sẽ tự động tìm cài đặt Java trên máy của bạn và thiết lập JAVA_HOME tạm thời.

### Cách 2: Khởi động toàn bộ ứng dụng

```
.\run-app.bat
```

Script này sẽ khởi động cả backend và frontend, bao gồm tự động phát hiện Java.

## Hướng Dẫn Chi Tiết

Để biết thêm chi tiết về:
- Cài đặt Java: Xem `JAVA_SETUP.md`
- Khắc phục lỗi mạng: Xem `NETWORK_ERROR_GUIDE.md`

## Kiểm tra kết nối

Sau khi khởi động, truy cập trang debug mạng tại:
http://localhost:3000/network-debug

Trang này sẽ giúp kiểm tra kết nối giữa frontend, backend và cơ sở dữ liệu.
