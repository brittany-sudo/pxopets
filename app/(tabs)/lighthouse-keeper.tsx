import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const lighthouseBannerImage = require('@/assets/images/harbor-lighthouse.png');
const lighthouseKeeperImage = require('@/assets/images/captains-lighthouse.png');
const lighthouseImage = require('@/assets/images/harbor-lighthouse.png');

export default function LighthouseKeeperScreen() {
  const [showLighthouse, setShowLighthouse] = useState(false);
  const [isMaintaining, setIsMaintaining] = useState(false);
  const [showBeacon, setShowBeacon] = useState(false);
  const [beaconAnimation] = useState(new Animated.Value(0));
  const [lighthouseAnimation] = useState(new Animated.Value(0));

  const lighthouseActivities = [
    {
      id: 'maintain-beacon',
      name: 'Maintain Beacon',
      description: 'Clean the lighthouse lens and ensure the beacon is working properly. A well-maintained beacon saves lives.',
      icon: 'lightbulb-o'
    },
    {
      id: 'watch-ships',
      name: 'Watch for Ships',
      description: 'Keep a vigilant watch for vessels in distress. Your keen eyes can spot trouble before it becomes disaster.',
      icon: 'binoculars'
    },
    {
      id: 'log-weather',
      name: 'Log Weather',
      description: 'Record weather conditions and sea state. Your observations help future sailors navigate these waters safely.',
      icon: 'cloud'
    }
  ];

  const animateBeacon = () => {
    setShowBeacon(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(beaconAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(beaconAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopBeacon = () => {
    setShowBeacon(false);
    beaconAnimation.stopAnimation();
    beaconAnimation.setValue(0);
  };

  const maintainLighthouse = () => {
    setIsMaintaining(true);
    setShowLighthouse(true);
    
    Animated.timing(lighthouseAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Stop maintenance after 5 seconds
    setTimeout(() => {
      setIsMaintaining(false);
      setShowLighthouse(false);
      lighthouseAnimation.setValue(0);
    }, 5000);
  };

  const handleActivityPress = (activityId: string) => {
    switch (activityId) {
      case 'maintain-beacon':
        maintainLighthouse();
        break;
      case 'watch-ships':
        animateBeacon();
        break;
      case 'log-weather':
        // Weather logging functionality could be added here
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/foggy-harbor')}
        >
          <FontAwesome name="arrow-left" size={12} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE WIDOW'S LIGHT</Text>
        </RNView>

        {/* Banner Image Container */}
        <RNView style={styles.bannerContainer}>
          <Image source={lighthouseBannerImage} style={styles.bannerImage} />
          
          {/* Lighthouse Keeper NPC */}
          <RNView style={styles.keeperContainer}>
            <Image source={lighthouseKeeperImage} style={styles.keeperImage} />
            <RNView style={styles.keeperSpeechBubble}>
              <Text style={styles.keeperSpeechText}>
                "Welcome to the Widow's Light, sailor. These waters are treacherous, but with a steady hand and keen eye, we keep all ships safe."
              </Text>
            </RNView>
          </RNView>

          {/* Lighthouse Overlay */}
          {showLighthouse && (
            <Animated.View style={[styles.lighthouseOverlay, { opacity: lighthouseAnimation }]}>
              <Image source={lighthouseImage} style={styles.lighthouseImage} />
            </Animated.View>
          )}

          {/* Beacon Light */}
          {showBeacon && (
            <Animated.View style={[styles.beaconContainer, { opacity: beaconAnimation }]}>
              <RNView style={styles.beaconLight} />
            </Animated.View>
          )}

          {/* Stop Beacon Button */}
          {showBeacon && (
            <Pressable style={styles.stopBeaconButton} onPress={stopBeacon}>
              <FontAwesome name="times" size={10} color="#ffffff" />
              <Text style={styles.stopBeaconText}>Stop Watch</Text>
            </Pressable>
          )}
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>LIGHTHOUSE DUTIES</Text>

        {/* Activities List */}
        {lighthouseActivities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <Pressable 
              style={styles.activityPressable} 
              onPress={() => handleActivityPress(activity.id)}
            >
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityInfo}>
                  <RNView style={styles.activityIconContainer}>
                    <FontAwesome name={activity.icon as any} size={20} color="#0ea5e9" style={styles.activityIcon} />
                  </RNView>
                  <RNView style={styles.activityText}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        ))}

        {/* Status Messages */}
        {isMaintaining && (
          <RNView style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Maintaining the lighthouse beacon... ensuring it shines bright for all sailors.
            </Text>
          </RNView>
        )}

        {showBeacon && (
          <RNView style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Keeping watch for ships in distress... the beacon guides them safely home.
            </Text>
          </RNView>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 80,
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
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  bannerContainer: {
    width: '100%',
    height: 300,
    borderWidth: 3,
    borderColor: '#0ea5e9',
    borderRadius: 4,
    marginTop: -20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  keeperContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: 250,
  },
  keeperImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 8,
  },
  keeperSpeechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 8,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    maxWidth: 180,
    position: 'relative',
  },
  keeperSpeechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    lineHeight: 10,
    textAlign: 'left',
  },
  lighthouseOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 80,
    height: 120,
  },
  lighthouseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  beaconContainer: {
    position: 'absolute',
    top: 20,
    right: 40,
    width: 20,
    height: 20,
  },
  beaconLight: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffff00',
    borderRadius: 10,
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  stopBeaconButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stopBeaconText: {
    color: '#ffffff',
    fontSize: 10,
    marginLeft: 6,
    fontFamily: 'Silkscreen_400Regular',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    marginTop: 0,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    textTransform: 'uppercase',
  },
  activityItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 12,
    borderWidth: 0,
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 70,
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityPressable: {
    width: '100%',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  activityInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 0,
    minHeight: 50,
    marginRight: 40,
  },
  activityIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIcon: {
    width: 28,
    height: 28,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 28,
  },
  activityText: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  activityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 3,
    textAlign: 'left',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 13,
    textAlign: 'justify',
  },
  statusContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  statusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 12,
  },
});