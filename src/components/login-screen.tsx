import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { Brand, Button, Field, Icon, Notice, palette } from './admin-ui';

type LoginScreenProps = {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
};

export default function LoginScreen(props: LoginScreenProps) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.layout, wide && styles.layoutWide]}>
          {wide && (
            <View style={styles.story}>
              <Brand light />
              <View style={styles.storyBody}>
                <View style={styles.eyebrowRow}><View style={styles.dot} /><Text style={styles.eyebrow}>GỌN GÀNG. KẾT NỐI. HIỆU QUẢ.</Text></View>
                <Text style={styles.headline}>Một nơi để{ '\n' }quản lý mọi{ '\n' }<Text style={styles.headlineAccent}>người dùng.</Text></Text>
                <Text style={styles.storyText}>Thông tin rõ ràng, thao tác dễ dàng.{ '\n' }Quản trị người dùng trong một không gian{ '\n' }đơn giản và tập trung.</Text>
                <View style={styles.illustration} aria-hidden>
                  <View style={styles.orbitOuter} />
                  <View style={styles.orbitInner} />
                  <View style={styles.connector} />
                  <View style={styles.profileCard}>
                    <View style={styles.profileAvatar}><Icon name="users" size={30} color={palette.greenDark} /></View>
                    <View style={styles.profileLines}><View style={styles.lineLong} /><View style={styles.lineShort} /></View>
                    <View style={styles.profileCheck}><Icon name="check" color={palette.greenDark} size={14} /></View>
                  </View>
                  <View style={[styles.miniAvatar, styles.miniAvatarOne]}><Icon name="users" size={24} color="#DCEBA6" /></View>
                  <View style={[styles.miniAvatar, styles.miniAvatarTwo]}><Icon name="users" size={22} color="#DCEBA6" /></View>
                  <View style={styles.spark}><Text style={styles.sparkText}>✳</Text></View>
                </View>
              </View>
              <Text style={styles.storyFooter}>QUẢN LÝ NGƯỜI DÙNG / PHÂN HỆ ADMIN</Text>
            </View>
          )}

          <View style={[styles.formSide, !wide && styles.formSideMobile]}>
            {!wide && <View style={styles.mobileBrand}><Brand /></View>}
            <View style={styles.form}>
              <View style={styles.welcomeTag}><View style={styles.tagDot} /><Text style={styles.tagText}>DÀNH CHO QUẢN TRỊ VIÊN</Text></View>
              <Text accessibilityRole="header" style={styles.title}>Chào mừng trở lại<Text style={{ color: palette.green }}>.</Text></Text>
              <Text style={styles.subtitle}>Đăng nhập để quản lý thông tin người dùng.</Text>
              <View style={styles.fields}>
                <Field
                  label="Địa chỉ email"
                  placeholder="admin@example.com"
                  value={props.email}
                  onChangeText={props.onEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!props.loading}
                />
                <Field
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu của bạn"
                  value={props.password}
                  onChangeText={props.onPasswordChange}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  secureTextEntry
                  editable={!props.loading}
                  returnKeyType="go"
                  onSubmitEditing={() => { if (!props.loading) props.onLogin(); }}
                />
                <Notice text={props.error} error />
                <Button label="Đăng nhập" icon="arrow" onPress={props.onLogin} busy={props.loading} style={styles.loginButton} />
              </View>
              <View style={styles.formNote}><View style={styles.noteLine} /><Text style={styles.noteText}>Không gian quản trị người dùng</Text><View style={styles.noteLine} /></View>
            </View>
            <Text style={styles.formFooter}>UserSpace · Đơn giản hóa việc quản lý</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1 },
  layout: { flex: 1, minHeight: '100%' },
  layoutWide: { flexDirection: 'row' },
  story: { width: '46%', maxWidth: 720, backgroundColor: palette.greenDark, padding: 46, paddingBottom: 30, overflow: 'hidden', justifyContent: 'space-between', minHeight: 760 },
  storyBody: { paddingTop: 58, paddingBottom: 20 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 23 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.lime },
  eyebrow: { fontSize: 9, fontWeight: '600', letterSpacing: 1.8, color: '#C4D7CA' },
  headline: { fontSize: 49, lineHeight: 62, letterSpacing: -1.8, fontWeight: '600', color: '#FFFFFF' },
  headlineAccent: { color: palette.lime },
  storyText: { color: '#B6CBBF', fontSize: 14, lineHeight: 25, marginTop: 22 },
  illustration: { height: 238, marginTop: 18, maxWidth: 380, justifyContent: 'center', alignItems: 'center' },
  orbitOuter: { position: 'absolute', width: 290, height: 210, borderRadius: 150, borderWidth: 1, borderColor: '#3D5E4E', transform: [{ rotate: '-25deg' }] },
  orbitInner: { position: 'absolute', width: 210, height: 160, borderRadius: 120, borderWidth: 1, borderColor: '#3D5E4E', transform: [{ rotate: '25deg' }] },
  connector: { width: 270, height: 1, backgroundColor: '#56745B', position: 'absolute', transform: [{ rotate: '-20deg' }] },
  profileCard: { backgroundColor: '#F5F6EC', borderRadius: 15, width: 247, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15, transform: [{ rotate: '-6deg' }], boxShadow: '0 16px 35px rgba(0,0,0,0.13)' },
  profileAvatar: { width: 49, height: 49, backgroundColor: '#DCE7C3', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  profileLines: { gap: 10, flex: 1 },
  lineLong: { height: 7, width: 83, backgroundColor: '#63836A', borderRadius: 4 },
  lineShort: { height: 5, width: 59, backgroundColor: '#C5D0BA', borderRadius: 4 },
  profileCheck: { width: 23, height: 23, borderRadius: 12, backgroundColor: palette.lime, position: 'absolute', right: -8, top: -8, alignItems: 'center', justifyContent: 'center' },
  miniAvatar: { position: 'absolute', width: 49, height: 49, borderRadius: 16, backgroundColor: '#355C46', borderWidth: 1, borderColor: '#668064', justifyContent: 'center', alignItems: 'center' },
  miniAvatarOne: { left: 20, top: 9, transform: [{ rotate: '-10deg' }] },
  miniAvatarTwo: { right: 6, bottom: 18, transform: [{ rotate: '12deg' }] },
  spark: { position: 'absolute', right: 32, top: 18 },
  sparkText: { color: palette.lime, fontSize: 31 },
  storyFooter: { fontSize: 8, color: '#A1BAAB', letterSpacing: 1.5 },
  formSide: { flex: 1, padding: 48, paddingBottom: 28, alignItems: 'center', justifyContent: 'center', minHeight: 760 },
  formSideMobile: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24, minHeight: 640 },
  mobileBrand: { alignSelf: 'flex-start', marginBottom: 64 },
  form: { width: '100%', maxWidth: 390, marginVertical: 'auto' },
  welcomeTag: { alignSelf: 'flex-start', paddingVertical: 7, paddingHorizontal: 10, borderRadius: 5, backgroundColor: '#E9EFE5', flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 23 },
  tagDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: palette.green },
  tagText: { color: palette.green, fontSize: 9, letterSpacing: 1.2, fontWeight: '600' },
  title: { fontSize: 32, lineHeight: 43, letterSpacing: -1.1, fontWeight: '700', color: palette.ink },
  subtitle: { marginTop: 10, fontSize: 14, lineHeight: 23, color: palette.muted },
  fields: { gap: 23, marginTop: 36 },
  loginButton: { marginTop: 3, minHeight: 51 },
  formNote: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 31 },
  noteLine: { height: 1, flex: 1, backgroundColor: palette.border },
  noteText: { color: palette.muted, fontSize: 10 },
  formFooter: { marginTop: 68, color: palette.muted, fontSize: 10 },
});
