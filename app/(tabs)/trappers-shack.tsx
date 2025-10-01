import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View, Image, Pressable, Alert, Animated, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useGame } from '@/store/GameStore';
import { useInventory } from '@/store/InventoryStore';

// Import images
const trappersShackImage = require('@/assets/images/loomers-wharf-main.png');
const oldSaltBgImage = require('@/assets/images/oldsaltbg.png');
const trapperIconImage = require('@/assets/images/trappericon.png');
const oldSaltImage = require('@/assets/images/oldsalt.png');
const docksquidImage = require('@/assets/images/docksquid.png');
const sardineImage = require('@/assets/images/sardine.png');
const brassCoinImage = require('@/assets/images/brasscoin.png');
const grumpyCrabImage = require('@/assets/images/grumpycrab.png');
const oldBottleImage = require('@/assets/images/oldbottle.png');
const trapShrimpImage = require('@/assets/images/trap-shrimp.png');
const trapSardineImage = require('@/assets/images/trap-sardine.png');
const driftwoodNecklaceImage = require('@/assets/images/driftwoodnecklace.png');
const sirenScaleImage = require('@/assets/images/sirenscale.png');
const clumpOfSeaweedImage = require('@/assets/images/clumpofseaweed.png');
const microPearlImage = require('@/assets/images/micropearl.png');
const mysteryBaitImage = require('@/assets/images/mysterybait.png');
const messageInBottleImage = require('@/assets/images/messageinabottle.png');
const fishbonesImage = require('@/assets/images/fishbones.png');
const fishingNetImage = require('@/assets/images/lil-anchor.png');
const lobsterTrapImage = require('@/assets/images/lil-anchor.png');
const fishingRodImage = require('@/assets/images/lil-anchor.png');

export default function TrappersShackScreen() {
  const { tickets, gems, stamina, addTickets, addGems, addStamina } = useGame();
  const { addItem } = useInventory();
  const [selectedTrap, setSelectedTrap] = useState<string | null>(null);
  const [trapResults, setTrapResults] = useState<any[]>([]);
  const [isTrapping, setIsTrapping] = useState(false);
  const [oldSaltAdvice, setOldSaltAdvice] = useState<string>('');
  const [apprenticeLevel, setApprenticeLevel] = useState(1);
  const [dailyTraps, setDailyTraps] = useState(3);
  
  // Game state
  const [gamePhase, setGamePhase] = useState<'bait' | 'waiting' | 'tugging' | 'caught'>('bait');
  const [selectedBait, setSelectedBait] = useState<string | null>(null);
  const [currentCatch, setCurrentCatch] = useState<any>(null);
  const [tugCount, setTugCount] = useState(0);
  const [maxTugs, setMaxTugs] = useState(3);
  
  // Animations
  const tugAnimation = useRef(new Animated.Value(0)).current;
  const lineAnimation = useRef(new Animated.Value(0)).current;
  const bobberAnimation = useRef(new Animated.Value(0)).current;

  const oldSaltAdviceList = [
    "The lobsters speak in their shells when the tide's just right...",
    "A rusty nail brings luck, but only if it's from a shipwreck.",
    "The sea remembers everything, even what you've forgotten.",
    "When the wind blows from the east, the fish come to feast.",
    "A trap without bait is like a heart without hope.",
    "The old ones say the tide turns on a whisper...",
    "Sometimes the best catch is what you don't expect.",
    "The sea gives and takes, but mostly it just waits.",
    "A fisherman's luck changes with the moon's face.",
    "The deepest secrets lie in the shallowest waters."
  ];

  const baitTypes = [
    {
      id: 'sardine',
      name: 'Sardine',
      emoji: '🐟',
      image: sardineImage,
      description: 'Common bait, attracts basic catches',
      rarity: 'common',
      cost: 1
    },
    {
      id: 'shrimp',
      name: 'Shrimp',
      emoji: '🦐',
      image: trapShrimpImage,
      description: 'Premium bait, better chances for rare finds',
      rarity: 'uncommon',
      cost: 3
    },
    {
      id: 'mystery',
      name: 'Mystery Bait',
      emoji: '🔮',
      image: mysteryBaitImage,
      description: 'Old Salt\'s secret recipe - who knows what it attracts?',
      rarity: 'rare',
      cost: 5
    }
  ];

  const catchData = {
    common: [
      { name: 'Soggy Boot', emoji: '👢', image: 'soggyboot', value: 2, description: 'A waterlogged boot, probably from a shipwreck.' },
      { name: 'Clump of Seaweed', emoji: '🌿', image: 'clumpofseaweed', value: 1, description: 'Just some slimy seaweed. Not very exciting.' },
      { name: 'Grumpy Crab', emoji: '🦀', image: 'grumpycrab', value: 3, description: 'A crab that looks particularly annoyed to be caught.' },
      { name: 'Old Soda Bottle', emoji: '🍼', image: 'oldbottle', value: 2, description: 'A rusted soda bottle with mysterious contents.' },
      { name: 'Fishbones', emoji: '🐟', image: 'fishbones', value: 1, description: 'Just the bones of some long-dead fish.' }
    ],
    uncommon: [
      { name: 'Clam Chowder Bowl', emoji: '🍲', image: 'clamchowder', value: 12, description: 'A sturdy bowl, perfect for Old Salt\'s famous chowder.' },
      { name: 'Old Lantern', emoji: '🏮', image: 'oldlantern', value: 15, description: 'A weathered lantern that still glows with mysterious light.' },
      { name: 'Driftwood Necklace', emoji: '🗿', image: 'driftwoodnecklace', value: 10, description: 'A small totem carved by the sea itself.' },
      { name: 'Brass Coin', emoji: '🪙', image: 'brasscoin', value: 8, description: 'An old coin with strange markings, still gleaming.' },
      { name: 'Message in a Bottle', emoji: '📜', image: 'messageinabottle', value: 18, description: 'A sealed bottle with a mysterious message inside.' },
      { name: 'Antique Wine Cask', emoji: '🍷', image: 'winecask', value: 14, description: 'A small cask that smells of ancient wine and sea salt.' }
    ],
    rare: [
      { name: 'Fog Charm', emoji: '🔮', image: 'fogcharm', value: 45, description: 'A mystical charm that seems to pulse with foggy energy.' },
      { name: 'Fog Child\'s Sailboat', emoji: '⛵', image: 'fogsailboat', value: 50, description: 'A tiny sailboat that glides through the air like fog.' },
      { name: 'Siren Scale', emoji: '🧜‍♀️', image: 'sirenscale', value: 55, description: 'A shimmering scale from the depths... it sings softly.' },
      { name: 'Singing Conch', emoji: '🐚', image: 'singingconch', value: 48, description: 'A conch shell that whispers ocean songs when held to your ear.' },
      { name: 'The Oil of Every Pearl', emoji: '💎', image: 'micropearl', value: 60, description: 'The legendary pearl necklace - Old Salt\'s eyes widen in amazement.' }
    ]
  };

  const trapTypes = [
    {
      id: 'lobster-trap',
      name: 'Lobster Trap',
      cost: 0,
      stamina: 15,
      description: 'Old Salt\'s weathered wooden trap',
      image: lobsterTrapImage,
      rewards: ['lobster', 'crab', 'seaweed', 'barnacles', 'ghostly_catch'],
      oldSaltComment: "The lobsters know this trap... they respect it."
    },
    {
      id: 'fishing-net',
      name: 'Drift Net',
      cost: 0,
      stamina: 12,
      description: 'Patched net with decades of stories',
      image: fishingNetImage,
      rewards: ['fish', 'shrimp', 'squid', 'octopus', 'mysterious_artifact'],
      oldSaltComment: "This net has seen more fish than you've seen days."
    },
    {
      id: 'fishing-rod',
      name: 'Bamboo Pole',
      cost: 0,
      stamina: 8,
      description: 'Simple rod that never fails',
      image: fishingRodImage,
      rewards: ['bass', 'trout', 'perch', 'nothing', 'lore_fragment'],
      oldSaltComment: "Sometimes the simplest tools catch the biggest secrets."
    }
  ];

  // Game functions
  const selectBait = (baitId: string) => {
    // Check daily limit first
    if (dailyTraps <= 0) {
      Alert.alert('No More Traps Today', 'Old Salt says you\'ve done enough for one day. Come back tomorrow, apprentice.');
      return;
    }

    // Check bait cost
    const bait = baitTypes.find(b => b.id === baitId);
    if (bait && tickets < bait.cost) {
      Alert.alert('Not Enough Tickets', `You need ${bait.cost} tickets to use ${bait.name} bait.`);
      return;
    }

    // Deduct ticket cost
    if (bait) {
      addTickets(-bait.cost);
    }

    setSelectedBait(baitId);
    setGamePhase('waiting');
    setTugCount(0);
    
    // Start waiting animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobberAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bobberAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Random wait time before tugging starts (2-5 seconds)
    const waitTime = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setGamePhase('tugging');
      startTugging();
    }, waitTime);
  };

  const startTugging = () => {
    // Random tug intervals
    const tugInterval = setInterval(() => {
      if (tugCount < maxTugs) {
        // Animate tug
        Animated.sequence([
          Animated.timing(tugAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(tugAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        
        setTugCount(prev => prev + 1);
      } else {
        clearInterval(tugInterval);
        // Auto-catch if no response
        setTimeout(() => {
          catchFish();
        }, 2000);
      }
    }, Math.random() * 2000 + 1000);
  };

  const handleTug = () => {
    if (gamePhase === 'tugging') {
      catchFish();
    }
  };

  const catchFish = () => {
    // Only proceed if we still have traps available
    if (dailyTraps <= 0) {
      Alert.alert('No More Traps Today', 'Old Salt says you\'ve done enough for one day. Come back tomorrow, apprentice.');
      return;
    }

    setGamePhase('caught');
    
    // Determine catch based on bait
    const bait = baitTypes.find(b => b.id === selectedBait);
    let catchRarity = 'common';
    
    if (bait) {
      const rand = Math.random();
      if (bait.rarity === 'rare' && rand < 0.3) catchRarity = 'rare';
      else if (bait.rarity === 'uncommon' && rand < 0.4) catchRarity = 'uncommon';
      else if (bait.rarity === 'rare' && rand < 0.6) catchRarity = 'uncommon';
    }
    
    const possibleCatches = catchData[catchRarity as keyof typeof catchData];
    const caught = possibleCatches[Math.floor(Math.random() * possibleCatches.length)];
    
    setCurrentCatch(caught);
    addTickets(caught.value);
    
    // Add caught item to inventory - simplified system
    const inventoryItem = {
      id: `fishing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: caught.name,
      price: caught.value,
      image: caught.image || 'chocolate',
      category: 'fishing' as const,
      description: caught.description || 'A mysterious item from the depths',
      quantity: 1
    };
    
    addItem(inventoryItem, 1);
    
    // Add to results
    const newResult = {
      id: Date.now(),
      bait: bait?.name || 'Unknown',
      catch: caught,
      timestamp: new Date(),
      ticketsEarned: caught.value,
      oldSaltComment: "Well done, lad! The sea has blessed you today."
    };
    
    setTrapResults(prev => [newResult, ...prev.slice(0, 9)]);
    
    // Decrement daily traps and ensure it doesn't go below 0
    setDailyTraps(prev => Math.max(0, prev - 1));
  };

  const resetGame = () => {
    // Check if we still have traps available
    if (dailyTraps <= 0) {
      Alert.alert('Game Over for Today', 'That\'s all for today! Thanks for fishing with Old Salt. Come back tomorrow for more adventures on the harbor.');
      return;
    }
    
    setGamePhase('bait');
    setSelectedBait(null);
    setCurrentCatch(null);
    setTugCount(0);
    tugAnimation.setValue(0);
    lineAnimation.setValue(0);
    bobberAnimation.setValue(0);
  };

  const startTrapping = (trapType: any) => {
    if (dailyTraps <= 0) {
      Alert.alert('No More Traps Today', 'Old Salt says you\'ve done enough for one day. Come back tomorrow, apprentice.');
      return;
    }

    if (stamina < trapType.stamina) {
      Alert.alert('Too Tired', 'Old Salt shakes his head. "You\'re too tired, lad. Rest up before you try again."');
      return;
    }

    // Get Old Salt's cryptic advice
    const randomAdvice = oldSaltAdviceList[Math.floor(Math.random() * oldSaltAdviceList.length)];
    setOldSaltAdvice(randomAdvice);

    setSelectedTrap(trapType.id);
    setIsTrapping(true);
    addStamina(-trapType.stamina);
    setDailyTraps(prev => prev - 1);

    // Simulate trapping time with Old Salt's commentary
    setTimeout(() => {
      const randomReward = trapType.rewards[Math.floor(Math.random() * trapType.rewards.length)];
      const ticketsEarned = Math.floor(Math.random() * 3) + 1;
      
      const newResult = {
        id: Date.now(),
        trap: trapType.name,
        reward: randomReward,
        timestamp: new Date(),
        ticketsEarned: ticketsEarned,
        oldSaltComment: trapType.oldSaltComment
      };
      
      setTrapResults(prev => [newResult, ...prev.slice(0, 9)]); // Keep last 10 results
      setIsTrapping(false);
      setSelectedTrap(null);
      addTickets(ticketsEarned);
      setOldSaltAdvice(''); // Clear advice after use
    }, 3000);
  };

  const getRewardEmoji = (reward: string) => {
    const emojiMap: { [key: string]: string } = {
      'lobster': '🦞',
      'crab': '🦀',
      'fish': '🐟',
      'bass': '🐟',
      'trout': '🐟',
      'perch': '🐟',
      'shrimp': '🦐',
      'squid': '🦑',
      'octopus': '🐙',
      'seaweed': '🌿',
      'barnacles': '🐚',
      'ghostly_catch': '👻',
      'mysterious_artifact': '🔮',
      'lore_fragment': '📜',
      'nothing': '❌'
    };
    return emojiMap[reward] || '🐟';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/foggy-harbor')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.locationTitle}>TRAPPER'S SHACK</Text>
        </View>


        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            At the very edge of the Wharf, where the planks are warped and the tide sometimes slaps at the door, stands Old Salt's stubborn shack. Inside, traps are stacked in haphazard piles, their ropes coiled like sleeping snakes. The air reeks of bait fish and wet rope, but also woodsmoke and old pipe tobacco.
          </Text>
        </View>

        {/* Old Salt's Advice */}
        {oldSaltAdvice && (
          <View style={styles.adviceContainer}>
            <Text style={styles.adviceTitle}>Old Salt mutters:</Text>
            <Text style={styles.adviceText}>"{oldSaltAdvice}"</Text>
          </View>
        )}

        {/* Daily Traps Counter */}
        <View style={styles.dailyCounter}>
          <Text style={styles.trappingTitle}>TRAPPING WITH OLD SALT</Text>
          <Text style={styles.counterText}>Traps Remaining Today: {dailyTraps}</Text>
        </View>

        {/* Old Salt NPC - Free Standing */}
        <View style={styles.oldSaltContainer}>
          <Image source={oldSaltImage} style={styles.oldSaltImage} resizeMode="contain" />
          <View style={styles.speechBubble}>
            <Text style={styles.characterName}>OLD SALT</Text>
            <Text style={styles.speechText}>
              "You're my apprentice now, lad. I'll let you run a few traps each day. Listen to the sea... she'll tell you her secrets if you know how to listen."
            </Text>
          </View>
        </View>

        {/* Fishing Game */}
        <View style={styles.gameSection}>
          
          {/* Always-visible background */}
          <View style={styles.gameContainer}>
            <Image source={oldSaltBgImage} style={styles.gameBackground} resizeMode="cover" />
            
            {/* Bait Selection Overlay */}
            {gamePhase === 'bait' && (
              <View style={styles.baitSelectionOverlay}>
                <Text style={styles.gameInstruction}>Choose your bait, apprentice:</Text>
                <View style={styles.baitGrid}>
                  {baitTypes.map((bait) => (
                    <Pressable
                      key={bait.id}
                      style={[
                        styles.baitCard,
                        selectedBait === bait.id && styles.selectedBait,
                        (dailyTraps <= 0 || tickets < bait.cost) && styles.disabledBait
                      ]}
                      onPress={() => selectBait(bait.id)}
                      disabled={dailyTraps <= 0 || tickets < bait.cost}
                    >
                      {bait.image ? (
                        <Image 
                          source={bait.image} 
                          style={bait.id === 'mystery' ? styles.mysteryBaitImage : styles.baitImage} 
                          resizeMode="contain" 
                        />
                      ) : (
                        <Text style={styles.baitEmoji}>{bait.emoji}</Text>
                      )}
                      <Text style={styles.baitName}>{bait.name}</Text>
                      <Text style={styles.baitDescription}>{bait.description}</Text>
                      <View style={styles.baitCost}>
                        <FontAwesome name="ticket" size={14} color="#60a5fa" />
                        <Text style={styles.baitCostText}>{bait.cost}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Waiting Overlay */}
            {gamePhase === 'waiting' && (
              <View style={styles.waitingOverlay}>
                <Text style={styles.gameInstruction}>Lowering bait into the depths...</Text>
                <Animated.View 
                  style={[
                    styles.bobber,
                    {
                      transform: [{
                        translateY: bobberAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10]
                        })
                      }]
                    }
                  ]}
                >
                  <Image source={trapperIconImage} style={styles.bobberImage} resizeMode="contain" />
                </Animated.View>
                <Text style={styles.waitingText}>Waiting for a bite...</Text>
              </View>
            )}

            {/* Tugging Overlay */}
            {gamePhase === 'tugging' && (
              <Pressable style={styles.tuggingOverlay} onPress={handleTug}>
                <Text style={styles.gameInstruction}>TUG NOW! The line is moving!</Text>
                <Animated.View 
                  style={[
                    styles.tugIndicator,
                    {
                      transform: [{
                        scale: tugAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.2]
                        })
                      }]
                    }
                  ]}
                >
                  <Animated.View 
                    style={[
                      styles.tugContainer,
                      {
                        transform: [
                          {
                            translateX: tugAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, 8]
                            })
                          },
                          {
                            translateY: tugAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -4]
                            })
                          },
                          {
                            rotate: tugAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '5deg']
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <Image source={trapperIconImage} style={styles.tugImage} resizeMode="contain" />
                  </Animated.View>
                  <Text style={styles.tugText}>TUG!</Text>
                </Animated.View>
                <Text style={styles.tugHint}>Tap to catch!</Text>
              </Pressable>
            )}

            {/* Caught Overlay */}
            {gamePhase === 'caught' && currentCatch && (
              <View style={styles.caughtOverlay}>
                <Text style={styles.gameInstruction}>You caught something!</Text>
                <View style={styles.catchDisplay}>
                  {currentCatch.image ? (
                    <Image 
                      source={
                        currentCatch.image === 'grumpycrab' ? require('@/assets/images/grumpycrab.png') :
                        currentCatch.image === 'oldbottle' ? require('@/assets/images/oldbottle.png') :
                        currentCatch.image === 'clumpofseaweed' ? require('@/assets/images/clumpofseaweed.png') :
                        currentCatch.image === 'fishbones' ? require('@/assets/images/fishbones.png') :
                        currentCatch.image === 'driftwoodnecklace' ? require('@/assets/images/driftwoodnecklace.png') :
                        currentCatch.image === 'brasscoin' ? require('@/assets/images/brasscoin.png') :
                        currentCatch.image === 'messageinabottle' ? require('@/assets/images/messageinabottle.png') :
                        currentCatch.image === 'sirenscale' ? require('@/assets/images/sirenscale.png') :
                        currentCatch.image === 'micropearl' ? require('@/assets/images/micropearl.png') :
                        currentCatch.image === 'soggyboot' ? require('@/assets/images/soggyboot.png') :
                        currentCatch.image === 'clamchowder' ? require('@/assets/images/clamchowder.png') :
                        currentCatch.image === 'fogsailboat' ? require('@/assets/images/fogchildssailboat.png') :
                        currentCatch.image === 'winecask' ? require('@/assets/images/lil-wine-casket.png') :
                        currentCatch.image === 'oldlantern' ? require('@/assets/images/oldlantern.png') :
                        currentCatch.image === 'singingconch' ? require('@/assets/images/singingconch.png') :
                        require('@/assets/images/chocolate.png')
                      } 
                      style={styles.catchImage} 
                      resizeMode="contain" 
                    />
                  ) : (
                    <Text style={styles.catchEmoji}>{currentCatch.emoji}</Text>
                  )}
                  <Text style={styles.catchName}>{currentCatch.name}</Text>
                  <Text style={styles.catchDescription}>{currentCatch.description}</Text>
                  <Text style={styles.catchValue}>+{currentCatch.value} tickets</Text>
                </View>
                {dailyTraps > 0 ? (
                  <Pressable style={styles.resetButton} onPress={resetGame}>
                    <Text style={styles.resetButtonText}>Try Again</Text>
                  </Pressable>
                ) : (
                  <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverText}>That's all for today!</Text>
                    <Text style={styles.gameOverSubtext}>Thanks for fishing with Old Salt</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Catch Log - Always Visible */}
        <View style={styles.catchLogSection}>
          {/* Docksquid NPC - Top right */}
          <View style={styles.docksquidContainer}>
            <View style={styles.docksquidSpeechBubble}>
              <Text style={styles.docksquidCharacterName}>DOCKSQUID</Text>
              <Text style={styles.docksquidSpeechText}>"Blub blub!"</Text>
            </View>
            <Image source={docksquidImage} style={styles.docksquidImage} resizeMode="contain" />
          </View>
          
          {/* Catch Log Title - Above the blue border */}
          <Text style={styles.catchLogTitle}>CATCH LOG</Text>
          
          {/* Catch Log Container */}
          <View style={styles.catchLogContainer}>
              {trapResults.length > 0 ? (
                <View style={styles.catchLogList}>
                  {trapResults.slice(0, 6).map((result, index) => (
                    <View key={result.id} style={styles.catchLogItem}>
                      <View style={styles.catchLogIcon}>
                        {result.catch && result.catch.image ? (
                          <Image 
                            source={
                              result.catch.image === 'grumpycrab' ? require('@/assets/images/grumpycrab.png') :
                              result.catch.image === 'oldbottle' ? require('@/assets/images/oldbottle.png') :
                              result.catch.image === 'clumpofseaweed' ? require('@/assets/images/clumpofseaweed.png') :
                              result.catch.image === 'fishbones' ? require('@/assets/images/fishbones.png') :
                              result.catch.image === 'driftwoodnecklace' ? require('@/assets/images/driftwoodnecklace.png') :
                              result.catch.image === 'brasscoin' ? require('@/assets/images/brasscoin.png') :
                              result.catch.image === 'messageinabottle' ? require('@/assets/images/messageinabottle.png') :
                              result.catch.image === 'sirenscale' ? require('@/assets/images/sirenscale.png') :
                              result.catch.image === 'micropearl' ? require('@/assets/images/micropearl.png') :
                              result.catch.image === 'soggyboot' ? require('@/assets/images/soggyboot.png') :
                              result.catch.image === 'clamchowder' ? require('@/assets/images/clamchowder.png') :
                              result.catch.image === 'fogsailboat' ? require('@/assets/images/fogchildssailboat.png') :
                              result.catch.image === 'winecask' ? require('@/assets/images/lil-wine-casket.png') :
                              result.catch.image === 'oldlantern' ? require('@/assets/images/oldlantern.png') :
                              result.catch.image === 'singingconch' ? require('@/assets/images/singingconch.png') :
                              require('@/assets/images/chocolate.png')
                            } 
                            style={styles.catchLogImage} 
                            resizeMode="contain" 
                          />
                        ) : (
                          <Text style={styles.catchLogEmoji}>{result.catch ? result.catch.emoji : getRewardEmoji(result.reward)}</Text>
                        )}
                      </View>
                      <View style={styles.catchLogInfo}>
                        <Text style={styles.catchLogName}>{result.catch ? result.catch.name : (result.bait || result.trap)}</Text>
                        <Text style={styles.catchLogBait}>{result.catch ? result.bait : 'Unknown'}</Text>
                      </View>
                      <View style={styles.catchLogValue}>
                        <FontAwesome name="ticket" size={10} color="#0ea5e9" />
                        <Text style={styles.catchLogTickets}>+{result.ticketsEarned}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyLog}>
                  <Text style={styles.emptyLogText}>No catches yet today</Text>
                  <Text style={styles.emptyLogSubtext}>Start fishing to fill your log!</Text>
                </View>
            )}
          </View>
        </View>

        {/* Trapping Status */}
        {isTrapping && (
          <View style={styles.trappingStatus}>
            <Text style={styles.trappingText}>Setting trap...</Text>
            <Text style={styles.trappingSubtext}>Please wait while we check your catch</Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
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
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 0,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 6,
  },
  headerRow: {
    position: 'absolute',
    top: 20,
    left: 80,
    right: 80,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  bannerContainer: {
    width: '100%',
    height: 250,
    borderWidth: 3,
    borderColor: '#0ea5e9',
    borderRadius: 4,
    marginTop: 60,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: 0,
  },
  welcomeContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  welcomeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0ea5e9',
    textAlign: 'center',
    lineHeight: 12,
    fontStyle: 'italic',
  },
  oldSaltContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  oldSaltImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  speechBubble: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    maxWidth: 300,
    marginRight: 8,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0ea5e9',
    marginBottom: 4,
    textAlign: 'left',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    lineHeight: 14,
  },
  adviceContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  adviceTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 4,
  },
  adviceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0ea5e9',
    fontStyle: 'italic',
    lineHeight: 12,
  },
  dailyCounter: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 6,
    padding: 2,
    marginHorizontal: 20,
    marginBottom: 4,
    alignItems: 'center',
  },
  trappingTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  counterText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  gameSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  gameContainer: {
    position: 'relative',
    height: 420,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
  },
  gameInstruction: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  baitSelection: {
    alignItems: 'center',
  },
  baitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  baitCard: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  selectedBait: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  disabledBait: {
    opacity: 0.4,
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  baitEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  baitImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  mysteryBaitImage: {
    width: 20,
    height: 20,
    marginBottom: 8,
    marginTop: 10,
  },
  baitName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '600',
  },
  baitDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 12,
    marginBottom: 8,
  },
  baitCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  baitCostText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#60a5fa',
    fontWeight: '600',
  },
  gameBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  baitSelectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  waitingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 40,
  },
  tuggingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 40,
  },
  caughtOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 40,
  },
  waitingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  bobber: {
    marginTop: 20,
  },
  bobberText: {
    fontSize: 32,
  },
  bobberImage: {
    width: 96,
    height: 96,
  },
  tugIndicator: {
    marginVertical: 20,
  },
  tugText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  tugContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tugImage: {
    width: 96,
    height: 96,
  },
  tugHint: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
  catchDisplay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  catchEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  catchImage: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  catchName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  catchDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 14,
    fontWeight: '400',
  },
  catchValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  resetButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  gameOverContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gameOverText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  gameOverSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '400',
  },
  catchLogSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: -8,
    marginBottom: 20,
  },
  catchLogTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'left',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: -4,
  },
  catchLogContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
  },
  catchLogList: {
    gap: 8,
  },
  catchLogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  catchLogIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catchLogImage: {
    width: 24,
    height: 24,
  },
  catchLogEmoji: {
    fontSize: 16,
  },
  catchLogInfo: {
    flex: 1,
  },
  catchLogName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 2,
  },
  catchLogBait: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#64748b',
  },
  catchLogValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  catchLogTickets: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  emptyLog: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyLogText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#64748b',
    marginBottom: 4,
  },
  emptyLogSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#94a3b8',
  },
  docksquidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: -4,
    maxWidth: 180,
  },
  docksquidImage: {
    width: 60,
    height: 60,
    marginLeft: 8,
  },
  docksquidSpeechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    maxWidth: 120,
    flex: 1,
  },
  docksquidCharacterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 2,
    textAlign: 'center',
  },
  docksquidSpeechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 14,
  },
  trapSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  trapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  trapCard: {
    width: '30%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  selectedTrap: {
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    borderColor: '#0ea5e9',
  },
  disabledTrap: {
    opacity: 0.5,
  },
  trapImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  trapName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  trapDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 10,
  },
  trapCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
  },
  trappingStatus: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  trappingText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 4,
  },
  trappingSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
  },
  resultsSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultsList: {
    gap: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  resultEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  resultImage: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTrap: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 2,
  },
  resultReward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    marginBottom: 2,
  },
  resultComment: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#0ea5e9',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  resultTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#94a3b8',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0ea5e9',
    marginLeft: 4,
  },
});
