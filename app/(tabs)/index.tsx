import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Image, View as RNView, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JazzyTitle from '@/components/JazzyTitle';

export default function HomeScreen() {
  const { hydrated, state, addCoins } = useGame();
  const [isFlashing, setIsFlashing] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [tickerPosition, setTickerPosition] = useState(0);
  const [countdownFlashing, setCountdownFlashing] = useState(true);
  
  // Animation values using useRef to persist across renders
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationTranslateY = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const tickerTranslateX = useRef(new Animated.Value(0)).current;

  // Stock ticker data with color coding
  const stockData = [
    "CARROT ↑15% • WHEAT ↓8% • CORN ↑3% • TOMATO ↑22% • LETTUCE ↓5% • POTATO ↑12% • ONION ↑7% • BEAN ↓2% • APPLE ↑18% • BERRY ↑25% • MUSHROOM ↑9% • HERB ↑14% • SEED ↑6% • FERTILIZER ↑11% • WATER ↑4% • SUN ↑19% • RAIN ↓3% • WIND ↑8% • SOIL ↑13% • COMPOST ↑16%"
  ];

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

  // Stock ticker animation
  useEffect(() => {
    const runTicker = () => {
      tickerTranslateX.setValue(0);
      Animated.timing(tickerTranslateX, {
        toValue: -1000, // Adjust based on content width
        duration: 25000, // 25 seconds for full scroll (slower)
        useNativeDriver: true,
      }).start(() => {
        // Restart immediately when animation completes
        runTicker();
      });
    };
    
    runTicker();
  }, []);


  const handleDailyReward = () => {
    if (!rewardClaimed) {
      // Button press feedback
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      addCoins(5); // Give 5 stamina
      setRewardClaimed(true);
      setIsFlashing(false);
      setShowCelebration(true);
      
      // Spring celebration animation - more dramatic
      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1.2, // Start bigger for more impact
          tension: 150,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationTranslateY, {
          toValue: -50, // Move further up
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out and reset after 1.5 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(celebrationOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationTranslateY, {
            toValue: -80, // Continue moving up while fading
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationScale, {
            toValue: 0.8, // Shrink slightly while fading
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowCelebration(false);
          // Reset animation values
          celebrationScale.setValue(0);
          celebrationOpacity.setValue(0);
          celebrationTranslateY.setValue(0);
        });
      }, 1200);
    }
  };

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
              {/* Stock Ticker */}
              <View style={styles.tickerContainer}>
                <Animated.View 
                  style={[
                    styles.tickerContent,
                    { transform: [{ translateX: tickerTranslateX }] }
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
                    <Text style={styles.tickerDown}>RAIN ▼3%</Text>
                    <Text style={styles.tickerSeparator}> • </Text>
                    <Text style={styles.tickerUp}>WIND ▲8%</Text>
                    <Text style={styles.tickerSeparator}> • </Text>
                    <Text style={styles.tickerUp}>SOIL ▲13%</Text>
                    <Text style={styles.tickerSeparator}> • </Text>
                    <Text style={styles.tickerUp}>COMPOST ▲16%</Text>
                  </Text>
                </Animated.View>
              </View>
              
              <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Premium Shop Banner */}
                <RNView style={styles.premiumBanner}>
                  <RNView style={styles.bannerGradient}>
                    <RNView style={styles.bannerContent}>
            <RNView style={styles.bannerLeft}>
              <RNView style={styles.bannerIconContainer}>
                <Image 
                  source={require('@/assets/images/milkshakes.png')} 
                  style={styles.bannerImage}
                  resizeMode="contain"
                />
              </RNView>
                        <RNView style={styles.bannerText}>
                          <Text style={styles.bannerTitle}>PREMIUM OFFER</Text>
                          <Text style={styles.bannerSubtitle}>Cosmic Milkshakes</Text>
                          <RNView style={styles.bannerReward}>
                            <Text style={styles.bannerRewardText}>200</Text>
                            <FontAwesome name="bolt" size={12} color="#f59e0b" />
                          </RNView>
                        </RNView>
                      </RNView>
                      <RNView style={styles.bannerRight}>
                        <RNView style={styles.priceContainer}>
                          <RNView style={styles.currentPriceRow}>
                            <Text style={styles.bannerPrice}>50</Text>
                            <FontAwesome name="ticket" size={12} color="#0ea5e9" />
                          </RNView>
                          <RNView style={styles.originalPriceRow}>
                            <Text style={styles.bannerOriginalPrice}>75</Text>
                            <FontAwesome name="ticket" size={10} color="#94a3b8" />
                          </RNView>
                        </RNView>
                        <Text style={[
                          styles.bannerTimer,
                          { opacity: countdownFlashing ? 1 : 0.3 }
                        ]}>2h 15m left</Text>
                      </RNView>
                    </RNView>
                  </RNView>
                </RNView>

                <BorderedBox>
                  <JazzyTitle style={styles.newsHeader}>DAILY GAZETTE</JazzyTitle>
                  <RNView style={styles.weatherBox}>
                    <FontAwesome name="sun-o" size={14} color="#f59e0b" style={styles.weatherIcon} />
                    <Text style={styles.weatherText}>72°</Text>
                  </RNView>
                  
                  {/* Daily Gazette Image */}
                  <RNView style={styles.imageContainer}>
                    <Image
                      source={require('@/assets/images/daily-gazette.png')}
                      style={styles.dailyGazetteImage}
                    />
                  </RNView>
                  
                  <Text style={styles.dateText}>January 1, 1991</Text>

                  {/* What's New Section */}
                  <RNView style={styles.whatsNewSection}>
                    <Text style={styles.whatsNewTitle}>📰 What's New</Text>
                    <Text style={styles.whatsNewSubtitle}>Fresh from the fields and straight to your pets!</Text>
                    
                    <Text style={styles.whatsNewFeature}>✨ New Features</Text>
                    <Text style={styles.whatsNewItem}>• Pet Companions can now help forage while you farm.</Text>
                    <Text style={styles.whatsNewItem}>• Daily Guild Challenges added — complete tasks together for bonus rewards.</Text>
                    
                    <Text style={styles.whatsNewFeature}>🐾 New Pets</Text>
                    <Text style={styles.whatsNewItem}>• Flufftail Rabbit – boosts crop growth speed.</Text>
                    <Text style={styles.whatsNewItem}>• Pebbleback Turtle – increases mining finds.</Text>
                    
                    <Text style={styles.whatsNewFeature}>🌱 New Items</Text>
                    <Text style={styles.whatsNewItem}>• Golden Watering Can – gives a small chance to double harvest.</Text>
                    <Text style={styles.whatsNewItem}>• Rainbow Carrot – rare food that gives pets an instant level-up.</Text>
                    
                    <Text style={styles.whatsNewFeature}>🎉 Upcoming Event</Text>
                    <Text style={styles.whatsNewItem}>The Autumn Harvest Festival begins this weekend! Stock up on apples, you'll need them…</Text>
                  </RNView>
                  
                  {/* Contest Section - Large */}
          <RNView style={styles.featuredSection}>
            <FontAwesome name="trophy" size={32} color="#f59e0b" style={styles.featuredIcon} />
            <Text style={styles.featuredText}>Contest: Best Pet Name — entries open</Text>
          </RNView>


                  {/* Rare Finds - Large */}
                  <RNView style={styles.featuredSection}>
                    <FontAwesome name="gem" size={32} color="#8b5cf6" style={styles.featuredIcon} />
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

                  {/* Lottery Section - Bottom */}
                  <RNView style={styles.lotterySection}>
                    <FontAwesome name="ticket" size={16} color="#ff1493" style={styles.lotteryIcon} />
                    <Text style={styles.lotteryText}>Today's Lottery: 12 • 19 • 04 • 07</Text>
                  </RNView>

                </BorderedBox>

                {/* Daily Quests Section */}
                <BorderedBox>
                  <Text style={styles.questTitle}>DAILY QUESTS</Text>
                  
                  {/* Quest 1 - Daily Login */}
                  <RNView style={styles.questItem}>
                    <FontAwesome name="calendar" size={16} color="#8b5cf6" style={styles.questIcon} />
                    <RNView style={styles.questContent}>
                      <Text style={styles.questName}>Daily Login Streak</Text>
                      <Text style={styles.questDescription}>Log in for 3 consecutive days</Text>
                      <RNView style={styles.questProgress}>
                        <Text style={styles.questProgressText}>Progress: 2/3 days</Text>
                        <RNView style={styles.progressBar}>
                          <RNView style={[styles.progressFill, { width: '67%' }]} />
                        </RNView>
                      </RNView>
                    </RNView>
                    <Text style={styles.questReward}>+10 ⚡</Text>
                  </RNView>

                  {/* Quest 2 - Pet Care */}
                  <RNView style={styles.questItem}>
                    <FontAwesome name="heart" size={16} color="#ef4444" style={styles.questIcon} />
                    <RNView style={styles.questContent}>
                      <Text style={styles.questName}>Pet Care Master</Text>
                      <Text style={styles.questDescription}>Give your pet 5 treats today</Text>
                      <RNView style={styles.questProgress}>
                        <Text style={styles.questProgressText}>Progress: 3/5 treats</Text>
                        <RNView style={styles.progressBar}>
                          <RNView style={[styles.progressFill, { width: '60%' }]} />
                        </RNView>
                      </RNView>
                    </RNView>
                    <Text style={styles.questReward}>+15 ⚡</Text>
                  </RNView>

                  {/* Quest 3 - Weekly Challenge */}
                  <RNView style={styles.questItem}>
                    <FontAwesome name="trophy" size={16} color="#f59e0b" style={styles.questIcon} />
                    <RNView style={styles.questContent}>
                      <Text style={styles.questName}>Weekly Explorer</Text>
                      <Text style={styles.questDescription}>Visit 5 different areas this week</Text>
                      <RNView style={styles.questProgress}>
                        <Text style={styles.questProgressText}>Progress: 2/5 areas</Text>
                        <RNView style={styles.progressBar}>
                          <RNView style={[styles.progressFill, { width: '40%' }]} />
                        </RNView>
                      </RNView>
                    </RNView>
                    <Text style={styles.questReward}>+25 ⚡</Text>
                  </RNView>

                  {/* Daily Reward Section - At Bottom of Quests */}
                  <RNView style={styles.dailyRewardContainer}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                      <Pressable onPress={handleDailyReward} disabled={rewardClaimed}>
                        <RNView style={[styles.dailyRewardSection, rewardClaimed && styles.claimedSection]}>
                          <FontAwesome 
                            name="bolt" 
                            size={32} 
                            color={rewardClaimed ? "#64748b" : (isFlashing ? "#8b5cf6" : "#f59e0b")} 
                            style={styles.flashingGem}
                          />
                          <Text style={[styles.dailyRewardText, rewardClaimed && styles.claimedText]}>
                            {rewardClaimed ? "Daily Reward: Claimed!" : "Daily Reward: Tap to claim!"}
                          </Text>
                        </RNView>
                      </Pressable>
                    </Animated.View>
                    
                    {/* Celebration Effect */}
                    {showCelebration && (
                      <Animated.View 
                        style={[
                          styles.celebrationContainer,
                          {
                            transform: [
                              { scale: celebrationScale },
                              { translateY: celebrationTranslateY }
                            ],
                            opacity: celebrationOpacity,
                          }
                        ]}
                      >
                        <Animated.View style={[styles.gradientBackground, { transform: [{ scale: celebrationScale }] }]}>
                          <RNView style={styles.celebrationContent}>
                            <Text style={styles.celebrationText}>5</Text>
                            <FontAwesome name="bolt" size={16} color="#f59e0b" />
                          </RNView>
                        </Animated.View>
                      </Animated.View>
                    )}
                  </RNView>
                </BorderedBox>
              </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
        },
        tickerContainer: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 30,
          backgroundColor: '#1a0033', // Extremely deep/dark purple
          borderBottomWidth: 2,
          borderBottomColor: '#0ea5e9',
          overflow: 'hidden',
          zIndex: 1000,
        },
        tickerContent: {
          flexDirection: 'row',
          alignItems: 'center',
          height: '100%',
        },
        tickerText: {
          fontFamily: 'Silkscreen_400Regular',
          fontSize: 10,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        },
        tickerUp: {
          color: '#10b981', // Bright green for up
        },
        tickerDown: {
          color: '#ef4444', // Bright red for down
        },
        tickerSeparator: {
          color: '#f59e0b', // Amber for separators
        },
          scrollContent: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 20,
            paddingTop: 35, // Reduced gap between ticker and Daily Gazette
            flexGrow: 1,
            overflow: 'visible', // Ensure animations aren't clipped
          },
          headerRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 4,
            marginBottom: 8,
            paddingHorizontal: 8,
            position: 'relative',
          },
          newsHeader: {
            fontFamily: 'PressStart2P_400Regular',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#0f172a', // Premium deep slate
            textAlign: 'center',
            flex: 1,
            marginTop: 8,
            marginBottom: 8,
            paddingTop: 4,
            paddingBottom: 4,
          },
          weatherBox: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 1,
            borderColor: '#f59e0b',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
            position: 'absolute',
            right: 16,
            top: 20,
            width: 60,
            zIndex: 1000,
          },
          weatherIcon: {
            marginRight: 4,
          },
          weatherText: {
            fontSize: 12,
            fontFamily: 'Silkscreen_400Regular',
            color: '#0f172a',
            fontWeight: 'bold',
          },
          dateText: {
            fontSize: 12,
            fontFamily: 'Silkscreen_400Regular',
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: 8,
          },
          imageContainer: {
            width: '90%',
            height: 300,
            marginTop: 2,
            marginBottom: 16,
            alignSelf: 'center',
            borderWidth: 2,
            borderColor: '#0ea5e9',
            borderRadius: 8,
            overflow: 'hidden',
            justifyContent: 'flex-end',
            alignItems: 'center',
          },
          dailyGazetteImage: {
            width: '100%',
            height: '120%',
            imageRendering: 'pixelated' as any,
            resizeMode: 'cover',
          },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
          featuredSection: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            paddingHorizontal: 8,
            paddingVertical: 8,
            backgroundColor: 'rgba(14, 165, 233, 0.05)', // Subtle teal background for featured items
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(14, 165, 233, 0.2)',
          },
          dailyRewardContainer: {
            marginTop: 16,
            padding: 12,
            backgroundColor: 'rgba(139, 92, 246, 0.1)', // More distinguished purple background
            borderRadius: 8,
            borderWidth: 2,
            borderColor: 'rgba(139, 92, 246, 0.3)',
            borderStyle: 'dashed', // Dashed border for extra distinction
          },
          dailyRewardSection: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 12,
            backgroundColor: 'rgba(139, 92, 246, 0.15)', // Slightly more opaque purple
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(139, 92, 246, 0.4)',
    justifyContent: 'center',
  },
          claimedSection: {
            backgroundColor: 'rgba(100, 116, 139, 0.05)', // Muted background when claimed
            borderColor: 'rgba(100, 116, 139, 0.2)',
          },
          flashingGem: {
            marginRight: 8,
          },
          newsItem: {
            fontSize: 13,
            fontFamily: 'Silkscreen_400Regular',
            color: '#0f172a', // Premium deep slate
            flex: 1,
            marginLeft: 8,
          },
          lotterySection: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
            marginBottom: 12,
            paddingHorizontal: 8,
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
          featuredText: {
            fontSize: 14,
            fontFamily: 'Silkscreen_400Regular',
            color: '#0f172a', // Premium deep slate
            flex: 1,
            marginLeft: 4,
            fontWeight: 'bold',
          },
          dailyRewardText: {
            fontSize: 14,
            fontFamily: 'Silkscreen_400Regular',
            color: '#0f172a', // Premium deep slate
            fontWeight: 'bold',
            textAlign: 'center',
          },
          claimedText: {
            color: '#64748b', // Muted color when claimed
          },
          celebrationContainer: {
            position: 'absolute',
            top: -10,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          },
          gradientBackground: {
            backgroundColor: '#ec4899',
            borderRadius: 6,
            paddingHorizontal: 4,
            paddingVertical: 1,
            shadowColor: '#ec4899',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            elevation: 8,
            borderWidth: 2,
            borderColor: '#f472b6',
          },
          celebrationContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          },
          celebrationText: {
            fontFamily: 'PressStart2P_400Regular',
            fontSize: 6,
            color: '#ffffff',
            textAlign: 'center',
            fontWeight: 'bold',
          },
          // Icon styles - varied sizes for bulletin board feel
          featuredIcon: {
            marginRight: 8,
            flexShrink: 0,
          },
          mediumIcon: {
            width: 32,
            height: 32,
            imageRendering: 'pixelated' as any,
          },
          smallIcon: {
            width: 20,
            height: 20,
            imageRendering: 'pixelated' as any,
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
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(139, 92, 246, 0.2)',
            padding: 12,
            marginBottom: 12,
            alignItems: 'center',
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
          answerLabel: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            color: '#0f172a',
            marginBottom: 4,
            textAlign: 'center',
          },
          dropdownContainer: {
            width: '100%',
          },
          dropdownButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#8b5cf6',
            borderRadius: 4,
            paddingHorizontal: 8,
            paddingVertical: 6,
          },
          dropdownText: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            color: '#0f172a',
          },
          rewardText: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            color: '#8b5cf6',
            textAlign: 'center',
    fontWeight: 'bold',
  },
          whatsNewSection: {
            backgroundColor: 'rgba(14, 165, 233, 0.05)',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(14, 165, 233, 0.2)',
            padding: 12,
            marginBottom: 16,
            width: '95%',
            alignSelf: 'center',
          },
          whatsNewTitle: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 4,
          },
          whatsNewSubtitle: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 11,
            color: '#0f172a',
            marginBottom: 12,
            fontStyle: 'italic',
          },
          whatsNewFeature: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#0f172a',
            marginTop: 8,
            marginBottom: 4,
          },
          whatsNewItem: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            color: '#0f172a',
            marginLeft: 8,
            marginBottom: 2,
            lineHeight: 14,
          },
          questTitle: {
            fontFamily: 'PressStart2P_400Regular',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 12,
            textAlign: 'center',
          },
          questItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(14, 165, 233, 0.05)',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: 'rgba(14, 165, 233, 0.2)',
            padding: 12,
            marginBottom: 8,
            width: '95%',
            alignSelf: 'center',
          },
          questIcon: {
            marginRight: 12,
            flexShrink: 0,
          },
          questContent: {
            flex: 1,
            marginRight: 8,
          },
          questName: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 12,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 2,
          },
          questDescription: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            color: '#0f172a',
            marginBottom: 6,
          },
          questProgress: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          },
          questProgressText: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 9,
            color: '#0f172a',
            flexShrink: 0,
          },
          progressBar: {
            flex: 1,
            height: 6,
            backgroundColor: 'rgba(14, 165, 233, 0.2)',
            borderRadius: 3,
            overflow: 'hidden',
          },
          progressFill: {
            height: '100%',
            backgroundColor: '#0ea5e9',
            borderRadius: 3,
          },
          questReward: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            fontWeight: 'bold',
            color: '#8b5cf6',
            textAlign: 'right',
            flexShrink: 0,
          },
          // Premium Banner Styles
          premiumBanner: {
            marginBottom: 4,
            borderRadius: 12,
            overflow: 'visible', // Keep visible for animation
            borderWidth: 2,
            borderColor: '#8b5cf6',
            position: 'relative',
            width: '95%',
            alignSelf: 'center',
            marginTop: 8, // Reduced margin
            marginBottom: 8, // Reduced margin
            zIndex: 5, // Ensure banner is above other content
          },
          bannerGradient: {
            backgroundColor: '#ffffff',
            padding: 2,
            position: 'relative',
            zIndex: 10, // Higher z-index to appear above borders
            borderRadius: 10,
          },
          bannerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            backgroundColor: '#1e1b4b', // Dark purple background
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
            borderRadius: 30,
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          },
          bannerImage: {
            width: 50,
            height: 50,
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
            fontSize: 14,
            color: '#ffffff', // White text for dark background
            fontWeight: 'bold',
            marginBottom: 2,
          },
          bannerDescription: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 10,
            color: '#64748b',
            fontStyle: 'italic',
          },
          bannerReward: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2,
          },
          bannerRewardText: {
            fontFamily: 'Silkscreen_400Regular',
            fontSize: 12,
            color: '#f59e0b',
            fontWeight: 'bold',
            marginRight: 4,
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
            color: '#ffffff', // White text for dark background
            fontWeight: 'bold',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for contrast
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
          },
});
