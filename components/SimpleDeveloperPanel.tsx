import React, { useState } from 'react';
import { Modal, StyleSheet, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';
import { useInventory } from '@/store/InventoryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SimpleDeveloperPanelProps {
  visible: boolean;
  onClose: () => void;
}

export default function SimpleDeveloperPanel({ visible, onClose }: SimpleDeveloperPanelProps) {
  const { 
    state, 
    addTickets, 
    addStamina, 
    addCoins, 
    addGems,
    setCurrency, 
    resetGame 
  } = useSimpleGame();
  const { resetAllPets, getActivePet, addStaminaToPet } = usePets();
  const { clearAllItems } = useInventory();

  const clearCoffeeCooldown = async () => {
    try {
      await AsyncStorage.removeItem('lastCoffeeClaim');
      console.log('Coffee cooldown cleared');
    } catch (error) {
      console.error('Error clearing coffee cooldown:', error);
    }
  };
  
  const [customTickets, setCustomTickets] = useState('');
  const [customStamina, setCustomStamina] = useState('');
  const [customCoins, setCustomCoins] = useState('');
  const [customGems, setCustomGems] = useState('');

  const handleAdjustTickets = (amount: number) => {
    if (amount < 0 && state.tickets + amount < 0) {
      // Don't allow going below 0
      return;
    }
    addTickets(amount);
  };

  const handleAdjustStamina = (amount: number) => {
    const activePet = getActivePet();
    if (!activePet) {
      Alert.alert('No Active Pet', 'You need an active pet to add stamina!');
      return;
    }
    console.log('Adding stamina to pet:', activePet.name, amount);
    addStaminaToPet(activePet.id, amount);
  };

  const handleAdjustGems = (amount: number) => {
    const currentGems = state.gems || 0; // Fallback to 0 if undefined
    if (amount < 0 && currentGems + amount < 0) {
      // Don't allow going below 0
      return;
    }
    addGems(amount);
  };

  const handleSetCustomCurrency = () => {
    // Only set values that have been entered (not empty strings)
    const tickets = customTickets.trim() !== '' ? parseInt(customTickets) : state.tickets;
    const stamina = customStamina.trim() !== '' ? parseInt(customStamina) : state.stamina;
    const coins = customCoins.trim() !== '' ? parseInt(customCoins) : state.coins;
    const gems = customGems.trim() !== '' ? parseInt(customGems) : (state.gems || 0);
    
    setCurrency(tickets, stamina, coins, gems);
    
    // Clear inputs
    setCustomTickets('');
    setCustomStamina('');
    setCustomCoins('');
    setCustomGems('');
    
    // Close modal
    onClose();
  };

  const handleResetGame = () => {
    Alert.alert(
      'Reset Game',
      'This will reset:\n• All currency (tickets, gems, stamina)\n• All pets\n• All inventory items\n• Pxogulp refill counts\n• Coffee cooldown\n• Purchased backgrounds\n\nAre you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive', 
          onPress: async () => {
            resetGame();
            resetAllPets();
            clearAllItems();
            await clearCoffeeCooldown();
            Alert.alert('Reset Complete', 'All progress has been wiped!');
            onClose();
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Dev Panel</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#fff" />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={true}
          >
            {/* Tickets Control */}
            <View style={styles.currencyControl}>
              <Text style={styles.currencyLabel}>Tickets: {state.tickets}</Text>
              <View style={styles.controlRow}>
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustTickets(-10)}>
                  <FontAwesome name="minus" size={16} color="#fff" />
                </Pressable>
                <TextInput
                  style={styles.valueInput}
                  value={customTickets}
                  onChangeText={setCustomTickets}
                  placeholder="Set amount"
                  keyboardType="numeric"
                />
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustTickets(10)}>
                  <FontAwesome name="plus" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>

            {/* Stamina Control */}
            <View style={styles.currencyControl}>
              <Text style={styles.currencyLabel}>Pet Stamina: {getActivePet()?.stamina || 'No Active Pet'}</Text>
              <View style={styles.controlRow}>
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustStamina(-10)}>
                  <FontAwesome name="minus" size={16} color="#fff" />
                </Pressable>
                <TextInput
                  style={styles.valueInput}
                  value={customStamina}
                  onChangeText={setCustomStamina}
                  placeholder="Set amount"
                  keyboardType="numeric"
                />
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustStamina(10)}>
                  <FontAwesome name="plus" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>

            {/* Gems Control */}
            <View style={styles.currencyControl}>
              <Text style={styles.currencyLabel}>Gems: {state.gems || 0}</Text>
              <View style={styles.controlRow}>
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustGems(-10)}>
                  <FontAwesome name="minus" size={16} color="#fff" />
                </Pressable>
                <TextInput
                  style={styles.valueInput}
                  value={customGems}
                  onChangeText={setCustomGems}
                  placeholder="Set amount"
                  keyboardType="numeric"
                />
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustGems(10)}>
                  <FontAwesome name="plus" size={16} color="#fff" />
                </Pressable>
              </View>
            </View>

            {/* Set All Button */}
            <Pressable style={styles.setAllButton} onPress={handleSetCustomCurrency}>
              <Text style={styles.setAllButtonText}>Set All Values</Text>
            </Pressable>

            {/* Reset Game */}
            <Pressable style={styles.resetButton} onPress={handleResetGame}>
              <FontAwesome name="trash" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>Reset Everything</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#ef4444',
    borderRadius: 20,
  },
  content: {
    backgroundColor: 'transparent',
    padding: 20,
    paddingBottom: 40,
  },
  currencyControl: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  arrowButton: {
    backgroundColor: '#8b5cf6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueInput: {
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    minWidth: 120,
    textAlign: 'center',
  },
  setAllButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  setAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



