import React from 'react';
import { StyleSheet, View as RNView, ScrollView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
import { useGame } from '@/store/GameStore';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
          <RNView style={styles.header}>
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
              <Text style={styles.backButtonText}>BACK</Text>
            </Pressable>
            <Text style={styles.title}>THE POUND</Text>
            <RNView style={styles.placeholder} />
          </RNView>
          <RNView style={styles.list}>
            {pets.map((p) => (
              <View key={p.id} style={styles.card}>
                <RNView style={styles.cardContent}>
                  <RNView style={styles.petImageContainer}>
                    <Image
                      source={require('@/assets/images/tigerguy.png')}
                      style={styles.petImage}
                    />
                  </RNView>
                  <RNView style={styles.petInfo}>
                    <Text style={styles.cardName}>{p.name}</Text>
                    <Text style={styles.cardStats}>Level {p.level}</Text>
                    <Text style={styles.cardStats}>Happiness: {p.happiness}%</Text>
                    <Text style={styles.cardStats}>ATK: {p.level * 10}</Text>
                    <Text style={styles.cardStats}>DEF: {p.level * 8}</Text>
                    <Text style={styles.cardStats}>SPD: {p.level * 12}</Text>
                  </RNView>
                </RNView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 4,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60, // Same width as back button to center the title
  },
  title: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#0f172a',
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
  },
  petInfo: {
    flex: 1,
    alignItems: 'flex-start',
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
  petImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  petImage: {
    width: 50,
    height: 50,
    imageRendering: 'pixelated' as any,
  },
});


