import React from 'react';
import { StyleSheet, Linking } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';

export default function MoreScreen() {
  const { reset } = useGame();
  return (
    <View style={styles.container}>
      <BorderedBox>
        <PixelButton title="Reset Progress" onPress={reset} />
        <View style={{ height: 12 }} />
        <PixelButton title="Open README" onPress={() => Linking.openURL('README.md')} />
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
    color: '#1a1a3a',
    marginTop: 8,
    marginBottom: 16,
  },
});


