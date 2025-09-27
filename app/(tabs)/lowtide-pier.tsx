import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function LowtidePierScreen() {
  const [showOceanView, setShowOceanView] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const oceanOpacity = useRef(new Animated.Value(0)).current;

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
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/foggy-harbor')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Pier Image */}
        <Image 
          source={require('@/assets/images/lowtide-pier.png')} 
          style={styles.pierImage}
        />

        {/* Description */}
        <Text style={styles.description}>
          A peaceful pier extending into the harbor. Take a moment to watch the ocean and discover what the tides bring.
        </Text>

        {/* Look Button */}
        <Pressable 
          style={styles.lookButton}
          onPress={generateRandomEvent}
        >
          <FontAwesome name="eye" size={16} color="#ffffff" />
          <Text style={styles.lookButtonText}>Look Out to Sea</Text>
        </Pressable>

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
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0ea5e9',
    marginLeft: 8,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
  },
  pierImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
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
