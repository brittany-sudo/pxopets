import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Modal, Alert, Animated, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';
import { usePets } from '@/store/PetStore';
import { useInventory } from '@/store/InventoryStore';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the signal den and NPC images
const signalDenMainImage = require('@/assets/images/signal-den-main.png');
const radioheadSpriteImage = require('@/assets/images/radiohead-sprite.png');

// Import the radio songs
const satelliteSong = require('@/assets/audio/satellite-song-3.mp3');
const interstellarTalk = require('@/assets/audio/interstellar-small-talk.mp3');

export default function SignalDenScreen() {
  const { spendStamina, getActivePetStamina, addStaminaToPet, getActivePet } = usePets();
  const { addItem } = useInventory();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showSignalSentModal, setShowSignalSentModal] = useState(false);
  const [showAlreadyFoundModal, setShowAlreadyFoundModal] = useState(false);
  const [lockedSignal, setLockedSignal] = useState<any>(null);
  const [sentMessage, setSentMessage] = useState<string>('');
  const [radioheaderSaying, setRadioheaderSaying] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [userBroadcasts, setUserBroadcasts] = useState<string[]>([]);
  const [currentFrequency, setCurrentFrequency] = useState<number>(88.0);
  const [isTuning, setIsTuning] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [foundFrequencies, setFoundFrequencies] = useState<Set<number>>(new Set());
  const [signalFragments, setSignalFragments] = useState(0);
  const [nowPlaying, setNowPlaying] = useState("Satellite Dream #7");
  const [flickerAnimation] = useState(new Animated.Value(1));
  const [frequencyAnimations] = useState(() => 
    Array.from({ length: 16 }, () => new Animated.Value(0.1))
  );
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isTunedIn, setIsTunedIn] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [holdTimers, setHoldTimers] = useState<{left: number | null, right: number | null}>({left: null, right: null});
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [lastCompletedDate, setLastCompletedDate] = useState<string>('');
  
  // Daily completion tracking
  const checkDailyCompletion = async () => {
    try {
      const today = new Date().toDateString();
      const storedDate = await AsyncStorage.getItem('signal-den-last-completed');
      const storedFrequencies = await AsyncStorage.getItem('signal-den-found-frequencies');
      
      if (storedDate === today && storedFrequencies) {
        // Same day, restore found frequencies
        const frequencies = JSON.parse(storedFrequencies);
        setFoundFrequencies(new Set(frequencies));
        setDailyCompleted(true);
        setLastCompletedDate(today);
      } else {
        // New day or first time, reset
        setFoundFrequencies(new Set());
        setDailyCompleted(false);
        setLastCompletedDate('');
      }
    } catch (error) {
      console.log('Error checking daily completion:', error);
    }
  };

  const saveDailyProgress = async () => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('signal-den-last-completed', today);
      await AsyncStorage.setItem('signal-den-found-frequencies', JSON.stringify([...foundFrequencies]));
    } catch (error) {
      console.log('Error saving daily progress:', error);
    }
  };

  // Radio playlist
  const radioPlaylist = [
    { 
      title: "Satellite Dream #7", 
      file: satelliteSong,
      artist: "Cosmic Transmission"
    },
    { 
      title: "Interstellar Small Talk", 
      file: interstellarTalk,
      artist: "Deep Space Radio"
    }
  ];

  // Initialize flicker animation
  useEffect(() => {
    const flicker = () => {
      Animated.sequence([
        Animated.timing(flickerAnimation, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(flicker, Math.random() * 3000 + 2000);
      });
    };
    flicker();
  }, []);

  // Initialize frequency animation
  useEffect(() => {
    const createRealisticVisualizer = () => {
      frequencyAnimations.forEach((animation, index) => {
        const randomDelay = Math.random() * 1000;
        const baseDuration = 200 + Math.random() * 300; // 200-500ms
        
        setTimeout(() => {
          const animateBar = () => {
            const randomPeak = 0.2 + Math.random() * 0.8; // 0.2-1.0
            const randomLow = 0.05 + Math.random() * 0.3; // 0.05-0.35
            
            Animated.sequence([
              Animated.timing(animation, {
                toValue: randomPeak,
                duration: baseDuration + Math.random() * 200,
                useNativeDriver: true,
              }),
              Animated.timing(animation, {
                toValue: randomLow,
                duration: baseDuration * 0.6 + Math.random() * 100,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Continue the loop with slight randomization
              setTimeout(animateBar, Math.random() * 100);
            });
          };
          
          animateBar();
        }, randomDelay);
      });
    };
    
    createRealisticVisualizer();
  }, []); // Remove frequencyAnimations from dependency array

  // Initialize audio with random song
  useEffect(() => {
    const loadRandomSong = async () => {
      try {
        // Pick a random song from the playlist
        const randomIndex = Math.floor(Math.random() * radioPlaylist.length);
        const selectedSong = radioPlaylist[randomIndex];
        
        setCurrentSongIndex(randomIndex);
        setNowPlaying(selectedSong.title);
        
        const { sound: audioSound } = await Audio.Sound.createAsync(
          selectedSong.file,
          { shouldPlay: true, isLooping: true, volume: 0.0 } // Start playing but muted
        );
        setSound(audioSound);
      } catch (error) {
        console.log('Error loading audio:', error);
      }
    };

    loadRandomSong();

    // Cleanup function
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Handle audio when navigating away from Signal Den
  useFocusEffect(
    React.useCallback(() => {
      // When screen comes into focus, reload audio if it was unloaded
      const reloadAudio = async () => {
        if (!sound) {
          try {
            const randomIndex = Math.floor(Math.random() * radioPlaylist.length);
            const selectedSong = radioPlaylist[randomIndex];
            setNowPlaying(selectedSong.title);
            setCurrentSongIndex(randomIndex);
            
            const { sound: newSound } = await Audio.Sound.createAsync(
              selectedSong.file,
              { 
                volume: 0.0, // Start muted
                shouldPlay: true,
                isLooping: true 
              }
            );
            setSound(newSound);
          } catch (error) {
            console.log('Error reloading audio:', error);
          }
        }
      };
      
      reloadAudio();
      
      return () => {
        // When screen loses focus (user navigates away), stop and unload audio
        if (sound) {
          sound.unloadAsync();
          setSound(null);
          setIsTunedIn(false);
        }
      };
    }, [sound])
  );

  // Cleanup audio and timers on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      // Clear any active hold timers
      setHoldTimers(prev => {
        if (prev.left) {
          clearTimeout(prev.left);
          clearInterval(prev.left);
        }
        if (prev.right) {
          clearTimeout(prev.right);
          clearInterval(prev.right);
        }
        return { left: null, right: null };
      });
    };
  }, [sound]);

  // Radioheader's Signal Den Personality
  const getRadioheaderGreeting = () => {
    const greetings = [
      "Welcome to The Signal Den, cosmic wanderer. I'm Radioheader, and this is where the frequencies speak to those who listen...",
      "Step into the static, friend. The Signal Den is where lost transmissions find their way home. I'm Radioheader, keeper of the frequencies.",
      "The airwaves are alive here in The Signal Den. I'm Radioheader, and I've been tuning into signals from beyond the stars for decades...",
      "Welcome to my sanctuary, where the radio waves dance with the desert wind. I'm Radioheader, and this is The Signal Den.",
      "The frequencies call to you, don't they? I'm Radioheader, and this Signal Den is where the cosmic static reveals its secrets...",
      "Step out of the chaos and into the static, traveler. I'm Radioheader, and The Signal Den is where the universe whispers its truths.",
      "The desert holds many secrets, but none as profound as The Signal Den. I'm Radioheader, and I'm here to guide you through the frequencies.",
      "Welcome to where the radio waves meet the cosmic void. I'm Radioheader, and this Signal Den is your gateway to the unknown.",
      "The static speaks to those who know how to listen. I'm Radioheader, and The Signal Den is where the frequencies reveal their mysteries.",
      "Step into the pocket dimension of radio waves, friend. I'm Radioheader, and this Signal Den is where the cosmic signals find their voice."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleRadioheaderInteraction = () => {
    setRadioheaderSaying(getRadioheaderGreeting());
  };

  // Initialize Radioheader's greeting and check daily completion on component mount
  useEffect(() => {
    setRadioheaderSaying(getRadioheaderGreeting());
    checkDailyCompletion();
  }, []);

  // Save progress whenever foundFrequencies changes
  useEffect(() => {
    if (foundFrequencies.size > 0) {
      saveDailyProgress();
    }
  }, [foundFrequencies]);

  // Frequency Tuner Game Logic
  const hiddenFrequencies = [
    { freq: 88.7, name: "Cosmic Whisper", reward: "signal_fragment", message: "The stars are listening..." },
    { freq: 92.3, name: "Ghost Transmission", reward: "casino_chip", message: "Meet me at the Mirage." },
    { freq: 95.1, name: "Static Dreams", reward: "mirage_candy", message: "Keep your dials open." },
    { freq: 98.9, name: "Void Frequency", reward: "music_loop", message: "The signal fades..." },
    { freq: 101.7, name: "Phantom Station", reward: "signal_fragment", message: "Lost in transmission." },
    { freq: 104.5, name: "Echo Chamber", reward: "ghost_frequency", message: "The desert remembers." }
  ];

  const tuneFrequency = (direction: 'left' | 'right') => {
    setCurrentFrequency(prevFreq => {
      // Check if we're close to any signal first
      const closestSignal = hiddenFrequencies.find(f => Math.abs(f.freq - prevFreq) < 0.3);
      
      // Use smaller steps when close to a signal for precision
      const change = closestSignal && Math.abs(closestSignal.freq - prevFreq) < 0.2 
        ? (direction === 'left' ? -0.05 : 0.05) // Smaller steps when close
        : (direction === 'left' ? -0.1 : 0.1);  // Normal steps when far
      
      const newFreq = Math.max(88.0, Math.min(108.0, prevFreq + change));
      
      // Check for signal strength using the new frequency
      const newClosestSignal = hiddenFrequencies.find(f => Math.abs(f.freq - newFreq) < 0.3);
      if (newClosestSignal) {
        const distance = Math.abs(newClosestSignal.freq - newFreq);
        // More forgiving calculation - easier to reach 100%
        let strength;
        if (distance < 0.05) {
          strength = 100; // Perfect signal when very close
        } else if (distance < 0.1) {
          strength = 95; // Near perfect
        } else if (distance < 0.15) {
          strength = 85; // Strong signal
        } else {
          strength = Math.max(0, 100 - distance * 100); // More forgiving falloff
        }
        setSignalStrength(strength);
        
        // Auto-stop hold tuning when reaching 100% signal
        if (strength >= 100) {
          stopHoldTuning(direction);
        }
      } else {
        setSignalStrength(0);
      }
      
      return newFreq;
    });
  };

  const startHoldTuning = (direction: 'left' | 'right') => {
    // Clear any existing timer for this direction
    setHoldTimers(prev => {
      if (prev[direction]) {
        clearInterval(prev[direction]!);
      }
      
      // Start immediate tuning
      tuneFrequency(direction);
      
      // Set up continuous tuning with a small delay for natural feel
      const timer = setTimeout(() => {
        const intervalTimer = setInterval(() => {
          tuneFrequency(direction);
        }, 120); // Very smooth tuning speed
        
        // Update the timer reference to the interval
        setHoldTimers(prev => ({
          ...prev,
          [direction]: intervalTimer
        }));
      }, 300); // 300ms delay before continuous tuning starts
      
      return {
        ...prev,
        [direction]: timer
      };
    });
  };

  const stopHoldTuning = (direction: 'left' | 'right') => {
    setHoldTimers(prev => {
      if (prev[direction]) {
        clearTimeout(prev[direction]!);
        clearInterval(prev[direction]!);
      }
      return {
        ...prev,
        [direction]: null
      };
    });
  };

  const lockOnFrequency = () => {
    const closestSignal = hiddenFrequencies.find(f => Math.abs(f.freq - currentFrequency) < 0.3);
    if (closestSignal && signalStrength > 60) {
      if (!foundFrequencies.has(closestSignal.freq)) {
        setFoundFrequencies(prev => new Set([...prev, closestSignal.freq]));
        
        // Give rewards based on type
        if (closestSignal.reward === 'signal_fragment') {
          setSignalFragments(prev => prev + 1);
        }
        
        // Generate random reward
        const rewardRoll = Math.random();
        let reward = null;
        
        if (rewardRoll < 0.7) {
          // 70% chance: 1-5 stamina boost
          const staminaAmount = Math.floor(Math.random() * 5) + 1;
          const activePet = getActivePet();
          if (activePet) {
            addStaminaToPet(activePet.id, staminaAmount);
          }
          reward = { type: 'stamina', amount: staminaAmount };
        } else if (rewardRoll < 0.9) {
          // 20% chance: comet gummies
          addItem({
            id: 'comet-gummies',
            name: 'Comet Gummies',
            description: 'Sweet cosmic treats that sparkle like stardust',
            image: 'comet-gummies.png',
            category: 'snack',
            rarity: 'uncommon'
          });
          reward = { type: 'item', item: 'comet-gummies.png', name: 'Comet Gummies' };
        } else {
          // 10% chance: lost transmission
          addItem({
            id: 'lost-transmission',
            name: 'Lost Transmission',
            description: 'A mysterious signal fragment from deep space',
            image: 'lost-transmission.png',
            rarity: 'rare'
          });
          reward = { type: 'item', item: 'lost-transmission.png', name: 'Lost Transmission' };
        }
        
        setLockedSignal({ ...closestSignal, reward });
        setShowLockModal(true);
      } else {
        setShowAlreadyFoundModal(true);
      }
    } else {
      Alert.alert("No Signal", "The static is too strong. Try tuning more precisely.");
    }
  };

  // Broadcast Board Messages
  const broadcastMessages = [
    "Keep your dials open.",
    "Meet me at the Mirage.",
    "The stars are listening.",
    "Signal fading...",
    "Lost in transmission.",
    "The desert remembers.",
    "Static speaks truth.",
    "Frequencies align.",
    "Echo from beyond.",
    "Tune to the void."
  ];

  const changeSong = async () => {
    if (!sound) return;

    try {
      // Unload current song
      await sound.unloadAsync();
      
      // Pick a random different song
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * radioPlaylist.length);
      } while (newIndex === currentSongIndex && radioPlaylist.length > 1);
      
      const newSong = radioPlaylist[newIndex];
      setCurrentSongIndex(newIndex);
      setNowPlaying(newSong.title);
      
      // Load new song
      const { sound: newSound } = await Audio.Sound.createAsync(
        newSong.file,
        { shouldPlay: true, isLooping: true, volume: isTunedIn ? 0.3 : 0.0 }
      );
      setSound(newSound);
    } catch (error) {
      console.log('Error changing song:', error);
    }
  };

  // Auto-change songs every 2-4 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      changeSong();
    }, Math.random() * 120000 + 120000); // 2-4 minutes

    return () => clearInterval(interval);
  }, [sound, currentSongIndex, isTunedIn]);

  const toggleTuneIn = async () => {
    if (!sound) return;

    try {
      if (isTunedIn) {
        // Tune out - mute the audio
        await sound.setVolumeAsync(0.0);
        setIsTunedIn(false);
      } else {
        // Tune in - unmute the audio
        await sound.setVolumeAsync(0.3);
        setIsTunedIn(true);
      }
    } catch (error) {
      console.log('Error toggling tune in:', error);
    }
  };

  const submitBroadcast = () => {
    // Validate message
    if (!customMessage.trim()) {
      Alert.alert(
        "Empty Signal",
        "Please enter a message to broadcast.",
        [{ text: "OK" }]
      );
      return;
    }

    if (customMessage.length > 20) {
      Alert.alert(
        "Signal Too Long",
        "Message must be 20 characters or less.",
        [{ text: "OK" }]
      );
      return;
    }

    // Check if player has enough stamina (5 stamina cost)
    if (!spendStamina(5)) {
      Alert.alert(
        "Insufficient Energy",
        "Your pet needs 5 stamina to broadcast a signal. Try resting or feeding your pet first.",
        [{ text: "OK" }]
      );
      return;
    }

    const trimmedMessage = customMessage.trim();
    setSentMessage(trimmedMessage);
    setUserBroadcasts(prev => [trimmedMessage, ...prev]); // Add to the beginning of the list
    setCustomMessage(''); // Clear the input
    setShowBroadcastModal(false);
    setShowSignalSentModal(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/crescent-oasis')}
          >
            <FontAwesome name="arrow-left" size={12} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.locationTitle}>THE SIGNAL DEN</Text>
        </RNView>

        {/* Signal Den Header Image */}
        <Image source={signalDenMainImage} style={styles.signalDenImage} />

        {/* Radioheader the NPC */}
        <RNView style={styles.npcContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>RADIOHEADER</Text>
            <Text style={styles.speechText}>{radioheaderSaying}</Text>
          </RNView>
          <Pressable onPress={handleRadioheaderInteraction}>
            <Image source={radioheadSpriteImage} style={styles.npcImage} />
          </Pressable>
        </RNView>

        {/* Now Playing Ticker */}
        <RNView style={styles.nowPlayingContainer}>
          <RNView style={styles.ipodScreen}>
            <RNView style={styles.screenHeader}>
              <Text style={styles.screenTitle}>SIGNAL DEN RADIO</Text>
            </RNView>
            
            <RNView style={styles.visualizerContainer}>
              <RNView style={styles.frequencyBars}>
                {[...Array(16)].map((_, i) => {
                  const colors = ['#00ffff', '#00e6e6', '#00cccc', '#00b3b3', '#009999'];
                  const colorIndex = i % colors.length;
                  const isCenter = i >= 6 && i <= 9;
                  const isEdge = i < 3 || i > 12;
                  
                  return (
                    <Animated.View
                      key={i}
                      style={[
                        styles.frequencyBar,
                        {
                          backgroundColor: colors[colorIndex],
                          transform: [{
                            scaleY: frequencyAnimations[i].interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.1, 1.2],
                            })
                          }],
                        },
                      ]}
                    />
                  );
                })}
              </RNView>
            </RNView>
            
            <RNView style={styles.songInfoContainer}>
              <RNView style={styles.songInfoWrapper}>
                <Text style={[styles.tuneStatus, { color: isTunedIn ? '#10b981' : '#64748b' }]}>
                  {isTunedIn ? "● TUNED IN" : "○ TUNED OUT"}
                </Text>
                <RNView style={styles.songTitleRow}>
                  <Pressable style={styles.airhornButton} onPress={toggleTuneIn}>
                    <FontAwesome 
                      name={isTunedIn ? "volume-up" : "volume-off"} 
                      size={18} 
                      color={isTunedIn ? "#10b981" : "#64748b"} 
                    />
                  </Pressable>
                  <RNView style={styles.songTextContainer}>
                    <Text style={styles.songTitle}>{nowPlaying}</Text>
                    <Text style={styles.artistName}>Cosmic Transmission</Text>
                  </RNView>
                </RNView>
              </RNView>
            </RNView>
          </RNView>
        </RNView>

        {/* 1. The Frequency Tuner */}
        <RNView style={styles.frequencyTunerContainer}>
          <Text style={styles.sectionTitle}>THE FREQUENCY TUNER</Text>
          <RNView style={styles.radioConsole}>
            <RNView style={styles.frequencyDisplay}>
              <Text style={styles.frequencyText}>{currentFrequency.toFixed(1)} FM</Text>
              <Text style={styles.signalStrengthText}>Signal: {signalStrength.toFixed(0)}%</Text>
            </RNView>
            
            <RNView style={styles.tuningControls}>
              <Pressable 
                style={styles.tuneButton} 
                onPress={() => tuneFrequency('left')}
                onPressIn={() => startHoldTuning('left')}
                onPressOut={() => stopHoldTuning('left')}
              >
                <FontAwesome name="chevron-left" size={20} color="#00ffff" />
              </Pressable>
              
              <RNView style={styles.oscilloscope}>
                <Text style={styles.oscilloscopeText}>
                  {signalStrength > 50 ? '━━━━━━━━━━' : '~~~~~~~~~~'}
                </Text>
              </RNView>
              
              <Pressable 
                style={styles.tuneButton} 
                onPress={() => tuneFrequency('right')}
                onPressIn={() => startHoldTuning('right')}
                onPressOut={() => stopHoldTuning('right')}
              >
                <FontAwesome name="chevron-right" size={20} color="#00ffff" />
              </Pressable>
            </RNView>
            
            <Pressable 
              style={[styles.lockButton, { opacity: signalStrength > 60 ? 1 : 0.3 }]}
              onPress={lockOnFrequency}
              disabled={signalStrength <= 60}
            >
              <Text style={styles.lockButtonText}>LOCK ON</Text>
            </Pressable>
          </RNView>
          
          <RNView style={styles.frequencyStats}>
            {foundFrequencies.size === 6 ? (
              <Text style={[styles.statsText, { color: '#10b981' }]}>All Frequencies Found Today!</Text>
            ) : (
              <Text style={styles.statsText}>Found Frequencies: {foundFrequencies.size}/6</Text>
            )}
          </RNView>
        </RNView>

        {/* 2. The Broadcast Board */}
        <RNView style={styles.broadcastBoardContainer}>
          <Text style={styles.sectionTitle}>THE BROADCAST BOARD</Text>
          <RNView style={styles.broadcastMonitor}>
            <RNView style={styles.monitorHeader}>
              <Text style={styles.monitorTitle}>COSMIC TRANSMISSIONS</Text>
              <Text style={styles.monitorSubtitle}>Live from The Signal Den</Text>
            </RNView>
            
            <ScrollView style={styles.messageScroll} showsVerticalScrollIndicator={false}>
              {userBroadcasts.length > 0 ? (
                userBroadcasts.slice(0, 10).map((message, index) => (
                  <RNView key={index} style={styles.messageItem}>
                    <Text style={styles.messageText}>"{message}"</Text>
                    <Text style={styles.messageTime}>• {index === 0 ? 'Just now' : `${index * 2}m ago`}</Text>
                  </RNView>
                ))
              ) : (
                <RNView style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No signals detected...</Text>
                  <Text style={styles.emptyStateSubtext}>Be the first to broadcast!</Text>
                </RNView>
              )}
            </ScrollView>
            
            <Pressable 
              style={styles.submitButton}
              onPress={() => setShowBroadcastModal(true)}
            >
              <Text style={styles.submitButtonText}>SUBMIT SIGNAL</Text>
              <RNView style={styles.staminaCostContainer}>
                <FontAwesome name="bolt" size={12} color="#ffd700" />
                <Text style={styles.staminaCostText}>5</Text>
              </RNView>
            </Pressable>
          </RNView>
        </RNView>

      </ScrollView>

      {/* Broadcast Board Modal */}
      <Modal
        visible={showBroadcastModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBroadcastModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Pressable 
              style={styles.closeXButton}
              onPress={() => {
                setShowBroadcastModal(false);
                setCustomMessage('');
              }}
            >
              <FontAwesome name="times" size={16} color="#64748b" />
            </Pressable>
            
            <Text style={styles.modalTitle}>SUBMIT SIGNAL</Text>
            <Text style={styles.modalSubtitle}>Type your message to broadcast into the cosmic static</Text>
            
            <RNView style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={customMessage}
                onChangeText={setCustomMessage}
                placeholder="Enter your signal..."
                placeholderTextColor="#64748b"
                maxLength={20}
                multiline={false}
                autoFocus={true}
              />
              <Text style={styles.characterCount}>{customMessage.length}/20</Text>
            </RNView>

            <Pressable
              style={styles.submitModalButton}
              onPress={submitBroadcast}
            >
              <Text style={styles.submitModalButtonText}>BROADCAST</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Signal Lock Modal */}
      <Modal
        visible={showLockModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLockModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>SIGNAL LOCKED!</Text>
            <Text style={styles.modalSubtitle}>Frequency captured successfully</Text>
            
            {lockedSignal && (
              <RNView style={styles.signalInfo}>
                <RNView style={styles.frequencyDisplay}>
                  <Text style={styles.lockedFrequencyText}>{lockedSignal.freq} FM</Text>
                  <Text style={styles.signalNameText}>{lockedSignal.name}</Text>
                  <Text style={styles.signalFlavorText}>{lockedSignal.message}</Text>
                </RNView>
                
                <RNView style={styles.rewardContainer}>
                  <Text style={styles.rewardLabel}>YOU RECEIVED</Text>
                  {lockedSignal.reward?.type === 'stamina' ? (
                    <RNView style={styles.rewardRow}>
                      <FontAwesome name="bolt" size={12} color="#ffd700" />
                      <Text style={styles.rewardText}>+{lockedSignal.reward.amount} STAMINA</Text>
                    </RNView>
                  ) : lockedSignal.reward?.type === 'item' ? (
                    <RNView style={styles.rewardItemContainer}>
                      <Image 
                        source={lockedSignal.reward.item === 'comet-gummies.png' 
                          ? require('@/assets/images/comet-gummies.png')
                          : require('@/assets/images/lost-transmission.png')
                        } 
                        style={styles.rewardIcon}
                      />
                      <Text style={styles.rewardItemText}>{lockedSignal.reward.name.toUpperCase()}</Text>
                    </RNView>
                  ) : (
                    <Text style={styles.rewardText}>{lockedSignal.reward?.replace('_', ' ').toUpperCase() || 'SIGNAL FRAGMENT'}</Text>
                  )}
                </RNView>
                
                <RNView style={styles.statsContainer}>
                  {foundFrequencies.size === 6 ? (
                    <Text style={[styles.statsText, { color: '#10b981' }]}>All Frequencies Found Today!</Text>
                  ) : (
                    <Text style={styles.statsText}>Found Frequencies: {foundFrequencies.size}/6</Text>
                  )}
                </RNView>
              </RNView>
            )}

            <Pressable
              style={styles.closeButton}
              onPress={() => setShowLockModal(false)}
            >
              <Text style={styles.closeButtonText}>CONTINUE TUNING</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Signal Sent Modal */}
      <Modal
        visible={showSignalSentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSignalSentModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>SIGNAL SENT</Text>
            <Text style={styles.modalSubtitle}>Your message has been broadcast into the cosmic static</Text>
            
            <RNView style={styles.messageContainer}>
              <Text style={styles.sentMessageText}>"{sentMessage}"</Text>
            </RNView>
            
            <RNView style={styles.transmissionStatus}>
              <Text style={styles.statusLabel}>TRANSMISSION STATUS:</Text>
              <Text style={styles.statusText}>BROADCASTING</Text>
              <Text style={styles.statusSubtext}>Signal propagating through the void...</Text>
            </RNView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setShowSignalSentModal(false)}
            >
              <Text style={styles.closeButtonText}>CONTINUE BROADCASTING</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Already Found Modal */}
      <Modal
        visible={showAlreadyFoundModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAlreadyFoundModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>ALREADY FOUND</Text>
            <Text style={styles.modalSubtitle}>You've already locked onto this frequency.</Text>
            
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowAlreadyFoundModal(false)}
            >
              <Text style={styles.closeButtonText}>CONTINUE TUNING</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0b2e', // Dark purple/teal background for pocket dimension feel
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'absolute',
    left: 0,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ec4899',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    flex: 1,
    marginLeft: 16,
  },
  signalDenImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: -8,
    padding: 12,
  },
  speechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    width: 200,
    marginRight: 12,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 2,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'left',
    lineHeight: 12,
  },
  npcImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  nowPlayingContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
  },
  ipodScreen: {
    backgroundColor: '#1a0b2e',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 3,
    borderColor: '#2d1b69',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  screenHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  screenTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#00ffff',
    textAlign: 'center',
    letterSpacing: 1,
    width: '100%',
  },
  visualizerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  frequencyBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
    width: '100%',
    gap: 1,
  },
  frequencyBar: {
    width: 3,
    height: 30,
    borderRadius: 1.5,
    flex: 1,
  },
  songInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    width: '100%',
  },
  songInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 11, 46, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    minWidth: 300,
    position: 'relative',
    gap: 12,
  },
  songTitleRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  songTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 14,
  },
  artistName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#00ffff',
    textAlign: 'center',
    marginTop: 1,
    lineHeight: 11,
  },
  tuneStatus: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    textAlign: 'center',
    fontWeight: 'bold',
    position: 'absolute',
    top: 4,
    right: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 3,
    minWidth: 60,
  },
  airhornButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.4)',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  frequencyTunerContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  radioConsole: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  frequencyDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  frequencyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  signalStrengthText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
  },
  tuningControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tuneButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  oscilloscope: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  oscilloscopeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#10b981',
  },
  lockButton: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  lockButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
  },
  frequencyStats: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignSelf: 'center',
  },
  statsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#888888',
    textAlign: 'center',
  },
  broadcastBoardContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  broadcastMonitor: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
  },
  monitorHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  monitorTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  monitorSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
  },
  messageScroll: {
    maxHeight: 120,
    marginBottom: 12,
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  messageText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#ffffff',
    flex: 1,
  },
  messageTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
  },
  submitButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  submitButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  staminaCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  staminaCostText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ffd700',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  statsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 200,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1a0b2e',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    position: 'relative',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeXButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  messageList: {
    maxHeight: 300,
  },
  messageOption: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 12,
    marginBottom: 8,
  },
  messageOptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 16,
  },
  messageInput: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 12,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#e2e8f0',
    textAlign: 'center',
  },
  characterCount: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  submitModalButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: 140,
  },
  submitModalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#475569',
  },
  signalInfo: {
    marginVertical: 16,
  },
  frequencyDisplay: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  lockedFrequencyText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  signalNameText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  messageContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  signalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#10b981',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rewardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.6)',
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: 200,
  },
  rewardLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    marginBottom: 8,
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardIcon: {
    width: 32,
    height: 32,
  },
  rewardItemContainer: {
    alignItems: 'center',
    gap: 4,
  },
  rewardItemText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signalFlavorText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 4,
  },
  signalSentInfo: {
    marginVertical: 16,
  },
  sentMessageText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#10b981',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  transmissionStatus: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
  },
  statusLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },
});
