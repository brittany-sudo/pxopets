import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useSimpleGame } from '@/store/SimpleGameStore';

// Import images
const frogMarketMainImage = require('@/assets/images/frogmarket-main.png');
const jeremiahImage = require('@/assets/images/frogmarket-jeremiah.png');

// Import item images
const vintageSweaterImage = require('@/assets/images/moonpetal-tea.png'); // Placeholder
const retroLampImage = require('@/assets/images/milkshakes.png'); // Placeholder
const antiqueBooksImage = require('@/assets/images/glowcorn.png'); // Placeholder
const vintageJewelryImage = require('@/assets/images/moonpetal-tea.png'); // Placeholder
const oldCameraImage = require('@/assets/images/milkshakes.png'); // Placeholder
const thriftMirrorImage = require('@/assets/images/glowcorn.png'); // Placeholder
const retroClockImage = require('@/assets/images/moonpetal-tea.png'); // Placeholder
const vintageHatImage = require('@/assets/images/milkshakes.png'); // Placeholder
const thriftVaseImage = require('@/assets/images/glowcorn.png'); // Placeholder
const vintageScarfImage = require('@/assets/images/moonpetal-tea.png'); // Placeholder

// Image mapping for items
const itemImageMap: { [key: string]: any } = {
  'vintage-sweater': vintageSweaterImage,
  'retro-lamp': retroLampImage,
  'antique-books': antiqueBooksImage,
  'vintage-jewelry': vintageJewelryImage,
  'old-camera': oldCameraImage,
  'thrift-mirror': thriftMirrorImage,
  'retro-clock': retroClockImage,
  'vintage-hat': vintageHatImage,
  'thrift-vase': thriftVaseImage,
  'vintage-scarf': vintageScarfImage,
};

export default function FrogMarketThriftScreen() {
  const { state, addCoins, addTickets } = useSimpleGame();
  const [jeremiahSaying, setJeremiahSaying] = useState<string>('');
  const [currentStock, setCurrentStock] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  // Jeremiah's Bored Personality
  const getJeremiahGreeting = () => {
    const greetings = [
      "Oh, another customer... I guess I should be excited about that.",
      "Welcome to Frog Market Thrift. Everything's used, everything's dusty, everything's... here.",
      "Looking for something specific? Good luck finding it in this mess.",
      "I've been here for 8 hours and you're customer number 3. Thrilling.",
      "Everything's 50% off because I don't care enough to price things properly.",
      "Found something you like? Great, because I'm not restocking until I feel like it.",
      "The good stuff's already gone. What's left is... well, it's left for a reason.",
      "I used to be passionate about vintage finds. Now I'm just... here.",
      "Shopping? Sure, whatever. Just don't ask me to explain what anything is.",
      "Another day, another pile of stuff nobody wants. Welcome to my life."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleJeremiahInteraction = () => {
    setJeremiahSaying(getJeremiahGreeting());
  };

  // All possible thrift items
  const allThriftItems = [
    {
      id: 'vintage-sweater',
      name: 'Vintage Cable Knit Sweater',
      description: 'Cozy wool with cable patterns. Slightly worn but full of character.',
      basePrice: 15,
      rarity: 'common',
      image: 'vintage-sweater'
    },
    {
      id: 'retro-lamp',
      name: 'Retro Brass Table Lamp',
      description: '1970s brass lamp with funky orange shade. Perfect vintage charm.',
      basePrice: 25,
      rarity: 'uncommon',
      image: 'retro-lamp'
    },
    {
      id: 'antique-books',
      name: 'Antique Book Collection',
      description: 'Leather-bound books from the 1920s. Smells of old libraries.',
      basePrice: 35,
      rarity: 'rare',
      image: 'antique-books'
    },
    {
      id: 'vintage-jewelry',
      name: 'Vintage Pearl Necklace',
      description: 'Delicate pearl necklace with silver clasp. Timeless elegance.',
      basePrice: 20,
      rarity: 'uncommon',
      image: 'vintage-jewelry'
    },
    {
      id: 'old-camera',
      name: 'Vintage Film Camera',
      description: 'Classic 35mm camera from the 1980s. Ready for analog adventures.',
      basePrice: 45,
      rarity: 'rare',
      image: 'old-camera'
    },
    {
      id: 'thrift-mirror',
      name: 'Ornate Wooden Mirror',
      description: 'Hand-carved wooden mirror with intricate details. Instant vintage charm.',
      basePrice: 30,
      rarity: 'uncommon',
      image: 'thrift-mirror'
    },
    {
      id: 'retro-clock',
      name: 'Mid-Century Wall Clock',
      description: 'Sleek atomic-age clock with sunburst design. Stylish time.',
      basePrice: 40,
      rarity: 'rare',
      image: 'retro-clock'
    },
    {
      id: 'vintage-hat',
      name: 'Vintage Fedora Hat',
      description: 'Classic felt fedora from the 1950s. Channel your inner detective.',
      basePrice: 18,
      rarity: 'common',
      image: 'vintage-hat'
    },
    {
      id: 'thrift-vase',
      name: 'Art Deco Ceramic Vase',
      description: 'Geometric patterns and bold colors. A statement piece.',
      basePrice: 22,
      rarity: 'uncommon',
      image: 'thrift-vase'
    },
    {
      id: 'vintage-scarf',
      name: 'Silk Scarf with Floral Print',
      description: 'Delicate silk scarf with vintage floral patterns. Elegant accessory.',
      basePrice: 12,
      rarity: 'common',
      image: 'vintage-scarf'
    },
    {
      id: 'vintage-record',
      name: 'Vinyl Record Collection',
      description: 'Classic albums from the golden age of music. Some scratches, lots of soul.',
      basePrice: 28,
      rarity: 'uncommon',
      image: 'vintage-sweater'
    },
    {
      id: 'retro-telephone',
      name: 'Rotary Dial Telephone',
      description: 'Working rotary phone in avocado green. Perfect for vintage vibes.',
      basePrice: 38,
      rarity: 'rare',
      image: 'retro-lamp'
    },
    {
      id: 'vintage-glasses',
      name: 'Cat-Eye Sunglasses',
      description: '1950s cat-eye frames with original case. Very Hollywood glamour.',
      basePrice: 16,
      rarity: 'common',
      image: 'vintage-jewelry'
    },
    {
      id: 'thrift-painting',
      name: 'Abstract Art Painting',
      description: 'Mysterious unsigned painting. Could be worth millions or nothing.',
      basePrice: 50,
      rarity: 'rare',
      image: 'antique-books'
    },
    {
      id: 'vintage-bag',
      name: 'Leather Handbag',
      description: 'Vintage leather purse with brass hardware. Well-loved but sturdy.',
      basePrice: 24,
      rarity: 'uncommon',
      image: 'old-camera'
    }
  ];

  // Generate random stock
  const generateRandomStock = () => {
    const shuffled = [...allThriftItems].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 10);
    
    // Add random price variations and stock
    return selectedItems.map(item => ({
      ...item,
      price: Math.max(1, item.basePrice + Math.floor(Math.random() * 20) - 10), // ±10 price variation
      stock: Math.floor(Math.random() * 3) + 1, // 1-3 stock
    }));
  };

  // Check for stock refresh (every 2 hours)
  useEffect(() => {
    const checkRefresh = () => {
      const now = Date.now();
      const timeSinceRefresh = now - lastRefresh;
      const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      
      if (timeSinceRefresh >= twoHours) {
        setCurrentStock(generateRandomStock());
        setLastRefresh(now);
      }
    };

    // Initial stock generation
    if (currentStock.length === 0) {
      setCurrentStock(generateRandomStock());
    }

    // Check every minute
    const interval = setInterval(checkRefresh, 60000);
    return () => clearInterval(interval);
  }, [lastRefresh, currentStock.length]);

  useEffect(() => {
    setJeremiahSaying(getJeremiahGreeting());
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a3b8'; // Slate gray
      case 'uncommon': return '#22c55e'; // Green
      case 'rare': return '#8b5cf6'; // Purple
      default: return '#0f172a';
    }
  };

  const handleBuyItem = (item: any) => {
    if (state.tickets < item.price) {
      Alert.alert('Not Enough Tickets', `You need ${item.price} tickets to buy this item.`);
      return;
    }

    if (item.stock <= 0) {
      Alert.alert('Out of Stock', 'This item is no longer available.');
      return;
    }

    Alert.alert(
      'Purchase Confirmed',
      `You bought ${item.name} for ${item.price} tickets!`,
      [
        {
          text: 'OK',
          onPress: () => {
            addTickets(-item.price);
            // Reduce stock
            setCurrentStock(prev => 
              prev.map(stockItem => 
                stockItem.id === item.id 
                  ? { ...stockItem, stock: stockItem.stock - 1 }
                  : stockItem
              )
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>FROG MARKET THRIFT</Text>
        </RNView>

        {/* Main Image */}
        <Image source={frogMarketMainImage} style={styles.mainImage} />

        {/* Jeremiah the Shopkeeper */}
        <RNView style={styles.npcContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>JEREMIAH:</Text>
            <Text style={styles.speechText}>{jeremiahSaying}</Text>
          </RNView>
          <Pressable onPress={handleJeremiahInteraction}>
            <Image source={jeremiahImage} style={styles.jeremiahImage} />
          </Pressable>
        </RNView>

        {/* Player Stats */}
        <RNView style={styles.statsContainer}>
          <RNView style={styles.statItem}>
            <FontAwesome name="diamond" size={16} color="#8b5cf6" />
            <Text style={styles.statValue}>{state.coins.toLocaleString()}</Text>
          </RNView>
          <RNView style={styles.statItem}>
            <FontAwesome name="ticket" size={16} color="#22c55e" />
            <Text style={styles.statValue}>{state.tickets.toLocaleString()}</Text>
          </RNView>
        </RNView>

        {/* Shop Description */}
        <Text style={styles.description}>
          A dusty thrift store with random vintage finds. Stock refreshes every 2 hours 
          with 10 random items. No guarantees, no returns, no enthusiasm from the staff.
        </Text>

        {/* Current Stock Title */}
        <Text style={styles.stockTitle}>CURRENT STOCK</Text>

        {/* Items Grid */}
        <RNView style={styles.itemsGrid}>
          {currentStock.map((item) => (
            <RNView key={item.id} style={styles.itemCard}>
              <RNView style={styles.itemImageContainer}>
                <Image 
                  source={itemImageMap[item.image]} 
                  style={styles.itemImage}
                  resizeMode="contain"
                />
                <RNView style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) + '20' }]}>
                  <Text style={[styles.rarityText, { color: getRarityColor(item.rarity) }]}>
                    {item.rarity.toUpperCase()}
                  </Text>
                </RNView>
              </RNView>
              
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              
              <RNView style={styles.itemFooter}>
                <RNView style={styles.priceContainer}>
                  <FontAwesome name="ticket" size={12} color="#22c55e" />
                  <Text style={styles.priceText}>{item.price}</Text>
                </RNView>
                <Text style={styles.stockText}>Stock: {item.stock}</Text>
              </RNView>
              
              <Pressable 
                style={[
                  styles.buyButton, 
                  item.stock <= 0 && styles.buyButtonDisabled
                ]}
                onPress={() => handleBuyItem(item)}
                disabled={item.stock <= 0}
              >
                <Text style={[
                  styles.buyButtonText,
                  item.stock <= 0 && styles.buyButtonTextDisabled
                ]}>
                  {item.stock <= 0 ? 'SOLD OUT' : 'BUY'}
                </Text>
              </Pressable>
            </RNView>
          ))}
        </RNView>

        {/* Secret Refresh Info */}
        <RNView style={styles.secretInfo}>
          <Text style={styles.secretText}>
            💡 Stock refreshes every 2 hours with new random items
          </Text>
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
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: 1,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    borderRadius: 12,
    marginBottom: 0,
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  speechBubble: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    maxWidth: 300,
    marginRight: 8,
  },
  characterName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#22c55e',
    marginBottom: 4,
    textAlign: 'left',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    fontStyle: 'italic',
  },
  jeremiahImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  description: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  stockTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  rarityBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
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
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  priceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#22c55e',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  stockText: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#64748b',
  },
  buyButton: {
    backgroundColor: '#22c55e',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%',
  },
  buyButtonDisabled: {
    backgroundColor: '#e5e5e5',
  },
  buyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buyButtonTextDisabled: {
    color: '#999999',
  },
  secretInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  secretText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#8b5cf6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});