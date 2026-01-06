import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Users, Download, Trash2 } from 'lucide-react-native';

interface NamesHeaderProps {
  onImport: () => void;
  onClearAll: () => void;
  hasNames: boolean;
}

export function NamesHeader({ onImport, onClearAll, hasNames }: NamesHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <Users size={32} color="#ffffff" strokeWidth={2.5} />
        </View>
        <Text style={styles.title}>
          {t('names.header.title')}
        </Text>
        <Text style={styles.subtitle}>
          {t('names.header.subtitle')}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onImport}
          activeOpacity={0.7}
        >
          <Download size={18} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
        
        {hasNames && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onClearAll}
            activeOpacity={0.7}
          >
            <Trash2 size={18} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});