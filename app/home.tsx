import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';

export default function PlayerHomeScreen() {
  const { state, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Home</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet</Text>
        <View style={styles.frame}>
          <Text>Pet sprite placeholder</Text>
        </View>
        <Text style={styles.meta}>{state.pet.name} • Lv {state.pet.level} • {state.pet.happiness}% happy</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <Text style={styles.meta}>Coins: {state.coins}</Text>
        <Text style={styles.meta}>Unlocked levels: {state.unlockedLevels}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventory</Text>
        <RNView style={styles.inventoryGrid}>
          <View style={styles.inventorySlot}><Text>—</Text></View>
          <View style={styles.inventorySlot}><Text>—</Text></View>
          <View style={styles.inventorySlot}><Text>—</Text></View>
          <View style={styles.inventorySlot}><Text>—</Text></View>
        </RNView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    marginBottom: 12,
  },
  section: {
    width: 360,
    padding: 12,
    borderWidth: 2,
    borderColor: '#a7d8d3',
    backgroundColor: '#f7fffd',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  frame: {
    width: '100%',
    height: 160,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: '#0ecab8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eafffb',
    marginBottom: 6,
  },
  meta: { fontSize: 13 },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inventorySlot: {
    width: 72,
    height: 72,
    borderWidth: 2,
    borderColor: '#a7d8d3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4fffd',
  },
});


