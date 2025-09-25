import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';

export default function ShopScreen() {
  const { spendCoins, addCoins, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const buyTreat = () => {
    const ok = spendCoins(5);
    if (!ok) return;
    // Give a tiny cashback to show transaction
    addCoins(1);
  };

  return (
    <View style={styles.container}>
      <BorderedBox>
        <Text style={styles.title}>SHOP</Text>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 96, height: 96, imageRendering: 'pixelated' as any }}
        />
        <Text style={{ marginVertical: 8 }}>Treat - 5 coins</Text>
        <PixelButton title="Buy Treat" onPress={buyTreat} />
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
});


