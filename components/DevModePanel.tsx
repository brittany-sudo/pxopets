import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useInventory } from '@/store/InventoryStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DevModePanelProps {
  visible: boolean;
  onClose: () => void;
}

// List of all available items in the game
const AVAILABLE_ITEMS = [
  // Food items
  { id: 'cup-of-coffee', name: 'Cup of Coffee', image: 'moonpetal-tea', category: 'drink' },
  { id: 'monthly-slushee', name: 'Monthly Slushee', image: 'slushee', category: 'drink' },
  { id: 'protein-bar', name: 'Protein Bar', image: 'chocolate', category: 'food' },
  { id: 'hot-chips', name: 'Hot Chips', image: 'hotchips', category: 'snack' },
  { id: 'lil-soda', name: 'Lil Soda', image: 'lil-soda', category: 'drink' },
  { id: 'cup-noodle', name: "Cup O'Noodle", image: 'cupnoodle', category: 'food' },
  { id: 'gas-station-dog', name: 'Gas Station Dog', image: 'regularhotdog', category: 'food' },
  { id: 'potato-chomps', name: 'Potato Chomps', image: 'potatochomps', category: 'snack' },
  { id: 'saturn-soda', name: 'Saturn Soda', image: 'saturnsoda', category: 'drink' },
  { id: 'nuggets', name: 'Nuggets', image: 'nuggets', category: 'food' },
  
  // Special items
  { id: 'space-bubblegum', name: 'Space Bubblegum', image: 'gumballs', category: 'special' },
  { id: 'cosmic-burger', name: 'Cosmic Burger', image: 'cosmicburger', category: 'food' },
  { id: 'punch-pouch', name: 'Punch Pouch', image: 'pouchdrink', category: 'drink' },
  { id: 'choco-donut', name: 'Choco-Donut', image: 'chocodonut', category: 'food' },
  
  // Lottery tickets
  { id: 'cash-match', name: 'Cash Match', image: 'scratchoff1', category: 'ticket' },
  { id: 'lucky-7s', name: 'Lucky 7s', image: 'scratchoff2', category: 'ticket' },
  { id: 'mega-money', name: 'Mega Money', image: 'scratchoff3', category: 'ticket' },
  { id: 'win-big', name: 'Win Big', image: 'scratchoff4', category: 'ticket' },
];

export default function DevModePanel({ visible, onClose }: DevModePanelProps) {
  const { addItem, removeItem, clearAllItems, resetInventory, state } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');

  if (!visible) return null;

  const filteredItems = AVAILABLE_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventoryItems = state.mainInventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (item: typeof AVAILABLE_ITEMS[0]) => {
    const success = addItem({
      id: item.id,
      name: item.name,
      price: 0,
      image: item.image,
      category: item.category as any,
      description: `Added via dev mode`
    }, selectedQuantity);

    if (success) {
      Alert.alert("Success", `${item.name} x${selectedQuantity} added to inventory!`);
    } else {
      Alert.alert("Inventory Full", "Item moved to safety deposit box!");
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    const success = removeItem(itemId, selectedQuantity);
    if (success) {
      Alert.alert("Success", `${itemName} x${selectedQuantity} removed from inventory!`);
    } else {
      Alert.alert("Error", "Item not found or insufficient quantity!");
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Items",
      "Are you sure you want to clear all items from both main inventory and safety deposit box?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            clearAllItems();
            Alert.alert("Success", "All items have been cleared!");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dev Mode - Inventory</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <Pressable 
            style={[styles.tab, activeTab === 'add' && styles.activeTab]}
            onPress={() => setActiveTab('add')}
          >
            <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>
              Add Items
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'remove' && styles.activeTab]}
            onPress={() => setActiveTab('remove')}
          >
            <Text style={[styles.tabText, activeTab === 'remove' && styles.activeTabText]}>
              Remove Items
            </Text>
          </Pressable>
        </View>

        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FontAwesome name="search" size={16} color="#64748b" style={styles.searchIcon} />
        </View>

        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <Pressable 
              style={styles.quantityButton}
              onPress={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{selectedQuantity}</Text>
            <Pressable 
              style={styles.quantityButton}
              onPress={() => setSelectedQuantity(selectedQuantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.itemsList}>
          {activeTab === 'add' ? (
            filteredItems.map((item) => (
              <Pressable 
                key={item.id} 
                style={styles.itemRow}
                onPress={() => handleAddItem(item)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
                <FontAwesome name="plus" size={16} color="#8b5cf6" />
              </Pressable>
            ))
          ) : (
            filteredInventoryItems.map((item) => (
              <Pressable 
                key={item.id} 
                style={styles.itemRow}
                onPress={() => handleRemoveItem(item.id, item.name)}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>Qty: {item.quantity}</Text>
                </View>
                <FontAwesome name="minus" size={16} color="#ef4444" />
              </Pressable>
            ))
          )}
        </ScrollView>

        <View style={styles.actions}>
          <Pressable 
            style={styles.resetButton} 
            onPress={() => {
              resetInventory();
              Alert.alert("Success", "Inventory reset! Dev items removed.");
            }}
          >
            <Text style={styles.resetButtonText}>Reset Inventory (Remove Dev Items)</Text>
          </Pressable>
          <Pressable style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All Items</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#64748b',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  searchSection: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 40,
    paddingVertical: 12,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  quantityLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#8b5cf6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  quantityValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  itemsList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCategory: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  clearButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
});
