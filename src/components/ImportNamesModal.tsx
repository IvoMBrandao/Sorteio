import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTranslation } from 'react-i18next';
import { X, Download } from 'lucide-react-native';
import { useState } from 'react';

interface ImportNamesModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (names: string) => void;
}

export function ImportNamesModal({ visible, onClose, onImport }: ImportNamesModalProps) {
  const { t } = useTranslation();
  const [namesText, setNamesText] = useState('');

  const handleImport = () => {
    if (namesText.trim()) {
      onImport(namesText);
      setNamesText('');
      onClose();
    }
  };

  const handleClose = () => {
    setNamesText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('names.importModal.title')}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Text style={styles.instructionTitle}>
                {t('names.importModal.howToTitle')}
              </Text>
              <Text style={styles.instruction}>
                {t('names.importModal.instruction')}
              </Text>

              <Text style={styles.inputLabel}>
                {t('names.importModal.inputLabel')}
              </Text>
              <TextInput
                style={styles.textArea}
                placeholder={t('names.importModal.placeholder')}
                value={namesText}
                onChangeText={setNamesText}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                placeholderTextColor="#94a3b8"
              />

              <TouchableOpacity
                style={[styles.importButton, !namesText.trim() && styles.importButtonDisabled]}
                onPress={handleImport}
                disabled={!namesText.trim()}
              >
                <Download size={20} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.importButtonText}>
                  {t('names.importModal.button')}
                </Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 8,
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    minHeight: 200,
    marginBottom: 20,
  },
  importButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  importButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  importButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});