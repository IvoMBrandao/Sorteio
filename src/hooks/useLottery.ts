import { SortearType, SortearConfig } from '../../types';

export function useLottery() {
  const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const sortearNames = (names: string[], config: SortearConfig) => {
    if (names.length === 0) return [];
    
    const { allowRepetition, quantity } = config;
    
    if (!allowRepetition) {
      const shuffledNames = shuffleArray(names);
      return shuffledNames.slice(0, Math.min(quantity, names.length));
    } else {
      const results = [];
      for (let i = 0; i < quantity; i++) {
        const randomIndex = Math.floor(Math.random() * names.length);
        results.push(names[randomIndex]);
      }
      return results;
    }
  };

  const sortearNumbers = (config: SortearConfig) => {
    const { minValue = 1, maxValue = 100, quantity, allowRepetition } = config;
    
    if (!allowRepetition) {
      const range = maxValue - minValue + 1;
      if (quantity > range) return [];
      
      const numbers = Array.from({ length: range }, (_, i) => minValue + i);
      const shuffledNumbers = shuffleArray(numbers);
      return shuffledNumbers.slice(0, quantity);
    } else {
      const results = [];
      for (let i = 0; i < quantity; i++) {
        const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        results.push(randomNumber);
      }
      return results;
    }
  };

  const generateSequence = (config: SortearConfig) => {
    const { minValue = 1, maxValue = 100, sequenceLength = 5, allowRepetition } = config;
    
    if (!allowRepetition) {
      const range = maxValue - minValue + 1;
      if (sequenceLength > range) return [];
      
      const numbers = Array.from({ length: range }, (_, i) => minValue + i);
      const shuffledNumbers = shuffleArray(numbers);
      return shuffledNumbers.slice(0, sequenceLength).sort((a, b) => a - b);
    } else {
      const results = [];
      for (let i = 0; i < sequenceLength; i++) {
        const randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        results.push(randomNumber);
      }
      return results.sort((a, b) => a - b);
    }
  };

  return {
    sortearNames,
    sortearNumbers,
    generateSequence,
  };
}