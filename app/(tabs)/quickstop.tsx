import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

// Import the Marty image
const martyImage = require('@/assets/images/marty-quickstop.png');
const chipsImage = require('@/assets/images/chips.png');
const cupnoddleImage = require('@/assets/images/cupnoddle.png');
const chocolateImage = require('@/assets/images/chocolate.png');
const pouchdrinkImage = require('@/assets/images/pouchdrink.png');

export default function ShopScreen() {
  const [shopkeeperSaying, setShopkeeperSaying] = useState("Welcome to QuickStop! Best prices in Pxoburbs!");
  const [playerInventory, setPlayerInventory] = useState([
    { id: '1', name: 'Golden Star', price: 15, image: 'chips' },
    { id: '2', name: 'Magic Leaf', price: 8, image: 'cupnoddle' },
    { id: '3', name: 'Blue Crystal', price: 25, image: 'chocolate' },
    { id: '4', name: 'Love Token', price: 12, image: 'chips' },
  ]);

  // Limited time items that can only be bought with tickets
  const [limitedItems, setLimitedItems] = useState([
    { id: 'l1', name: 'Rare Trophy', price: 50, image: 'pouchdrink', tickets: 3 },
    { id: 'l2', name: 'Magic Potion', price: 75, image: 'pouchdrink', tickets: 5 },
    { id: 'l3', name: 'Golden Crown', price: 100, image: 'pouchdrink', tickets: 7 },
    { id: 'l4', name: 'Crystal Sword', price: 125, image: 'pouchdrink', tickets: 10 },
  ]);

  // Shop inventory that changes every few hours
  const [shopInventory, setShopInventory] = useState([
    { id: 's1', name: 'Energy Drink', price: 5, stock: 3, image: 'chips' },
    { id: 's2', name: 'Lucky Charm', price: 18, stock: 1, image: 'cupnoddle' },
    { id: 's3', name: 'Mystery Box', price: 12, stock: 5, image: 'chocolate' },
    { id: 's4', name: 'Healing Potion', price: 20, stock: 2, image: 'chips' },
    { id: 's5', name: 'Speed Boost', price: 15, stock: 4, image: 'cupnoddle' },
    { id: 's6', name: 'Rare Gem', price: 35, stock: 1, image: 'chocolate' },
  ]);

  const shopkeeperSayings = [
    "Welcome to QuickStop! Best prices in Pxoburbs!",
    "Fresh stock just arrived! Don't miss out!",
    "Looking for something special? I might have it!",
    "Prices are negotiable for the right customer!",
    "Got some items to sell? I'm always buying!",
    "New inventory every few hours - check back soon!",
  ];

  useEffect(() => {
    // Change shopkeeper saying every 30 seconds
    const interval = setInterval(() => {
      const randomSaying = shopkeeperSayings[Math.floor(Math.random() * shopkeeperSayings.length)];
      setShopkeeperSaying(randomSaying);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleBuy = (item: any) => {
    if (item.stock > 0) {
      Alert.alert(
        "Purchase Item",
        `Buy ${item.name} for ${item.price} lightning?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy", onPress: () => {
            // Update stock
            setShopInventory(prev => 
              prev.map(shopItem => 
                shopItem.id === item.id 
                  ? { ...shopItem, stock: shopItem.stock - 1 }
                  : shopItem
              )
            );
            Alert.alert("Success!", `You bought ${item.name}!`);
          }}
        ]
      );
    } else {
      Alert.alert("Out of Stock", "This item is currently unavailable.");
    }
  };

  const handleSell = (item: any) => {
    Alert.alert(
      "Sell Item",
      `Sell ${item.name} for ${Math.floor(item.price * 0.7)} lightning?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sell", onPress: () => {
          // Remove from player inventory
          setPlayerInventory(prev => prev.filter(playerItem => playerItem.id !== item.id));
          Alert.alert("Sold!", `You sold ${item.name} for ${Math.floor(item.price * 0.7)} tickets!`);
        }}
      ]
    );
  };

  const handleHaggle = (item: any) => {
    const hagglePrice = Math.floor(item.price * 0.8);
    Alert.alert(
      "Haggle",
      `Try to get ${item.name} for ${hagglePrice} tickets instead of ${item.price}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Haggle", onPress: () => {
          const success = Math.random() > 0.3; // 70% success rate
          if (success) {
            Alert.alert("Success!", `Shopkeeper accepted your offer! ${item.name} for ${hagglePrice} tickets!`);
            setShopInventory(prev => 
              prev.map(shopItem => 
                shopItem.id === item.id 
                  ? { ...shopItem, stock: shopItem.stock - 1 }
                  : shopItem
              )
            );
          } else {
            Alert.alert("Failed", "Shopkeeper rejected your offer. Try again later!");
          }
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Shop Title */}
        <Text style={styles.title}>QUICKSTOP</Text>

        {/* Marty Image */}
        <RNView style={styles.martyContainer}>
          <Image source={martyImage} style={styles.martyImage} />
        </RNView>

        {/* Shopkeeper */}
        <RNView style={styles.shopkeeperSection}>
          <RNView style={styles.shopkeeperInfo}>
            <RNView style={styles.shopkeeperText}>
              <Text style={styles.shopkeeperName}>Marty the Shopkeeper</Text>
              <Text style={styles.shopkeeperSaying}>"{shopkeeperSaying}"</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Shop Inventory */}
        <BorderedBox>
          <RNView style={styles.chipsGrid}>
            {shopInventory.map((item) => (
              <RNView key={item.id} style={styles.chipsItem}>
                <Image 
                  source={
                    item.image === 'chips' ? chipsImage :
                    item.image === 'cupnoddle' ? cupnoddleImage :
                    chocolateImage
                  } 
                  style={styles.chipsImage} 
                />
                <Text style={styles.chipsName}>{item.name}</Text>
                <Text style={styles.chipsPrice}>{item.price} ⚡</Text>
                <Text style={styles.chipsStock}>Stock: {item.stock}</Text>
                <RNView style={styles.chipsActions}>
                  <Pressable 
                    style={[styles.actionButton, styles.buyButton]}
                    onPress={() => handleBuy(item)}
                    disabled={item.stock === 0}
                  >
                    <Text style={styles.buyButtonText}>BUY</Text>
                  </Pressable>
                  <Pressable 
                    style={[styles.actionButton, styles.haggleButton]}
                    onPress={() => handleHaggle(item)}
                    disabled={item.stock === 0}
                  >
                    <Text style={styles.haggleButtonText}>HAGGLE</Text>
                  </Pressable>
                </RNView>
              </RNView>
            ))}
          </RNView>
        </BorderedBox>

        {/* Limited Time Items */}
        <Text style={styles.sectionTitle}>LIMITED TIME ITEMS</Text>
        <BorderedBox>
          <RNView style={styles.chipsGrid}>
            {limitedItems.map((item) => (
              <RNView key={item.id} style={styles.chipsItem}>
                <Image 
                  source={pouchdrinkImage} 
                  style={styles.chipsImage} 
                />
                <Text style={styles.chipsName}>{item.name}</Text>
                <Text style={styles.ticketPrice}>{item.tickets} 🎫</Text>
                <Pressable 
                  style={[styles.actionButton, styles.buyButton]}
                  onPress={() => handleBuy(item)}
                >
                  <Text style={styles.buyButtonText}>BUY</Text>
                </Pressable>
              </RNView>
            ))}
          </RNView>
        </BorderedBox>


        {/* Shop Info */}
        <BorderedBox>
          <RNView style={styles.shopInfo}>
            <Text style={styles.infoTitle}>SHOP INFO</Text>
            <Text style={styles.infoText}>• Inventory refreshes every few hours</Text>
            <Text style={styles.infoText}>• Haggle for better prices (70% success rate)</Text>
            <Text style={styles.infoText}>• Sell items for 70% of their value</Text>
            <Text style={styles.infoText}>• Limited stock - first come, first served!</Text>
          </RNView>
        </BorderedBox>
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
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 6,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  martyContainer: {
    width: '100%',
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  martyImage: {
    width: '115%',
    height: '115%',
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  shopkeeperSection: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 48,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    backgroundColor: '#f8fafc',
  },
  shopkeeperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopkeeperText: {
    flex: 1,
  },
  shopkeeperName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  shopkeeperSaying: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontStyle: 'italic',
    marginTop: 2,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  chipsItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
  },
  chipsImage: {
    width: 50,
    height: 50,
    marginBottom: 6,
    imageRendering: 'pixelated' as any,
  },
  chipsName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 3,
  },
  chipsPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#06b6d4',
    textAlign: 'center',
    marginBottom: 2,
  },
  chipsStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
  },
  chipsActions: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  ticketPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  itemCard: {
    width: '48%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
    flex: 1,
  },
  itemPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  itemStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#10b981',
  },
  buyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  haggleButton: {
    backgroundColor: '#f59e0b',
  },
  haggleButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#ef4444',
    width: '100%',
  },
  sellButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  shopInfo: {
    padding: 16,
  },
  infoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 4,
  },
});
