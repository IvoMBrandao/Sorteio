import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';

interface AddNameFormProps {
  onAddName: (name: string) => void;
}

export function AddNameForm({ onAddName }: AddNameFormProps) {
  const [name, setName] = useState('');

  const handleAddName = () => {
    if (name.trim()) {
      onAddName(name);
      setName('');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Adicionar Nome</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um nome..."
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAddName}
          returnKeyType="done"
          placeholderTextColor="#94a3b8"
        />
        
        <TouchableOpacity
          style={[styles.addButton, !name.trim() && styles.addButtonDisabled]}
          onPress={handleAddName}
          disabled={!name.trim()}
        >
          <Plus size={20} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});