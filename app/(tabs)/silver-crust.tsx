import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const silverCrustImage = require('@/assets/images/thesilvercrust.png');
const aurelinImage = require('@/assets/images/silveraurelin.png');
const moonproofLoafImage = require('@/assets/images/moonproof-loaf.png');
const stardustSourdoughImage = require('@/assets/images/stardust-sourdough.png');

export default function SilverCrustScreen() {
  const [aurelinSaying, setAurelinSaying] = useState<string>('');

  // Aurelin's warm, magical baker personality
  const getAurelinGreeting = () => {
    const greetings = [
      "Welcome to The Silver Crust! Fresh stardust pastries, just out of the oven...",
      "Ah, a customer! I've been baking under the silver oak all morning...",
      "The starlight in these loaves is particularly bright today, dear friend...",
      "Come in, come in! The aroma of cosmic bread fills the air...",
      "I sense you're drawn to the magic in my ovens... what can I bake for you?",
      "The silver bark of this ancient tree makes the most wonderful oven...",
      "Fresh from the starlight kiln - each loaf carries a piece of the cosmos...",
      "Welcome, starlit traveler! My pastries are infused with celestial magic...",
      "The Silver Crust has been serving dreamers for centuries... what's your pleasure?",
      "I can see the hunger for something magical in your eyes... let me help..."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleAurelinInteraction = () => {
    setAurelinSaying(getAurelinGreeting());
  };

  // Initialize Aurelin's greeting on component mount
  React.useEffect(() => {
    setAurelinSaying(getAurelinGreeting());
  }, []);

  const handleItemPress = (item: any) => {
    Alert.alert(
      item.name,
      `${item.description}\n\nPrice: ${item.price} ✨`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Purchase", onPress: () => {
          Alert.alert("Purchase Complete!", `You've bought ${item.name} with stardust!`);
        }}
      ]
    );
  };

  const bakedGoods = [
    {
      id: 'moonproof-loaf',
      name: 'Moonproof Loaf',
      description: 'Dense bread that never goes stale, even under lunar cycles',
      price: 5,
      image: moonproofLoafImage
    },
    {
      id: 'stardust-sourdough',
      name: 'Stardust Sourdough',
      description: 'Tangy sourdough starter fed with cosmic dust and starlight',
      price: 4,
      image: stardustSourdoughImage
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/bag-of-stars-forest')}
        >
          <FontAwesome name="arrow-left" size={12} color="#6b7280" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE SILVER CRUST</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={silverCrustImage} style={styles.bannerImage} />
        </RNView>

        {/* Aurelin NPC */}
        <RNView style={styles.npcContainer}>
          <Pressable onPress={handleAurelinInteraction}>
            <Image source={aurelinImage} style={styles.npcImage} />
          </Pressable>
          <RNView style={styles.npcSpeechBubble}>
            <Text style={styles.npcCharacterName}>AURELIN:</Text>
            <Text style={styles.npcSpeechText}>
              {aurelinSaying}
            </Text>
          </RNView>
        </RNView>

        {/* Menu Title */}
        <Text style={styles.menuTitle}>BAKERY MENU</Text>

        {/* Baked Goods Grid */}
        <RNView style={styles.menuGrid}>
          {bakedGoods.map((item) => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleItemPress(item)}
            >
              <RNView style={styles.itemImageContainer}>
                <Image source={item.image} style={styles.itemImage} />
              </RNView>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.priceText}>{item.price} ✨</Text>
            </Pressable>
          ))}
        </RNView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Soft silver background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
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
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 10,
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
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    marginBottom: 5,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    marginTop: -5,
  },
  npcSpeechBubble: {
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    maxWidth: 280,
    marginLeft: 10,
  },
  npcCharacterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
    textAlign: 'left',
  },
  npcSpeechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    fontStyle: 'italic',
  },
  npcImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  menuTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    marginTop: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    textTransform: 'uppercase',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  menuItem: {
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    padding: 12,
    width: '48%',
    minHeight: 120,
    alignItems: 'center',
    shadowColor: '#6b7280',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  itemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#0f172a',
    marginBottom: 4,
    lineHeight: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  itemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    lineHeight: 11,
    textAlign: 'center',
    marginBottom: 6,
    flex: 1,
  },
  priceText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
