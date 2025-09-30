import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

// Import the Marty image and main image
const martyImage = require('@/assets/images/quickstop-marty.png');
const quickstopMainImage = require('@/assets/images/quickstop-main.png');
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const cupnoddleImage = require('@/assets/images/cupnoddle.png');
const cupnoodleImage = require('@/assets/images/cupnoodle.png');
const chocolateImage = require('@/assets/images/chocolate.png');
const pouchdrinkImage = require('@/assets/images/pouchdrink.png');
const lilSodaImage = require('@/assets/images/lil-soda.png');
const hotchipsImage = require('@/assets/images/hotchips.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const chocodonutImage = require('@/assets/images/chocodonut.png');
const lilTagImage = require('@/assets/images/lil-tag.png');
const regularHotdogImage = require('@/assets/images/regularhotdog.png');
const milkshakesImage = require('@/assets/images/milkshakes.png');
const glowcornImage = require('@/assets/images/glowcorn.png');
const saturnsodaImage = require('@/assets/images/saturnsoda.png');
const potatochompsImage = require('@/assets/images/potatochomps.png');
const slusheeImage = require('@/assets/images/slushee.png');
const nuggetsImage = require('@/assets/images/nuggets.png');
const scratchoff1Image = require('@/assets/images/scratchoff1.png');
const scratchoff2Image = require('@/assets/images/scratchoff2.png');
const scratchoff3Image = require('@/assets/images/scratchoff3.png');
const scratchoff4Image = require('@/assets/images/scratchoff4.png');
const moonpetalTeaImage = require('@/assets/images/moonpetal-tea.png');

export default function ShopScreen() {
  const [shopkeeperSaying, setShopkeeperSaying] = useState("Welcome to QuickStop! Best prices in Pxoburbs!");
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [showCoffeePopup, setShowCoffeePopup] = useState(false);
  const [showSlusheePopup, setShowSlusheePopup] = useState(false);
  const glowAnimation = useRef(new Animated.Value(0.2)).current;
  const [playerInventory, setPlayerInventory] = useState([
    { id: '1', name: 'Golden Star', price: 15, image: 'cosmicburger' },
    { id: '2', name: 'Magic Leaf', price: 8, image: 'cupnoddle' },
    { id: '3', name: 'Blue Crystal', price: 25, image: 'chocolate' },
    { id: '4', name: 'Love Token', price: 12, image: 'gumballs' },
  ]);

  // Limited time items that can only be bought with tickets
  const [limitedItems, setLimitedItems] = useState([
    { id: 'l1', name: 'Space Bubblegum', price: 50, image: 'gumballs', tickets: 3 },
    { id: 'l2', name: 'Cosmic Burger', price: 75, image: 'cosmicburger', tickets: 5 },
    { id: 'l3', name: 'Punch Pouch', price: 100, image: 'pouchdrink', tickets: 7 },
    { id: 'l4', name: 'Choco-Donut', price: 125, image: 'chocodonut', tickets: 10 },
  ]);

  // Scratch-off tickets with different variations
  const [lotteryTickets, setLotteryTickets] = useState([
    { 
      id: 'lot1', 
      name: 'Cash Match', 
      price: 5, 
      description: 'Match 3 to win!',
      odds: '1 in 3',
      prizes: ['5 tickets', '10 tickets', '25 tickets', '50 tickets'],
      image: 'scratchoff1'
    },
    { 
      id: 'lot2', 
      name: 'Lucky 7s', 
      price: 15, 
      description: 'Find 3 lucky 7s!',
      odds: '1 in 5',
      prizes: ['25 tickets', '50 tickets', '100 tickets', 'Rare Item'],
      image: 'scratchoff2'
    },
    { 
      id: 'lot3', 
      name: 'Mega Money', 
      price: 50, 
      description: 'Scratch to reveal your prize!',
      odds: '1 in 20',
      prizes: ['100 tickets', '500 tickets', '1000 tickets', 'Legendary Pet'],
      image: 'scratchoff3'
    },
    { 
      id: 'lot4', 
      name: 'Win Big', 
      price: 10, 
      description: 'Instant winner guaranteed!',
      odds: '1 in 4',
      prizes: ['15 tickets', '30 tickets', '60 tickets', 'Special Item'],
      image: 'scratchoff4'
    },
  ]);

  // Shop inventory that changes every few hours
  const [shopInventory, setShopInventory] = useState([
    { id: 's1', name: 'Protein Bar', price: 8, stock: 3, image: 'chocolate' },
    { id: 's2', name: 'Hot Chips', price: 18, stock: 1, image: 'hotchips' },
    { id: 's3', name: 'Slushee', price: 12, stock: 5, image: 'slushee' },
    { id: 's4', name: 'Lil Soda', price: 20, stock: 2, image: 'lil-soda' },
    { id: 's5', name: "Cup O'Noodle", price: 15, stock: 4, image: 'cupnoodle' },
    { id: 's6', name: 'Gas Station Dog', price: 25, stock: 2, image: 'regularhotdog' },
    { id: 's7', name: 'Potato Chomps', price: 30, stock: 1, image: 'potatochomps' },
    { id: 's8', name: 'Saturn Soda', price: 14, stock: 3, image: 'saturnsoda' },
    { id: 's9', name: 'Nuggets', price: 16, stock: 4, image: 'nuggets' },
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
          toValue: 0.2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [glowAnimation]);

  // Time-based shopkeeper sayings
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

  useEffect(() => {
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

  const handleFreeCoffee = () => {
    setShowCoffeePopup(true);
  };

  const handleTakeCoffee = () => {
    setPlayerInventory(prev => [...prev, { 
      id: Date.now().toString(), 
      name: 'Cup of Coffee', 
      price: 0, 
      image: 'moonpetal-tea' 
    }]);
    setShowCoffeePopup(false);
  };

  const handleMonthlySlushee = () => {
    setShowSlusheePopup(true);
  };

  const handlePurchaseSlushee = () => {
    // Check if player has enough tickets (assuming they have tickets in inventory)
    // For now, we'll just add the slushee and close the popup
    setPlayerInventory(prev => [...prev, { 
      id: Date.now().toString(), 
      name: 'Monthly Slushee', 
      price: 1, 
      image: 'slushee' 
    }]);
    setShowSlusheePopup(false);
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
          <Text style={styles.locationTitle}>QUICKSTOP</Text>
        </RNView>

        {/* Main Image */}
        <Image source={quickstopMainImage} style={styles.mainImage} />

        {/* Marty the Shopkeeper */}
        <RNView style={styles.npcContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>MARTY:</Text>
            <Text style={styles.speechText}>{shopkeeperSaying}</Text>
          </RNView>
          <Pressable onPress={() => setShopkeeperSaying(getTimeBasedSaying())}>
            <Image source={martyImage} style={styles.martyImage} />
          </Pressable>
        </RNView>

        {/* Free Options List */}
        <RNView style={styles.freeOptionsList}>
          <Pressable 
            style={styles.freeOptionItem}
            onPress={handleFreeCoffee}
          >
            <Text style={styles.freeOptionItemText}>Free Coffee</Text>
          </Pressable>
          
          <Pressable 
            style={styles.freeOptionItem}
            onPress={() => Alert.alert("Coming Soon", "Pxogulp Refill feature coming soon!")}
          >
            <Text style={styles.freeOptionItemText}>Pxogulp Refill</Text>
          </Pressable>
          
          <Pressable 
            style={styles.freeOptionItem}
            onPress={handleMonthlySlushee}
          >
            <Text style={styles.freeOptionItemText}>Monthly Slushee</Text>
          </Pressable>
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
                    item.image === 'chocolate' ? chocolateImage :
                    item.image === 'cupnoodle' ? cupnoodleImage :
                    item.image === 'cupnoddle' ? cupnoddleImage :
                    item.image === 'hotchips' ? hotchipsImage :
                    item.image === 'lil-soda' ? lilSodaImage :
                    item.image === 'regularhotdog' ? regularHotdogImage :
                    item.image === 'potatochomps' ? potatochompsImage :
                    item.image === 'saturnsoda' ? saturnsodaImage :
                    item.image === 'slushee' ? slusheeImage :
                    item.image === 'nuggets' ? nuggetsImage :
                    item.image === 'milkshakes' ? milkshakesImage :
                    item.image === 'glowcorn' ? glowcornImage :
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

        {/* Special Imports */}
        <RNView style={styles.stockHeader}>
          <Text style={styles.stockTitle}>MARTY'S IMPORTS</Text>
        </RNView>
        <RNView style={styles.limitedTimeContainer}>
          <Animated.View 
            style={[
              styles.limitedTimeGlow,
              {
                opacity: glowAnimation,
                transform: [{
                  scale: glowAnimation.interpolate({
                    inputRange: [0.2, 1],
                    outputRange: [1, 1.03],
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
                  inputRange: [0.2, 1],
                  outputRange: ['#ff69b4', '#ffb6c1'],
                })
              }
            ]}
          >
            <RNView style={styles.chipsGrid}>
              {limitedItems.map((item) => (
                <RNView key={item.id} style={[styles.chipsItem, { width: '48%' }]}>
                  <Image 
                    source={
                      item.image === 'gumballs' ? gumballsImage :
                      item.image === 'chocodonut' ? chocodonutImage :
                      item.image === 'cosmicburger' ? cosmicBurgerImage :
                      item.image === 'lil-soda' ? lilSodaImage :
                      item.image === 'pouchdrink' ? pouchdrinkImage :
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
                      <Text style={styles.buyButtonText}>Buy</Text>
                    </Pressable>
                  </RNView>
                </RNView>
              ))}
            </RNView>
          </Animated.View>
        </RNView>

        {/* Lottery Tickets */}
        <RNView style={[styles.stockHeader, { marginTop: 16 }]}>
          <Text style={styles.stockTitle}>SCRATCH-OFF TICKETS</Text>
        </RNView>
        <RNView style={styles.lotteryGrid}>
            {lotteryTickets.map((lottery) => (
              <RNView key={lottery.id} style={[styles.lotteryItem, { width: '48%' }]}>
                <Image 
                  source={
                    lottery.image === 'scratchoff1' ? scratchoff1Image :
                    lottery.image === 'scratchoff2' ? scratchoff2Image :
                    lottery.image === 'scratchoff3' ? scratchoff3Image :
                    lottery.image === 'scratchoff4' ? scratchoff4Image :
                    lottery.image === 'lil-tag' ? lilTagImage :
                    lottery.image === 'chocolate' ? chocolateImage :
                    lottery.image === 'gumballs' ? gumballsImage :
                    lottery.image === 'hotchips' ? hotchipsImage :
                    scratchoff1Image
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

      </ScrollView>

      {/* Coffee Popup Modal */}
      {showCoffeePopup && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <Text style={styles.coffeePopupTitle}>FREE COFFEE!</Text>
            <Image source={moonpetalTeaImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              A complimentary cup of QuickStop coffee! ☕
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={handleTakeCoffee}
            >
              <Text style={styles.coffeePopupButtonText}>Take Coffee</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Slushee Popup Modal */}
      {showSlusheePopup && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.slusheePopup}>
            <Text style={styles.slusheePopupTitle}>MONTHLY SLUSHEE</Text>
            <Image source={slusheeImage} style={styles.slusheePopupImage} />
            <Text style={styles.slusheePopupText}>
              Special monthly slushee available for 1 ticket! 🧊
            </Text>
            <RNView style={styles.slusheeButtonContainer}>
              <Pressable 
                style={styles.slusheePopupButton}
                onPress={handlePurchaseSlushee}
              >
                <Text style={styles.slusheePopupButtonText}>1 Ticket</Text>
              </Pressable>
              <Pressable 
                style={styles.slusheeNoThanksButton}
                onPress={() => setShowSlusheePopup(false)}
              >
                <Text style={styles.slusheeNoThanksButtonText}>No Thanks</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
      )}
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
    padding: 16,
    paddingBottom: 80,
  },
  freeOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 0,
  },
  freeOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 6,
    width: '45%',
    justifyContent: 'center',
    minHeight: 50,
    zIndex: 999,
    elevation: 999,
  },
  freeOptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: '500',
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
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
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
    height: 200,
    resizeMode: 'contain',
    borderRadius: 12,
    marginTop: 50,
    marginBottom: 8,
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  speechBubble: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    maxWidth: 300,
    marginRight: 8,
  },
  characterName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#14b8a6',
    marginBottom: 4,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#000000',
    textAlign: 'left',
  },
  martyImage: {
    width: 60,
    height: 60,
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
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'flex-start',
    marginBottom: 0,
    gap: 8,
  },
  chipsItem: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    padding: 10,
    minHeight: 100,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  chipsImage: {
    width: 32,
    height: 32,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  chipsName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 2,
    height: 12,
    lineHeight: 10,
  },
  chipsPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#06b6d4',
    textAlign: 'center',
    marginBottom: 2,
  },
  chipsStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  chipsActions: {
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
    marginTop: 4,
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
    backgroundColor: '#8b5cf6',
  },
  shopBuyButton: {
    backgroundColor: '#8b5cf6',
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
  stockHeader: {
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
  },
  stockTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  countdownText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#14b8a6',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
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
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'flex-start',
    marginTop: -8,
    marginBottom: 24,
    gap: 8,
  },
  lotteryItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    minHeight: 90,
  },
  lotteryImage: {
    width: 28,
    height: 28,
    marginBottom: 4,
  },
  lotteryName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 2,
    height: 12,
    lineHeight: 10,
  },
  lotteryDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  lotteryOdds: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  lotteryPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#06b6d4',
    textAlign: 'center',
    marginBottom: 4,
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
    marginTop: -8,
    marginBottom: 16,
    marginHorizontal: 0,
  },
  limitedTimeGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: 'rgba(255, 192, 203, 0.15)',
    borderRadius: 12,
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  limitedTimeBorder: {
    backgroundColor: '#fff0f5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff69b4',
    padding: 8,
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  // Free Options List Styles
  freeOptionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  freeOptionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 0,
    width: 120,
    minHeight: 50,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  freeOptionItemText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Coffee Popup Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  coffeePopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
    marginTop: -100,
  },
  coffeePopupTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  coffeePopupImage: {
    width: 60,
    height: 60,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  coffeePopupText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
    fontWeight: '400',
  },
  coffeePopupButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 0,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  coffeePopupButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Slushee Popup Modal Styles
  slusheePopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
    marginTop: -100,
  },
  slusheePopupTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  slusheePopupImage: {
    width: 60,
    height: 60,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  slusheePopupText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
    fontWeight: '400',
  },
  slusheePopupButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 0,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  slusheePopupButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  slusheeButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slusheeNoThanksButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  slusheeNoThanksButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
