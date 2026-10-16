import { StyleSheet, Text, View } from 'react-native';

import { colors, font } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
  last?: boolean;
};

export default function InfoRow({ label, value, last }: Props) {
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  label: {
    fontFamily: font.body,
    fontSize: 15,
    color: colors.muted,
  },
  value: {
    fontFamily: font.title,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    flexShrink: 1,
    textAlign: 'right',
  },
});
