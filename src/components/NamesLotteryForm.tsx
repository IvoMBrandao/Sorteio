import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { Play } from 'lucide-react-native';
import { useNames } from '../hooks/useNames';
import { useLottery } from '../hooks/useLottery';
import { FormCard } from './FormCard';
import { NumberInput } from './NumberInput';
import { ResultModal } from './ResultModal';

interface NamesLotteryFormProps {
  onClose: () => void;
}

export function NamesLotteryForm({ onClose }: NamesLotteryFormProps) {
  const { names } = useNames();
  const { sortearNames } = useLottery();
  
  // Estados de Lógica do Sorteio
  const [allowRepetition, setAllowRepetition] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Estados de Visualização (Novos)
  const [sequential, setSequential] = useState(true); // Padrão com suspense
  const [intervalSeconds, setIntervalSeconds] = useState(2); // 2 segs para ler o nome
  const [reverseOrder, setReverseOrder] = useState(false); // Começar do último

  const [result, setResult] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSortear = () => {
    const namesList = names.map(name => name.value);
    const sortedNames = sortearNames(namesList, {
      allowRepetition,
      quantity,
    });
    
    setResult(sortedNames);
    setShowResult(true);
  };

  const canSortear = names.length > 0 && quantity > 0;
  const maxQuantity = allowRepetition ? 50 : names.length;

  return (
    <View style={styles.container}>
      {/* CARD 1: CONFIGURAÇÕES GERAIS */}
      <FormCard>
        <Text style={styles.sectionTitle}>Configurações</Text>
        
        {/* Switch Repetição */}
        <View style={styles.row}>
          <Text style={styles.label}>Permitir repetição</Text>
          <Switch
            value={allowRepetition}
            onValueChange={setAllowRepetition}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={allowRepetition ? '#ffffff' : '#94a3b8'}
          />
        </View>

        {/* Input Quantidade */}
        <NumberInput
          label="Quantidade de sorteados"
          value={quantity}
          onChangeValue={setQuantity}
          min={1}
          max={maxQuantity}
        />

        {names.length === 0 && (
          <Text style={styles.warning}>
            Você precisa adicionar nomes na aba "Nomes" antes de sortear
          </Text>
        )}
      </FormCard>

      {/* CARD 2: CONFIGURAÇÕES DE EXIBIÇÃO (NOVO) */}
      <FormCard>
        <Text style={styles.sectionTitle}>Exibição do Resultado</Text>

        {/* Switch Sequencial */}
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

        {/* Input de Tempo (Só aparece se for sequencial) */}
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

        {/* Switch Inverter Ordem */}
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

      {/* CARD 3: LISTA PREVIEW */}
      <FormCard>
        <Text style={styles.sectionTitle}>Lista de Nomes ({names.length})</Text>
        {names.length > 0 ? (
          <View style={styles.namesList}>
            {names.slice(0, 5).map((name) => (
              <Text key={name.id} style={styles.nameItem}>
                • {name.value}
              </Text>
            ))}
            {names.length > 5 && (
              <Text style={styles.moreNames}>
                +{names.length - 5} mais...
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyMessage}>
            Nenhum nome foi adicionado ainda
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

      {/* MODAL DE RESULTADO (Passando as novas props) */}
      <ResultModal
        visible={showResult}
        type="names"
        result={result}
        sequential={sequential}       // <--- Novo
        intervalSeconds={intervalSeconds} // <--- Novo
        reverseOrder={reverseOrder}   // <--- Novo
        onClose={() => setShowResult(false)}
        onNewDraw={() => {
          setShowResult(false);
          // Pequeno delay para reiniciar
          setTimeout(() => handleSortear(), 200);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
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