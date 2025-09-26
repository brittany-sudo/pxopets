import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGame } from '@/store/GameStore';
import JazzyTitle from '@/components/JazzyTitle';

export default function ShopScreen() {
  const { state, addCoins, spendCoins } = useGame();
  const [selectedCategory, setSelectedCategory] = useState('premium');

  const categories = [
    { id: 'premium', name: 'PREMIUM', icon: 'diamond' },
    { id: 'foods', name: 'FOODS', icon: 'cutlery' },
    { id: 'backgrounds', name: 'BACKGROUNDS', icon: 'image' },
    { id: 'tickets', name: 'TICKETS', icon: 'ticket' },
    { id: 'boosters', name: 'BOOSTERS', icon: 'bolt' },
    { id: 'cosmetics', name: 'COSMETICS', icon: 'star' },
  ];

  const premiumItems = [
    {
      id: 'tickets_100',
      name: '100 TICKETS',
      price: 0.99,
      currency: 'USD',
      icon: 'ticket',
      color: '#0ea5e9',
      description: 'Perfect starter pack!',
      popular: true,
    },
    {
      id: 'tickets_550',
      name: '550 TICKETS',
      price: 4.99,
      currency: 'USD',
      icon: 'ticket',
      color: '#0ea5e9',
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
      color: '#0ea5e9',
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
      color: '#0ea5e9',
      description: 'Ultimate pack! 30% bonus',
      popular: false,
      bonus: '+30%',
    },
  ];

  const foodItems = [
    {
      id: 'cupcake',
      name: 'CUPCAKE',
      price: 5,
      currency: 'stamina',
      icon: 'birthday-cake',
      color: '#ec4899',
      description: 'Gives +20 stamina',
      stamina: '+20',
      rarity: 'common',
    },
    {
      id: 'pizza_slice',
      name: 'PIZZA SLICE',
      price: 8,
      currency: 'stamina',
      icon: 'cutlery',
      color: '#f97316',
      description: 'Gives +35 stamina',
      stamina: '+35',
      rarity: 'common',
    },
    {
      id: 'sushi_roll',
      name: 'SUSHI ROLL',
      price: 15,
      currency: 'stamina',
      icon: 'circle',
      color: '#10b981',
      description: 'Gives +50 stamina',
      stamina: '+50',
      rarity: 'rare',
    },
    {
      id: 'chocolate_bar',
      name: 'CHOCOLATE BAR',
      price: 12,
      currency: 'stamina',
      icon: 'square',
      color: '#8b5cf6',
      description: 'Gives +40 stamina',
      stamina: '+40',
      rarity: 'uncommon',
    },
    {
      id: 'ice_cream',
      name: 'ICE CREAM',
      price: 6,
      currency: 'stamina',
      icon: 'tint',
      color: '#06b6d4',
      description: 'Gives +25 stamina',
      stamina: '+25',
      rarity: 'common',
    },
    {
      id: 'golden_apple',
      name: 'GOLDEN APPLE',
      price: 25,
      currency: 'stamina',
      icon: 'apple',
      color: '#fbbf24',
      description: 'Gives +100 stamina',
      stamina: '+100',
      rarity: 'epic',
    },
  ];

  const ticketItems = [
    {
      id: 'daily_event',
      name: 'DAILY EVENT PASS',
      price: 20,
      currency: 'tickets',
      icon: 'calendar',
      color: '#10b981',
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
      color: '#f59e0b',
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
      color: '#dc2626',
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
      color: '#fbbf24',
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

  const boosterItems = [
    {
      id: 'speed_boost',
      name: 'SPEED BOOST',
      price: 50,
      currency: 'tickets',
      icon: 'bolt',
      color: '#f97316',
      description: '2x speed for 1 hour',
      duration: '1h',
    },
    {
      id: 'coin_multiplier',
      name: 'COIN MULTIPLIER',
      price: 75,
      currency: 'tickets',
      icon: 'money',
      color: '#fbbf24',
      description: '3x coins for 2 hours',
      duration: '2h',
    },
    {
      id: 'xp_boost',
      name: 'XP BOOST',
      price: 60,
      currency: 'tickets',
      icon: 'level-up',
      color: '#10b981',
      description: '2x XP for 1 hour',
      duration: '1h',
    },
  ];

  const getCurrentItems = () => {
    switch (selectedCategory) {
      case 'premium': return premiumItems;
      case 'foods': return foodItems;
      case 'backgrounds': return backgroundItems;
      case 'tickets': return ticketItems;
      case 'boosters': return boosterItems;
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
          { text: 'Buy Now', onPress: () => {
            // In real app, this would trigger payment
            Alert.alert('Success!', 'Purchase completed!');
          }}
        ]
      );
    } else {
      if (state.coins >= item.price) {
        spendCoins(item.price);
        Alert.alert('Purchased!', `You bought ${item.name}!`);
      } else {
        Alert.alert('Not enough gems!', 'You need more gems to buy this item.');
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
        <JazzyTitle style={styles.title}>PREMIUM SHOP</JazzyTitle>
        
        <BorderedBox>
          {/* Currency Display */}
          <RNView style={styles.currencyBar}>
            <RNView style={styles.currencyItem}>
              <FontAwesome name="diamond" size={20} color="#8b5cf6" />
              <Text style={styles.currencyText}>{state.coins}</Text>
            </RNView>
            <RNView style={styles.currencyItem}>
              <FontAwesome name="ticket" size={20} color="#0ea5e9" />
              <Text style={styles.currencyText}>0</Text>
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
                  color={selectedCategory === category.id ? '#0f172a' : 'rgba(139, 92, 246, 0.8)'} 
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
                {item.bonus && (
                  <RNView style={styles.bonusBadge}>
                    <Text style={styles.bonusText}>{item.bonus}</Text>
                  </RNView>
                )}
                <RNView style={[styles.itemIcon, { backgroundColor: item.color + '20' }]}>
                  <FontAwesome name={item.icon as any} size={24} color={item.color} />
                </RNView>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                {item.stamina && (
                  <RNView style={styles.staminaContainer}>
                    <FontAwesome name="heart" size={12} color="#ec4899" />
                    <Text style={styles.staminaText}>{item.stamina} Stamina</Text>
                  </RNView>
                )}
                <RNView style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {item.currency === 'USD' ? '$' : ''}{item.price}
                    {item.currency === 'stamina' && ' ⚡'}
                    {item.currency === 'tickets' && ' 🎫'}
                  </Text>
                  {item.duration && (
                    <Text style={styles.duration}>{item.duration}</Text>
                  )}
                </RNView>
              </Pressable>
            ))}
          </RNView>
        </BorderedBox>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'left',
  },
  currencyBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  currencyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
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
    color: 'rgba(139, 92, 246, 0.8)',
  },
  categoryTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  itemCard: {
    width: '45%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    padding: 12,
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
  bonusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0f172a',
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  duration: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    opacity: 0.6,
    marginTop: 2,
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ec4899',
    fontWeight: 'bold',
  },
});