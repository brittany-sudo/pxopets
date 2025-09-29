import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { usePathname } from 'expo-router';

// Import the community pool main image
const communityPoolMainImage = require('@/assets/images/community-pool-main.png');
const lilRubberduckImage = require('@/assets/images/lil-rubberduck.png');

const { width } = Dimensions.get('window');

export default function CommunityPoolScreen() {
  const [poolActivities, setPoolActivities] = useState<Array<{id: string, name: string, completed: boolean}>>([
    { id: 'swimming-laps', name: 'SWIMMING LAPS', completed: false },
    { id: 'diving-board', name: 'DIVING BOARD', completed: false },
    { id: 'poolside-sunbathing', name: 'POOLSIDE SUNBATHING', completed: false },
    { id: 'pool-volleyball', name: 'POOL VOLLEYBALL', completed: false }
  ]);

  const [poolTemperature, setPoolTemperature] = useState(78);
  const [weather, setWeather] = useState('Sunny');
  const [crowdLevel, setCrowdLevel] = useState('Moderate');

  const handleActivityPress = (activityId: string) => {
    setPoolActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const completedActivities = poolActivities.filter(activity => activity.completed).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>PXOBURBS COMMUNITY POOL</Text>
        </RNView>

        {/* Pool Banner */}
        <RNView style={styles.bannerContainer}>
          <Image source={communityPoolMainImage} style={styles.bannerImage} />
        </RNView>

        {/* Pool Description */}
        <Text style={styles.description}>
          Welcome to the Pxoburbs Community Pool! This beautiful outdoor facility offers 
          swimming, diving, and relaxation for all ages. Whether you're looking to exercise, 
          have fun with friends, or just soak up some sun, our pool has something for everyone.
        </Text>

        {/* Pool Status */}
        <RNView style={styles.statusContainer}>
          <RNView style={styles.statusItem}>
            <FontAwesome name="thermometer-half" size={16} color="#0ea5e9" />
            <Text style={styles.statusLabel}>Water Temp</Text>
            <Text style={styles.statusValue}>{poolTemperature}°F</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="sun-o" size={16} color="#f59e0b" />
            <Text style={styles.statusLabel}>Weather</Text>
            <Text style={styles.statusValue}>{weather}</Text>
          </RNView>
          <RNView style={styles.statusItem}>
            <FontAwesome name="users" size={16} color="#8b5cf6" />
            <Text style={styles.statusLabel}>Crowd</Text>
            <Text style={styles.statusValue}>{crowdLevel}</Text>
          </RNView>
        </RNView>

        {/* Pool Activities Wall Sign */}
        <RNView style={styles.wallSignContainer}>
          <Text style={styles.wallSignTitle}>POOL ACTIVITIES</Text>
          <RNView style={styles.wallSignContent}>
            {poolActivities.map((activity, index) => (
              <Pressable
                key={activity.id}
                style={[styles.wallSignItem, activity.completed && styles.wallSignItemCompleted]}
                onPress={() => handleActivityPress(activity.id)}
              >
                <Text style={styles.wallSignItemText}>
                  {activity.name}
                </Text>
                {activity.completed && (
                  <FontAwesome name="check" size={16} color="#10b981" style={styles.checkIcon} />
                )}
              </Pressable>
            ))}
          </RNView>
        </RNView>

        {/* Pool Rules */}
        <RNView style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>POOL RULES</Text>
          <Image source={lilRubberduckImage} style={styles.rubberDuckImage} />
        </RNView>
        
        <RNView style={styles.rulesContainer}>
          <Text style={styles.ruleItem}>• No running on the pool deck</Text>
          <Text style={styles.ruleItem}>• Shower before entering the pool</Text>
          <Text style={styles.ruleItem}>• No glass containers near the pool</Text>
          <Text style={styles.ruleItem}>• Children under 12 must be supervised</Text>
          <Text style={styles.ruleItem}>• No diving in shallow areas</Text>
          <Text style={styles.ruleItem}>• Pool closes at 9:00 PM</Text>
        </RNView>

        {/* Progress Summary */}
        {completedActivities > 0 && (
          <RNView style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Pool Session Progress</Text>
            <Text style={styles.progressText}>
              You've completed {completedActivities} out of {poolActivities.length} activities!
            </Text>
            <RNView style={styles.progressBar}>
              <RNView 
                style={[
                  styles.progressFill, 
                  { width: `${(completedActivities / poolActivities.length) * 100}%` }
                ]} 
              />
            </RNView>
          </RNView>
        )}

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
    borderColor: '#14b8a6',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 184, 166, 0.05)',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginTop: 4,
    marginBottom: 2,
  },
  statusValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  rulesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    marginBottom: -8,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'left',
    flex: 1,
  },
  rubberDuckImage: {
    width: 40,
    height: 40,
    marginLeft: 12,
  },
  wallSignContainer: {
    width: '100%',
    backgroundColor: '#0d9488',
    borderRadius: 8,
    borderWidth: 4,
    borderColor: '#14b8a6',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  wallSignTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#14b8a6',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    letterSpacing: 2,
  },
  wallSignContent: {
    padding: 20,
  },
  wallSignItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(20, 184, 166, 0.3)',
  },
  wallSignItemCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  wallSignItemText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    letterSpacing: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  rulesContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  ruleItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 16,
  },
  progressContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  progressTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#10b981',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
});
