import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SettingsHeader } from '../src/components/SettingsHeader';
import { SettingsSection } from '../src/components/SettingsSection';
import { SettingsItem } from '../src/components/SettingsItem';
import { useTheme } from '../src/hooks/useTheme';
import { useNames } from '../src/hooks/useNames';
import { Moon, Sun, Trash2, RotateCcw, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { clearAllNames } = useNames();

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsHeader />
          
          <View style={styles.content}>
            <SettingsSection title="Aparência">
              <SettingsItem
                title="Tema"
                description={theme === 'dark' ? 'Escuro' : 'Claro'}
                icon={theme === 'dark' ? Moon : Sun}
                onPress={toggleTheme}
                showArrow={false}
              />
            </SettingsSection>

            <SettingsSection title="Dados">
              <SettingsItem
                title="Limpar Lista de Nomes"
                description="Remove todos os nomes salvos"
                icon={Trash2}
                onPress={clearAllNames}
                showArrow={false}
                destructive
              />
              
              <SettingsItem
                title="Resetar Histórico"
                description="Limpa o histórico de sorteios"
                icon={RotateCcw}
                onPress={() => {}}
                showArrow={false}
              />
            </SettingsSection>

            <SettingsSection title="Sobre">
              <SettingsItem
                title="Informações do App"
                description="Versão 1.0.0 • Premium"
                icon={Info}
                onPress={() => {}}
                showArrow={false}
              />
            </SettingsSection>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
});