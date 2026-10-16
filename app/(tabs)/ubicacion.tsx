import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import InfoRow from '@/components/InfoRow';
import { colors, font, radius } from '@/constants/theme';

export default function LocationScreen() {
  const [position, setPosition] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureServicesEnabled = async () => {
    const enabled = await Location.hasServicesEnabledAsync();
    if (enabled) return true;

    if (Platform.OS === 'android') {
      try {
        await Location.enableNetworkProviderAsync();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Necesitas permitir el acceso a la ubicación para usar esta función.');
        return;
      }

      const servicesOn = await ensureServicesEnabled();
      if (!servicesOn) {
        setError(
          Platform.OS === 'ios'
            ? 'Activa la localización en Ajustes > Privacidad y seguridad > Localización.'
            : 'Activa la ubicación desde el panel de ajustes rápidos.'
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Platform.OS === 'android' ? Location.Accuracy.High : Location.Accuracy.Balanced,
      });
      setPosition(current);

      try {
        const [place] = await Location.reverseGeocodeAsync(current.coords);
        if (place) {
          const parts = [place.street, place.streetNumber, place.city, place.region, place.country].filter(Boolean);
          setAddress(parts.join(', '));
        }
      } catch {
        setAddress(null);
      }
    } catch {
      setError('No se pudo obtener la ubicación. Intenta de nuevo en un lugar con mejor señal.');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (!position) return;
    const { latitude, longitude } = position.coords;
    const url = Platform.select({
      ios: `maps:0,0?q=Mi ubicación@${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(Mi ubicación)`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url).catch(() =>
      Alert.alert('Sin aplicación de mapas', 'No se encontró una aplicación para abrir la ubicación.')
    );
  };

  const coords = position?.coords;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card style={styles.mainCard}>
        <Text style={styles.label}>Coordenadas actuales</Text>
        {coords ? (
          <>
            <Text style={styles.coords}>{coords.latitude.toFixed(5)}</Text>
            <Text style={styles.coords}>{coords.longitude.toFixed(5)}</Text>
            {address && <Text style={styles.address}>{address}</Text>}
          </>
        ) : (
          <Text style={styles.placeholder}>Pulsa el botón para encontrar dónde estás.</Text>
        )}
      </Card>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <AppButton label={coords ? 'Actualizar ubicación' : 'Obtener ubicación'} onPress={getLocation} loading={loading} />
        {coords && <AppButton label="Abrir en mapas" onPress={openInMaps} variant="outline" />}
      </View>

      {coords && (
        <Card>
          <InfoRow label="Precisión" value={coords.accuracy ? `± ${Math.round(coords.accuracy)} m` : 'No disponible'} />
          <InfoRow label="Altitud" value={coords.altitude != null ? `${Math.round(coords.altitude)} m` : 'No disponible'} />
          <InfoRow
            label="Velocidad"
            value={coords.speed != null && coords.speed >= 0 ? `${(coords.speed * 3.6).toFixed(1)} km/h` : '0 km/h'}
          />
          <InfoRow
            label="Hora de lectura"
            value={new Date(position.timestamp).toLocaleTimeString()}
            last
          />
        </Card>
      )}
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
  mainCard: {
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: colors.accent,
  },
  label: {
    fontFamily: font.body,
    fontSize: 14,
    color: colors.muted,
    marginBottom: 8,
  },
  coords: {
    fontFamily: font.title,
    fontSize: 30,
    fontWeight: '700',
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  address: {
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 21,
    color: colors.primary,
    marginTop: 10,
  },
  placeholder: {
    fontFamily: font.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  errorBox: {
    backgroundColor: '#F7E1DF',
    borderRadius: radius.sm,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.danger,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
});
