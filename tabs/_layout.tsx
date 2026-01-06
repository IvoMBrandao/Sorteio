import React from 'react';
import { Tabs } from 'expo-router';
import { Dice6, Users, Settings } from 'lucide-react-native';
import { StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

// Importa a configuração para inicializar o i18n no app
import '../src/i18n'; 
import { useTheme } from '../src/hooks/useTheme';

export default function TabLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Configurações dinâmicas baseadas no tema
  const isDark = theme === 'dark';
  const activeColor = isDark ? '#818cf8' : '#6366f1';
  const inactiveColor = isDark ? '#94a3b8' : '#64748b';
  const backgroundColor = isDark ? '#1a1a2e' : '#ffffff';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          height: Platform.OS === 'ios' ? 88 : 70, // Ajuste para SafeArea no iOS
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // Usando a chave de tradução do seu JSON
          title: t('header.title'), 
          tabBarIcon: ({ size, color }) => (
            <Dice6 size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="names"
        options={{
          // Usando a chave de tradução do seu JSON
          title: t('names.header.title'),
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          // Usando a chave de tradução do seu JSON
          title: t('settings.header.title'),
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});