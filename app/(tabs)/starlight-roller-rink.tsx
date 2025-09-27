import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

// Import the Starlight Roller Rink image
const starlightRollerRinkImage = require('@/assets/images/starlight-cinema-im.png'); // Using cinema image as placeholder

export default function StarlightRollerRinkScreen() {
  const [selectedSession, setSelectedSession] = useState(null);

  // Roller rink session options
  const [sessionOptions, setSessionOptions] = useState([
    { 
      id: '1', 
      name: 'Afternoon Skate', 
      price: 8, 
      time: '2:00 PM',
      description: 'Family-friendly skating session',
      available: true
    },
    { 
      id: '2', 
      name: 'Evening Skate', 
      price: 12, 
      time: '7:30 PM',
      description: 'Disco lights and music',
      available: true
    },
    { 
      id: '3', 
      name: 'Late Night Skate', 
      price: 10, 
      time: '10:45 PM',
      description: 'Adult-only session with DJ',
      available: true
    },
    { 
      id: '4', 
      name: 'VIP Skate Experience', 
      price: 25, 
      time: '8:00 PM',
      description: 'Private rink time with premium skates',
      available: false
    },
  ]);

  const handleSessionPurchase = (session: any) => {
    if (!session.available) {
      Alert.alert("Session Unavailable", "This session is currently sold out.");
      return;
    }

    Alert.alert(
      "Session Booked!",
      `You've booked ${session.name} for ${session.time}. Enjoy your skate session!`,
      [
        { text: "OK", onPress: () => setSelectedSession(session) }
      ]
    );
  };

  const activities = [
    {
      id: 'rent-skates',
      name: 'Rent Skates',
      description: 'Get your wheels for the session',
      lightning: 5,
      difficulty: 'Easy',
      icon: 'star'
    },
    {
      id: 'arcade-games',
      name: 'Arcade Games',
      description: 'Classic games while you take a break',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'gamepad'
    },
    {
      id: 'snack-bar',
      name: 'Snack Bar',
      description: 'Refuel with rink favorites',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'cutlery'
    },
    {
      id: 'photo-booth',
      name: 'Photo Booth',
      description: 'Capture your roller rink memories',
      lightning: 4,
      difficulty: 'Easy',
      icon: 'camera'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={16} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Roller Rink Image */}
        <RNView style={styles.imageContainer}>
          <Image source={starlightRollerRinkImage} style={styles.rollerRinkImage} />
        </RNView>

        {/* Title and Description */}
        <Text style={styles.title}>STARLIGHT ROLLER RINK</Text>
        <Text style={styles.description}>
          Step into a neon-lit wonderland where disco balls spin and wheels roll under the stars. 
          The Starlight Roller Rink is Pxoburbs' most iconic skating destination, featuring 
          retro vibes, classic arcade games, and the smoothest skating surface in town.
        </Text>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>RINK ACTIVITIES</Text>
        <RNView style={styles.activitiesContainer}>
          {activities.map((activity) => (
            <RNView key={activity.id} style={styles.activityItem}>
              <Pressable style={styles.activityPressable}>
                <RNView style={styles.activityHeader}>
                  <RNView style={styles.activityInfo}>
                    <FontAwesome name={activity.icon as any} size={24} color="#8b5cf6" style={styles.activityIcon} />
                    <RNView style={styles.activityText}>
                      <RNView style={styles.activityTitleRow}>
                        <Text style={styles.activityName}>{activity.name}</Text>
                        <RNView style={styles.ticketDisplay}>
                          <FontAwesome name="bolt" size={14} color="#06b6d4" />
                          <Text style={styles.ticketCountText}>{activity.lightning}</Text>
                        </RNView>
                      </RNView>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                    </RNView>
                  </RNView>
                </RNView>
              </Pressable>
            </RNView>
          ))}
        </RNView>

        {/* Session Booking */}
        <BorderedBox>
          <RNView style={styles.sessionHeader}>
            <Text style={styles.sessionTitle}>SKATING SESSIONS</Text>
            <Text style={styles.sessionSubtitle}>Book your time on the rink</Text>
          </RNView>
          <RNView style={styles.sessionsContainer}>
            {sessionOptions.map((session) => (
              <RNView key={session.id} style={styles.sessionItem}>
                <RNView style={styles.sessionInfo}>
                  <Text style={styles.sessionName}>{session.name}</Text>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionDescription}>{session.description}</Text>
                  <Text style={styles.sessionPrice}>{session.price} ⚡</Text>
                </RNView>
                <Pressable 
                  style={[
                    styles.bookButton, 
                    !session.available && styles.bookButtonDisabled
                  ]}
                  onPress={() => handleSessionPurchase(session)}
                  disabled={!session.available}
                >
                  <Text style={[
                    styles.bookButtonText,
                    !session.available && styles.bookButtonTextDisabled
                  ]}>
                    {session.available ? 'BOOK' : 'SOLD OUT'}
                  </Text>
                </Pressable>
              </RNView>
            ))}
          </RNView>
        </BorderedBox>

        {/* Selected Session Display */}
        {selectedSession && (
          <BorderedBox>
            <Text style={styles.selectedTitle}>Your Session</Text>
            <Text style={styles.selectedText}>
              {selectedSession.name} - {selectedSession.time}
            </Text>
          </BorderedBox>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
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
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  rollerRinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 24,
    textAlign: 'center',
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
  activitiesContainer: {
    marginBottom: 24,
  },
  activityItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    marginBottom: 12,
    padding: 12,
  },
  activityPressable: {
    width: '100%',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  },
  activityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },
  ticketDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketCountText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  sessionHeader: {
    marginBottom: 16,
  },
  sessionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  sessionsContainer: {
    gap: 12,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  sessionTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#06b6d4',
    marginBottom: 4,
  },
  sessionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  sessionPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bookButtonTextDisabled: {
    color: '#6b7280',
  },
  selectedTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  selectedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#06b6d4',
  },
});
