import { Platform } from 'react-native';

export const colors = {
  background: '#E9EEF2',
  surface: '#FFFFFF',
  ink: '#1B2A3A',
  muted: '#647585',
  line: '#D3DBE2',
  primary: '#2F6B5E',
  primarySoft: '#DCEBE6',
  accent: '#F2B134',
  danger: '#B4413C',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#1B2A3A',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: {
    elevation: 3,
  },
  default: {},
});

export const font = {
  title: Platform.select({ ios: 'Avenir Next', android: 'sans-serif-medium', default: 'System' }),
  body: Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: 'System' }),
};
