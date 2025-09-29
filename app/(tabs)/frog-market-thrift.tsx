import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const thriftMainImage = require('@/assets/images/lil-tag.png'); // Placeholder

export default function FrogMarketThriftScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#94a3b8'; // Slate gray
      case 'uncommon': return '#22c55e'; // Green
      case 'rare': return '#8b5cf6'; // Purple
      default: return '#0f172a';
    }
  };

  const thriftItems = [
    {
      id: 'vintage-sweater',
      name: 'Vintage Cable Knit Sweater',
      description: 'Cozy wool with cable patterns. Slightly worn but full of character.',
      price: 15,
      currency: 'tickets',
      icon: 'shirt',
      rarity: 'rare'
    },
    {
      id: 'retro-lamp',
      name: 'Retro Brass Table Lamp',
      description: '1970s brass lamp with funky orange shade. Perfect vintage charm.',
      price: 25,
      currency: 'tickets',
      icon: 'lightbulb-o',
      rarity: 'rare'
    },
    {
      id: 'antique-books',
      name: 'Antique Book Collection',
      description: 'Leather-bound books from the 1920s. Smells of old libraries.',
      price: 35,
      currency: 'tickets',
      icon: 'book',
      rarity: 'rare'
    },
    {
      id: 'vintage-jewelry',
      name: 'Vintage Pearl Necklace',
      description: 'Delicate pearl necklace with silver clasp. Timeless elegance.',
      price: 20,
      currency: 'tickets',
      icon: 'diamond',
      rarity: 'rare'
    },
    {
      id: 'old-camera',
      name: 'Vintage Film Camera',
      description: 'Classic 35mm camera from the 1980s. Ready for analog adventures.',
      price: 45,
      currency: 'tickets',
      icon: 'camera',
      rarity: 'rare'
    },
    {
      id: 'thrift-mirror',
      name: 'Ornate Wooden Mirror',
      description: 'Hand-carved wooden mirror with intricate details. Instant vintage charm.',
      price: 30,
      currency: 'tickets',
      icon: 'circle-o',
      rarity: 'rare'
    },
    {
      id: 'retro-clock',
      name: 'Mid-Century Wall Clock',
      description: 'Sleek atomic-age clock with sunburst design. Stylish time.',
      price: 40,
      currency: 'tickets',
      icon: 'clock-o',
      rarity: 'rare'
    },
    {
      id: 'vintage-hat',
      name: 'Vintage Fedora Hat',
      description: 'Classic felt fedora from the 1950s. Channel your inner detective.',
      price: 18,
      currency: 'tickets',
      icon: 'user',
      rarity: 'rare'
    },
    {
      id: 'thrift-vase',
      name: 'Art Deco Ceramic Vase',
      description: 'Geometric patterns and bold colors. A statement piece.',
      price: 22,
      currency: 'tickets',
      icon: 'circle',
      rarity: 'rare'
    },
    {
      id: 'vintage-scarf',
      name: 'Silk Scarf with Floral Print',
      description: 'Delicate silk scarf with vintage floral patterns. Elegant accessory.',
      price: 12,
      currency: 'tickets',
      icon: 'square',
      rarity: 'rare'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
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

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image 
            source={thriftMainImage} 
            style={styles.bannerImage}
          />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A simple thrift store with rare vintage finds. Items restock every 2 hours - 
          only 10 items available at a time. Get them while they last!
        </Text>

        {/* Items Title */}
        <Text style={styles.itemsTitle}>CURRENT STOCK</Text>

        {/* Items Grid */}
        <RNView style={styles.itemsGrid}>
          {thriftItems.map((item) => (
            <RNView key={item.id} style={styles.itemCard}>
              <RNView style={styles.itemIconContainer}>
                <FontAwesome name={item.icon as any} size={24} color={getRarityColor(item.rarity)} />
              </RNView>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <RNView style={styles.itemFooter}>
                <RNView style={styles.priceContainer}>
                  <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                  <Text style={styles.priceText}>{item.price}</Text>
                </RNView>
                <Pressable style={styles.buyButton}>
                  <Text style={styles.buyButtonText}>BUY</Text>
                </Pressable>
              </RNView>
            </RNView>
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
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  storeInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
    width: '48%',
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0ea5e9',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  itemsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemCard: {
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
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
  rarityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  commonBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
  },
  uncommonBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  rareBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  rarityText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
  },
  commonText: {
    color: '#94a3b8',
  },
  uncommonText: {
    color: '#22c55e',
  },
  rareText: {
    color: '#8b5cf6',
  },
  itemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  itemDetails: {
    marginTop: 6,
  },
  conditionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  buyButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
