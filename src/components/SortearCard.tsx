import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Hash, List, Grid, LucideIcon, Zap } from 'lucide-react-native';

// Tipos de ícones permitidos para manter a consistência visual
export type SortearIconType = 'users' | 'hash' | 'list' | 'grid' | 'zap';
interface SortearCardProps {
  title: string;
  description: string;
  icon: SortearIconType;
  // Gradiente definido como tupla para compatibilidade total com expo-linear-gradient
  gradient: readonly [string, string, ...string[]];
  onPress: () => void;
}

const iconMap: Record<SortearIconType, LucideIcon> = {
  users: Users,
  hash: Hash,
  list: List,
  grid: Grid,
  zap:Zap,
};

export function SortearCard({ title, description, icon, gradient, onPress }: SortearCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.85} 
      style={styles.card}
    >
      <LinearGradient 
        colors={gradient} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <IconComponent color="#fff" size={32} strokeWidth={2} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20, // Aumentei levemente para um visual mais moderno
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 12,
  },
  gradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 20, // Unificado com o padrão de títulos
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});