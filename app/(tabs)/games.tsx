import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';

export default function GamesScreen() {
  const { addCoins, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <BorderedBox>
        <Text style={styles.title}>GAMES</Text>
        <Text style={{ marginBottom: 10 }}>Mini-games coming soon.</Text>
        <PixelButton title="Play Quick Tap (+3 coins)" onPress={() => addCoins(3)} />
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


