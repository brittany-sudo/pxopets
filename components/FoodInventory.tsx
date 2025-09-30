import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame, Food } from '@/store/GameStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface FoodInventoryProps {
  visible: boolean;
  onClose: () => void;
}

export default function FoodInventory({ visible, onClose }: FoodInventoryProps) {
  const { state, eatFood } = useGame();
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleEatFood = (foodId: string) => {
    const success = eatFood(foodId);
    if (success) {
      const foodItem = state.foodInventory[foodId];
      Alert.alert(
        'Food Eaten!', 
        `You gained ${foodItem?.food.staminaValue} stamina!`
      );
      setSelectedFood(null);
    } else {
      Alert.alert('Error', 'Could not eat this food.');
    }
  };

  const foodItems = Object.values(state.foodInventory).filter(item => item.quantity > 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Food Inventory</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color="#fff" />
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView}>
          {foodItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome name="cutlery" size={48} color="#666" />
              <Text style={styles.emptyText}>No food in inventory</Text>
              <Text style={styles.emptySubtext}>Visit shops to buy food!</Text>
            </View>
          ) : (
            foodItems.map((item) => (
              <Pressable
                key={item.food.id}
                style={[
                  styles.foodItem,
                  { borderLeftColor: getRarityColor(item.food.rarity) }
                ]}
                onPress={() => setSelectedFood(item.food.id)}
              >
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.food.name}</Text>
                  <Text style={styles.foodDescription}>{item.food.description}</Text>
                  <Text style={styles.staminaValue}>
                    +{item.food.staminaValue} ⚡ Stamina
                  </Text>
                </View>
                <View style={styles.foodActions}>
                  <Text style={styles.quantity}>x{item.quantity}</Text>
                  <Pressable
                    style={styles.eatButton}
                    onPress={() => handleEatFood(item.food.id)}
                  >
                    <FontAwesome name="cutlery" size={16} color="#fff" />
                    <Text style={styles.eatButtonText}>Eat</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {/* Current Stamina Display */}
        <View style={styles.staminaDisplay}>
          <FontAwesome name="bolt" size={20} color="#FFD700" />
          <Text style={styles.staminaText}>
            {state.stamina}/{state.maxStamina} Stamina
          </Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  foodInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  foodDescription: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  staminaValue: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 4,
    fontWeight: '600',
  },
  foodActions: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  eatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  staminaDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  staminaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});



