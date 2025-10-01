import React from 'react';
import { StyleSheet, View as RNView, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { useInventory } from '@/store/InventoryStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PlayerHomeScreen() {
  const { state, hydrated } = useSimpleGame();
  const { state: inventoryState, addItem, clearAllItems } = useInventory();
  
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Player Profile Card */}
        <RNView style={styles.playerProfileCard}>
          {/* Pokemon-style Header */}
          <RNView style={styles.profileHeader}>
            <RNView style={styles.avatarContainer}>
              <RNView style={styles.avatarFrame}>
                <Image
                  source={require('@/assets/images/tigerguy.png')}
                  style={styles.playerAvatar}
                  resizeMode="contain"
                />
              </RNView>
            </RNView>
            <RNView style={styles.playerInfo}>
              <Text style={styles.playerName}>PxopetMaster</Text>
              <Text style={styles.playerTitle}>Adventure Seeker</Text>
              <RNView style={styles.bioContainer}>
                <TextInput
                  style={styles.bioInput}
                  defaultValue="Collecting rare pets & exploring pixel worlds! 🌟"
                  maxLength={50}
                  multiline={false}
                />
              </RNView>
            </RNView>
          </RNView>
          
          <RNView style={styles.statsContainer}>
            <RNView style={[styles.statItem, { paddingLeft: 10 }]}>
              <Text style={styles.statLabel}>LEVEL</Text>
              <Text style={styles.statValue}>12</Text>
            </RNView>
            <RNView style={styles.statItem}>
              <Text style={styles.statLabel}>HP</Text>
              <Text style={styles.statValue}>85/100</Text>
            </RNView>
            <RNView style={[styles.statItem, { paddingRight: 10 }]}>
              <Text style={styles.statLabel}>EXP</Text>
              <Text style={styles.statValue}>2,450</Text>
            </RNView>
          </RNView>
          
          {/* Co-star Style Action Buttons */}
          <RNView style={styles.profileStats}>
            <RNView style={styles.actionButtonsRow}>
              <Pressable style={[styles.actionButton, styles.primaryButton]}>
                <FontAwesome name="home" size={14} color="#8b5cf6" />
                <Text style={styles.primaryButtonText}>Rooms</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.secondaryButton]}>
                <FontAwesome name="shopping-bag" size={14} color="#8b5cf6" />
                <Text style={styles.secondaryButtonText}>Shop</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.accentButton]}>
                <FontAwesome name="calendar" size={14} color="#8b5cf6" />
                <Text style={styles.accentButtonText}>Dailies</Text>
              </Pressable>
            </RNView>
            <RNView style={styles.actionButtonsRow}>
              <Pressable style={[styles.actionButton, styles.warningButton]}>
                <FontAwesome name="trophy" size={14} color="#8b5cf6" />
                <Text style={styles.warningButtonText}>Trophies</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.successButton]}>
                <FontAwesome name="bank" size={14} color="#8b5cf6" />
                <Text style={styles.successButtonText}>Bank</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.infoButton]}>
                <FontAwesome name="users" size={14} color="#8b5cf6" />
                <Text style={styles.infoButtonText}>Clubs</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>

        {/* Active Pet Section */}
        <RNView style={styles.petSection}>
          <Text style={styles.sectionTitle}>ACTIVE PET</Text>
          <RNView style={styles.petCard}>
            <RNView style={styles.petHeader}>
              <Image
                source={require('@/assets/images/tigerguy.png')}
                style={styles.petImage}
                resizeMode="contain"
              />
              <RNView style={styles.petInfo}>
                <Text style={styles.petName}>TigerGuy</Text>
                <Text style={styles.petLevel}>Level 12</Text>
              </RNView>
            </RNView>
            
            <RNView style={styles.hpBarContainer}>
              <Text style={styles.hpLabel}>HP</Text>
              <RNView style={styles.hpBarBackground}>
                <RNView style={[styles.hpBarFill, { width: '85%' }]} />
              </RNView>
              <Text style={styles.hpText}>85/100</Text>
            </RNView>
            
            <RNView style={styles.expBarContainer}>
              <Text style={styles.expLabel}>EXP</Text>
              <RNView style={styles.expBarBackground}>
                <RNView style={[styles.expBarFill, { width: '60%' }]} />
              </RNView>
              <Text style={styles.expText}>1200/2000</Text>
            </RNView>
            
            <RNView style={styles.statsGrid}>
              <RNView style={styles.statItem}>
                <Text style={styles.statLabel}>ATK</Text>
                <Text style={styles.statValue}>120</Text>
              </RNView>
              <RNView style={styles.statItem}>
                <Text style={styles.statLabel}>DEF</Text>
                <Text style={styles.statValue}>96</Text>
              </RNView>
              <RNView style={styles.statItem}>
                <Text style={styles.statLabel}>SPD</Text>
                <Text style={styles.statValue}>144</Text>
              </RNView>
            </RNView>
            
            <RNView style={styles.statsGrid}>
              <RNView style={styles.statItem}>
                <Text style={styles.statLabel}>HP</Text>
                <Text style={styles.statValue}>100</Text>
              </RNView>
              <RNView style={styles.statItem}>
                <Text style={styles.statLabel}>SPC</Text>
                <Text style={styles.statValue}>88</Text>
              </RNView>
              <RNView style={styles.statItem}>
                <Text style={styles.statLabel}>LUK</Text>
                <Text style={styles.statValue}>72</Text>
              </RNView>
            </RNView>
          </RNView>
        </RNView>

        {/* Visual Inventory */}
        <RNView style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>Inventory</Text>
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
                  <RNView key={`${item.name}-${item.image}-${index}`} style={item.image === 'slushee3' ? styles.specialtyInventoryItem : item.category === 'fishing' ? styles.fishingInventoryItem : styles.inventoryItem}>
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
                </RNView>
                )
                });
              })()}
            </RNView>
          )}
          
          {/* Dev Tool - Clear Inventory */}
          <Pressable 
            style={styles.clearInventoryButton}
            onPress={() => clearAllItems()}
          >
            <FontAwesome name="trash" size={14} color="#ffffff" />
            <Text style={styles.clearInventoryButtonText}>Clear Inventory</Text>
          </Pressable>
        </RNView>
      </ScrollView>
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
  welcomeSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  playerProfileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderWidth: 1,
    borderColor: '#14b8a6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  levelBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#000000',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  levelText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  playerTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '400',
    marginBottom: 4,
  },
  bioContainer: {
    marginTop: 4,
  },
  bioLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  bioInput: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#000000',
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderWidth: 1,
    borderColor: '#14b8a6',
    borderRadius: 6,
    padding: 8,
    minHeight: 32,
  },
  playerDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  profileStats: {
    marginTop: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#6b7280',
    fontWeight: '400',
    marginBottom: 0,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  primaryButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  accentButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  warningButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  successButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  infoButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  primaryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
  },
  secondaryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
  },
  accentButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
  },
  warningButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
  },
  successButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
  },
  infoButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  petSection: {
    marginBottom: 24,
  },
  petCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petImage: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#999999',
  },
  hpBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hpLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    width: 30,
  },
  hpBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 5,
  },
  hpText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    minWidth: 50,
    textAlign: 'right',
  },
  expBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    width: 30,
  },
  expBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  expBarFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  expText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    minWidth: 60,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#999999',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  petActionButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  petActionText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  actionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
  },
  activityReward: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  inventorySection: {
    marginBottom: 24,
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
  emojiText: {
    fontSize: 20,
    textAlign: 'center',
  },
  inventoryItemName: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 10,
  },
  clearInventoryButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  clearInventoryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inventoryCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  emptySlot: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#cccccc',
  },
});


