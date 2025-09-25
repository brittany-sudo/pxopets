import React from 'react';
import { Image, StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import { Link } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

const candidates = [
  { id: 'puff', name: 'Puff' },
  { id: 'zap', name: 'Zap' },
  { id: 'momo', name: 'Momo' },
];

export default function PetsScreen() {
  const { state, renamePet, increaseHappiness, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <BorderedBox>
        <Text style={styles.title}>PETS</Text>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 96, height: 96, imageRendering: 'pixelated' as any }}
        />
        <Text style={{ marginTop: 8, fontWeight: 'bold' }}>{state.pet.name}</Text>
        <Text>Level {state.pet.level} • Happiness {state.pet.happiness}%</Text>

        <RNView style={{ height: 12 }} />
        <PixelButton title="Give Treat (+5 happiness)" onPress={() => increaseHappiness(5)} />
      </BorderedBox>

      <RNView style={{ height: 28 }} />
      <Link href="/adoption" asChild>
        <View>
          <PixelButton title="Adopt a pet" onPress={() => {}} width={220} variant="important" />
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f0f2a', // Darker navy
    marginTop: 8,
    marginBottom: 16,
  },
});


