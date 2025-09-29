import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

/*
 * NPC SYSTEM DOCUMENTATION:
 * 
 * Current NPCs:
 * - Jerry-P64 (Pxoburbs Mall) - Robot janitor with time-based greetings
 * - Zara (Atomic Diner) - [To be implemented]
 * - Vinnie (Midnight Rewind) - [To be implemented] 
 * - Lyle (Starlight Roller Rink) - [To be implemented]
 * 
 * Each NPC should have:
 * - Time-based greeting system
 * - Interactive speech bubble/character
 * - Unique personality and speech patterns
 * - Random response generation
 */

// Import the mall image
const pxoburbsMallImage = require('@/assets/images/pxoburbs-mall-main.png');
const pxoburbsMallFountainImage = require('@/assets/images/pxoburbs-mall-fountain.png');
const lilComputer90Image = require('@/assets/images/lil-computer90.png');
const janitorJerryImage = require('@/assets/images/janitor-jerry-pxomall.png');
const pxoburbsMallBottomImage = require('@/assets/images/pxoburbs-mall-bottom.png');
const pxoburbsMallBottom2Image = require('@/assets/images/pxoburbs-bottom-2.png');

export default function PxoburbsMallScreen() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [mallSaying, setMallSaying] = useState("");

  // Jerry-P64's robot personality greetings based on time of day
  const getJerryGreeting = () => {
    const hour = new Date().getHours();
    const greetings = {
      morning: [
        "SYSTEM INITIALIZED. Good morning, human! Jerry-P64 reporting for duty.",
        "GREETINGS. Mall systems online. How may I assist you today?",
        "MORNING PROTOCOL ACTIVATED. Welcome to Pxoburbs Mall!",
        "BEEP BOOP. Jerry-P64 ready to serve. What do you need?",
        "GOOD MORNING, ORGANIC. All systems functioning at 100%."
      ],
      afternoon: [
        "AFTERNOON SCAN COMPLETE. Mall operations running smoothly.",
        "BEEP. Jerry-P64 here! Need help finding something?",
        "SYSTEM STATUS: All stores operational. How can I help?",
        "GREETINGS, HUMAN. Jerry-P64 at your service!",
        "AFTERNOON PROTOCOL: Welcome to Pxoburbs Mall!"
      ],
      evening: [
        "EVENING MODE ACTIVATED. Jerry-P64 still operational!",
        "BEEP BOOP. Evening greetings, human! Need assistance?",
        "SYSTEM CHECK: All systems green. Welcome to the mall!",
        "EVENING PROTOCOL: Jerry-P64 ready to help!",
        "GREETINGS. Mall still open for business. How can I assist?"
      ],
      night: [
        "NIGHT MODE ENGAGED. Jerry-P64 never sleeps!",
        "BEEP. Late night shopping? Jerry-P64 here to help!",
        "NIGHT PROTOCOL: All systems running 24/7!",
        "GREETINGS, NIGHT OWL. Jerry-P64 at your service!",
        "SYSTEM STATUS: Night operations active. Welcome!"
      ]
    };

    let timeCategory = 'afternoon';
    if (hour >= 5 && hour < 12) timeCategory = 'morning';
    else if (hour >= 12 && hour < 17) timeCategory = 'afternoon';
    else if (hour >= 17 && hour < 22) timeCategory = 'evening';
    else timeCategory = 'night';

    const timeGreetings = greetings[timeCategory];
    return timeGreetings[Math.floor(Math.random() * timeGreetings.length)];
  };

  // Initialize Jerry's greeting
  React.useEffect(() => {
    setMallSaying(getJerryGreeting());
  }, []);

  // Mall stores and food court
  const [mallStores, setMallStores] = useState([
    { id: 's1', name: 'Tech and Tunes', type: 'Electronics', description: 'Computer parts, tech accessories, and digital gadgets', price: 22, stock: 5, icon: 'computer', color: '#dbeafe' },
    { id: 's2', name: 'Fashion Forward', type: 'Clothing', description: 'Trendy apparel for all ages', price: 15, stock: 8, icon: 'shopping-bag', color: '#dbeafe' },
    { id: 's3', name: 'Book Nook', type: 'Books', description: 'Books, magazines, and comics', price: 8, stock: 12, icon: 'book', color: '#dbeafe' },
    { id: 's4', name: 'Lost and Found Kiosk', type: 'Service', description: 'Lost items and lost pet recovery services', price: 0, stock: 99, icon: 'search', color: '#dbeafe' },
    { id: 's5', name: 'Beauty Boutique', type: 'Beauty', description: 'Cosmetics and skincare', price: 12, stock: 10, icon: 'star', color: '#dbeafe' },
    { id: 's6', name: 'Toy Palace', type: 'Toys', description: 'Games, puzzles, and collectibles', price: 18, stock: 7, icon: 'gamepad', color: '#dbeafe' },
    { id: 's7', name: 'Pxoburbs Arcade', type: 'Entertainment', description: 'Classic arcade games and pinball machines', price: 5, stock: 15, icon: 'arcade', color: '#dbeafe' },
    { id: 'f1', name: 'Food Court', type: 'Dining', description: 'Burger Barn, Pizza Corner, Sushi Express, Ice Cream Dream, Coffee Corner, and Salad Station', price: 5, stock: 20, icon: 'cutlery', color: '#dbeafe' },
  ]);


  const handleStoreVisit = (store: any) => {
    if (store.stock > 0) {
      setSelectedStore(store);
      // Jerry's robot responses to store visits
      const robotResponses = [
        `BEEP BOOP. ${store.name} is operational! Jerry-P64 recommends this location.`,
        `SYSTEM SCAN: ${store.name} has excellent reviews. Jerry-P64 approves!`,
        `BEEP. ${store.name} detected! Jerry-P64 suggests checking it out.`,
        `ROBOT ANALYSIS: ${store.name} is a quality establishment. Jerry-P64 recommends!`,
        `BEEP BOOP. Jerry-P64 has processed ${store.name}. Highly recommended!`
      ];
      setMallSaying(robotResponses[Math.floor(Math.random() * robotResponses.length)]);
    } else {
      setMallSaying(`ERROR: ${store.name} is currently out of stock. Jerry-P64 apologizes for the inconvenience.`);
    }
  };

  const handleJerryInteraction = () => {
    // Generate a new random greeting when Jerry is tapped
    setMallSaying(getJerryGreeting());
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
          <Text style={styles.locationTitle}>PXOBURBS MALL</Text>
        </RNView>

        {/* Mall Image */}
        <RNView style={styles.imageContainer}>
          <Image source={pxoburbsMallImage} style={styles.mallImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Step into the bustling heart of Pxoburbs! The mall is a vibrant shopping destination 
          featuring the latest fashion, cutting-edge electronics, and a diverse food court. 
          Whether you're looking for trendy clothes, the newest gadgets, or a delicious meal, 
          the Pxoburbs Mall has everything you need for the perfect shopping experience.
        </Text>

        {/* Mall Directory */}
        <RNView style={styles.directoryContainer}>
          <BorderedBox style={styles.thickBorderBox}>
            {/* Mall Fountain */}
            <RNView style={styles.fountainContainer}>
              <Image source={pxoburbsMallFountainImage} style={styles.fountainImage} />
            </RNView>

            <RNView style={styles.directoryHeader}>
              <Text style={styles.directoryTitle}>MALL DIRECTORY</Text>
              <Text style={styles.directorySubtitle}>Find your favorite stores and eateries!</Text>
            </RNView>

            {/* Mall Attendant */}
            <RNView style={styles.attendantContainer}>
              <Pressable onPress={handleJerryInteraction}>
                <RNView style={styles.speechBubble}>
                    <Text style={styles.characterName}>JERRY-P64 THE JANITOR:</Text>
                  <Text style={styles.speechText}>
                    {mallSaying}
                  </Text>
                </RNView>
              </Pressable>
              <Pressable onPress={handleJerryInteraction}>
                <Image source={janitorJerryImage} style={styles.janitorJerryImage} />
              </Pressable>
            </RNView>

            {/* Stores Section */}
            <Text style={styles.sectionTitle}>STORES & SHOPS</Text>
            <RNView style={styles.storesList}>
              {mallStores.map((store) => (
                <Pressable
                  key={store.id}
                  style={[styles.storeCard, { backgroundColor: store.color }]}
                  onPress={() => handleStoreVisit(store)}
                  disabled={store.stock === 0}
                >
                  <RNView style={styles.storeContent}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <Text style={styles.storeType}>{store.type}</Text>
                    <Text style={styles.storeDescription}>{store.description}</Text>
                    
                    <RNView style={styles.storeFooter}>
                      <RNView style={styles.storePriceContainer}>
                        <Text style={styles.storePrice}>{store.price}</Text>
                        <FontAwesome name="bolt" size={8} color="#06b6d4" />
                      </RNView>
                    </RNView>
                  </RNView>
                </Pressable>
              ))}
            </RNView>

          </BorderedBox>
        </RNView>

        {/* Mall Bottom Images */}
        <RNView style={styles.mallBottomContainer}>
          <Image source={pxoburbsMallBottomImage} style={styles.mallBottomImage} />
          <Image source={pxoburbsMallBottom2Image} style={styles.mallBottomImage} />
        </RNView>

        {/* Selected Store Display */}
        {selectedStore && (
          <RNView style={styles.selectedStoreContainer}>
            <BorderedBox>
              <Text style={styles.selectedTitle}>Currently Visiting</Text>
              <Text style={styles.selectedText}>
                {selectedStore.name} - {selectedStore.type}
              </Text>
              <Text style={styles.selectedDescription}>
                {selectedStore.description}
              </Text>
            </BorderedBox>
          </RNView>
        )}

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
  imageContainer: {
    width: '90%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  mallImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fountainContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
  },
  fountainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    marginHorizontal: 40,
  },
  directoryContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  thickBorderBox: {
    width: '95%',
    alignItems: 'stretch',
  },
  directoryHeader: {
    marginBottom: 16,
  },
  directoryTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
  },
  directorySubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    maxWidth: 250,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 4,
    textAlign: 'center',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  storesList: {
    marginBottom: 20,
  },
  storeCard: {
    borderRadius: 4,
    padding: 10,
    marginBottom: 4,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  storeContent: {
    flex: 1,
  },
  storeName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'left',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  storeType: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    marginBottom: 3,
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  storeDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    marginBottom: 6,
    lineHeight: 9,
    textAlign: 'left',
  },
  storeFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  storePriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  storePrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  selectedStoreContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },
  janitorJerryImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  mallBottomContainer: {
    flexDirection: 'row',
    marginTop: -10,
    width: '100%',
    paddingHorizontal: 0,
    justifyContent: 'center',
  },
  mallBottomImage: {
    width: '52%',
    height: 200,
    resizeMode: 'contain',
    marginHorizontal: -20,
  },
});
