import { View, Text, StyleSheet } from 'react-native';
import { Settings } from 'lucide-react-native';

export function SettingsHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Settings size={32} color="#ffffff" strokeWidth={2.5} />
      </View>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.subtitle}>Personalize sua experiência</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 24,
  },
});