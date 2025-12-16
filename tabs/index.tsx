import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SortearHeader } from '../src/components/SortearHeader';
import { SortearCard } from '../src/components/SortearCard';
import { SortearModal } from '../src/components/SortearModal';
import { useState } from 'react';
import { SortearType } from '../types';

export default function SortearScreen() {
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
      colors={['#667eea', '#764ba2']}
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
});