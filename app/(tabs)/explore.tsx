import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';

export default function ExploreScreen() {
  const { state, unlockNextLevel, spendCoins, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const nextLevel = state.unlockedLevels + 1;
  const cost = nextLevel * 20;

  const tryUnlock = () => {
    const ok = spendCoins(cost);
    if (ok) unlockNextLevel();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      
      <BorderedBox>
        <Text style={{ marginTop: 6 }}>Highest unlocked: {state.unlockedLevels}</Text>
        <Text>Coins: {state.coins}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text>Unlock level {nextLevel} for {cost} coins</Text>
        <PixelButton title={`Unlock Level ${nextLevel}`} onPress={tryUnlock} />
      </BorderedBox>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});


