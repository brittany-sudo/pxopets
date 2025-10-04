import React from 'react';
import { StyleSheet, Modal, Pressable, Alert, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';
import { useInventory } from '@/store/InventoryStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DeveloperPanelProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeveloperPanel({ visible, onClose }: DeveloperPanelProps) {
  const { state, addTickets, addStamina, addGems, setCurrency, resetGame } = useSimpleGame();
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

  const clearTrapperGameData = async () => {
    try {
      await AsyncStorage.removeItem('trapperDailyTraps');
      await AsyncStorage.removeItem('trapperLastReset');
      console.log('Trapper game data cleared');
    } catch (error) {
      console.error('Error clearing trapper game data:', error);
    }
  };

  const handleAddTickets = (amount: number) => {
    console.log('Adding tickets:', amount);
    addTickets(amount);
  };

  const handleAddStamina = (amount: number) => {
    const activePet = getActivePet();
    if (!activePet) {
      Alert.alert('No Active Pet', 'You need an active pet to add stamina!');
      return;
    }
    console.log('Adding stamina to pet:', activePet.name, amount);
    addStaminaToPet(activePet.id, amount);
  };

  const handleClearTickets = () => {
    Alert.alert(
      'Clear Tickets',
      'Are you sure you want to clear all tickets?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCurrency(0, state.stamina, state.coins, state.gems);
            Alert.alert('Cleared!', 'All tickets have been cleared!');
          }
        }
      ]
    );
  };

  const handleClearStamina = () => {
    Alert.alert(
      'Clear Stamina',
      'Are you sure you want to clear all stamina?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCurrency(state.tickets, 0, state.coins, state.gems);
            Alert.alert('Cleared!', 'All stamina has been cleared!');
          }
        }
      ]
    );
  };

  const handleClearGems = () => {
    Alert.alert(
      'Clear Gems',
      'Are you sure you want to clear all gems?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCurrency(state.tickets, state.stamina, state.coins, 0);
            Alert.alert('Cleared!', 'All gems have been cleared!');
          }
        }
      ]
    );
  };

  const handleResetEverything = () => {
    Alert.alert(
      'Reset Everything',
      'This will reset:\n• All currency (tickets, gems, stamina)\n• All pets\n• All inventory items\n• Pxogulp refill counts\n• Coffee cooldown\n• Purchased backgrounds\n• Trapper game daily progress\n\nAre you sure?',
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
            await clearTrapperGameData();
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
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🛠️ Dev Panel</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#fff" />
          </Pressable>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Current Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Current Values</Text>
            <View style={styles.statsRow}>
              <FontAwesome name="ticket" size={16} color="#8b5cf6" />
              <Text style={styles.statText}>Tickets: {state.tickets}</Text>
            </View>
            <View style={styles.statsRow}>
              <FontAwesome name="bolt" size={16} color="#FFD700" />
              <Text style={styles.statText}>Stamina: {state.stamina}</Text>
            </View>
            <View style={styles.statsRow}>
              <FontAwesome name="gem" size={16} color="#f59e0b" />
              <Text style={styles.statText}>Gems: {state.gems}</Text>
            </View>
          </View>

          {/* Simple Controls */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Values</Text>
            
            {/* Tickets */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Add Tickets:</Text>
              <View style={styles.buttonGroup}>
                <Pressable style={styles.setButton} onPress={() => handleAddTickets(10)}>
                  <Text style={styles.buttonText}>+10</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddTickets(100)}>
                  <Text style={styles.buttonText}>+100</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddTickets(500)}>
                  <Text style={styles.buttonText}>+500</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddTickets(1000)}>
                  <Text style={styles.buttonText}>+1000</Text>
                </Pressable>
              </View>
            </View>

            {/* Stamina */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Add Stamina:</Text>
              <View style={styles.buttonGroup}>
                <Pressable style={styles.setButton} onPress={() => handleAddStamina(10)}>
                  <Text style={styles.buttonText}>+10</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddStamina(50)}>
                  <Text style={styles.buttonText}>+50</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddStamina(100)}>
                  <Text style={styles.buttonText}>+100</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddStamina(200)}>
                  <Text style={styles.buttonText}>+200</Text>
                </Pressable>
              </View>
            </View>


            {/* Gems */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Add Gems:</Text>
              <View style={styles.buttonGroup}>
                <Pressable style={styles.setButton} onPress={() => addGems(5)}>
                  <Text style={styles.buttonText}>+5</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => addGems(25)}>
                  <Text style={styles.buttonText}>+25</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => addGems(50)}>
                  <Text style={styles.buttonText}>+50</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => addGems(100)}>
                  <Text style={styles.buttonText}>+100</Text>
                </Pressable>
              </View>
            </View>

            {/* Clear Buttons */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Clear Values:</Text>
              <View style={styles.buttonGroup}>
                <Pressable style={styles.clearButton} onPress={handleClearTickets}>
                  <FontAwesome name="trash" size={12} color="#ffffff" />
                  <Text style={styles.clearButtonText}>CLEAR TICKETS</Text>
                </Pressable>
                <Pressable style={styles.clearButton} onPress={handleClearStamina}>
                  <FontAwesome name="trash" size={12} color="#ffffff" />
                  <Text style={styles.clearButtonText}>CLEAR STAMINA</Text>
                </Pressable>
                <Pressable style={styles.clearButton} onPress={handleClearGems}>
                  <FontAwesome name="trash" size={12} color="#ffffff" />
                  <Text style={styles.clearButtonText}>CLEAR GEMS</Text>
                </Pressable>
              </View>
            </View>

            {/* Reset Everything Button */}
            <Pressable style={styles.resetButton} onPress={handleResetEverything}>
              <FontAwesome name="trash" size={16} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.resetButtonText}>RESET EVERYTHING</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#8b5cf6',
    borderBottomWidth: 2,
    borderBottomColor: '#7c3aed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'PressStart2P_400Regular',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    fontFamily: 'PressStart2P_400Regular',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  statText: {
    fontSize: 16,
    color: '#0f172a',
    marginLeft: 8,
    fontFamily: 'Silkscreen_400Regular',
    fontWeight: 'bold',
  },
  controlRow: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  controlLabel: {
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: 'Silkscreen_400Regular',
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  setButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
  },
  // Clear Button Styles
  clearButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    gap: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    fontFamily: 'Silkscreen_400Regular',
  },
  resetButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#b91c1c',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
  },
});
