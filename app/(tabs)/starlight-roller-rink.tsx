import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

// Import the Starlight Roller Rink image
const starlightRollerRinkImage = require('@/assets/images/starlight-rink-main.png');
const rinkdogImage = require('@/assets/images/rinkdog.png');
const rinkpretzelImage = require('@/assets/images/rinkpretzel.png');
const rinkpopcornImage = require('@/assets/images/rinkpopcorn.png');
const rinkpizzaImage = require('@/assets/images/rinkpizza.png');
const arcadefriesImage = require('@/assets/images/arcadefries.png');
const starlightAttendantImage = require('@/assets/images/starlight-attendant.png');
const glowshakeImage = require('@/assets/images/glowshake.png');

export default function StarlightRollerRinkScreen() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [snackBarSaying, setSnackBarSaying] = useState("Welcome to the Rink Snack Bar! Fuel up for skating!");

  // Snack bar inventory
  const [snackInventory, setSnackInventory] = useState([
    { id: 's1', name: 'Pixel Popcorn', price: 3, stock: 5, description: 'Fresh popped corn', image: 'rinkpopcorn' },
    { id: 's2', name: 'Starlight Pizza', price: 5, stock: 3, description: 'Delicious rink pizza', image: 'rinkpizza' },
    { id: 's3', name: 'Roller Dogs', price: 4, stock: 4, description: 'Classic rink hot dog', image: 'rinkdog' },
    { id: 's4', name: 'Glowshake', price: 2, stock: 8, description: 'Refreshing drink', image: 'glowshake' },
    { id: 's5', name: 'Arcade Fries', price: 1, stock: 10, description: 'Crispy arcade fries', image: 'arcadefries' },
    { id: 's6', name: 'Disco Pretzel', price: 3, stock: 6, description: 'Soft pretzel', image: 'rinkpretzel' },
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const sessionOptions = [
    { id: '1', name: 'Morning Glide', price: 10, time: '11:00 AM', endTime: '1:00 PM', description: 'Early bird special - quiet morning session' },
    { id: '2', name: 'Afternoon Cruise', price: 10, time: '2:00 PM', endTime: '4:00 PM', description: 'Family-friendly afternoon skating' },
    { id: '3', name: 'Sunset Skate', price: 10, time: '5:00 PM', endTime: '7:00 PM', description: 'Golden hour skating with disco lights' },
    { id: '4', name: 'Neon Nights', price: 10, time: '8:00 PM', endTime: '10:00 PM', description: 'Full disco experience with live DJ' },
    { id: '5', name: 'Midnight Madness', price: 10, time: '11:00 PM', endTime: '1:00 AM', description: 'Late night party session - adults only' },
    { id: '6', name: 'Last Call Skate', price: 10, time: '1:30 AM', endTime: '2:00 AM', description: 'Final session of the night - quick skate' },
  ];

  const isSessionAvailable = (sessionTime: string, endTime: string) => {
    const now = currentTime;
    const sessionStartDate = new Date();
    const sessionEndDate = new Date();
    
    const [startTime, startPeriod] = sessionTime.split(' ');
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    
    const [endTimeOnly, endPeriod] = endTime.split(' ');
    const [endHours, endMinutes] = endTimeOnly.split(':').map(Number);
    
    let sessionStartHour = startHours;
    if (startPeriod === 'PM' && startHours !== 12) {
      sessionStartHour += 12;
    } else if (startPeriod === 'AM' && startHours === 12) {
      sessionStartHour = 0;
    }
    
    let sessionEndHour = endHours;
    if (endPeriod === 'PM' && endHours !== 12) {
      sessionEndHour += 12;
    } else if (endPeriod === 'AM' && endHours === 12) {
      sessionEndHour = 0;
    }
    
    if (sessionStartHour < 6) {
      sessionStartDate.setDate(sessionStartDate.getDate() + 1);
    }
    if (sessionEndHour < 6) {
      sessionEndDate.setDate(sessionEndDate.getDate() + 1);
    }
    
    sessionStartDate.setHours(sessionStartHour, startMinutes, 0, 0);
    sessionEndDate.setHours(sessionEndHour, endMinutes, 0, 0);
    
    return now <= sessionEndDate;
  };

  const handleSessionPurchase = (session: any) => {
    const isAvailable = isSessionAvailable(session.time, session.endTime);
    
    if (!isAvailable) {
      Alert.alert("Session Unavailable", "This session has already ended.");
      return;
    }

    // Set the selected session and show modal
    setSelectedSession(session);
    setShowTicketModal(true);
  };

  const handleSnackPurchase = (snack: any) => {
    if (snack.stock > 0) {
      Alert.alert(
        "Buy Snack",
        `Buy ${snack.name} for ${snack.price} ⚡?\n\n${snack.description}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Buy", onPress: () => {
            // Update stock
            setSnackInventory(prev => 
              prev.map(snackItem => 
                snackItem.id === snack.id 
                  ? { ...snackItem, stock: snackItem.stock - 1 }
                  : snackItem
              )
            );
            Alert.alert("Enjoy!", `You bought ${snack.name}! Perfect for skating!`);
          }}
        ]
      );
    } else {
      Alert.alert("Out of Stock", "This snack is currently unavailable.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>STARLIGHT ROLLER RINK</Text>
        </RNView>

        {/* Roller Rink Image */}
        <RNView style={styles.imageContainer}>
          <Image source={starlightRollerRinkImage} style={styles.rollerRinkImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Step into a neon-lit wonderland where disco balls spin and wheels roll under the stars. 
          The Starlight Roller Rink is Pxoburbs' most iconic skating destination, featuring 
          retro vibes, classic arcade games, and the smoothest skating surface in town.
        </Text>

        {/* Snack Bar Section */}
        <RNView style={styles.snackBarContainer}>
          <BorderedBox style={styles.thickBorderBox}>
            <RNView style={styles.snackBarHeader}>
              <Text style={styles.snackBarTitle}>RINK SNACK BAR</Text>
              <Text style={styles.snackBarSubtitle}>Fuel up for your skating session!</Text>
            </RNView>
            
            {/* Lyle the Attendant */}
            <RNView style={styles.lyleContainer}>
              <Image source={starlightAttendantImage} style={styles.lyleImage} />
              <RNView style={styles.speechBubble}>
                <Text style={styles.characterName}>LYLE</Text>
                <Text style={styles.speechText}>
                  {snackBarSaying}
                </Text>
              </RNView>
            </RNView>

            <RNView style={styles.snackGrid}>
              {snackInventory.map((snack) => (
                <RNView key={snack.id} style={styles.snackItem}>
                      <Image 
                        source={
                          snack.image === 'rinkpretzel' ? rinkpretzelImage :
                          snack.image === 'rinkpopcorn' ? rinkpopcornImage :
                          snack.image === 'rinkpizza' ? rinkpizzaImage :
                          snack.image === 'arcadefries' ? arcadefriesImage :
                          snack.image === 'glowshake' ? glowshakeImage :
                          rinkdogImage
                        } 
                        style={styles.snackImage} 
                      />
                  <Text style={styles.snackName}>{snack.name}</Text>
                  <Text style={styles.snackDescription}>{snack.description}</Text>
                  <Text style={styles.snackPrice}>{snack.price} ⚡</Text>
                  <Text style={styles.snackStock}>Stock: {snack.stock}</Text>
                  <Pressable 
                    style={[
                      styles.snackBuyButton,
                      snack.stock === 0 && styles.snackBuyButtonDisabled
                    ]}
                    onPress={() => handleSnackPurchase(snack)}
                    disabled={snack.stock === 0}
                  >
                    <Text style={[
                      styles.snackBuyButtonText,
                      snack.stock === 0 && styles.snackBuyButtonTextDisabled
                    ]}>
                      {snack.stock > 0 ? 'BUY' : 'SOLD OUT'}
                    </Text>
                  </Pressable>
                </RNView>
              ))}
            </RNView>
          </BorderedBox>
        </RNView>

        {/* Session Booking */}
        <RNView style={styles.sessionBookingContainer}>
          <BorderedBox style={styles.thickBorderBox}>
            <RNView style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>SKATING SESSIONS</Text>
              <Text style={styles.sessionSubtitle}>Book your time on the rink - All sessions cost 10 tickets</Text>
              <Text style={styles.currentTimeText}>
                Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </RNView>
            <RNView style={styles.sessionsContainer}>
              {sessionOptions.map((session) => {
                const isAvailable = isSessionAvailable(session.time, session.endTime);
                return (
                  <RNView key={session.id} style={[
                    styles.sessionItem,
                    !isAvailable && styles.sessionItemPast
                  ]}>
                    <RNView style={styles.sessionInfo}>
                      <Text style={styles.sessionName}>{session.name}</Text>
                      <Text style={styles.sessionTime}>{session.time} - {session.endTime}</Text>
                      <Text style={styles.sessionDescription}>{session.description}</Text>
                      <Text style={styles.sessionPrice}>{session.price} ⚡</Text>
                    </RNView>
                    <Pressable 
                      style={[
                        styles.bookButton, 
                        !isAvailable && styles.bookButtonDisabled
                      ]}
                      onPress={() => handleSessionPurchase(session)}
                      disabled={!isAvailable}
                    >
                      <Text style={[
                        styles.bookButtonText,
                        !isAvailable && styles.bookButtonTextDisabled
                      ]}>
                        {isAvailable ? 'BOOK NOW' : 'PASSED'}
                      </Text>
                    </Pressable>
                  </RNView>
                );
              })}
            </RNView>
          </BorderedBox>
        </RNView>

        {/* Selected Session Display */}
        {selectedSession && (
          <RNView style={styles.selectedSessionContainer}>
            <BorderedBox>
              <Text style={styles.selectedTitle}>Your Session</Text>
              <Text style={styles.selectedText}>
                {selectedSession.name} - {selectedSession.time}
              </Text>
            </BorderedBox>
          </RNView>
        )}
      </ScrollView>

      {/* Skate Ticket Modal */}
      <Modal
        visible={showTicketModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <RNView style={styles.modalContentWrapper}>
            <RNView style={styles.modalHeader}>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowTicketModal(false)}
              >
                <FontAwesome name="times" size={14} color="#8b5cf6" />
              </Pressable>
            </RNView>
            
                  <RNView style={styles.ticketContent}>
                    <Text style={styles.ticketTitle}>SKATE TICKET RECEIVED!</Text>
                    <RNView style={styles.ticketDetails}>
                      <Text style={styles.ticketSessionName}>{selectedSession?.name}</Text>
                      <Text style={styles.ticketTime}>{selectedSession?.time} - {selectedSession?.endTime}</Text>
                      <Text style={styles.ticketDescription}>{selectedSession?.description}</Text>
                      <RNView style={styles.ticketPriceContainer}>
                        <Text style={styles.ticketPrice}>Cost: 10 🎫</Text>
                      </RNView>
                    </RNView>
                    <Text style={styles.ticketMessage}>
                      This ticket has been added to your inventory!
                    </Text>
                    <Pressable 
                      style={styles.awesomeButton}
                      onPress={() => setShowTicketModal(false)}
                    >
                      <Text style={styles.awesomeButtonText}>AWESOME!</Text>
                    </Pressable>
                  </RNView>
          </RNView>
        </View>
      </Modal>
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
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  imageContainer: {
    width: '90%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: -20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  rollerRinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 16,
    marginHorizontal: 40,
    textAlign: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  sessionBookingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sessionHeader: {
    marginBottom: 20,
  },
  sessionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  currentTimeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  sessionsContainer: {
    gap: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  sessionItemPast: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  sessionInfo: {
    flex: 1,
    marginRight: 12,
  },
  sessionName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  sessionTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
  },
  sessionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 14,
  },
  sessionPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bookButtonTextDisabled: {
    color: '#6b7280',
  },
  selectedSessionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  selectedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  ticketContent: {
    alignItems: 'center',
  },
  ticketTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ticketDetails: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  ticketSessionName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  ticketTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  ticketDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 14,
  },
  ticketPriceContainer: {
    alignItems: 'center',
  },
  ticketPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  ticketMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  awesomeButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  awesomeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Snack bar styles
  thickBorderBox: {
    width: '90%',
  },
  snackBarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  snackBarHeader: {
    marginBottom: 16,
  },
  snackBarTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  snackBarSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  lyleContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  lyleImage: {
    width: 80,
    height: 80,
    marginLeft: 16,
    imageRendering: 'pixelated' as any,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  characterName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
  },
  snackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    padding: 8,
    alignItems: 'flex-start',
  },
  snackItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    minHeight: 140,
  },
  snackImage: {
    width: 35,
    height: 35,
    marginBottom: 6,
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
  },
  snackName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 10,
  },
  snackDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 10,
  },
  snackPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  snackStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  snackBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    width: '100%',
  },
  snackBuyButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  snackBuyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  snackBuyButtonTextDisabled: {
    color: '#6b7280',
  },
});
