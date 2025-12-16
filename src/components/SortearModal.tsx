
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { SortearType } from '../../types';
import { NamesLotteryForm } from './NamesLotteryForm';
import { NumbersLotteryForm } from './NumbersLotteryForm';
import { SequenceLotteryForm } from './SequenceLotteryForm';

interface SortearModalProps {
  visible: boolean;
  type: SortearType | null;
  onClose: () => void;
}

export function SortearModal({ visible, type, onClose }: SortearModalProps) {
  const getTitle = () => {
    switch (type) {
      case 'names':
        return 'Sorteio de Nomes';
      case 'numbers':
        return 'Sorteio de Números';
      case 'sequence':
        return 'Sequência de Números';
      default:
        return '';
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'names':
        return ['#667eea', '#764ba2'];
      case 'numbers':
        return ['#f093fb', '#f5576c'];
      case 'sequence':
        return ['#4facfe', '#00f2fe'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'names':
        return <NamesLotteryForm onClose={onClose} />;
      case 'numbers':
        return <NumbersLotteryForm onClose={onClose} />;
      case 'sequence':
        return <SequenceLotteryForm onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient colors={getGradient()} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>{getTitle()}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="#ffffff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderForm()}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
});