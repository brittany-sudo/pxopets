import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function LowtidePierScreen() {
  const [showOceanView, setShowOceanView] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showSeagulls, setShowSeagulls] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const oceanOpacity = useRef(new Animated.Value(0)).current;
  const seagullAnimation = useRef(new Animated.Value(0)).current;
  const pierOverlayOpacity = useRef(new Animated.Value(1)).current;

  const pierActivities = [
    {
      id: 'feed-seagulls',
      name: 'Feed Seagulls',
      description: 'Toss some breadcrumbs to the friendly seagulls that gather around the pier. Watch them swoop and dive for their treats.',
      icon: 'cutlery'
    },
    {
      id: 'check-tidepool',
      name: 'Check Tidepool',
      description: 'Explore the rocky tidepools that form during low tide. Discover tiny sea creatures and hidden treasures.',
      icon: 'search'
    },
    {
      id: 'message-bottle',
      name: 'Message in a Bottle',
      description: 'Write a message and send it out to sea in a glass bottle. Who knows where it might wash ashore.',
      icon: 'envelope'
    }
  ];

  // Start ocean animation
  useEffect(() => {
    if (showOceanView) {
      // Fade in ocean view
      Animated.timing(oceanOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Start wave animation
      const waveLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnimation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      );
      waveLoop.start();

      return () => {
        waveLoop.stop();
      };
    }
  }, [showOceanView]);

  // Seagull animation
  const animateSeagulls = () => {
    setIsFeeding(true);
    setShowSeagulls(true);
    
    // Fade out pier overlay
    Animated.timing(pierOverlayOpacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate seagulls flying in
    Animated.timing(seagullAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  // Stop feeding function
  const stopFeeding = () => {
    setIsFeeding(false);
    
    // Fade out seagulls
    Animated.timing(seagullAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setShowSeagulls(false);
    });

    // Fade in pier overlay
    Animated.timing(pierOverlayOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const generateRandomEvent = () => {
    // Show ocean view immediately
    setShowOceanView(true);
    
    // Wait 5 seconds, then show popup
    setTimeout(() => {
      const outcomes = [
        "The water remains perfectly calm... nothing happens.",
        "A gentle breeze passes by... nothing else.",
        "A small fish swims past... nothing of interest.",
        "The waves continue their steady rhythm... nothing special.",
        "A seagull flies overhead... nothing noteworthy.",
        "You find a small starfish ⭐",
        "You discover a rusty coin 🪙"
      ];
      
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setPopupMessage(randomOutcome);
      setShowPopup(true);
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>LOWTIDE PIER</Text>
        </RNView>

        {/* Pier Image with Overlay */}
        <RNView style={styles.imageContainer}>
          <Image 
            source={require('@/assets/images/lowtide-pierbanner.png')} 
            style={styles.pierImage}
          />
          <Animated.Image 
            source={require('@/assets/images/lowtide-pier.png')} 
            style={[
              styles.pierOverlay,
              {
                opacity: pierOverlayOpacity,
              },
            ]}
          />
          {isFeeding && (
            <Pressable 
              style={styles.stopFeedingButton}
              onPress={stopFeeding}
            >
              <FontAwesome name="times" size={10} color="#ffffff" />
              <Text style={styles.stopFeedingText}>Stop Feeding</Text>
            </Pressable>
          )}
          {showSeagulls && (
            <RNView style={styles.seagullContainer}>
              <Animated.Image 
                source={require('@/assets/images/seagull-standing.png')} 
                style={[
                  styles.seagull,
                  styles.seagull1,
                  {
                    opacity: seagullAnimation,
                  },
                ]}
              />
              <Animated.Image 
                source={require('@/assets/images/seagull-standing2.png')} 
                style={[
                  styles.seagull,
                  styles.seagull2,
                  {
                    opacity: seagullAnimation,
                  },
                ]}
              />
              <Animated.Image 
                source={require('@/assets/images/seagull-standing3.png')} 
                style={[
                  styles.seagull,
                  styles.seagull3,
                  {
                    opacity: seagullAnimation,
                  },
                ]}
              />
              <Animated.Image 
                source={require('@/assets/images/seagull-standing4.png')} 
                style={[
                  styles.seagull,
                  styles.seagull4,
                  {
                    opacity: seagullAnimation,
                  },
                ]}
              />
              <Animated.Image 
                source={require('@/assets/images/seagullsitting.png')} 
                style={[
                  styles.seagull,
                  styles.seagull5,
                  {
                    opacity: seagullAnimation,
                  },
                ]}
              />
            </RNView>
          )}
        </RNView>

        {/* Activities */}
        <Text style={styles.activitiesTitle}>PIER ACTIVITIES</Text>
        {pierActivities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            <Pressable 
              style={styles.activityPressable}
              onPress={() => {
                if (activity.id === 'feed-seagulls') {
                  animateSeagulls();
                } else if (activity.id === 'check-tidepool') {
                  // Handle check tidepool
                  console.log('Check tidepool');
                } else if (activity.id === 'message-bottle') {
                  // Handle message in bottle
                  console.log('Send message in bottle');
                }
              }}
            >
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityInfo}>
                  <FontAwesome name={activity.icon as any} size={20} color="#0ea5e9" style={styles.activityIcon} />
                  <RNView style={styles.activityText}>
                    <RNView style={styles.activityTitleRow}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                    </RNView>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        ))}

        {/* Animated Ocean View */}
        {showOceanView && (
          <Animated.View 
            style={[
              styles.oceanView,
              { opacity: oceanOpacity }
            ]}
          >
            {/* Sky Gradient */}
            <RNView style={styles.skyGradient}>
              <Text style={styles.oceanTitle}>Watching the water...</Text>
            </RNView>
            
            {/* Animated Waves */}
            <RNView style={styles.waveContainer}>
              {[...Array(8)].map((_, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.wave,
                    {
                      transform: [
                        {
                          translateY: waveAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -15 - (index * 3)],
                          }),
                        },
                        {
                          translateX: waveAnimation.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 5 - (index * 2), 0],
                          }),
                        },
                        {
                          scaleX: waveAnimation.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.05 + (index * 0.02), 1],
                          }),
                        },
                      ],
                      opacity: 0.9 - (index * 0.1),
                      height: 20 + (index * 2),
                    },
                  ]}
                />
              ))}
            </RNView>

          </Animated.View>
        )}

        {/* Popup */}
        {showPopup && (
          <RNView style={styles.popupOverlay}>
            <RNView style={styles.popupContainer}>
              <Text style={styles.popupTitle}>Observation</Text>
              <Text style={styles.popupMessage}>{popupMessage}</Text>
              <Pressable 
                style={styles.popupButton}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.popupButtonText}>Continue</Text>
              </Pressable>
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
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 80, // Same width as back button to balance the layout
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginTop: -20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  pierImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
  },
  pierOverlay: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    transform: [{ translateX: -50 }],
    width: 320,
    height: 240,
    resizeMode: 'contain',
  },
  seagullContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Bottom quarter of 400px image
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  seagull: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  seagull1: {
    // Right side - highest
    marginBottom: 70,
    marginLeft: 20,
  },
  seagull2: {
    // Left center - higher
    marginBottom: 60,
  },
  seagull3: {
    // Center - top of bottom quarter
    marginBottom: 100,
  },
  seagull4: {
    // Right side - medium-high (was seagull5)
    marginBottom: 55,
  },
  seagull5: {
    // Right center - lower (was seagull4)
    marginBottom: 35,
    width: 46,
    height: 46,
  },
  stopFeedingButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stopFeedingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    marginLeft: 6,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: -20,
  },
  activityItem: {
    marginBottom: 12,
  },
  activityPressable: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 14,
  },
  lookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 30,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  lookButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 40,
    borderWidth: 3,
    borderColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  popupTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  popupMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  popupButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  oceanView: {
    backgroundColor: '#0c4a6e',
    borderRadius: 16,
    padding: 0,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#0284c7',
    minHeight: 250,
    overflow: 'hidden',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  skyGradient: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  oceanTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#0ea5e9',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  waveContainer: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0ea5e9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0284c7',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
});
