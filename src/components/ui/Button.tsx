import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import type { TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<string, { btn: ViewStyle; text: TextStyle }> = {
  primary:   { btn: { backgroundColor: '#2563EB' },                                      text: { color: '#FFFFFF' } },
  secondary: { btn: { backgroundColor: '#F1F5F9' },                                      text: { color: '#1E293B' } },
  outline:   { btn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2563EB' }, text: { color: '#2563EB' } },
  ghost:     { btn: { backgroundColor: 'transparent' },                                  text: { color: '#2563EB' } },
  danger:    { btn: { backgroundColor: '#FEF2F2' },                                      text: { color: '#DC2626' } },
};

const SIZE_STYLES: Record<string, { btn: ViewStyle; text: TextStyle }> = {
  sm: { btn: { paddingHorizontal: 16, paddingVertical: 8,  borderRadius: 12 }, text: { fontSize: 14 } },
  md: { btn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 }, text: { fontSize: 14, fontWeight: '600' } },
  lg: { btn: { paddingHorizontal: 28, paddingVertical: 16, borderRadius: 16 }, text: { fontSize: 16, fontWeight: '600' } },
};

export const Button: React.FC<ButtonProps> = ({
  title, variant = 'primary', size = 'md', loading = false,
  icon, iconPosition = 'left', fullWidth = false, disabled, style, ...props
}) => {
  const v = VARIANT_STYLES[variant];
  const s = SIZE_STYLES[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        s.btn,
        v.btn,
        styles.base,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#2563EB'} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[v.text, s.text, styles.label]}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base:      { alignItems: 'center', justifyContent: 'center' },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.5 },
  row:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label:     { letterSpacing: 0.3 },
  iconLeft:  { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});

