# UserSpace — Quản lý người dùng

Bài giữa kỳ môn Lập trình đa nền tảng: ứng dụng quản lý người dùng ở phân hệ admin, sử dụng React Native, Expo SDK 58, TypeScript và Firebase.

## Chức năng

- Đăng nhập, duy trì phiên và đăng xuất quản trị viên bằng Firebase Authentication.
- Thêm, hiển thị, sửa, xóa người dùng trong Cloud Firestore; danh sách cập nhật theo thời gian thực.
- Kiểm tra định dạng email, email trùng và mật khẩu tối thiểu 8 ký tự. Mật khẩu người dùng được băm bằng bcrypt trước khi lưu.
- Chọn ảnh từ thiết bị hoặc nhập URL, xem trước và hiển thị ảnh đại diện. Ảnh từ thiết bị được xử lý và lưu dạng base64.
- Giao diện thích ứng với web và điện thoại; script riêng xuất dữ liệu JSON phục vụ nộp bài.

## Cấu trúc dữ liệu

Collection `users` chỉ có bốn trường theo đề bài:

| Trường | Kiểu | Nội dung |
| --- | --- | --- |
| `email` | string | Địa chỉ email |
| `matkhau` | string | Mật khẩu đã băm |
| `hoten` | string | Họ và tên |
| `hinhanh` | string | Ảnh base64 hoặc URL |

Document ID do Firestore cấp, không được thêm làm trường trong document. Tài khoản admin đăng nhập được quản lý riêng trong Firebase Authentication; thêm bản ghi `users` không tự tạo tài khoản Authentication.

## Cài đặt và chạy

Yêu cầu Node.js **24.12 trở lên** để đáp ứng phiên bản Firebase trong dự án, npm và kết nối Internet.

```bash
git clone https://github.com/PhanHoang12/GK_DNT.git
cd GK_DNT
npm ci
npm run web
```

Trên Windows PowerShell, nếu `npm.ps1` bị chặn bởi Execution Policy, dùng `npm.cmd` thay cho `npm`, ví dụ `npm.cmd run web`.

Để chạy trên điện thoại, dùng Expo Go tương thích SDK 58 hoặc development build:

```bash
npm start
```

Mở ứng dụng qua mã QR hiển thị trong Terminal. Có thể dùng `npm run android` hoặc `npm run ios` với môi trường mô phỏng phù hợp.

## Firebase

Cấu hình kết nối nằm tại `src/config/firebase.ts`. Khi sử dụng project khác:

1. Đăng ký ứng dụng Web trong Firebase Console và thay cấu hình tương ứng.
2. Bật Authentication → Sign-in method → Email/Password.
3. Tạo tài khoản quản trị viên trong Authentication → Users.
4. Tạo Cloud Firestore và cấu hình Security Rules để tài khoản quản trị viên có quyền truy cập collection `users`.
5. Đăng nhập ứng dụng bằng tài khoản Authentication đã tạo.

Không đưa mật khẩu đăng nhập hoặc khóa riêng service account vào mã nguồn. Cấu hình Firebase client xác định project; quyền truy cập dữ liệu được kiểm soát bằng Firebase Security Rules.

## Xuất cơ sở dữ liệu để nộp bài

```bash
npm run export:db
```

Nhập tài khoản đăng nhập ứng dụng trực tiếp trong Terminal. Script chỉ đọc collection `users` từ máy chủ, tạo `database/users.json`, giữ nguyên ảnh, mật khẩu đã băm và Document ID. File đã tồn tại sẽ không bị ghi đè.

```bash
npm run export:db -- --output database/users-v2.json
```

File JSON thực tế được Git bỏ qua và cần đính kèm riêng khi nộp bài. Xem [hướng dẫn xuất dữ liệu và chụp ảnh cơ sở dữ liệu](database/README.md).

## Kiểm tra và đóng gói

```bash
npx tsc --noEmit
npm run lint
npx expo export --platform web
```

Bản web dùng `web.output: "single"` (SPA), dựng giao diện trong trình duyệt và làm việc với Firebase qua client SDK. Thư mục `dist` chứa bản web sau khi export; lệnh này không triển khai hosting. Có thể kiểm tra đóng gói JavaScript Android bằng `npx expo export --platform android`; lệnh đó không tạo APK.

Nếu Terminal giữ thông báo từ phiên chạy cũ, dừng Expo và chạy lại với cache mới:

```bash
npx expo start --web --clear
```

## Các thư mục chính

```text
src/app/                    Router và kiểm tra phiên đăng nhập
src/components/             Giao diện và xử lý quản lý người dùng
src/config/firebase.ts      Kết nối Firebase
scripts/export-database.mjs Script xuất dữ liệu JSON
database/README.md          Hướng dẫn nộp dữ liệu và ảnh minh họa
```

Các thư mục `node_modules`, `.expo`, `dist` và file dữ liệu xuất cục bộ không được đưa lên Git.
