import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun, Trash2, RotateCcw, Info, Languages } from 'lucide-react-native';

// i18n
import { useTranslation } from 'react-i18next';
import '../config/i18n'; // Importa a configuração

import { SettingsHeader } from '../src/components/SettingsHeader';
import { SettingsSection } from '../src/components/SettingsSection';
import { SettingsItem } from '../src/components/SettingsItem';
import { useTheme } from '../src/hooks/useTheme';
import { useNames } from '../src/hooks/useNames';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { clearAllNames } = useNames();

  const currentLanguage = i18n.language;

  // Função para alternar idioma com persistência automática via detector
  const toggleLanguage = async () => {
    const nextLanguage = currentLanguage.startsWith('pt') ? 'en' : 'pt';
    await i18n.changeLanguage(nextLanguage);
  };

  const handleResetHistory = () => {
    Alert.alert(
      t('settings.items.resetHistory.title'),
      t('settings.items.resetHistory.description'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.remove'), 
          style: 'destructive', 
          onPress: () => { /* Chamar seu hook de histórico aqui */ } 
        }
      ]
    );
  };

  const handleClearNames = () => {
    Alert.alert(
      t('names.list.clearTitle'),
      t('names.list.clearMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.remove'), style: 'destructive', onPress: clearAllNames }
      ]
    );
  };

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsHeader />
          
          <View style={styles.content}>
            {/* APARÊNCIA */}
            <SettingsSection title={t('settings.sections.appearance')}>
              <SettingsItem
                title={t('settings.items.theme.title')}
                description={theme === 'dark' ? t('settings.items.theme.dark') : t('settings.items.theme.light')}
                icon={theme === 'dark' ? Moon : Sun}
                onPress={toggleTheme}
                showArrow={false}
              />
            </SettingsSection>

            {/* IDIOMA - PERSISTENTE */}
            <SettingsSection title={t('settings.sections.language')}>
              <SettingsItem
                title={t('settings.items.language.title')}
                description={currentLanguage.startsWith('pt') ? t('settings.items.language.portuguese') : t('settings.items.language.english')}
                icon={Languages}
                onPress={toggleLanguage}
                showArrow={true}
              />
            </SettingsSection>

            {/* DADOS */}
            <SettingsSection title={t('settings.sections.data')}>
              <SettingsItem
                title={t('settings.items.clearNames.title')}
                description={t('settings.items.clearNames.description')}
                icon={Trash2}
                onPress={handleClearNames}
                showArrow={false}
                destructive
              />
              
              <SettingsItem
                title={t('settings.items.resetHistory.title')}
                description={t('settings.items.resetHistory.description')}
                icon={RotateCcw}
                onPress={handleResetHistory}
                showArrow={false}
              />
            </SettingsSection>

            {/* SOBRE */}
            <SettingsSection title={t('settings.sections.about')}>
              <SettingsItem
                title={t('settings.items.appInfo.title')}
                description={t('settings.items.appInfo.description')}
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
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 20, gap: 24, paddingBottom: 40 },
});