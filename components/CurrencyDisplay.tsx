import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGame } from '@/store/GameStore';

export default function CurrencyDisplay() {
  const { state } = useGame();

  // Debug logging

  // Calculate total stamina directly from state
  const totalStamina = state.dailyStamina + state.bonusStamina;

  return (
    <View style={styles.container}>
      {/* Lightning Bolt Stamina */}
      <View style={styles.currencyItem}>
        <FontAwesome name="bolt" size={16} color="#FFD700" />
        <Text style={styles.currencyText}>
          {totalStamina} ({state.dailyStamina}+{state.bonusStamina})
        </Text>
      </View>

      {/* Tickets */}
      <View style={styles.currencyItem}>
        <FontAwesome name="ticket" size={16} color="#8b5cf6" />
        <Text style={styles.currencyText}>
          {state.tickets}
        </Text>
      </View>

      {/* Coins (legacy) */}
      <View style={styles.currencyItem}>
        <FontAwesome name="diamond" size={16} color="#0ea5e9" />
        <Text style={styles.currencyText}>
          {state.coins}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#fff',
  },
  regenText: {
    fontSize: 10,
    color: '#ccc',
    marginLeft: 4,
    fontStyle: 'italic',
  },
});
