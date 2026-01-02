import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { Play, Users, AlertCircle, List, CheckCircle2 } from 'lucide-react-native';
import { useNames } from '../hooks/useNames';
import { FormCard } from './FormCard';
import { NumberInput } from './NumberInput';
import { GroupsResultModal } from './GroupsResultModal';

interface GroupsLotteryFormProps {
  onClose: () => void;
}

export function GroupsLotteryForm({ onClose }: GroupsLotteryFormProps) {
  // 1. ACESSO AOS DADOS
  const { names: looseNames, savedLists } = useNames();
  
  // 2. ESTADOS
  const [selectedSourceId, setSelectedSourceId] = useState<string>('loose');
  const [membersPerGroup, setMembersPerGroup] = useState(2);
  const [distributeEvenly, setDistributeEvenly] = useState(true); // true = Um por um (Baralho)
  
  const [result, setResult] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 3. LÓGICA: DEFINE QUEM VAI PARTICIPAR
  const activeNames = useMemo(() => {
    if (selectedSourceId === 'loose') {
      return looseNames.map(n => n.value);
    } else {
      const list = savedLists.find(l => l.id === selectedSourceId);
      return list ? list.names : [];
    }
  }, [selectedSourceId, looseNames, savedLists]);

  // 4. LÓGICA: CÁLCULOS MATEMÁTICOS
  const calculationInfo = useMemo(() => {
    const totalNames = activeNames.length;
    if (totalNames === 0 || membersPerGroup === 0) return null;

    const totalGroups = Math.ceil(totalNames / membersPerGroup);
    const remainder = totalNames % membersPerGroup;
    
    return {
      totalGroups,
      remainder,
      hasImperfectGroup: remainder !== 0,
    };
  }, [activeNames.length, membersPerGroup]);

  // 5. FUNÇÃO DE SORTEIO
  const handleSortear = () => {
    const shuffled = [...activeNames].sort(() => Math.random() - 0.5);
    const groups: string[][] = [];
    const numGroups = calculationInfo?.totalGroups || 1;

    for (let i = 0; i < numGroups; i++) groups.push([]);

    if (distributeEvenly) {
      // Distribuição Intercalada
      shuffled.forEach((name, index) => {
        const groupIndex = index % numGroups;
        groups[groupIndex].push(name);
      });
    } else {
      // Distribuição Sequencial
      let currentGroup = 0;
      shuffled.forEach((name) => {
        if (groups[currentGroup].length >= membersPerGroup && currentGroup < numGroups - 1) {
          currentGroup++;
        }
        groups[currentGroup].push(name);
      });
    }

    setResult(groups.map(group => group.join(', ')));
    setShowResult(true);
  };

  const canSortear = activeNames.length >= 2 && membersPerGroup > 0;

  return (
    <View style={styles.container}>
      
      {/* SELEÇÃO DE FONTE */}
      <FormCard>
        <Text style={styles.sectionTitle}>Quem vai participar?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sourcesContainer}>
          <TouchableOpacity style={[styles.sourceCard, selectedSourceId === 'loose' && styles.selectedSourceCard]} onPress={() => setSelectedSourceId('loose')}>
            <View style={styles.sourceHeader}>
              <Users size={20} color={selectedSourceId === 'loose' ? '#fff' : '#64748b'} />
              {selectedSourceId === 'loose' && <CheckCircle2 size={18} color="#fff" />}
            </View>
            <View>
              <Text style={[styles.sourceTitle, selectedSourceId === 'loose' && styles.selectedSourceText]}>Nomes Avulsos</Text>
              <Text style={[styles.sourceCount, selectedSourceId === 'loose' && styles.selectedSourceText]}>{looseNames.length} pessoas</Text>
            </View>
          </TouchableOpacity>

          {savedLists.map(list => (
            <TouchableOpacity key={list.id} style={[styles.sourceCard, selectedSourceId === list.id && styles.selectedSourceCard]} onPress={() => setSelectedSourceId(list.id)}>
              <View style={styles.sourceHeader}>
                <List size={20} color={selectedSourceId === list.id ? '#fff' : '#64748b'} />
                {selectedSourceId === list.id && <CheckCircle2 size={18} color="#fff" />}
              </View>
              <View>
                <Text style={[styles.sourceTitle, selectedSourceId === list.id && styles.selectedSourceText]} numberOfLines={1}>{list.title}</Text>
                <Text style={[styles.sourceCount, selectedSourceId === list.id && styles.selectedSourceText]}>{list.names.length} pessoas</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FormCard>

      {/* CONFIGURAÇÃO */}
      <FormCard>
        <Text style={styles.sectionTitle}>Configuração</Text>
        <NumberInput label="Pessoas por grupo" value={membersPerGroup} onChangeValue={setMembersPerGroup} min={1} max={Math.max(activeNames.length, 1)} />
        {calculationInfo && activeNames.length > 0 && (
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Users size={16} color="#6366f1" />
              <Text style={styles.infoText}>Total: <Text style={styles.bold}>{activeNames.length}</Text> nomes → <Text style={styles.bold}>{calculationInfo.totalGroups}</Text> Grupos</Text>
            </View>
            {calculationInfo.hasImperfectGroup ? (
              <View style={[styles.infoRow, styles.warningRow]}>
                <AlertCircle size={16} color="#d97706" />
                <Text style={styles.warningText}>Sobra: <Text style={styles.bold}>{calculationInfo.remainder}</Text> pessoas no último grupo.</Text>
              </View>
            ) : (
              <Text style={styles.successText}>Divisão perfeita!</Text>
            )}
          </View>
        )}
        {activeNames.length === 0 && <Text style={styles.emptyWarning}>A lista selecionada está vazia. Adicione nomes antes.</Text>}

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Distribuir um por um</Text>
            <Text style={styles.subLabel}>Estilo baralho (intercalado)</Text>
          </View>
          <Switch value={distributeEvenly} onValueChange={setDistributeEvenly} trackColor={{ false: '#e2e8f0', true: '#6366f1' }} thumbColor={distributeEvenly ? '#ffffff' : '#94a3b8'} />
        </View>
      </FormCard>

      <TouchableOpacity style={[styles.sortearButton, !canSortear && styles.sortearButtonDisabled]} onPress={handleSortear} disabled={!canSortear}>
        <Play size={20} color="#ffffff" fill="#ffffff" />
        <Text style={styles.sortearButtonText}>Sortear Grupos</Text>
      </TouchableOpacity>

      <GroupsResultModal
        visible={showResult}
        result={result}
        onClose={() => setShowResult(false)}
        onNewDraw={() => { setShowResult(false); setTimeout(() => handleSortear(), 200); }}
        // AQUI ESTÁ A CORREÇÃO:
        // Se distributeEvenly for FALSO (desmarcado), então sequential é VERDADEIRO
        sequential={!distributeEvenly} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, paddingBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  sourcesContainer: { gap: 12, paddingRight: 10 },
  sourceCard: { width: 140, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, gap: 10, borderWidth: 2, borderColor: 'transparent', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  selectedSourceCard: { backgroundColor: '#8b5cf6', borderColor: '#7c3aed', shadowOpacity: 0.2, shadowColor: "#8b5cf6", elevation: 4 },
  sourceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sourceTitle: { fontWeight: '700', color: '#334155', fontSize: 14, marginBottom: 2 },
  sourceCount: { fontSize: 12, color: '#64748b' },
  selectedSourceText: { color: '#ffffff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8, marginBottom: 16 },
  label: { fontSize: 16, color: '#475569', fontWeight: '600' },
  subLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  infoBox: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 8, marginBottom: 16, gap: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  warningRow: { marginTop: 4 },
  infoText: { color: '#475569', fontSize: 14 },
  warningText: { color: '#d97706', fontSize: 13, flex: 1 },
  successText: { color: '#059669', fontSize: 13, marginTop: 4 },
  emptyWarning: { color: '#ef4444', fontStyle: 'italic', fontSize: 13, textAlign: 'center', marginBottom: 10 },
  bold: { fontWeight: '700' },
  sortearButton: { backgroundColor: '#8b5cf6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 12, marginTop: 12, shadowColor: "#8b5cf6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  sortearButtonDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0, elevation: 0 },
  sortearButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});