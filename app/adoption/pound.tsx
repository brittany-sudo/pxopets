import React from 'react';
import { StyleSheet, View as RNView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
          <Text style={styles.title}>THE POUND</Text>
          <RNView style={styles.list}>
            {pets.map((p) => (
              <View key={p.id} style={styles.card}>
                <Text style={styles.cardName}>{p.name}</Text>
                <Text style={styles.cardStats}>Lv {p.level} • {p.happiness}% happy</Text>
                <RNView style={{ height: 8 }} />
                <PixelButton title="Adopt" onPress={() => adopt(p)} width={160} />
              </View>
            ))}
          </RNView>
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
  list: { 
    gap: 12, 
    width: '100%',
    maxWidth: 360,
  },
  card: { 
    borderWidth: 2, 
    borderColor: '#0ea5e9', 
    backgroundColor: 'rgba(14, 165, 233, 0.05)', 
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardName: { 
    fontFamily: 'Silkscreen_400Regular', 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardStats: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    opacity: 0.8,
  },
});


