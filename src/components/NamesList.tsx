import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Edit3, Trash2, Check, X } from 'lucide-react-native';
import { Name } from '../../types';
import { useState } from 'react';
import Animated, {
  Layout,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';

interface NamesListProps {
  names: Name[];
  onRemoveName: (id: string) => void;
  onEditName: (id: string, newValue: string) => void;
  onClearAll?: () => void; // <--- NOVA PROPRIEDADE OPCIONAL
}

export function NamesList({ names, onRemoveName, onEditName, onClearAll }: NamesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleEdit = (name: Name) => {
    setEditingId(name.id);
    setEditingValue(name.value);
  };

  const handleSaveEdit = () => {
    if (editingId && editingValue.trim()) {
      onEditName(editingId, editingValue);
      setEditingId(null);
      setEditingValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleRemove = (name: Name) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja remover "${name.value}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onRemoveName(name.id) },
      ]
    );
  };

  // Nova função para limpar tudo com confirmação
  const handleClearAll = () => {
    if (!onClearAll) return;
    Alert.alert(
      'Limpar Lista',
      'Tem certeza que deseja apagar TODOS os nomes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar Tudo', style: 'destructive', onPress: onClearAll },
      ]
    );
  };

  if (names.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Sua lista está vazia</Text>
        <Text style={styles.emptySubtext}>
          Adicione nomes um por um ou cole uma lista separada por vírgulas.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER DA LISTA COM BOTÃO LIMPAR */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Lista de Nomes ({names.length})</Text>
        {onClearAll && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>Limpar</Text>
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.list}>
        {names.map((name, index) => (
          <Animated.View
            key={name.id}
            entering={SlideInRight.delay(index * 50)}
            exiting={SlideOutLeft}
            layout={Layout.springify()}
            style={styles.nameItem}
          >
            {editingId === name.id ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editingValue}
                  onChangeText={setEditingValue}
                  onSubmitEditing={handleSaveEdit}
                  autoFocus
                  selectTextOnFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                    <Check size={16} color="#ffffff" strokeWidth={2.5} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                    <X size={16} color="#ffffff" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{name.value}</Text>
                <View style={styles.nameActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit(name)}
                  >
                    <Edit3 size={16} color="#6366f1" strokeWidth={2.5} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemove(name)}
                  >
                    <Trash2 size={16} color="#ef4444" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  nameItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  nameActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  editInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    width: 40,
    height: 40,
    backgroundColor: '#10b981',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});