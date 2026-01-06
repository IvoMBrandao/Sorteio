import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { SortearType } from '../../types'; 

// --- IMPORTS DOS FORMULÁRIOS ---
import { NamesLotteryForm } from './NamesLotteryForm';
import { NumbersLotteryForm } from './NumbersLotteryForm';
import { SequenceLotteryForm } from './SequenceLotteryForm';
import { GroupsLotteryForm } from './GroupsLotteryForm';

interface SortearModalProps {
  visible: boolean;
  type: SortearType | null;
  onClose: () => void;
}

export function SortearModal({ visible, type, onClose }: SortearModalProps) {
  const { t } = useTranslation();
  
  const getTitle = () => {
    switch (type) {
      case 'names': return t('sortear.cards.namesTitle');
      case 'numbers': return t('sortear.cards.numbersTitle');
      case 'sequence': return t('sortear.cards.sequenceTitle');
      case 'groups': return t('sortear.cards.groupsTitle');
      default: return t('sortear.header.title');
    }
  };

  const getGradient = (): [string, string] => {
    switch (type) {
      case 'names': return ['#667eea', '#764ba2'];
      case 'numbers': return ['#f093fb', '#f5576c'];
      case 'sequence': return ['#4facfe', '#00f2fe'];
      case 'groups': return ['#8b5cf6', '#a78bfa'];
      default: return ['#667eea', '#764ba2'];
    }
  };

  const renderForm = () => {
    if (!type) return null;

    switch (type) {
      case 'names':
        return <NamesLotteryForm onClose={onClose} />;
      case 'numbers':
        return <NumbersLotteryForm onClose={onClose} />;
      case 'sequence':
        return <SequenceLotteryForm onClose={onClose} />;
      case 'groups':
        return <GroupsLotteryForm onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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

          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" // Importante para inputs em listas
          >
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