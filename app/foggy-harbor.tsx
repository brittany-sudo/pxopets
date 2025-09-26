import React from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import BottomNavigation from '@/components/BottomNavigation';
import AppHeader from '@/components/AppHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function FoggyHarborScreen() {
  const activities = [
    {
      id: 'lobster-trap',
      name: 'Lobster Trap Master',
      description: 'Learn the ancient art of lobster trapping from weathered old salts. Set traps, check buoys, and haul in the day\'s catch while listening to tales of the sea.',
      difficulty: 'Medium',
      reward: '50 coins',
      icon: 'anchor'
    },
    {
      id: 'fog-navigation',
      name: 'Fog Navigation',
      description: 'Master the art of navigating through thick coastal fog using only sound, instinct, and ancient maritime wisdom. Not for the faint of heart.',
      difficulty: 'Hard',
      reward: '75 coins',
      icon: 'compass'
    },
    {
      id: 'tall-tales',
      name: 'Tall Tales Tavern',
      description: 'Gather around the crackling fire at the Rusty Anchor Tavern. Listen to legendary sea stories, share your own adventures, and maybe even spot a ghost ship through the mist.',
      difficulty: 'Easy',
      reward: '25 coins',
      icon: 'glass'
    },
    {
      id: 'lighthouse-keeper',
      name: 'Lighthouse Keeper',
      description: 'Tend to the ancient lighthouse that guides ships through the treacherous waters. Keep the beacon burning bright and watch for ships in distress.',
      difficulty: 'Medium',
      reward: '60 coins',
      icon: 'lightbulb-o'
    },
    {
      id: 'storm-watching',
      name: 'Storm Watching',
      description: 'Experience the raw power of Atlantic storms from the safety of the harbor breakwater. Watch massive waves crash against the rocks while the wind howls.',
      difficulty: 'Easy',
      reward: '30 coins',
      icon: 'cloud'
    },
    {
      id: 'net-mending',
      name: 'Net Mending Circle',
      description: 'Join the local fishermen in the time-honored tradition of mending fishing nets. Learn intricate knots and listen to stories passed down through generations.',
      difficulty: 'Easy',
      reward: '20 coins',
      icon: 'th'
    },
    {
      id: 'harbor-mystery',
      name: 'Harbor Mystery',
      description: 'Investigate the mysterious disappearances that have plagued Foggy Harbor. Follow clues through the fog-shrouded streets and uncover the town\'s dark secrets.',
      difficulty: 'Hard',
      reward: '100 coins',
      icon: 'search'
    },
    {
      id: 'fog-horn',
      name: 'Fog Horn Keeper',
      description: 'Operate the town\'s iconic fog horn that echoes mournfully across the harbor. Learn the different signals and keep ships safe in the thickest fog.',
      difficulty: 'Medium',
      reward: '45 coins',
      icon: 'volume-up'
    }
  ];

  const handleActivityPress = (activity: any) => {
    console.log('Activity pressed:', activity.name);
    // TODO: Implement activity logic
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <FontAwesome name="arrow-left" size={16} color="#0f172a" />
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          <View style={styles.placeholder} />
        </View>

        {/* Title */}
        <Text style={styles.title}>FOGGY HARBOR</Text>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/lil-anchor.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <BorderedBox style={styles.descriptionBox}>
          <Text style={styles.description}>
            A dreary Maine fishing town shrouded in mist. Where weathered lobster boats bob in the harbor, 
            old salts tell tall tales at the tavern, and the foghorn's mournful call echoes through the night. 
            Perfect for those who love the melancholy beauty of coastal life.
          </Text>
        </BorderedBox>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>HARBOR ACTIVITIES</Text>
        
        {activities.map((activity) => (
          <BorderedBox key={activity.id} style={styles.activityBox}>
            <Pressable 
              style={styles.activityContent}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.activityHeader}>
                <FontAwesome name={activity.icon as any} size={24} color="#64748b" />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <Pressable style={styles.starButton}>
                  <FontAwesome name="star-o" size={20} color="#f59e0b" />
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
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
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
    textAlign: 'center',
    marginBottom: 20,
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
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  activityBox: {
    width: '100%',
    marginBottom: 12,
  },
  activityContent: {
    width: '100%',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  activityInfo: {
    flex: 1,
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
    opacity: 0.8,
  },
  starButton: {
    padding: 4,
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
});
