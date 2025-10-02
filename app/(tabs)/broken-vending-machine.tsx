import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { View as RNView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const vendingMachineImage = require('@/assets/images/vendingmachine.png');

export default function BrokenVendingMachineScreen() {
  const handleLookInside = () => {
    Alert.alert(
      'Look Inside',
      'You peer through the glass and see some snacks stuck halfway down. There might be something you can reach...'
    );
  };

  const handleKickMachine = () => {
    Alert.alert(
      'Kick the Machine',
      'You give the machine a good kick! *THUNK* A stale candy bar falls out with a satisfying clatter!'
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={16} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.locationTitle}>BROKEN VENDING MACHINE</Text>
        </RNView>

        {/* Vending Machine Image */}
        <Image
          source={vendingMachineImage}
          style={styles.vendingMachineImage}
          resizeMode="contain"
        />

        {/* Action Options */}
        <RNView style={styles.optionsContainer}>
          <Pressable style={styles.optionButton} onPress={handleLookInside}>
            <FontAwesome name="eye" size={16} color="#8b5cf6" />
            <RNView style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Look Inside Machine</Text>
              <Text style={styles.optionDescription}>Peer through the glass to see what's stuck</Text>
            </RNView>
          </Pressable>

          <Pressable style={styles.optionButton} onPress={handleKickMachine}>
            <FontAwesome name="hand-rock-o" size={16} color="#8b5cf6" />
            <RNView style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Kick the Machine</Text>
              <Text style={styles.optionDescription}>Give it a good thump to shake something loose</Text>
            </RNView>
          </Pressable>
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
  vendingMachineImage: {
    width: '100%',
    height: 400,
    borderWidth: 2,
    borderColor: '#ec4899',
    marginBottom: 20,
  },
  optionsContainer: {
    width: '95%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    padding: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    padding: 16,
    gap: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 14,
  },
});
