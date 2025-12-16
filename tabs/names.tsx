import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NamesHeader } from '../src/components/NamesHeader';
import { AddNameForm } from '../src/components/AddNameForm';
import { NamesList } from '../src/components/NamesList';
import { ImportNamesModal } from '../src/components/ImportNamesModal';
import { useNames } from '../src/hooks/useNames';
import { useState } from 'react';

export default function NamesScreen() {
  const { names, addName, removeName, editName, clearAllNames, importNames } = useNames();
  const [importModalVisible, setImportModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <NamesHeader 
          onImport={() => setImportModalVisible(true)}
          onClearAll={clearAllNames}
          hasNames={names.length > 0}
        />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <AddNameForm onAddName={addName} />
            <NamesList 
              names={names}
              onRemoveName={removeName}
              onEditName={editName}
            />
          </View>
        </ScrollView>

        <ImportNamesModal
          visible={importModalVisible}
          onClose={() => setImportModalVisible(false)}
          onImport={importNames}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
});