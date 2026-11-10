import { useRef, type ComponentRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Avatar, Brand, Button, palette } from './admin-ui';
import UserManager from './UserManager';

export default function AdminScreen({ email, onLogout }: { email: string; onLogout: () => void }) {
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  const compact = width < 680;

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View style={[styles.headerInner, compact && styles.headerCompact]}>
          <Brand compact={compact} />
          <View style={styles.account}>
            {!compact && <><Avatar name={email} size={34} /><View style={styles.accountInfo}><Text style={styles.accountRole}>Quản trị viên</Text><Text numberOfLines={1} style={styles.accountEmail}>{email}</Text></View><View style={styles.separator} /></>}
            <Button label="Đăng xuất" icon="logout" variant="quiet" onPress={onLogout} style={styles.logout} />
          </View>
        </View>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={[styles.content, compact && styles.contentCompact]} keyboardShouldPersistTaps="handled">
        <View style={styles.pageHeading}>
          <Text style={styles.breadcrumb}>KHÔNG GIAN QUẢN TRỊ <Text style={styles.breadcrumbSlash}> / </Text> NGƯỜI DÙNG</Text>
          <Text accessibilityRole="header" style={[styles.title, compact && styles.titleCompact]}>Quản lý người dùng<Text style={{ color: palette.green }}>.</Text></Text>
          <Text style={styles.description}>Tất cả thông tin người dùng, gọn gàng trong một nơi.</Text>
        </View>
        <UserManager onEditStart={() => scroll.current?.scrollTo({ y: 0, animated: true })} />
        <View style={styles.footer}><Text style={styles.footerBrand}>UserSpace.</Text><Text style={styles.footerText}>Không gian quản trị người dùng</Text></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: palette.border },
  headerInner: { width: '100%', maxWidth: 1280, alignSelf: 'center', paddingHorizontal: 40, paddingVertical: 21, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
  headerCompact: { paddingHorizontal: 20, paddingVertical: 15 },
  account: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  accountInfo: { maxWidth: 200, gap: 4 },
  accountRole: { color: palette.ink, fontSize: 12, fontWeight: '600' },
  accountEmail: { color: palette.muted, fontSize: 11 },
  separator: { height: 28, width: 1, backgroundColor: palette.border, marginHorizontal: 12 },
  logout: { paddingHorizontal: 9 },
  content: { width: '100%', maxWidth: 1280, alignSelf: 'center', paddingHorizontal: 40, paddingTop: 37, paddingBottom: 24, flexGrow: 1 },
  contentCompact: { paddingHorizontal: 18, paddingTop: 28 },
  pageHeading: { marginBottom: 30 },
  breadcrumb: { fontSize: 9, fontWeight: '600', letterSpacing: 1.5, color: palette.muted },
  breadcrumbSlash: { color: '#B1BDB3' },
  title: { fontSize: 33, lineHeight: 45, fontWeight: '700', letterSpacing: -1, color: palette.ink, marginTop: 13 },
  titleCompact: { fontSize: 28, lineHeight: 39 },
  description: { color: palette.muted, fontSize: 13, lineHeight: 22, marginTop: 5 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderTopColor: palette.border, paddingTop: 21, marginTop: 32 },
  footerBrand: { color: palette.muted, fontSize: 11, fontWeight: '600' },
  footerText: { color: palette.muted, fontSize: 10 },
});
