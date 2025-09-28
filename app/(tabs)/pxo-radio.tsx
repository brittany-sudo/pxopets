import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the radio station image
const pxoRadioImage = require('@/assets/images/pxo1018main.png');

export default function PXORadioScreen() {
  const [isOnAir, setIsOnAir] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Welcome to PXO 101.8 FM!');
  const [callerCount, setCallerCount] = useState(0);

  const handleToggleRadio = () => {
    setIsOnAir(!isOnAir);
    if (!isOnAir) {
      Alert.alert(
        "🎵 Radio On Air! 🎵",
        "PXO 101.8 FM is now broadcasting! Tune in for the best music and entertainment in Pxopia!"
      );
    } else {
      Alert.alert(
        "📻 Radio Off",
        "PXO 101.8 FM has gone off air. Thanks for listening!"
      );
    }
  };

  const handleRequestTrack = () => {
    const tracks = [
      "Midnight City Dreams",
      "Pixel Perfect Love",
      "Digital Sunset",
      "Retro Wave Vibes",
      "Neon Nights",
      "Synthwave Memories",
      "Electric Dreams",
      "Cyber Romance"
    ];
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    setCurrentTrack(randomTrack);
    Alert.alert(
      "🎵 Track Requested! 🎵",
      `"${randomTrack}" has been added to the playlist! The DJ will play it soon.`
    );
  };

  const handleTakeCall = () => {
    const callers = [
      "Sarah from Crescent Oasis",
      "Mike from Pxoburbs", 
      "Luna from Loomer's Wharf",
      "Alex from Atomic Diner",
      "Zoe from Midnight Rewind",
      "Jake from Lovers Hill"
    ];
    const randomCaller = callers[Math.floor(Math.random() * callers.length)];
    setCallerCount(prev => prev + 1);
    Alert.alert(
      "📞 Caller on Line! 📞",
      `${randomCaller} is calling in! They want to share their thoughts about the music.`
    );
  };

  const handleConfessional = () => {
    const confessions = [
      "I secretly love the old songs more than the new ones",
      "I always dance when no one's watching",
      "This radio station got me through my breakup",
      "I pretend to be a DJ in my room",
      "I have a crush on the voice of the station",
      "I listen to this station every single day"
    ];
    const randomConfession = confessions[Math.floor(Math.random() * confessions.length)];
    Alert.alert(
      "🎤 On-Air Confessional 🎤",
      `"${randomConfession}" - Thanks for sharing! Your confession will be read on air.`
    );
  };

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
          <Text style={styles.locationTitle}>PXO 101.8 FM</Text>
        </RNView>

        {/* Radio Station Image */}
        <RNView style={styles.imageContainer}>
          <Image source={pxoRadioImage} style={styles.radioImage} resizeMode="contain" />
        </RNView>

        {/* Radio Station Header */}
        <RNView style={styles.headerContainer}>
          <Text style={styles.stationName}>PXO 101.8 FM</Text>
          <Text style={styles.tagline}>Pxopia's Premier Radio Station</Text>
        </RNView>

        {/* Radio Controls */}
        <RNView style={styles.controlsContainer}>
          <Pressable 
            style={[styles.radioButton, isOnAir && styles.radioButtonActive]}
            onPress={handleToggleRadio}
          >
            <FontAwesome 
              name={isOnAir ? "stop" : "play"} 
              size={24} 
              color={isOnAir ? "#ffffff" : "#0ea5e9"} 
            />
            <Text style={[styles.radioButtonText, isOnAir && styles.radioButtonTextActive]}>
              {isOnAir ? "ON AIR" : "TUNE IN"}
            </Text>
          </Pressable>
        </RNView>

        {/* Current Track Display */}
        <RNView style={styles.trackContainer}>
          <Text style={styles.trackLabel}>Now Playing:</Text>
          <Text style={styles.trackTitle}>{currentTrack}</Text>
        </RNView>

        {/* Radio Activities */}
        <RNView style={styles.activitiesContainer}>
          <Text style={styles.activitiesTitle}>RADIO ACTIVITIES</Text>
          
          <Pressable style={styles.activityButton} onPress={handleRequestTrack}>
            <FontAwesome name="music" size={20} color="#8b5cf6" />
            <Text style={styles.activityText}>Request a Track</Text>
          </Pressable>

          <Pressable style={styles.activityButton} onPress={handleTakeCall}>
            <FontAwesome name="phone" size={20} color="#10b981" />
            <Text style={styles.activityText}>Take a Call</Text>
          </Pressable>

          <Pressable style={styles.activityButton} onPress={handleConfessional}>
            <FontAwesome name="microphone" size={20} color="#f59e0b" />
            <Text style={styles.activityText}>On-Air Confessional</Text>
          </Pressable>
        </RNView>

        {/* Station Stats */}
        <RNView style={styles.statsContainer}>
          <Text style={styles.statsTitle}>STATION STATS</Text>
          <RNView style={styles.statsRow}>
            <Text style={styles.statLabel}>Calls Taken:</Text>
            <Text style={styles.statValue}>{callerCount}</Text>
          </RNView>
          <RNView style={styles.statsRow}>
            <Text style={styles.statLabel}>Status:</Text>
            <Text style={[styles.statValue, { color: isOnAir ? '#10b981' : '#64748b' }]}>
              {isOnAir ? 'LIVE' : 'OFF AIR'}
            </Text>
          </RNView>
        </RNView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Higher up, below the status bar
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
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 6,
  },
  imageContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  radioImage: {
    width: '100%',
    height: 200,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stationName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 24,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  radioButtonActive: {
    backgroundColor: '#0ea5e9',
  },
  radioButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0ea5e9',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  radioButtonTextActive: {
    color: '#ffffff',
  },
  trackContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  trackLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  trackTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#0f172a',
  },
  activitiesContainer: {
    marginBottom: 30,
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  activityText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  statsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
