import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadow } from '@/constants/theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export default function Card({ children, style }: Props) {
  return <View style={[styles.card, shadow, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 18,
  },
});
