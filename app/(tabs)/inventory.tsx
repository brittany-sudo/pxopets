import React, { useState } from 'react';
import { StyleSheet, View as RNView, ScrollView, Image, Pressable, Alert, Modal, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useInventory } from '@/store/InventoryStore';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function InventoryScreen() {
  const { state: inventoryState, clearAllItems, removeItem, moveToSafetyDeposit, addItem } = useInventory();
  const { state: gameState } = useSimpleGame();
  const { getActivePet, addStaminaToPet } = usePets();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRefillConfirm, setShowRefillConfirm] = useState(false);
  const [showDrinkSuccess, setShowDrinkSuccess] = useState(false);
  const [drinkSuccessData, setDrinkSuccessData] = useState<{petName: string, sodaName: string} | null>(null);
  const [showNoActivePet, setShowNoActivePet] = useState(false);

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleItemAction = (action: string) => {
    if (!selectedItem) return;

    switch (action) {
      case 'use':
        Alert.alert('Use Item', `You used ${selectedItem.name}!`);
        removeItem(selectedItem.id, 1);
        break;
      case 'donate':
        Alert.alert(
          'Donate Item',
          `Donate ${selectedItem.name} to the Lost & Found Kiosk?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Donate',
              style: 'default',
              onPress: () => {
                // Add item to Lost & Found (this would need to be connected to the Lost & Found system)
                removeItem(selectedItem.id, 1);
                Alert.alert('Donated', `${selectedItem.name} has been donated to the Lost & Found Kiosk!`);
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
        Alert.alert('Sell Item', `Sell ${selectedItem.name} for ${selectedItem.price} tickets?`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sell',
            onPress: () => {
              removeItem(selectedItem.id, 1);
              Alert.alert('Sold', `You sold ${selectedItem.name} for ${selectedItem.price} tickets!`);
            }
          }
        ]);
        break;
      case 'empty':
        Alert.alert('Empty Jug', `Empty your Pxogulp Refillable Jug?`, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Empty',
            onPress: () => {
              Alert.alert('Jug Emptied', `Your Pxogulp Refillable Jug has been emptied!`);
            }
          }
        ]);
        break;
      case 'drink':
        const activePet = getActivePet();
        if (!activePet) {
          setShowNoActivePet(true);
          return;
        }
        
        // Remove the filled jug
        removeItem(selectedItem.id, 1);
        
        // Add back empty refillable jug
        addItem({
          id: 'pxogulp-refillable-jug',
          name: 'Pxogulp Refillable Jug',
          price: 0,
          image: 'pxogulp-jug.png',
          category: 'drink' as const,
          description: 'A refillable jug for Pxogulp soda - empty and ready to be filled',
          isFilled: false
        }, 1);
        
        // Add 20 stamina to the active pet
        addStaminaToPet(activePet.id, 20);
        
        // Show success modal
        setDrinkSuccessData({
          petName: activePet.name,
          sodaName: selectedItem.originalSoda || 'soda'
        });
        setShowDrinkSuccess(true);
        break;
      case 'refill':
        setModalVisible(false);
        setShowRefillConfirm(true);
        break;
    }
    setModalVisible(false);
  };

  const getItemActions = (item: any) => {
    const actions = [];
    
    // All items can be donated to Lost & Found
    actions.push({ key: 'donate', label: 'Donate', icon: 'gift', color: '#8b5cf6' });
    
    // Special handling for Pxogulp items
    if (item.name && item.name.toLowerCase().includes('pxogulp')) {
      if (item.isFilled || item.id.startsWith('pxogulp-filled-')) {
        // Filled Pxogulp can be drunk
        actions.push({ key: 'drink', label: 'Drink', icon: 'tint', color: '#06b6d4' });
      } else if (item.name.toLowerCase().includes('refillable jug') || item.id === 'pxogulp-refillable-jug') {
        // Empty refillable jug can be refilled
        actions.push({ key: 'refill', label: 'Refill', icon: 'refresh', color: '#8b5cf6' });
      }
    } else {
      // Regular food/drink items can be used
      if (item.category === 'food' || item.category === 'drink' || item.category === 'snack') {
        actions.push({ key: 'use', label: 'Use', icon: 'heart', color: '#10b981' });
      }
      
      // Items with price can be sold
      if (item.price > 0) {
        actions.push({ key: 'sell', label: 'Sell', icon: 'dollar', color: '#f59e0b' });
      }
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
          <Text style={styles.locationTitle}>YOUR INVENTORY</Text>
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
                
                // Sort items to prioritize Pxogulp refillable jug
                const sortedItems = Object.values(groupedItems).sort((a, b) => {
                  const aIsPxogulp = a.name && a.name.toLowerCase().includes('pxogulp') && a.name.toLowerCase().includes('refillable');
                  const bIsPxogulp = b.name && b.name.toLowerCase().includes('pxogulp') && b.name.toLowerCase().includes('refillable');
                  
                  if (aIsPxogulp && !bIsPxogulp) return -1;
                  if (!aIsPxogulp && bIsPxogulp) return 1;
                  return 0; // Keep original order for non-Pxogulp items
                });
                
                return sortedItems.map((item, index) => {
                  return (
                  <Pressable 
                    key={`${item.name}-${item.image}-${index}`} 
                    style={
                      item.name && item.name.toLowerCase().includes('pxogulp') && item.name.toLowerCase().includes('refillable') 
                        ? styles.pxogulpInventoryItem 
                        : item.image === 'slushee3' 
                          ? styles.specialtyInventoryItem 
                          : item.category === 'fishing' 
                            ? styles.fishingInventoryItem 
                            : styles.inventoryItem
                    }
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
          
          {/* Capacity Indicator */}
          <RNView style={styles.capacityIndicator}>
            <RNView style={styles.capacityBar}>
              <RNView 
                style={[
                  styles.capacityFill, 
                  { 
                    width: `${Math.min((inventoryState.mainInventory.length / 50) * 100, 100)}%` 
                  }
                ]} 
              />
            </RNView>
            <Text style={styles.capacityText}>
              {inventoryState.mainInventory.length}/50
            </Text>
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

        {/* Dev Tool - Clear Inventory */}
        <RNView style={styles.clearInventorySection}>
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
            <FontAwesome name="trash" size={12} color="#ef4444" />
            <Text style={styles.clearInventoryButtonText}>Clear Inventory</Text>
          </Pressable>
        </RNView>

      </ScrollView>

      {/* Item Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <RNView style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <RNView style={styles.modalContainer}>
            {selectedItem && (
              <>
                {/* Header with Image, Name and Close */}
                <RNView style={styles.modalHeader}>
                  <Pressable 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <FontAwesome name="times" size={16} color="#9ca3af" />
                  </Pressable>
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
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                </RNView>

                {/* Content */}
                <RNView style={styles.modalContent}>
                  <Text style={styles.modalDescription}>
                    {selectedItem.description || `A ${selectedItem.category} item.`}
                  </Text>
                  
                  <RNView style={styles.modalMeta}>
                    <RNView style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>QTY</Text>
                      <Text style={styles.modalMetaValue}>{selectedItem.quantity}</Text>
                    </RNView>
                    <RNView style={styles.modalMetaItem}>
                      <Text style={styles.modalMetaLabel}>TYPE</Text>
                      <Text style={styles.modalMetaValue}>{selectedItem.category.toUpperCase()}</Text>
                    </RNView>
                    {selectedItem.price > 0 && (
                      <RNView style={styles.modalMetaItem}>
                        <Text style={styles.modalMetaLabel}>VALUE</Text>
                        <Text style={styles.modalMetaValue}>{selectedItem.price} 🎫</Text>
                      </RNView>
                    )}
                  </RNView>
                </RNView>

                {/* Action Buttons */}
                <RNView style={styles.actionButtons}>
                  {getItemActions(selectedItem).map((action) => (
                    <Pressable
                      key={action.key}
                      style={[styles.actionButton, { borderColor: action.color }]}
                      onPress={() => handleItemAction(action.key)}
                    >
                      <FontAwesome name={action.icon as any} size={14} color={action.color} />
                      <Text style={[styles.actionButtonText, { color: action.color }]}>{action.label}</Text>
                    </Pressable>
                  ))}
                </RNView>
              </>
            )}
          </RNView>
        </RNView>
      </Modal>

      {/* Refill Confirmation Modal */}
      {showRefillConfirm && (
        <Modal
          visible={showRefillConfirm}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRefillConfirm(false)}
        >
          <RNView style={styles.refillModalOverlay}>
            <RNView style={styles.refillPopup}>
              <Text style={styles.refillTitle}>REFILL JUG</Text>
              <Text style={styles.refillMessage}>
                Go to Quickstop to refill your Pxogulp jug with your choice of 6 soda flavors?
              </Text>
              <Pressable 
                style={styles.refillButton}
                onPress={() => {
                  setShowRefillConfirm(false);
                  router.navigate('/(tabs)/quickstop');
                }}
              >
                <Text style={styles.refillButtonText}>GO TO QUICKSTOP</Text>
              </Pressable>
              <Pressable 
                style={styles.refillCancelButton}
                onPress={() => setShowRefillConfirm(false)}
              >
                <Text style={styles.refillCancelButtonText}>CANCEL</Text>
              </Pressable>
            </RNView>
          </RNView>
        </Modal>
      )}

      {/* Drink Success Modal */}
      {showDrinkSuccess && drinkSuccessData && (
        <Modal
          visible={showDrinkSuccess}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDrinkSuccess(false)}
        >
          <RNView style={styles.drinkSuccessOverlay}>
            <RNView style={styles.drinkSuccessPopup}>
              <Text style={styles.drinkSuccessTitle}>REFRESHED!</Text>
              <Text style={styles.drinkSuccessMessage}>
                {drinkSuccessData.petName} gained 20 stamina from drinking {drinkSuccessData.sodaName}!
              </Text>
              <Pressable 
                style={styles.drinkSuccessButton}
                onPress={() => setShowDrinkSuccess(false)}
              >
                <Text style={styles.drinkSuccessButtonText}>OK</Text>
              </Pressable>
            </RNView>
          </RNView>
        </Modal>
      )}

      {/* No Active Pet Modal */}
      {showNoActivePet && (
        <Modal
          visible={showNoActivePet}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowNoActivePet(false)}
        >
          <RNView style={styles.noActivePetOverlay}>
            <RNView style={styles.noActivePetPopup}>
              <Text style={styles.noActivePetTitle}>NO ACTIVE PET</Text>
              <Text style={styles.noActivePetMessage}>
                You need an active pet to drink the Pxogulp!
              </Text>
              <Pressable 
                style={styles.noActivePetButton}
                onPress={() => setShowNoActivePet(false)}
              >
                <Text style={styles.noActivePetButtonText}>OK</Text>
              </Pressable>
            </RNView>
          </RNView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 4,
    paddingHorizontal: 20,
    height: 24,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 16,
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
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    gap: 12,
    marginTop: 8,
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  inventoryItem: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 8,
  },
  specialtyInventoryItem: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 8,
  },
  fishingInventoryItem: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 8,
  },
  pxogulpInventoryItem: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  inventoryImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  specialtyInventoryImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  coffeeInventoryImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  sodaInventoryImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  fishingInventoryImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  inventoryCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 18,
    textAlign: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  clearInventorySection: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  clearInventoryButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  clearInventoryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  // Capacity Indicator
  capacityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  capacityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  capacityText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  safetyDepositSection: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  safetyDepositText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  safetyDepositButtonSection: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 16,
  },
  safetyDepositButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  safetyDepositButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Modal Styles - Co-Star inspired
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: '20%',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingTop: 24,
    paddingHorizontal: 28,
    paddingBottom: 32,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 0,
    position: 'relative',
  },
  modalImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalImage: {
    width: 48,
    height: 48,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 0,
    lineHeight: 18,
    textAlign: 'center',
  },
  modalDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  modalMetaItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  modalMetaLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  modalMetaValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 5,
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  // Refill Confirmation Modal
  refillModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  refillConfirmModal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 320,
  },
  refillConfirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  refillConfirmTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    marginLeft: 8,
  },
  refillConfirmMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  refillConfirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  refillConfirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: '#6b7280',
  },
  confirmButton: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  refillConfirmButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Refill Popup (matching daily limit format)
  refillPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    width: 320,
  },
  refillTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  refillMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  refillButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
    minWidth: 120,
  },
  refillButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  refillCancelButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  refillCancelButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Drink Success Modal (matching refill jug format)
  drinkSuccessOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  drinkSuccessPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    width: 320,
  },
  drinkSuccessTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  drinkSuccessMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  drinkSuccessButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0891b2',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 120,
  },
  drinkSuccessButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // No Active Pet Modal (matching daily limit format)
  noActivePetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noActivePetPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    width: 320,
  },
  noActivePetTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  noActivePetMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  noActivePetButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 120,
  },
  noActivePetButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
