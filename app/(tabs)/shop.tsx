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
    // Check if it's a background
    if (item.id && item.id.startsWith('bg_')) {
      // Check if already owned
      if (hasBackground(item.id)) {
        Alert.alert('Already Owned', 'You already own this background!');
        return;
      }
      
      // Check if they have enough tickets
      if (state.tickets >= item.price) {
        spendTickets(item.price);
        addBackground(item.id);
        Alert.alert('Purchased!', `You bought ${item.name}! Check your closet to equip it.`);
      } else {
        Alert.alert('Not enough tickets!', 'You need more tickets to buy this background.');
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

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
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              {item.stamina && (
                <RNView style={styles.staminaContainer}>
                  <Text style={styles.staminaText}>⚡ {item.stamina}</Text>
                </RNView>
              )}
              
              {/* Show OWNED badge for backgrounds */}
              {item.id && item.id.startsWith('bg_') && hasBackground(item.id) && (
                <RNView style={styles.ownedBadge}>
                  <FontAwesome name="check-circle" size={12} color="#10b981" />
                  <Text style={styles.ownedText}>OWNED</Text>
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
    backgroundColor: '#fafafa',
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  categoryTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 16,
    padding: 12,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 0,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  categoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  categoryTextActive: {
    color: '#8b5cf6',
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
    paddingHorizontal: 8,
    gap: 8,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
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
  backgroundThumbnail: {
    width: 140,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 10,
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
});