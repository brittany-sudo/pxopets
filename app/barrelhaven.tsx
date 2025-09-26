import React from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import BottomNavigation from '@/components/BottomNavigation';
import AppHeader from '@/components/AppHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function BarrelhavenScreen() {
  const activities = [
    {
      id: 'grape-stomping',
      name: 'Grape Stomping',
      description: 'Join the traditional grape stomping ceremony in the ancient stone vats. Feel the grapes squish between your toes as you help create the finest wines in the realm.',
      difficulty: 'Easy',
      reward: '50 coins',
      icon: 'tint'
    },
    {
      id: 'wine-tasting',
      name: 'Master Wine Tasting',
      description: 'Learn the art of wine appreciation from the master sommeliers. Discover the subtle notes of oak, berry, and earth in each vintage.',
      difficulty: 'Medium',
      reward: '75 coins',
      icon: 'glass'
    },
    {
      id: 'barrel-making',
      name: 'Barrel Crafting',
      description: 'Master the ancient art of barrel making using traditional tools and techniques. Shape oak staves into perfect wine barrels that will age the finest vintages.',
      difficulty: 'Hard',
      reward: '100 coins',
      icon: 'cog'
    },
    {
      id: 'vineyard-tour',
      name: 'Vineyard Tour',
      description: 'Explore the rolling hills and terraced vineyards that stretch as far as the eye can see. Learn about different grape varieties and their growing conditions.',
      difficulty: 'Easy',
      reward: '30 coins',
      icon: 'leaf'
    },
    {
      id: 'wine-cellar',
      name: 'Wine Cellar Exploration',
      description: 'Descend into the deep, cool wine cellars where thousands of bottles age in perfect conditions. Discover rare vintages and learn about the aging process.',
      difficulty: 'Medium',
      reward: '60 coins',
      icon: 'archive'
    },
    {
      id: 'medieval-feast',
      name: 'Medieval Feast',
      description: 'Attend a grand medieval feast in the great hall, complete with roasted meats, fresh bread, and of course, the finest wines from the cellar.',
      difficulty: 'Easy',
      reward: '40 coins',
      icon: 'cutlery'
    },
    {
      id: 'wine-competition',
      name: 'Wine Competition',
      description: 'Enter the annual wine competition where master vintners showcase their finest creations. Judge wines and help crown the champion vintage.',
      difficulty: 'Hard',
      reward: '120 coins',
      icon: 'trophy'
    },
    {
      id: 'herb-gardening',
      name: 'Herb Garden Tending',
      description: 'Tend to the medieval herb gardens that provide the secret ingredients for Barrelhaven\'s unique wine blends. Learn about ancient herbal lore.',
      difficulty: 'Medium',
      reward: '45 coins',
      icon: 'pagelines'
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
        <Text style={styles.title}>BARRELHAVEN</Text>

        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={require('@/assets/images/lil-wine-casket.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <BorderedBox style={styles.descriptionBox}>
          <Text style={styles.description}>
            A medieval-inspired winery village nestled in rolling hills. Learn ancient wine-making techniques, 
            explore stone cellars, and taste vintages aged in oak barrels by master vintners. Where tradition 
            meets craftsmanship in the art of winemaking.
          </Text>
        </BorderedBox>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>WINERY ACTIVITIES</Text>
        
        {activities.map((activity) => (
          <BorderedBox key={activity.id} style={styles.activityBox}>
            <Pressable 
              style={styles.activityContent}
              onPress={() => handleActivityPress(activity)}
            >
              <View style={styles.activityHeader}>
                <FontAwesome name={activity.icon as any} size={24} color="#8b5cf6" />
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
    textAlign: 'left',
    marginBottom: 20,
    alignSelf: 'flex-start',
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
