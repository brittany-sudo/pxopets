import React from 'react';
import { StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DeveloperPanelProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeveloperPanel({ visible, onClose }: DeveloperPanelProps) {
  const { state, addTickets, addDailyStamina, addBonusStamina, addCoins } = useGame();

  const handleAddTickets = (amount: number) => {
    console.log('Adding tickets:', amount);
    addTickets(amount);
    Alert.alert('Added!', `+${amount} Tickets!`);
  };

  const handleAddDailyStamina = (amount: number) => {
    addDailyStamina(amount);
    Alert.alert('Added!', `+${amount} Daily Stamina!`);
  };

  const handleAddBonusStamina = (amount: number) => {
    addBonusStamina(amount);
    Alert.alert('Added!', `+${amount} Bonus Stamina!`);
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

        <View style={styles.content}>
          {/* Current Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Current Values</Text>
            <View style={styles.statsRow}>
              <FontAwesome name="ticket" size={16} color="#8b5cf6" />
              <Text style={styles.statText}>Tickets: {state.tickets}</Text>
            </View>
            <View style={styles.statsRow}>
              <FontAwesome name="bolt" size={16} color="#FFD700" />
              <Text style={styles.statText}>Daily Stamina: {state.dailyStamina}</Text>
            </View>
            <View style={styles.statsRow}>
              <FontAwesome name="star" size={16} color="#f59e0b" />
              <Text style={styles.statText}>Bonus Stamina: {state.bonusStamina}</Text>
            </View>
            <View style={styles.statsRow}>
              <FontAwesome name="diamond" size={16} color="#8b5cf6" />
              <Text style={styles.statText}>Coins: {state.coins}</Text>
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

            {/* Daily Stamina */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Add Daily Stamina:</Text>
              <View style={styles.buttonGroup}>
                <Pressable style={styles.setButton} onPress={() => handleAddDailyStamina(10)}>
                  <Text style={styles.buttonText}>+10</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddDailyStamina(50)}>
                  <Text style={styles.buttonText}>+50</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddDailyStamina(100)}>
                  <Text style={styles.buttonText}>+100</Text>
                </Pressable>
              </View>
            </View>

            {/* Bonus Stamina */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Add Bonus Stamina:</Text>
              <View style={styles.buttonGroup}>
                <Pressable style={styles.setButton} onPress={() => handleAddBonusStamina(10)}>
                  <Text style={styles.buttonText}>+10</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddBonusStamina(50)}>
                  <Text style={styles.buttonText}>+50</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddBonusStamina(100)}>
                  <Text style={styles.buttonText}>+100</Text>
                </Pressable>
                <Pressable style={styles.setButton} onPress={() => handleAddBonusStamina(200)}>
                  <Text style={styles.buttonText}>+200</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statsSection: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  statText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
  },
  controlRow: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  controlLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  setButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
