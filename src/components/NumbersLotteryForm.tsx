import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { Play } from 'lucide-react-native';
import { useLottery } from '../hooks/useLottery';
import { FormCard } from './FormCard';
import { NumberInput } from './NumberInput';
import { ResultModal } from './ResultModal';

interface NumbersLotteryFormProps {
  onClose: () => void;
}

export function NumbersLotteryForm({ onClose }: NumbersLotteryFormProps) {
  const { sortearNumbers } = useLottery();

  const [allowRepetition, setAllowRepetition] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);

  const [result, setResult] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 🔥 opções novas
  const [sequential, setSequential] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(2);
  const [reverseOrder, setReverseOrder] = useState(false);

  const handleSortear = () => {
    const sortedNumbers = sortearNumbers({
      allowRepetition,
      quantity,
      minValue,
      maxValue,
    });

    setResult(sortedNumbers);
    setShowResult(true);
  };

  const canSortear = quantity > 0 && minValue <= maxValue;
  const range = maxValue - minValue + 1;
  const maxQuantity = allowRepetition ? 50 : range;

  return (
    <View style={styles.container}>
      <FormCard>
        <Text style={styles.sectionTitle}>Intervalo</Text>

        <View style={styles.row}>
          <NumberInput
            label="Mínimo"
            value={minValue}
            onChangeValue={setMinValue}
            min={-9999}
            max={9999}
            style={{ flex: 1, marginRight: 8 }}
          />
          <NumberInput
            label="Máximo"
            value={maxValue}
            onChangeValue={setMaxValue}
            min={-9999}
            max={9999}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </FormCard>

      <FormCard>
        <Text style={styles.sectionTitle}>Configurações</Text>

        <View style={styles.switchRow}>
          <Text style={styles.label}>Permitir repetição</Text>
          <Switch
            value={allowRepetition}
            onValueChange={setAllowRepetition}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={allowRepetition ? '#ffffff' : '#94a3b8'}
          />
        </View>

        <NumberInput
          label="Quantidade de números"
          value={quantity}
          onChangeValue={setQuantity}
          min={1}
          max={maxQuantity}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Mostrar números um por um</Text>
          <Switch
            value={sequential}
            onValueChange={setSequential}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={sequential ? '#ffffff' : '#94a3b8'}
          />
        </View>

        {sequential && (
          <>
            <NumberInput
              label="Intervalo (segundos)"
              value={intervalSeconds}
              onChangeValue={setIntervalSeconds}
              min={1}
              max={10}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>
                Começar do último para o primeiro
              </Text>
              <Switch
                value={reverseOrder}
                onValueChange={setReverseOrder}
                trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
                thumbColor={reverseOrder ? '#ffffff' : '#94a3b8'}
              />
            </View>
          </>
        )}

        {!allowRepetition && quantity > range && range > 0 && (
          <Text style={styles.warning}>
            Quantidade não pode ser maior que o intervalo ({range}) sem repetição
          </Text>
        )}
      </FormCard>

      <TouchableOpacity
        style={[
          styles.sortearButton,
          !canSortear && styles.sortearButtonDisabled,
        ]}
        onPress={handleSortear}
        disabled={!canSortear}
      >
        <Play size={20} color="#ffffff" fill="#ffffff" />
        <Text style={styles.sortearButtonText}>Sortear Números</Text>
      </TouchableOpacity>

      <ResultModal
        visible={showResult}
        type="numbers"
        result={result}
        sequential={sequential}
        intervalSeconds={intervalSeconds}
        reverseOrder={reverseOrder}
        onClose={() => setShowResult(false)}
        onNewDraw={() => {
          setShowResult(false);
          handleSortear();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  row: { flexDirection: 'row' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  warning: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 8,
  },
  sortearButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  sortearButtonDisabled: { backgroundColor: '#94a3b8' },
  sortearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
