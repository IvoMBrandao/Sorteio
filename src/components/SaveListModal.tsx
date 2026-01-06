import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save } from 'lucide-react-native';

interface SaveListModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (listName: string) => void;
  itemCount: number;
}

export function SaveListModal({ visible, onClose, onSave, itemCount }: SaveListModalProps) {
  const { t } = useTranslation();
  const [listName, setListName] = useState('');

  const handleSave = () => {
    if (listName.trim()) {
      onSave(listName);
      setListName('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('names.saveModal.title')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {t('names.saveModal.subtitle', { count: itemCount })}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t('names.saveModal.placeholder')}
            placeholderTextColor="#94a3b8"
            value={listName}
            onChangeText={setListName}
            autoFocus
          />

          <TouchableOpacity 
            style={[styles.saveButton, !listName.trim() && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={!listName.trim()}
          >
            <Save size={20} color="#fff" />
            <Text style={styles.saveText}>
              {t('names.saveModal.saveButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});