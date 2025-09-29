import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import VolleyballGame from '@/components/VolleyballGame';

const communityPoolMainImage = require('@/assets/images/community-pool-main.png');
const pooldolphinImage = require('@/assets/images/pooldolphin.png');

const { width } = Dimensions.get('window');

// Pool Volleyball NPC messages
const POOL_VOLLEYBALL_GREETINGS = [
  "Ready to play? Let's hit some volleyball!",
  "Welcome to the court! Time for some visual volleyball action!",
  "Hey there! Ready for some animated volleyball fun?",
  "Welcome! Let's see those volleyball skills in action!",
  "Ready to spike some balls? Visual volleyball awaits!",
  "Welcome to the volleyball area! Let's play with style!",
  "Hey! Ready to return some animated serves?",
  "Welcome to the court! Time for visual volleyball!",
  "Ready to play some animated volleyball? Let's go!",
  "Welcome! Let's have some visual volleyball fun!"
];

export default function PoolVolleyballScreen() {
  const [npcMessage, setNpcMessage] = useState('');
  const [showNpcMessage, setShowNpcMessage] = useState(false);

  // Show NPC greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomGreeting = POOL_VOLLEYBALL_GREETINGS[Math.floor(Math.random() * POOL_VOLLEYBALL_GREETINGS.length)];
      setNpcMessage(randomGreeting);
      setShowNpcMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/community-pool')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>POOL VOLLEYBALL</Text>
        </RNView>

        {/* Pool Banner */}
        <RNView style={styles.bannerContainer}>
          <Image source={communityPoolMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Pool Dolphin NPC */}
        {showNpcMessage && (
          <RNView style={styles.npcContainer}>
            <RNView style={styles.speechBubble}>
              <Text style={styles.npcName}>Echo</Text>
              <Text style={styles.npcMessage}>{npcMessage}</Text>
            </RNView>
            <Image source={pooldolphinImage} style={styles.npcImage} />
          </RNView>
        )}

        {/* Game Description */}
        <Text style={styles.description}>
          Welcome to the Visual Pool Volleyball Court! Watch your pet return the ball 
          in this animated mini-game. Complete 10 successful returns to win a match 
          and earn stamina rewards!
        </Text>

        {/* Visual Game Component */}
        <RNView style={styles.gameContainer}>
          <VolleyballGame />
        </RNView>

        {/* Game Rules */}
        <RNView style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>VOLLEYBALL RULES</Text>
          <Text style={styles.ruleItem}>• Complete 10 successful returns to win a match</Text>
          <Text style={styles.ruleItem}>• Tap "RETURN!" when ball is in your court</Text>
          <Text style={styles.ruleItem}>• Win a match to earn +5 stamina</Text>
          <Text style={styles.ruleItem}>• Maximum 3 matches per day</Text>
          <Text style={styles.ruleItem}>• Daily limit resets at midnight</Text>
          <Text style={styles.ruleItem}>• Watch your pet bob and return!</Text>
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
    paddingTop: 80,
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
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
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
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#14b8a6',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  npcImage: {
    width: 61,
    height: 61,
    marginLeft: 16,
    imageRendering: 'pixelated' as any,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    padding: 12,
    marginTop: 8,
  },
  npcName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  npcMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 16,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  gameContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    padding: 10,
  },
  rulesContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    alignSelf: 'center',
  },
  rulesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  ruleItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 16,
  },
});