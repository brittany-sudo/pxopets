import React from 'react';
import { StyleSheet, View as RNView, ScrollView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSimpleGame } from '@/store/SimpleGameStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PlayerHomeScreen() {
  const { state, hydrated } = useSimpleGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <RNView style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, PxopetMaster</Text>
          <Text style={styles.welcomeSubtitle}>Ready for your next adventure?</Text>
        </RNView>

        {/* Quick Stats Grid */}
        <RNView style={styles.statsGrid}>
          <RNView style={styles.statCard}>
            <FontAwesome name="diamond" size={20} color="#8b5cf6" />
            <Text style={styles.statValue}>{state.coins.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Gems</Text>
          </RNView>
          <RNView style={styles.statCard}>
            <FontAwesome name="bolt" size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{state.stamina}</Text>
            <Text style={styles.statLabel}>Stamina</Text>
          </RNView>
          <RNView style={styles.statCard}>
            <FontAwesome name="ticket" size={20} color="#10b981" />
            <Text style={styles.statValue}>{state.tickets}</Text>
            <Text style={styles.statLabel}>Tickets</Text>
          </RNView>
          <RNView style={styles.statCard}>
            <FontAwesome name="trophy" size={20} color="#fbbf24" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Level</Text>
          </RNView>
        </RNView>

        {/* Active Pet Section */}
        <RNView style={styles.petSection}>
          <Text style={styles.sectionTitle}>Active Pet</Text>
          <RNView style={styles.petCard}>
            <RNView style={styles.petInfo}>
              <Image
                source={require('@/assets/images/tigerguy.png')}
                style={styles.petImage}
                resizeMode="contain"
              />
              <RNView style={styles.petDetails}>
                <Text style={styles.petName}>TigerGuy</Text>
                <Text style={styles.petLevel}>Level 12</Text>
                <RNView style={styles.petStats}>
                  <Text style={styles.petStat}>ATK 120</Text>
                  <Text style={styles.petStat}>DEF 96</Text>
                  <Text style={styles.petStat}>SPD 144</Text>
                </RNView>
              </RNView>
            </RNView>
            <Pressable style={styles.petActionButton}>
              <Text style={styles.petActionText}>View Details</Text>
            </Pressable>
          </RNView>
        </RNView>

        {/* Quick Actions */}
        <RNView style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <RNView style={styles.actionsGrid}>
            <Pressable style={styles.actionCard}>
              <FontAwesome name="compass" size={24} color="#8b5cf6" />
              <Text style={styles.actionTitle}>Explore</Text>
              <Text style={styles.actionSubtitle}>Discover new worlds</Text>
            </Pressable>
            <Pressable style={styles.actionCard}>
              <FontAwesome name="gamepad" size={24} color="#f59e0b" />
              <Text style={styles.actionTitle}>Games</Text>
              <Text style={styles.actionSubtitle}>Play mini-games</Text>
            </Pressable>
            <Pressable style={styles.actionCard}>
              <FontAwesome name="shopping-bag" size={24} color="#10b981" />
              <Text style={styles.actionTitle}>Shop</Text>
              <Text style={styles.actionSubtitle}>Buy items</Text>
            </Pressable>
            <Pressable style={styles.actionCard}>
              <FontAwesome name="paw" size={24} color="#fbbf24" />
              <Text style={styles.actionTitle}>Pets</Text>
              <Text style={styles.actionSubtitle}>Manage pets</Text>
            </Pressable>
          </RNView>
        </RNView>

        {/* Recent Activity */}
        <RNView style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <RNView style={styles.activityList}>
            <RNView style={styles.activityItem}>
              <FontAwesome name="star" size={16} color="#fbbf24" />
              <RNView style={styles.activityContent}>
                <Text style={styles.activityTitle}>Completed Atomic Surf</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </RNView>
              <Text style={styles.activityReward}>+50 gems</Text>
            </RNView>
            <RNView style={styles.activityItem}>
              <FontAwesome name="gift" size={16} color="#8b5cf6" />
              <RNView style={styles.activityContent}>
                <Text style={styles.activityTitle}>Found rare item</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </RNView>
              <Text style={styles.activityReward}>Moonpetal Tea</Text>
            </RNView>
            <RNView style={styles.activityItem}>
              <FontAwesome name="trophy" size={16} color="#f59e0b" />
              <RNView style={styles.activityContent}>
                <Text style={styles.activityTitle}>Level up!</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </RNView>
              <Text style={styles.activityReward}>Level 12</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Inventory Preview */}
        <RNView style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          <RNView style={styles.inventoryGrid}>
            <RNView style={styles.inventoryItem}>
              <Image 
                source={require('@/assets/images/moonpetal-tea.png')} 
                style={styles.inventoryImage}
                resizeMode="contain"
              />
              <Text style={styles.inventoryCount}>3</Text>
            </RNView>
            <RNView style={styles.inventoryItem}>
              <Image 
                source={require('@/assets/images/milkshakes.png')} 
                style={styles.inventoryImage}
                resizeMode="contain"
              />
              <Text style={styles.inventoryCount}>1</Text>
            </RNView>
            <RNView style={styles.inventoryItem}>
              <Image 
                source={require('@/assets/images/glowcorn.png')} 
                style={styles.inventoryImage}
                resizeMode="contain"
              />
              <Text style={styles.inventoryCount}>5</Text>
            </RNView>
            <RNView style={styles.inventoryItem}>
              <Text style={styles.emptySlot}>+</Text>
            </RNView>
            <RNView style={styles.inventoryItem}>
              <Text style={styles.emptySlot}>+</Text>
            </RNView>
            <RNView style={styles.inventoryItem}>
              <Text style={styles.emptySlot}>+</Text>
            </RNView>
          </RNView>
        </RNView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  petSection: {
    marginBottom: 24,
  },
  petCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  petImage: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  petLevel: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  petStats: {
    flexDirection: 'row',
    gap: 12,
  },
  petStat: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
  },
  petActionButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  petActionText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  actionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
  },
  activityReward: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  inventorySection: {
    marginBottom: 24,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  inventoryImage: {
    width: 40,
    height: 40,
  },
  inventoryCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    textAlign: 'center',
  },
  emptySlot: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#cccccc',
  },
});


