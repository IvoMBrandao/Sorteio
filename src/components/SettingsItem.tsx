import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Video as LucideIcon } from 'lucide-react-native';

interface SettingsItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onPress: () => void;
  showArrow?: boolean;
  destructive?: boolean;
}

export function SettingsItem({
  title,
  description,
  icon: Icon,
  onPress,
  showArrow = true,
  destructive = false,
}: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon 
          size={20} 
          color={destructive ? '#ef4444' : '#6366f1'} 
          strokeWidth={2.5} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, destructive && styles.destructiveText]}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      
      {showArrow && (
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
    borderBottomColor: '#f1f5f9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
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
    color: '#1e293b',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },
  destructiveText: {
    color: '#ef4444',
  },
});