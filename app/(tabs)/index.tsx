import { router } from 'expo-router';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/Card';
import InfoRow from '@/components/InfoRow';
import { colors, font, radius } from '@/constants/theme';

type Shortcut = {
  title: string;
  description: string;
  route: '/camara' | '/ubicacion' | '/nivel';
  ios: SFSymbol;
  android: 'photo_camera' | 'location_on' | 'explore';
};

const shortcuts: Shortcut[] = [
  {
    title: 'Cámara',
    description: 'Toma fotos o elige una de tu galería.',
    route: '/camara',
    ios: 'camera.fill',
    android: 'photo_camera',
  },
  {
    title: 'Ubicación',
    description: 'Consulta tus coordenadas y tu dirección.',
    route: '/ubicacion',
    ios: 'location.fill',
    android: 'location_on',
  },
  {
    title: 'Nivel',
    description: 'Usa el acelerómetro para nivelar superficies.',
    route: '/nivel',
    ios: 'gyroscope',
    android: 'explore',
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function HomeScreen() {
  const systemName = Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web';
  const version =
    Platform.OS === 'android' ? `API ${Platform.Version}` : String(Platform.Version ?? 'No disponible');

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.heroText}>
          Tu teléfono tiene cámara, GPS y sensores de movimiento. Aquí puedes usarlos en un solo lugar.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Herramientas</Text>
      <View style={styles.list}>
        {shortcuts.map((item) => (
          <Pressable
            key={item.route}
            onPress={() => router.navigate(item.route)}
            android_ripple={{ color: colors.primarySoft }}
            style={({ pressed }) => [styles.shortcutWrap, Platform.OS === 'ios' && pressed && { opacity: 0.6 }]}>
            <Card style={styles.shortcut}>
              <View style={styles.iconBox}>
                <SymbolView
                  name={{ ios: item.ios, android: item.android, web: item.android }}
                  tintColor={colors.primary}
                  size={24}
                />
              </View>
              <View style={styles.shortcutText}>
                <Text style={styles.shortcutTitle}>{item.title}</Text>
                <Text style={styles.shortcutDescription}>{item.description}</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Tu dispositivo</Text>
      <Card>
        <InfoRow label="Sistema operativo" value={systemName} />
        <InfoRow label="Versión" value={version} />
        <InfoRow
          label="Modo de botones"
          value={Platform.OS === 'ios' ? 'Opacidad al tocar' : 'Efecto ripple'}
          last
        />
      </Card>
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
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: 22,
    marginBottom: 28,
  },
  greeting: {
    fontFamily: font.title,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  heroText: {
    fontFamily: font.body,
    fontSize: 16,
    lineHeight: 23,
    color: '#E4F0EC',
  },
  sectionTitle: {
    fontFamily: font.title,
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 12,
  },
  list: {
    gap: 12,
    marginBottom: 28,
  },
  shortcutWrap: {
    borderRadius: radius.md,
  },
  shortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutText: {
    flex: 1,
  },
  shortcutTitle: {
    fontFamily: font.title,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  shortcutDescription: {
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
});
