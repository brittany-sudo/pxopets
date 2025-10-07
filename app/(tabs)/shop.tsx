import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSimpleGame } from '@/store/SimpleGameStore';

// Import lunchbox images
const gameLunchboxImage = require('@/assets/images/game-lunchbox.png');
const cuteLunchboxImage = require('@/assets/images/cute-lunchbox.png');
const whaleLunchboxImage = require('@/assets/images/whale-lunchbox.png');
const rocketLunchboxImage = require('@/assets/images/rocket-lunchbox.png');
const dragonLunchboxImage = require('@/assets/images/dragon-lunchbox.png');

export default function ShopScreen() {
  const { state, spendTickets, addFood, addBackground, hasBackground, hydrated } = useSimpleGame();
  const [selectedCategory, setSelectedCategory] = useState('tickets');
  const [showBackgroundConfirm, setShowBackgroundConfirm] = useState(false);
  const [showBackgroundSuccess, setShowBackgroundSuccess] = useState(false);
  const [showBackgroundAlreadyOwned, setShowBackgroundAlreadyOwned] = useState(false);
  const [showBackgroundNotEnoughTickets, setShowBackgroundNotEnoughTickets] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<any>(null);
  
  // Wait for data to load before rendering
  if (!hydrated) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const categories = [
    { id: 'tickets', name: 'TICKETS', icon: 'ticket' },
    { id: 'foods', name: 'FOODS', icon: 'cutlery' },
    { id: 'backgrounds', name: 'BACKGROUNDS', icon: 'image' },
    { id: 'event-passes', name: 'EVENT PASSES', icon: 'calendar' },
    { id: 'special-items', name: 'SPECIAL ITEMS', icon: 'gift' },
  ];

  const premiumItems = [
    {
      id: 'tickets_100',
      name: '100 TICKETS',
      price: 0.99,
      currency: 'USD',
      icon: 'ticket',
      color: '#8b5cf6',
      description: 'Perfect starter pack!',
      popular: true,
    },
    {
      id: 'tickets_550',
      name: '550 TICKETS',
      price: 4.99,
      currency: 'USD',
      icon: 'ticket',
      color: '#8b5cf6',
      description: 'Best value! 10% bonus',
      popular: false,
      bonus: '+10%',
    },
    {
      id: 'tickets_1200',
      name: '1200 TICKETS',
      price: 9.99,
      currency: 'USD',
      icon: 'ticket',
      color: '#8b5cf6',
      description: 'Most popular! 20% bonus',
      popular: true,
      bonus: '+20%',
    },
    {
      id: 'tickets_2500',
      name: '2500 TICKETS',
      price: 19.99,
      currency: 'USD',
      icon: 'ticket',
      color: '#8b5cf6',
      description: 'Ultimate pack! 30% bonus',
      popular: false,
      bonus: '+30%',
    },
  ];

  const foodItems = [
    {
      id: 'apple',
      name: 'APPLE',
      price: 10,
      currency: 'stamina',
      icon: 'apple',
      color: '#ef4444',
      description: 'Gives +5 stamina',
      stamina: '+5',
      rarity: 'common',
    },
    {
      id: 'sandwich',
      name: 'SANDWICH',
      price: 25,
      currency: 'stamina',
      icon: 'cutlery',
      color: '#f97316',
      description: 'Gives +15 stamina',
      stamina: '+15',
      rarity: 'common',
    },
    {
      id: 'energy_drink',
      name: 'ENERGY DRINK',
      price: 50,
      currency: 'stamina',
      icon: 'tint',
      color: '#10b981',
      description: 'Gives +25 stamina',
      stamina: '+25',
      rarity: 'rare',
    },
    {
      id: 'golden_apple',
      name: 'GOLDEN APPLE',
      price: 100,
      currency: 'stamina',
      icon: 'apple',
      color: '#f59e0b',
      description: 'Gives +50 stamina',
      stamina: '+50',
      rarity: 'legendary',
    },
    {
      id: 'pizza_slice',
      name: 'PIZZA SLICE',
      price: 30,
      currency: 'stamina',
      icon: 'cutlery',
      color: '#06b6d4',
      description: 'Gives +20 stamina',
      stamina: '+20',
      rarity: 'common',
    },
  ];

  const ticketItems = [
    {
      id: 'daily_event',
      name: 'DAILY EVENT PASS',
      price: 20,
      currency: 'tickets',
      icon: 'calendar',
      color: '#8b5cf6',
      description: 'Access to daily events',
      duration: '24h',
      rarity: 'common',
    },
    {
      id: 'weekly_event',
      name: 'WEEKLY EVENT PASS',
      price: 100,
      currency: 'tickets',
      icon: 'calendar',
      color: '#8b5cf6',
      description: 'Access to weekly events',
      duration: '7d',
      rarity: 'rare',
    },
    {
      id: 'special_event',
      name: 'SPECIAL EVENT TICKET',
      price: 50,
      currency: 'tickets',
      icon: 'star',
      color: '#8b5cf6',
      description: 'One-time special event access',
      duration: '1 use',
      rarity: 'epic',
    },
    {
      id: 'tournament_pass',
      name: 'TOURNAMENT PASS',
      price: 150,
      currency: 'tickets',
      icon: 'trophy',
      color: '#8b5cf6',
      description: 'Access to tournaments',
      duration: '1 week',
      rarity: 'legendary',
    },
    {
      id: 'vip_access',
      name: 'VIP ACCESS',
      price: 200,
      currency: 'tickets',
      icon: 'crown',
      color: '#8b5cf6',
      description: 'VIP area access',
      duration: '1 month',
      rarity: 'legendary',
    },
  ];

  const backgroundItems = [
    {
      id: 'bg_vapoburbs',
      name: 'VAPOBURBS',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-vapoburbs.png'),
      icon: 'image',
      color: '#8b5cf6',
      description: 'Suburban pixel vibes',
      rarity: 'common',
    },
    {
      id: 'bg_barrelhaven',
      name: 'BARRELHAVEN WARREN',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-barrelhaven-warren.png'),
      icon: 'image',
      color: '#92400e',
      description: 'Cozy wine cellar',
      rarity: 'common',
    },
    {
      id: 'bg_vineyard',
      name: 'VINEYARD',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/vineyard-bg.png'),
      icon: 'image',
      color: '#65a30d',
      description: 'Lush grape fields',
      rarity: 'common',
    },
    {
      id: 'bg_hovercar_races',
      name: 'HOVERCAR RACES',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-hovercar-races.png'),
      icon: 'car',
      color: '#dc2626',
      description: 'High-speed racing action',
      rarity: 'common',
    },
    {
      id: 'bg_fortune_tent',
      name: 'FORTUNE TENT',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-fortune-tent.png'),
      icon: 'magic',
      color: '#7c3aed',
      description: 'Mystical fortune telling',
      rarity: 'common',
    },
    {
      id: 'bg_swamp_lagoon',
      name: 'SWAMP LAGOON',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-swamp-lagoon.png'),
      icon: 'leaf',
      color: '#059669',
      description: 'Mysterious swamp waters',
      rarity: 'common',
    },
    {
      id: 'bg_zodiac_carousel',
      name: 'ZODIAC CAROUSEL',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-zodiac-carousel.png'),
      icon: 'star',
      color: '#f59e0b',
      description: 'Magical zodiac constellation',
      rarity: 'common',
    },
    {
      id: 'bg_twilight_sky',
      name: 'TWILIGHT SKY',
      price: 50,
      currency: 'tickets',
      image: require('@/assets/images/bg-twlight-sky.png'),
      icon: 'moon',
      color: '#6366f1',
      description: 'Dreamy twilight atmosphere',
      rarity: 'common',
    },
  ];

  const specialItems = [
    {
      id: 'game_lunchbox',
      name: 'GAME LUNCHBOX',
      price: 5,
      currency: 'tickets',
      icon: 'gift',
      color: '#8b5cf6',
      description: 'Perfect for gaming snacks!',
      rarity: 'common',
      image: 'game-lunchbox',
    },
    {
      id: 'cute_lunchbox',
      name: 'CUTE LUNCHBOX',
      price: 5,
      currency: 'tickets',
      icon: 'gift',
      color: '#ec4899',
      description: 'Adorably cute lunch container',
      rarity: 'common',
      image: 'cute-lunchbox',
    },
    {
      id: 'whale_lunchbox',
      name: 'WHALE LUNCHBOX',
      price: 5,
      currency: 'tickets',
      icon: 'gift',
      color: '#06b6d4',
      description: 'Whale-sized appetite container',
      rarity: 'common',
      image: 'whale-lunchbox',
    },
    {
      id: 'rocket_lunchbox',
      name: 'ROCKET LUNCHBOX',
      price: 5,
      currency: 'tickets',
      icon: 'gift',
      color: '#f59e0b',
      description: 'Blast off with space food!',
      rarity: 'common',
      image: 'rocket-lunchbox',
    },
    {
      id: 'dragon_lunchbox',
      name: 'DRAGON LUNCHBOX',
      price: 5,
      currency: 'tickets',
      icon: 'gift',
      color: '#ef4444',
      description: 'Fiery dragon-themed container',
      rarity: 'common',
      image: 'dragon-lunchbox',
    },
  ];

  const getCurrentItems = () => {
    switch (selectedCategory) {
      case 'tickets': return premiumItems;
      case 'foods': return foodItems;
      case 'backgrounds': return backgroundItems;
      case 'event-passes': return ticketItems;
      case 'special-items': return specialItems;
      default: return premiumItems;
    }
  };

  const handlePurchase = (item: any) => {
    // Check if it's a background
    if (item.id && item.id.startsWith('bg_')) {
      // Check if already owned
      if (hasBackground(item.id)) {
        setSelectedBackground(item);
        setShowBackgroundAlreadyOwned(true);
        return;
      }
      
      // Check if they have enough tickets
      if (state.tickets >= item.price) {
        setSelectedBackground(item);
        setShowBackgroundConfirm(true);
      } else {
        setSelectedBackground(item);
        setShowBackgroundNotEnoughTickets(true);
      }
      return;
    }

    // Handle other purchases (foods, etc)
    if (item.currency === 'USD') {
      Alert.alert(
        'Premium Purchase',
        `Purchase ${item.name} for $${item.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Test Purchase', onPress: () => {
            Alert.alert('Success!', `Test purchase completed!`);
          }}
        ]
      );
    } else if (item.currency === 'tickets') {
      if (state.tickets >= item.price) {
        spendTickets(item.price);
        Alert.alert('Purchased!', `You bought ${item.name}!`);
      } else {
        Alert.alert('Not enough tickets!', 'You need more tickets to buy this item.');
      }
    } else if (item.currency === 'stamina') {
      if (state.stamina >= item.price) {
        addFood(item.id, 1);
        Alert.alert('Purchased!', `You bought ${item.name}! It's been added to your food inventory.`);
      } else {
        Alert.alert('Not enough stamina!', 'You need more stamina to buy this item.');
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleBackgroundConfirm = () => {
    if (selectedBackground) {
      spendTickets(selectedBackground.price);
      addBackground(selectedBackground.id);
      setShowBackgroundConfirm(false);
      setShowBackgroundSuccess(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Second Top Navigation */}
      <RNView style={styles.secondNavContainer}>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Inventory', 'View your inventory!')}>
          <FontAwesome name="shopping-bag" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>INVENTORY</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Wishlist', 'Wishlist coming soon!')}>
          <FontAwesome name="heart" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>WISHLIST</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Deals', 'Special deals!')}>
          <FontAwesome name="tag" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>DEALS</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('History', 'Purchase history!')}>
          <FontAwesome name="history" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>HISTORY</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => Alert.alert('Settings', 'Shop settings!')}>
          <FontAwesome name="cog" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>SETTINGS</Text>
        </Pressable>
      </RNView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Shop Header */}
        <RNView style={styles.shopHeaderContainer}>
          <Text style={styles.shopHeaderText}>
            PXOBURBS MARKETPLACE
          </Text>
        </RNView>

        {/* Category Tabs */}
        <RNView style={styles.categoryTabs}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </RNView>


        {/* Items Container */}
        <RNView style={styles.itemsContainer}>
          <RNView style={styles.itemsGrid}>
          {getCurrentItems().map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.itemCard,
                item.popular && styles.popularCard,
                item.rarity && { borderColor: getRarityColor(item.rarity) }
              ]}
              onPress={() => handlePurchase(item)}
            >
              {item.popular && (
                <RNView style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPULAR</Text>
                </RNView>
              )}
              <RNView style={styles.activityHeader}>
                <RNView style={[
                  styles.activityIconContainer,
                  selectedCategory === 'backgrounds' && styles.backgroundIconContainer
                ]}>
                  {selectedCategory === 'special-items' ? (
                    <Image 
                      source={
                        item.image === 'game-lunchbox' ? gameLunchboxImage :
                        item.image === 'cute-lunchbox' ? cuteLunchboxImage :
                        item.image === 'whale-lunchbox' ? whaleLunchboxImage :
                        item.image === 'rocket-lunchbox' ? rocketLunchboxImage :
                        item.image === 'dragon-lunchbox' ? dragonLunchboxImage :
                        gameLunchboxImage
                      } 
                      style={styles.lunchboxIcon} 
                    />
                  ) : selectedCategory === 'backgrounds' && item.image ? (
                    <Image 
                      source={item.image} 
                      style={styles.backgroundThumbnail} 
                    />
                  ) : (
                    <FontAwesome name={item.icon as any} size={16} color={item.color} />
                  )}
                </RNView>
              </RNView>
              {selectedCategory === 'backgrounds' ? (
                <>
                  <Text style={styles.backgroundItemName}>{item.name}</Text>
                  <Text style={styles.backgroundItemDescription}>{item.description}</Text>
                  
                  {/* Show OWNED badge for backgrounds */}
                  {item.id && item.id.startsWith('bg_') && hasBackground(item.id) ? (
                    <RNView style={styles.backgroundOwnedBadge}>
                      <FontAwesome name="check-circle" size={14} color="#10b981" />
                      <Text style={styles.backgroundOwnedText}>OWNED</Text>
                    </RNView>
                  ) : (
                    <RNView style={styles.backgroundPriceContainer}>
                      <RNView style={styles.backgroundTicketContainer}>
                        <FontAwesome name="ticket" size={16} color="#8b5cf6" />
                        <Text style={styles.backgroundPriceText}>{item.price}</Text>
                      </RNView>
                      <Pressable 
                        style={styles.backgroundBuyButton}
                        onPress={() => handlePurchase(item)}
                      >
                        <Text style={styles.backgroundBuyButtonText}>BUY</Text>
                      </Pressable>
                    </RNView>
                  )}
                </>
              ) : (
                <>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  {item.stamina && (
                    <RNView style={styles.staminaContainer}>
                      <Text style={styles.staminaText}>⚡ {item.stamina}</Text>
                    </RNView>
                  )}
                  
                  <RNView style={styles.activityFooter}>
                    <RNView style={styles.ticketPriceContainer}>
                      <Text style={styles.activityPrice}>
                        {item.currency === 'USD' ? '$' : ''}{item.price}
                        {item.currency === 'stamina' && ' ⚡'}
                      </Text>
                      {item.currency === 'tickets' && (
                        <FontAwesome name="ticket" size={10} color="#8b5cf6" />
                      )}
                    </RNView>
                    {item.duration && (
                      <Text style={styles.duration}>{item.duration}</Text>
                    )}
                    {item.bonus && (
                      <RNView style={styles.bonusBadgeBottomRight}>
                        <Text style={styles.bonusText}>{item.bonus}</Text>
                      </RNView>
                    )}
                  </RNView>
                </>
              )}
            </Pressable>
          ))}
          </RNView>
        </RNView>
      </ScrollView>

      {/* Background Purchase Confirmation Modal */}
      {showBackgroundConfirm && selectedBackground && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.backgroundConfirmPopup}>
            <Text style={styles.backgroundConfirmTitle}>PURCHASE CONFIRMATION</Text>
            <RNView style={styles.backgroundConfirmItemContainer}>
              <Image 
                source={selectedBackground.image} 
                style={styles.backgroundConfirmImage} 
              />
            </RNView>
            <Text style={styles.backgroundConfirmText}>
              Purchase {selectedBackground.name} for {selectedBackground.price} tickets?
            </Text>
            <RNView style={styles.backgroundConfirmButtons}>
              <Pressable 
                style={styles.backgroundConfirmCancelButton}
                onPress={() => setShowBackgroundConfirm(false)}
              >
                <Text style={styles.backgroundConfirmCancelText}>CANCEL</Text>
              </Pressable>
              <Pressable 
                style={styles.backgroundConfirmBuyButton}
                onPress={handleBackgroundConfirm}
              >
                <Text style={styles.backgroundConfirmBuyText}>BUY</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
      )}

      {/* Background Purchase Success Modal */}
      {showBackgroundSuccess && selectedBackground && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.backgroundSuccessPopup}>
            <RNView style={styles.backgroundSuccessIconContainer}>
              <FontAwesome name="check-circle" size={40} color="#10b981" />
            </RNView>
            <Text style={styles.backgroundSuccessTitle}>PURCHASED!</Text>
            <Text style={styles.backgroundSuccessText}>
              You bought {selectedBackground.name}! Check your closet to equip it.
            </Text>
            <Pressable 
              style={styles.backgroundSuccessButton}
              onPress={() => setShowBackgroundSuccess(false)}
            >
              <Text style={styles.backgroundSuccessButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Background Already Owned Modal */}
      {showBackgroundAlreadyOwned && selectedBackground && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.backgroundAlreadyOwnedPopup}>
            <RNView style={styles.backgroundAlreadyOwnedIconContainer}>
              <FontAwesome name="exclamation-triangle" size={40} color="#f59e0b" />
            </RNView>
            <Text style={styles.backgroundAlreadyOwnedTitle}>ALREADY OWNED</Text>
            <Text style={styles.backgroundAlreadyOwnedText}>
              You already own this background!
            </Text>
            <Pressable 
              style={styles.backgroundAlreadyOwnedButton}
              onPress={() => setShowBackgroundAlreadyOwned(false)}
            >
              <Text style={styles.backgroundAlreadyOwnedButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Background Not Enough Tickets Modal */}
      {showBackgroundNotEnoughTickets && selectedBackground && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.backgroundNotEnoughTicketsPopup}>
            <RNView style={styles.backgroundNotEnoughTicketsIconContainer}>
              <FontAwesome name="ticket" size={40} color="#ef4444" />
            </RNView>
            <Text style={styles.backgroundNotEnoughTicketsTitle}>NOT ENOUGH TICKETS</Text>
            <Text style={styles.backgroundNotEnoughTicketsText}>
              You need {selectedBackground.price} tickets to buy this background.
            </Text>
            <Pressable 
              style={styles.backgroundNotEnoughTicketsButton}
              onPress={() => setShowBackgroundNotEnoughTickets(false)}
            >
              <Text style={styles.backgroundNotEnoughTicketsButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  secondNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    backgroundColor: 'transparent',
  },
  navButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  shopHeaderContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  shopHeaderText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  itemsContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  loadingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginTop: 100,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
    flexGrow: 1,
    paddingBottom: 100,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#0f172a',
    minWidth: 90,
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryTabActive: {
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  categoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  shopTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0f172a',
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    position: 'relative',
  },
  popularCard: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  popularText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  bonusBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  bonusBadgeBottomRight: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  bonusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  lunchboxIcon: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  backgroundThumbnail: {
    width: 160,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  backgroundItemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 18,
  },
  backgroundItemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  backgroundPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backgroundTicketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 6,
  },
  backgroundPriceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  backgroundBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  backgroundBuyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  backgroundOwnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    marginHorizontal: 8,
  },
  backgroundOwnedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#10b981',
    fontWeight: 'bold',
  },
  backgroundIconContainer: {
    width: 150,
    height: 90,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  ownedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10b981',
    marginBottom: 8,
  },
  ownedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#94a3b8',
    lineHeight: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '400',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Larger price text
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  duration: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    opacity: 0.6,
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  // Background Purchase Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backgroundConfirmPopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
  },
  backgroundConfirmTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backgroundConfirmItemContainer: {
    marginBottom: 20,
  },
  backgroundConfirmImage: {
    width: 200,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  backgroundConfirmText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  backgroundConfirmButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backgroundConfirmCancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backgroundConfirmCancelText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  backgroundConfirmBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundConfirmBuyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  backgroundSuccessPopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10b981',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
  },
  backgroundSuccessIconContainer: {
    marginBottom: 16,
  },
  backgroundSuccessTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backgroundSuccessText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  backgroundSuccessButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundSuccessButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  backgroundAlreadyOwnedPopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
  },
  backgroundAlreadyOwnedIconContainer: {
    marginBottom: 16,
  },
  backgroundAlreadyOwnedTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backgroundAlreadyOwnedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  backgroundAlreadyOwnedButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundAlreadyOwnedButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  backgroundNotEnoughTicketsPopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
  },
  backgroundNotEnoughTicketsIconContainer: {
    marginBottom: 16,
  },
  backgroundNotEnoughTicketsTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  backgroundNotEnoughTicketsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  backgroundNotEnoughTicketsButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backgroundNotEnoughTicketsButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});