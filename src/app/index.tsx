import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
import AdminScreen from '../components/admin-screen';
import LoginScreen from '../components/login-screen';
import { Brand, palette } from '../components/admin-ui';

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  // Theo dõi trạng thái đăng nhập Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  // Đăng nhập Admin
  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setPassword("");
    } catch (err: any) {
      console.log("Login error:", err.code);

      switch (err.code) {
        case "auth/invalid-email":
          setError("Địa chỉ email không hợp lệ.");
          break;

        case "auth/too-many-requests":
          setError("Thử quá nhiều lần. Vui lòng thử lại sau.");
          break;

        case "auth/network-request-failed":
          setError("Không thể kết nối mạng.");
          break;

        default:
          setError("Email hoặc mật khẩu không chính xác.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất Admin
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPassword("");
      setError("");
    } catch {
      Alert.alert("Lỗi", "Không thể đăng xuất.");
    }
  };


  if (checkingAuth) {
    return (
      <View style={styles.loading}>
        <Brand />
        <ActivityIndicator size="small" color={palette.green} style={styles.spinner} />
        <Text style={styles.loadingText}>Đang kiểm tra phiên đăng nhập…</Text>
      </View>
    );
  }

  if (user) {
    return <AdminScreen email={user.email ?? 'Admin'} onLogout={handleLogout} />;
  }

  return <LoginScreen email={email} password={password} loading={loading} error={error}
    onEmailChange={setEmail} onPasswordChange={setPassword} onLogin={handleLogin} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: palette.background },
  spinner: { marginTop: 32 },
  loadingText: { color: palette.muted, fontSize: 12, marginTop: 14 },
});
