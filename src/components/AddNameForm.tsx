import { View, TextInput, TouchableOpacity, StyleSheet, Text, Keyboard, Alert } from 'react-native';
import { Plus, ListPlus } from 'lucide-react-native';
import { useState } from 'react';
import { SaveListModal } from './SaveListModal';
import { useNames } from '../hooks/useNames';

interface AddNameFormProps {
  onAddName: (name: string) => void;
}

export function AddNameForm({ onAddName }: AddNameFormProps) {
  // Pegamos o addList e o importNames do hook atualizado
  const { addList, importNames } = useNames(); 
  
  const [inputValue, setInputValue] = useState('');
  const [showSaveListModal, setShowSaveListModal] = useState(false);
  const [pendingNames, setPendingNames] = useState<string[]>([]);

  // Detecta se tem vírgula ou Enter
  const isList = inputValue.includes(',') || inputValue.includes('\n');

  // Limpa o texto cru e transforma em array
  const parseNames = (text: string) => {
    return text
      .split(/[\n,]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
  };

  const handlePressAdd = () => {
    if (!inputValue.trim()) return;

    if (!isList) {
      // Se for nome único, adiciona direto
      onAddName(inputValue.trim());
      setInputValue('');
      return;
    }

    // SE FOR UMA LISTA, PERGUNTA O QUE FAZER
    const namesFound = parseNames(inputValue);
    
    Alert.alert(
      'Lista Detectada',
      `Identificamos ${namesFound.length} nomes. O que deseja fazer?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Adicionar Individuais',
          onPress: () => {
            // Adiciona soltos na lista atual do sorteio
            importNames(inputValue);
            setInputValue('');
            Keyboard.dismiss();
          }
        },
        {
          text: 'Criar Nova Lista',
          onPress: () => {
            // Guarda os nomes temporariamente e abre o modal de nomear
            setPendingNames(namesFound);
            setShowSaveListModal(true);
          }
        }
      ]
    );
  };

  const handleSaveList = (listName: string) => {
    // Salva como uma lista separada
    addList(listName, pendingNames);
    
    setInputValue('');
    setPendingNames([]);
    setShowSaveListModal(false);
    Keyboard.dismiss();
    
    Alert.alert('Sucesso', `Lista "${listName}" criada com sucesso!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isList && styles.inputMultiline]}
          placeholder={isList ? "Lista detectada..." : "Adicionar nome (ou cole uma lista)"}
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
          Lista detectada. Clique para escolher como salvar.
        </Text>
      )}

      {/* MODAL APARECE QUANDO ESCOLHE "CRIAR LISTA" */}
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