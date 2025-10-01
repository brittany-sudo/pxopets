import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Animated, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import { useInventory } from '@/store/InventoryStore';
import { useSimpleGame } from '@/store/SimpleGameStore';

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
const quickstopCoffeeImage = require('@/assets/images/quickstopcoffee.png');
const slushee3Image = require('@/assets/images/slushee3.png');
const gameLunchboxImage = require('@/assets/images/game-lunchbox.png');
const cuteLunchboxImage = require('@/assets/images/cute-lunchbox.png');
const whaleLunchboxImage = require('@/assets/images/whale-lunchbox.png');
const rocketLunchboxImage = require('@/assets/images/rocket-lunchbox.png');
const dragonLunchboxImage = require('@/assets/images/dragon-lunchbox.png');
const pxogulpJugImage = require('@/assets/images/pxogulp-jug.png');

export default function ShopScreen() {
  const [shopkeeperSaying, setShopkeeperSaying] = useState("Welcome to QuickStop! Best prices in Pxoburbs!");
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [showCoffeePopup, setShowCoffeePopup] = useState(false);
  const [showSlusheePopup, setShowSlusheePopup] = useState(false);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [showNotEnoughTickets, setShowNotEnoughTickets] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [coffeeClaimedToday, setCoffeeClaimedToday] = useState(false);
  const [slusheeClaimedToday, setSlusheeClaimedToday] = useState(false);
  const [showSlusheeConfirm, setShowSlusheeConfirm] = useState(false);
  const [showSlusheeSuccess, setShowSlusheeSuccess] = useState(false);
  const glowAnimation = useRef(new Animated.Value(0.2)).current;
  const { addItem } = useInventory();
  const { state: gameState, addCoins, addTickets, spendTickets, hydrated } = useSimpleGame();

  // Limited time items that can only be bought with tickets
  const [limitedItems, setLimitedItems] = useState([
    { id: 'l1', name: 'Space Bubblegum', price: 2, image: 'gumballs', tickets: 2 },
    { id: 'l2', name: 'Cosmic Burger', price: 2, image: 'cosmicburger', tickets: 2 },
    { id: 'l3', name: 'Punch Pouch', price: 2, image: 'pouchdrink', tickets: 2 },
    { id: 'l4', name: 'Choco-Donut', price: 2, image: 'chocodonut', tickets: 2 },
  ]);

  // Scratch-off tickets with different variations
  const [lotteryTickets, setLotteryTickets] = useState([
    { 
      id: 'lot1', 
      name: 'Cash Match', 
      price: 1, 
      description: 'Match 3 to win!',
      odds: '1 in 3',
      prizes: ['5 tickets', '10 tickets', '25 tickets', '50 tickets'],
      image: 'scratchoff1'
    },
    { 
      id: 'lot2', 
      name: 'Lucky 7s', 
      price: 1, 
      description: 'Find 3 lucky 7s!',
      odds: '1 in 5',
      prizes: ['25 tickets', '50 tickets', '100 tickets', 'Rare Item'],
      image: 'scratchoff2'
    },
    { 
      id: 'lot3', 
      name: 'Mega Money', 
      price: 1, 
      description: 'Scratch to reveal your prize!',
      odds: '1 in 20',
      prizes: ['100 tickets', '500 tickets', '1000 tickets', 'Legendary Pet'],
      image: 'scratchoff3'
    },
    { 
      id: 'lot4', 
      name: 'Win Big', 
      price: 1, 
      description: 'Instant winner guaranteed!',
      odds: '1 in 4',
      prizes: ['15 tickets', '30 tickets', '60 tickets', 'Special Item'],
      image: 'scratchoff4'
    },
  ]);

  // Shop inventory that changes every few hours
  const [shopInventory, setShopInventory] = useState([
    { id: 's1', name: 'Protein Bar', price: 1, stock: 3, image: 'chocolate' },
    { id: 's2', name: 'Hot Chips', price: 1, stock: 1, image: 'hotchips' },
    { id: 's3', name: 'Slushee', price: 1, stock: 5, image: 'slushee' },
    { id: 's4', name: 'Lil Soda', price: 1, stock: 2, image: 'lil-soda' },
    { id: 's5', name: "Cup O'Noodle", price: 1, stock: 4, image: 'cupnoodle' },
    { id: 's6', name: 'Quickdog', price: 1, stock: 2, image: 'regularhotdog' },
    { id: 's7', name: 'Quick Chips', price: 1, stock: 1, image: 'potatochomps' },
    { id: 's8', name: 'Saturn Soda', price: 1, stock: 3, image: 'saturnsoda' },
    { id: 's9', name: 'Nuggets', price: 1, stock: 4, image: 'nuggets' },
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

  // Check and reset daily coffee and slushee claims
  useEffect(() => {
    const checkDailyClaims = () => {
      const today = new Date().toDateString();
      
      // For now, let's just reset both to false to test
      // In a real app, you'd use AsyncStorage or another persistent storage
      setCoffeeClaimedToday(false);
      setSlusheeClaimedToday(false);
      
      console.log('Daily claims reset for:', today);
    };

    checkDailyClaims();
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleBuy = (item: any) => {
    if (!hydrated) {
      alert('App not ready yet, please wait...');
      return;
    }
    
    if (item.stock > 0) {
      // Check if player has enough tickets
      if (gameState.tickets >= item.price) {
        setSelectedItem(item);
        setShowPurchaseConfirm(true);
      } else {
        setShowNotEnoughTickets(true);
      }
    } else {
      setShowOutOfStock(true);
    }
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;
    
    // Deduct tickets
    spendTickets(selectedItem.price);
    
    // Update stock
    setShopInventory(prev => 
      prev.map(shopItem => 
        shopItem.id === selectedItem.id 
          ? { ...shopItem, stock: shopItem.stock - 1 }
          : shopItem
      )
    );
    
    // Add to inventory
    const itemData = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      category: 'snack' as const,
      description: `Purchased from QuickStop`
    };
    
    addItem(itemData, 1);
    
    // Close confirmation modal and show success
    setShowPurchaseConfirm(false);
    setShowPurchaseSuccess(true);
    
    // Auto-close success modal after 2 seconds
    setTimeout(() => {
      setShowPurchaseSuccess(false);
      setSelectedItem(null);
    }, 2000);
  };

  const cancelPurchase = () => {
    setShowPurchaseConfirm(false);
    setSelectedItem(null);
  };

  const handleSell = (item: any) => {
    Alert.alert(
      "Sell Item",
      `Sell ${item.name} for ${Math.floor(item.price * 0.7)} lightning?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sell", onPress: () => {
          // TODO: Implement sell functionality
          Alert.alert("Coming Soon", "Sell functionality will be implemented soon!");
        }}
      ]
    );
  };


  const handleLotteryPurchase = (lottery: any) => {
    // Check if player has enough tickets
    if (gameState.tickets >= lottery.price) {
      Alert.alert(
        "Buy Lottery Ticket",
        `Buy a ${lottery.name} ticket for ${lottery.price} ticket${lottery.price > 1 ? 's' : ''}?\n\nOdds: ${lottery.odds}\nPrizes: ${lottery.prizes.join(', ')}\n\nYou have ${gameState.tickets} tickets.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy Ticket", onPress: () => {
            // Deduct tickets
            spendTickets(lottery.price);
            
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
    } else {
      Alert.alert("Not Enough Tickets", `You need ${lottery.price} ticket${lottery.price > 1 ? 's' : ''} to buy a ${lottery.name} ticket.\n\nYou have ${gameState.tickets} tickets.`);
    }
  };

  const handleFreeCoffee = () => {
    if (coffeeClaimedToday) {
      Alert.alert("Already Claimed", "You've already claimed your free coffee today! Come back tomorrow!");
      return;
    }
    setShowCoffeePopup(true);
  };

  const handleTakeCoffee = () => {
    addItem({
      id: 'quickstop-coffee',
      name: 'QuickStop Coffee',
      price: 0,
      image: 'quickstopcoffee',
      category: 'drink',
      description: 'A complimentary cup of QuickStop coffee'
    }, 1);
    
    // Mark coffee as claimed for today
    setCoffeeClaimedToday(true);
    
    setShowCoffeePopup(false);
  };

  const handleMonthlySlushee = () => {
    if (slusheeClaimedToday) {
      Alert.alert("Already Claimed", "You've already claimed your monthly slushee today! Come back tomorrow!");
      return;
    }
    if (gameState.tickets < 3) {
      Alert.alert("Not Enough Tickets", "You need 3 tickets to buy a monthly slushee!");
      return;
    }
    setShowSlusheePopup(true);
  };

  const handleSlusheeConfirm = () => {
    setShowSlusheePopup(false);
    setShowSlusheeConfirm(true);
  };

  const handleSlusheePurchase = () => {
    // Deduct 3 tickets
    spendTickets(3);
    
    // Add slushee to inventory
    addItem({
      id: 'monthly-slushee',
      name: 'Monthly Slushee',
      price: 3,
      image: 'slushee3',
      category: 'drink',
      description: 'A refreshing monthly slushee!'
    }, 1);
    
    // Mark slushee as claimed for today
    setSlusheeClaimedToday(true);
    
    setShowSlusheeConfirm(false);
    setShowSlusheeSuccess(true);

    setTimeout(() => {
      setShowSlusheeSuccess(false);
    }, 2000);
  };


  const handlePurchaseItem = (item: any) => {
    // Check if player has enough tickets
    if (gameState.tickets >= item.price) {
      // Deduct tickets
      spendTickets(item.price);
      
      const itemData = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: 'snack' as const,
        description: `Purchased from QuickStop`
      };
      
      const success = addItem(itemData, 1);
      
      if (success) {
        Alert.alert("Purchase Successful", `${item.name} added to inventory!`);
      } else {
        Alert.alert("Inventory Full", "Item moved to safety deposit box!");
      }
    } else {
      Alert.alert("Not Enough Tickets", `You need ${item.price} ticket${item.price > 1 ? 's' : ''} to buy ${item.name}.\n\nYou have ${gameState.tickets} tickets.`);
    }
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
                <RNView style={styles.priceContainer}>
                  <FontAwesome name="ticket" size={14} color="#8b5cf6" />
                  <Text style={styles.ticketPrice}>{item.price}</Text>
                </RNView>
                <Text style={styles.chipsStock}>Stock: {item.stock}</Text>
                <RNView style={styles.chipsActions}>
                  <Pressable 
                    style={[styles.actionButton, styles.shopBuyButton]}
                    onPress={() => handleBuy(item)}
                    disabled={item.stock === 0}
                  >
                    <Text style={styles.buyButtonText}>BUY</Text>
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
                <RNView key={item.id} style={styles.martysItem}>
                  <Image 
                    source={
                      item.image === 'gumballs' ? gumballsImage :
                      item.image === 'chocodonut' ? chocodonutImage :
                      item.image === 'cosmicburger' ? cosmicBurgerImage :
                      item.image === 'lil-soda' ? lilSodaImage :
                      item.image === 'pouchdrink' ? pouchdrinkImage :
                      pouchdrinkImage
                    } 
                    style={styles.martysImage} 
                  />
                  <Text style={styles.martysName}>{item.name}</Text>
                  <RNView style={styles.priceContainer}>
                    <FontAwesome name="diamond" size={14} color="#4a90e2" />
                    <Text style={styles.gemPrice}>{item.price}</Text>
                  </RNView>
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
                <Text style={styles.lotteryPrice}>{lottery.price} ticket{lottery.price > 1 ? 's' : ''}</Text>
                <Pressable 
                  style={[styles.actionButton, styles.lotteryButton]}
                  onPress={() => handleLotteryPurchase(lottery)}
                >
                  <Text style={styles.lotteryButtonText}>BUY TICKET</Text>
                </Pressable>
              </RNView>
            ))}
        </RNView>

        {/* Featured Item - Pxogulp Jug */}
        <RNView style={styles.featuredContainer}>
          <RNView style={styles.featuredBorder}>
            <RNView style={styles.featuredHeader}>
              <Text style={styles.featuredTitle}>✨ FEATURED ITEM ✨</Text>
            </RNView>
            <RNView style={styles.featuredContent}>
              <RNView style={styles.featuredImageContainer}>
                <Image source={pxogulpJugImage} style={styles.featuredImage} />
                <RNView style={styles.featuredGlow} />
              </RNView>
              <RNView style={styles.featuredInfo}>
                <Text style={styles.featuredItemName}>Pxogulp Refillable Jug</Text>
                <Text style={styles.featuredDescription}>
                  Fill with your choice of 6 sodas!{'\n'}
                  3 refills per day • 20 stamina each
                </Text>
                <RNView style={styles.featuredPriceContainer}>
                  <FontAwesome name="diamond" size={20} color="#00ffff" />
                  <Text style={styles.featuredPrice}>50</Text>
                </RNView>
                <Pressable style={styles.featuredBuyButton}>
                  <Text style={styles.featuredBuyText}>GET REFILLABLE JUG</Text>
                </Pressable>
              </RNView>
            </RNView>
          </RNView>
        </RNView>

      </ScrollView>

      {/* Coffee Popup Modal */}
      {showCoffeePopup && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <Text style={styles.coffeePopupTitle}>FREE COFFEE!</Text>
            <Image source={quickstopCoffeeImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              A complimentary cup of QuickStop coffee!
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
          <RNView style={styles.coffeePopup}>
            <Text style={styles.coffeePopupTitle}>MONTHLY SLUSHEE!</Text>
            <Image source={slushee3Image} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              A refreshing monthly slushee for 3 tickets!
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={handleSlusheeConfirm}
            >
              <Text style={styles.coffeePopupButtonText}>Buy for 3 Tickets</Text>
            </Pressable>
            <Pressable 
              style={styles.coffeePopupCancelButton}
              onPress={() => setShowSlusheePopup(false)}
            >
              <Text style={styles.coffeePopupCancelButtonText}>Cancel</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Slushee Confirmation Modal */}
      {showSlusheeConfirm && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.purchaseConfirmPopup}>
            <Text style={styles.purchaseConfirmTitle}>CONFIRM PURCHASE</Text>
            <Image source={slushee3Image} style={styles.coffeePopupImage} />
            <Text style={styles.purchaseConfirmText}>
              Buy Monthly Slushee for 3 tickets?
            </Text>
            <RNView style={styles.purchaseConfirmButtons}>
              <Pressable 
                style={styles.purchaseConfirmButton}
                onPress={handleSlusheePurchase}
              >
                <Text style={styles.purchaseConfirmButtonText}>Confirm</Text>
              </Pressable>
              <Pressable 
                style={styles.purchaseCancelButton}
                onPress={() => setShowSlusheeConfirm(false)}
              >
                <Text style={styles.purchaseCancelButtonText}>Cancel</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
      )}

      {/* Slushee Success Modal */}
      {showSlusheeSuccess && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.purchaseSuccessPopup}>
            <Text style={styles.purchaseSuccessTitle}>PURCHASE SUCCESSFUL! 🎉</Text>
            <Image source={slushee3Image} style={styles.purchaseSuccessImage} />
            <Text style={styles.purchaseSuccessText}>
              Monthly Slushee was added to your inventory!
            </Text>
            <Text style={styles.purchaseSuccessSubtext}>
              Check your inventory on the home page to see it.
            </Text>
          </RNView>
        </RNView>
      )}

      {/* Purchase Confirmation Modal */}
      {showPurchaseConfirm && selectedItem && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.purchaseConfirmPopup}>
            <Text style={styles.purchaseConfirmTitle}>PURCHASE CONFIRMATION</Text>
            <RNView style={styles.purchaseConfirmItemContainer}>
              <Image 
                source={
                  selectedItem.image === 'chocolate' ? chocolateImage :
                  selectedItem.image === 'hotchips' ? hotchipsImage :
                  selectedItem.image === 'slushee' ? slusheeImage :
                  selectedItem.image === 'lil-soda' ? lilSodaImage :
                  selectedItem.image === 'cupnoodle' ? cupnoodleImage :
                  selectedItem.image === 'regularhotdog' ? regularHotdogImage :
                  selectedItem.image === 'potatochomps' ? potatochompsImage :
                  selectedItem.image === 'saturnsoda' ? saturnsodaImage :
                  selectedItem.image === 'nuggets' ? nuggetsImage :
                  selectedItem.image === 'milkshakes' ? milkshakesImage :
                  selectedItem.image === 'glowcorn' ? glowcornImage :
                  selectedItem.image === 'gumballs' ? gumballsImage :
                  selectedItem.image === 'chocodonut' ? chocodonutImage :
                  selectedItem.image === 'pouchdrink' ? pouchdrinkImage :
                  selectedItem.image === 'cosmicburger' ? cosmicBurgerImage :
                  chocolateImage
                } 
                style={styles.purchaseConfirmItemImage} 
              />
            </RNView>
            <Text style={styles.purchaseConfirmText}>
              Buy {selectedItem.name} for {selectedItem.price} ticket{selectedItem.price > 1 ? 's' : ''}?
            </Text>
            <Text style={styles.purchaseConfirmSubtext}>
              You have {gameState.tickets} tickets.
            </Text>
            <RNView style={styles.purchaseConfirmButtonContainer}>
              <Pressable 
                style={styles.purchaseConfirmButton}
                onPress={confirmPurchase}
              >
                <Text style={styles.purchaseConfirmButtonText}>CONFIRM</Text>
              </Pressable>
              <Pressable 
                style={styles.purchaseCancelButton}
                onPress={cancelPurchase}
              >
                <Text style={styles.purchaseCancelButtonText}>CANCEL</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
      )}

      {/* Purchase Success Modal */}
      {showPurchaseSuccess && selectedItem && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.purchaseSuccessPopup}>
            <Text style={styles.purchaseSuccessTitle}>PURCHASE SUCCESSFUL! 🎉</Text>
            <Image 
              source={
                selectedItem.image === 'chocolate' ? chocolateImage :
                selectedItem.image === 'cupnoodle' ? cupnoodleImage :
                selectedItem.image === 'cupnoddle' ? cupnoddleImage :
                selectedItem.image === 'hotchips' ? hotchipsImage :
                selectedItem.image === 'lil-soda' ? lilSodaImage :
                selectedItem.image === 'regularhotdog' ? regularHotdogImage :
                selectedItem.image === 'potatochomps' ? potatochompsImage :
                selectedItem.image === 'saturnsoda' ? saturnsodaImage :
                selectedItem.image === 'slushee' ? slusheeImage :
                selectedItem.image === 'nuggets' ? nuggetsImage :
                selectedItem.image === 'milkshakes' ? milkshakesImage :
                selectedItem.image === 'glowcorn' ? glowcornImage :
                selectedItem.image === 'game-lunchbox' ? gameLunchboxImage :
                selectedItem.image === 'cute-lunchbox' ? cuteLunchboxImage :
                selectedItem.image === 'whale-lunchbox' ? whaleLunchboxImage :
                selectedItem.image === 'rocket-lunchbox' ? rocketLunchboxImage :
                selectedItem.image === 'dragon-lunchbox' ? dragonLunchboxImage :
                chocolateImage
              } 
              style={styles.purchaseSuccessImage} 
            />
            <Text style={styles.purchaseSuccessText}>
              {selectedItem.name} was added to your inventory!
            </Text>
            <Text style={styles.purchaseSuccessSubtext}>
              Check your inventory on the home page to see it.
            </Text>
          </RNView>
        </RNView>
      )}

      {/* Not Enough Tickets Modal */}
      {showNotEnoughTickets && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.errorModal}>
            <Text style={styles.errorTitle}>Not Enough Tickets! 💸</Text>
            <Text style={styles.errorText}>You need more tickets to buy this item.</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowNotEnoughTickets(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Out of Stock Modal */}
      {showOutOfStock && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.errorModal}>
            <Text style={styles.errorTitle}>Out of Stock! 📦</Text>
            <Text style={styles.errorText}>This item is currently unavailable.</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowOutOfStock(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
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
    padding: 0,
    alignItems: 'flex-start',
    marginBottom: 0,
    gap: 8,
  },
  chipsItem: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    padding: 4,
    minHeight: 70,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  martysItem: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    padding: 8,
    minHeight: 85,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a90e2',
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  martysImage: {
    width: 32,
    height: 32,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  martysName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 1,
    height: 12,
    lineHeight: 10,
  },
  chipsImage: {
    width: 32,
    height: 32,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  chipsName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: -2,
    height: 14,
    lineHeight: 12,
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
    marginBottom: 6,
  },
  chipsActions: {
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
    marginTop: 4,
  },
  ticketPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  itemCard: {
    width: '22%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 6,
    marginBottom: 12,
    minHeight: 90,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
    flex: 1,
    lineHeight: 12,
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
    backgroundColor: '#0ea5e9',
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
    fontFamily: 'Silkscreen_400Regular',
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
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    height: 14,
    lineHeight: 12,
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
    marginBottom: 8,
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
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a90e2',
    padding: 12,
    shadowColor: '#4a90e2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  monthlySlusheeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderRadius: 0,
    width: 120,
    minHeight: 50,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlySlusheeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  monthlySlusheeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
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
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    width: 300,
    marginTop: -80,
  },
  coffeePopupTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
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
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
    fontWeight: '400',
  },
  coffeePopupButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    marginBottom: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  coffeePopupButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  coffeePopupCancelButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  coffeePopupCancelButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
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
  // Purchase Confirmation Modal Styles
  purchaseConfirmPopup: {
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
  purchaseConfirmTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  purchaseConfirmItemContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  purchaseConfirmItemImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  purchaseConfirmText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
    fontWeight: '500',
  },
  purchaseConfirmSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 16,
  },
  purchaseConfirmButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseConfirmButton: {
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
  purchaseConfirmButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  purchaseCancelButton: {
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
  purchaseCancelButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Purchase Success Modal Styles
  purchaseSuccessPopup: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#10b981',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
    marginTop: -100,
  },
  purchaseSuccessTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#10b981',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  purchaseSuccessImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  purchaseSuccessText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
    fontWeight: '500',
  },
  purchaseSuccessSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Error Modal Styles
  errorModal: {
    backgroundColor: '#ffffff',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    width: 320,
    marginTop: -100,
  },
  errorTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  modalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    gap: 3,
  },
  ticketPriceLarge: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#4a90e2',
    marginLeft: 4,
    fontWeight: '600',
  },
  gemPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#4a90e2',
    marginLeft: 4,
    fontWeight: '600',
  },
  // Featured Item Styles
  featuredContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  featuredBorder: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  featuredGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  featuredInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  featuredItemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 6,
    textAlign: 'left',
  },
  featuredDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 12,
    textAlign: 'left',
  },
  featuredPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  featuredPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  featuredBuyButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBuyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
