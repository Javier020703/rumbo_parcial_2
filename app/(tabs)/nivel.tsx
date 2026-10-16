import { useIsFocused } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import InfoRow from '@/components/InfoRow';
import { colors, font } from '@/constants/theme';

const DIAL = 240;
const BUBBLE = 44;
const MAX_OFFSET = (DIAL - BUBBLE) / 2;
const LEVEL_THRESHOLD = 1.5;
const AXIS_SIGN = Platform.OS === 'android' ? -1 : 1;

export default function LevelScreen() {
  const isFocused = useIsFocused();
  const [available, setAvailable] = useState<boolean | null>(null);
  const [paused, setPaused] = useState(false);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const wasLevel = useRef(false);

  useEffect(() => {
    Accelerometer.isAvailableAsync().then(setAvailable);
  }, []);

  useEffect(() => {
    if (!available || paused || !isFocused) return;

    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      setData({ x: x * AXIS_SIGN, y: y * AXIS_SIGN, z: z * AXIS_SIGN });
    });

    return () => subscription.remove();
  }, [available, paused, isFocused]);

  const angleX = Math.asin(Math.max(-1, Math.min(1, data.x))) * (180 / Math.PI);
  const angleY = Math.asin(Math.max(-1, Math.min(1, data.y))) * (180 / Math.PI);
  const tilt = Math.sqrt(angleX ** 2 + angleY ** 2);
  const isLevel = tilt < LEVEL_THRESHOLD;

  useEffect(() => {
    if (isLevel && !wasLevel.current && !paused) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasLevel.current = isLevel;
  }, [isLevel, paused]);

  const clamp = (value: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));
  const offsetX = clamp((-angleX / 45) * MAX_OFFSET);
  const offsetY = clamp((angleY / 45) * MAX_OFFSET);

  if (available === false) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.unavailableTitle}>Acelerómetro no disponible</Text>
        <Text style={styles.unavailableText}>Este dispositivo no tiene el sensor necesario para usar el nivel.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.dialWrap}>
        <View style={[styles.dial, isLevel && styles.dialLevel]}>
          <View style={styles.crossH} />
          <View style={styles.crossV} />
          <View style={styles.target} />
          <View
            style={[
              styles.bubble,
              { backgroundColor: isLevel ? colors.primary : colors.accent },
              { transform: [{ translateX: offsetX }, { translateY: offsetY }] },
            ]}
          />
        </View>
      </View>

      <Text style={[styles.status, { color: isLevel ? colors.primary : colors.ink }]}>
        {paused ? 'En pausa' : isLevel ? 'Superficie nivelada' : `${tilt.toFixed(1)}° de inclinación`}
      </Text>
      <Text style={styles.hint}>Coloca el teléfono boca arriba sobre la superficie que quieres medir.</Text>

      <Card style={styles.dataCard}>
        <InfoRow label="Inclinación lateral" value={`${angleX.toFixed(1)}°`} />
        <InfoRow label="Inclinación frontal" value={`${angleY.toFixed(1)}°`} />
        <InfoRow label="Eje Z" value={`${data.z.toFixed(2)} g`} last />
      </Card>

      <AppButton
        label={paused ? 'Reanudar sensor' : 'Pausar sensor'}
        onPress={() => setPaused((p) => !p)}
        variant="outline"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  dialWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  dial: {
    width: DIAL,
    height: DIAL,
    borderRadius: DIAL / 2,
    backgroundColor: colors.surface,
    borderWidth: 6,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialLevel: {
    borderColor: colors.primary,
  },
  crossH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: colors.line,
  },
  crossV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: colors.line,
  },
  target: {
    position: 'absolute',
    width: BUBBLE + 14,
    height: BUBBLE + 14,
    borderRadius: (BUBBLE + 14) / 2,
    borderWidth: 2,
    borderColor: colors.muted,
    borderStyle: 'dashed',
  },
  bubble: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: BUBBLE / 2,
  },
  status: {
    fontFamily: font.title,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  dataCard: {
    marginBottom: 16,
  },
  unavailableTitle: {
    fontFamily: font.title,
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 8,
    textAlign: 'center',
  },
  unavailableText: {
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 21,
    color: colors.muted,
    textAlign: 'center',
  },
});
