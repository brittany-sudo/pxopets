import React from 'react';
import { StyleSheet, TextInput, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import { useGame } from '@/store/GameStore';

const petIds = ['p1','p2','p3','p4','p5','p6','p7','p8'];

export default function CreatePet() {
  const { renamePet, increaseHappiness } = useGame();
  const [selected, setSelected] = React.useState<string>('p1');
  const [name, setName] = React.useState('Nova');

  const create = () => {
    renamePet(name.trim() || 'Nova');
    increaseHappiness(10);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a Pet</Text>
      <RNView style={styles.grid}>
        {petIds.map(id => (
          <View key={id} style={[styles.cell, selected === id && styles.cellSelected]}>
            <Text onPress={() => setSelected(id)}>{id.toUpperCase()}</Text>
          </View>
        ))}
      </RNView>
      <Text style={{ marginTop: 8 }}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <RNView style={{ height: 10 }} />
      <PixelButton title="Create" onPress={create} width={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 16 },
  title: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#1a1a3a',
    marginTop: 8,
    marginBottom: 16 
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: 320, justifyContent: 'center' },
  cell: { width: 72, height: 72, borderWidth: 2, borderColor: '#a7d8d3', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4fffd' },
  cellSelected: { borderColor: '#0ecab8' },
  input: { borderWidth: 2, borderColor: '#a7d8d3', padding: 8, width: 240, backgroundColor: '#fff' },
});


