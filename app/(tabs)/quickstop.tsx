import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Animated, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';
import { useInventory } from '@/store/InventoryStore';
import { useSimpleGame } from '@/store/SimpleGameStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the Marty image and main image
const martyImage = require('@/assets/images/quickstop-marty.png');
const quickstopMainImage = require('@/assets/images/quickstop-header.png');
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const cupnoddleImage = require('@/assets/images/cupnoddle.png');
const cupnoodleImage = require('@/assets/images/cupnoodle.png');
const astroTartsImage = require('@/assets/images/astro-tarts.png');
const chocolateImage = require('@/assets/images/chocolate.png');
const glowWormsImage = require('@/assets/images/glow-worms.png');
const pouchdrinkImage = require('@/assets/images/pouchdrink.png');
const surfPouchImage = require('@/assets/images/surferpouch.png');
const nachoImage = require('@/assets/images/nacho.png');
const jerkyImage = require('@/assets/images/jerky.png');
const neonColaImage = require('@/assets/images/neon-cola.png');
const hotchipsImage = require('@/assets/images/hotchips.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const chocodonutImage = require('@/assets/images/chocodonut.png');
const lilTagImage = require('@/assets/images/lil-tag.png');
const regularHotdogImage = require('@/assets/images/regularhotdog.png');
const milkshakesImage = require('@/assets/images/milkshakes.png');
const glowcornImage = require('@/assets/images/glowcorn.png');
const saturnsodaImage = require('@/assets/images/saturnsoda.png');
const potatochompsImage = require('@/assets/images/potatochomps.png');
const quickchipzImage = require('@/assets/images/quickchipz.png');
const glitterdogImage = require('@/assets/images/glitterdog.png');
const slusheeImage = require('@/assets/images/slushee.png');
const nuggetsImage = require('@/assets/images/nuggets.png');
const orbitRingsImage = require('@/assets/images/orbit-rings.png');
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
  const [countdown, setCountdown] = useState(10800); // 3 hours in seconds
  const [showCoffeePopup, setShowCoffeePopup] = useState(false);
  const [showSlusheePopup, setShowSlusheePopup] = useState(false);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [showNotEnoughTickets, setShowNotEnoughTickets] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [coffeeClaimedToday, setCoffeeClaimedToday] = useState(false);
  const [lastCoffeeClaim, setLastCoffeeClaim] = useState<string | null>(null);
  const [showSlusheeConfirm, setShowSlusheeConfirm] = useState(false);
  const [showSlusheeSuccess, setShowSlusheeSuccess] = useState(false);
  const [showCoffeeCooldown, setShowCoffeeCooldown] = useState(false);
  const [cooldownHours, setCooldownHours] = useState(0);
  const [showPxogulpConfirm, setShowPxogulpConfirm] = useState(false);
  const [showPxogulpSuccess, setShowPxogulpSuccess] = useState(false);
  const [showNotEnoughGems, setShowNotEnoughGems] = useState(false);
  const [showPxogulpRefillMenu, setShowPxogulpRefillMenu] = useState(false);
  const [showRefillSuccess, setShowRefillSuccess] = useState(false);
  const [showNoJugAlert, setShowNoJugAlert] = useState(false);
  const [showFilledJugAlert, setShowFilledJugAlert] = useState(false);
  const [showDailyLimitAlert, setShowDailyLimitAlert] = useState(false);
  const glowAnimation = useRef(new Animated.Value(0.2)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(new Animated.Value(300)).current;
  const { addItem, removeItem, state: inventoryState } = useInventory();
  const { state: gameState, addCoins, addTickets, spendTickets, hydrated, setCurrency, canRefillPxogulp, usePxogulpRefill } = useSimpleGame();

  // Random soda flavors for Pxogulp refill (text only)
  const sodaFlavors = [
    { id: '1', name: 'Cosmic Cherry' },
    { id: '2', name: 'Neon Grape' },
    { id: '3', name: 'Stellar Strawberry' },
    { id: '4', name: 'Galaxy Grape' },
    { id: '5', name: 'Lunar Lemon' },
    { id: '6', name: 'Solar Orange' },
  ];

  // Limited time items that can only be bought with tickets
  const [limitedItems, setLimitedItems] = useState([
    { id: 'l1', name: 'Space Bubblegum', price: 2, image: 'gumballs', tickets: 2 },
    { id: 'l2', name: 'Crater Jerky', price: 2, image: 'cosmicburger', tickets: 2 },
    { id: 'l3', name: 'Surf Pouch', price: 2, image: 'pouchdrink', tickets: 2 },
    { id: 'l4', name: 'Cosmic Nacho', price: 2, image: 'chocodonut', tickets: 2 },
  ]);

  // Scratch-off tickets with different variations
  const [lotteryTickets, setLotteryTickets] = useState([
    { 
      id: 'lot1', 
      name: 'Cash Match', 
      price: 2, 
      description: 'Match 3 to win!',
      odds: '1 in 3',
      prizes: ['5 tickets', '10 tickets', '25 tickets', '50 tickets'],
      image: 'scratchoff1'
    },
    { 
      id: 'lot2', 
      name: 'Lucky 7s', 
      price: 2, 
      description: 'Find 3 lucky 7s!',
      odds: '1 in 5',
      prizes: ['25 tickets', '50 tickets', '100 tickets', 'Rare Item'],
      image: 'scratchoff2'
    },
    { 
      id: 'lot3', 
      name: 'Mega Money', 
      price: 2, 
      description: 'Scratch to reveal your prize!',
      odds: '1 in 20',
      prizes: ['100 tickets', '500 tickets', '1000 tickets', 'Legendary Pet'],
      image: 'scratchoff3'
    },
    { 
      id: 'lot4', 
      name: 'Win Big', 
      price: 2, 
      description: 'Instant winner guaranteed!',
      odds: '1 in 4',
      prizes: ['15 tickets', '30 tickets', '60 tickets', 'Special Item'],
      image: 'scratchoff4'
    },
  ]);

  // Shop inventory with higher stock amounts and rarity system
  const [shopInventory, setShopInventory] = useState([
    { id: 's1', name: 'GLOW WORM GUMMIES', price: 1, stock: 45, maxStock: 45, rarity: 'common', image: 'glow-worms' },
    { id: 's2', name: 'HOT CHIPS', price: 1, stock: 35, maxStock: 35, rarity: 'common', image: 'hotchips' },
    { id: 's3', name: 'SLUSHEE', price: 1, stock: 50, maxStock: 50, rarity: 'common', image: 'slushee' },
    { id: 's4', name: 'NEON COLA', price: 1, stock: 40, maxStock: 40, rarity: 'common', image: 'neon-cola' },
    { id: 's5', name: 'ASTRO TARTS', price: 1, stock: 30, maxStock: 30, rarity: 'uncommon', image: 'astro-tarts' },
    { id: 's6', name: 'GLITTERDOG', price: 1, stock: 25, maxStock: 25, rarity: 'uncommon', image: 'glitterdog' },
    { id: 's7', name: 'QUICK CHIPZ', price: 1, stock: 20, maxStock: 20, rarity: 'rare', image: 'quickchipz' },
    { id: 's8', name: 'SATURN SODA', price: 1, stock: 35, maxStock: 35, rarity: 'common', image: 'saturnsoda' },
    { id: 's9', name: 'ORBIT RINGS', price: 1, stock: 15, maxStock: 15, rarity: 'rare', image: 'orbit-rings' },
  ]);

  // Restock function that resets all stock to max
  const restockShop = async () => {
    setShopInventory(prev => 
      prev.map(item => ({
        ...item,
        stock: item.maxStock
      }))
    );
    
    // Save restock time
    try {
      await AsyncStorage.setItem('lastRestockTime', new Date().toISOString());
    } catch (error) {
      console.error('Failed to save restock time:', error);
    }
    
    console.log('Shop restocked! All items back to full stock.');
  };

  // Countdown timer effect with 3-hour restock cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          restockShop(); // Restock when timer reaches 0
          return 10800; // Reset to 3 hours
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load and save stock data with persistence
  useEffect(() => {
    const loadStockData = async () => {
      try {
        const savedStock = await AsyncStorage.getItem('quickstopStock');
        const savedCountdown = await AsyncStorage.getItem('quickstopCountdown');
        const lastRestock = await AsyncStorage.getItem('lastRestockTime');
        
        if (savedStock && savedCountdown) {
          const stockData = JSON.parse(savedStock);
          const countdownValue = parseInt(savedCountdown);
          
          // Check if it's been more than 3 hours since last restock
          if (lastRestock) {
            const lastRestockTime = new Date(lastRestock).getTime();
            const now = new Date().getTime();
            const timeSinceRestock = (now - lastRestockTime) / 1000; // seconds
            
            if (timeSinceRestock >= 10800) { // 3 hours
              // Time to restock
              restockShop();
              setCountdown(10800);
              await AsyncStorage.setItem('lastRestockTime', new Date().toISOString());
            } else {
              // Use saved data
              setShopInventory(stockData);
              setCountdown(countdownValue);
            }
          } else {
            // First time, use saved data
            setShopInventory(stockData);
            setCountdown(countdownValue);
          }
        }
      } catch (error) {
        console.error('Failed to load stock data:', error);
      }
    };

    loadStockData();
  }, []);

  // Save stock data whenever it changes
  useEffect(() => {
    const saveStockData = async () => {
      try {
        await AsyncStorage.setItem('quickstopStock', JSON.stringify(shopInventory));
        await AsyncStorage.setItem('quickstopCountdown', countdown.toString());
      } catch (error) {
        console.error('Failed to save stock data:', error);
      }
    };

    saveStockData();
  }, [shopInventory, countdown]);

  // Load coffee claim status on component mount
  useEffect(() => {
    const loadCoffeeClaimStatus = async () => {
      try {
        const lastClaim = await AsyncStorage.getItem('lastCoffeeClaim');
        if (lastClaim) {
          setLastCoffeeClaim(lastClaim);
          
          // Check if 24 hours have passed
          const lastClaimTime = new Date(lastClaim).getTime();
          const now = new Date().getTime();
          const hoursSinceLastClaim = (now - lastClaimTime) / (1000 * 60 * 60);
          
          if (hoursSinceLastClaim < 24) {
            setCoffeeClaimedToday(true);
          } else {
            setCoffeeClaimedToday(false);
          }
        }
      } catch (error) {
        console.error('Error loading coffee claim status:', error);
      }
    };

    loadCoffeeClaimStatus();
  }, []);

  // Scroll to top whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  // Animate Pxogulp refill menu
  useEffect(() => {
    if (showPxogulpRefillMenu) {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showPxogulpRefillMenu]);

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
      description: `Purchased from QuickStop`,
      rarity: selectedItem.rarity
    };
    
    addItem(itemData, 1);
    
    // Close confirmation modal and show success
    setShowPurchaseConfirm(false);
    setShowPurchaseSuccess(true);
    
    // Auto-close success modal after 4 seconds
    setTimeout(() => {
      setShowPurchaseSuccess(false);
      setSelectedItem(null);
    }, 4000);
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
    // Check if coffee was claimed in the last 24 hours
    if (lastCoffeeClaim) {
      const lastClaimTime = new Date(lastCoffeeClaim).getTime();
      const now = new Date().getTime();
      const hoursSinceLastClaim = (now - lastClaimTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastClaim < 24) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastClaim);
        setCooldownHours(hoursRemaining);
        setShowCoffeeCooldown(true);
        return;
      }
    }
    
    setShowCoffeePopup(true);
  };

  const handleTakeCoffee = async () => {
    addItem({
      id: 'quickstop-coffee',
      name: 'QuickStop Coffee',
      price: 0,
      image: 'quickstopcoffee',
      category: 'drink',
      description: 'A complimentary cup of QuickStop coffee'
    }, 1);
    
    // Mark coffee as claimed and record the time
    const now = new Date().toISOString();
    setLastCoffeeClaim(now);
    setCoffeeClaimedToday(true);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('lastCoffeeClaim', now);
    } catch (error) {
      console.error('Error saving coffee claim time:', error);
    }
    
    setShowCoffeePopup(false);
  };

  const handleMonthlySlushee = () => {
    if (gameState.tickets < 3) {
      Alert.alert("Not Enough Tickets", "You need 3 tickets to buy a monthly slushee!");
      return;
    }
    setShowSlusheePopup(true);
  };

  // Check if player owns any Pxogulp jug (empty or filled) - for purchase button
  const ownsPxogulpJug = () => {
    return inventoryState?.mainInventory?.some(item => 
      item.id === 'pxogulp-refillable-jug' || 
      (item.id && item.id.startsWith('pxogulp-filled-'))
    ) || false;
  };

  // Check if player owns an empty Pxogulp jug - for refill button
  const ownsEmptyPxogulpJug = () => {
    return inventoryState?.mainInventory?.some(item => 
      item.id === 'pxogulp-refillable-jug'
    ) || false;
  };

  // Handle Pxogulp jug purchase
  const handlePxogulpPurchase = () => {
    console.log('Pxogulp purchase button clicked');
    console.log('Current gems:', gameState.gems);
    console.log('Owns jug:', ownsPxogulpJug());
    console.log('Inventory items:', inventoryState?.mainInventory?.map(item => item.name));
    
    if (ownsPxogulpJug()) {
      Alert.alert("Already Owned", "You already own the Pxogulp Refillable Jug!");
      return;
    }
    if (gameState.gems < 50) {
      setShowNotEnoughGems(true);
      return;
    }
    console.log('Opening purchase confirmation...');
    setShowPxogulpConfirm(true);
  };

  const confirmPxogulpPurchase = () => {
    console.log('Starting Pxogulp purchase...');
    console.log('Current gems:', gameState.gems);
    
    // Deduct gems
    setCurrency(gameState.tickets, gameState.stamina, gameState.coins, gameState.gems - 50);
    
    // Add to inventory
    const success = addItem({
      id: 'pxogulp-refillable-jug',
      name: 'Pxogulp Refillable Jug',
      price: 50,
      image: 'pxogulp-jug.png',
      category: 'special',
      description: 'A refillable jug that can be filled with your choice of 6 sodas!',
      isFilled: false
    }, 1);
    
    console.log('Add item success:', success);
    console.log('Current inventory:', inventoryState?.mainInventory?.length);
    
    if (!success) {
      console.log('Failed to add Pxogulp jug to inventory');
      Alert.alert("Error", "Failed to add item to inventory!");
      return;
    }
    
    setShowPxogulpConfirm(false);
    setShowPxogulpSuccess(true);
    setShopkeeperSaying("Enjoy your new refillable jug! 🥤");
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
        description: `Purchased from QuickStop`,
        rarity: item.rarity
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

  const handleSodaFlavorSelect = (soda: any) => {
    // Close the refill menu first
    setShowPxogulpRefillMenu(false);
    
    // Check if we can still refill (in case limit was reached between opening menu and selecting)
    if (!usePxogulpRefill()) {
      setShowDailyLimitAlert(true);
      return;
    }
    
    // Remove the empty jug first
    removeItem('pxogulp-refillable-jug', 1);
    
    // Wait a bit for the remove to complete, then add the filled jug
    setTimeout(() => {
      const filledJugId = `pxogulp-filled-${Date.now()}`;
      const success = addItem({
        id: filledJugId,
        name: `Pxogulp ${soda.name}`,
        price: 0,
        image: 'pxogulp-jug.png',
        category: 'drink' as const,
        description: `Pxogulp jug filled with ${soda.name} - +20 stamina`,
        isFilled: true,
        originalSoda: soda.name
      }, 1);
      
      if (success) {
        // Show success popup after a brief delay
        setTimeout(() => {
          setShowRefillSuccess(true);
        }, 300);
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.characterName}>MARTY</Text>
            <Text style={styles.speechText}>{shopkeeperSaying}</Text>
          </RNView>
          <Pressable onPress={() => setShopkeeperSaying(getTimeBasedSaying())}>
            <Image source={martyImage} style={styles.martyImage} />
          </Pressable>
        </RNView>


        {/* Free Options */}
        <RNView style={styles.freeOptionsCard}>
          <RNView style={styles.freeOptionsGrid}>
            <Pressable 
              style={styles.freeOptionItem}
              onPress={handleFreeCoffee}
            >
              <FontAwesome name="coffee" size={20} color="#8b5cf6" />
              <Text style={styles.freeOptionItemText}>Free Coffee</Text>
            </Pressable>
            
            <Pressable 
              style={styles.freeOptionItem}
              onPress={() => {
                if (ownsEmptyPxogulpJug()) {
                  if (canRefillPxogulp()) {
                    setShowPxogulpRefillMenu(true);
                  } else {
                    setShowDailyLimitAlert(true);
                  }
                } else if (ownsPxogulpJug()) {
                  // Player has a filled jug, show custom modal
                  setShowFilledJugAlert(true);
                } else {
                  setShowNoJugAlert(true);
                }
              }}
            >
              <FontAwesome name="tint" size={20} color="#8b5cf6" />
              <Text style={styles.freeOptionItemText}>Pxogulp Refill</Text>
            </Pressable>
            
            <Pressable 
              style={styles.freeOptionItem}
              onPress={handleMonthlySlushee}
            >
              <FontAwesome name="snowflake-o" size={20} color="#8b5cf6" />
              <Text style={styles.freeOptionItemText}>Monthly Slushee</Text>
            </Pressable>
          </RNView>
        </RNView>

        {/* Featured Item - Pxogulp Jug (only show if not owned) */}
        {!ownsPxogulpJug() && (
          <RNView style={styles.shopInventoryCard}>
            <RNView style={styles.pxogulpContainer}>
              <RNView style={styles.pxogulpImageContainer}>
                <Image source={pxogulpJugImage} style={styles.pxogulpImage} />
                <RNView style={styles.pxogulpGlow} />
              </RNView>
              <RNView style={styles.pxogulpContent}>
                <RNView style={styles.pxogulpPriceContainer}>
                  <RNView style={styles.priceBadge}>
                    <FontAwesome name="diamond" size={10} color="#06b6d4" />
                    <Text style={styles.pxogulpPrice}>50 GEMS</Text>
                  </RNView>
                  <RNView style={styles.valueBadge}>
                    <Text style={styles.valueText}>GREAT VALUE!</Text>
                  </RNView>
                </RNView>
                <Text style={styles.pxogulpTitle}>PXOGULP REFILLABLE JUG</Text>
                <Text style={styles.pxogulpSubtitle}>Premium Hydration System</Text>
                <RNView style={styles.pxogulpFeatures}>
                  <RNView style={styles.featureItem}>
                    <FontAwesome name="tint" size={12} color="#06b6d4" />
                    <Text style={styles.featureText}>6 Soda Choices</Text>
                  </RNView>
                  <RNView style={styles.featureItem}>
                    <FontAwesome name="refresh" size={12} color="#8b5cf6" />
                    <Text style={styles.featureText}>3 Refills/Day</Text>
                  </RNView>
                  <RNView style={styles.featureItem}>
                    <FontAwesome name="bolt" size={12} color="#f59e0b" />
                    <Text style={styles.featureText}>20 Stamina Each</Text>
                  </RNView>
                </RNView>
                <Pressable style={styles.pxogulpButton} onPress={handlePxogulpPurchase}>
                  <FontAwesome name="shopping-cart" size={14} color="#ffffff" />
                  <Text style={styles.pxogulpButtonText}>PURCHASE</Text>
                </Pressable>
              </RNView>
            </RNView>
          </RNView>
        )}

        {/* Shop Inventory */}
        <RNView style={styles.lotteryCard}>
          <RNView style={styles.stockHeader}>
            <Text style={styles.sectionTitle}>CURRENT STOCK</Text>
            <RNView style={styles.countdownBadge}>
              <FontAwesome name="clock-o" size={10} color="#06b6d4" />
              <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
            </RNView>
          </RNView>
          <RNView style={styles.inventoryGrid}>
            {shopInventory.map((item) => (
              <RNView key={item.id} style={styles.inventoryItem}>
                <RNView style={styles.itemImageContainer}>
                  <Image 
                    source={
                      item.image === 'glow-worms' ? glowWormsImage :
                      item.image === 'chocolate' ? chocolateImage :
                      item.image === 'astro-tarts' ? astroTartsImage :
                      item.image === 'cupnoodle' ? cupnoodleImage :
                      item.image === 'cupnoddle' ? cupnoddleImage :
                      item.image === 'hotchips' ? hotchipsImage :
                      item.image === 'neon-cola' ? neonColaImage :
                      item.image === 'glitterdog' ? glitterdogImage :
                      item.image === 'regularhotdog' ? regularHotdogImage :
                      item.image === 'quickchipz' ? quickchipzImage :
                      item.image === 'potatochomps' ? potatochompsImage :
                      item.image === 'saturnsoda' ? saturnsodaImage :
                      item.image === 'slushee' ? slusheeImage :
                      item.image === 'orbit-rings' ? orbitRingsImage :
                      item.image === 'nuggets' ? nuggetsImage :
                      item.image === 'milkshakes' ? milkshakesImage :
                      item.image === 'glowcorn' ? glowcornImage :
                      chocolateImage
                    } 
                    style={styles.itemImage} 
                  />
                  {item.stock === 0 && (
                    <RNView style={styles.outOfStockOverlay}>
                      <Text style={styles.outOfStockText}>SOLD OUT</Text>
                    </RNView>
                  )}
                </RNView>
                <RNView style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <RNView style={styles.itemPriceRow}>
                    <FontAwesome name="ticket" size={10} color="#8b5cf6" />
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </RNView>
                  <Text style={styles.itemStock}>{item.stock} left</Text>
                </RNView>
                <Pressable 
                  style={[
                    styles.buyButton, 
                    item.stock === 0 && styles.buyButtonDisabled
                  ]}
                  onPress={() => handleBuy(item)}
                  disabled={item.stock === 0}
                >
                  <Text style={[
                    styles.buyButtonText,
                    item.stock === 0 && styles.buyButtonTextDisabled
                  ]}>
                    {item.stock === 0 ? 'SOLD OUT' : 'BUY'}
                  </Text>
                </Pressable>
              </RNView>
            ))}
          </RNView>
        </RNView>

        {/* Special Imports */}
        <RNView style={styles.lotteryCard}>
          <RNView style={styles.stockHeader}>
            <Text style={styles.sectionTitle}>MARTY'S IMPORTS</Text>
          </RNView>
          <RNView style={styles.inventoryGrid}>
            {limitedItems.map((item) => (
              <RNView key={item.id} style={styles.inventoryItem}>
                <RNView style={styles.itemImageContainer}>
                  <Image 
                    source={
                      item.image === 'gumballs' ? gumballsImage :
                      item.image === 'chocodonut' ? nachoImage :
                      item.image === 'cosmicburger' ? jerkyImage :
                      item.image === 'neon-cola' ? neonColaImage :
                      item.image === 'pouchdrink' ? surfPouchImage :
                      surfPouchImage
                    } 
                    style={styles.itemImage} 
                  />
                </RNView>
                <RNView style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <RNView style={styles.itemPriceRow}>
                    <FontAwesome name="diamond" size={8} color="#4a90e2" />
                    <Text style={styles.itemPrice}>{item.price}</Text>
                  </RNView>
                </RNView>
                <Pressable 
                  style={styles.buyButton}
                  onPress={() => handleBuy(item)}
                >
                  <Text style={styles.buyButtonText}>BUY</Text>
                </Pressable>
              </RNView>
            ))}
          </RNView>
        </RNView>

        {/* Lottery Tickets */}
        <RNView style={styles.lotteryCard}>
          <RNView style={styles.stockHeader}>
            <Text style={styles.sectionTitle}>SCRATCH-OFF TICKETS</Text>
          </RNView>
          <RNView style={styles.inventoryGrid}>
            {lotteryTickets.map((lottery) => (
              <RNView key={lottery.id} style={styles.inventoryItem}>
                <RNView style={styles.itemImageContainer}>
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
                    style={styles.itemImage} 
                  />
                </RNView>
                <RNView style={styles.itemInfo}>
                  <Text style={styles.itemName}>{lottery.name}</Text>
                  <Text style={styles.itemDescription}>{lottery.description}</Text>
                  <Text style={styles.itemDescription}>Odds: {lottery.odds}</Text>
                  <RNView style={styles.itemPriceRow}>
                    <FontAwesome name="ticket" size={10} color="#8b5cf6" />
                    <Text style={styles.itemPrice}>2</Text>
                  </RNView>
                </RNView>
                <Pressable 
                  style={styles.buyButton}
                  onPress={() => handleLotteryPurchase(lottery)}
                >
                  <Text style={styles.buyButtonText}>BUY</Text>
                </Pressable>
              </RNView>
            ))}
          </RNView>
        </RNView>

        {/* Owned Pxogulp Jug (only show if owned) */}
        {ownsPxogulpJug() && (
          <RNView style={styles.shopInventoryCard}>
            <RNView style={[styles.pxogulpContainer, styles.pxogulpOwnedContainer]}>
              <RNView style={styles.pxogulpDefunctOverlay} />
              <RNView style={styles.pxogulpImageContainer}>
                <Image source={pxogulpJugImage} style={styles.pxogulpImage} />
              </RNView>
              <RNView style={styles.pxogulpContent}>
                <RNView style={styles.pxogulpPriceContainer}>
                  <RNView style={styles.priceBadge}>
                    <FontAwesome name="diamond" size={10} color="#06b6d4" />
                    <Text style={styles.pxogulpPrice}>50 GEMS</Text>
                  </RNView>
                </RNView>
                <Text style={styles.pxogulpTitle}>PXOGULP REFILLABLE JUG</Text>
                <Text style={styles.pxogulpSubtitle}>Premium Hydration System</Text>
                <RNView style={styles.pxogulpFeatures}>
                  <RNView style={styles.featureItem}>
                    <FontAwesome name="tint" size={12} color="#06b6d4" />
                    <Text style={styles.featureText}>6 Soda Choices</Text>
                  </RNView>
                  <RNView style={styles.featureItem}>
                    <FontAwesome name="refresh" size={12} color="#8b5cf6" />
                    <Text style={styles.featureText}>3 Refills/Day</Text>
                  </RNView>
                  <RNView style={styles.featureItem}>
                    <FontAwesome name="bolt" size={12} color="#f59e0b" />
                    <Text style={styles.featureText}>20 Stamina Each</Text>
                  </RNView>
                </RNView>
                <Pressable style={[styles.pxogulpButton, styles.ownedButton]} disabled>
                  <FontAwesome name="check-circle" size={14} color="#ffffff" />
                  <Text style={[styles.pxogulpButtonText, styles.ownedText]}>OWNED</Text>
                </Pressable>
              </RNView>
            </RNView>
          </RNView>
        )}

      </ScrollView>

      {/* Coffee Popup Modal */}
      {showCoffeePopup && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>FREE COFFEE!</Text>
              <RNView style={styles.freeBadge}>
                <FontAwesome name="gift" size={10} color="#8b5cf6" />
                <Text style={styles.freeBadgeText}>FREE</Text>
              </RNView>
            </RNView>
            <Image source={quickstopCoffeeImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              A complimentary cup of QuickStop coffee!
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={handleTakeCoffee}
            >
              <Text style={styles.coffeePopupButtonText}>TAKE COFFEE</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Slushee Popup Modal */}
      {showSlusheePopup && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.slusheePopup}>
            <Text style={styles.slusheeTitle}>MONTHLY SLUSHEE</Text>
            <Image source={slushee3Image} style={styles.slusheeIcon} />
            <Text style={styles.slusheeMessage}>
              A refreshing monthly slushee for 3 tickets!
            </Text>
            <Pressable 
              style={styles.slusheeButton}
              onPress={handleSlusheeConfirm}
            >
              <Text style={styles.slusheeButtonText}>BUY</Text>
            </Pressable>
            <Pressable 
              style={styles.slusheeCancelButton}
              onPress={() => setShowSlusheePopup(false)}
            >
              <Text style={styles.slusheeCancelButtonText}>CANCEL</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Slushee Confirmation Modal */}
      {showSlusheeConfirm && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.slusheePopup}>
            <Text style={styles.slusheeTitle}>CONFIRM PURCHASE</Text>
            <Image source={slushee3Image} style={styles.slusheeIcon} />
            <Text style={styles.slusheeMessage}>
              Buy Monthly Slushee for 3 tickets?
            </Text>
            <Pressable 
              style={styles.slusheeButton}
              onPress={handleSlusheePurchase}
            >
              <Text style={styles.slusheeButtonText}>BUY</Text>
            </Pressable>
            <Pressable 
              style={styles.slusheeCancelButton}
              onPress={() => setShowSlusheeConfirm(false)}
            >
              <Text style={styles.slusheeCancelButtonText}>CANCEL</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Slushee Success Modal */}
      {showSlusheeSuccess && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.slusheePopup}>
            <Text style={styles.slusheeTitle}>PURCHASE SUCCESSFUL!</Text>
            <Image source={slushee3Image} style={styles.slusheeIcon} />
            <Text style={styles.slusheeMessage}>
              Monthly Slushee was added to your inventory!
            </Text>
            <Pressable 
              style={styles.slusheeButton}
              onPress={() => setShowSlusheeSuccess(false)}
            >
              <Text style={styles.slusheeButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Coffee Cooldown Modal */}
      {showCoffeeCooldown && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>ALREADY CLAIMED</Text>
            </RNView>
            <RNView style={styles.cooldownBadge}>
              <FontAwesome name="clock-o" size={10} color="#f59e0b" />
              <Text style={styles.cooldownBadgeText}>COOLDOWN</Text>
            </RNView>
            <Image source={quickstopCoffeeImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              You've already claimed your free coffee!{'\n\n'}
              Come back in {cooldownHours} hours.
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={() => setShowCoffeeCooldown(false)}
            >
              <Text style={styles.coffeePopupButtonText}>OK</Text>
            </Pressable>
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
                  selectedItem.image === 'glow-worms' ? glowWormsImage :
                  selectedItem.image === 'chocolate' ? chocolateImage :
                  selectedItem.image === 'hotchips' ? hotchipsImage :
                  selectedItem.image === 'slushee' ? slusheeImage :
                  selectedItem.image === 'neon-cola' ? neonColaImage :
                  selectedItem.image === 'astro-tarts' ? astroTartsImage :
                  selectedItem.image === 'cupnoodle' ? cupnoodleImage :
                  selectedItem.image === 'glitterdog' ? glitterdogImage :
                  selectedItem.image === 'glitterdog' ? glitterdogImage :
                selectedItem.image === 'regularhotdog' ? regularHotdogImage :
                  selectedItem.image === 'quickchipz' ? quickchipzImage :
                  selectedItem.image === 'potatochomps' ? potatochompsImage :
                  selectedItem.image === 'saturnsoda' ? saturnsodaImage :
                  selectedItem.image === 'orbit-rings' ? orbitRingsImage :
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
            <Text style={styles.purchaseSuccessTitle}>PURCHASE SUCCESSFUL!</Text>
            <RNView style={styles.purchaseSuccessItemContainer}>
              <Image 
                source={
                  selectedItem.image === 'glow-worms' ? glowWormsImage :
                  selectedItem.image === 'chocolate' ? chocolateImage :
                  selectedItem.image === 'astro-tarts' ? astroTartsImage :
                  selectedItem.image === 'cupnoodle' ? cupnoodleImage :
                  selectedItem.image === 'cupnoddle' ? cupnoddleImage :
                  selectedItem.image === 'hotchips' ? hotchipsImage :
                  selectedItem.image === 'neon-cola' ? neonColaImage :
                  selectedItem.image === 'glitterdog' ? glitterdogImage :
                  selectedItem.image === 'regularhotdog' ? regularHotdogImage :
                  selectedItem.image === 'potatochomps' ? potatochompsImage :
                  selectedItem.image === 'saturnsoda' ? saturnsodaImage :
                  selectedItem.image === 'slushee' ? slusheeImage :
                  selectedItem.image === 'orbit-rings' ? orbitRingsImage :
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
                style={styles.purchaseSuccessItemImage} 
              />
            </RNView>
            <Text style={styles.purchaseSuccessText}>
              {selectedItem.name} was added to your inventory!
            </Text>
            <Text style={styles.purchaseSuccessSubtext}>
              Check your inventory on the home page to see it.
            </Text>
            <Pressable 
              style={styles.purchaseSuccessInventoryButton}
              onPress={() => {
                setShowPurchaseSuccess(false);
                setSelectedItem(null);
                router.push('/inventory');
              }}
            >
              <Text style={styles.purchaseSuccessInventoryButtonText}>GO TO INVENTORY</Text>
            </Pressable>
            <Pressable 
              style={styles.purchaseSuccessButton}
              onPress={() => {
                setShowPurchaseSuccess(false);
                setSelectedItem(null);
              }}
            >
              <Text style={styles.purchaseSuccessButtonText}>CONTINUE</Text>
            </Pressable>
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

      {/* Pxogulp Purchase Confirmation Modal */}
      {showPxogulpConfirm && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>CONFIRM PURCHASE</Text>
            </RNView>
            <RNView style={styles.ticketBadge}>
              <FontAwesome name="diamond" size={10} color="#06b6d4" />
              <Text style={styles.ticketBadgeText}>50 GEMS</Text>
            </RNView>
            <Image source={pxogulpJugImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              Buy Pxogulp Refillable Jug for 50 gems?{'\n'}
              This will be added to your inventory.
            </Text>
            <RNView style={styles.purchaseConfirmButtons}>
              <Pressable 
                style={[styles.coffeePopupButton, styles.cancelButton]}
                onPress={() => setShowPxogulpConfirm(false)}
              >
                <Text style={styles.coffeePopupButtonText}>CANCEL</Text>
              </Pressable>
              <Pressable 
                style={styles.coffeePopupButton}
                onPress={confirmPxogulpPurchase}
              >
                <Text style={styles.coffeePopupButtonText}>BUY FOR 50 GEMS</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
      )}

      {/* Pxogulp Purchase Success Modal */}
      {showPxogulpSuccess && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>PURCHASE SUCCESSFUL!</Text>
            </RNView>
            <Image source={pxogulpJugImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              Pxogulp Refillable Jug added to your inventory!
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={() => setShowPxogulpSuccess(false)}
            >
              <Text style={styles.coffeePopupButtonText}>CONTINUE</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Not Enough Gems Modal */}
      {showNotEnoughGems && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>NOT ENOUGH GEMS</Text>
            </RNView>
            <RNView style={styles.ticketBadge}>
              <FontAwesome name="diamond" size={10} color="#06b6d4" />
              <Text style={styles.ticketBadgeText}>NEED 50 GEMS</Text>
            </RNView>
            <FontAwesome name="diamond" size={40} color="#06b6d4" />
            <Text style={styles.coffeePopupText}>
              You need 50 gems to buy the Pxogulp Refillable Jug.{'\n'}
              You currently have {gameState.gems} gems.
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={() => setShowNotEnoughGems(false)}
            >
              <Text style={styles.coffeePopupButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Pxogulp Refill Menu Modal */}
      {showPxogulpRefillMenu && (
        <RNView style={styles.bottomSheetOverlay}>
          <Pressable 
            style={styles.bottomSheetBackdrop}
            onPress={() => setShowPxogulpRefillMenu(false)}
          />
          <Animated.View 
            style={[
              styles.pxogulpRefillMenu,
              { transform: [{ translateY: slideAnimation }] }
            ]}
          >
            <RNView style={styles.refillMenuHeader}>
              <RNView style={styles.refillMenuTitleContainer}>
                <Text style={styles.refillMenuTitle}>PXOGULP REFILL</Text>
                <Text style={styles.refillMenuCount}>
                  {3 - gameState.pxogulpRefillsToday} REFILLS LEFT TODAY
                </Text>
                <RNView style={styles.refillMenuDivider} />
              </RNView>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowPxogulpRefillMenu(false)}
              >
                <FontAwesome name="times" size={16} color="#8b5cf6" />
              </Pressable>
            </RNView>
            <Text style={styles.refillMenuSubtitle}>Choose your soda flavor:</Text>
            <RNView style={styles.sodaFlavorsGrid}>
              {sodaFlavors.map((soda) => (
                <Pressable 
                  key={soda.id} 
                  style={styles.sodaFlavorButton}
                  onPress={() => handleSodaFlavorSelect(soda)}
                >
                  <Text style={styles.sodaFlavorButtonText}>{soda.name}</Text>
                </Pressable>
              ))}
            </RNView>
          </Animated.View>
        </RNView>
      )}

      {/* Filled Jug Alert Modal */}
      {showFilledJugAlert && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>JUG ALREADY FILLED</Text>
            </RNView>
            <RNView style={styles.filledBadge}>
              <FontAwesome name="tint" size={10} color="#06b6d4" />
              <Text style={styles.filledBadgeText}>FILLED</Text>
            </RNView>
            <Image source={pxogulpJugImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              Your Pxogulp jug is already filled!{'\n'}
              Drink it first to empty it, then you can refill it again.
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={() => setShowFilledJugAlert(false)}
            >
              <Text style={styles.coffeePopupButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Daily Limit Alert Modal */}
      {showDailyLimitAlert && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.dailyLimitPopup}>
            <Text style={styles.dailyLimitTitle}>DAILY LIMIT REACHED</Text>
            <Text style={styles.dailyLimitMessage}>
              You've used all 3 Pxogulp refills for today! Come back tomorrow for more refills.
            </Text>
            <Pressable 
              style={styles.dailyLimitButton}
              onPress={() => setShowDailyLimitAlert(false)}
            >
              <Text style={styles.dailyLimitButtonText}>OK</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* Refill Success Popup */}
      {showRefillSuccess && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>JUG REFILLED!</Text>
            </RNView>
            <RNView style={styles.successBadge}>
              <FontAwesome name="check-circle" size={10} color="#22c55e" />
              <Text style={styles.successBadgeText}>SUCCESS</Text>
            </RNView>
            <Image source={pxogulpJugImage} style={styles.coffeePopupImage} />
            <Text style={styles.coffeePopupText}>
              You filled your jug with soda!{'\n'}+20 stamina was added to your Pxogulp jug
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={() => setShowRefillSuccess(false)}
            >
              <Text style={styles.coffeePopupButtonText}>AWESOME!</Text>
            </Pressable>
            <Pressable 
              style={styles.coffeePopupCancelButton}
              onPress={() => {
                setShowRefillSuccess(false);
                router.navigate('/(tabs)/inventory');
              }}
            >
              <Text style={styles.coffeePopupCancelButtonText}>GO TO INVENTORY</Text>
            </Pressable>
          </RNView>
        </RNView>
      )}

      {/* No Jug Alert Modal */}
      {showNoJugAlert && (
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.coffeePopup}>
            <RNView style={styles.popupHeader}>
              <Text style={styles.popupTitle}>PXOGULP REQUIRED</Text>
            </RNView>
            <FontAwesome name="tint" size={40} color="#06b6d4" />
            <Text style={styles.coffeePopupText}>
              You need to purchase the Pxogulp Refillable Jug first!{'\n'}
              Visit the shop section to buy one for 50 gems.
            </Text>
            <Pressable 
              style={styles.coffeePopupButton}
              onPress={() => setShowNoJugAlert(false)}
            >
              <Text style={styles.coffeePopupButtonText}>OK</Text>
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
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Header
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 4,
    height: 40,
  },
  // NPC Container
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 0, // Reset margin for better spacing
    padding: 16,
  },
  freeOptionsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  shopInventoryCard: {
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  importsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  lotteryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 12,
    paddingLeft: 20,
    paddingBottom: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  // Section Titles
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 0,
  },
  // Badges
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  lotteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  lotteryBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  // Featured Item
  featuredCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  // Free Options
  freeOptionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  // Inventory Grid
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
  },
  inventoryItem: {
    width: '48%',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
  },
  itemImageContainer: {
    position: 'relative',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#ffffff',
    textAlign: 'center',
  },
  itemInfo: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    paddingHorizontal: 4,
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 14,
  },
  itemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 12,
  },
  // Featured item layout styles
  featuredLayout: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImageSection: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  featuredTextSection: {
    width: '70%',
    paddingLeft: 6,
  },
  featuredTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 14,
  },
  featuredDesc: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 6,
    lineHeight: 12,
  },
  featuredPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  priceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    gap: 6,
  },
  itemPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  itemStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
  },
  rareStock: {
    color: '#dc2626', // Red for rare items
    fontWeight: 'bold',
  },
  uncommonStock: {
    color: '#2563eb', // Blue for uncommon items
    fontWeight: 'bold',
  },
  rarityLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  commonRarity: {
    color: '#64748b', // Gray for common
  },
  uncommonRarity: {
    color: '#2563eb', // Blue for uncommon
  },
  rareRarity: {
    color: '#dc2626', // Red for rare
  },
  buyButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buyButtonDisabled: {
    backgroundColor: '#9ca3af',
    borderColor: '#6b7280',
    shadowOpacity: 0.1,
    shadowColor: '#6b7280',
  },
  buyButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buyButtonTextDisabled: {
    color: '#ffffff',
    opacity: 0.7,
  },
  freeOptionItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 8,
    // Subtle vending machine button effect
    borderTopWidth: 2,
    borderTopColor: 'rgba(139, 92, 246, 0.3)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(139, 92, 246, 0.3)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(139, 92, 246, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  freeOptionItemText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  backButton: {
    position: 'absolute',
    top: 10,
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
    fontSize: 14, // Larger (was 12)
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
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    letterSpacing: 1,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 12,
    marginTop: 0,
    marginBottom: -15, // Much less space between header and Marty
  },
  speechBubble: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    flex: 1, // Take up remaining space in container
    maxWidth: 250, // Narrower max width (was 300)
    marginLeft: 8, // Now on the left side
  },
  characterName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Larger (was 10)
    color: '#06b6d4',
    marginBottom: 4,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Larger (was 10)
    color: '#000000',
    textAlign: 'left',
  },
  martyImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
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
    fontSize: 10, // Larger (was 8)
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 1,
    height: 14, // Adjusted for larger text
    lineHeight: 12, // Adjusted for larger text
  },
  chipsImage: {
    width: 32,
    height: 32,
    marginBottom: 4,
    resizeMode: 'contain',
  },
  chipsName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9, // Larger (was 7)
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: -2,
    height: 16, // Adjusted for larger text
    lineHeight: 14, // Adjusted for larger text
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
    fontSize: 8, // Larger (was 6)
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
    fontSize: 12, // Larger (was 10)
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
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    maxWidth: 60,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingBottom: 4,
    paddingTop: 4,
  },
  stockTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 20, // Larger (was 16)
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  neonTitle: {
    color: '#ff1493', // Hot pink for neon effect
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  countdownText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: 'bold',
    marginLeft: 4,
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
    fontSize: 9, // Larger (was 7)
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    height: 16, // Adjusted for larger text
    lineHeight: 14, // Adjusted for larger text
  },
  lotteryDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8, // Larger (was 6)
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  lotteryOdds: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8, // Larger (was 6)
    color: '#f59e0b',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  lotteryPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 4,
  },
  lotteryTicketPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  lotteryButton: {
    backgroundColor: '#8b5cf6',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotteryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10, // Slightly smaller for "BUY" (was 11)
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
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
    borderColor: '#ff69b4', // Pink border
    padding: 12,
    shadowColor: '#ff1493', // Hot pink shadow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15, // Larger glow radius
    elevation: 8, // Higher elevation for better glow
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
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: 320,
    marginTop: -80,
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  popupTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  freeBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  ticketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  ticketBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  confirmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  confirmBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  successBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#22c55e',
    fontWeight: 'bold',
  },
  filledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  filledBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  limitBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  limitInfo: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  limitInfoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Daily Limit Popup
  dailyLimitPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 300,
    minWidth: 280,
  },
  dailyLimitTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#f59e0b',
    marginBottom: 16,
    textAlign: 'center',
  },
  dailyLimitMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  dailyLimitButton: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d97706',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dailyLimitButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Slushee Popup (matching daily limit format)
  slusheePopup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: 320,
  },
  slusheeIcon: {
    width: 50,
    height: 50,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  slusheeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  slusheeMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  slusheeButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
    minWidth: 120,
  },
  slusheeButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slusheeCancelButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  slusheeCancelButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Small Buy Button
  smallBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  smallBuyButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cooldownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  cooldownBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  // Featured Item Styles
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featuredDetails: {
    flex: 1,
    alignItems: 'flex-start',
  },
  featuredName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featuredDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 12,
  },
  featuredPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  featuredBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredBuyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  disabledText: {
    color: '#ffffff',
  },
  purchaseConfirmButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
  },
  coffeePopupImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  coffeePopupText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
    fontWeight: '400',
  },
  coffeePopupButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7c3aed',
    marginBottom: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coffeePopupButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.2,
    textAlign: 'center',
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
    width: 28,
    height: 28,
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
    marginBottom: 20,
  },
  purchaseSuccessButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  purchaseSuccessButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  purchaseSuccessInventoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  purchaseSuccessInventoryButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  purchaseSuccessItemContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  purchaseSuccessItemImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
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
    marginTop: 8, // Much closer to lottery (was 16)
    marginBottom: 16,
    width: '95%',
    alignSelf: 'center',
  },
  featuredBorder: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16, // More compact (was 20)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  featuredHeader: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  // Pxogulp Jug Styles
  pxogulpContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#06b6d4',
    padding: 16,
    marginHorizontal: 0,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pxogulpOwnedContainer: {
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: 'rgba(139, 92, 246, 0.3)',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  pxogulpDefunctOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    zIndex: 10,
  },
  pxogulpImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  pxogulpImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    zIndex: 2,
  },
  pxogulpGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
  },
  pxogulpContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  pxogulpTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 14,
    textAlign: 'left',
  },
  pxogulpSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  pxogulpFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
  },
  featureText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#06b6d4',
    fontWeight: '600',
  },
  pxogulpPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  pxogulpPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  valueBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  valueText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#22c55e',
    fontWeight: 'bold',
  },
  pxogulpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06b6d4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#0891b2',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    minWidth: 120,
  },
  pxogulpButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  ownedButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderColor: 'rgba(139, 92, 246, 0.5)',
    shadowColor: 'rgba(139, 92, 246, 0.3)',
    width: '100%',
    minWidth: 120,
    opacity: 0.6,
  },
  ownedText: {
    color: '#ffffff',
  },
  // Pxogulp Refill Menu Styles
  bottomSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pxogulpRefillMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  refillMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
  },
  refillMenuTitleContainer: {
    alignItems: 'center',
  },
  refillMenuTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  refillMenuCount: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  refillMenuDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    marginTop: 6,
    borderRadius: 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  refillMenuSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  sodaFlavorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  sodaFlavorButton: {
    width: '48%',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: 8,
  },
  sodaFlavorButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
