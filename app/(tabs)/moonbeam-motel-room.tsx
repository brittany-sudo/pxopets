import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet, Modal } from 'react-native';
import { View as RNView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { useInventory } from '@/store/InventoryStore';

const moonbeamLobbyImage = require('@/assets/images/moonbeamlobby.png');
const zachariahImage = require('@/assets/images/zachariah.png');
const keycardImage = require('@/assets/images/keycard.png');
const dreamcatcherImage = require('@/assets/images/moonbeandreamcatcher.png');

export default function MoonbeamMotelRoomScreen() {
  const { state, spendTickets } = useSimpleGame();
  const { addItem } = useInventory();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<number | null>(null);
  const [hasReceivedRewards, setHasReceivedRewards] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showInsufficientTicketsModal, setShowInsufficientTicketsModal] = useState(false);
  const [showRoomRewardsModal, setShowRoomRewardsModal] = useState(false);

  // Check if user is still checked in (1 hour = 3600000 ms)
  useEffect(() => {
    const checkTimer = () => {
      if (checkInTime) {
        const currentTime = Date.now();
        const timeElapsed = currentTime - checkInTime;
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (timeElapsed >= oneHour) {
          // Check-in has expired
          setIsCheckedIn(false);
          setCheckInTime(null);
          setHasReceivedRewards(false);
        }
      }
    };

    // Check immediately and then every minute
    checkTimer();
    const interval = setInterval(checkTimer, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkInTime]);

  const handleCheckIn = () => {
    setShowCheckInModal(true);
  };

  const confirmCheckIn = () => {
    if (spendTickets(15)) {
      // Successfully spent 15 tickets
      setShowCheckInModal(false);
      setIsCheckedIn(true);
      setCheckInTime(Date.now()); // Set check-in time
      setHasReceivedRewards(false); // Reset rewards flag
      setShowWelcomeModal(true);
    } else {
      // User doesn't have enough tickets
      setShowCheckInModal(false);
      setShowInsufficientTicketsModal(true);
    }
  };

  const cancelCheckIn = () => {
    setShowCheckInModal(false);
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const closeInsufficientTicketsModal = () => {
    setShowInsufficientTicketsModal(false);
  };

  const closeRoomRewardsModal = () => {
    setShowRoomRewardsModal(false);
    // Navigate to the room interior after closing the rewards modal
    router.navigate('/(tabs)/moonbeam-motel-room-interior');
  };

  const handleGoToRoom = () => {
    if (isCheckedIn) {
      if (!hasReceivedRewards) {
        // Only add dreamcatcher to inventory on first visit
        addItem({
          id: 'moonbeam-dreamcatcher',
          name: 'Moonbeam Dreamcatcher',
          price: 0,
          image: 'moonbeandreamcatcher.png',
          category: 'special',
          description: 'A mystical dreamcatcher from the Moonbeam Motel'
        }, 1);

        // Mark rewards as received
        setHasReceivedRewards(true);
        
        // Show rewards modal (shows both items but only dreamcatcher goes to inventory)
        setShowRoomRewardsModal(true);
      } else {
        // Already received rewards, go directly to room
        router.navigate('/(tabs)/moonbeam-motel-room-interior');
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/moonbeam-motel')}
          >
            <FontAwesome name="arrow-left" size={16} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.locationTitle}>MOONBEAM LOBBY</Text>
        </RNView>

        {/* Lobby Image */}
        <Image
          source={moonbeamLobbyImage}
          style={styles.lobbyImage}
          resizeMode="cover"
        />

        {/* Zachariah NPC */}
        <RNView style={styles.npcContainer}>
          <Image
            source={zachariahImage}
            style={styles.zachariahImage}
            resizeMode="contain"
          />
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>ZACHARIAH THE NIGHT MANAGER:</Text>
            <Text style={styles.speechText}>
              Welcome to the Moonbeam Motel, would you like to check in?
            </Text>
          </RNView>
        </RNView>

        {/* Action Buttons - Closer to Zachariah */}
        <RNView style={styles.buttonsContainer}>
          <Pressable 
            style={[styles.actionButton, styles.checkInButton]}
            onPress={handleCheckIn}
            disabled={isCheckedIn}
          >
            <FontAwesome name="key" size={16} color="#ffffff" />
            <Text style={styles.buttonText}>
              {isCheckedIn ? 'Checked In' : 'Check In'}
            </Text>
          </Pressable>

          <Pressable 
            style={[
              styles.actionButton, 
              isCheckedIn ? styles.goToRoomButton : styles.disabledButton
            ]}
            onPress={handleGoToRoom}
            disabled={!isCheckedIn}
          >
            <FontAwesome 
              name="bed" 
              size={16} 
              color={isCheckedIn ? "#ffffff" : "#999999"} 
            />
            <RNView style={styles.buttonTextContainer}>
              <Text style={[
                styles.buttonText,
                !isCheckedIn && styles.disabledButtonText
              ]}>
                Go to Room
              </Text>
              {isCheckedIn && checkInTime && (
                <Text style={styles.timeRemainingText}>
                  {(() => {
                    const timeElapsed = Date.now() - checkInTime;
                    const oneHour = 60 * 60 * 1000;
                    const timeRemaining = oneHour - timeElapsed;
                    const minutesRemaining = Math.max(0, Math.floor(timeRemaining / (60 * 1000)));
                    return `${minutesRemaining}m left`;
                  })()}
                </Text>
              )}
            </RNView>
          </Pressable>
        </RNView>
      </ScrollView>

      {/* Check In Confirmation Modal */}
      <Modal
        visible={showCheckInModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelCheckIn}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalHeader}>
              <FontAwesome name="key" size={24} color="#ec4899" />
              <Text style={styles.modalTitle}>Check In</Text>
            </RNView>
            
            <Text style={styles.modalMessage}>
              Check in costs 15 tickets. Would you like to proceed?
            </Text>
            
            <RNView style={styles.modalPricing}>
              <FontAwesome name="ticket" size={16} color="#8b5cf6" />
              <Text style={styles.modalPrice}>15</Text>
            </RNView>
            
            <Text style={styles.modalTicketInfo}>You have: {state.tickets} tickets</Text>
            
            <RNView style={styles.modalButtons}>
              <Pressable style={styles.modalCancelButton} onPress={cancelCheckIn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              
              <Pressable style={styles.modalConfirmButton} onPress={confirmCheckIn}>
                <FontAwesome name="check" size={14} color="#ffffff" />
                <Text style={styles.modalConfirmText}>Check In</Text>
              </Pressable>
            </RNView>
          </RNView>
        </RNView>
      </Modal>

      {/* Welcome/Success Modal */}
      <Modal
        visible={showWelcomeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeWelcomeModal}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalHeader}>
              <FontAwesome name="star" size={24} color="#ec4899" />
              <Text style={styles.modalTitle}>Welcome!</Text>
            </RNView>
            
            <Text style={styles.modalMessage}>
              {isCheckedIn ? 'You have successfully checked in. Your room is ready!' : 'You enter your cozy retro-futuristic room and rest peacefully...'}
            </Text>
            
            <Pressable style={styles.modalOkButton} onPress={closeWelcomeModal}>
              <FontAwesome name="heart" size={14} color="#ffffff" />
              <Text style={styles.modalOkText}>Wonderful!</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Insufficient Tickets Modal */}
      <Modal
        visible={showInsufficientTicketsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeInsufficientTicketsModal}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalHeaderCenter}>
              <FontAwesome name="exclamation-triangle" size={28} color="#ec4899" />
            </RNView>
            
            <Text style={styles.modalMessage}>
              You need 15 tickets to check in, but you only have {state.tickets} tickets.
            </Text>
            
            <RNView style={styles.modalPricing}>
              <FontAwesome name="ticket" size={16} color="#8b5cf6" />
              <Text style={styles.modalPrice}>Need: 15</Text>
            </RNView>
            
            <Text style={styles.modalTicketInfo}>You have: {state.tickets} tickets</Text>
            
            <Pressable style={styles.modalOkButton} onPress={closeInsufficientTicketsModal}>
              <FontAwesome name="times" size={14} color="#ffffff" />
              <Text style={styles.modalOkText}>Okay</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Room Rewards Modal */}
      <Modal
        visible={showRoomRewardsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeRoomRewardsModal}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalHeader}>
              <FontAwesome name="gift" size={24} color="#ec4899" />
              <Text style={styles.modalTitle}>Room Rewards!</Text>
            </RNView>
            
            <Text style={styles.modalMessage}>
              You've received some special items for your stay!
            </Text>
            
            <RNView style={styles.rewardsContainer}>
              <RNView style={styles.rewardItem}>
                <Image source={keycardImage} style={styles.rewardImage} />
                <Text style={styles.rewardText}>Room Key</Text>
                <Text style={styles.rewardNote}>(For your stay)</Text>
              </RNView>
              
              <RNView style={styles.rewardItem}>
                <Image source={dreamcatcherImage} style={styles.rewardImage} />
                <RNView style={styles.rewardTextContainer}>
                  <Text style={styles.rewardText}>Moonbeam Dreamcatcher</Text>
                  <Text style={styles.rewardNote}>✨ Added to inventory!</Text>
                </RNView>
              </RNView>
            </RNView>
            
            <Text style={styles.modalSubtext}>
              The dreamcatcher has been added to your inventory!
            </Text>
            
            <Pressable style={styles.modalOkButton} onPress={closeRoomRewardsModal}>
              <FontAwesome name="check" size={14} color="#ffffff" />
              <Text style={styles.modalOkText}>Awesome!</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>
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
  lobbyImage: {
    width: '100%',
    height: 320,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ec4899',
    borderRadius: 12,
    overflow: 'hidden',
  },
  npcContainer: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  zachariahImage: {
    width: 75, // Bigger sprite again
    height: 75, // Bigger sprite again
    resizeMode: 'contain',
    marginRight: 8, // Closer to speech bubble
  },
  speechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)', // Match Jerry's exact color
    padding: 12, // More compact padding
    borderRadius: 8, // Match Jerry's border radius
    borderWidth: 1,
    borderColor: '#8b5cf6', // Match Jerry's border color exactly
    maxWidth: 280, // Longer speech bubble
    flex: 1, // Take remaining space
    shadowColor: '#000', // Match Jerry's shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8, // Match Jerry's exact font size
    color: '#8b5cf6', // Match Jerry's exact color
    marginBottom: 4, // Match Jerry's margin
    textAlign: 'center',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Match Jerry's exact font size
    color: '#0f172a', // Match Jerry's exact color
    textAlign: 'center',
    lineHeight: 16, // Match Jerry's line height
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    paddingHorizontal: 10,
    gap: 12,
    marginTop: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: 140,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checkInButton: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
    shadowColor: '#ec4899',
  },
  goToRoomButton: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
    shadowColor: '#000',
  },
  buttonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999999',
  },
  buttonTextContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  timeRemainingText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fef7f7',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ec4899',
    padding: 18,
    width: '85%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  modalHeaderCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#ec4899',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 16,
  },
  modalPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 18,
    gap: 6,
  },
  modalPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderWidth: 1,
    borderColor: '#6b7280',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#ec4899',
    borderWidth: 1,
    borderColor: '#ec4899',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalConfirmText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalOkButton: {
    backgroundColor: '#ec4899',
    borderWidth: 1,
    borderColor: '#ec4899',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  modalOkText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalTicketInfo: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  rewardsContainer: {
    width: '100%',
    marginVertical: 16,
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  rewardImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  rewardTextContainer: {
    flex: 1,
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  rewardNote: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontStyle: 'italic',
    marginTop: 2,
  },
  modalSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
});
