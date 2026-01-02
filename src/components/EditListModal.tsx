import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus } from 'lucide-react-native';
import { SavedList } from '../../types';

interface EditListModalProps {
  visible: boolean;
  list: SavedList | null;
  onClose: () => void;
  onSave: (id: string, newTitle: string, newNames: string[]) => void;
}

export function EditListModal({ visible, list, onClose, onSave }: EditListModalProps) {
  const [title, setTitle] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [newNameInput, setNewNameInput] = useState('');

  useEffect(() => {
    if (list) {
      setTitle(list.title);
      setNames(list.names);
    }
  }, [list]);

  const handleRemoveName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddInside = () => {
    if (newNameInput.trim()) {
      setNames([...names, newNameInput.trim()]);
      setNewNameInput('');
    }
  };

  const handleSave = () => {
    if (list && title.trim()) {
      onSave(list.id, title, names);
      onClose();
    }
  };

  if (!list) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Lista</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color="#64748b" /></TouchableOpacity>
          </View>

          <View style={{gap: 8}}>
            <Text style={styles.label}>Nome da Lista</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          </View>

          <View style={{flex: 1, gap: 8}}>
            <Text style={styles.label}>Integrantes ({names.length})</Text>
            
            <View style={styles.addRow}>
              <TextInput 
                style={[styles.input, {flex:1}]} 
                placeholder="Adicionar nome..." 
                value={newNameInput}
                onChangeText={setNewNameInput}
                onSubmitEditing={handleAddInside}
              />
              <TouchableOpacity onPress={handleAddInside} style={styles.miniAdd}>
                <Plus size={20} color="#fff"/>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.listArea}>
              {names.map((name, index) => (
                <View key={index} style={styles.nameItem}>
                  <Text style={styles.nameText}>{name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveName(index)}>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#fff" />
            <Text style={styles.saveText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  container: { backgroundColor: '#fff', borderRadius: 16, padding: 20, height: '80%', gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  label: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  input: { backgroundColor: '#f1f5f9', borderRadius: 8, padding: 12, fontSize: 16, color: '#1e293b', borderWidth: 1, borderColor: '#e2e8f0' },
  addRow: { flexDirection: 'row', gap: 8 },
  miniAdd: { backgroundColor: '#10b981', width: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  listArea: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: 12 },
  nameItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  nameText: { fontSize: 16, color: '#334155' },
  saveButton: { backgroundColor: '#6366f1', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 12, gap: 8 },
  saveText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});