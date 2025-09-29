import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

// Import banner image
const makeoutHillMainImage = require('@/assets/images/makeout-hill-main.png');

// Import climbing discovery images
const hillTvImage = require('@/assets/images/hill-tv.png');
const shoesHillImage = require('@/assets/images/shoes-hill.png');
const lunchboxHillImage = require('@/assets/images/lunchbox-hill.png');
const ringHillImage = require('@/assets/images/ring-hill.png');
const loversHillViewImage = require('@/assets/images/lovers-hill-view.png');

export default function MakeoutHillScreen() {
  const [climbProgress, setClimbProgress] = useState(0);
  const [hasReachedTop, setHasReachedTop] = useState(false);
  const [lastFind, setLastFind] = useState('');
  const [lastFindImage, setLastFindImage] = useState(null);
  const [allFinds, setAllFinds] = useState([]);
  const [maxClimbs, setMaxClimbs] = useState(7);
  const [guaranteedFinds, setGuaranteedFinds] = useState(0);

  const handleClimbHill = () => {
    // Initialize guaranteed finds on first click
    if (guaranteedFinds === 0) {
      setGuaranteedFinds(3); // At least 3 finds in 7 steps
    }
    
    if (climbProgress < maxClimbs) {
      const newProgress = climbProgress + 1;
      setClimbProgress(newProgress);
      
      // Determine if this click should find something
      const shouldFind = guaranteedFinds > 0 || Math.random() < 0.15; // 15% chance for random finds
      
      let findResult = null;
      let findImage = null;
      let findMessage = '';
      
      if (shouldFind) {
        // Generate random number for probability
        const random = Math.random();
        
        if (random < 0.4) {
          // 40% chance - Hill TV
          findResult = 'tv';
          findImage = hillTvImage;
          findMessage = "You find a static TV on the way up, not plugged in but hissing with static noise.";
        } else if (random < 0.65) {
          // 25% chance - Shoes
          findResult = 'shoes';
          findImage = shoesHillImage;
          findMessage = "You discover a pair of abandoned shoes left behind by a previous visitor.";
        } else if (random < 0.85) {
          // 20% chance - Lunchbox
          findResult = 'lunchbox';
          findImage = lunchboxHillImage;
          findMessage = "You find an old lunchbox that someone must have forgotten during their picnic.";
        } else {
          // 15% chance - Ring (very rare)
          findResult = 'ring';
          findImage = ringHillImage;
          findMessage = "You discover a beautiful ring glinting in the sunlight - a valuable find!";
          
          // Special ring popup
          Alert.alert(
            "💍 RING FOUND! 💍",
            "You found a beautiful ring! This is a very rare and valuable discovery. You can keep this ring in your inventory."
          );
        }
        
        setLastFind(findMessage);
        setLastFindImage(findImage);
        
        // Add to all finds
        const newFind = { item: findResult, message: findMessage, image: findImage };
        setAllFinds(prev => [...prev, newFind]);
        
        // Decrease guaranteed finds if we used one
        if (guaranteedFinds > 0) {
          setGuaranteedFinds(prev => prev - 1);
        }
      } else {
        // Nothing found
        setLastFind("You continue climbing but find nothing of interest...");
        setLastFindImage(null);
      }
      
      if (newProgress === maxClimbs) {
        setHasReachedTop(true);
        
        // Anticlimactic summit descriptions
        const summitDescriptions = [
          "You finally reach the top and look over the edge. It's... underwhelming. The view is okay, I guess.",
          "Well, here you are at the summit. You peer over the edge and realize it's not as exciting as you thought.",
          "You made it to the top and glance down. The view is fine, but honestly, it's kind of anticlimactic.",
          "At the summit, you look over the edge. It's windy and the view is... well, it's a view.",
          "You reach the top and peer over the edge. It's not as spectacular as the legends made it sound.",
          "Finally at the summit, you look down. The view is decent but nothing to write home about.",
          "You're at the top now, looking over the edge. It's... it's a hill. With a view. That's about it."
        ];
        
        const randomDescription = summitDescriptions[Math.floor(Math.random() * summitDescriptions.length)];
        
        // Create summary of all finds
        const findSummary = allFinds.length > 0 
          ? allFinds.map(find => `• ${find.message}`).join('\n')
          : '• Nothing of note was found during your climb.';
        
        // Show the view image
        setLastFindImage(loversHillViewImage);
        setLastFind("You look over the edge from the summit...");
        
        Alert.alert(
          "🏔️ You Reached the Top 🏔️",
          `${randomDescription}\n\nWhat you found on your climb:\n${findSummary}`
        );
      } else {
        Alert.alert(
          "Climbing...",
          `You continue your ascent up Lovers Hill...\n\n${findMessage}`
        );
      }
    }
  };

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
          <Text style={styles.locationTitle}>LOVERS HILL</Text>
        </RNView>


        {/* Lore Summary - Premium Placard */}
        <RNView style={styles.placardContainer}>
          <RNView style={styles.placardImageContainer}>
            <Image 
              source={makeoutHillMainImage} 
              style={styles.placardImage} 
              resizeMode="cover" 
            />
          </RNView>
          <RNView style={styles.placardHeader}>
            <Text style={styles.placardTitle}>THE LEGEND OF LOVERS HILL</Text>
            <RNView style={styles.placardDivider} />
          </RNView>
          <Text style={styles.placardText}>
            For generations, Lovers Hill has been the sacred ground where young hearts first discover love. Countless couples have carved their initials into the ancient oak tree at its peak, and the gentle slope has witnessed thousands of first kisses, whispered promises, and stolen moments of romance.
          </Text>
          <Text style={styles.placardText}>
            Legend says that those who reach the summit together are destined to find true love, while those who climb alone often discover something precious left behind by previous visitors - whether it's a forgotten love letter, a lost piece of jewelry, or simply the peaceful solitude that allows them to reflect on matters of the heart.
          </Text>
          <RNView style={styles.placardFooter}>
            <Text style={styles.placardSignature}>~ The Keepers of Pxopia ~</Text>
          </RNView>
        </RNView>

        {/* Visitor Tips - Wooden Sign */}
        <RNView style={styles.woodenSign}>
          <Text style={styles.signTitle}>VISITOR TIPS</Text>
          <Text style={styles.signText}>• Trail can be slippery after rain</Text>
          <Text style={styles.signText}>• Bring water - no facilities at top</Text>
          <Text style={styles.signText}>• Watch for loose rocks on path</Text>
          <Text style={styles.signText}>• Sunset views are best from 6-7pm</Text>
          <Text style={styles.signText}>• Please stay on marked trail</Text>
          <Text style={styles.signText}>• Pack out what you pack in</Text>
        </RNView>


        {/* Climb the Hill Section */}
        <RNView style={styles.climbSectionContainer}>
          <Text style={styles.climbSectionTitle}>CLIMB TO THE TOP OF LOVERS HILL</Text>
          <Text style={styles.climbDescription}>
            Climb to the top of Lovers Hill and discover why this spot has become so legendary. The journey is worth it for the incredible views and peaceful atmosphere you'll find at the summit.
          </Text>

          {lastFind && (
            <RNView style={styles.findingsMessage}>
              {lastFindImage && (
                <Image 
                  source={lastFindImage} 
                  style={styles.findingsImage}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.findingsText}>
                {lastFind}
              </Text>
            </RNView>
          )}
          
          <RNView style={styles.buttonSpacing}>
            <Pressable
              style={[styles.climbButton, hasReachedTop && styles.climbButtonCompleted]}
              onPress={handleClimbHill}
              disabled={hasReachedTop}
            >
                    <Text style={styles.climbButtonText}>
                      {hasReachedTop ? "REACHED THE TOP" : climbProgress === 0 ? "READY TO CLIMB?" : "CONTINUE CLIMBING"}
                    </Text>
            </Pressable>
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
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 100,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
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
    color: '#8b5cf6',
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
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  climbButtonCompleted: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  buttonSpacing: {
    marginTop: 0,
  },
  climbSectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  climbSectionContainer: {
    marginBottom: 20,
    marginHorizontal: 30,
    borderWidth: 2,
    borderColor: '#8b5cf6', // Purple border
    borderRadius: 8, // Slightly rounded corners
    padding: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.05)', // Very light purple background
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
  pageTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
  bannerContainer: {
    width: '100%',
    marginBottom: 20,
    marginTop: -8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#14b8a6',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: 280,
  },
  // Premium Placard Styles
  placardContainer: {
    backgroundColor: '#fef7ff', // Soft lavender background
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 20,
    borderWidth: 3,
    borderColor: '#8b5cf6', // Purple border
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  placardImageContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#c4b5fd', // Light purple border
  },
  placardImage: {
    width: '100%',
    height: 220,
  },
  placardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  placardTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#6b21a8', // Deep purple
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  placardDivider: {
    width: '60%',
    height: 2,
    backgroundColor: '#8b5cf6',
    borderRadius: 1,
  },
  placardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#4c1d95', // Dark purple
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'justify',
  },
  placardFooter: {
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#c4b5fd', // Light purple divider
  },
  placardSignature: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#7c3aed', // Medium purple
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
  invitationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  invitationText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 16,
    textAlign: 'justify',
  },
  findingsMessage: {
    backgroundColor: 'rgba(20, 184, 166, 0.1)',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.3)',
    marginTop: 12,
  },
  findingsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  findingsImage: {
    width: 240,
    height: 240,
    marginBottom: 8,
    alignSelf: 'center',
    borderRadius: 12,
  },
  woodenSign: {
    backgroundColor: '#F5DEB3', // Lighter, more realistic wood color
    borderRadius: 2,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#A0522D', // More realistic brown border
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  signTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8B4513', // Dark brown text
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: '#F5DEB3',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  signText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8B4513', // Darker brown text to match border
    marginBottom: 8,
    textAlign: 'left',
    lineHeight: 14,
    textShadowColor: '#F5DEB3',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0.5,
  },
});


