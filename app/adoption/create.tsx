import React from 'react';
import { StyleSheet, TextInput, View as RNView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
          <Text style={styles.title}>CREATE A PET</Text>
          <RNView style={styles.grid}>
            {petIds.map(id => (
              <View key={id} style={[styles.cell, selected === id && styles.cellSelected]}>
                <Text onPress={() => setSelected(id)}>{id.toUpperCase()}</Text>
              </View>
            ))}
          </RNView>
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
          <RNView style={{ height: 15 }} />
          <PixelButton title="Create" onPress={create} width={200} />
        </BorderedBox>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flexGrow: 1,
  },
  title: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    width: 320, 
    justifyContent: 'center',
    marginBottom: 20,
  },
  cell: { 
    width: 72, 
    height: 72, 
    borderWidth: 2, 
    borderColor: '#0ea5e9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
  },
  cellSelected: { 
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  label: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: { 
    borderWidth: 2, 
    borderColor: '#0ea5e9', 
    padding: 12, 
    width: 240, 
    backgroundColor: '#fff',
    borderRadius: 8,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});


