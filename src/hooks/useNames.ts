import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Name, SavedList } from '../../types';

const NAMES_STORAGE_KEY = '@lottery_names';
const LISTS_STORAGE_KEY = '@lottery_saved_lists';

export function useNames() {
  const [names, setNames] = useState<Name[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);

  useEffect(() => {
    loadNames();
    loadSavedLists();
  }, []);

  // --- NOMES AVULSOS ---
  const loadNames = async () => {
    try {
      const stored = await AsyncStorage.getItem(NAMES_STORAGE_KEY);
      if (stored) setNames(JSON.parse(stored));
    } catch (e) { console.error(e); }
  };

  const saveNames = async (newNames: Name[]) => {
    try {
      await AsyncStorage.setItem(NAMES_STORAGE_KEY, JSON.stringify(newNames));
      setNames(newNames);
    } catch (e) { console.error(e); }
  };

  const addName = (val: string) => {
    if (!val.trim()) return;
    saveNames([...names, { id: Date.now().toString() + Math.random(), value: val.trim() }]);
  };

  const removeName = (id: string) => saveNames(names.filter(n => n.id !== id));

  const editName = (id: string, val: string) => {
    saveNames(names.map(n => n.id === id ? { ...n, value: val.trim() } : n));
  };

  const clearAllNames = async () => {
    await AsyncStorage.removeItem(NAMES_STORAGE_KEY);
    setNames([]);
  };

  const importNames = (text: string) => {
    const list = text.split(/[\n,]/).map(n => n.trim()).filter(n => n.length > 0)
      .map(n => ({ id: Date.now().toString() + Math.random(), value: n }));
    saveNames([...names, ...list]);
  };

  // --- LISTAS SALVAS ---
  const loadSavedLists = async () => {
    try {
      const stored = await AsyncStorage.getItem(LISTS_STORAGE_KEY);
      if (stored) setSavedLists(JSON.parse(stored));
    } catch (e) { console.error(e); }
  };

  const addList = async (title: string, namesArray: string[]) => {
    const newList: SavedList = {
      id: Date.now().toString(),
      title,
      names: namesArray,
      createdAt: Date.now(),
    };
    const updated = [...savedLists, newList];
    await AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
    setSavedLists(updated);
  };

  const removeList = async (id: string) => {
    const updated = savedLists.filter(l => l.id !== id);
    await AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
    setSavedLists(updated);
  };

  // FUNÇÃO DE ATUALIZAR (NOVA)
  const updateList = async (id: string, newTitle: string, newNames: string[]) => {
    const updated = savedLists.map(l => l.id === id ? { ...l, title: newTitle, names: newNames } : l);
    await AsyncStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(updated));
    setSavedLists(updated);
  };

  return {
    names, addName, removeName, editName, clearAllNames, importNames,
    savedLists, addList, removeList, updateList // <--- Exportando updateList
  };
}