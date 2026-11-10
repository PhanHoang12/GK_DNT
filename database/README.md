# Xuất dữ liệu để nộp bài

Mở Terminal tại thư mục `admin-user-manager`, chạy:

```powershell
npm.cmd run export:db
```

Nhập email và mật khẩu **đăng nhập ứng dụng quản lý người dùng**. Đây là tài khoản trong Firebase Authentication, không phải tài khoản Google dùng để mở Firebase Console. Mật khẩu không hiển thị khi nhập và không được lưu vào file xuất.

Script dùng cấu hình tại `src/config/firebase.ts`, đăng nhập, đọc collection `users` trực tiếp từ máy chủ rồi tạo **`database/users.json`**. Không cài thêm thư viện, không cần service account, không thực hiện thêm/sửa/xóa trên Firebase.

Nếu file đã tồn tại, dùng tên khác:

```powershell
npm.cmd run export:db -- --output database/users-v2.json
```

File có cấu trúc `{ "users": { "DOCUMENT_ID": { ... } } }`. Mỗi bản ghi chỉ chứa bốn trường `email`, `matkhau`, `hoten`, `hinhanh`. Document ID được giữ làm khóa bên ngoài bản ghi, không thêm trường `id` vào cơ sở dữ liệu. `matkhau` giữ nguyên bản băm; `hinhanh` giữ nguyên toàn bộ chuỗi base64 hoặc URL.

Đây là bản trích xuất JSON của collection phục vụ nộp bài, không phải định dạng backup của dịch vụ managed export và không bao gồm tài khoản Firebase Authentication, Firestore Rules hay subcollection.

## Ảnh minh họa cơ sở dữ liệu

1. Vào Firebase Console → Cloud Firestore → Data.
2. Mở collection `users`, chọn một document để thấy đủ bốn tên trường, như ảnh bạn đang có.
3. Chụp cả tên dự án, danh sách document và các trường dữ liệu, chèn vào báo cáo với chú thích: **Cấu trúc và dữ liệu collection users trên Cloud Firestore**.
4. Chụp thêm một document khác nếu cần minh họa nhiều người dùng. Chuỗi ảnh base64 dài có thể bị rút gọn trên ảnh chụp; file JSON vẫn phải giữ nguyên đầy đủ.

Nộp file JSON thực tế sau khi chạy script cùng báo cáo có ảnh minh họa. File JSON chứa dữ liệu người dùng nên được bỏ qua khi commit Git; nó vẫn nằm trên máy để đính kèm bài nộp.
