import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { usePathname } from 'expo-router';

// Import images
const pxopetSupplyCoImage = require('@/assets/images/pxopet-supply-co.png');

const { width } = Dimensions.get('window');

export default function PxopetSupplyScreen() {
  const [cart, setCart] = useState<Array<{id: string, name: string, price: number, quantity: number}>>([]);
  const [totalCost, setTotalCost] = useState(0);
  const pathname = usePathname();

  const products = [
    {
      id: 'premium-food',
      name: 'Premium Pet Food',
      description: 'Nutritious kibble for all pet types',
      price: 15,
      icon: '🍽️'
    },
    {
      id: 'toys',
      name: 'Interactive Toys',
      description: 'Keep your pets entertained for hours',
      price: 8,
      icon: '🎾'
    },
    {
      id: 'grooming',
      name: 'Grooming Kit',
      description: 'Everything needed for pet hygiene',
      price: 25,
      icon: '✂️'
    },
    {
      id: 'beds',
      name: 'Comfy Pet Beds',
      description: 'Soft and cozy sleeping spots',
      price: 35,
      icon: '🛏️'
    },
    {
      id: 'treats',
      name: 'Special Treats',
      description: 'Delicious rewards for good behavior',
      price: 12,
      icon: '🍖'
    },
    {
      id: 'accessories',
      name: 'Pet Accessories',
      description: 'Collars, leashes, and more',
      price: 18,
      icon: '🎀'
    }
  ];

  const addToCart = (product: any) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        const updated = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setTotalCost(updated.reduce((sum, item) => sum + (item.price * item.quantity), 0));
        return updated;
      } else {
        const newCart = [...prev, { ...product, quantity: 1 }];
        setTotalCost(newCart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
        return newCart;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== productId);
      setTotalCost(updated.reduce((sum, item) => sum + (item.price * item.quantity), 0));
      return updated;
    });
  };

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
          <Text style={styles.locationTitle}>PXOPET SUPPLY CO.</Text>
        </RNView>

        {/* Store Banner */}
        <Image source={pxopetSupplyCoImage} style={styles.bannerImage} />

        {/* Store Description */}
        <Text style={styles.description}>
          Welcome to PXOPET SUPPLY CO.! Your one-stop shop for all your pet's needs. 
          From premium food to fun toys, we have everything to keep your furry, scaly, 
          or feathered friends happy and healthy. Quality products at great prices!
        </Text>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <RNView style={styles.cartContainer}>
            <Text style={styles.cartTitle}>Your Cart ({cart.length} items)</Text>
            <Text style={styles.cartTotal}>Total: {totalCost} tickets</Text>
            <Pressable style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </Pressable>
          </RNView>
        )}

        {/* Products Section */}
        <Text style={styles.sectionTitle}>PET SUPPLIES</Text>
        
        <RNView style={styles.productsGrid}>
          {products.map((product) => (
            <Pressable
              key={product.id}
              style={styles.productCard}
              onPress={() => addToCart(product)}
            >
              <RNView style={styles.productHeader}>
                <RNView style={styles.productIconContainer}>
                  <Text style={styles.productIcon}>{product.icon}</Text>
                </RNView>
                <RNView style={styles.productText}>
                  <RNView style={styles.productTitleRow}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <RNView style={styles.ticketDisplay}>
                      <FontAwesome name="bolt" size={12} color="#06b6d4" />
                      <Text style={styles.ticketCountText}>{product.price}</Text>
                    </RNView>
                  </RNView>
                  <Text style={styles.productDescription}>{product.description}</Text>
                </RNView>
              </RNView>
            </Pressable>
          ))}
        </RNView>

        {/* Services Section */}
        <Text style={styles.sectionTitle}>PET SERVICES</Text>
        
        <RNView style={styles.servicesContainer}>
          <Pressable style={styles.serviceCard}>
            <FontAwesome name="scissors" size={24} color="#8b5cf6" />
            <Text style={styles.serviceName}>Grooming</Text>
            <Text style={styles.serviceDescription}>Professional pet grooming</Text>
          </Pressable>
          
          <Pressable style={styles.serviceCard}>
            <FontAwesome name="heart" size={24} color="#8b5cf6" />
            <Text style={styles.serviceName}>Health Check</Text>
            <Text style={styles.serviceDescription}>Basic wellness examination</Text>
          </Pressable>
          
          <Pressable style={styles.serviceCard}>
            <FontAwesome name="graduation-cap" size={24} color="#8b5cf6" />
            <Text style={styles.serviceName}>Training</Text>
            <Text style={styles.serviceDescription}>Pet behavior training</Text>
          </Pressable>
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
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Higher up, below the status bar
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  bannerImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  cartContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  cartTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'center',
  },
  cartTotal: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
  },
  checkoutButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  productCard: {
    width: '45%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productIconContainer: {
    marginRight: 12,
  },
  productIcon: {
    fontSize: 24,
  },
  productText: {
    flex: 1,
  },
  productTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  productDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
    textAlign: 'center',
  },
  ticketDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ticketCountText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    alignItems: 'center',
    width: (width - 80) / 3,
  },
  serviceName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 12,
  },
});
