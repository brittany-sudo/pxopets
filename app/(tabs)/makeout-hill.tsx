import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

export default function MakeoutHillScreen() {
  const [hasClimbed, setHasClimbed] = useState(false);

  const handleClimbHill = () => {
    Alert.alert(
      "Climb Makeout Hill",
      "Are you ready to climb the legendary Makeout Hill? This romantic spot has seen many memorable moments!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Climb Hill", onPress: () => {
          setHasClimbed(true);
          Alert.alert(
            "🏔️ You've Reached the Top! 🏔️",
            "Congratulations! You've successfully climbed Makeout Hill. The view from up here is absolutely breathtaking, and you can see the entire Pxoburbs spread out below you. This legendary spot has been the setting for countless romantic encounters and memorable moments throughout the years.\n\nTake a moment to enjoy the peaceful atmosphere and the beautiful sunset view!"
          );
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Welcome Message */}
        <BorderedBox>
          <Text style={styles.welcomeTitle}>Makeout Hill</Text>
          <Text style={styles.welcomeText}>
            Welcome to the legendary Makeout Hill! This romantic spot has been the setting for countless memorable moments and romantic encounters throughout the years. The gentle slope offers a perfect view of the Pxoburbs below, making it an ideal place for couples to spend quality time together.
          </Text>
        </BorderedBox>

        {/* Hill Information */}
        <BorderedBox>
          <Text style={styles.sectionTitle}>🏔️ ABOUT THE HILL 🏔️</Text>
          <RNView style={styles.infoContainer}>
            <Text style={styles.infoText}>• Perfect romantic setting with stunning views</Text>
            <Text style={styles.infoText}>• Gentle slope suitable for all fitness levels</Text>
            <Text style={styles.infoText}>• Best visited during sunset for magical atmosphere</Text>
            <Text style={styles.infoText}>• Popular spot for proposals and special moments</Text>
            <Text style={styles.infoText}>• Peaceful and quiet, away from the hustle and bustle</Text>
          </RNView>
        </BorderedBox>

        {/* Climb the Hill Section */}
        <BorderedBox>
          <Text style={styles.sectionTitle}>🚶‍♀️ CLIMB THE HILL 🚶‍♂️</Text>
          <Text style={styles.climbDescription}>
            Ready for an adventure? Climb to the top of Makeout Hill and discover why this spot has become so legendary. The journey is worth it for the incredible views and peaceful atmosphere you'll find at the summit.
          </Text>
          
          <Pressable
            style={[styles.climbButton, hasClimbed && styles.climbButtonCompleted]}
            onPress={handleClimbHill}
          >
            <FontAwesome 
              name={hasClimbed ? "check-circle" : "mountain"} 
              size={20} 
              color="#ffffff" 
              style={styles.climbIcon}
            />
            <Text style={styles.climbButtonText}>
              {hasClimbed ? "HILL CONQUERED!" : "CLIMB THE HILL"}
            </Text>
          </Pressable>

          {hasClimbed && (
            <RNView style={styles.completionMessage}>
              <Text style={styles.completionText}>
                🎉 Congratulations! You've successfully climbed Makeout Hill and experienced its legendary beauty!
              </Text>
            </RNView>
          )}
        </BorderedBox>

        {/* Tips Section */}
        <BorderedBox>
          <Text style={styles.sectionTitle}>💡 VISITOR TIPS 💡</Text>
          <RNView style={styles.tipsContainer}>
            <Text style={styles.tipText}>• Bring a blanket for comfortable seating</Text>
            <Text style={styles.tipText}>• Visit during golden hour for the best photos</Text>
            <Text style={styles.tipText}>• Pack some snacks for a romantic picnic</Text>
            <Text style={styles.tipText}>• Don't forget to bring a camera for memories</Text>
            <Text style={styles.tipText}>• Respect the peaceful nature of this special place</Text>
          </RNView>
        </BorderedBox>
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
  welcomeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 6,
  },
  climbDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  climbButton: {
    backgroundColor: '#ec4899',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  climbButtonCompleted: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  climbIcon: {
    marginRight: 8,
  },
  climbButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  completionMessage: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  completionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tipsContainer: {
    padding: 16,
  },
  tipText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 6,
  },
});


