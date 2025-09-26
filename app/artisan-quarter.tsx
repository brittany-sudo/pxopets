import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';

// Import banner image
const lilPaletteImage = require('@/assets/images/lil-palette.png');

export default function ArtisanQuarterScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const activities = [
    {
      id: 'watercolor-painting',
      name: 'Watercolor Dreams',
      icon: 'paint-brush',
      color: '#ec4899',
      description: 'Create ethereal watercolor masterpieces inspired by Finnish landscapes and Parisian café culture.',
      reward: 'Artistic Soul Badge + 30 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'pottery-wheel',
      name: 'Ceramic Sculpting',
      icon: 'circle-o',
      color: '#8b5cf6',
      description: 'Shape clay into bohemian pottery pieces with organic, flowing forms and natural textures.',
      reward: 'Clay Master Badge + 25 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'textile-weaving',
      name: 'Loom Weaving',
      icon: 'th',
      color: '#f59e0b',
      description: 'Weave intricate textiles using traditional techniques and modern bohemian patterns.',
      reward: 'Weaver\'s Touch Badge + 20 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'jewelry-making',
      name: 'Handcrafted Jewelry',
      icon: 'diamond',
      color: '#10b981',
      description: 'Design and create unique jewelry pieces with natural stones and bohemian aesthetics.',
      reward: 'Jewelry Artisan Badge + 35 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'street-art',
      name: 'Mural Painting',
      icon: 'paint-brush',
      color: '#dc2626',
      description: 'Create vibrant street art murals that capture the soul of the bohemian quarter.',
      reward: 'Street Artist Badge + 40 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'candle-making',
      name: 'Artisan Candles',
      icon: 'fire',
      color: '#f97316',
      description: 'Craft scented candles with natural waxes and essential oils in bohemian containers.',
      reward: 'Candle Maker Badge + 15 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'book-binding',
      name: 'Handbound Journals',
      icon: 'book',
      color: '#7c3aed',
      description: 'Create beautiful handbound journals with decorative covers and hand-stitched pages.',
      reward: 'Bookbinder Badge + 25 Gems',
      difficulty: 'Medium'
    },
    {
      id: 'mosaic-art',
      name: 'Mosaic Mastery',
      icon: 'square',
      color: '#06b6d4',
      description: 'Design intricate mosaics using colorful tiles and broken ceramics in artistic patterns.',
      reward: 'Mosaic Artist Badge + 30 Gems',
      difficulty: 'Hard'
    },
    {
      id: 'calligraphy',
      name: 'Elegant Calligraphy',
      icon: 'pencil',
      color: '#84cc16',
      description: 'Master the art of beautiful handwriting and decorative lettering in various styles.',
      reward: 'Calligrapher Badge + 20 Gems',
      difficulty: 'Easy'
    },
    {
      id: 'wood-carving',
      name: 'Wood Sculpting',
      icon: 'tree',
      color: '#64748b',
      description: 'Carve intricate wooden sculptures inspired by nature and bohemian folk art.',
      reward: 'Wood Carver Badge + 35 Gems',
      difficulty: 'Hard'
    }
  ];

  const handleActivityPress = (activity: any) => {
    Alert.alert(
      `${activity.name}`,
      `${activity.description}\n\nDifficulty: ${activity.difficulty}\nReward: ${activity.reward}\n\nComing Soon!`,
      [
        { text: "Start Activity", onPress: () => console.log(`Starting ${activity.name}`) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={16} color="#0f172a" />
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          <View style={styles.placeholder} />
        </View>

        {/* Title */}
        <Text style={styles.title}>ARTISAN'S QUARTER</Text>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={lilPaletteImage}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <BorderedBox style={styles.descriptionBox}>
          <Text style={styles.description}>
            The bustling heart of Pxopets! This vibrant artisan quarter serves as the main village square where all the shops gather. 
            Master craftspeople display their wares, from pottery and paintings to handcrafted pet accessories. Browse the general store, 
            visit the pet boutique, grab a bite at the café, and discover unique treasures from traveling merchants. 
            The perfect place to shop, create, and soak in the community spirit!
          </Text>
        </BorderedBox>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>QUARTER ACTIVITIES</Text>
        
        {activities.map((activity) => (
          <BorderedBox key={activity.id} style={styles.activityBox}>
            <Pressable 
              style={styles.activityContent}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.activityHeader}>
                <FontAwesome name={activity.icon as any} size={24} color={activity.color} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <Pressable 
                  style={styles.starButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(activity.id);
                  }}
                >
                  <FontAwesome 
                    name={favorites.includes(activity.id) ? 'star' : 'star-o'} 
                    size={20} 
                    color="#f59e0b" 
                  />
                </Pressable>
              </View>
              <View style={styles.activityFooter}>
                <Text style={styles.difficulty}>{activity.difficulty}</Text>
                <Text style={styles.reward}>{activity.reward}</Text>
              </View>
            </Pressable>
          </BorderedBox>
        ))}
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 4,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  placeholder: {
    flex: 1,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  quarterDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    textAlign: 'left',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  activitiesList: {
    width: '100%',
    gap: 12,
  },
  activityItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  starButton: {
    padding: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  activityDifficulty: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
    marginBottom: 6,
  },
  activityReward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
  },
  descriptionBox: {
    width: '100%',
    marginBottom: 30,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    textAlign: 'left',
  },
  activityBox: {
    width: '100%',
    marginBottom: 12,
  },
  activityContent: {
    width: '100%',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficulty: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    opacity: 0.6,
  },
  reward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
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
    width: 150,
    height: 150,
  },
});
