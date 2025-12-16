import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Name } from '../../types';

const NAMES_STORAGE_KEY = '@lottery_names';

export function useNames() {
  const [names, setNames] = useState<Name[]>([]);

  useEffect(() => {
    loadNames();
  }, []);

  const loadNames = async () => {
    try {
      const storedNames = await AsyncStorage.getItem(NAMES_STORAGE_KEY);
      if (storedNames) {
        setNames(JSON.parse(storedNames));
      }
    } catch (error) {
      console.error('Error loading names:', error);
    }
  };

  const saveNames = async (newNames: Name[]) => {
    try {
      await AsyncStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(newNames));
      setNames(newNames);
    } catch (error) {
      console.error('Error saving names:', error);
    }
  };

  const addName = (name: string) => {
    if (!name.trim()) return;
    
    const newName: Name = {
      id: Date.now().toString(),
      value: name.trim(),
    };
    
    const updatedNames = [...names, newName];
    saveNames(updatedNames);
  };

  const removeName = (id: string) => {
    const updatedNames = names.filter(name => name.id !== id);
    saveNames(updatedNames);
  };

  const editName = (id: string, newValue: string) => {
    if (!newValue.trim()) return;
    
    const updatedNames = names.map(name =>
      name.id === id ? { ...name, value: newValue.trim() } : name
    );
    saveNames(updatedNames);
  };

  const clearAllNames = async () => {
    try {
      await AsyncStorage.removeItem(NAMES_STORAGE_KEY);
      setNames([]);
    } catch (error) {
      console.error('Error clearing names:', error);
    }
  };

  const importNames = (namesText: string) => {
    const namesList = namesText
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map(name => ({
        id: Date.now().toString() + Math.random(),
        value: name,
      }));

    const updatedNames = [...names, ...namesList];
    saveNames(updatedNames);
  };

  return {
    names,
    addName,
    removeName,
    editName,
    clearAllNames,
    importNames,
  };
}