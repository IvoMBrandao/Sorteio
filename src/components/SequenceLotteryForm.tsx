import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react-native';
import { useLottery } from '../hooks/useLottery';
import { FormCard } from './FormCard';
import { NumberInput } from './NumberInput';
// CORREÇÃO: Importando como ResultModal e apelidando para evitar conflito
import { ResultModal as BallResultModal } from './BallResultModal';

interface SequenceLotteryFormProps {
  onClose: () => void;
}

export function SequenceLotteryForm({ onClose }: SequenceLotteryFormProps) {
  const { t } = useTranslation();
  const { generateSequence } = useLottery();
  
  const [allowRepetition, setAllowRepetition] = useState(false);
  const [sequenceLength, setSequenceLength] = useState(5);
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(60); 
  const [result, setResult] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSortear = () => {
    // CORREÇÃO: Usando 'quantity' conforme exigido pela interface SortearConfig
    const sequence = generateSequence({
      allowRepetition,
      quantity: sequenceLength, 
      minValue,
      maxValue,
    });
    
    setResult(sequence);
    setShowResult(true);
  };

  const canSortear = sequenceLength > 0 && minValue <= maxValue;
  const range = maxValue - minValue + 1;
  const maxSequenceLength = allowRepetition ? 50 : range;

  return (
    <View style={styles.container}>
      <FormCard>
        <Text style={styles.sectionTitle}>
          {t('sortear.sequenceForm.rangeTitle')}
        </Text>
        
        <View style={styles.row}>
          <NumberInput
            label={t('sortear.numbersForm.minLabel')}
            value={minValue}
            onChangeValue={setMinValue}
            min={0}
            max={9999}
            style={styles.flexInputLeft}
          />
          <NumberInput
            label={t('sortear.numbersForm.maxLabel')}
            value={maxValue}
            onChangeValue={setMaxValue}
            min={1}
            max={9999}
            style={styles.flexInputRight}
          />
        </View>
      </FormCard>

      <FormCard>
        <Text style={styles.sectionTitle}>
          {t('sortear.sequenceForm.configTitle')}
        </Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.label}>
            {t('sortear.numbersForm.allowRepetition')}
          </Text>
          <Switch
            value={allowRepetition}
            onValueChange={setAllowRepetition}
            trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
            thumbColor={allowRepetition ? '#ffffff' : '#94a3b8'}
          />
        </View>

        <NumberInput
          label={t('sortear.numbersForm.quantityLabel')}
          value={sequenceLength}
          onChangeValue={setSequenceLength}
          min={1}
          max={maxSequenceLength}
        />

        {!allowRepetition && sequenceLength > range && range > 0 && (
          <Text style={styles.warning}>
            {t('sortear.numbersForm.rangeWarning', { range })}
          </Text>
        )}
      </FormCard>

      <TouchableOpacity
        style={[styles.sortearButton, !canSortear && styles.sortearButtonDisabled]}
        onPress={handleSortear}
        disabled={!canSortear}
      >
        <Play size={20} color="#ffffff" fill="#ffffff" />
        <Text style={styles.sortearButtonText}>
          {t('sortear.sequenceForm.submitButton')}
        </Text>
      </TouchableOpacity>

      <BallResultModal
        visible={showResult}
        result={result}
        sequential={true}
        intervalSeconds={0.8}
        onClose={() => setShowResult(false)}
        onNewDraw={() => {
          setShowResult(false);
          // Pequeno delay para resetar o modal antes de gerar outro
          setTimeout(() => handleSortear(), 300); 
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
    alignItems: 'flex-end',
  },
  flexInputLeft: { 
    flex: 1, 
    marginRight: 8 
  },
  flexInputRight: { 
    flex: 1, 
    marginLeft: 8 
  },
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
    lineHeight: 20,
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