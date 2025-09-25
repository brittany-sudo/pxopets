import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';

export default function HomeScreen() {
  const { state, addCoins, increaseHappiness, renamePet, hydrated } = useGame();
  const [nameDraft, setNameDraft] = useState(state.pet.name);

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
          <Text style={styles.newsHeader}>DAILY GAZETTE</Text>
          <Text style={styles.newsItem}>Daily Reward: Check back at midnight</Text>
          <Text style={styles.newsItem}>Lottery: 12 • 19 • 04 • 07</Text>
          <Text style={styles.newsItem}>Contest: Best Pet Name — entries open</Text>
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
    justifyContent: 'center',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PressStart2P_400Regular',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  newsHeader: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f0f2a', // Darker navy to match other headers
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  newsItem: {
    fontSize: 13,
    fontFamily: 'Silkscreen_400Regular',
    marginBottom: 6,
    color: '#0f0f2a', // Dark navy to match other text
  },
});
