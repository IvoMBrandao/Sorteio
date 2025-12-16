import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Dice6, 
  Users, 
  Settings, 
  Moon, 
  Sun, 
  Trash2, 
  RotateCcw, 
  Info 
} from 'lucide-react-native';

// --- IMPORTS DOS SEUS COMPONENTES (Ajustados para ./src) ---
import { SortearHeader } from './src/components/SortearHeader';
import { SortearCard } from './src/components/SortearCard';
import { SortearModal } from './src/components/SortearModal';

// Imports da Tela de Nomes
import { NamesHeader } from './src/components/NamesHeader';
import { AddNameForm } from './src/components/AddNameForm';
import { NamesList } from './src/components/NamesList';
import { ImportNamesModal } from './src/components/ImportNamesModal';

// Imports da Tela de Configurações
import { SettingsHeader } from './src/components/SettingsHeader';
import { SettingsSection } from './src/components/SettingsSection';
import { SettingsItem } from './src/components/SettingsItem';

// Imports dos Hooks
import { useTheme } from './src/hooks/useTheme';
import { useNames } from './src/hooks/useNames';
import { SortearType } from './types'; // Verifique se o caminho está certo

// --- TELA 1: SORTEAR (Sua tela inicial) ---
function SortearScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortearType, setSortearType] = useState<SortearType | null>(null);
  
  // Tenta pegar o tema, se o hook falhar (sem provider), usa padrão 'light'
  const themeContext = tryUseTheme(); 
  const isDark = themeContext?.theme === 'dark';

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
      colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']} 
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SortearHeader />
          
          <View style={styles.cardsContainer}>
            <SortearCard
              title="Sorteio de Nomes"
              description="Sorteie nomes da sua lista salva"
              icon="users"
              gradient={['#667eea', '#764ba2']}
              onPress={() => handleOpenModal('names')}
            />
            <SortearCard
              title="Sorteio de Números"
              description="Sorteie números em um intervalo"
              icon="hash"
              gradient={['#f093fb', '#f5576c']}
              onPress={() => handleOpenModal('numbers')}
            />
            <SortearCard
              title="Sequência de Números"
              description="Gere uma sequência de números"
              icon="list"
              gradient={['#4facfe', '#00f2fe']}
              onPress={() => handleOpenModal('sequence')}
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

// --- TELA 2: NOMES (Código Integrado) ---
function NamesScreen() {
  const { names, addName, removeName, editName, clearAllNames, importNames } = useNames();
  const [importModalVisible, setImportModalVisible] = useState(false);

  // Tenta pegar o tema para o fundo
  const themeContext = tryUseTheme(); 
  const isDark = themeContext?.theme === 'dark';

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <NamesHeader 
          onImport={() => setImportModalVisible(true)}
          onClearAll={clearAllNames}
          hasNames={names.length > 0}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadded}>
            <AddNameForm onAddName={addName} />
            <NamesList 
              names={names}
              onRemoveName={removeName}
              onEditName={editName}
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

// --- TELA 3: CONFIGURAÇÕES (Código Integrado) ---
function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { clearAllNames } = useNames();

  const isDark = theme === 'dark';

  return (
    <LinearGradient
      colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <SettingsHeader />
          
          <View style={styles.contentPadded}>
            <SettingsSection title="Aparência">
              <SettingsItem
                title="Tema"
                description={isDark ? 'Escuro' : 'Claro'}
                icon={isDark ? Moon : Sun}
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

// --- CONFIGURAÇÃO DO MENU (TABS) ---
const Tab = createBottomTabNavigator();

// Função auxiliar para evitar erro se o ThemeProvider não estiver configurado
function tryUseTheme() {
  try {
    return useTheme();
  } catch (e) {
    return { theme: 'light' };
  }
}

export default function App() {
  // ⚠️ IMPORTANTE: Se você tiver ThemeProvider e NamesProvider, 
  // envolva o NavigationContainer com eles aqui.
  // Exemplo:
  // return (
  //   <ThemeProvider>
  //     <NamesProvider>
  //        <NavigationContainer> ... </NavigationContainer>
  //     </NamesProvider>
  //   </ThemeProvider>
  // )

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            height: 70,
            paddingBottom: 10,
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
            tabBarIcon: ({ color, size }) => (
              <Dice6 size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tab.Screen 
          name="Nomes" 
          component={NamesScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
        <Tab.Screen 
          name="Configurações" 
          component={SettingsScreen} 
          options={{
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
  },
  contentPadded: {
    padding: 20,
    gap: 20,
  },
});