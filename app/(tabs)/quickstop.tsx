import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Animated } from 'react-native';
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
  const glowAnimation = useRef(new Animated.Value(0.3)).current;
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

  // Lottery tickets with different variations
  const [lotteryTickets, setLotteryTickets] = useState([
    { 
      id: 'lot1', 
      name: 'Quick Pick', 
      price: 5, 
      description: 'Instant win chance!',
      odds: '1 in 3',
      prizes: ['5 tickets', '10 tickets', '25 tickets', '50 tickets'],
      image: 'chips'
    },
    { 
      id: 'lot2', 
      name: 'Lucky Draw', 
      price: 15, 
      description: 'Better odds, bigger prizes!',
      odds: '1 in 5',
      prizes: ['25 tickets', '50 tickets', '100 tickets', 'Rare Item'],
      image: 'chocolate'
    },
    { 
      id: 'lot3', 
      name: 'Mega Jackpot', 
      price: 50, 
      description: 'Huge prizes, rare chance!',
      odds: '1 in 20',
      prizes: ['100 tickets', '500 tickets', '1000 tickets', 'Legendary Pet'],
      image: 'gumballs'
    },
    { 
      id: 'lot4', 
      name: 'Daily Special', 
      price: 10, 
      description: 'Limited daily lottery!',
      odds: '1 in 4',
      prizes: ['15 tickets', '30 tickets', '60 tickets', 'Special Item'],
      image: 'hotchips'
    },
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

  // Pulsing glow animation for limited time items
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [glowAnimation]);

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

  const handleLotteryPurchase = (lottery: any) => {
    Alert.alert(
      "Buy Lottery Ticket",
      `Buy a ${lottery.name} ticket for ${lottery.price} ⚡?\n\nOdds: ${lottery.odds}\nPrizes: ${lottery.prizes.join(', ')}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy Ticket", onPress: () => {
          // Simulate lottery draw based on odds
          let winChance = 0;
          switch (lottery.odds) {
            case '1 in 3': winChance = 1/3; break;
            case '1 in 4': winChance = 1/4; break;
            case '1 in 5': winChance = 1/5; break;
            case '1 in 20': winChance = 1/20; break;
            default: winChance = 0.1;
          }
          
          const won = Math.random() < winChance;
          
          if (won) {
            const randomPrize = lottery.prizes[Math.floor(Math.random() * lottery.prizes.length)];
            Alert.alert(
              "🎉 WINNER! 🎉", 
              `Congratulations! You won: ${randomPrize}!\n\nYour ${lottery.name} ticket was a winner!`
            );
          } else {
            Alert.alert(
              "Better Luck Next Time", 
              `Your ${lottery.name} ticket didn't win this time.\n\nTry again for another chance!`
            );
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
        <RNView style={styles.limitedTimeContainer}>
          <Animated.View 
            style={[
              styles.limitedTimeGlow,
              {
                opacity: glowAnimation,
                transform: [{
                  scale: glowAnimation.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [1, 1.05],
                  })
                }]
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.limitedTimeBorder,
              {
                borderColor: glowAnimation.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: ['#ffd700', '#ffed4e'],
                })
              }
            ]}
          >
            <Text style={styles.sectionTitle}>⭐ LIMITED TIME ITEMS ⭐</Text>
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
          </Animated.View>
        </RNView>

        {/* Lottery Tickets */}
        <BorderedBox>
          <Text style={styles.sectionTitle}>🎰 LOTTERY TICKETS 🎰</Text>
          <RNView style={styles.lotteryGrid}>
            {lotteryTickets.map((lottery) => (
              <RNView key={lottery.id} style={styles.lotteryItem}>
                <Image 
                  source={
                    lottery.image === 'chips' ? chipsImage :
                    lottery.image === 'chocolate' ? chocolateImage :
                    lottery.image === 'gumballs' ? gumballsImage :
                    lottery.image === 'hotchips' ? hotchipsImage :
                    chipsImage
                  } 
                  style={styles.lotteryImage} 
                />
                <Text style={styles.lotteryName}>{lottery.name}</Text>
                <Text style={styles.lotteryDescription}>{lottery.description}</Text>
                <Text style={styles.lotteryOdds}>Odds: {lottery.odds}</Text>
                <Text style={styles.lotteryPrice}>{lottery.price} ⚡</Text>
                <Pressable 
                  style={[styles.actionButton, styles.lotteryButton]}
                  onPress={() => handleLotteryPurchase(lottery)}
                >
                  <Text style={styles.lotteryButtonText}>BUY TICKET</Text>
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
            <Text style={styles.infoText}>• 🎰 Lottery tickets offer instant prizes!</Text>
            <Text style={styles.infoText}>• Higher price = better odds & bigger prizes</Text>
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
  lotteryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 8,
    alignItems: 'flex-start',
  },
  lotteryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    minHeight: 160,
  },
  lotteryImage: {
    width: 32,
    height: 32,
    marginBottom: 6,
    imageRendering: 'pixelated' as any,
  },
  lotteryName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 2,
  },
  lotteryDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  lotteryOdds: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  lotteryPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#06b6d4',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  lotteryButton: {
    backgroundColor: '#8b5cf6',
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  lotteryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  limitedTimeContainer: {
    position: 'relative',
    marginVertical: 16,
    marginHorizontal: 20,
  },
  limitedTimeGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  limitedTimeBorder: {
    backgroundColor: '#fff8dc',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ffd700',
    padding: 16,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});
