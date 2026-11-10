import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import type { NguoiDung } from './UserManager';
import { Avatar, Button, Field, Icon, Notice, palette } from './admin-ui';

type Props = {
  email: string;
  matkhau: string;
  hoten: string;
  hinhanh: string;
  users: NguoiDung[];
  editingId: string | null;
  loading: boolean;
  message: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onPickImage: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDelete: (user: NguoiDung) => void;
  onEdit: (user: NguoiDung) => void;
};

export default function UserManagerPanel(props: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 1000;
  const compactRows = width < 1200;
  const { editingId, loading, users, hinhanh } = props;

  return (
    <View style={[styles.workspace, wide && styles.workspaceWide]}>
      <View style={[styles.formCard, wide && styles.formCardWide]}>
        <View style={styles.formHeader}>
          <View style={styles.sectionIcon}><Icon name={editingId ? 'edit' : 'plus'} size={19} /></View>
          <View style={styles.formHeading}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>{editingId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</Text>
            <Text style={styles.sectionDescription}>{editingId ? 'Cập nhật thông tin tài khoản đã chọn.' : 'Tạo một hồ sơ người dùng mới.'}</Text>
          </View>
        </View>

        <View style={styles.formBody}>
          <View style={styles.photoRow}>
            {hinhanh ? <Avatar uri={hinhanh} name={props.hoten || 'Người dùng'} size={64} /> : <View style={styles.photoPlaceholder}><Icon name="image" color="#879A87" size={25} /></View>}
            <View style={styles.photoContent}>
              <Button label={hinhanh ? 'Thay đổi ảnh' : 'Chọn ảnh đại diện'} icon="image" variant="secondary" onPress={props.onPickImage} disabled={loading} style={styles.photoButton} />
              <Text style={styles.photoHint}>Chọn hình ảnh từ thiết bị của bạn</Text>
            </View>
          </View>
          <View style={styles.formDivider} />
          <Field label="Họ và tên" placeholder="Nhập họ và tên" value={props.hoten} onChangeText={props.onNameChange} required editable={!loading} autoComplete="off" />
          <Field label="Địa chỉ email" placeholder="nguoidung@example.com" value={props.email} onChangeText={props.onEmailChange} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" required editable={!loading} autoComplete="off" />
          <Field label={editingId ? 'Mật khẩu mới' : 'Mật khẩu'} placeholder={editingId ? 'Để trống để giữ mật khẩu hiện tại' : 'Nhập ít nhất 8 ký tự'} value={props.matkhau} onChangeText={props.onPasswordChange} secureTextEntry required={!editingId} autoCapitalize="none" autoComplete="new-password" editable={!loading} hint={editingId ? 'Chỉ nhập khi bạn muốn thay đổi mật khẩu.' : 'Mật khẩu cần có ít nhất 8 ký tự.'} />
          <Field label="Liên kết hình ảnh" placeholder={hinhanh.startsWith('data:') ? 'Đã chọn ảnh từ thiết bị' : 'https://example.com/anh-dai-dien.jpg'} value={hinhanh.startsWith('data:') ? '' : hinhanh} onChangeText={props.onImageChange} autoCapitalize="none" autoCorrect={false} keyboardType="url" editable={!loading} hint="Bạn cũng có thể dán liên kết ảnh thay vì chọn từ thiết bị." />
          <Notice text={props.error} error />
          <Notice text={props.message} />
          <View style={styles.formActions}>
            <Button label={editingId ? 'Lưu thay đổi' : 'Thêm người dùng'} icon={editingId ? 'check' : 'plus'} onPress={props.onSave} busy={loading} />
            {editingId && <Button label="Hủy chỉnh sửa" variant="quiet" onPress={props.onCancelEdit} disabled={loading} />}
          </View>
          <Text style={styles.requiredNote}><Text style={{ color: palette.green }}>*</Text> Thông tin bắt buộc</Text>
        </View>
      </View>

      <View style={styles.listCard}>
        <View style={styles.listHeading}>
          <View style={styles.listTitleRow}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>Danh sách người dùng</Text>
            <View style={styles.countBadge}><Text style={styles.countText}>{users.length}</Text></View>
          </View>
          <Text style={styles.sectionDescription}>Thông tin và thao tác quản lý tài khoản.</Text>
        </View>
        {!compactRows && <View style={styles.tableHeader}>
          <Text style={[styles.columnLabel, styles.nameColumn]}>NGƯỜI DÙNG</Text>
          <Text style={[styles.columnLabel, styles.emailColumn]}>ĐỊA CHỈ EMAIL</Text>
          <Text style={[styles.columnLabel, styles.actionColumn]}>THAO TÁC</Text>
        </View>}
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          extraData={{ editingId, loading, compactRows }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}><Icon name="users" size={33} color="#7D987F" /></View>
              <Text style={styles.emptyTitle}>Bắt đầu với người dùng đầu tiên</Text>
              <Text style={styles.emptyText}>Chưa có người dùng nào. Điền thông tin vào{'\n'}biểu mẫu để thêm hồ sơ mới.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={[styles.userRow, compactRows && styles.userRowCompact, item.id === editingId && styles.userRowEditing]}>
              <View style={[styles.nameColumn, styles.userIdentity, compactRows && styles.identityCompact]}>
                <Avatar name={item.hoten} uri={item.hinhanh} index={index} />
                <View style={styles.identityText}>
                  <Text numberOfLines={1} style={styles.userName}>{item.hoten}</Text>
                  {compactRows && <Text numberOfLines={1} style={styles.userEmail}>{item.email}</Text>}
                  {item.id === editingId && <Text style={styles.editingLabel}>Đang chỉnh sửa</Text>}
                </View>
              </View>
              {!compactRows && <Text numberOfLines={1} style={[styles.userEmail, styles.emailColumn]}>{item.email}</Text>}
              <View style={[styles.rowActions, !compactRows && styles.actionColumn]}>
                <Button label="Sửa" icon="edit" variant="quiet" onPress={() => props.onEdit(item)} disabled={loading} accessibilityLabel={`Chỉnh sửa ${item.hoten}`} style={styles.rowButton} />
                <Button label="Xóa" icon="trash" variant="danger" onPress={() => props.onDelete(item)} disabled={loading} accessibilityLabel={`Xóa ${item.hoten}`} style={styles.rowButton} />
              </View>
            </View>
          )}
        />
        {!!users.length && <View style={styles.listFooter}><View style={styles.footerDot} /><Text style={styles.listFooterText}>Tổng cộng {users.length} người dùng</Text></View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workspace: { gap: 24, alignItems: 'stretch' },
  workspaceWide: { flexDirection: 'row', alignItems: 'flex-start' },
  formCard: { borderWidth: 1, borderColor: palette.border, borderRadius: 15, backgroundColor: palette.surface, overflow: 'hidden' },
  formCardWide: { width: 354 },
  formHeader: { padding: 23, flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: palette.border, backgroundColor: '#FCFDFB' },
  sectionIcon: { width: 38, height: 38, backgroundColor: '#EAF0E5', borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  formHeading: { flex: 1, gap: 5 },
  sectionTitle: { color: palette.ink, fontSize: 16, fontWeight: '600', letterSpacing: -.3 },
  sectionDescription: { color: palette.muted, fontSize: 11, lineHeight: 18 },
  formBody: { padding: 23, gap: 19 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  photoPlaceholder: { width: 64, height: 64, borderRadius: 18, borderWidth: 1, borderColor: '#D8E1D3', borderStyle: 'dashed', backgroundColor: '#F3F6EF', alignItems: 'center', justifyContent: 'center' },
  photoContent: { flex: 1, gap: 8, alignItems: 'flex-start' },
  photoButton: { paddingHorizontal: 10, paddingVertical: 7, minHeight: 35, gap: 6 },
  photoHint: { color: palette.muted, fontSize: 10, lineHeight: 16 },
  formDivider: { height: 1, backgroundColor: '#EDF0E9', marginVertical: 1 },
  formActions: { gap: 6, marginTop: 2 },
  requiredNote: { fontSize: 10, color: palette.muted, textAlign: 'center', marginTop: -5 },
  listCard: { flexGrow: 1, flexShrink: 1, minWidth: 0, borderRadius: 15, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.border, overflow: 'hidden' },
  listHeading: { padding: 24, gap: 6 },
  listTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  countBadge: { borderRadius: 6, backgroundColor: palette.greenSoft, paddingHorizontal: 8, paddingVertical: 4, minWidth: 25, alignItems: 'center' },
  countText: { color: palette.green, fontSize: 11, fontWeight: '600' },
  tableHeader: { paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row', gap: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: palette.border, backgroundColor: '#F9FAF7', alignItems: 'center' },
  columnLabel: { fontSize: 8, letterSpacing: 1.1, color: '#79867D', fontWeight: '600' },
  nameColumn: { flex: 1.05, minWidth: 0 },
  emailColumn: { flex: 1, minWidth: 0 },
  actionColumn: { width: 139, textAlign: 'right' },
  userRow: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 18, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#EEF1EA' },
  userRowCompact: { flexWrap: 'wrap', paddingHorizontal: 20, gap: 8 },
  userRowEditing: { backgroundColor: '#F0F5EB', borderLeftWidth: 3, borderLeftColor: palette.green, paddingLeft: 21 },
  userIdentity: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  identityCompact: { flexBasis: '100%' },
  identityText: { flex: 1, minWidth: 0, gap: 5 },
  userName: { color: palette.ink, fontSize: 13, fontWeight: '600' },
  userEmail: { color: palette.muted, fontSize: 11, lineHeight: 18 },
  editingLabel: { color: palette.green, fontSize: 10, fontWeight: '500' },
  rowActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 'auto', gap: 1 },
  rowButton: { paddingHorizontal: 8, minHeight: 40, gap: 5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 84, gap: 12 },
  emptyIcon: { width: 76, height: 76, borderRadius: 25, backgroundColor: '#F1F5EB', justifyContent: 'center', alignItems: 'center', marginBottom: 5, transform: [{ rotate: '-6deg' }] },
  emptyTitle: { color: palette.ink, fontSize: 15, fontWeight: '600', textAlign: 'center', lineHeight: 23 },
  emptyText: { color: palette.muted, fontSize: 12, lineHeight: 21, textAlign: 'center' },
  listFooter: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#FCFDFB' },
  footerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#749471' },
  listFooterText: { fontSize: 10, color: palette.muted },
});
