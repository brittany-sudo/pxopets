import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

export default function CommunityPoolScreen() {
  const [poolActivities, setPoolActivities] = useState<Array<{id: string, name: string, completed: boolean}>>([
    { id: 'swimming-laps', name: 'Swimming Laps', completed: false },
    { id: 'diving-board', name: 'Diving Board', completed: false },
    { id: 'poolside-sunbathing', name: 'Poolside Sunbathing', completed: false },
    { id: 'water-aerobics', name: 'Water Aerobics', completed: false },
    { id: 'pool-volleyball', name: 'Pool Volleyball', completed: false },
    { id: 'relaxation', name: 'Relaxation Time', completed: false }
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
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>PXOBURBS COMMUNITY POOL</Text>
        </RNView>

        {/* Pool Banner */}
        <RNView style={styles.bannerContainer}>
          <FontAwesome name="tint" size={60} color="#0ea5e9" />
          <Text style={styles.bannerText}>Community Pool</Text>
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

        {/* Pool Activities */}
        <Text style={styles.sectionTitle}>POOL ACTIVITIES</Text>
        
        <RNView style={styles.activitiesGrid}>
          {poolActivities.map((activity) => (
            <Pressable
              key={activity.id}
              style={[styles.activityCard, activity.completed && styles.activityCardCompleted]}
              onPress={() => handleActivityPress(activity.id)}
            >
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityIconContainer}>
                  {activity.id === 'swimming-laps' && <FontAwesome name="tint" size={20} color="#0ea5e9" />}
                  {activity.id === 'diving-board' && <FontAwesome name="arrow-down" size={20} color="#0ea5e9" />}
                  {activity.id === 'poolside-sunbathing' && <FontAwesome name="sun-o" size={20} color="#f59e0b" />}
                  {activity.id === 'water-aerobics' && <FontAwesome name="heart" size={20} color="#ef4444" />}
                  {activity.id === 'pool-volleyball' && <FontAwesome name="circle" size={20} color="#8b5cf6" />}
                  {activity.id === 'relaxation' && <FontAwesome name="leaf" size={20} color="#10b981" />}
                </RNView>
                <RNView style={styles.activityText}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  {activity.completed && (
                    <FontAwesome name="check-circle" size={16} color="#10b981" />
                  )}
                </RNView>
              </RNView>
            </Pressable>
          ))}
        </RNView>

        {/* Pool Rules */}
        <Text style={styles.sectionTitle}>POOL RULES</Text>
        
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
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
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
    height: 120,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  bannerText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#0ea5e9',
    marginTop: 8,
    textAlign: 'center',
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
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  activityCard: {
    width: '45%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  activityCardCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    alignItems: 'center',
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
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
