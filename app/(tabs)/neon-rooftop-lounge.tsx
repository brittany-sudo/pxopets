import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { useInventory } from '@/store/InventoryStore';

// Import the rooftop lounge image
const neonLoungeRooftopImage = require('@/assets/images/neonloungerooftop.png');
const neonLoungeGuyImage = require('@/assets/images/neonloungeguy.png');

// Import cocktail images
const mirageMartiniImage = require('@/assets/images/mirage-martini.png');
const solarFlareSlingImage = require('@/assets/images/solar-flare-sling.png');
const auroraHighballImage = require('@/assets/images/aurora-highball.png');
const pinkSandShakerImage = require('@/assets/images/pink-sand-shaker.png');
const starlightSourImage = require('@/assets/images/starlight-sour.png');
const lunarLagoonImage = require('@/assets/images/lunar-lagoon.png');

// Image mapping for cocktails
const cocktailImageMap: { [key: string]: any } = {
  'mirage-martini': mirageMartiniImage,
  'solar-flare-sling': solarFlareSlingImage,
  'aurora-highball': auroraHighballImage,
  'pink-sand-shaker': pinkSandShakerImage,
  'starlight-sour': starlightSourImage,
  'lunar-lagoon': lunarLagoonImage,
};

export default function NeonRooftopLoungeScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [bartenderSaying, setBartenderSaying] = useState<string>('');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  
  // Game state and inventory
  const { state, spendGems, addStamina } = useSimpleGame();
  const { addItem } = useInventory();

  // Bartender's Personality
  const getBartenderGreeting = () => {
    const greetings = [
      "Welcome to the Neon Rooftop! I'm Pieter, your cosmic bartender. What stellar concoction can I craft for you tonight?",
      "Greetings, stargazer! I'm Pieter, and this rooftop has the best views in the galaxy. Care for a drink while you enjoy the cosmic scenery?",
      "Hey there, space traveler! I'm Pieter, and I mix the finest drinks this side of the nebula. What can I pour for you?",
      "Welcome to our celestial oasis! I'm Pieter, your bartender extraordinaire. Let me create something magical for you!",
      "Ah, another visitor to our neon paradise! I'm Pieter, and I specialize in drinks that are out of this world. What's your pleasure?",
      "Step into luxury! I'm Pieter, your rooftop bartender. Whether you want something classic or cosmic, I've got you covered!",
      "Welcome to the most exclusive spot in Crescent Oasis! I'm Pieter, and I'm here to make your evening unforgettable with the perfect drink.",
      "Greetings from the top of the world! I'm Pieter, your cosmic cocktail curator. Ready to taste something extraordinary?",
      "Welcome to our neon sanctuary! I'm Pieter, and I believe every great night starts with the perfect drink. What shall it be?",
      "Hello, cosmic wanderer! I'm Pieter, your bartender and guide to liquid bliss. Let's find you the perfect drink for this stellar evening!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleBartenderInteraction = () => {
    setBartenderSaying(getBartenderGreeting());
  };

  const handleCocktailPurchase = (cocktail: any) => {
    // Check if player has enough gems
    if (state.gems >= cocktail.price) {
      setSelectedCocktail(cocktail);
      setShowPurchaseModal(true);
    } else {
      // Show insufficient gems message
      Alert.alert(
        "Not Enough Gems", 
        `You need ${cocktail.price} gems to purchase ${cocktail.name}. You currently have ${state.gems} gems.`
      );
    }
  };

  const handleDrinkNow = () => {
    if (selectedCocktail && spendGems(selectedCocktail.price)) {
      // Actually grant the stamina
      addStamina(50);
      
      setShowPurchaseModal(false);
      setSuccessMessage({
        title: "Refreshing!",
        message: `You drink the ${selectedCocktail.name} and feel energized! +50 Stamina gained. The cosmic flavors dance on your palate as you enjoy the stellar views.`
      });
      setShowSuccessModal(true);
    }
  };

  const handleSaveToInventory = () => {
    if (selectedCocktail && spendGems(selectedCocktail.price)) {
      addItem({
        id: selectedCocktail.id,
        name: selectedCocktail.name,
        image: selectedCocktail.id + '.png',
        category: 'cocktails'
      });
      
      setShowPurchaseModal(false);
      setSuccessMessage({
        title: "Saved!",
        message: `Your ${selectedCocktail.name} has been carefully stored in your inventory. You can enjoy it later whenever you need a cosmic boost!`
      });
      setShowSuccessModal(true);
    }
  };

  // Initialize bartender's greeting on component mount
  React.useEffect(() => {
    setBartenderSaying(getBartenderGreeting());
  }, []);

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

  const cocktailMenu = [
    {
      id: 'mirage-martini',
      name: 'Mirage Martini',
      description: 'An ethereal cocktail that shimmers like desert heat',
      price: 3
    },
    {
      id: 'solar-flare-sling',
      name: 'Solar Flare Sling',
      description: 'Fiery and bold with a burst of cosmic energy',
      price: 3
    },
    {
      id: 'aurora-highball',
      name: 'Aurora Highball',
      description: 'Colorful layers that dance like northern lights',
      price: 3
    },
    {
      id: 'pink-sand-shaker',
      name: 'Pink Sand Shaker',
      description: 'Smooth and elegant with desert rose essence',
      price: 3
    },
    {
      id: 'starlight-sour',
      name: 'Starlight Sour',
      description: 'Tangy and bright with twinkling citrus notes',
      price: 3
    },
    {
      id: 'lunar-lagoon',
      name: 'Lunar Lagoon',
      description: 'Cool and mysterious like moonlit waters',
      price: 3
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/neon-casino')}
          >
            <FontAwesome name="arrow-left" size={12} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <RNView style={styles.titleContainer}>
            <Text style={styles.locationTitle}>NEON ROOFTOP LOUNGE</Text>
          </RNView>
        </RNView>

        {/* Rooftop Image */}
        <Image source={neonLoungeRooftopImage} style={styles.rooftopImage} />

        {/* Pieter the Bartender */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>PIETER:</Text>
            <Text style={styles.speechText}>
              {bartenderSaying}
            </Text>
          </RNView>
          <Image source={neonLoungeGuyImage} style={styles.bartenderImage} />
        </RNView>

        {/* Chat with Pieter */}
        <Pressable 
          style={styles.chatButton}
          onPress={handleBartenderInteraction}
        >
          <FontAwesome name="user" size={16} color="#ec4899" />
          <Text style={styles.chatButtonText}>Chat with Pieter</Text>
        </Pressable>

        {/* Cocktail Shop Title */}
        <Text style={styles.menuTitle}>COSMIC COCKTAIL COLLECTION</Text>
        
        {/* Cocktail Grid */}
        <RNView style={styles.cocktailGrid}>
          {cocktailMenu.map((cocktail) => (
            <RNView key={cocktail.id} style={styles.cocktailCard}>
              <Pressable 
                style={styles.cocktailPressable}
                onPress={() => handleCocktailPurchase(cocktail)}
              >
                <RNView style={styles.cocktailIconContainer}>
                  <Image 
                    source={cocktailImageMap[cocktail.id]} 
                    style={styles.cocktailImage}
                    resizeMode="contain"
                  />
                </RNView>
                <RNView style={styles.cocktailInfo}>
                  <Text style={styles.cocktailName}>{cocktail.name}</Text>
                  <Text style={styles.cocktailDescription}>{cocktail.description}</Text>
                </RNView>
              </Pressable>
              <RNView style={styles.cocktailPriceContainer}>
                <RNView style={styles.cocktailPrice}>
                  <FontAwesome name="diamond" size={14} color="#06b6d4" />
                  <Text style={styles.cocktailPriceText}>{cocktail.price}</Text>
                </RNView>
                <Pressable 
                  style={styles.buyButton}
                  onPress={() => handleCocktailPurchase(cocktail)}
                >
                  <Text style={styles.buyButtonText}>BUY</Text>
                </Pressable>
              </RNView>
            </RNView>
          ))}
        </RNView>

        {/* Custom Purchase Modal */}
        <Modal
          visible={showPurchaseModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPurchaseModal(false)}
        >
          <RNView style={styles.modalOverlay}>
            <RNView style={styles.purchaseModal}>
              <RNView style={styles.modalHeader}>
                <RNView style={styles.cocktailModalIconContainer}>
                  {selectedCocktail && (
                    <Image 
                      source={cocktailImageMap[selectedCocktail.id]} 
                      style={styles.cocktailModalImage}
                      resizeMode="contain"
                    />
                  )}
                </RNView>
                <Text style={styles.modalTitle}>{selectedCocktail?.name}</Text>
                <Text style={styles.modalSubtitle}>Pieter has crafted your cocktail!</Text>
              </RNView>

              <RNView style={styles.modalPricing}>
                <FontAwesome name="diamond" size={16} color="#06b6d4" />
                <Text style={styles.modalPrice}>3 Gems</Text>
              </RNView>

              <Text style={styles.modalMessage}>What would you like to do?</Text>

              <RNView style={styles.modalButtons}>
                <Pressable 
                  style={styles.drinkButton}
                  onPress={handleDrinkNow}
                >
                  <FontAwesome name="bolt" size={16} color="#ffffff" />
                  <Text style={styles.drinkButtonText}>Drink Now</Text>
                  <Text style={styles.drinkButtonSubtext}>+50 Stamina</Text>
                </Pressable>

                <Pressable 
                  style={styles.saveButton}
                  onPress={handleSaveToInventory}
                >
                  <FontAwesome name="archive" size={16} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save</Text>
                  <Text style={styles.saveButtonSubtext}>To Inventory</Text>
                </Pressable>
              </RNView>

              <Pressable 
                style={styles.cancelButton}
                onPress={() => setShowPurchaseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </RNView>
          </RNView>
        </Modal>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <RNView style={styles.modalOverlay}>
            <RNView style={styles.successModal}>
              <RNView style={styles.successHeader}>
                <RNView style={styles.successIconContainer}>
                  <FontAwesome 
                    name={successMessage.title === "Refreshing!" ? "bolt" : "check-circle"} 
                    size={40} 
                    color="#ec4899" 
                  />
                </RNView>
                <Text style={styles.successTitle}>{successMessage.title}</Text>
              </RNView>

              <Text style={styles.successMessage}>{successMessage.message}</Text>

              <Pressable 
                style={styles.successButton}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.successButtonText}>Awesome!</Text>
              </Pressable>
            </RNView>
          </RNView>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce7f3', // Light pink desert background
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ec4899',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  rooftopImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  attendantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '95%',
    alignSelf: 'center',
  },
  bartenderImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 2,
  },
  speechBubble: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ec4899',
    maxWidth: 250,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ec4899',
    marginBottom: 4,
    textAlign: 'center',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 16,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    marginBottom: 20,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  chatButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  menuTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
  cocktailGrid: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  cocktailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 0,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cocktailPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cocktailIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  cocktailImage: {
    width: 50,
    height: 50,
  },
  cocktailInfo: {
    flex: 1,
    paddingRight: 16,
  },
  cocktailName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
    lineHeight: 12,
  },
  cocktailDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
    marginBottom: 6,
  },
  cocktailPriceContainer: {
    alignItems: 'flex-end',
  },
  cocktailPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  cocktailPriceText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(236, 72, 153, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  purchaseModal: {
    backgroundColor: '#fce7f3',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ec4899',
    padding: 24,
    width: '90%',
    maxWidth: 350,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cocktailModalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cocktailModalImage: {
    width: 70,
    height: 70,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '600',
    textShadowColor: 'rgba(236, 72, 153, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modalSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#be185d',
    textAlign: 'center',
  },
  modalPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: '600',
  },
  modalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#be185d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  drinkButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.5)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  drinkButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 6,
  },
  drinkButtonSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ec4899',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 6,
  },
  saveButtonSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    marginTop: 2,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
  },
  cancelButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#be185d',
    textAlign: 'center',
  },
  // Success Modal Styles
  successModal: {
    backgroundColor: '#fce7f3',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ec4899',
    padding: 24,
    width: '85%',
    maxWidth: 320,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  successTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#ec4899',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(236, 72, 153, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  successMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#be185d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  successButton: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.5)',
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  successButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
});
