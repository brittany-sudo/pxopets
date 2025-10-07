import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';

export default function SimpleCurrencyDisplay() {
  const { state } = useSimpleGame();
  const { state: petState } = usePets();

  // Calculate total stamina from all pets
  const getTotalPetStamina = () => {
    return petState.adoptedPets.reduce((total, pet) => total + (pet.stamina || 0), 0);
  };


  return (
    <View style={styles.container}>
      {/* Tickets */}
      <View style={styles.currencyItem}>
        <FontAwesome name="ticket" size={20} color="#8b5cf6" />
        <Text style={styles.currencyText}>{state.tickets}</Text>
      </View>

      {/* Stamina */}
      <View style={styles.currencyItem}>
        <FontAwesome name="bolt" size={20} color="#FFD700" />
        <Text style={styles.currencyText}>{getTotalPetStamina()}</Text>
      </View>

      {/* Gems */}
      <View style={styles.currencyItem}>
        <FontAwesome name="diamond" size={20} color="#0ea5e9" />
        <Text style={[styles.currencyText, { color: '#0ea5e9' }]}>{state.coins}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  currencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#fff',
  },
});



