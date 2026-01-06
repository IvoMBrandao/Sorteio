import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';

interface SettingsItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onPress: () => void;
  showArrow?: boolean;
  destructive?: boolean;
  disabled?: boolean;
}

export function SettingsItem({
  title,
  description,
  icon: Icon,
  onPress,
  showArrow = true,
  destructive = false,
  disabled = false,
}: SettingsItemProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Cores dinâmicas baseadas no estado e tema
  const iconColor = destructive 
    ? '#ef4444' 
    : (isDark ? '#818cf8' : '#6366f1');

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9' },
        disabled && { opacity: 0.5 }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }
      ]}>
        <Icon 
          size={20} 
          color={iconColor} 
          strokeWidth={2.5} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[
          styles.title, 
          { color: isDark ? '#f1f5f9' : '#1e293b' },
          destructive && styles.destructiveText
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.description, 
          { color: isDark ? '#94a3b8' : '#64748b' }
        ]}>
          {description}
        </Text>
      </View>
      
      {showArrow && !disabled && (
        <ChevronRight size={18} color="#94a3b8" strokeWidth={2.5} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12, // Mudei para um arredondado suave (estilo moderno)
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 13, // Reduzi levemente para criar hierarquia visual
    lineHeight: 18,
  },
  destructiveText: {
    color: '#ef4444',
  },
});