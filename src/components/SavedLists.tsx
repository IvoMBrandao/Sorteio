import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Trash2, FolderOpen, CornerDownRight, Edit2 } from 'lucide-react-native';
import { SavedList } from '../../types';
import { useState } from 'react';
import { EditListModal } from './EditListModal';

interface SavedListsProps {
  lists: SavedList[];
  onDelete: (id: string) => void;
  onLoad: (list: SavedList) => void;
  onUpdate: (id: string, newTitle: string, newNames: string[]) => void;
}

export function SavedLists({ lists, onDelete, onLoad, onUpdate }: SavedListsProps) {
  const [editingList, setEditingList] = useState<SavedList | null>(null);

  if (!lists || lists.length === 0) return null;

  const handleDelete = (list: SavedList) => {
    Alert.alert('Apagar Lista', `Apagar "${list.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => onDelete(list.id) }
    ]);
  };

  const handleLoad = (list: SavedList) => {
    Alert.alert('Carregar', `Adicionar nomes de "${list.title}" à lista atual?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Adicionar', onPress: () => onLoad(list) }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Listas Salvas ({lists.length})</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {lists.map((list) => (
          <View key={list.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <FolderOpen size={20} color="#6366f1" />
              <View style={{flexDirection: 'row', gap: 8}}>
                <TouchableOpacity onPress={() => setEditingList(list)}>
                  <Edit2 size={18} color="#64748b" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(list)}>
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View>
              <Text style={styles.cardTitle} numberOfLines={1}>{list.title}</Text>
              <Text style={styles.cardCount}>{list.names.length} nomes</Text>
            </View>

            <TouchableOpacity style={styles.loadButton} onPress={() => handleLoad(list)}>
              <CornerDownRight size={16} color="#fff" />
              <Text style={styles.loadButtonText}>Usar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <EditListModal 
        visible={!!editingList} 
        list={editingList} 
        onClose={() => setEditingList(null)} 
        onSave={onUpdate} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12, marginLeft: 4 },
  scrollContent: { gap: 12, paddingRight: 20 },
  card: { backgroundColor: '#fff', width: 140, padding: 12, borderRadius: 16, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  cardCount: { fontSize: 12, color: '#64748b' },
  loadButton: { backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 8, gap: 6 },
  loadButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' }
});