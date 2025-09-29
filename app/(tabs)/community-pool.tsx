import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Dimensions, Modal, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { usePathname } from 'expo-router';

// Import the community pool main image
const communityPoolMainImage = require('@/assets/images/community-pool-main.png');
const lilRubberduckImage = require('@/assets/images/lil-rubberduck.png');
const pooldolphinImage = require('@/assets/images/pooldolphin.png');
const poolAttendantImage = require('@/assets/images/pool-attendant.png');
const pooldogImage = require('@/assets/images/pooldog.png');
const pooldonutImage = require('@/assets/images/pooldonut.png');
const flamingoburgerImage = require('@/assets/images/flamingoburger.png');
const poolfloatImage = require('@/assets/images/poolfloat.png');

const { width } = Dimensions.get('window');

// Pool Dolphin NPC messages
const POOL_DOLPHIN_GREETINGS = [
  "Hey there, water warrior! Ready to make some waves?",
  "Welcome to the pool, dude! The water's perfect today.",
  "Nice to see you back! Ready for some chill swimming?",
  "Hey! The lanes are all yours - go crush those laps!",
  "What's up, swimmer? Ready to get your flow on?",
  "Welcome back to the pool! Time to make some magic happen.",
  "Hey there! The water's calling your name today.",
  "Ready to dive in? The pool's got your back, bro!",
  "Welcome! Let's make today's swim absolutely legendary.",
  "Hey! Ready to show the water what you're made of?"
];

export default function CommunityPoolScreen() {
  const [poolActivities, setPoolActivities] = useState<Array<{id: string, name: string, completed: boolean}>>([
    { id: 'swimming-laps', name: 'SWIMMING LAPS', completed: false },
    { id: 'poolside-sunbathing', name: 'POOLSIDE SUNBATHING', completed: false },
    { id: 'pool-volleyball', name: 'POOL VOLLEYBALL', completed: false },
    { id: 'snack-bar', name: 'SNACK BAR', completed: false }
  ]);

  const [poolTemperature, setPoolTemperature] = useState(78);
  const [weather, setWeather] = useState('Sunny');
  const [crowdLevel, setCrowdLevel] = useState('Moderate');
  const [npcMessage, setNpcMessage] = useState('');
  const [showNpcMessage, setShowNpcMessage] = useState(false);
  const [showSnackModal, setShowSnackModal] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);

  // Pool snack bar inventory
  const [snackInventory, setSnackInventory] = useState([
    { id: 's1', name: 'Pool Dog', price: 4, stock: 4, description: 'Classic pool hot dog', image: pooldogImage },
    { id: 's2', name: 'Pool Donut', price: 3, stock: 6, description: 'Sweet pool donut', image: pooldonutImage },
    { id: 's3', name: 'Flamingo Burger', price: 6, stock: 2, description: 'Tropical flamingo burger', image: flamingoburgerImage },
    { id: 's4', name: 'Pool Float', price: 8, stock: 3, description: 'Fun pool float toy', image: poolfloatImage },
  ]);

  // Show NPC greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomGreeting = POOL_DOLPHIN_GREETINGS[Math.floor(Math.random() * POOL_DOLPHIN_GREETINGS.length)];
      setNpcMessage(randomGreeting);
      setShowNpcMessage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleActivityPress = (activityId: string) => {
    if (activityId === 'snack-bar') {
      setShowSnackModal(true);
    } else {
      setPoolActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, completed: !activity.completed }
            : activity
        )
      );
    }
  };

  const handleSnackPurchase = (snack: any) => {
    if (snack.stock > 0) {
      Alert.alert(
        "Purchase Snack",
        `Buy ${snack.name} for ${snack.price} tickets?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy", onPress: () => {
            // Update stock
            setSnackInventory(prev => 
              prev.map(snackItem => 
                snackItem.id === snack.id 
                  ? { ...snackItem, stock: snackItem.stock - 1 }
                  : snackItem
              )
            );
            Alert.alert("Success!", `You bought ${snack.name}!`);
          }}
        ]
      );
    } else {
      Alert.alert("Out of Stock", "This snack is currently unavailable.");
    }
  };

  const completedActivities = poolActivities.filter(activity => activity.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>PXOBURBS COMMUNITY POOL</Text>
        </RNView>

        {/* Pool Banner */}
        <RNView style={styles.bannerContainer}>
          <Image source={communityPoolMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Pool Description */}
        <Text style={styles.description}>
          Welcome to the Pxoburbs Community Pool! This beautiful outdoor facility offers 
          swimming, diving, and relaxation for all ages. Whether you're looking to exercise, 
          have fun with friends, or just soak up some sun, our pool has something for everyone.
        </Text>

        {/* Pool Status */}
        <RNView style={styles.statusContainer}>
          <RNView style={styles.statusItem}>
            <FontAwesome name="thermometer-half" size={16} color="#0ea5e9" />
            <Text style={styles.statusLabel}>Water Temp</Text>
            <Text style={styles.statusValue}>{poolTemperature}°F</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="sun-o" size={16} color="#f59e0b" />
            <Text style={styles.statusLabel}>Weather</Text>
            <Text style={styles.statusValue}>{weather}</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="users" size={16} color="#8b5cf6" />
            <Text style={styles.statusLabel}>Crowd</Text>
            <Text style={styles.statusValue}>{crowdLevel}</Text>
          </RNView>
        </RNView>

        {/* Pool Dolphin NPC */}
        {showNpcMessage && (
          <RNView style={styles.attendantContainer}>
            <Pressable onPress={() => {
              const randomGreeting = POOL_DOLPHIN_GREETINGS[Math.floor(Math.random() * POOL_DOLPHIN_GREETINGS.length)];
              setNpcMessage(randomGreeting);
            }}>
              <RNView style={styles.speechBubble}>
                <Text style={styles.characterName}>ECHO THE LIFEGUARD:</Text>
                <Text style={styles.speechText}>
                  {npcMessage}
                </Text>
              </RNView>
            </Pressable>
            <Pressable onPress={() => {
              const randomGreeting = POOL_DOLPHIN_GREETINGS[Math.floor(Math.random() * POOL_DOLPHIN_GREETINGS.length)];
              setNpcMessage(randomGreeting);
            }}>
              <Image source={pooldolphinImage} style={styles.echoImage} />
            </Pressable>
          </RNView>
        )}

        {/* Pool Activities Wall Sign */}
        <RNView style={styles.wallSignContainer}>
          <Text style={styles.wallSignTitle}>POOL ACTIVITIES</Text>
          <RNView style={styles.wallSignContent}>
            {poolActivities.map((activity, index) => (
              <Pressable
                key={activity.id}
                style={[styles.wallSignItem, activity.completed && styles.wallSignItemCompleted]}
                onPress={() => {
                  if (activity.id === 'swimming-laps') {
                    router.navigate('/(tabs)/lap-trainer');
                  } else if (activity.id === 'pool-volleyball') {
                    router.navigate('/(tabs)/pool-volleyball');
                  } else {
                    handleActivityPress(activity.id);
                  }
                }}
              >
                <Text style={styles.wallSignItemText}>
                  {activity.name}
                </Text>
                {activity.completed && (
                  <FontAwesome name="check" size={16} color="#10b981" style={styles.checkIcon} />
                )}
              </Pressable>
            ))}
          </RNView>
        </RNView>

        {/* Pool Rules */}
        <RNView style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>POOL RULES</Text>
          <Image source={lilRubberduckImage} style={styles.rubberDuckImage} />
        </RNView>
        
        <RNView style={styles.rulesContainer}>
          <Text style={styles.ruleItem}>• No running on the pool deck</Text>
          <Text style={styles.ruleItem}>• Shower before entering the pool</Text>
          <Text style={styles.ruleItem}>• No glass containers near the pool</Text>
          <Text style={styles.ruleItem}>• Children under 12 must be supervised</Text>
          <Text style={styles.ruleItem}>• No diving in shallow areas</Text>
          <Text style={styles.ruleItem}>• Pool closes at 9:00 PM</Text>
        </RNView>


      </ScrollView>

      {/* Snack Bar Modal */}
      <Modal
        visible={showSnackModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSnackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalHeader}>
              <RNView style={styles.snackBarSign}>
                <Text style={styles.modalTitle}>POOL SNACK BAR</Text>
              </RNView>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowSnackModal(false)}
              >
                <FontAwesome name="times" size={16} color="#0f172a" />
              </Pressable>
            </RNView>

            {/* Pool Attendant Norm */}
            <RNView style={styles.attendantContainer}>
              <RNView style={styles.speechBubble}>
                <Text style={styles.characterName}>NORM THE POOL ATTENDANT:</Text>
                <Text style={styles.speechText}>
                  Welcome to the snack bar! Grab something to fuel your pool fun!
                </Text>
              </RNView>
              <Image source={poolAttendantImage} style={styles.attendantImage} />
            </RNView>
            
            <RNView style={styles.snackGrid}>
              {snackInventory.map((snack) => (
                <Pressable
                  key={snack.id}
                  style={[styles.snackItem, snack.stock === 0 && styles.snackItemOutOfStock]}
                  onPress={() => handleSnackPurchase(snack)}
                  disabled={snack.stock === 0}
                >
                  <RNView style={styles.snackIconContainer}>
                    <Image source={snack.image} style={styles.snackImage} />
                  </RNView>
                  <Text style={[styles.snackName, snack.stock === 0 && styles.snackNameOutOfStock]}>
                    {snack.name}
                  </Text>
                  <Text style={[styles.snackDescription, snack.stock === 0 && styles.snackDescriptionOutOfStock]}>
                    {snack.description}
                  </Text>
                  <RNView style={styles.snackFooter}>
                    <Text style={[styles.snackPrice, snack.stock === 0 && styles.snackPriceOutOfStock]}>
                      {snack.price} 🎫
                    </Text>
                    <Text style={[styles.snackStock, snack.stock === 0 && styles.snackStockOutOfStock]}>
                      Stock: {snack.stock}
                    </Text>
                  </RNView>
                </Pressable>
              ))}
            </RNView>
          </RNView>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  attendantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  speechBubble: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    maxWidth: 250,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#14b8a6',
    marginBottom: 4,
    textAlign: 'center',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
  },
  echoImage: {
    width: 61,
    height: 61,
    marginLeft: 16,
    imageRendering: 'pixelated' as any,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginTop: 4,
    marginBottom: 2,
  },
  statusValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  rulesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    flex: 1,
  },
  rubberDuckImage: {
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  wallSignContainer: {
    width: '100%',
    backgroundColor: '#0d9488',
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#14b8a6',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wallSignTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#14b8a6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    letterSpacing: 2,
  },
  wallSignContent: {
    padding: 20,
  },
  wallSignItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  wallSignItemCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  wallSignItemText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    letterSpacing: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  rulesContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    alignSelf: 'center',
    marginTop: -8,
  },
  ruleItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#14b8a6',
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  snackBarSign: {
    backgroundColor: '#0d9488',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#14b8a6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
  },
  snackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 8,
    alignItems: 'flex-start',
  },
  snackItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.2)',
    minHeight: 140,
  },
  snackItemOutOfStock: {
    backgroundColor: 'rgba(100, 116, 139, 0.05)',
    borderColor: 'rgba(100, 116, 139, 0.2)',
  },
  snackIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  snackImage: {
    width: 35,
    height: 35,
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
  },
  snackName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  snackNameOutOfStock: {
    color: '#64748b',
  },
  snackDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 8,
  },
  snackDescriptionOutOfStock: {
    color: '#9ca3af',
  },
  snackFooter: {
    alignItems: 'center',
  },
  snackPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#14b8a6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  snackPriceOutOfStock: {
    color: '#64748b',
  },
  snackStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#0f172a',
  },
  snackStockOutOfStock: {
    color: '#64748b',
  },
  attendantImage: {
    width: 55,
    height: 55,
    marginLeft: 12,
    imageRendering: 'pixelated' as any,
  },
});
