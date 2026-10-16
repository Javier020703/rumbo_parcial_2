import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform } from 'react-native';

import { colors, font } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: font.body,
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTitleAlign: Platform.OS === 'ios' ? 'center' : 'left',
        headerTitleStyle: {
          fontFamily: font.title,
          fontSize: 20,
          fontWeight: '700',
          color: colors.ink,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerTitle: 'Rumbo',
          tabBarIcon: ({ color }) => (
            <SymbolView name={{ ios: 'house.fill', android: 'home', web: 'home' }} tintColor={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="camara"
        options={{
          title: 'Cámara',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ubicacion"
        options={{
          title: 'Ubicación',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nivel"
        options={{
          title: 'Nivel',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'gyroscope', android: 'explore', web: 'explore' }}
              tintColor={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
