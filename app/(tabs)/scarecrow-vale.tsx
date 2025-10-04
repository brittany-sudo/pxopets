import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the banner image
const lilScarecrowImage = require('@/assets/images/lil-scarecrow.png');

export default function ScarecrowValeScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [tickets, setTickets] = useState(150);
  const [energy, setEnergy] = useState(100);
  const [farmCoins, setFarmCoins] = useState(30);
  const [scarecrowGreeting, setScarecrowGreeting] = useState('');

  // Generate scarecrow greeting on mount
  React.useEffect(() => {
    const greetings = [
      "Welcome to Thistledown! I've been watching these fields for... well, I've lost count of the years...",
      "The crops grow strong here, but they need constant care. I do what I can...",
      "Sometimes I wonder if I'm really protecting the fields or if the fields are protecting me...",
      "The windmill creaks in the distance... it's been my companion for many harvests...",
      "Visitors are rare here. Most people prefer the bustling towns... but I like the quiet...",
      "The scarecrows here have seen many seasons... we're all part of the same family...",
      "The sunset over these fields is the most beautiful sight... if you have the patience to wait...",
      "I've learned that the best way to guard something is to become part of it...",
      "The birds used to be afraid of me... now they perch on my shoulders and tell me stories...",
      "Every season brings new challenges... but the fields always provide..."
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setScarecrowGreeting(randomGreeting);
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
      id: 'crop-watching',
      name: 'Crop Watching',
      description: 'Keep watch over the fields and protect the harvest.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'eye'
    },
    {
      id: 'scarecrow-building',
      name: 'Scarecrow Building',
      description: 'Craft the perfect scarecrow to guard the crops.',
      lightning: 30,
      difficulty: 'Medium',
      icon: 'user'
    },
    {
      id: 'field-walking',
      name: 'Field Walking',
      description: 'Take peaceful walks through the golden fields.',
      lightning: 15,
      difficulty: 'Easy',
      icon: 'road'
    },
    {
      id: 'bird-watching',
      name: 'Bird Watching',
      description: 'Observe the birds that visit the farm fields.',
      lightning: 18,
      difficulty: 'Easy',
      icon: 'twitter'
    },
    {
      id: 'harvest-helping',
      name: 'Harvest Helping',
      description: 'Assist with the seasonal crop harvest.',
      lightning: 35,
      difficulty: 'Hard',
      icon: 'leaf'
    },
    {
      id: 'windmill-tending',
      name: 'Windmill Tending',
      description: 'Maintain the old windmill that powers the farm.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'cog'
    },
    {
      id: 'farm-animals',
      name: 'Farm Animals',
      description: 'Care for the friendly farm animals.',
      lightning: 22,
      difficulty: 'Easy',
      icon: 'heart'
    },
    {
      id: 'sunset-meditation',
      name: 'Sunset Meditation',
      description: 'Find peace watching the sun set over the fields.',
      lightning: 28,
      difficulty: 'Medium',
      icon: 'sun-o'
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
          <Text style={styles.locationTitle}>THISTLEDOWN</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={lilScarecrowImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Mysterious fields where ancient scarecrows stand silent watch over golden crops. 
          The air is filled with the rustle of wheat and the gentle creaking of old windmills. 
          Here, the boundary between the living and the mystical blurs in the endless horizon.
        </Text>


        {/* Scarecrow Character */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>OLD SCARECROW:</Text>
            <Text style={styles.speechText}>{scarecrowGreeting}</Text>
          </RNView>
          <Image source={lilScarecrowImage} style={styles.scarecrowImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>FARM ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityInfo}>
                <FontAwesome name={activity.icon as any} size={22} color="#d97706" style={styles.activityIcon} />
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
                  color={favorites.has(activity.id) ? "#fbbf24" : "rgba(217, 119, 6, 0.3)"} 
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
    marginTop: 20,
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
    borderColor: '#d97706',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
  },
  bannerImage: {
    width: 150,
    height: 150,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 0,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  attendantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  speechBubble: {
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderColor: 'rgba(217, 119, 6, 0.3)',
    borderRadius: 6,
    borderWidth: 1,
    padding: 12,
    maxWidth: 300,
    marginRight: 5,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#d97706',
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
  scarecrowImage: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  activityItem: {
    backgroundColor: 'rgba(217, 119, 6, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#d97706',
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
    alignItems: 'flex-start',
    flex: 1,
  },
  activityIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  activityText: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#4b5563',
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
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
