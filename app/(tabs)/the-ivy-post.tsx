import React, { useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';

// Import images
const ivyPostImage = require('@/assets/images/theivypost-main.png');
const tavernKeeperImage = require('@/assets/images/ivypost-tavernkeeper.png');

export default function TheIvyPostScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/barrelhaven')}
        >
          <FontAwesome name="arrow-left" size={12} color="#92400e" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE IVY POST</Text>
        </RNView>

        {/* Header Image */}
        <Image source={ivyPostImage} style={styles.headerImage} resizeMode="contain" />

        {/* Description */}
        <RNView style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            A cozy medieval tavern where the thick oak beams are draped in centuries-old ivy. 
            The warm glow of lanterns illuminates the rustic interior, while outdoor grape arbors 
            provide shade for travelers seeking rest and refreshment.
          </Text>
        </RNView>

        {/* Tavern Keeper NPC */}
        <RNView style={styles.npcContainer}>
          <Image source={tavernKeeperImage} style={styles.npcImage} resizeMode="contain" />
          <RNView style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Welcome to The Ivy Post! I'm the tavern keeper here. We've got the finest ales 
              in all of Barrelhaven, and rooms upstairs if you need rest. The ivy on our walls 
              has been growing for centuries - some say it's what keeps our ale so fresh!
            </Text>
          </RNView>
        </RNView>

        {/* Tavern Services Section */}
        <RNView style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>TAVERN SERVICES</Text>
          
          <RNView style={styles.serviceCard}>
            <RNView style={styles.serviceHeader}>
              <FontAwesome name="beer" size={16} color="#92400e" />
              <Text style={styles.serviceName}>Local Brews</Text>
            </RNView>
            <Text style={styles.serviceDescription}>
              Sample the finest ales and meads brewed by local artisans. 
              Each drink tells a story of Barrelhaven's rich brewing traditions.
            </Text>
          </RNView>

          <RNView style={styles.serviceCard}>
            <RNView style={styles.serviceHeader}>
              <FontAwesome name="cutlery" size={16} color="#92400e" />
              <Text style={styles.serviceName}>Hearty Meals</Text>
            </RNView>
            <Text style={styles.serviceDescription}>
              Enjoy traditional tavern fare made with fresh local ingredients. 
              From savory stews to warm bread, every meal is prepared with care.
            </Text>
          </RNView>

          <RNView style={styles.serviceCard}>
            <RNView style={styles.serviceHeader}>
              <FontAwesome name="bed" size={16} color="#92400e" />
              <Text style={styles.serviceName}>Rest & Lodging</Text>
            </RNView>
            <Text style={styles.serviceDescription}>
              Find comfort in the cozy upstairs rooms. Each chamber offers 
              a peaceful retreat after a day of travel through the vineyards.
            </Text>
          </RNView>

          <RNView style={styles.serviceCard}>
            <RNView style={styles.serviceHeader}>
              <FontAwesome name="users" size={16} color="#92400e" />
              <Text style={styles.serviceName}>Local Gathering</Text>
            </RNView>
            <Text style={styles.serviceDescription}>
              Join the community of locals who gather here to share stories, 
              news, and the latest gossip from around Barrelhaven.
            </Text>
          </RNView>
        </RNView>

        {/* Atmosphere Section */}
        <RNView style={styles.atmosphereContainer}>
          <Text style={styles.sectionTitle}>TAVERN ATMOSPHERE</Text>
          
          <RNView style={styles.atmosphereCard}>
            <RNView style={styles.atmosphereHeader}>
              <FontAwesome name="leaf" size={16} color="#92400e" />
              <Text style={styles.atmosphereName}>Ivy-Covered Walls</Text>
            </RNView>
            <Text style={styles.atmosphereDescription}>
              Ancient ivy vines climb the stone walls, creating a living tapestry 
              that changes with the seasons and adds to the tavern's mystical charm.
            </Text>
          </RNView>

          <RNView style={styles.atmosphereCard}>
            <RNView style={styles.atmosphereHeader}>
              <FontAwesome name="fire" size={16} color="#92400e" />
              <Text style={styles.atmosphereName}>Warm Hearth</Text>
            </RNView>
            <Text style={styles.atmosphereDescription}>
              The great stone fireplace crackles with warmth, casting dancing 
              shadows across the wooden tables and creating the perfect ambiance.
            </Text>
          </RNView>

          <RNView style={styles.atmosphereCard}>
            <RNView style={styles.atmosphereHeader}>
              <FontAwesome name="music" size={16} color="#92400e" />
              <Text style={styles.atmosphereName}>Live Music</Text>
            </RNView>
            <Text style={styles.atmosphereDescription}>
              Local bards and musicians often perform here, filling the air 
              with traditional songs and tales of adventure from distant lands.
            </Text>
          </RNView>
        </RNView>

        {/* Info Section */}
        <RNView style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About The Ivy Post</Text>
          <Text style={styles.infoText}>
            The Ivy Post has been a cornerstone of Barrelhaven for generations, serving as both 
            a place of rest for weary travelers and a gathering spot for the local community. 
            Its ivy-covered walls and warm atmosphere make it the perfect place to unwind and 
            experience the true spirit of this wine country village.
          </Text>
        </RNView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#92400e',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#92400e',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 40,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    alignSelf: 'center',
  },
  descriptionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#92400e',
  },
  descriptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  npcImage: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 16,
  },
  servicesContainer: {
    width: '100%',
    marginBottom: 20,
  },
  atmosphereContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#92400e',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  atmosphereCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#92400e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  atmosphereHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  atmosphereName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  serviceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
  },
  atmosphereDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#92400e',
  },
  infoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 18,
    textAlign: 'center',
  },
});
