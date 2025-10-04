import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the banner image
const gossamerMidwayMainImage = require('@/assets/images/gossamer-midway-main.png');
const gossamerTwinsImage = require('@/assets/images/gossamer-twins.png');

export default function GossamerMidwayScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [tickets, setTickets] = useState(150);
  const [energy, setEnergy] = useState(100);
  const [carnivalTokens, setCarnivalTokens] = useState(25);
  const [twinsGreeting, setTwinsGreeting] = useState('');

  // Generate twins greeting on mount
  React.useEffect(() => {
    const greetings = [
      "We... we don't usually talk to living people... but welcome to our carnival!",
      "The last person who visited our midway... well, they're still here somewhere...",
      "Our rides are perfectly safe! We've only had three... no, four... incidents this week.",
      "Don't mind the screams you hear - that's just our haunted house working properly!",
      "We've been running this carnival for 200 years... time moves differently here...",
      "The cotton candy is made from real clouds! And maybe some other things...",
      "Our fortune teller predicted you'd come today... she's been right 47 times in a row...",
      "The carousel horses are real... they just... stopped moving after a while...",
      "We hope you enjoy your stay! Most people do... eventually...",
      "The mirrors in our funhouse show your true reflection... if you dare to look..."
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setTwinsGreeting(randomGreeting);
  }, []);

  // Load starred activities from storage
  useEffect(() => {
    loadStarredActivities();
  }, []);

  const loadStarredActivities = async () => {
    try {
      const saved = await AsyncStorage.getItem('starredActivities');
      if (saved) {
        setFavorites(new Set(JSON.parse(saved)));
      }
    } catch (error) {
      console.error('Failed to load starred activities:', error);
    }
  };

  const toggleFavorite = async (activityId: string) => {
    try {
      const newFavorites = new Set(favorites);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('starredActivities', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Failed to save starred activities:', error);
    }
  };


  const activities = [
    {
      id: 'moonlit-ferris',
      name: 'Moonlit Ferris Wheel',
      description: 'Soar through the starry sky on this ethereal wheel that glows with lunar magic.',
      lightning: 35,
      difficulty: 'Medium',
      icon: 'circle'
    },
    {
      id: 'house-mirrors',
      name: 'House of Mirrors',
      description: 'Navigate through infinite reflections where reality bends and twists.',
      lightning: 25,
      difficulty: 'Easy',
      icon: 'square'
    },
    {
      id: 'fortune-teller-tent',
      name: 'Fortune Teller Tent',
      description: 'Have your future read by Madame Luna in her mystical tent.',
      lightning: 30,
      difficulty: 'Medium',
      icon: 'eye'
    },
    {
      id: 'zodiac-carousel',
      name: 'Zodiac Carousel',
      description: 'Ride celestial creatures through the constellations.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'star'
    },
    {
      id: 'star-candy-booth',
      name: 'Star Candy Booth',
      description: 'Taste the sweetness of captured starlight.',
      lightning: 15,
      difficulty: 'Easy',
      icon: 'heart'
    },
    {
      id: 'celestial-mask-shop',
      name: 'Celestial Mask Shop',
      description: 'Transform into cosmic beings with magical masks.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'user'
    },
    {
      id: 'celestial-menagerie',
      name: 'Celestial Menagerie',
      description: 'Meet creatures from distant galaxies.',
      lightning: 30,
      difficulty: 'Medium',
      icon: 'paw'
    },
    {
      id: 'cosmic-ring-toss',
      name: 'Cosmic Ring Toss',
      description: 'Test your aim with rings that orbit like planets.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'circle'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>GOSSAMER MIDWAY</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={gossamerMidwayMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Welcome to the most magical carnival in all of Pxopia! Step into a world where 
          stars become cotton candy, celestial creatures roam free, and every ride takes you 
          on a journey through the cosmos. This traveling wonder only appears under the 
          brightest moons, bringing joy and enchantment to all who visit.
        </Text>

        {/* Status Bar */}
        <RNView style={styles.statusBar}>
          <RNView style={styles.statusItem}>
            <FontAwesome name="ticket" size={14} color="#8b5cf6" />
            <Text style={styles.statusText}>{tickets}</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="bolt" size={14} color="#f59e0b" />
            <Text style={styles.statusText}>{energy}</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="star" size={14} color="#fbbf24" />
            <Text style={styles.statusText}>{favorites.size}</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="diamond" size={14} color="#ec4899" />
            <Text style={styles.statusText}>{carnivalTokens}</Text>
          </RNView>
        </RNView>

        {/* Gossamer Twins */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>GOSSAMER TWINS:</Text>
            <Text style={styles.speechText}>{twinsGreeting}</Text>
          </RNView>
          <Image source={gossamerTwinsImage} style={styles.twinsImage} />
        </RNView>

        {/* Carnival Tokens Section */}
        <RNView style={styles.tokensSection}>
          <Text style={styles.tokensTitle}>CARNIVAL TOKENS</Text>
          <Text style={styles.tokensDescription}>
            Earn tokens by playing games! Spend them at the booths below.
          </Text>
          <RNView style={styles.boothContainer}>
            <RNView style={styles.boothItem}>
              <FontAwesome name="gift" size={20} color="#ec4899" />
              <Text style={styles.boothName}>Prize Booth</Text>
              <Text style={styles.boothCost}>5 tokens</Text>
            </RNView>
            <RNView style={styles.boothItem}>
              <FontAwesome name="heart" size={20} color="#ec4899" />
              <Text style={styles.boothName}>Cotton Candy</Text>
              <Text style={styles.boothCost}>3 tokens</Text>
            </RNView>
            <RNView style={styles.boothItem}>
              <FontAwesome name="star" size={20} color="#ec4899" />
              <Text style={styles.boothName}>Stardust</Text>
              <Text style={styles.boothCost}>2 tokens</Text>
            </RNView>
            <RNView style={styles.boothItem}>
              <FontAwesome name="magic" size={20} color="#ec4899" />
              <Text style={styles.boothName}>Magic Potion</Text>
              <Text style={styles.boothCost}>8 tokens</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>MAGICAL ATTRACTIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <FontAwesome name={activity.icon as any} size={22} color="#8b5cf6" style={styles.activityIcon} />
                <RNView style={styles.activityText}>
                  <RNView style={styles.activityTitleRow}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                  </RNView>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </RNView>
              </RNView>
            </RNView>
            <RNView style={styles.activityFooter}>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(activity.id)}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#fbbf24" : "rgba(139, 92, 246, 0.3)"} 
                />
              </Pressable>
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
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
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
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
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
    marginBottom: 24,
    textAlign: 'left',
    alignSelf: 'flex-start',
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 6,
    padding: 8,
    marginTop: -10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    width: '90%',
    alignSelf: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
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
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
    maxWidth: 300,
    marginRight: 5,
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
    lineHeight: 14,
    textAlign: 'center',
  },
  twinsImage: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  tokensSection: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 16,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokensTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 8,
  },
  tokensDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 14,
  },
  boothContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  boothItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    padding: 8,
    alignItems: 'center',
    width: '48%',
    minHeight: 60,
    justifyContent: 'center',
  },
  boothName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 2,
  },
  boothCost: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ec4899',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activityItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
  },
  favoriteButton: {
    padding: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
