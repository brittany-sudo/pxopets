import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { View as RNView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSimpleGame } from '@/store/SimpleGameStore';

const moonbeamMotelRoomImage = require('@/assets/images/moonbeammotelroom.png');
const tigerGuyImage = require('@/assets/images/tigerguy.png');

export default function MoonbeamMotelRoomInteriorScreen() {
  const { state } = useSimpleGame();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/moonbeam-motel-room')}
          >
            <FontAwesome name="arrow-left" size={16} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.locationTitle}>YOUR ROOM</Text>
        </RNView>

        {/* Room Interior Image */}
        <Image
          source={moonbeamMotelRoomImage}
          style={styles.roomInteriorImage}
          resizeMode="stretch"
        />

        {/* Room Description Box */}
        <RNView style={styles.roomDescriptionContainer}>
          <RNView style={styles.descriptionHeader}>
            <Image source={tigerGuyImage} style={styles.activePetIcon} />
            <RNView style={styles.headerTextContainer}>
              <Text style={styles.descriptionTitle}>TigerGuy explores the room...</Text>
              <Text style={styles.descriptionSubtitle}>Tap to interact with different areas</Text>
            </RNView>
          </RNView>

          <RNView style={styles.interactableAreas}>
            <Pressable style={styles.areaButton} onPress={() => console.log('TV clicked')}>
              <FontAwesome name="tv" size={16} color="#8b5cf6" />
              <Text style={styles.areaText}>Retro TV</Text>
              <Text style={styles.areaDescription}>Vintage shows and static</Text>
            </Pressable>

            <Pressable style={styles.areaButton} onPress={() => console.log('Bed clicked')}>
              <FontAwesome name="bed" size={16} color="#8b5cf6" />
              <Text style={styles.areaText}>Cozy Bed</Text>
              <Text style={styles.areaDescription}>Rest and dream peacefully</Text>
            </Pressable>

            <Pressable style={styles.areaButton} onPress={() => console.log('Window clicked')}>
              <FontAwesome name="eye" size={16} color="#8b5cf6" />
              <Text style={styles.areaText}>Desert View</Text>
              <Text style={styles.areaDescription}>Moonlit landscape outside</Text>
            </Pressable>

            <Pressable style={styles.areaButton} onPress={() => console.log('Picture clicked')}>
              <FontAwesome name="picture-o" size={16} color="#8b5cf6" />
              <Text style={styles.areaText}>Wall Art</Text>
              <Text style={styles.areaDescription}>Mysterious desert painting</Text>
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
    backgroundColor: '#fef7f7', // Light pink desert background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    position: 'absolute',
    left: 0,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ec4899',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    flex: 1,
  },
  roomInteriorImage: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  roomDescriptionContainer: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    marginTop: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  activePetIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
  },
  descriptionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ec4899',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  descriptionSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  interactableAreas: {
    gap: 8,
  },
  areaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 12,
    gap: 12,
  },
  areaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    minWidth: 80,
  },
  areaDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#6b7280',
    flex: 1,
  },
});
