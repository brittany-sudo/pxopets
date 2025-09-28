import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the diner image
const atomicDinerImage = require('@/assets/images/atomic-diner-main.png');

// Import menu item images
const neonBurgerImage = require('@/assets/images/neon-burger.png');
const iceCreamSandwichImage = require('@/assets/images/icecreamsandwich.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const lilAtomicDinerImage = require('@/assets/images/lil-atomic-diner.png');

// Image mapping
const imageMap: { [key: string]: any } = {
  'neon-burger.png': neonBurgerImage,
  'icecreamsandwich.png': iceCreamSandwichImage,
  'gumballs.png': gumballsImage,
  'lil-atomic-diner.png': lilAtomicDinerImage,
};

export default function AtomicDinerScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
      name: 'Order Food',
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
      icon: 'neon-burger.png'
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
      icon: 'gumballs.png'
    },
    {
      id: 'cosmic-soda',
      name: 'Cosmic Soda',
      description: 'Fizzy drink that sparkles like the night sky',
      price: 1,
      stamina: 10,
      icon: 'neon-burger.png'
    },
    {
      id: 'moon-pie',
      name: 'Moon Pie',
      description: 'Sweet dessert that glows softly in the dark',
      price: 1,
      stamina: 18,
      icon: 'neon-burger.png'
    },
    {
      id: 'galaxy-salad',
      name: 'Galaxy Salad',
      description: 'Fresh greens with edible star-shaped croutons',
      price: 1,
      stamina: 14,
      icon: 'neon-burger.png'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/crescent-oasis')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>ATOMIC DINER</Text>
        </RNView>

        {/* Diner Image */}
        <RNView style={styles.dinerImageContainer}>
          <Image source={atomicDinerImage} style={styles.dinerImage} />
        </RNView>

        {/* Title */}
        <Text style={styles.title}>ATOMIC DINER</Text>

        {/* Zara the Waitress */}
        <RNView style={styles.zaraContainer}>
          <Image source={require('@/assets/images/zara-icon.png')} style={styles.zaraImage} />
          <RNView style={styles.speechBubble}>
            <Text style={styles.speechText}>
              "Welcome to the Atomic Diner! I'm Zara, your friendly alien waitress. 
              Try our glowing cosmic cuisine - it's out of this world!"
            </Text>
          </RNView>
        </RNView>

        {/* Activities */}
        <RNView style={styles.pubActivitiesContainer}>
          {dinerActivities.map((activity) => (
            <RNView key={activity.id} style={styles.pubActivityItem}>
              <Pressable style={styles.pubActivityPressable}>
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
        </RNView>

        {/* Menu */}
        <Text style={styles.menuTitle}>ATOMIC DINER MENU</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Higher up, below the status bar
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
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
    color: '#0ea5e9',
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
    height: '100%',
    resizeMode: 'cover',
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
  pubActivitiesContainer: {
    marginBottom: 24,
  },
  pubActivityItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 10,
    marginBottom: 8,
    width: '100%',
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
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
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
  zaraContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  zaraImage: {
    width: 58,
    height: 58,
    marginRight: 12,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
  },
  menuTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  menuItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    padding: 12,
    marginBottom: 8,
    width: '100%',
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
    color: '#0f172a',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    lineHeight: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  menuItemPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
