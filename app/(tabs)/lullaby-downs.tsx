import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the banner image
const lullabyDownsMainImage = require('@/assets/images/lullaby-downs-main.png');
const lilGnomeImage = require('@/assets/images/lil-gnome.png');

export default function LullabyDownsScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [gnomeSaying, setGnomeSaying] = useState("");

  // Gnome's sweet and sleepy personality greetings
  const getGnomeGreeting = () => {
    const greetings = [
      "Oh my, visitors! Welcome to our sleepy little valley... *yawn*",
      "Hello there, dear friends! I'm so glad you found our peaceful grove...",
      "Oh goodness, new faces! Please, make yourselves comfortable... *stretches*",
      "Welcome, welcome! I was just having the most wonderful dream...",
      "Oh my stars, visitors! I hope you're ready for some gentle adventures...",
      "Hello there, sleepy travelers! The valley is so happy to see you...",
      "Oh my, what a delightful surprise! Please, rest your weary feet...",
      "Welcome to our dreamy little home! I was just tending to the sleepy flowers...",
      "Oh goodness, new friends! The gentle giants will be so pleased...",
      "Hello, dear ones! I hope you're ready for some peaceful magic..."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Initialize gnome's greeting
  React.useEffect(() => {
    setGnomeSaying(getGnomeGreeting());
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
      id: 'dreamers-grove',
      name: 'Dreamer\'s Grove',
      description: 'Pick magical fruits from an enchanted orchard where dreams grow on trees.',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'leaf'
    },
    {
      id: 'wizards-shop',
      name: 'Wizard\'s Dream Shop',
      description: 'Browse enchanted dream catchers and mystical sleep aids crafted by local wizards.',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'magic'
    },
    {
      id: 'snoring-giant',
      name: 'Snoring Giant',
      description: 'Visit the ancient sleeping dinosaur who snores peacefully through the night.',
      lightning: 12,
      difficulty: 'Easy',
      icon: 'bug'
    },
    {
      id: 'stardust-teahouse',
      name: 'Stardust Teahouse',
      description: 'Sip celestial teas infused with stardust and cosmic herbs.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'coffee'
    },
    {
      id: 'nap-nook',
      name: 'Nap Nook',
      description: 'Rent a room for wild, fantastical dreams and lucid adventures.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'bed'
    },
    {
      id: 'meditation-garden',
      name: 'Meditation Garden',
      description: 'Find inner peace among floating crystals and whispering willows.',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'circle'
    },
    {
      id: 'astronomy-tower',
      name: 'Astronomy Tower',
      description: 'Study the stars and planets from the highest tower in the valley.',
      lightning: 18,
      difficulty: 'Medium',
      icon: 'star'
    },
    {
      id: 'night-sky-gazing',
      name: 'Night Sky Gazing',
      description: 'Watch the stars twinkle in the peaceful darkness.',
      lightning: 5,
      difficulty: 'Easy',
      icon: 'moon-o'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>LULLABY DOWNS</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image 
            source={lullabyDownsMainImage} 
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          A dreamy valley where sleepy melodies drift through moonlit meadows. 
          Here, gentle giants rest beneath starlit skies, and the air is filled 
          with the soft whispers of ancient lullabies. Visitors come to find 
          peace, learn the art of dreaming, and discover the magic that exists 
          in the quiet moments between wakefulness and sleep.
        </Text>

        {/* Gnome Character */}
        <RNView style={styles.gnomeContainer}>
          <Image source={lilGnomeImage} style={styles.gnomeImage} />
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>SLEEPY GNOME:</Text>
            <Text style={styles.speechText}>
              {gnomeSaying}
            </Text>
          </RNView>
        </RNView>

        {/* Activities Section */}
        <Text style={styles.activitiesTitle}>SLEEPY VALLEY ATTRACTIONS</Text>
        
        <RNView style={styles.activitiesGrid}>
          {activities.map((activity) => (
            <Pressable
              key={activity.id}
              style={styles.activityCard}
              onPress={() => console.log(`Selected activity: ${activity.name}`)}
            >
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityIconContainer}>
                  <FontAwesome name={activity.icon as any} size={12} color="#8b5cf6" />
                </RNView>
              </RNView>
            
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityDescription}>{activity.description}</Text>
              
              <RNView style={styles.activityFooter}>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(activity.id)}
                >
                  <FontAwesome 
                    name={favorites.has(activity.id) ? "star" : "star-o"} 
                    size={12} 
                    color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"} 
                  />
                </Pressable>
                <RNView style={styles.difficultyContainer}>
                  <Text style={styles.difficultyText}>{activity.difficulty}</Text>
                </RNView>
              </RNView>
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
    backgroundColor: '#f8fafc',
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
    marginBottom: 5,
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
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 250,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  activitiesTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  activityCard: {
    width: '45%',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#7c3aed',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  activityHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  favoriteButton: {
    padding: 4,
  },
  difficultyContainer: {
    alignItems: 'center',
  },
  difficultyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  gnomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  speechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    maxWidth: 250,
    marginLeft: 10,
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
    fontSize: 9,
    color: '#374151',
    lineHeight: 12,
    textAlign: 'left',
  },
  gnomeImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
});
