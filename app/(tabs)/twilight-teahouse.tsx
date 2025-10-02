import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const twilightTeahouseImage = require('@/assets/images/twlilght-teahouse.png');
const senTeahouseImage = require('@/assets/images/sen-teahouse.png');

export default function TwilightTeahouseScreen() {
  const [cart, setCart] = useState<Set<string>>(new Set());

  const handleItemPress = (item: any) => {
    Alert.alert(
      item.name,
      `${item.description}\n\nPrice: ${item.price} ✨`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Add to Cart", onPress: () => {
          setCart(prev => new Set([...prev, item.id]));
          Alert.alert("Added to Cart!", `${item.name} has been added to your cart!`);
        }}
      ]
    );
  };

  const teas = [
    {
      id: 'starlight-chamomile',
      name: 'Starlight Chamomile',
      description: 'Soothing tea that glows softly in the cup',
      price: 8,
      icon: 'star',
      category: 'Herbal'
    },
    {
      id: 'moonbeam-oolong',
      name: 'Moonbeam Oolong',
      description: 'Rich oolong that shimmers like moonlight',
      price: 12,
      icon: 'moon-o',
      category: 'Oolong'
    },
    {
      id: 'cosmic-chai',
      name: 'Cosmic Chai',
      description: 'Spiced chai with hints of stardust',
      price: 10,
      icon: 'fire',
      category: 'Spiced'
    },
    {
      id: 'dreamy-jasmine',
      name: 'Dreamy Jasmine',
      description: 'Fragrant jasmine that brings peaceful dreams',
      price: 9,
      icon: 'leaf',
      category: 'Green'
    },
    {
      id: 'twilight-berry',
      name: 'Twilight Berry',
      description: 'Fruit tea that tastes like the evening sky',
      price: 7,
      icon: 'heart',
      category: 'Fruit'
    },
    {
      id: 'mystic-matcha',
      name: 'Mystic Matcha',
      description: 'Ceremonial matcha with magical properties',
      price: 15,
      icon: 'circle',
      category: 'Green'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/bag-of-stars-forest')}
        >
          <FontAwesome name="arrow-left" size={12} color="#6b7280" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>TWILIGHT TEAHOUSE</Text>
        </RNView>

        {/* Banner Image */}
        <Image source={twilightTeahouseImage} style={styles.bannerImage} />

        {/* Sen NPC */}
        <RNView style={styles.npcContainer}>
          <Pressable onPress={() => Alert.alert("Sen", "Welcome to our peaceful teahouse. The starlight brews are particularly magical today!")}>
            <Image source={senTeahouseImage} style={styles.npcImage} />
          </Pressable>
          <RNView style={styles.npcSpeechBubble}>
            <Text style={styles.npcCharacterName}>SEN:</Text>
            <Text style={styles.npcSpeechText}>
              Welcome to our peaceful teahouse. The starlight brews are particularly magical today!
            </Text>
          </RNView>
        </RNView>

        {/* Products Grid */}
        <RNView style={styles.productsGrid}>
          {teas.map((tea) => (
            <Pressable
              key={tea.id}
              style={styles.productCard}
              onPress={() => handleItemPress(tea)}
            >
              <RNView style={styles.productIconContainer}>
                <FontAwesome name={tea.icon as any} size={20} color="#6b7280" />
              </RNView>
              <Text style={styles.productName}>{tea.name}</Text>
              <Text style={styles.productDescription}>{tea.description}</Text>
              <Text style={styles.productCategory}>{tea.category}</Text>
              <Text style={styles.productPrice}>{tea.price} ✨</Text>
              {cart.has(tea.id) && (
                <RNView style={styles.cartIndicator}>
                  <FontAwesome name="check" size={12} color="#059669" />
                </RNView>
              )}
            </Pressable>
          ))}
        </RNView>

        {/* Cart Summary */}
        {cart.size > 0 && (
          <RNView style={styles.cartSummary}>
            <Text style={styles.cartText}>Items in Cart: {cart.size}</Text>
            <Pressable style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </Pressable>
          </RNView>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
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
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 20,
    paddingHorizontal: 60,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  productCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    padding: 16,
    width: '48%',
    minHeight: 140,
    alignItems: 'center',
    shadowColor: '#6b7280',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  productIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#0f172a',
    marginBottom: 4,
    lineHeight: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  productDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    lineHeight: 11,
    textAlign: 'center',
    marginBottom: 6,
    flex: 1,
  },
  productCategory: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#059669',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cartIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  cartText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
  },
  checkoutButton: {
    backgroundColor: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  checkoutText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  npcSpeechBubble: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    maxWidth: 280,
    marginLeft: 10,
  },
  npcCharacterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'left',
  },
  npcSpeechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    fontStyle: 'italic',
  },
  npcImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
