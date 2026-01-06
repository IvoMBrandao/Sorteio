import { View, TextInput, TouchableOpacity, StyleSheet, Text, Keyboard, Alert } from 'react-native';
import { Plus, ListPlus } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Adicionado para tradução
import { SaveListModal } from './SaveListModal';
import { useNames } from '../hooks/useNames';

interface AddNameFormProps {
  onAddName: (name: string) => void;
}

// ✅ Exportação exata para resolver o erro no App.tsx
export function AddNameForm({ onAddName }: AddNameFormProps) {
  const { t } = useTranslation();
  const { addList, importNames } = useNames(); 
  
  const [inputValue, setInputValue] = useState('');
  const [showSaveListModal, setShowSaveListModal] = useState(false);
  const [pendingNames, setPendingNames] = useState<string[]>([]);

  const isList = inputValue.includes(',') || inputValue.includes('\n');

  const parseNames = (text: string) => {
    return text
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
  };

  const handlePressAdd = () => {
    if (!inputValue.trim()) return;

    if (!isList) {
      onAddName(inputValue.trim());
      setInputValue('');
      return;
    }

    const namesFound = parseNames(inputValue);
    
    Alert.alert(
      t('names.import.alertTitle'),
      t('names.import.alertMessage', { count: namesFound.length }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('names.import.addIndividual'),
          onPress: () => {
            importNames(inputValue);
            setInputValue('');
            Keyboard.dismiss();
          }
        },
        {
          text: t('names.import.createList'),
          onPress: () => {
            setPendingNames(namesFound);
            setShowSaveListModal(true);
          }
        }
      ]
    );
  };

  const handleSaveList = (listName: string) => {
    addList(listName, pendingNames);
    
    setInputValue('');
    setPendingNames([]);
    setShowSaveListModal(false);
    Keyboard.dismiss();
    
    Alert.alert(t('common.success'), t('names.import.listCreated', { name: listName }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isList && styles.inputMultiline]}
          placeholder={isList ? t('names.import.listDetected') : t('names.import.placeholder')}
          placeholderTextColor="#94a3b8"
          value={inputValue}
          onChangeText={setInputValue}
          multiline={true}
        />
        <TouchableOpacity 
          style={[styles.addButton, isList && styles.addButtonList]} 
          onPress={handlePressAdd}
          activeOpacity={0.7}
        >
          {isList ? (
            <ListPlus size={24} color="#ffffff" strokeWidth={2.5} />
          ) : (
            <Plus size={24} color="#ffffff" strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </View>
      
      {isList && (
        <Text style={styles.helperText}>
          {t('names.import.helper')}
        </Text>
      )}

      <SaveListModal 
        visible={showSaveListModal}
        itemCount={pendingNames.length}
        onClose={() => setShowSaveListModal(false)}
        onSave={handleSaveList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 56,
  },
  inputMultiline: {
    borderColor: '#6366f1',
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: '#10b981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonList: {
    backgroundColor: '#6366f1',
    height: 80,
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
    fontStyle: 'italic',
  }
});