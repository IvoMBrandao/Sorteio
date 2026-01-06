import React, { useState } from 'react';
import './src/i18n';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { 
  Dice6, 
  Users, 
  Settings, 
  Moon, 
  Sun, 
  Trash2, 
  RotateCcw, 
  Info,
  Languages,
  Hash,
  List
} from 'lucide-react-native';

// --- IMPORTS DOS COMPONENTES ---
import { SortearHeader } from './src/components/SortearHeader';
import { SortearCard } from './src/components/SortearCard';
import { SortearModal } from './src/components/SortearModal';
import { NamesHeader } from './src/components/NamesHeader';
import { AddNameForm } from './src/components/AddNameForm';
import { NamesList } from './src/components/NamesList';
import { SavedLists } from './src/components/SavedLists'; 
import { ImportNamesModal } from './src/components/ImportNamesModal';
import { SettingsHeader } from './src/components/SettingsHeader';
import { SettingsSection } from './src/components/SettingsSection';
import { SettingsItem } from './src/components/SettingsItem';

// --- IMPORTS DOS HOOKS ---
import { useTheme } from './src/hooks/useTheme';
import { useNames } from './src/hooks/useNames';
import { SortearType } from './types'; 

const Tab = createBottomTabNavigator();

// --- TELA 1: SORTEAR ---
function SortearScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [modalVisible, setModalVisible] = useState(false);
  const [sortearType, setSortearType] = useState<SortearType | null>(null);

  const handleOpenModal = (type: SortearType) => {
    setSortearType(type);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSortearType(null);
  };

  return (
    <LinearGradient 
      colors={isDark ? ['#1a1a2e', '#16213e'] as const : ['#667eea', '#764ba2'] as const} 
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SortearHeader />
          
          <View style={styles.cardsContainer}>
            <SortearCard
              title={t('sortear.names.title')}
              description={t('sortear.names.description')}
              icon="users"
              gradient={['#667eea', '#764ba2'] as const}
              onPress={() => handleOpenModal('names')}
            />
            <SortearCard
              title={t('sortear.numbers.title')}
              description={t('sortear.numbers.description')}
              icon="hash"
              gradient={['#f093fb', '#f5576c'] as const}
              onPress={() => handleOpenModal('numbers')}
            />
            <SortearCard
              title={t('sortear.sequence.title')}
              description={t('sortear.sequence.description')}
              icon="list"
              gradient={['#4facfe', '#00f2fe'] as const}
              onPress={() => handleOpenModal('sequence')}
            />
            <SortearCard
              title={t('sortear.groups.title')}
              description={t('sortear.groups.description')}
              icon="grid" 
              gradient={['#8b5cf6', '#a78bfa'] as const}
              onPress={() => handleOpenModal('groups')}
            />
          </View>
        </ScrollView>

        <SortearModal
          visible={modalVisible}
          type={sortearType}
          onClose={handleCloseModal}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- TELA 2: NOMES ---
function NamesScreen() {
  const { t } = useTranslation();
  const { 
    names, addName, removeName, editName, 
    clearAllNames, importNames, savedLists, 
    removeList, updateList 
  } = useNames();
  
  const [importModalVisible, setImportModalVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLoadList = (list: any) => {
    const namesText = list.names.join('\n');
    importNames(namesText);
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e'] as const : ['#667eea', '#764ba2'] as const}
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <NamesHeader 
          onImport={() => setImportModalVisible(true)}
          onClearAll={clearAllNames}
          hasNames={names.length > 0}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadded}>
            <AddNameForm onAddName={addName} />
            <SavedLists 
              lists={savedLists} 
              onDelete={removeList} 
              onLoad={handleLoadList}
              onUpdate={updateList} 
            />
            <NamesList 
              names={names}
              onRemoveName={removeName}
              onEditName={editName}
              onClearAll={clearAllNames}
            />
          </View>
        </ScrollView>

        <ImportNamesModal
          visible={importModalVisible}
          onClose={() => setImportModalVisible(false)}
          onImport={importNames}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

// --- TELA 3: CONFIGURAÇÕES ---
function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { clearAllNames } = useNames();
  const isDark = theme === 'dark';

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('pt') ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
  };

  const handleResetHistory = () => {
    Alert.alert(t('common.confirm'), t('settings.items.resetHistory.description'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.remove'), style: 'destructive' }
    ]);
  };

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e'] as const : ['#667eea', '#764ba2'] as const}
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsHeader />
          <View style={styles.contentPadded}>
            
            <SettingsSection title={t('settings.sections.appearance')}>
              <SettingsItem
                title={t('settings.items.theme.title')}
                description={isDark ? t('settings.items.theme.dark') : t('settings.items.theme.light')}
                icon={isDark ? Moon : Sun}
                onPress={toggleTheme}
                showArrow={false}
              />
            </SettingsSection>

            <SettingsSection title={t('settings.sections.language')}>
              <SettingsItem
                title={t('settings.items.language.title')}
                description={i18n.language.startsWith('pt') ? "Português" : "English"}
                icon={Languages}
                onPress={toggleLanguage}
                showArrow={true}
              />
            </SettingsSection>

            <SettingsSection title={t('settings.sections.data')}>
              <SettingsItem
                title={t('settings.items.clearNames.title')}
                description={t('settings.items.clearNames.description')}
                icon={Trash2}
                onPress={clearAllNames}
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

// --- MENU PRINCIPAL (TABS) ---
export default function App() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <NavigationContainer>
      <Tab.Navigator
        id="MainTabNavigator" // Correção do erro de ID do TS
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: isDark ? '#818cf8' : '#6366f1',
          tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
          tabBarStyle: {
            backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
            borderTopWidth: 0,
            elevation: 8,
            height: Platform.OS === 'ios' ? 85 : 70,
            paddingBottom: Platform.OS === 'ios' ? 25 : 12,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Sortear" 
          component={SortearScreen} 
          options={{
            title: t('header.title'),
            tabBarIcon: ({ color, size }) => (
              <Dice6 size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tab.Screen 
          name="Nomes" 
          component={NamesScreen} 
          options={{
            title: t('names.header.title'),
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tab.Screen 
          name="Configurações" 
          component={SettingsScreen} 
          options={{
            title: t('settings.header.title'),
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  cardsContainer: { padding: 20, gap: 16 },
  contentPadded: { padding: 20, gap: 20 },
});