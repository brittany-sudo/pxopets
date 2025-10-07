import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useInventory } from '@/store/InventoryStore';

// Import the lost and found image
const lostAndFoundImage = require('@/assets/images/lostandfound.png');

export default function TheLostAndFoundScreen() {
  const { addItem, removeItem, getItemQuantity, state } = useInventory();
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Random discarded items that can be found around Pxoburbs
  const discardedItems = [
    // Trapper game junk (most common)
    { id: 'soggy-boots', name: 'Soggy Boots', description: 'Waterlogged boots from the docks. Still wearable!', image: require('@/assets/images/soggyboot.png') },
    { id: 'old-fishing-net', name: 'Old Fishing Net', description: 'A tattered net that caught more seaweed than fish.', image: require('@/assets/images/lil-oldnet.png') },
    { id: 'fish-bones', name: 'Fish Bones', description: 'Leftover bones from a big catch at the docks.', image: require('@/assets/images/fishbones.png') },
    { id: 'fish-stew', name: 'Cold Fish Stew', description: 'A can of fish stew that went cold.', image: require('@/assets/images/fishstew.png') },
    { id: 'love-note', name: 'Love Note', description: 'A heartfelt message found crumpled on the ground.', image: require('@/assets/images/love-note.png') },
    { id: 'broken-rod', name: 'Broken Fishing Rod', description: 'Half a fishing rod that snapped under pressure.', image: require('@/assets/images/pooldonut.png') },
    { id: 'seaweed', name: 'Dried Seaweed', description: 'Crispy seaweed that washed up on shore.', image: require('@/assets/images/pooldonut.png') },
    { id: 'driftwood', name: 'Driftwood', description: 'A piece of wood that traveled far across the sea.', image: require('@/assets/images/pooldonut.png') },
    
    // QuickStop food items
    { id: 'stale-donut', name: 'Stale Donut', description: 'A day-old donut that\'s still edible... probably.', image: require('@/assets/images/pooldonut.png') },
    { id: 'half-eaten-sandwich', name: 'Half-Eaten Sandwich', description: 'Someone\'s lunch that got left behind.', image: require('@/assets/images/pooldonut.png') },
    { id: 'expired-soda', name: 'Expired Soda', description: 'A flat soda that lost its fizz days ago.', image: require('@/assets/images/pooldonut.png') },
    
    // Neon Casino items
    { id: 'chipped-chip', name: 'Chipped Casino Chip', description: 'A damaged chip from the Neon Casino floor.', image: require('@/assets/images/pooldonut.png') },
    { id: 'lucky-coin', name: 'Lucky Coin', description: 'A coin that brought someone good fortune... once.', image: require('@/assets/images/pooldonut.png') },
    
    // General Pxoburbs junk
    { id: 'lost-button', name: 'Lost Button', description: 'A single button from someone\'s favorite shirt.', image: require('@/assets/images/pooldonut.png') },
    { id: 'torn-ticket', name: 'Torn Ticket', description: 'Half of a roller rink ticket from Starlight.', image: require('@/assets/images/pooldonut.png') },
    { id: 'old-newspaper', name: 'Old Newspaper', description: 'Yesterday\'s Pxoburbs Daily, slightly soggy.', image: require('@/assets/images/pooldonut.png') },
  ];

  // Load inventory items on component mount
  useEffect(() => {
    loadInventoryItems();
    // Generate initial 8 items if none exist
    if (availableItems.length === 0) {
      const shuffled = [...discardedItems].sort(() => 0.5 - Math.random());
      setAvailableItems(shuffled.slice(0, 8));
    }
  }, []);

  // Image mapping for inventory items
  const getInventoryItemImage = (imageString: string) => {
    const imageMap: { [key: string]: any } = {
      'chocolate': require('@/assets/images/chocolate.png'),
      'astro-tarts': require('@/assets/images/astro-tarts.png'),
      'cupnoodle': require('@/assets/images/cupnoodle.png'),
      'hotchips': require('@/assets/images/hotchips.png'),
      'neon-cola': require('@/assets/images/neon-cola.png'),
      'glitterdog': require('@/assets/images/glitterdog.png'),
      'regularhotdog': require('@/assets/images/regularhotdog.png'),
      'quickchipz': require('@/assets/images/quickchipz.png'),
      'potatochomps': require('@/assets/images/potatochomps.png'),
      'saturnsoda': require('@/assets/images/saturnsoda.png'),
      'slushee': require('@/assets/images/slushee.png'),
      'orbit-rings': require('@/assets/images/orbit-rings.png'),
      'nuggets': require('@/assets/images/nuggets.png'),
      'milkshakes': require('@/assets/images/milkshakes.png'),
      'glowcorn': require('@/assets/images/glowcorn.png'),
      'glow-worms': require('@/assets/images/glow-worms.png'),
      'soggyboot': require('@/assets/images/soggyboot.png'),
      'fishbones': require('@/assets/images/fishbones.png'),
      'fishstew': require('@/assets/images/fishstew.png'),
      'oldbottle': require('@/assets/images/oldbottle.png'),
      'clumpofseaweed': require('@/assets/images/clumpofseaweed.png'),
      'driftwoodnecklace': require('@/assets/images/driftwoodnecklace.png'),
      'brasscoin': require('@/assets/images/brasscoin.png'),
      'messageinabottle': require('@/assets/images/messageinabottle.png'),
      'sirenscale': require('@/assets/images/sirenscale.png'),
      'micropearl': require('@/assets/images/micropearl.png'),
      'clamchowder': require('@/assets/images/clamchowder.png'),
      'fogsailboat': require('@/assets/images/fogchildssailboat.png'),
      'winecask': require('@/assets/images/lil-wine-casket.png'),
      'oldlantern': require('@/assets/images/oldlantern.png'),
      'singingconch': require('@/assets/images/singingconch.png'),
      'love-note': require('@/assets/images/love-note.png'),
    };
    
    return imageMap[imageString] || require('@/assets/images/pooldonut.png');
  };

  const loadInventoryItems = () => {
    const itemsArray = state.mainInventory.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || 'No description available',
      quantity: item.quantity,
      image: getInventoryItemImage(item.image)
    }));
    setInventoryItems(itemsArray);
  };


  const claimItem = (item: any) => {
    // Add item directly to inventory with proper image mapping
    addItem({
      id: item.id,
      name: item.name,
      price: 0,
      image: item.image === require('@/assets/images/fishstew.png') ? 'fishstew' : 
             item.image === require('@/assets/images/fishbones.png') ? 'fishbones' :
             item.image === require('@/assets/images/soggyboot.png') ? 'soggyboot' :
             item.image === require('@/assets/images/lil-oldnet.png') ? 'oldnet' :
             item.image === require('@/assets/images/love-note.png') ? 'love-note' :
             'pooldonut',
      category: item.id === 'love-note' ? 'lost' : 'special',
      description: item.description,
      rarity: item.id === 'love-note' ? 'uncommon' : 'common'
    }, 1);

    Alert.alert('Item Claimed!', `${item.name} has been added to your inventory!`);
    
    // Remove the claimed item from available items
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else if (newSet.size < 15) {
        newSet.add(itemId);
      } else {
        Alert.alert('Selection Limit', 'You can only select up to 15 items at once.');
      }
      return newSet;
    });
  };

  const donateSelectedItems = () => {
    if (selectedItems.size === 0) {
      Alert.alert('No Items Selected', 'Please select items to donate.');
      return;
    }

    // Add selected items to available items using actual inventory data
    const itemsToDonate = inventoryItems.filter(item => selectedItems.has(item.id));
    const newAvailableItems = itemsToDonate.map(item => ({
      id: `donated-${item.id}-${Date.now()}`,
      name: item.name,
      description: item.description,
      image: item.image || require('@/assets/images/pooldonut.png')
    }));

    setAvailableItems(prev => [...prev, ...newAvailableItems]);

    // Remove items from inventory
    selectedItems.forEach(itemId => {
      removeItem(itemId, 1);
    });

    Alert.alert('Items Donated!', `You donated ${selectedItems.size} items to the Lost & Found!`);
    setSelectedItems(new Set());
    setShowDonateModal(false);
    loadInventoryItems();
  };



  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      {/* Header Row */}
      <RNView style={styles.headerRow}>
        <Text style={styles.locationTitle}>LOST & FOUND{'\n'}KIOSK</Text>
      </RNView>

      {/* Main Image */}
      <Image source={lostAndFoundImage} style={styles.mainImage} resizeMode="contain" />

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Welcome to the Lost & Found Kiosk! Here you'll find all sorts of random, discarded items that have been left behind. 
          Tap any item to claim it for free! You can also donate items from your inventory.
        </Text>
      </View>


      {/* Available Items Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>FOUND ITEMS</Text>
          <Pressable style={styles.returnButton} onPress={() => setShowDonateModal(true)}>
            <Text style={styles.returnButtonText}>RETURN</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionSubtitle}>TAP TO CLAIM ITEM</Text>
        <View style={styles.itemsGrid}>
          {availableItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemCard}
              onPress={() => claimItem(item)}
            >
              <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
              <Text style={styles.itemName}>{item.name.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>
      </View>


      {/* Donate Modal */}
      <Modal
        visible={showDonateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDonateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Donate Items</Text>
              <Pressable onPress={() => setShowDonateModal(false)}>
                <FontAwesome name="times" size={20} color="#64748b" />
              </Pressable>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Select up to 15 items to donate ({selectedItems.size}/15 selected)
            </Text>

            <ScrollView style={styles.modalScrollView}>
              {inventoryItems.length > 0 ? (
                <View style={styles.modalItemsGrid}>
                  {inventoryItems.map((item, index) => (
                    <Pressable
                      key={`inventory-${item.id}-${index}`}
                      style={[
                        styles.modalItemCard,
                        selectedItems.has(item.id) && styles.modalItemCardSelected
                      ]}
                      onPress={() => toggleItemSelection(item.id)}
                    >
                      <Image source={item.image} style={styles.modalItemImage} resizeMode="contain" />
                      <Text style={styles.modalItemName}>{item.name}</Text>
                      <Text style={styles.modalItemQuantity}>Qty: {item.quantity}</Text>
                      {selectedItems.has(item.id) && (
                        <View style={styles.selectedBadge}>
                          <FontAwesome name="check" size={12} color="#ffffff" />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={styles.modalEmptyState}>
                  <Text style={styles.modalEmptyText}>No items in your inventory to donate</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalCancelButton} 
                onPress={() => {
                  setSelectedItems(new Set());
                  setShowDonateModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[
                  styles.modalDonateButton,
                  selectedItems.size === 0 && styles.modalDonateButtonDisabled
                ]} 
                onPress={donateSelectedItems}
                disabled={selectedItems.size === 0}
              >
                <FontAwesome name="gift" size={16} color="#ffffff" />
                <Text style={styles.modalDonateText}>Donate ({selectedItems.size})</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 16,
  },
  placeholder: {
    width: 60,
  },
  mainImage: {
    width: '100%',
    height: 220,
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    marginHorizontal: 40,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 11,
    fontFamily: 'Silkscreen_400Regular',
    color: '#0f766e',
    lineHeight: 14,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PressStart2P_400Regular',
    color: '#1e293b',
    letterSpacing: 1,
    textAlign: 'left',
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    marginBottom: 20,
    marginTop: -2,
    marginLeft: 4,
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  itemCard: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
    transform: [{ translateY: 0 }],
  },
  itemImage: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 8,
    fontFamily: 'PressStart2P_400Regular',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 10,
    letterSpacing: 0.4,
    width: '100%',
  },
  itemDescription: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 11,
  },
  donateItemCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
  },
  donateItemEmoji: {
    fontSize: 18,
    marginBottom: 6,
  },
  donateItemName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 3,
  },
  donateItemQuantity: {
    fontSize: 9,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  claimBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  donateBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  returnButtonText: {
    fontSize: 10,
    fontFamily: 'PressStart2P_400Regular',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  modalItemCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  modalItemCardSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
  },
  modalItemImage: {
    width: 36,
    height: 36,
    marginBottom: 6,
  },
  modalItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 3,
  },
  modalItemQuantity: {
    fontSize: 10,
    color: '#64748b',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#10b981',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEmptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  modalEmptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  modalDonateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 6,
  },
  modalDonateButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  modalDonateText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});