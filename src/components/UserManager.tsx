
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { Alert, Platform } from "react-native";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import * as bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";
import { db } from "../config/firebase";

import UserManagerPanel from "./user-manager-panel";

export type NguoiDung = {
  id: string;
  email: string;
  matkhau: string;
  hoten: string;
  hinhanh: string;
};

// Nguồn dữ liệu ngẫu nhiên cho bcrypt trên Expo Go
bcrypt.setRandomFallback((length) =>
  Array.from(Crypto.getRandomBytes(length))
);

export default function UserManager({ onEditStart }: { onEditStart?: () => void }) {
  const [email, setEmail] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [hoten, setHoten] = useState("");
  const [hinhanh, setHinhanh] = useState("");

  const [users, setUsers] = useState<NguoiDung[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Đọc danh sách từ Firebase theo thời gian thực
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NguoiDung, "id">),
        }));

        setUsers(data);
        setError("");
      },
      (err) => {
        console.log("Firestore error:", err.code);
        setError(`Không thể đọc dữ liệu: ${err.code}`);
      }
    );

    return unsubscribe;
  }, []);

const handleEdit = (item: NguoiDung) => {
  setEditingId(item.id);

  setEmail(item.email);
  setHoten(item.hoten);
  setHinhanh(item.hinhanh);

  // Không đưa mật khẩu đã băm vào ô nhập
  setMatkhau("");

  setMessage("");
  setError("");
};

const handleUpdate = async () => {
  if (!editingId) return;

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !hoten.trim()) {
    setError("Vui lòng nhập email và họ tên.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setError("Email không đúng định dạng.");
    return;
  }

  if (
    users.some(
      (u) => u.email === cleanEmail && u.id !== editingId
    )
  ) {
    setError("Email này đã tồn tại.");
    return;
  }

  if (matkhau && matkhau.length < 8) {
    setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const updatedData: {
      email: string;
      hoten: string;
      hinhanh: string;
      matkhau?: string;
    } = {
      email: cleanEmail,
      hoten: hoten.trim(),
      hinhanh: hinhanh.trim(),
    };

    if (matkhau) {
      updatedData.matkhau = await bcrypt.hash(matkhau, 10);
    }

    await updateDoc(doc(db, "users", editingId), updatedData);

    setEditingId(null);
    setEmail("");
    setMatkhau("");
    setHoten("");
    setHinhanh("");

    setMessage("Cập nhật người dùng thành công!");
  } catch (err: any) {
    setError(`Lỗi cập nhật: ${err.code ?? err.message}`);
  } finally {
    setLoading(false);
  }
};

const handleCancelEdit = () => {
  setEditingId(null);
  setEmail("");
  setMatkhau("");
  setHoten("");
  setHinhanh("");
  setError("");
  setMessage("");
};

const handleDelete = (item: NguoiDung) => {
  const deleteUser = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await deleteDoc(doc(db, "users", item.id));

      // Nếu đang chỉnh sửa người vừa xóa thì đóng form
      if (editingId === item.id) {
        handleCancelEdit();
      }

      setMessage(`Đã xóa người dùng ${item.hoten} thành công!`);
    } catch (err: any) {
      console.log("Delete error:", err.code, err.message);

      setError(
        `Không thể xóa người dùng: ${err.code ?? err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Trên trình duyệt web
  if (Platform.OS === "web") {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người dùng "${item.hoten}" không?`
    );

    if (confirmed) {
      void deleteUser();
    }

    return;
  }

  // Trên iPhone (Expo Go)
  Alert.alert(
    "Xác nhận xóa",
    `Bạn có chắc chắn muốn xóa người dùng "${item.hoten}" không?`,
    [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          void deleteUser();
        },
      },
    ]
  );
};



const handlePickImage = async () => {
  try {
    setError("");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets.length) {
      return;
    }

    const selected = result.assets[0];

    const context = ImageManipulator.ImageManipulator.manipulate(
      selected.uri
    );

    context.resize({ width: 240 });

    const rendered = await context.renderAsync();

    const image = await rendered.saveAsync({
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });

    if (!image.base64) {
      throw new Error("Không thể chuyển đổi hình ảnh.");
    }

    // Giới hạn kích thước để tránh vượt mức Firestore
    if (image.base64.length > 200000) {
      setError("Ảnh quá lớn. Vui lòng chọn ảnh khác.");
      return;
    }

    setHinhanh(`data:image/jpeg;base64,${image.base64}`);

    setMessage("Đã chọn và xử lý hình ảnh thành công!");
  } catch (err: any) {
    setError(`Lỗi chọn ảnh: ${err.message}`);
  }
};
  // Thêm người dùng
  const handleAdd = async () => {
    setMessage("");
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !matkhau || !hoten.trim()) {
      setError("Vui lòng nhập email, mật khẩu và họ tên.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Email không đúng định dạng.");
      return;
    }

    if (matkhau.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (users.some((u) => u.email === cleanEmail)) {
      setError("Email này đã tồn tại.");
      return;
    }

    try {
      setLoading(true);

      // Chỉ lưu bản băm, không lưu mật khẩu gốc
      const hashedPassword = await bcrypt.hash(matkhau, 10);

      await addDoc(collection(db, "users"), {
        email: cleanEmail,
        matkhau: hashedPassword,
        hoten: hoten.trim(),
        hinhanh: hinhanh.trim(),
      });

      setEmail("");
      setMatkhau("");
      setHoten("");
      setHinhanh("");

      setMessage("Thêm người dùng thành công!");
    } catch (err: any) {
      console.log("Add user error:", err.code, err.message);
      setError(`Không thể thêm người dùng: ${err.code ?? err.message}`);
    } finally {
      setLoading(false);
    }
  };


  return <UserManagerPanel
    email={email} matkhau={matkhau} hoten={hoten} hinhanh={hinhanh}
    users={users} editingId={editingId} loading={loading} message={message} error={error}
    onEmailChange={setEmail} onPasswordChange={setMatkhau} onNameChange={setHoten} onImageChange={setHinhanh}
    onPickImage={handlePickImage} onSave={editingId ? handleUpdate : handleAdd}
    onCancelEdit={handleCancelEdit} onDelete={handleDelete}
    onEdit={(item) => { handleEdit(item); onEditStart?.(); }}
  />;
}
