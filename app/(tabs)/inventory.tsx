import React, { useState } from 'react';
import { StyleSheet, View as RNView, ScrollView, Image, Pressable, Alert, Modal, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useInventory } from '@/store/InventoryStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function InventoryScreen() {
  const { state: inventoryState, clearAllItems, removeItem, moveToSafetyDeposit } = useInventory();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionQuantity, setActionQuantity] = useState(1);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setActionQuantity(1);
    setModalVisible(true);
  };

  const handleItemAction = (action: string) => {
    if (!selectedItem) return;

    switch (action) {
      case 'use':
        Alert.alert('Use Item', `You used ${selectedItem.name}!`);
        removeItem(selectedItem.id, actionQuantity);
        break;
      case 'drop':
        Alert.alert(
          'Drop Item',
          `Drop ${actionQuantity} ${selectedItem.name}(s)?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Drop',
              style: 'destructive',
              onPress: () => {
                removeItem(selectedItem.id, actionQuantity);
                Alert.alert('Dropped', `You dropped ${actionQuantity} ${selectedItem.name}(s)!`);
              }
            }
          ]
        );
        break;
      case 'store':
        moveToSafetyDeposit(selectedItem.id);
        Alert.alert('Stored', `Moved ${selectedItem.name} to safety deposit box!`);
        break;
      case 'sell':
        Alert.alert('Sell Item', `Sell ${selectedItem.name} for ${selectedItem.price * actionQuantity} tickets?`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sell',
            onPress: () => {
              removeItem(selectedItem.id, actionQuantity);
              Alert.alert('Sold', `You sold ${actionQuantity} ${selectedItem.name}(s) for ${selectedItem.price * actionQuantity} tickets!`);
            }
          }
        ]);
        break;
    }
    setModalVisible(false);
  };

  const getItemActions = (item: any) => {
    const actions = [];
    
    // All items can be dropped
    actions.push({ key: 'drop', label: 'Drop', icon: 'trash', color: '#ef4444' });
    
    // Food items can be used
    if (item.category === 'food' || item.category === 'drink' || item.category === 'snack') {
      actions.push({ key: 'use', label: 'Use', icon: 'heart', color: '#10b981' });
    }
    
    // Items with price can be sold
    if (item.price > 0) {
      actions.push({ key: 'sell', label: 'Sell', icon: 'dollar', color: '#f59e0b' });
    }
    
    // All items can be stored
    actions.push({ key: 'store', label: 'Store', icon: 'archive', color: '#8b5cf6' });
    
    return actions;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>INVENTORY</Text>
        </RNView>

        {/* Inventory Section */}
        <RNView style={styles.inventorySection}>
          {inventoryState.mainInventory.length === 0 ? (
            <Text style={styles.inventoryText}>No items yet - buy something from a shop or try the trapper's shack!</Text>
          ) : (
            <RNView style={styles.inventoryGrid}>
              {(() => {
                // Group items by name + image + category to handle duplicates
                const groupedItems = inventoryState.mainInventory.reduce((acc, item) => {
                  const key = `${item.name}-${item.image}-${item.category}`;
                  if (acc[key]) {
                    acc[key].quantity += item.quantity;
                  } else {
                    acc[key] = { ...item };
                  }
                  return acc;
                }, {} as Record<string, any>);
                
                return Object.values(groupedItems).map((item, index) => {
                  return (
                  <Pressable 
                    key={`${item.name}-${item.image}-${index}`} 
                    style={item.image === 'slushee3' ? styles.specialtyInventoryItem : item.category === 'fishing' ? styles.fishingInventoryItem : styles.inventoryItem}
                    onPress={() => handleItemPress(item)}
                  >
                  {item.category === 'fishing' ? (
                    <Image 
                      source={
                        item.image === 'grumpycrab' ? require('@/assets/images/grumpycrab.png') :
                        item.image === 'oldbottle' ? require('@/assets/images/oldbottle.png') :
                        item.image === 'clumpofseaweed' ? require('@/assets/images/clumpofseaweed.png') :
                        item.image === 'fishbones' ? require('@/assets/images/fishbones.png') :
                        item.image === 'driftwoodnecklace' ? require('@/assets/images/driftwoodnecklace.png') :
                        item.image === 'brasscoin' ? require('@/assets/images/brasscoin.png') :
                        item.image === 'messageinabottle' ? require('@/assets/images/messageinabottle.png') :
                        item.image === 'sirenscale' ? require('@/assets/images/sirenscale.png') :
                        item.image === 'micropearl' ? require('@/assets/images/micropearl.png') :
                        item.image === 'soggyboot' ? require('@/assets/images/soggyboot.png') :
                        item.image === 'clamchowder' ? require('@/assets/images/clamchowder.png') :
                        item.image === 'fogsailboat' ? require('@/assets/images/fogchildssailboat.png') :
                        item.image === 'winecask' ? require('@/assets/images/lil-wine-casket.png') :
                        item.image === 'oldlantern' ? require('@/assets/images/oldlantern.png') :
                        item.image === 'singingconch' ? require('@/assets/images/singingconch.png') :
                        require('@/assets/images/chocolate.png')
                      }
                      style={styles.fishingInventoryImage}
                    />
                  ) : (
                    <Image 
                      source={
                        item.image === 'chocolate' ? require('@/assets/images/chocolate.png') :
                        item.image === 'cupnoodle' ? require('@/assets/images/cupnoodle.png') :
                        item.image === 'cupnoddle' ? require('@/assets/images/cupnoddle.png') :
                        item.image === 'hotchips' ? require('@/assets/images/hotchips.png') :
                      item.image === 'lil-soda' ? require('@/assets/images/lil-soda.png') :
                        item.image === 'regularhotdog' ? require('@/assets/images/regularhotdog.png') :
                        item.image === 'potatochomps' ? require('@/assets/images/potatochomps.png') :
                        item.image === 'saturnsoda' ? require('@/assets/images/saturnsoda.png') :
                        item.image === 'slushee' ? require('@/assets/images/slushee.png') :
                        item.image === 'nuggets' ? require('@/assets/images/nuggets.png') :
                        item.image === 'milkshakes' ? require('@/assets/images/milkshakes.png') :
                        item.image === 'glowcorn' ? require('@/assets/images/glowcorn.png') :
                        item.image === 'gumballs' ? require('@/assets/images/gumballs.png') :
                        item.image === 'chocodonut' ? require('@/assets/images/chocodonut.png') :
                        item.image === 'cosmicburger' ? require('@/assets/images/cosmicburger.png') :
                        item.image === 'pouchdrink' ? require('@/assets/images/pouchdrink.png') :
                        item.image === 'game-lunchbox' ? require('@/assets/images/game-lunchbox.png') :
                        item.image === 'cute-lunchbox' ? require('@/assets/images/cute-lunchbox.png') :
                        item.image === 'whale-lunchbox' ? require('@/assets/images/whale-lunchbox.png') :
                        item.image === 'rocket-lunchbox' ? require('@/assets/images/rocket-lunchbox.png') :
                        item.image === 'dragon-lunchbox' ? require('@/assets/images/dragon-lunchbox.png') :
                        item.image === 'quickstopcoffee' ? require('@/assets/images/quickstopcoffee.png') :
                        item.image === 'slushee3' ? require('@/assets/images/slushee3.png') :
                        item.image === 'moonbeandreamcatcher.png' ? require('@/assets/images/moonbeandreamcatcher.png') :
                        item.image === 'keycard.png' ? require('@/assets/images/keycard.png') :
                        item.image === 'mirage-martini.png' ? require('@/assets/images/mirage-martini.png') :
                        item.image === 'solar-flare-sling.png' ? require('@/assets/images/solar-flare-sling.png') :
                        item.image === 'aurora-highball.png' ? require('@/assets/images/aurora-highball.png') :
                        item.image === 'pink-sand-shaker.png' ? require('@/assets/images/pink-sand-shaker.png') :
                        item.image === 'starlight-sour.png' ? require('@/assets/images/starlight-sour.png') :
                        item.image === 'lunar-lagoon.png' ? require('@/assets/images/lunar-lagoon.png') :
                        item.image === 'pxogulp-jug.png' ? require('@/assets/images/pxogulp-jug.png') :
                        // Default fallback - show chocolate for unknown items
                        require('@/assets/images/chocolate.png') // default fallback
                      } 
                      style={
                        item.image === 'slushee3' ? styles.specialtyInventoryImage :
                        item.image === 'quickstopcoffee' ? styles.coffeeInventoryImage :
                        item.image === 'lil-soda' || item.image === 'saturnsoda' ? styles.sodaInventoryImage :
                        styles.inventoryImage
                      } 
                    />
                  )}
                  {item.quantity > 1 && (
                    <Text style={styles.inventoryCount}>x{item.quantity}</Text>
                  )}
                  </Pressable>
                )
                });
              })()}
            </RNView>
          )}
          
          {/* Dev Tool - Clear Inventory */}
          <Pressable 
            style={styles.clearInventoryButton}
            onPress={() => {
              Alert.alert(
                'Clear Inventory',
                'Are you sure you want to clear all items from your inventory?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => clearAllItems()
                  }
                ]
              );
            }}
          >
            <FontAwesome name="trash" size={14} color="#ffffff" />
            <Text style={styles.clearInventoryButtonText}>Clear Inventory</Text>
          </Pressable>
        </RNView>

        {/* Inventory Stats */}
        <RNView style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Inventory Stats</Text>
          <RNView style={styles.statsGrid}>
            <RNView style={styles.statItem}>
              <Text style={styles.statLabel}>TOTAL ITEMS</Text>
              <Text style={styles.statValue}>{inventoryState.mainInventory.reduce((total, item) => total + item.quantity, 0)}</Text>
            </RNView>
            <RNView style={styles.statItem}>
              <Text style={styles.statLabel}>UNIQUE ITEMS</Text>
              <Text style={styles.statValue}>{inventoryState.mainInventory.length}</Text>
            </RNView>
            <RNView style={styles.statItem}>
              <Text style={styles.statLabel}>CAPACITY</Text>
              <Text style={styles.statValue}>{inventoryState.mainInventory.length}/{inventoryState.maxMainInventory}</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Safety Deposit Box Info */}
        {Object.keys(inventoryState.safetyDepositBox).length > 0 && (
          <RNView style={styles.safetyDepositSection}>
            <Text style={styles.sectionTitle}>Safety Deposit Box</Text>
            <Text style={styles.safetyDepositText}>
              You have {Object.keys(inventoryState.safetyDepositBox).length} items stored in your safety deposit box.
              Visit the bank to manage them.
            </Text>
          </RNView>
        )}

        {/* View Safety Deposit Box Button */}
        <RNView style={styles.safetyDepositButtonSection}>
          <Pressable 
            style={styles.safetyDepositButton}
            onPress={() => router.push('/(tabs)/bank')}
          >
            <FontAwesome name="university" size={16} color="#8b5cf6" />
            <Text style={styles.safetyDepositButtonText}>VIEW SAFETY DEPOSIT BOX</Text>
          </Pressable>
        </RNView>

      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContainer}>
            {selectedItem && (
              <>
                {/* Modal Header */}
                <RNView style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                  <Pressable 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <FontAwesome name="times" size={20} color="#6b7280" />
                  </Pressable>
                </RNView>

                {/* Item Image */}
                <RNView style={styles.modalImageContainer}>
                  <Image 
                    source={
                      selectedItem.category === 'fishing' ? (
                        selectedItem.image === 'grumpycrab' ? require('@/assets/images/grumpycrab.png') :
                        selectedItem.image === 'oldbottle' ? require('@/assets/images/oldbottle.png') :
                        selectedItem.image === 'clumpofseaweed' ? require('@/assets/images/clumpofseaweed.png') :
                        selectedItem.image === 'fishbones' ? require('@/assets/images/fishbones.png') :
                        selectedItem.image === 'driftwoodnecklace' ? require('@/assets/images/driftwoodnecklace.png') :
                        selectedItem.image === 'brasscoin' ? require('@/assets/images/brasscoin.png') :
                        selectedItem.image === 'messageinabottle' ? require('@/assets/images/messageinabottle.png') :
                        selectedItem.image === 'sirenscale' ? require('@/assets/images/sirenscale.png') :
                        selectedItem.image === 'micropearl' ? require('@/assets/images/micropearl.png') :
                        selectedItem.image === 'soggyboot' ? require('@/assets/images/soggyboot.png') :
                        selectedItem.image === 'clamchowder' ? require('@/assets/images/clamchowder.png') :
                        selectedItem.image === 'fogsailboat' ? require('@/assets/images/fogchildssailboat.png') :
                        selectedItem.image === 'winecask' ? require('@/assets/images/lil-wine-casket.png') :
                        selectedItem.image === 'oldlantern' ? require('@/assets/images/oldlantern.png') :
                        selectedItem.image === 'singingconch' ? require('@/assets/images/singingconch.png') :
                        require('@/assets/images/chocolate.png')
                      ) : (
                        selectedItem.image === 'chocolate' ? require('@/assets/images/chocolate.png') :
                        selectedItem.image === 'cupnoodle' ? require('@/assets/images/cupnoodle.png') :
                        selectedItem.image === 'cupnoddle' ? require('@/assets/images/cupnoddle.png') :
                        selectedItem.image === 'hotchips' ? require('@/assets/images/hotchips.png') :
                        selectedItem.image === 'lil-soda' ? require('@/assets/images/lil-soda.png') :
                        selectedItem.image === 'regularhotdog' ? require('@/assets/images/regularhotdog.png') :
                        selectedItem.image === 'potatochomps' ? require('@/assets/images/potatochomps.png') :
                        selectedItem.image === 'saturnsoda' ? require('@/assets/images/saturnsoda.png') :
                        selectedItem.image === 'slushee' ? require('@/assets/images/slushee.png') :
                        selectedItem.image === 'nuggets' ? require('@/assets/images/nuggets.png') :
                        selectedItem.image === 'milkshakes' ? require('@/assets/images/milkshakes.png') :
                        selectedItem.image === 'glowcorn' ? require('@/assets/images/glowcorn.png') :
                        selectedItem.image === 'gumballs' ? require('@/assets/images/gumballs.png') :
                        selectedItem.image === 'chocodonut' ? require('@/assets/images/chocodonut.png') :
                        selectedItem.image === 'cosmicburger' ? require('@/assets/images/cosmicburger.png') :
                        selectedItem.image === 'pouchdrink' ? require('@/assets/images/pouchdrink.png') :
                        selectedItem.image === 'game-lunchbox' ? require('@/assets/images/game-lunchbox.png') :
                        selectedItem.image === 'cute-lunchbox' ? require('@/assets/images/cute-lunchbox.png') :
                        selectedItem.image === 'whale-lunchbox' ? require('@/assets/images/whale-lunchbox.png') :
                        selectedItem.image === 'rocket-lunchbox' ? require('@/assets/images/rocket-lunchbox.png') :
                        selectedItem.image === 'dragon-lunchbox' ? require('@/assets/images/dragon-lunchbox.png') :
                        selectedItem.image === 'quickstopcoffee' ? require('@/assets/images/quickstopcoffee.png') :
                        selectedItem.image === 'slushee3' ? require('@/assets/images/slushee3.png') :
                        selectedItem.image === 'moonbeandreamcatcher.png' ? require('@/assets/images/moonbeandreamcatcher.png') :
                        selectedItem.image === 'keycard.png' ? require('@/assets/images/keycard.png') :
                        selectedItem.image === 'mirage-martini.png' ? require('@/assets/images/mirage-martini.png') :
                        selectedItem.image === 'solar-flare-sling.png' ? require('@/assets/images/solar-flare-sling.png') :
                        selectedItem.image === 'aurora-highball.png' ? require('@/assets/images/aurora-highball.png') :
                        selectedItem.image === 'pink-sand-shaker.png' ? require('@/assets/images/pink-sand-shaker.png') :
                        selectedItem.image === 'starlight-sour.png' ? require('@/assets/images/starlight-sour.png') :
                        selectedItem.image === 'lunar-lagoon.png' ? require('@/assets/images/lunar-lagoon.png') :
                        selectedItem.image === 'pxogulp-jug.png' ? require('@/assets/images/pxogulp-jug.png') :
                        require('@/assets/images/chocolate.png')
                      )
                    }
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                </RNView>

                {/* Item Details */}
                <RNView style={styles.modalDetails}>
                  <Text style={styles.modalDescription}>
                    {selectedItem.description || `A ${selectedItem.category} item.`}
                  </Text>
                  
                  <RNView style={styles.modalStats}>
                    <RNView style={styles.modalStatRow}>
                      <Text style={styles.modalStatLabel}>Quantity:</Text>
                      <Text style={styles.modalStatValue}>{selectedItem.quantity}</Text>
                    </RNView>
                    <RNView style={styles.modalStatRow}>
                      <Text style={styles.modalStatLabel}>Category:</Text>
                      <Text style={styles.modalStatValue}>{selectedItem.category.toUpperCase()}</Text>
                    </RNView>
                    {selectedItem.price > 0 && (
                      <RNView style={styles.modalStatRow}>
                        <Text style={styles.modalStatLabel}>Value:</Text>
                        <Text style={styles.modalStatValue}>{selectedItem.price} tickets</Text>
                      </RNView>
                    )}
                  </RNView>
                </RNView>

                {/* Quantity Selector */}
                <RNView style={styles.quantitySelector}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <RNView style={styles.quantityControls}>
                    <Pressable 
                      style={styles.quantityButton}
                      onPress={() => setActionQuantity(Math.max(1, actionQuantity - 1))}
                    >
                      <FontAwesome name="minus" size={14} color="#6b7280" />
                    </Pressable>
                    <Text style={styles.quantityValue}>{actionQuantity}</Text>
                    <Pressable 
                      style={styles.quantityButton}
                      onPress={() => setActionQuantity(Math.min(selectedItem.quantity, actionQuantity + 1))}
                    >
                      <FontAwesome name="plus" size={14} color="#6b7280" />
                    </Pressable>
                  </RNView>
                </RNView>

                {/* Action Buttons */}
                <RNView style={styles.actionButtons}>
                  {getItemActions(selectedItem).map((action) => (
                    <Pressable
                      key={action.key}
                      style={[styles.actionButton, { backgroundColor: `${action.color}20`, borderColor: action.color }]}
                      onPress={() => handleItemAction(action.key)}
                    >
                      <FontAwesome name={action.icon as any} size={16} color={action.color} />
                      <Text style={[styles.actionButtonText, { color: action.color }]}>{action.label}</Text>
                    </Pressable>
                  ))}
                </RNView>
              </>
            )}
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 40,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    textAlign: 'center',
  },
  inventorySection: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inventoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  inventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  specialtyInventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  fishingInventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  inventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  specialtyInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  coffeeInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sodaInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  fishingInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  inventoryCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  clearInventoryButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearInventoryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  statsSection: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#6b7280',
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  safetyDepositSection: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  safetyDepositText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  safetyDepositButtonSection: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 24,
  },
  safetyDepositButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  safetyDepositButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalImage: {
    width: 80,
    height: 80,
  },
  modalDetails: {
    marginBottom: 20,
  },
  modalDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  modalStats: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalStatLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  modalStatValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  quantitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  quantityLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: '600',
  },
});
