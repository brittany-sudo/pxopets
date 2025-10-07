import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import { useGame } from '@/store/GameStore';
import { useInventory } from '@/store/InventoryStore';

// Import the Starlight Roller Rink image
const starlightRollerRinkImage = require('@/assets/images/starlight-rollerrink-main.png');
const rinkdogImage = require('@/assets/images/rinkdog.png');
const rinkpretzelImage = require('@/assets/images/rinkpretzel.png');
const rinkpopcornImage = require('@/assets/images/rinkpopcorn.png');
const rinkpizzaImage = require('@/assets/images/rinkpizza.png');
const arcadefriesImage = require('@/assets/images/arcadefries.png');
const starlightAttendantImage = require('@/assets/images/starlight-attendant.png');
const glowshakeImage = require('@/assets/images/glowshake.png');
const trixieSpriteImage = require('@/assets/images/trixie-sprite.png');

export default function StarlightRollerRinkScreen() {
  const { state: gameState, spendTickets } = useGame();
  const { addItem } = useInventory();
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [snackBarSaying, setSnackBarSaying] = useState("Hey there, skater! Ready to roll? I'm Lyle and I'm here to make sure you have the BEST time on wheels! Let's get you booked for an awesome session!");
  const [trixieSaying, setTrixieSaying] = useState("Ugh, another newbie? Whatever, just don't fall and embarrass yourself.");
  
  // Snack purchase modal states
  const [showSnackModal, setShowSnackModal] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);
  const [showSnackSuccess, setShowSnackSuccess] = useState(false);
  const [showSnackError, setShowSnackError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Snack bar inventory
  const [snackInventory, setSnackInventory] = useState([
    { id: 's1', name: 'Pixel Popcorn', price: 5, stock: 5, description: 'Fresh popped corn', image: 'rinkpopcorn' },
    { id: 's2', name: 'Starlight Pizza', price: 5, stock: 3, description: 'Delicious rink pizza', image: 'rinkpizza' },
    { id: 's3', name: 'Roller Dogs', price: 5, stock: 4, description: 'Classic rink hot dog', image: 'rinkdog' },
    { id: 's4', name: 'Pxoberry Glowshake', price: 5, stock: 8, description: 'Refreshing drink', image: 'glowshake' },
    { id: 's5', name: 'Arcade Fries', price: 5, stock: 10, description: 'Crispy arcade fries', image: 'arcadefries' },
    { id: 's6', name: 'Disco Pretzel', price: 5, stock: 6, description: 'Soft pretzel', image: 'rinkpretzel' },
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Rotate Lyle's dialogue
  useEffect(() => {
    const lyleSayings = [
      "Hey there, skater! Ready to roll? I'm Lyle and I'm here to make sure you have the BEST time on wheels! Let's get you booked for an awesome session!",
      "Welcome to the Starlight Roller Rink! I'm Lyle, your friendly attendant. Ready to roll?",
      "Looking to book a session? I've got the perfect time slots for you!",
      "Safety first, fun second! Let me get you set up with some quality skating time!",
      "The rink is calling your name! What session works for you?",
      "I've been working here for years and I still get excited about every session! Ready to join me?"
    ];
    
    const interval = setInterval(() => {
      const randomSaying = lyleSayings[Math.floor(Math.random() * lyleSayings.length)];
      setSnackBarSaying(randomSaying);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Rotate Trixie's dialogue
  useEffect(() => {
    const trixieSayings = [
      "Ugh, another newbie? Whatever, just don't fall and embarrass yourself.",
      "I've been skating here since I was 5. Try to keep up, okay?",
      "The rink isn't a playground, you know. Show some respect.",
      "I've seen better skaters in kindergarten. Step up your game.",
      "Don't even think about touching my favorite spot on the rink.",
      "I'm not here to babysit. Learn the rules or get out.",
      "This isn't amateur hour. Either you're serious about skating or you're not.",
      "I've been doing this for years. Maybe you should take some lessons first?",
      "The rink is MY domain. Don't mess it up.",
      "I don't have time for wannabes. Prove you belong here."
    ];
    
    const interval = setInterval(() => {
      const randomSaying = trixieSayings[Math.floor(Math.random() * trixieSayings.length)];
      setTrixieSaying(randomSaying);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const sessionOptions = [
    { id: '1', name: 'Morning Glide', price: 10, currency: 'tickets', time: '11:00 AM', endTime: '1:00 PM', description: 'Early bird special - quiet morning session' },
    { id: '2', name: 'Afternoon Cruise', price: 10, currency: 'tickets', time: '2:00 PM', endTime: '4:00 PM', description: 'Family-friendly afternoon skating' },
    { id: '3', name: 'Sunset Skate', price: 10, currency: 'tickets', time: '5:00 PM', endTime: '7:00 PM', description: 'Golden hour skating with disco lights' },
    { id: '4', name: 'Neon Nights', price: 10, currency: 'tickets', time: '8:00 PM', endTime: '10:00 PM', description: 'Full disco experience with live DJ' },
    { id: '5', name: 'Midnight Madness', price: 10, currency: 'tickets', time: '11:00 PM', endTime: '1:00 AM', description: 'Late night party session - adults only' },
    { id: '6', name: 'Last Call Skate', price: 10, currency: 'tickets', time: '1:30 AM', endTime: '2:00 AM', description: 'Final session of the night - quick skate' },
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
      // Check if player has enough tickets
      if (gameState.tickets >= snack.price) {
        setSelectedSnack(snack);
        setShowSnackModal(true);
      } else {
        setErrorMessage(`You need ${snack.price} tickets to buy ${snack.name}.\n\nYou have ${gameState.tickets} tickets.`);
        setShowSnackError(true);
      }
    } else {
      setErrorMessage("This snack is currently unavailable.");
      setShowSnackError(true);
    }
  };

  const confirmSnackPurchase = () => {
    if (!selectedSnack) return;
    
    // Deduct tickets
    spendTickets(selectedSnack.price);
    
    // Add item to inventory
    const itemData = {
      id: selectedSnack.id,
      name: selectedSnack.name,
      price: selectedSnack.price,
      image: selectedSnack.image,
      category: 'snack' as const,
      description: `Purchased from Starlight Roller Rink`,
      rarity: 'common' as const
    };
    
    const success = addItem(itemData, 1);
    
    // Update stock
    setSnackInventory(prev => 
      prev.map(snackItem => 
        snackItem.id === selectedSnack.id 
          ? { ...snackItem, stock: snackItem.stock - 1 }
          : snackItem
      )
    );
    
    setShowSnackModal(false);
    
    if (success) {
      setShowSnackSuccess(true);
      setTimeout(() => setShowSnackSuccess(false), 2000);
    } else {
      setErrorMessage("Item moved to safety deposit box!");
      setShowSnackError(true);
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

        {/* Roller Rink Image */}
        <RNView style={styles.imageContainer}>
          <Image source={starlightRollerRinkImage} style={styles.rollerRinkImage} />
        </RNView>

        {/* Description with Title */}
        <Text style={styles.description}>
          <Text style={styles.locationTitle}>STARLIGHT ROLLER RINK</Text>
          {'\n\n'}
          Step into a neon-lit wonderland where disco balls spin and wheels roll under the stars. 
          The Starlight Roller Rink is Pxoburbs' most iconic skating destination, featuring 
          retro vibes, classic arcade games, and the smoothest skating surface in town.
        </Text>

        {/* Session Booking */}
        <RNView style={styles.sessionBookingContainer}>
          <BorderedBox style={styles.thickBorderBox}>
            <RNView style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>SKATING SESSIONS</Text>
              <Text style={styles.sessionSubtitle}>Book your time on the rink - All sessions cost 10 tickets</Text>
              <Text style={styles.currentTimeText}>
                Current Time: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              
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
                      <RNView style={styles.sessionPriceContainer}>
                        <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                        <Text style={styles.sessionPrice}>{session.price}</Text>
                      </RNView>
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
            
            {/* Trixie the Cool Skater */}
            <RNView style={styles.trixieContainer}>
              <Image source={trixieSpriteImage} style={styles.trixieImage} />
              <RNView style={styles.trixieSpeechBubble}>
                <Text style={styles.trixieCharacterName}>TRIXIE</Text>
                <Text style={styles.trixieSpeechText}>
                  {trixieSaying}
                </Text>
              </RNView>
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

        {/* Snack Bar Section */}
        <RNView style={styles.snackBarContainer}>
          <BorderedBox style={styles.thickBorderBox}>
            <RNView style={styles.snackBarHeader}>
              <Text style={styles.snackBarTitle}>RINK SNACK BAR</Text>
              <Text style={styles.snackBarSubtitle}>Fuel up for your skating session!</Text>
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
                  <Text style={styles.snackStock}>Stock: {snack.stock}</Text>
                  <RNView style={styles.snackPriceContainer}>
                    <FontAwesome name="ticket" size={16} color="#8b5cf6" />
                    <Text style={styles.snackPrice}>{snack.price}</Text>
                  </RNView>
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

        {/* Starlight Glide Game Section */}
        <RNView style={styles.gameContainer}>
          <BorderedBox style={styles.thickBorderBox}>
            <RNView style={styles.gameHeader}>
              <Text style={styles.gameTitle}>STARLIGHT GLIDE</Text>
              <Text style={styles.gameSubtitle}>Arcade Game - Test your skating skills!</Text>
            </RNView>

            <RNView style={styles.gameContent}>
              <RNView style={styles.gameDescription}>
                <Text style={styles.gameDescriptionText}>
                  Step into the neon-lit arcade and test your roller skating skills! 
                  Navigate through the disco-lit rink, collect glowing stars, and avoid 
                  obstacles in this retro-style arcade game.
                </Text>
              </RNView>

              <RNView style={styles.gameStats}>
                <RNView style={styles.gameStatItem}>
                  <FontAwesome name="ticket" size={16} color="#8b5cf6" />
                  <Text style={styles.gameStatText}>Cost: 5 tickets</Text>
                </RNView>
                <RNView style={styles.gameStatItem}>
                  <FontAwesome name="star" size={16} color="#fbbf24" />
                  <Text style={styles.gameStatText}>Reward: 10-50 tickets</Text>
                </RNView>
                <RNView style={styles.gameStatItem}>
                  <FontAwesome name="clock-o" size={16} color="#06b6d4" />
                  <Text style={styles.gameStatText}>Duration: 2-5 minutes</Text>
                </RNView>
              </RNView>

              <Pressable 
                style={styles.playGameButton}
                onPress={() => {
                  if (gameState.tickets >= 5) {
                    spendTickets(5);
                    router.navigate('/(tabs)/starlight-glide?startGame=true');
                  } else {
                    Alert.alert(
                      "Not Enough Tickets", 
                      "You need 5 tickets to play Starlight Glide.\n\nYou have " + gameState.tickets + " tickets.",
                      [{ text: "OK", onPress: () => {} }]
                    );
                  }
                }}
              >
                <FontAwesome name="gamepad" size={20} color="#ffffff" />
                <Text style={styles.playGameButtonText}>PLAY STARLIGHT GLIDE</Text>
              </Pressable>
            </RNView>
          </BorderedBox>
        </RNView>
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
                        <FontAwesome name="ticket" size={14} color="#8b5cf6" />
                        <Text style={styles.ticketPrice}>Cost: 10</Text>
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

      {/* Snack Purchase Confirmation Modal */}
      <Modal
        visible={showSnackModal}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <RNView style={styles.modalContentWrapper}>
            <RNView style={styles.modalHeader}>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowSnackModal(false)}
              >
                <FontAwesome name="times" size={14} color="#8b5cf6" />
              </Pressable>
            </RNView>
            
            <RNView style={styles.snackModalContent}>
              <Text style={styles.snackModalTitle}>BUY SNACK</Text>
              {selectedSnack && (
                <>
                  <RNView style={styles.snackModalItem}>
                    <Image 
                      source={
                        selectedSnack.image === 'rinkpretzel' ? rinkpretzelImage :
                        selectedSnack.image === 'rinkpopcorn' ? rinkpopcornImage :
                        selectedSnack.image === 'rinkpizza' ? rinkpizzaImage :
                        selectedSnack.image === 'arcadefries' ? arcadefriesImage :
                        selectedSnack.image === 'glowshake' ? glowshakeImage :
                        rinkdogImage
                      } 
                      style={styles.snackModalImage} 
                    />
                    <Text style={styles.snackModalName}>{selectedSnack.name}</Text>
                    <Text style={styles.snackModalDescription}>{selectedSnack.description}</Text>
                    <RNView style={styles.snackModalPriceContainer}>
                      <FontAwesome name="ticket" size={16} color="#8b5cf6" />
                      <Text style={styles.snackModalPrice}>{selectedSnack.price}</Text>
                    </RNView>
                  </RNView>
                  <Text style={styles.snackModalMessage}>
                    Perfect for fueling up during your skating session!
                  </Text>
                  <Pressable 
                    style={styles.snackModalBuyButton}
                    onPress={confirmSnackPurchase}
                  >
                    <Text style={styles.snackModalBuyButtonText}>CONFIRM PURCHASE</Text>
                  </Pressable>
                </>
              )}
            </RNView>
          </RNView>
        </View>
      </Modal>

      {/* Snack Purchase Success Modal */}
      <Modal
        visible={showSnackSuccess}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <RNView style={styles.modalContentWrapper}>
            <RNView style={styles.successModalContent}>
              <FontAwesome name="check-circle" size={40} color="#10b981" />
              <Text style={styles.successModalTitle}>PURCHASE SUCCESSFUL!</Text>
              {selectedSnack && (
                <Text style={styles.successModalText}>
                  {selectedSnack.name} added to your inventory! Perfect for skating!
                </Text>
              )}
            </RNView>
          </RNView>
        </View>
      </Modal>

      {/* Snack Purchase Error Modal */}
      <Modal
        visible={showSnackError}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <RNView style={styles.modalContentWrapper}>
            <RNView style={styles.errorModalContent}>
              <FontAwesome name="exclamation-triangle" size={40} color="#ef4444" />
              <Text style={styles.errorModalTitle}>PURCHASE FAILED</Text>
              <Text style={styles.errorModalText}>{errorMessage}</Text>
              <Pressable 
                style={styles.errorModalButton}
                onPress={() => setShowSnackError(false)}
              >
                <Text style={styles.errorModalButtonText}>OK</Text>
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
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingBottom: 120,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '500',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: '#8b5cf6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 0,
    marginTop: 60,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  rollerRinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 24,
    marginHorizontal: 0,
    marginTop: 4,
    textAlign: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
  },
  sessionBookingContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  sessionHeader: {
    marginBottom: 20,
  },
  sessionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  sessionSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  currentTimeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  sessionsContainer: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
    backdropFilter: 'blur(10px)',
  },
  sessionItemPast: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.5,
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
    minWidth: 0,
  },
  sessionName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    flexShrink: 1,
  },
  sessionTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  sessionDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    lineHeight: 16,
    flexShrink: 1,
  },
  sessionPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  sessionPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  bookButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  bookButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '90%',
    maxWidth: 400,
    padding: 24,
    backdropFilter: 'blur(20px)',
  },
  modalHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ticketContent: {
    alignItems: 'center',
  },
  ticketTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    letterSpacing: 1.5,
  },
  ticketDetails: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  ticketSessionName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  ticketTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 10,
  },
  ticketDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 16,
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ticketPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  ticketMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  awesomeButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  awesomeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Snack bar styles
  thickBorderBox: {
    width: '98%',
  },
  snackBarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  snackBarHeader: {
    marginBottom: 16,
  },
  snackBarTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  snackBarSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  lyleContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
    marginHorizontal: 20,
  },
  lyleImage: {
    width: 80,
    height: 80,
    marginLeft: 2,
    imageRendering: 'pixelated' as any,
  },
  speechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    maxWidth: 240,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  snackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 2,
    alignItems: 'flex-start',
    width: '100%',
  },
  snackItem: {
    width: '32%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 180,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    backdropFilter: 'blur(10px)',
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
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 12,
    textTransform: 'uppercase',
    height: 24,
    justifyContent: 'center',
  },
  snackDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 10,
  },
  snackPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 0,
    height: 20,
  },
  snackPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  snackStock: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 4,
    height: 14,
  },
  snackBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 'auto',
  },
  snackBuyButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  snackBuyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  snackBuyButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  // Snack modal styles
  snackModalContent: {
    alignItems: 'center',
  },
  snackModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  snackModalItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  snackModalImage: {
    width: 50,
    height: 50,
    marginBottom: 12,
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
  },
  snackModalName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  snackModalDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
  },
  snackModalPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  snackModalPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  snackModalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  snackModalBuyButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7c3aed',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  snackModalBuyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Success modal styles
  successModalContent: {
    alignItems: 'center',
    padding: 20,
  },
  successModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  successModalText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  // Error modal styles
  errorModalContent: {
    alignItems: 'center',
    padding: 20,
  },
  errorModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 20,
  },
  errorModalText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  errorModalButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  errorModalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // Game section styles
  gameContainer: {
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  gameHeader: {
    marginBottom: 12,
  },
  gameTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  gameSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  gameContent: {
    alignItems: 'center',
    width: '100%',
  },
  gameDescription: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    backdropFilter: 'blur(10px)',
  },
  gameDescriptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 16,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 0,
    gap: 6,
  },
  gameStatItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 50,
    justifyContent: 'center',
    maxWidth: '30%',
  },
  gameStatText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 10,
    flexWrap: 'wrap',
  },
  playGameButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  playGameButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  trixieContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  trixieSpeechBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    marginLeft: 12,
    maxWidth: 240,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  trixieCharacterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    marginBottom: 4,
    letterSpacing: 1,
  },
  trixieSpeechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    lineHeight: 16,
  },
  trixieImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    transform: [{ scaleX: -1 }],
  },
});
