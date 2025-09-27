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
const sludgeImage = require('@/assets/images/sludge.png');
const hotchipsImage = require('@/assets/images/hotchips.png');
const gumballsImage = require('@/assets/images/gumballs.png');

export default function ShopScreen() {
  const [shopkeeperSaying, setShopkeeperSaying] = useState("Welcome to QuickStop! Best prices in Pxoburbs!");
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [playerInventory, setPlayerInventory] = useState([
    { id: '1', name: 'Golden Star', price: 15, image: 'chips' },
    { id: '2', name: 'Magic Leaf', price: 8, image: 'cupnoddle' },
    { id: '3', name: 'Blue Crystal', price: 25, image: 'chocolate' },
    { id: '4', name: 'Love Token', price: 12, image: 'chips' },
  ]);

  // Limited time items that can only be bought with tickets
  const [limitedItems, setLimitedItems] = useState([
    { id: 'l1', name: 'Space Bubblegum', price: 50, image: 'gumballs', tickets: 3 },
    { id: 'l2', name: 'Potatoe Chips', price: 75, image: 'pouchdrink', tickets: 5 },
    { id: 'l3', name: 'Punch Pouch', price: 100, image: 'pouchdrink', tickets: 7 },
    { id: 'l4', name: 'Energy Drink', price: 125, image: 'pouchdrink', tickets: 10 },
  ]);

  // Shop inventory that changes every few hours
  const [shopInventory, setShopInventory] = useState([
    { id: 's1', name: 'Energy Drink', price: 5, stock: 3, image: 'chips' },
    { id: 's2', name: 'Hot Chips', price: 18, stock: 1, image: 'hotchips' },
    { id: 's3', name: 'Choco-Protein Bar', price: 12, stock: 5, image: 'chocolate' },
    { id: 's4', name: 'Sludge', price: 20, stock: 2, image: 'sludge' },
    { id: 's5', name: 'Cupa Noodles', price: 15, stock: 4, image: 'cupnoddle' },
    { id: 's6', name: 'Energy Drink', price: 35, stock: 1, image: 'chocolate' },
  ]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 3600; // Reset to 1 hour
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Time-based shopkeeper sayings
  useEffect(() => {
    const getTimeBasedSaying = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        return "Good morning! Fresh stock just arrived!";
      } else if (hour >= 12 && hour < 18) {
        return "Afternoon! Best deals are right here!";
      } else if (hour >= 18 && hour < 22) {
        return "Evening! Last chance for today's specials!";
      } else {
        return "Late night shopping? I'm here for you!";
      }
    };

    setShopkeeperSaying(getTimeBasedSaying());
    
    const interval = setInterval(() => {
      setShopkeeperSaying(getTimeBasedSaying());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


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

        {/* Welcome Title */}
        <Text style={styles.welcomeTitle}>Welcome to QuickStop!</Text>

        {/* Marty Image */}
        <RNView style={styles.martyContainer}>
          <Image source={martyImage} style={styles.martyImage} />
          <Text style={styles.shopkeeperName}>Marty the Shopkeeper</Text>
        </RNView>

        {/* Chat Bubble */}
        <RNView style={styles.chatBubble}>
          <Text style={styles.dialogueText}>
            <Text style={styles.characterName}>Marty the Shopkeeper:</Text> (cheerful) {shopkeeperSaying}
          </Text>
        </RNView>

        {/* Shop Inventory */}
        <BorderedBox>
          <RNView style={styles.stockHeader}>
            <Text style={styles.stockTitle}>CURRENT STOCK</Text>
            <Text style={styles.countdownText}>REFRESHES IN {formatTime(countdown)}</Text>
          </RNView>
          <RNView style={styles.chipsGrid}>
            {shopInventory.map((item) => (
              <RNView key={item.id} style={styles.chipsItem}>
                <Image 
                  source={
                    item.image === 'chips' ? chipsImage :
                    item.image === 'cupnoddle' ? cupnoddleImage :
                    item.image === 'hotchips' ? hotchipsImage :
                    item.image === 'sludge' ? sludgeImage :
                    chocolateImage
                  } 
                  style={styles.chipsImage} 
                />
                <Text style={styles.chipsName}>{item.name}</Text>
                <Text style={styles.chipsPrice}>{item.price} ⚡</Text>
                <Text style={styles.chipsStock}>Stock: {item.stock}</Text>
                <RNView style={styles.chipsActions}>
                  <Pressable 
                    style={[styles.actionButton, styles.shopBuyButton]}
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
        <BorderedBox>
          <Text style={styles.sectionTitle}>LIMITED TIME ITEMS</Text>
          <RNView style={styles.chipsGrid}>
            {limitedItems.map((item) => (
              <RNView key={item.id} style={styles.chipsItem}>
                <Image 
                  source={
                    item.image === 'gumballs' ? gumballsImage :
                    pouchdrinkImage
                  } 
                  style={styles.chipsImage} 
                />
                <Text style={styles.chipsName}>{item.name}</Text>
                <RNView style={styles.chipsActions}>
                  <Pressable 
                    style={[styles.actionButton, styles.buyButton]}
                    onPress={() => handleBuy(item)}
                  >
                    <RNView style={styles.buttonTicketDisplay}>
                      <FontAwesome name="ticket" size={12} color="#ffffff" />
                      <Text style={styles.buttonTicketText}>{item.tickets}</Text>
                    </RNView>
                  </Pressable>
                </RNView>
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
    marginBottom: 24,
  },
  martyImage: {
    width: '115%',
    height: '115%',
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
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
    justifyContent: 'space-evenly',
    padding: 8,
    alignItems: 'flex-start',
  },
  chipsItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 12,
    padding: 4,
    minHeight: 120,
  },
  chipsImage: {
    width: 30,
    height: 30,
    marginBottom: 6,
    imageRendering: 'pixelated' as any,
  },
  chipsName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 1,
    height: 24,
    lineHeight: 12,
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
    flexDirection: 'column',
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
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#ff1493',
  },
  shopBuyButton: {
    backgroundColor: '#14b8a6',
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
  welcomeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0f172a',
    fontFamily: 'PressStart2P_400Regular',
  },
  stockHeader: {
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stockTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  countdownText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#14b8a6',
    textAlign: 'center',
    marginTop: 4,
  },
  chatBubble: {
    marginTop: -30,
    marginBottom: 8,
    marginHorizontal: 40,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    backgroundColor: '#ffffff',
  },
  dialogueText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    lineHeight: 14,
  },
  characterName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  ticketDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketCountText: {
    fontSize: 10,
    color: '#0ea5e9',
    marginLeft: 4,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen_400Regular',
  },
  buttonTicketDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonTicketText: {
    fontSize: 10,
    color: '#ffffff',
    marginLeft: 4,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen_400Regular',
  },
});
