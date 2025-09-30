import React, { useState } from 'react';
import { Modal, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSimpleGame } from '@/store/SimpleGameStore';

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
    setCurrency, 
    resetGame 
  } = useSimpleGame();
  
  const [customTickets, setCustomTickets] = useState('');
  const [customStamina, setCustomStamina] = useState('');
  const [customCoins, setCustomCoins] = useState('');

  const handleAdjustTickets = (amount: number) => {
    if (amount < 0 && state.tickets + amount < 0) {
      // Don't allow going below 0
      return;
    }
    addTickets(amount);
  };

  const handleAdjustStamina = (amount: number) => {
    if (amount < 0 && state.stamina + amount < 0) {
      // Don't allow going below 0
      return;
    }
    addStamina(amount);
  };

  const handleAdjustGems = (amount: number) => {
    if (amount < 0 && state.coins + amount < 0) {
      // Don't allow going below 0
      return;
    }
    addCoins(amount);
  };

  const handleSetCustomCurrency = () => {
    const tickets = parseInt(customTickets) || 0;
    const stamina = parseInt(customStamina) || 0;
    const coins = parseInt(customCoins) || 0;
    
    setCurrency(tickets, stamina, coins);
    
    // Clear inputs
    setCustomTickets('');
    setCustomStamina('');
    setCustomCoins('');
  };

  const handleResetGame = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset all progress? This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetGame }
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
            <Text style={styles.title}>🛠️ Dev Panel</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={24} color="#fff" />
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Tickets Control */}
            <View style={styles.currencyControl}>
              <Text style={styles.currencyLabel}>🎫 Tickets: {state.tickets}</Text>
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
              <Text style={styles.currencyLabel}>⚡ Stamina: {state.stamina}</Text>
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
              <Text style={styles.currencyLabel}>💎 Gems: {state.coins}</Text>
              <View style={styles.controlRow}>
                <Pressable style={styles.arrowButton} onPress={() => handleAdjustGems(-10)}>
                  <FontAwesome name="minus" size={16} color="#fff" />
                </Pressable>
                <TextInput
                  style={styles.valueInput}
                  value={customCoins}
                  onChangeText={setCustomCoins}
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
              <Text style={styles.resetButtonText}>Reset Game</Text>
            </Pressable>
          </View>
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
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});



