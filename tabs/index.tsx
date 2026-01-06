import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

// Componentes Locais
import { SortearHeader } from '../src/components/SortearHeader';
import { SortearCard } from '../src/components/SortearCard';
import { SortearModal } from '../src/components/SortearModal';

// Hooks e Types
import { useTheme } from '../src/hooks/useTheme';
import { SortearType } from '../types';

export default function SortearScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
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

  // Definição das cores de fundo baseadas no tema
  const backgroundColors = theme === 'dark' 
    ? (['#1a1a2e', '#16213e'] as const) 
    : (['#667eea', '#764ba2'] as const);

  return (
    <LinearGradient
      colors={backgroundColors}
      style={styles.container}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SortearHeader />
          
          <View style={styles.cardsContainer}>
            {/* Card: Nomes */}
            <SortearCard
              title={t('sortear.names.title')}
              description={t('sortear.names.description')}
              icon="users"
              gradient={['#667eea', '#764ba2']}
              onPress={() => handleOpenModal('names')}
            />
            
            {/* Card: Números */}
            <SortearCard
              title={t('sortear.numbers.title')}
              description={t('sortear.numbers.description')}
              icon="hash"
              gradient={['#f093fb', '#f5576c']}
              onPress={() => handleOpenModal('numbers')}
            />
            
            {/* Card: Sequência */}
            <SortearCard
              title={t('sortear.sequence.title')}
              description={t('sortear.sequence.description')}
              icon="list"
              gradient={['#4facfe', '#00f2fe']}
              onPress={() => handleOpenModal('sequence')}
            />

            {/* Card: Grupos (Adicionado conforme seu JSON) */}
            <SortearCard
              title={t('sortear.groups.title')}
              description={t('sortear.groups.description')}
              icon="grid"
              gradient={['#43e97b', '#38f9d7']}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  cardsContainer: {
    padding: 20,
    gap: 16,
  },
});