import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';


export default function RadioCircuitScreen() {
  const [cart, setCart] = useState<Set<string>>(new Set());

  const handleItemPress = (item: any) => {
    Alert.alert(
      item.name,
      `${item.description}\n\nPrice: ${item.price} ⚡`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Add to Cart", onPress: () => {
          setCart(prev => new Set([...prev, item.id]));
          Alert.alert("Added to Cart!", `${item.name} has been added to your cart!`);
        }}
      ]
    );
  };

  const products = [
    {
      id: 'vintage-radio',
      name: 'Vintage AM/FM Radio',
      description: 'Classic wooden radio with warm analog sound',
      price: 45,
      icon: 'volume-up',
      category: 'Audio'
    },
    {
      id: 'pixel-headphones',
      name: 'Pixel Headphones',
      description: 'Retro-styled headphones with crystal clear sound',
      price: 32,
      icon: 'headphones',
      category: 'Audio'
    },
    {
      id: 'circuit-board',
      name: 'Circuit Board Kit',
      description: 'DIY electronics kit for building projects',
      price: 28,
      icon: 'microchip',
      category: 'Components'
    },
    {
      id: 'neon-cable',
      name: 'Neon Cable Set',
      description: 'Colorful cables that glow in the dark',
      price: 15,
      icon: 'plug',
      category: 'Accessories'
    },
    {
      id: 'digital-watch',
      name: 'Digital Watch',
      description: 'Sleek digital timepiece with multiple functions',
      price: 38,
      icon: 'clock-o',
      category: 'Wearables'
    },
    {
      id: 'usb-drive',
      name: 'Holographic USB Drive',
      description: 'High-capacity storage with holographic casing',
      price: 22,
      icon: 'hdd-o',
      category: 'Storage'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs-mall')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>RADIO CIRCUIT</Text>
        </RNView>


        {/* Products Grid */}
        <RNView style={styles.productsGrid}>
          {products.map((product) => (
            <Pressable
              key={product.id}
              style={styles.productCard}
              onPress={() => handleItemPress(product)}
            >
              <RNView style={styles.productIconContainer}>
                <FontAwesome name={product.icon as any} size={20} color="#8b5cf6" />
              </RNView>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productPrice}>{product.price} ⚡</Text>
              {cart.has(product.id) && (
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
    backgroundColor: '#f0f9ff',
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
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
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    width: '48%',
    minHeight: 140,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
    color: '#8b5cf6',
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
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
    backgroundColor: '#8b5cf6',
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
});
