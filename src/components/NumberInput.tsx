import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChangeValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: ViewStyle;
}

export function NumberInput({
  label,
  value,
  onChangeValue,
  min = -Infinity,
  max = Infinity,
  step = 1,
  style,
}: NumberInputProps) {
  const [textValue, setTextValue] = useState(value.toString());

  // Sincroniza o texto interno se o valor mudar externamente (ex: reset de formulário)
  useEffect(() => {
    setTextValue(value.toString());
  }, [value]);

  const handleTextChange = (text: string) => {
    // Remove caracteres não numéricos
    const cleanedText = text.replace(/[^0-9]/g, '');
    setTextValue(cleanedText);
    
    const numValue = parseInt(cleanedText) || 0;
    if (numValue >= min && numValue <= max) {
      onChangeValue(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = Math.max(min, Math.min(max, parseInt(textValue) || min));
    setTextValue(numValue.toString());
    onChangeValue(numValue);
  };

  const increment = () => {
    const newValue = Math.min(max, value + step);
    setTextValue(newValue.toString());
    onChangeValue(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(min, value - step);
    setTextValue(newValue.toString());
    onChangeValue(newValue);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>
        {label}
      </Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={decrement}
          disabled={value <= min}
          activeOpacity={0.6}
        >
          <Minus 
            size={16} 
            color={value <= min ? '#94a3b8' : '#475569'} 
            strokeWidth={2.5} 
          />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={textValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          textAlign="center"
          selectTextOnFocus
          placeholderTextColor="#94a3b8"
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={increment}
          disabled={value >= max}
          activeOpacity={0.6}
        >
          <Plus 
            size={16} 
            color={value >= max ? '#94a3b8' : '#475569'} 
            strokeWidth={2.5} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
});