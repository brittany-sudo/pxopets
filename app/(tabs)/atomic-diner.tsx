import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Modal, Alert, Vibration } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the diner image
const atomicDinerImage = require('@/assets/images/atomic-diner-main.png');

// Import menu item images
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const iceCreamSandwichImage = require('@/assets/images/icecreamsandwich.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const lilAtomicDinerImage = require('@/assets/images/lil-atomic-diner.png');
const rinkPizzaImage = require('@/assets/images/rinkpizza.png');
const glowCornImage = require('@/assets/images/glowcorn.png');
const galaxySundaeImage = require('@/assets/images/galaxysundae.png');
const blueTboneImage = require('@/assets/images/blue-tbone.png');
const atomicJukeboxImage = require('@/assets/images/atomic-jukebox.png');

// Image mapping
const imageMap: { [key: string]: any } = {
  'cosmicburger.png': cosmicBurgerImage,
  'icecreamsandwich.png': iceCreamSandwichImage,
  'gumballs.png': gumballsImage,
  'lil-atomic-diner.png': lilAtomicDinerImage,
  'rinkpizza.png': rinkPizzaImage,
  'glowcorn.png': glowCornImage,
  'galaxysundae.png': galaxySundaeImage,
  'blue-tbone.png': blueTboneImage,
};

export default function AtomicDinerScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [zaraSaying, setZaraSaying] = useState<string>('');
  const [showJukeboxModal, setShowJukeboxModal] = useState(false);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [activePetName, setActivePetName] = useState("Pixel");
  const [showStatBoost, setShowStatBoost] = useState(false);
  const [statBoostMessage, setStatBoostMessage] = useState(""); // Player's current stamina

  // Zara's California Valley Girl Personality
  const getZaraGreeting = () => {
    const greetings = [
      "Oh my gosh, like, welcome to the Atomic Diner! I'm totally Zara and I'm, like, so stoked you're here!",
      "Hey there, space cadet! Like, I'm Zara and this place is totally out of this world, you know?",
      "Oh em gee, another customer! I'm Zara and I'm, like, totally your cosmic waitress today!",
      "Like, welcome to our little atomic paradise! I'm Zara and I'm so ready to serve you some stellar eats!",
      "Dude, you're totally going to love our cosmic cuisine! I'm Zara and I'm, like, the best waitress in the galaxy!",
      "Oh my gosh, like, you just made my day! I'm Zara and I'm totally here to make your dining experience stellar!",
      "Like, welcome to the most rad diner in the universe! I'm Zara and I'm so excited to serve you!",
      "Hey there, space traveler! I'm Zara and I'm, like, totally your guide to the best atomic eats around!",
      "Oh em gee, another awesome customer! I'm Zara and I'm so ready to show you our cosmic menu!",
      "Like, you're totally going to love this place! I'm Zara and I'm, like, the most enthusiastic waitress ever!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleZaraInteraction = () => {
    setZaraSaying(getZaraGreeting());
  };

  // Initialize Zara's greeting on component mount
  React.useEffect(() => {
    setZaraSaying(getZaraGreeting());
  }, []);

  // Jukebox functionality
  const jukeboxSongs = [
    { id: 1, name: "Cosmic Boogie", artist: "The Atomic Five", staminaCost: 3, description: "A groovy space dance number" },
    { id: 2, name: "Neon Dreams", artist: "Electric Galaxy", staminaCost: 3, description: "Synth-heavy retro vibes" },
    { id: 3, name: "Stardust Serenade", artist: "The Cosmic Crooners", staminaCost: 3, description: "Smooth jazz from another dimension" },
    { id: 4, name: "Rocket Rock", artist: "The Space Cadets", staminaCost: 3, description: "High-energy space rock anthem" },
    { id: 5, name: "Alien Twist", artist: "The Martian Marauders", staminaCost: 3, description: "Intergalactic dance craze from Mars" },
    { id: 6, name: "Atomic Love", artist: "The Uranium Hearts", staminaCost: 3, description: "Romantic ballad from the nuclear age" },
    { id: 7, name: "Space Cadet Shuffle", artist: "The Lunar Lunatics", staminaCost: 3, description: "Bouncy beat for the cosmic crowd" }
  ];

  // Random stats that can be boosted
  const statTypes = ["Energy", "Strength", "Agility", "Luck", "Charisma", "Intelligence", "Defense", "Magic"];

  // Simple audio feedback function
  const playJukeboxSound = () => {
    try {
      // Try to play a simple beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A note
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Fallback to vibration if audio fails
      Vibration.vibrate(100);
    }
  };

  const playJukebox = (song: any) => {
    console.log('playJukebox called with:', song.name); // Debug log
    
    if (playerStamina < song.staminaCost) {
      Alert.alert("Not Enough Stamina", "You need more energy to play this song!");
      return;
    }

    // Play sound immediately
    playJukeboxSound();

    // Start visual playing effect
    setIsPlaying(true);
    setCurrentSong(song.name);
    
    // Deduct stamina
    setPlayerStamina(prev => prev - song.staminaCost);
    
    console.log('Starting 2 second timer...'); // Debug log
    
    // Simulate "playing" for 2 seconds before showing result
    setTimeout(() => {
      console.log('Timer completed, showing popup...'); // Debug log
      setIsPlaying(false);
      setCurrentSong(null);
      
      // Generate random stat boost
      const randomStat = statTypes[Math.floor(Math.random() * statTypes.length)];
      const randomAmount = Math.floor(Math.random() * 5) + 1; // 1-5
      
      console.log('Generated stats:', randomStat, randomAmount); // Debug log
      
      // Set the stat boost message and show popup
      setStatBoostMessage(`"${song.name}" by ${song.artist}\n\n${activePetName} received +${randomAmount} ${randomStat}!`);
      setShowStatBoost(true);
    }, 2000);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const dinerActivities = [
    {
      id: 'order-food',
      name: 'Milkshake of the Day',
      description: 'Browse the atomic menu and place your order',
      stamina: 10,
      price: 1,
      icon: 'cutlery'
    },
    {
      id: 'chat-waitress',
      name: 'Chat with Zara',
      description: 'Talk to the friendly alien waitress',
      stamina: 5,
      price: 1,
      icon: 'user'
    },
    {
      id: 'play-jukebox',
      name: 'Play Jukebox',
      description: 'Select some retro tunes for the diner',
      stamina: 8,
      price: 1,
      icon: 'music'
    }
  ];

  const menuItems = [
    {
      id: 'atomic-burger',
      name: 'Atomic Burger',
      description: 'Glowing patty with cosmic lettuce and stardust buns',
      price: 1,
      stamina: 20,
      icon: 'cosmicburger.png'
    },
    {
      id: 'alien-milkshake',
      name: 'Alien Milkshake',
      description: 'Purple shake that changes color as you drink',
      price: 1,
      stamina: 15,
      icon: 'icecreamsandwich.png'
    },
    {
      id: 'space-fries',
      name: 'Space Fries',
      description: 'Crispy golden fries that float in zero gravity',
      price: 1,
      stamina: 12,
      icon: 'glowcorn.png'
    },
    {
      id: 'cosmic-soda',
      name: 'Cosmic Soda',
      description: 'Fizzy drink that sparkles like the night sky',
      price: 1,
      stamina: 10,
      icon: 'cosmicburger.png'
    },
    {
      id: 'moon-pie',
      name: 'Galaxy Sundae',
      description: 'Cosmic ice cream with stardust sprinkles',
      price: 1,
      stamina: 18,
      icon: 'galaxysundae.png'
    },
    {
      id: 'galaxy-salad',
      name: 'Blue T-Bone',
      description: 'Premium steak from the cosmic cattle ranch',
      price: 1,
      stamina: 14,
      icon: 'blue-tbone.png'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/crescent-oasis')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>ATOMIC DINER</Text>
        </RNView>

        {/* Diner Image */}
        <Image source={atomicDinerImage} style={styles.dinerImage} />

        {/* Zara the Waitress */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>ZARA:</Text>
            <Text style={styles.speechText}>
              {zaraSaying}
            </Text>
          </RNView>
          <Image source={require('@/assets/images/zara-icon.png')} style={styles.zaraImage} />
        </RNView>

        {/* Activities */}
        {dinerActivities.map((activity) => (
          <RNView key={activity.id} style={styles.pubActivityItem}>
            <Pressable 
              style={styles.pubActivityPressable}
              onPress={() => {
                if (activity.id === 'play-jukebox') {
                  setShowJukeboxModal(true);
                }
              }}
            >
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" style={styles.pubActivityImageIcon} />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>{activity.name}</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        ))}

        {/* Menu */}
        <Text style={styles.menuTitle}>ATOMIC DINER MENU</Text>
        <RNView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <RNView key={item.id} style={styles.menuItem}>
              <RNView style={styles.menuItemHeader}>
                <Image source={imageMap[item.icon]} style={styles.menuItemIcon} />
                <RNView style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </RNView>
              </RNView>
              <RNView style={styles.menuItemFooter}>
                <RNView style={styles.ticketPriceContainer}>
                  <Text style={styles.menuItemPrice}>{item.price}</Text>
                  <FontAwesome name="ticket" size={10} color="#8b5cf6" />
                </RNView>
                <RNView style={styles.staminaContainer}>
                  <Text style={styles.staminaText}>⚡ {item.stamina}</Text>
                </RNView>
              </RNView>
            </RNView>
          ))}
        </RNView>

        {/* Jukebox Modal */}
        <Modal
          visible={showJukeboxModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowJukeboxModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.jukeboxModal}>
              <View style={styles.jukeboxHeader}>
                <Text style={styles.jukeboxTitle}>ATOMIC JUKEBOX</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowJukeboxModal(false)}
                >
                  <FontAwesome name="times" size={20} color="#8b5cf6" />
                </Pressable>
              </View>
              
              <Image source={atomicJukeboxImage} style={styles.jukeboxImage} />
              
              
              <View style={styles.songsList}>
                {jukeboxSongs.map((song) => (
                  <Pressable 
                    key={song.id} 
                    style={[
                      styles.songItem,
                      playerStamina < song.staminaCost && styles.disabledSong,
                      isPlaying && currentSong === song.name && styles.playingSong
                    ]}
                    onPress={() => playJukebox(song)}
                    disabled={playerStamina < song.staminaCost || isPlaying}
                  >
                    <View style={styles.songInfo}>
                      <Text style={styles.songName}>
                        {song.name} {isPlaying && currentSong === song.name && "🎵"}
                      </Text>
                      <Text style={styles.songArtist}>{song.artist}</Text>
                      <Text style={styles.songDescription}>{song.description}</Text>
                      {isPlaying && currentSong === song.name && (
                        <Text style={styles.playingText}>🎶 Playing... 🎶</Text>
                      )}
                    </View>
                    <View style={styles.songCost}>
                      <FontAwesome name="bolt" size={12} color="#f59e0b" />
                      <Text style={styles.staminaCost}>{song.staminaCost}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              
            </View>
          </View>
        </Modal>

        {/* Stat Boost Popup */}
        <Modal
          visible={showStatBoost}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.statBoostModal}>
              <Text style={styles.statBoostTitle}>🎵 Music Played! 🎵</Text>
              <Text style={styles.statBoostMessage}>{statBoostMessage}</Text>
              <Pressable
                style={styles.statBoostButton}
                onPress={() => {
                  setShowStatBoost(false);
                  setShowJukeboxModal(false);
                }}
              >
                <Text style={styles.statBoostButtonText}>Awesome!</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    paddingHorizontal: 4,
    height: 40,
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
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
    marginTop: -10,
    textAlign: 'center',
  },
  dinerImageContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  dinerImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    marginTop: -5,
    marginBottom: -5,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  pubActivityItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 12,
    marginBottom: 8,
    width: '80%',
    alignSelf: 'center',
  },
  pubActivityPressable: {
    width: '100%',
  },
  pubActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pubActivityInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  pubActivityImageIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    alignSelf: 'center',
  },
  pubActivityText: {
    flex: 1,
  },
  pubActivityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  pubActivityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  pubActivityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
  },
  activityItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
    marginHorizontal: 0,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  activityIcon: {
    marginRight: 12,
    alignSelf: 'center',
  },
  activityText: {
    flex: 1,
    marginLeft: 8,
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  attendantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  zaraImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 15,
  },
  speechBubble: {
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.3)',
    maxWidth: 300,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0d9488',
    marginBottom: 4,
    textAlign: 'left',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
  },
  menuTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d9488',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
    textShadowColor: '#5eead4',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#f0fdfa',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#0d9488',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d9488',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#374151',
    lineHeight: 14,
    fontStyle: 'italic',
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  menuItemPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#0d9488',
    fontWeight: 'bold',
  },
  // Jukebox Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  jukeboxModal: {
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    paddingTop: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    width: '100%',
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    justifyContent: 'flex-start',
  },
  jukeboxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  jukeboxTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  staminaDisplay: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 8,
    borderRadius: 6,
  },
  songsList: {
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  jukeboxImage: {
    width: 84,
    height: 56,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 0,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  disabledSong: {
    opacity: 0.5,
    backgroundColor: 'rgba(139, 92, 246, 0.02)',
  },
  songInfo: {
    flex: 1,
    marginRight: 10,
  },
  songName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  songArtist: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 2,
  },
  songDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  songCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  staminaCost: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  jukeboxFooter: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  playingSong: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8b5cf6',
    borderWidth: 2,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3
  },
  playingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic'
  },
  statBoostModal: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statBoostTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
  },
  statBoostMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  statBoostButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  statBoostButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
});
