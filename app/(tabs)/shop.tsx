import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGame } from '@/store/GameStore';

// Import lunchbox images
const gameLunchboxImage = require('@/assets/images/game-lunchbox.png');
const cuteLunchboxImage = require('@/assets/images/cute-lunchbox.png');
const whaleLunchboxImage = require('@/assets/images/whale-lunchbox.png');
const rocketLunchboxImage = require('@/assets/images/rocket-lunchbox.png');
const dragonLunchboxImage = require('@/assets/images/dragon-lunchbox.png');

export default function ShopScreen() {
  const { state, addCoins, spendCoins, addTickets, spendTickets, addStamina, spendStamina, addFood } = useGame();
  const [selectedCategory, setSelectedCategory] = useState('tickets');

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
      id: 'bg_neon',
      name: 'NEON CITY',
      price: 150,
      currency: 'tickets',
      icon: 'image',
      color: '#00ff88',
      description: 'Cyberpunk vibes',
      rarity: 'epic',
    },
    {
      id: 'bg_forest',
      name: 'MYSTIC FOREST',
      price: 100,
      currency: 'tickets',
      icon: 'tree',
      color: '#10b981',
      description: 'Enchanted woodland',
      rarity: 'rare',
    },
    {
      id: 'bg_space',
      name: 'COSMIC VOID',
      price: 300,
      currency: 'tickets',
      icon: 'rocket',
      color: '#8b5cf6',
      description: 'Stellar adventure',
      rarity: 'legendary',
    },
    {
      id: 'bg_beach',
      name: 'SUNSET BEACH',
      price: 75,
      currency: 'tickets',
      icon: 'sun-o',
      color: '#f59e0b',
      description: 'Tropical paradise',
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
    if (item.currency === 'USD') {
      Alert.alert(
        'Premium Purchase',
        `Purchase ${item.name} for $${item.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Test Purchase', onPress: () => {
            // In real app, this would trigger payment
            // For demo, add tickets based on the item
            const ticketAmount = parseInt(item.name.split(' ')[0]);
            addTickets(ticketAmount);
            Alert.alert('Success!', `Test purchase completed! You received ${ticketAmount} tickets!`);
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
        spendStamina(item.price);
        addFood(item.id, 1);
        Alert.alert('Purchased!', `You bought ${item.name}! It's been added to your food inventory.`);
      } else {
        Alert.alert('Not enough stamina!', 'You need more stamina to buy this item.');
      }
    } else {
      // Legacy coin currency
      if (state.coins >= item.price) {
        spendCoins(item.price);
        Alert.alert('Purchased!', `You bought ${item.name}!`);
      } else {
        Alert.alert('Not enough coins!', 'You need more coins to buy this item.');
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Premium Shop Banner */}
        <RNView style={styles.premiumBanner}>
          <RNView style={styles.bannerGradient}>
            <RNView style={styles.bannerContent}>
              <RNView style={styles.bannerLeft}>
                <RNView style={styles.bannerIconContainer}>
                  <Image 
                    source={require('@/assets/images/milkshakes.png')} 
                    style={styles.bannerImage}
                    resizeMode="contain"
                  />
                </RNView>
                <RNView style={styles.bannerText}>
                  <Text style={styles.bannerTitle}>PREMIUM OFFER</Text>
                  <Text style={styles.bannerSubtitle}>Cosmic Milkshakes</Text>
                  <RNView style={styles.bannerReward}>
                    <Text style={styles.bannerRewardText}>200</Text>
                    <FontAwesome name="bolt" size={12} color="#f59e0b" />
                  </RNView>
                </RNView>
              </RNView>
              <RNView style={styles.bannerRight}>
                <RNView style={styles.priceContainer}>
                  <RNView style={styles.currentPriceRow}>
                    <Text style={styles.bannerPrice}>50</Text>
                    <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                  </RNView>
                  <RNView style={styles.originalPriceRow}>
                    <Text style={styles.bannerOriginalPrice}>75</Text>
                    <FontAwesome name="ticket" size={10} color="#8b5cf6" />
                  </RNView>
                </RNView>
                <Text style={styles.bannerTimer}>2h 15m left</Text>
              </RNView>
            </RNView>
          </RNView>
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
              <FontAwesome 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.id ? '#0f172a' : '#8b5cf6'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </RNView>


        {/* Items Grid */}
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
                <RNView style={styles.activityIconContainer}>
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
                  ) : (
                    <FontAwesome name={item.icon as any} size={16} color={item.color} />
                  )}
                </RNView>
              </RNView>
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
            </Pressable>
          ))}
        </RNView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  premiumBanner: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    position: 'relative',
    marginTop: 8,
    zIndex: 5,
  },
  bannerGradient: {
    backgroundColor: '#ffffff',
    padding: 2,
    position: 'relative',
    zIndex: 10,
    borderRadius: 10,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1e1b4b',
    borderRadius: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIconContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerImage: {
    width: 50,
    height: 50,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
    letterSpacing: 1,
  },
  bannerSubtitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 2,
  },
  bannerReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bannerRewardText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
    marginRight: 4,
  },
  bannerRight: {
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  currentPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 4,
  },
  bannerOriginalPrice: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  bannerTimer: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '500',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
  },
  categoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
  },
  categoryTextActive: {
    color: '#0f172a',
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
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  itemCard: {
    width: '45%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    padding: 16,
    marginBottom: 16,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lunchboxIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDescription: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
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
    fontSize: 10,
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
});