import { ActivityIndicator, Platform, Pressable, StyleSheet, Text } from 'react-native';

import { colors, font, radius } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
};

export default function AppButton({ label, onPress, variant = 'primary', loading, disabled }: Props) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: isPrimary ? '#ffffff33' : colors.primarySoft }}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.outline,
        Platform.OS === 'ios' && pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
      ) : (
        <Text style={[styles.label, { color: isPrimary ? '#fff' : colors.primary }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: font.title,
    fontSize: 16,
    fontWeight: '600',
  },
});
