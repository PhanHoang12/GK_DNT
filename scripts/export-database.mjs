import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { deleteApp, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocsFromServer, getFirestore, terminate } from 'firebase/firestore';

const fields = ['email', 'matkhau', 'hoten', 'hinhanh'];

async function askCredentials() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Hãy chạy lệnh trực tiếp trong Terminal để nhập tài khoản và mật khẩu.');
  }
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });
  const reader = createInterface({ input: process.stdin, output, terminal: true });
  reader.on('SIGINT', () => { reader.close(); process.exit(130); });
  try {
    const email = (await reader.question('Email đăng nhập ứng dụng: ')).trim();
    process.stdout.write('Mật khẩu (không hiển thị khi nhập): ');
    muted = true;
    const password = await reader.question('');
    if (!email || !password) throw new Error('Cần nhập đủ email và mật khẩu.');
    return { email, password };
  } finally {
    muted = false;
    process.stdout.write('\n');
    reader.close();
  }
}

async function main() {
  const { values } = parseArgs({ options: {
    output: { type: 'string', short: 'o' },
    help: { type: 'boolean', short: 'h' },
  } });
  if (values.help) {
    console.log('Xuất collection users từ Firestore thành JSON, chỉ đọc dữ liệu.\n\n' +
      '  npm run export:db\n' +
      '  npm run export:db -- --output database/users-v2.json\n\n' +
      'Mặc định: database/users.json. File đã có sẽ không bị ghi đè.\n' +
      'Đăng nhập bằng tài khoản dùng trên ứng dụng, không phải tài khoản Google Console.');
    return;
  }

  const outputPath = values.output ? resolve(values.output) : fileURLToPath(new URL('../database/users.json', import.meta.url));
  try {
    await access(outputPath);
    throw new Error('File đã tồn tại. Dùng --output để chọn tên khác, ví dụ database/users-v2.json.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  // Đọc các giá trị cấu hình công khai từ dự án, không cần service account.
  const source = await readFile(new URL('../src/config/firebase.ts', import.meta.url), 'utf8');
  const config = Object.fromEntries(['apiKey', 'projectId', 'authDomain'].map(key => {
    const value = source.match(new RegExp(`\\b${key}\\s*:\\s*["']([^"']+)["']`))?.[1];
    if (!value) throw new Error(`Không tìm thấy ${key} trong src/config/firebase.ts.`);
    return [key, value];
  }));

  console.log(`Dự án: ${config.projectId} | Collection: users`);
  const credentials = await askCredentials();
  const app = initializeApp(config, 'database-export');
  const db = getFirestore(app);
  try {
    await signInWithEmailAndPassword(getAuth(app), credentials.email, credentials.password);
    credentials.password = '';
    console.log('Đang đọc dữ liệu từ Firestore…');
    const snapshot = await getDocsFromServer(collection(db, 'users'));
    const users = Object.fromEntries(snapshot.docs.map(document => {
      const data = document.data();
      if (Object.keys(data).length !== fields.length || fields.some(key => typeof data[key] !== 'string')) {
        throw new Error(`Document ${document.id} không đúng bốn trường chuỗi của đề bài. Chưa xuất file.`);
      }
      // ID là khóa của bản ghi, không thêm trường id vào thông tin người dùng.
      return [document.id, Object.fromEntries(fields.map(key => [key, data[key]]))];
    }));
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, JSON.stringify({ users }, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
    console.log(`Đã xuất ${snapshot.size} người dùng: ${outputPath}`);
    console.log('Giữ nguyên ảnh base64/URL và mật khẩu đã băm. Không thay đổi dữ liệu trên Firebase.');
  } finally {
    credentials.password = '';
    await terminate(db);
    await deleteApp(app);
  }
}

main().catch(error => {
  const messages = {
    'auth/invalid-credential': 'Email hoặc mật khẩu đăng nhập ứng dụng không chính xác.',
    'auth/invalid-email': 'Email không hợp lệ.',
    'auth/too-many-requests': 'Đăng nhập quá nhiều lần. Hãy thử lại sau.',
    'auth/network-request-failed': 'Không thể kết nối Firebase. Kiểm tra mạng.',
    'permission-denied': 'Tài khoản không được phép đọc users theo Firestore Rules. Không cần mở quyền công khai.',
    EEXIST: 'File đã tồn tại. Hãy dùng --output để chọn tên khác.',
  };
  console.error(`Không xuất được: ${messages[error.code] ?? error.message}`);
  process.exitCode = 1;
});
