import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

export const palette = {
  background: '#F5F6F2',
  surface: '#FFFFFF',
  ink: '#172C28',
  muted: '#6E7D77',
  green: '#245C48',
  greenDark: '#183F33',
  greenSoft: '#EDF3EE',
  border: '#E2E7E0',
  lime: '#DCEBA6',
  danger: '#B44141',
};

type IconName = 'users' | 'plus' | 'arrow' | 'edit' | 'trash' | 'image' | 'logout' | 'check';

export function Icon({ name, color = palette.green, size = 20 }: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return (
    <View aria-hidden style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {name === 'users' ? (
        <>
          <View style={{ position: 'absolute', width: size * .3, height: size * .3, borderRadius: size, borderWidth: 1.6, borderColor: color, top: 1, left: size * .22 }} />
          <View style={{ position: 'absolute', width: size * .64, height: size * .38, borderTopLeftRadius: size, borderTopRightRadius: size, borderWidth: 1.6, borderColor: color, bottom: 1, left: 0 }} />
          <View style={{ position: 'absolute', width: size * .24, height: size * .24, borderRadius: size, borderWidth: 1.6, borderColor: color, top: size * .17, right: 0 }} />
          <View style={{ position: 'absolute', width: size * .23, height: size * .34, borderTopRightRadius: size, borderRightWidth: 1.6, borderTopWidth: 1.6, borderColor: color, bottom: 1, right: 0 }} />
        </>
      ) : name === 'trash' ? (
        <>
          <View style={{ width: size * .56, height: size * .62, borderWidth: 1.5, borderColor: color, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, marginTop: 4 }} />
          <View style={{ position: 'absolute', width: size * .8, height: 1.5, backgroundColor: color, top: 4 }} />
          <View style={{ position: 'absolute', width: size * .3, height: 3, borderWidth: 1.5, borderBottomWidth: 0, borderColor: color, top: 1 }} />
        </>
      ) : name === 'image' ? (
        <View style={{ width: size * .9, height: size * .8, borderRadius: 3, borderWidth: 1.5, borderColor: color, overflow: 'hidden' }}>
          <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 3, position: 'absolute', right: 3, top: 3 }} />
          <View style={{ width: size * .55, height: size * .55, borderWidth: 1.5, borderColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: -size * .3, left: 1 }} />
        </View>
      ) : (
        <Text style={{ color, fontSize: size + (name === 'plus' ? 4 : 0), lineHeight: size + 5, fontWeight: '500', textAlign: 'center' }}>
          {{ plus: '+', arrow: '→', edit: '✎', logout: '↪', check: '✓' }[name]}
        </Text>
      )}
    </View>
  );
}

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <View style={ui.brand}>
      <View style={[ui.brandMark, light && { backgroundColor: palette.lime }]}>
        <Icon name="users" color={light ? palette.greenDark : '#FFFFFF'} size={23} />
      </View>
      <View>
        <Text style={[ui.brandName, light && { color: '#FFFFFF' }]}>UserSpace<Text style={{ color: light ? palette.lime : palette.green }}>.</Text></Text>
        {!compact && <Text style={[ui.brandCaption, light && { color: '#B7CFC2' }]}>KHÔNG GIAN QUẢN TRỊ</Text>}
      </View>
    </View>
  );
}

export function Field({ label, hint, required, secureTextEntry, style, ...props }: TextInputProps & {
  label: string;
  hint?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  return (
    <View style={ui.field}>
      <Text style={ui.label}>{label}{required && <Text style={{ color: palette.green }}> *</Text>}</Text>
      <View style={[ui.inputShell, focused && ui.inputFocused, props.editable === false && { opacity: .65 }]}>
        <TextInput
          {...props}
          accessibilityLabel={label}
          placeholderTextColor="#939E97"
          underlineColorAndroid="transparent"
          secureTextEntry={secureTextEntry && !visible}
          onFocus={(event) => { setFocused(true); props.onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); props.onBlur?.(event); }}
          style={[ui.input, style]}
        />
        {secureTextEntry && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            onPress={() => setVisible(!visible)}
            style={ui.visibilityButton}>
            <Text style={ui.visibilityText}>{visible ? 'Ẩn' : 'Hiện'}</Text>
          </Pressable>
        )}
      </View>
      {!!hint && <Text style={ui.hint}>{hint}</Text>}
    </View>
  );
}

export function Button({ label, onPress, icon, variant = 'primary', disabled = false, busy = false, style, accessibilityLabel }: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
  disabled?: boolean;
  busy?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const foreground = variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? palette.danger : palette.green;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || busy, busy }}
      onPress={onPress}
      disabled={disabled || busy}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        ui.button,
        variant === 'primary' ? ui.primary : variant === 'secondary' ? ui.secondary : ui.quiet,
        hovered && { backgroundColor: variant === 'primary' ? palette.greenDark : variant === 'danger' ? '#FCF0EE' : '#EAF0E9' },
        (disabled || busy) && { opacity: .55 },
        pressed && { opacity: .75 },
        style,
      ]}>
      {busy ? <ActivityIndicator color={foreground} size="small" /> : <>
        {icon && <Icon name={icon} color={foreground} size={17} />}
        <Text style={[ui.buttonText, { color: foreground }]}>{label}</Text>
      </>}
    </Pressable>
  );
}

export function Notice({ text, error = false }: { text: string; error?: boolean }) {
  if (!text) return null;
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={[ui.notice, error && ui.noticeError]}>
      <Text style={[ui.noticeSymbol, error && { color: palette.danger }]}>{error ? '!' : '✓'}</Text>
      <Text style={[ui.noticeText, error && { color: '#923A37' }]}>{text}</Text>
    </View>
  );
}

export function Avatar({ name, uri, size = 44, index = 0 }: { name: string; uri?: string; size?: number; index?: number }) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(-2).map(part => part[0]).join('').toUpperCase() || 'ND';
  const tones = ['#E4ECE1', '#ECE7DC', '#E3EAF0', '#EEE3E7'];
  const shape = { width: size, height: size, borderRadius: size * .32 };
  if (uri && uri !== failedUri) {
    return <Image accessibilityLabel={`Ảnh của ${name}`} source={{ uri }} style={shape} onError={() => setFailedUri(uri)} />;
  }
  return (
    <View style={[shape, { backgroundColor: tones[index % tones.length], alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: palette.green, fontWeight: '600', fontSize: size * .3 }}>{initials}</Text>
    </View>
  );
}

const ui = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandMark: { width: 44, height: 44, borderRadius: 13, backgroundColor: palette.green, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 23, fontWeight: '700', letterSpacing: -.8, color: palette.ink },
  brandCaption: { fontSize: 8, fontWeight: '600', letterSpacing: 2, color: palette.muted, marginTop: 4 },
  field: { gap: 8 },
  label: { color: palette.ink, fontSize: 13, fontWeight: '600' },
  inputShell: { borderWidth: 1, borderColor: palette.border, borderRadius: 9, backgroundColor: '#FDFEFC', flexDirection: 'row', alignItems: 'center', minHeight: 49 },
  inputFocused: { borderColor: palette.green, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 3px rgba(36, 92, 72, 0.09)' },
  input: { flex: 1, minWidth: 0, paddingHorizontal: 14, paddingVertical: 14, color: palette.ink, fontSize: 14, outlineWidth: 0 },
  visibilityButton: { paddingHorizontal: 13, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  visibilityText: { color: palette.muted, fontSize: 12, fontWeight: '500' },
  hint: { fontSize: 11, lineHeight: 17, color: palette.muted },
  button: { minHeight: 46, paddingHorizontal: 16, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9 },
  primary: { backgroundColor: palette.green },
  secondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: palette.border },
  quiet: { backgroundColor: 'transparent' },
  buttonText: { fontSize: 13, fontWeight: '600' },
  notice: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 13, borderRadius: 9, backgroundColor: palette.greenSoft },
  noticeError: { backgroundColor: '#FCF0EE' },
  noticeSymbol: { fontSize: 14, color: palette.green, fontWeight: '700' },
  noticeText: { fontSize: 12, lineHeight: 19, flex: 1, color: palette.green },
});
