import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const bagOfStarsMainImage = require('@/assets/images/bag-of-stars-main.png');
const forestMageImage = require('@/assets/images/forestmage.png');

export default function BagOfStarsForestScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [forestMageGreeting, setForestMageGreeting] = useState('');

  React.useEffect(() => {
    const greetings = [
      "Oh! Hello there... I don't often see visitors in my little corner of the forest...",
      "The stars taste different here, you know... sweeter, more... magical somehow...",
      "I was just nibbling on a constellation when you arrived... would you like some?",
      "Sometimes I wonder if the stars I eat are really stars, or just... dreams made solid...",
      "The other forest creatures think I'm strange for eating starlight, but it's so... delicious...",
      "I've been here so long, I think I might be part star myself now... do I glow?",
      "The Astrologer says I'm disrupting the cosmic balance, but... the stars are so pretty...",
      "When I was little, I used to think stars were just fireflies that got lost in the sky...",
      "The fox spirits won't trade with me anymore... they say I make the market too bright...",
      "Sometimes I dream I'm floating among the stars, and when I wake up... I'm still hungry..."
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setForestMageGreeting(randomGreeting);
  }, []);

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      return newFavorites;
    });
  };

  const activities = [
    {
      id: 'starfall-clearing',
      name: 'The Starfall Clearing',
      description: 'A wide grove where stars drop at night. The canopy above glows with thousands of trapped fragments.',
      lightning: 5,
      difficulty: 'Easy',
      icon: 'star'
    },
    {
      id: 'luminous-bakery',
      name: 'The Luminous Bakery',
      description: 'A chic little bakery carved into the trunk of a massive oak. Its ovens are powered by bottled starlight.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'cutlery'
    },
    {
      id: 'constellarium',
      name: 'The Constellarium',
      description: 'A tall, spiraled wooden tower strung with star fragments. Inside: maps, scrolls, glowing glass globes.',
      lightning: 12,
      difficulty: 'Medium',
      icon: 'book'
    },
    {
      id: 'lantern-fox-market',
      name: 'Lantern Fox Market',
      description: 'Alley of fox-shaped spirit stalls, glowing amber, selling odds and ends.',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'shopping-cart'
    },
    {
      id: 'dream-pool',
      name: 'Dream Pool',
      description: 'A dark pond glowing faintly with stars beneath the surface. Throw in a coin/star fragment → receive random "dream relic."',
      lightning: 10,
      difficulty: 'Medium',
      icon: 'tint'
    },
    {
      id: 'moth-priest-chapel',
      name: 'The Moth Priest\'s Chapel',
      description: 'A shrine where enormous glowing moths roost. The priests weave silken cocoons infused with starlight.',
      lightning: 15,
      difficulty: 'Hard',
      icon: 'home'
    },
    {
      id: 'crystal-fruit-orchard',
      name: 'The Orchard of Crystal Fruit',
      description: 'Trees that feed on starlight bear fruits like glass apples and glowing figs.',
      lightning: 7,
      difficulty: 'Easy',
      icon: 'leaf'
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
          <Text style={styles.locationTitle}>BAG OF STARS FOREST</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={bagOfStarsMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A mystical realm where starlight weaves through ancient oaks and crystal fruit 
          glows on silver branches. Here, the Astrologer reads fortunes in falling stars, 
          the Baker crafts pastries from bottled starlight, and fox spirits trade in 
          amber-lit markets. The boundary between dreams and reality dissolves in eternal twilight.
        </Text>

        {/* Forest Mage NPC */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>FOREST MAGE:</Text>
            <Text style={styles.speechText}>{forestMageGreeting}</Text>
          </RNView>
          <Image source={forestMageImage} style={styles.forestMageImage} />
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>STARLIT DESTINATIONS</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityCard}>
            <RNView style={styles.activityHeader}>
              <RNView style={styles.activityIconContainer}>
                <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" />
              </RNView>
              <RNView style={styles.activityContent}>
                <RNView style={styles.activityTitleRow}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                </RNView>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </RNView>
              <Pressable
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(activity.id)}
              >
                <FontAwesome 
                  name={favorites.has(activity.id) ? "star" : "star-o"} 
                  size={16} 
                  color={favorites.has(activity.id) ? "#fbbf24" : "#cbd5e1"} 
                />
              </Pressable>
            </RNView>
            <RNView style={styles.activityFooter}>
              <RNView style={styles.energyCost}>
                <FontAwesome name="bolt" size={14} color="#f59e0b" />
                <Text style={styles.energyText}>{activity.lightning} Energy</Text>
              </RNView>
              <RNView style={styles.activityType}>
                <Text style={styles.typeText}>Daily Activity</Text>
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
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
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
    marginTop: -10,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activityCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    marginRight: 8,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    flex: 1,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginTop: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.1)',
  },
  energyCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  energyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  activityType: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
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
  forestMageImage: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginLeft: 5,
  },
});
