import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import { useGame } from '@/store/GameStore';

type PoundPet = { id: string; name: string; level: number; happiness: number };

function generatePoundPets(): PoundPet[] {
  const names = ['Pip', 'Luna', 'Moss', 'Kiko', 'Rex', 'Tula'];
  return Array.from({ length: 6 }).map((_, i) => ({
    id: 'pd' + i,
    name: names[i % names.length],
    level: 1 + (i % 3),
    happiness: 40 + (i * 5),
  }));
}

export default function Pound() {
  const { renamePet, increaseHappiness } = useGame();
  const pets = React.useMemo(generatePoundPets, []);

  const adopt = (p: PoundPet) => {
    renamePet(p.name);
    increaseHappiness(5);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Pound</Text>
      <RNView style={styles.list}>
        {pets.map((p) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.cardName}>{p.name}</Text>
            <Text>Lv {p.level} • {p.happiness}% happy</Text>
            <RNView style={{ height: 6 }} />
            <PixelButton title="Adopt" onPress={() => adopt(p)} width={160} />
          </View>
        ))}
      </RNView>
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
  list: { gap: 10, width: 360 },
  card: { borderWidth: 2, borderColor: '#a7d8d3', backgroundColor: '#f7fffd', padding: 10 },
  cardName: { fontFamily: 'Silkscreen_400Regular', fontSize: 14 },
});


