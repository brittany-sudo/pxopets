import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Image, View as RNView, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import { useSimpleGame } from '@/store/SimpleGameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JazzyTitle from '@/components/JazzyTitle';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import SimpleCurrencyDisplay from '@/components/SimpleCurrencyDisplay';
import FoodInventory from '@/components/FoodInventory';
import SimpleDeveloperPanel from '@/components/SimpleDeveloperPanel';

export default function HomeScreen() {
  const { hydrated, state, addCoins } = useGame();
  const { state: simpleState, addTickets: simpleAddTickets, addStamina, addCoins: simpleAddCoins } = useSimpleGame();
  const [isFlashing, setIsFlashing] = useState(true);
  const [tickerPosition, setTickerPosition] = useState(0);
  const [countdownFlashing, setCountdownFlashing] = useState(true);
  const [showFoodInventory, setShowFoodInventory] = useState(false);
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);
  
  // Animation values using useRef to persist across renders
  const ticker1TranslateX = useRef(new Animated.Value(0)).current;
  const ticker2TranslateX = useRef(new Animated.Value(0)).current;

  // Flash animation for the gem icon
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Flash animation for the countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownFlashing(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Stock ticker animations - seamless continuous tickers
  useEffect(() => {
    // Ticker 1 - moves left to right (slower) - seamless loop
    const runTicker1 = () => {
      ticker1TranslateX.setValue(0); // Start at normal position
      Animated.loop(
        Animated.timing(ticker1TranslateX, {
          toValue: -800, // Move exactly one full content width
          duration: 40000, // 40 seconds for full scroll (very slow)
          useNativeDriver: true,
        }),
        { iterations: -1 } // Infinite loop
      ).start();
    };
    
    // Ticker 2 - moves right to left (faster) - seamless loop
    const runTicker2 = () => {
      ticker2TranslateX.setValue(0); // Start at normal position
      Animated.loop(
        Animated.timing(ticker2TranslateX, {
          toValue: -800, // Move in same direction as ticker 1 for now to test
          duration: 25000, // Slightly different speed for variety
          useNativeDriver: true,
        }),
        { iterations: -1 } // Infinite loop
      ).start();
    };
    
    runTicker1();
    runTicker2();
  }, []);


  if (!hydrated) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Developer Panel Button */}
      <Pressable 
        style={styles.developerButton}
        onPress={() => setShowDeveloperPanel(true)}
      >
        <Text style={styles.developerButtonText}>🛠️ Dev Panel</Text>
      </Pressable>

      {/* Stock Tickers - Two continuous tickers moving in opposite directions */}
      <View style={styles.tickerContainer}>
        {/* Ticker 1 - Moving left to right (slower) - Seamless */}
        <Animated.View 
          style={[
            styles.tickerContent,
            { transform: [{ translateX: ticker1TranslateX }] }
          ]}
        >
          <Text style={styles.tickerText}>
            <Text style={styles.tickerUp}>CARROT ▲15%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerDown}>WHEAT ▼8%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>CORN ▲3%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>TOMATO ▲22%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerDown}>LETTUCE ▼5%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>POTATO ▲12%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>ONION ▲7%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerDown}>BEAN ▼2%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            {/* Duplicate for seamless loop */}
            <Text style={styles.tickerUp}>CARROT ▲15%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerDown}>WHEAT ▼8%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>CORN ▲3%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>TOMATO ▲22%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerDown}>LETTUCE ▼5%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>POTATO ▲12%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>ONION ▲7%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerDown}>BEAN ▼2%</Text>
          </Text>
        </Animated.View>
        
        {/* Ticker 2 - Moving right to left (faster) - Seamless */}
        <Animated.View 
          style={[
            styles.tickerContent,
            styles.ticker2Content,
            { transform: [{ translateX: ticker2TranslateX }] }
          ]}
        >
          <Text style={styles.tickerText}>
            <Text style={styles.tickerUp}>APPLE ▲18%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>BERRY ▲25%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>MUSHROOM ▲9%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>HERB ▲14%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>SEED ▲6%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>FERTILIZER ▲11%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>WATER ▲4%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>SUN ▲19%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            {/* Duplicate for seamless loop */}
            <Text style={styles.tickerUp}>APPLE ▲18%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>BERRY ▲25%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>MUSHROOM ▲9%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>HERB ▲14%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>SEED ▲6%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>FERTILIZER ▲11%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>WATER ▲4%</Text>
            <Text style={styles.tickerSeparator}> • </Text>
            <Text style={styles.tickerUp}>SUN ▲19%</Text>
          </Text>
        </Animated.View>
      </View>
              
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Daily News Section */}
        <RNView style={styles.dailyNewsContainer}>
          <Image
            source={require('@/assets/images/daily-news.png')}
            style={styles.dailyNewsImage}
            resizeMode="contain"
          />
          <Text style={styles.dateText}>January 1, 1991</Text>
          
          <Text style={styles.newsTitle}>What's New</Text>
          <Text style={styles.newsSubtitle}>Fresh from the fields and straight to your pets!</Text>
          
          <Text style={styles.newsFeature}>✨ New Features</Text>
          <Text style={styles.newsItem}>• Pet Companions can now help forage while you farm.</Text>
          <Text style={styles.newsItem}>• Daily Guild Challenges added — complete tasks together for bonus rewards.</Text>
          
          <Text style={styles.newsFeature}>🐾 New Pets</Text>
          <Text style={styles.newsItem}>• Flufftail Rabbit – boosts crop growth speed.</Text>
          <Text style={styles.newsItem}>• Pebbleback Turtle – increases mining finds.</Text>
          
          <Text style={styles.newsFeature}>🌱 New Items</Text>
          <Text style={styles.newsItem}>• Golden Watering Can – gives a small chance to double harvest.</Text>
          <Text style={styles.newsItem}>• Rainbow Carrot – rare food that gives pets an instant level-up.</Text>
          
          <Text style={styles.newsFeature}>🎉 Upcoming Event</Text>
          <Text style={styles.newsItem}>The Autumn Harvest Festival begins this weekend! Stock up on apples, you'll need them…</Text>
        </RNView>
        
        {/* Contest Section - Large */}
        <RNView style={styles.featuredSection}>
          <FontAwesome name="trophy" size={32} color="#f59e0b" style={styles.featuredIcon} />
          <Text style={styles.featuredText}>Contest: Best Pet Name — entries open</Text>
        </RNView>

        {/* Rare Finds - Large */}
        <RNView style={styles.featuredSection}>
          <FontAwesome name="diamond" size={32} color="#8b5cf6" style={styles.featuredIcon} />
          <Text style={styles.featuredText}>Rare Finds: Golden Watering Can spotted in shop!</Text>
        </RNView>

        {/* Community Events - Large */}
        <RNView style={styles.featuredSection}>
          <FontAwesome name="calendar" size={32} color="#0ea5e9" style={styles.featuredIcon} />
          <Text style={styles.featuredText}>Event: Pixel Pet Parade this weekend!</Text>
        </RNView>

        {/* Lil Guy Image */}
        <RNView style={styles.lilGuyContainer}>
          <Image
            source={require('@/assets/images/lil-guy.png')}
            style={styles.lilGuyImage}
          />
        </RNView>

        {/* Today's Riddle Section */}
        <RNView style={styles.riddleSection}>
          <RNView style={styles.riddleTitleContainer}>
            <FontAwesome name="question-circle" size={12} color="#8b5cf6" style={styles.riddleIcon} />
            <Text style={styles.riddleTitle}>DAILY RIDDLE</Text>
            <FontAwesome name="question-circle" size={12} color="#8b5cf6" style={styles.riddleIcon} />
          </RNView>
          <Text style={styles.riddleQuestion}>What has a head, a tail, but no body?</Text>
          <RNView style={styles.answerContainer}>
            <RNView style={styles.dropdownContainer}>
              <Pressable style={styles.dropdownButton}>
                <Text style={styles.dropdownText}>Select answer...</Text>
                <FontAwesome name="chevron-down" size={12} color="#8b5cf6" />
              </Pressable>
            </RNView>
          </RNView>
        </RNView>

        {/* Lottery Section - Bottom (Daily Quests moved to Home page) */}
        <RNView style={styles.lotterySection}>
          <FontAwesome name="ticket" size={16} color="#ff1493" style={styles.lotteryIcon} />
          <Text style={styles.lotteryText}>Today's Lottery: 12 • 19 • 04 • 07</Text>
        </RNView>

      </ScrollView>
      
      {/* Developer Panel Modal */}
      <SimpleDeveloperPanel 
        visible={showDeveloperPanel}
        onClose={() => setShowDeveloperPanel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  developerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 60,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d97706',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  developerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  tickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 42, // Even taller for bigger text (was 32)
    backgroundColor: '#1a0033',
    overflow: 'hidden',
    zIndex: 1000,
  },
  tickerContent: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: 20, // Taller for bigger text (was 15)
    top: 0, // First ticker at top
    width: 1600, // Much wider for seamless looping
  },
  ticker2Content: {
    top: 21, // Adjusted for bigger ticker height (20 + 1 = 21)
  },
  tickerText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14, // Much bigger (was 10)
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  tickerUp: {
    color: '#10b981',
  },
  tickerDown: {
    color: '#ef4444',
  },
  tickerSeparator: {
    color: '#f59e0b',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 5, // Much smaller top padding to bring content closer
    flexGrow: 1,
    overflow: 'visible',
  },
  premiumBanner: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 4,
    borderRadius: 12,
    overflow: 'visible',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    position: 'relative',
    marginTop: 8,
    zIndex: 5,
  },
  bannerGradient: {
    backgroundColor: '#ffffff',
    padding: 2,
    position: 'relative',
    zIndex: 10,
    borderRadius: 10,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1e1b4b',
    borderRadius: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIconContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerImage: {
    width: 55,
    height: 55,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
    letterSpacing: 1,
  },
  bannerSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13, // Reduced from 14
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 2,
    letterSpacing: 0.3, // Added letter spacing
  },
  bannerReward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  bannerRewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11, // Reduced from 12
    color: '#f59e0b',
    fontWeight: '500',
    marginRight: 4,
    letterSpacing: 0.3, // Added letter spacing
  },
  bannerRight: {
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  currentPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 4,
  },
  bannerOriginalPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 4,
  },
  bannerTimer: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '500',
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dailyNewsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 20,
    marginBottom: 16,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  dailyNewsImage: {
    width: '60%',
    height: 80,
    alignSelf: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'PressStart2P_400Regular',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '400',
  },
  newsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '400',
  },
  newsSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  newsFeature: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '400',
  },
  newsItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
    marginBottom: 4,
  },
  whatsNewTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14, // Bigger (was 14)
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 6, // More space below (was 4)
    marginTop: 2, // Added top margin for spacing
  },
  whatsNewSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Bigger (was 10)
    color: '#0f172a',
    marginBottom: 12,
    fontWeight: '400',
    letterSpacing: 0.3, // Added letter spacing
  },
  whatsNewFeature: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10, // Bigger (was 12)
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginTop: 10, // More space above (was 8)
    marginBottom: 6, // More space below (was 4)
  },
  whatsNewItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11, // Bigger (was 9)
    color: '#0f172a',
    marginLeft: 8,
    marginBottom: 2,
    lineHeight: 15, // Adjusted for bigger text (was 13)
    fontWeight: '400',
    letterSpacing: 0.3, // Added letter spacing
  },
  featuredSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredIcon: {
    marginRight: 8,
    flexShrink: 0,
  },
  featuredText: {
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
    color: '#0f172a',
    flex: 1,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  lilGuyContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 4,
    paddingVertical: 2,
  },
  lilGuyImage: {
    width: 80,
    height: 80,
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
  },
  riddleSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  riddleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  riddleIcon: {
    marginHorizontal: 4,
  },
  riddleTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    textAlign: 'center',
  },
  riddleQuestion: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  answerContainer: {
    width: '100%',
    marginBottom: 8,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
  },
  lotterySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lotteryIcon: {
    marginRight: 8,
    transform: [{ rotate: '-90deg' }],
  },
  lotteryText: {
    fontSize: 13,
    fontFamily: 'Silkscreen_400Regular',
    color: '#0f172a',
    textAlign: 'center',
  },
});
