import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import { colors, font, radius } from '@/constants/theme';

export default function CameraScreen() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: true,
    aspect: Platform.OS === 'android' ? [4, 3] : undefined,
  };

  const addPhoto = (uri: string) => {
    setPhotos((prev) => [uri, ...prev]);
    setSelected(uri);
  };

  const showPermissionAlert = () => {
    Alert.alert(
      'Permiso de cámara desactivado',
      Platform.OS === 'ios'
        ? 'Actívalo en Ajustes > Rumbo > Cámara.'
        : 'Actívalo en Ajustes > Aplicaciones > Rumbo > Permisos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
      ]
    );
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showPermissionAlert();
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync(options);
      if (!result.canceled) addPhoto(result.assets[0].uri);
    } catch {
      Alert.alert('Cámara no disponible', 'Este dispositivo no permite abrir la cámara.');
    }
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled) addPhoto(result.assets[0].uri);
  };

  const clearPhotos = () => {
    setPhotos([]);
    setSelected(null);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card style={styles.previewCard}>
        {selected ? (
          <Image source={{ uri: selected }} style={styles.preview} />
        ) : (
          <View style={[styles.preview, styles.empty]}>
            <Text style={styles.emptyTitle}>Todavía no hay fotos</Text>
            <Text style={styles.emptyText}>Toma una foto o elige una de tu galería para verla aquí.</Text>
          </View>
        )}
      </Card>

      <View style={styles.actions}>
        <AppButton label="Tomar foto" onPress={takePhoto} />
        <AppButton label="Elegir de la galería" onPress={pickPhoto} variant="outline" />
      </View>

      {photos.length > 0 && (
        <>
          <View style={styles.galleryHeader}>
            <Text style={styles.sectionTitle}>Fotos de esta sesión ({photos.length})</Text>
            <Pressable onPress={clearPhotos} hitSlop={10}>
              <Text style={styles.clear}>Borrar</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
            {photos.map((uri) => (
              <Pressable key={uri} onPress={() => setSelected(uri)}>
                <Image source={{ uri }} style={[styles.thumb, selected === uri && styles.thumbActive]} />
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      <Text style={styles.note}>
        {Platform.OS === 'ios'
          ? 'En iOS puedes ajustar el encuadre libremente después de tomar la foto.'
          : 'En Android la foto se recorta en formato 4:3 después de tomarla.'}
      </Text>
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
  previewCard: {
    padding: 10,
    marginBottom: 20,
  },
  preview: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: radius.sm,
  },
  empty: {
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: font.title,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: font.body,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
    marginBottom: 28,
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: font.title,
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  clear: {
    fontFamily: font.title,
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },
  gallery: {
    gap: 10,
    paddingBottom: 4,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: radius.sm,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: colors.accent,
  },
  note: {
    fontFamily: font.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 24,
    textAlign: 'center',
  },
});
