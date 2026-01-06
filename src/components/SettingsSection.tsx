import { View, Text, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title.toUpperCase()}
      </Text>
      <View style={[
        styles.content,
        { backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.95)' }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  content: {
    borderRadius: 20,
    overflow: 'hidden',
    // Sombra leve para destacar os cards de configuração
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});