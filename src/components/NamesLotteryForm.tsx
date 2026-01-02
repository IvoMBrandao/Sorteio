import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { Play, Users, List, CheckCircle2 } from 'lucide-react-native';
import { useNames } from '../hooks/useNames';
import { useLottery } from '../hooks/useLottery';
import { FormCard } from './FormCard';
import { NumberInput } from './NumberInput';
import { ResultModal } from './ResultModal';

interface NamesLotteryFormProps {
  onClose: () => void;
}

export function NamesLotteryForm({ onClose }: NamesLotteryFormProps) {
  // 1. DADOS: Pegamos nomes avulsos E listas salvas
  const { names: looseNames, savedLists } = useNames();
  const { sortearNames } = useLottery();
  
  // 2. ESTADOS
  // Controle da Fonte (Avulso ou Lista Salva)
  const [selectedSourceId, setSelectedSourceId] = useState<string>('loose');

  // Lógica do Sorteio
  const [allowRepetition, setAllowRepetition] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Visualização
  const [sequential, setSequential] = useState(true);
  const [intervalSeconds, setIntervalSeconds] = useState(2);
  const [reverseOrder, setReverseOrder] = useState(false);

  const [result, setResult] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 3. COMPUTADO: Define qual lista de nomes usar
  const activeNames = useMemo(() => {
    if (selectedSourceId === 'loose') {
      return looseNames.map(n => n.value);
    } else {
      const list = savedLists.find(l => l.id === selectedSourceId);
      return list ? list.names : [];
    }
  }, [selectedSourceId, looseNames, savedLists]);

  // 4. AÇÃO DE SORTEAR
  const handleSortear = () => {
    // Usa activeNames em vez de apenas looseNames
    const sortedNames = sortearNames(activeNames, {
      allowRepetition,
      quantity,
    });
    
    setResult(sortedNames);
    setShowResult(true);
  };

  const canSortear = activeNames.length > 0 && quantity > 0;
  // Se permitir repetição, limite é 50, senão é o tamanho da lista atual
  const maxQuantity = allowRepetition ? 50 : Math.max(activeNames.length, 1);

  return (
    <View style={styles.container}>
      
      {/* --- SEÇÃO 1: SELETOR DE FONTE (QUEM VAI PARTICIPAR?) --- */}
      <FormCard>
        <Text style={styles.sectionTitle}>Quem vai participar?</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.sourcesContainer}
        >
          {/* Card: Nomes Avulsos */}
          <TouchableOpacity 
            style={[styles.sourceCard, selectedSourceId === 'loose' && styles.selectedSourceCard]}
            onPress={() => {
              setSelectedSourceId('loose');
              setQuantity(1); // Reseta quantidade ao trocar
            }}
          >
            <View style={styles.sourceHeader}>
              <Users size={20} color={selectedSourceId === 'loose' ? '#fff' : '#64748b'} />
              {selectedSourceId === 'loose' && <CheckCircle2 size={18} color="#fff" />}
            </View>
            <View>
              <Text style={[styles.sourceTitle, selectedSourceId === 'loose' && styles.selectedSourceText]}>
                Nomes Avulsos
              </Text>
              <Text style={[styles.sourceCount, selectedSourceId === 'loose' && styles.selectedSourceText]}>
                {looseNames.length} nomes
              </Text>
            </View>
          </TouchableOpacity>

          {/* Cards: Listas Salvas */}
          {savedLists.map(list => (
            <TouchableOpacity 
              key={list.id}
              style={[styles.sourceCard, selectedSourceId === list.id && styles.selectedSourceCard]}
              onPress={() => {
                setSelectedSourceId(list.id);
                setQuantity(1); // Reseta quantidade ao trocar
              }}
            >
              <View style={styles.sourceHeader}>
                <List size={20} color={selectedSourceId === list.id ? '#fff' : '#64748b'} />
                {selectedSourceId === list.id && <CheckCircle2 size={18} color="#fff" />}
              </View>
              <View>
                <Text style={[styles.sourceTitle, selectedSourceId === list.id && styles.selectedSourceText]} numberOfLines={1}>
                  {list.title}
                </Text>
                <Text style={[styles.sourceCount, selectedSourceId === list.id && styles.selectedSourceText]}>
                  {list.names.length} nomes
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </FormCard>

      {/* --- SEÇÃO 2: CONFIGURAÇÕES --- */}
      <FormCard>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Permitir repetição</Text>
          <Switch
            value={allowRepetition}
            onValueChange={setAllowRepetition}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={allowRepetition ? '#ffffff' : '#94a3b8'}
          />
        </View>

        <NumberInput
          label="Quantidade de sorteados"
          value={quantity}
          onChangeValue={setQuantity}
          min={1}
          max={maxQuantity} // Máximo dinâmico baseado na lista selecionada
        />

        {activeNames.length === 0 && (
          <Text style={styles.warning}>
            A lista selecionada está vazia. Adicione nomes antes.
          </Text>
        )}
      </FormCard>

      {/* --- SEÇÃO 3: EXIBIÇÃO --- */}
      <FormCard>
        <Text style={styles.sectionTitle}>Exibição do Resultado</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Revelar um por um</Text>
            <Text style={styles.subLabel}>Cria suspense no resultado</Text>
          </View>
          <Switch
            value={sequential}
            onValueChange={setSequential}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={sequential ? '#ffffff' : '#94a3b8'}
          />
        </View>

        {sequential && (
          <View style={{ marginBottom: 16 }}>
            <NumberInput
              label="Segundos entre nomes"
              value={intervalSeconds}
              onChangeValue={setIntervalSeconds}
              min={1}
              max={10}
            />
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
           <View>
            <Text style={styles.label}>Começar do último</Text>
            <Text style={styles.subLabel}>Ideal para pódios (3º, 2º, 1º)</Text>
          </View>
          <Switch
            value={reverseOrder}
            onValueChange={setReverseOrder}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={reverseOrder ? '#ffffff' : '#94a3b8'}
          />
        </View>
      </FormCard>

      {/* --- SEÇÃO 4: PREVIEW DA LISTA SELECIONADA --- */}
      <FormCard>
        <Text style={styles.sectionTitle}>
          Lista Selecionada ({activeNames.length})
        </Text>
        {activeNames.length > 0 ? (
          <View style={styles.namesList}>
            {activeNames.slice(0, 5).map((name, index) => (
              <Text key={`${index}-${name}`} style={styles.nameItem}>
                • {name}
              </Text>
            ))}
            {activeNames.length > 5 && (
              <Text style={styles.moreNames}>
                +{activeNames.length - 5} mais...
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyMessage}>
            Nenhum nome encontrado nesta lista
          </Text>
        )}
      </FormCard>

      {/* BOTÃO SORTEAR */}
      <TouchableOpacity
        style={[styles.sortearButton, !canSortear && styles.sortearButtonDisabled]}
        onPress={handleSortear}
        disabled={!canSortear}
      >
        <Play size={20} color="#ffffff" fill="#ffffff" />
        <Text style={styles.sortearButtonText}>Sortear Nomes</Text>
      </TouchableOpacity>

      <ResultModal
        visible={showResult}
        type="names"
        result={result}
        sequential={sequential}
        intervalSeconds={intervalSeconds}
        reverseOrder={reverseOrder}
        onClose={() => setShowResult(false)}
        onNewDraw={() => {
          setShowResult(false);
          setTimeout(() => handleSortear(), 200);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  
  // --- Estilos do Carrossel (Copiados para consistência) ---
  sourcesContainer: { gap: 12, paddingRight: 10 },
  sourceCard: { 
    width: 140, 
    backgroundColor: '#f8fafc', 
    borderRadius: 12, 
    padding: 12, 
    gap: 10, 
    borderWidth: 2, 
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  selectedSourceCard: { 
    backgroundColor: '#6366f1', // Azul/Roxo para diferenciar do roxo de Grupos
    borderColor: '#4f46e5', 
    shadowOpacity: 0.2, 
    shadowColor: "#6366f1", 
    elevation: 4 
  },
  sourceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sourceTitle: { fontWeight: '700', color: '#334155', fontSize: 14, marginBottom: 2 },
  sourceCount: { fontSize: 12, color: '#64748b' },
  selectedSourceText: { color: '#ffffff' },

  // --- Estilos Gerais ---
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  warning: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  namesList: {
    gap: 8,
  },
  nameItem: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  moreNames: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sortearButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sortearButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },
  sortearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});