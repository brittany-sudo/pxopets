import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Modal, Alert, Vibration } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import slot machine images
const sunflareSpinImage = require('@/assets/images/sunflare-spin.png');
const alienIdolImage = require('@/assets/images/alien-idol.png');
const crystalJackpotImage = require('@/assets/images/crystal-jackpot.png');
const mirageDreamsImage = require('@/assets/images/mirage-dreams.png');
const cosmicCarnivalImage = require('@/assets/images/cosmic-carnival.png');
const luckyLizardImage = require('@/assets/images/lucky-lizard.png');

export default function NeonSlotMachinesScreen() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [playerCoins, setPlayerCoins] = useState(1000);
  const [playerTickets, setPlayerTickets] = useState(500); // User's tickets
  const [casinoChips, setCasinoChips] = useState(0); // Casino chips currency
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentReels, setCurrentReels] = useState(['🍒', '🍋', '🍊']);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winMessage, setWinMessage] = useState("");

  // Reset spinning state when modal closes
  const closeModal = () => {
    setActiveModal(null);
    setIsSpinning(false);
  };

  // Buy casino chips function
  const buyCasinoChips = (ticketCost: number, chipAmount: number) => {
    if (playerTickets >= ticketCost) {
      setPlayerTickets(prev => prev - ticketCost);
      setCasinoChips(prev => prev + chipAmount);
      Alert.alert("Purchase Successful!", `You bought ${chipAmount} casino chips for ${ticketCost} tickets!`);
    } else {
      Alert.alert("Not Enough Tickets", `You need ${ticketCost} tickets to buy ${chipAmount} casino chips!`);
    }
  };

  const slotMachines = [
    {
      id: 'sunflare-spin',
      name: 'SUNFLARE SPIN',
      description: 'Solar-powered slots with blazing hot wins',
      image: sunflareSpinImage,
      symbols: ['☀️', '🔥', '⭐', '💎', '🎰', '🔔', '7️⃣', '🌟'],
      betAmount: 25,
      staminaCost: 10
    },
    {
      id: 'alien-idol',
      name: 'ALIEN IDOL',
      description: 'Mystical alien symbols bring cosmic fortune',
      image: alienIdolImage,
      symbols: ['👽', '🛸', '🌌', '💫', '🎰', '🔔', '7️⃣', '👾'],
      betAmount: 30,
      staminaCost: 12
    },
    {
      id: 'crystal-jackpot',
      name: 'CRYSTAL JACKPOT',
      description: 'Crystal clear wins with sparkling rewards',
      image: crystalJackpotImage,
      symbols: ['💎', '🔮', '✨', '💠', '🎰', '🔔', '7️⃣', '💍'],
      betAmount: 50,
      staminaCost: 15
    },
    {
      id: 'mirage-dreams',
      name: 'MIRAGE DREAMS',
      description: 'Desert mirages reveal hidden treasures',
      image: mirageDreamsImage,
      symbols: ['🏜️', '🌵', '🌅', '🏺', '🎰', '🔔', '7️⃣', '🐪'],
      betAmount: 40,
      staminaCost: 13
    },
    {
      id: 'cosmic-carnival',
      name: 'COSMIC CARNIVAL',
      description: 'Carnival fun meets cosmic chaos',
      image: cosmicCarnivalImage,
      symbols: ['🎪', '🎠', '🎡', '🎭', '🎰', '🔔', '7️⃣', '🎨'],
      betAmount: 35,
      staminaCost: 11
    },
    {
      id: 'lucky-lizard',
      name: 'LUCKY LIZARD',
      description: 'Scaly luck brings reptilian riches',
      image: luckyLizardImage,
      symbols: ['🦎', '🐉', '💚', '🍀', '🎰', '🔔', '7️⃣', '🐸'],
      betAmount: 20,
      staminaCost: 8
    }
  ];

  const spinSlots = (machine: any) => {
    if (playerStamina < machine.staminaCost) {
      Alert.alert("Not Enough Stamina", `You need ${machine.staminaCost} stamina to play ${machine.name}!`);
      return;
    }

    if (playerCoins < machine.betAmount) {
      Alert.alert("Not Enough Coins", `You need ${machine.betAmount} coins to play ${machine.name}!`);
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setPlayerStamina(prev => prev - machine.staminaCost);
    setPlayerCoins(prev => prev - machine.betAmount);
    
    // Simulate spinning for 2 seconds
    setTimeout(() => {
      const newReels = [
        machine.symbols[Math.floor(Math.random() * machine.symbols.length)],
        machine.symbols[Math.floor(Math.random() * machine.symbols.length)],
        machine.symbols[Math.floor(Math.random() * machine.symbols.length)]
      ];
      
      setCurrentReels(newReels);
      setIsSpinning(false);
      
      // Check for wins
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        const winAmount = newReels[0] === '7️⃣' ? machine.betAmount * 10 : machine.betAmount * 5;
        setPlayerCoins(prev => prev + winAmount);
        setWinMessage(`🎉 JACKPOT! 🎉\n\nYou won ${winAmount} coins!\n\n${newReels[0]} ${newReels[1]} ${newReels[2]}`);
        setShowWinModal(true);
        Vibration.vibrate(500);
      } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
        const winAmount = machine.betAmount * 2;
        setPlayerCoins(prev => prev + winAmount);
        setWinMessage(`🎊 You won ${winAmount} coins!\n\n${newReels[0]} ${newReels[1]} ${newReels[2]}`);
        setShowWinModal(true);
        Vibration.vibrate(200);
      } else {
        setWinMessage(`Better luck next time!\n\n${newReels[0]} ${newReels[1]} ${newReels[2]}`);
        setShowWinModal(true);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/neon-casino')}
          >
            <FontAwesome name="arrow-left" size={12} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.locationTitle}>NEON SLOT MACHINES</Text>
          <RNView style={styles.casinoChipsIndicator}>
            <Image source={require('@/assets/images/lil-chip.png')} style={styles.chipIconSmall} />
            <Text style={styles.chipAmountSmall}>{casinoChips}</Text>
          </RNView>
        </RNView>




        {/* Slot Machines Grid */}
        <RNView style={styles.slotGrid}>
          {slotMachines.map((machine) => (
            <Pressable
              key={machine.id}
              style={styles.slotMachineCard}
              onPress={() => setActiveModal(machine.id)}
            >
              <Image source={machine.image} style={styles.slotMachineImage} />
              <RNView style={styles.slotMachineInfo}>
                <Text style={styles.slotMachineName}>{machine.name}</Text>
                <Text style={styles.slotMachineDescription}>{machine.description}</Text>
                <RNView style={styles.slotMachineStats}>
                  <RNView style={styles.statBadge}>
                    <FontAwesome name="diamond" size={10} color="#8b5cf6" />
                    <Text style={styles.statBadgeText}>{machine.betAmount}</Text>
                  </RNView>
                  <RNView style={styles.statBadge}>
                    <FontAwesome name="heart" size={10} color="#ec4899" />
                    <Text style={styles.statBadgeText}>{machine.staminaCost}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          ))}
        </RNView>

        {/* Slot Machine Modals */}
        {slotMachines.map((machine) => (
          <Modal
            key={machine.id}
            visible={activeModal === machine.id}
            animationType="slide"
            transparent={true}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.slotModal}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotTitle}>{machine.name}</Text>
                  <Pressable 
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <FontAwesome name="times" size={20} color="#ec4899" />
                  </Pressable>
                </View>
                
                <RNView style={styles.slotMachineContainer}>
                  <Image source={machine.image} style={styles.modalSlotImage} />
                  
                  <RNView style={styles.slotReels}>
                    {currentReels.map((symbol, index) => (
                      <RNView key={index} style={styles.slotReel}>
                        <Text style={styles.slotSymbol}>{symbol}</Text>
                      </RNView>
                    ))}
                  </RNView>
                  
                  <RNView style={styles.betInfo}>
                    <Text style={styles.betText}>Bet: {machine.betAmount} coins</Text>
                    <Text style={styles.staminaText}>Cost: {machine.staminaCost} stamina</Text>
                  </RNView>
                  
                  <Pressable 
                    style={[styles.spinButton, isSpinning && styles.spinningButton]}
                    onPress={() => spinSlots(machine)}
                    disabled={isSpinning}
                  >
                    <Text style={styles.spinButtonText}>
                      {isSpinning ? 'SPINNING...' : 'SPIN'}
                    </Text>
                  </Pressable>
                </RNView>
              </View>
            </View>
          </Modal>
        ))}

        {/* Win Modal */}
        <Modal
          visible={showWinModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.winModal}>
              <Text style={styles.winTitle}>🎰 Slot Result 🎰</Text>
              <Text style={styles.winMessage}>{winMessage}</Text>
              <Pressable
                style={styles.winButton}
                onPress={() => setShowWinModal(false)}
              >
                <Text style={styles.winButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fce7f3', // Light pink background
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 20,
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
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'absolute',
    left: 0,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ec4899',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    flex: 1,
    marginLeft: 80,
    marginRight: 80,
  },
  casinoChipsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  chipIconSmall: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  chipAmountSmall: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ec4899',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    gap: 6,
  },
  statText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  roomTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  roomSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  chipPurchaseContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chipPurchaseTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  chipOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  chipOption: {
    flex: 1,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chipAmount: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  chipPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipPriceText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  slotMachineCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    padding: 8,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  slotMachineImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  slotMachineInfo: {
    alignItems: 'center',
  },
  slotMachineName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  slotMachineDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 12,
  },
  slotMachineStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  statBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1000,
  },
  slotModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1001,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  slotTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ec4899',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  slotMachineContainer: {
    alignItems: 'center',
  },
  modalSlotImage: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  slotReels: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  slotReel: {
    width: 70,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  slotSymbol: {
    fontSize: 28,
  },
  betInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  betText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  spinButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#db2777',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  spinningButton: {
    backgroundColor: '#64748b',
  },
  spinButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  winModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    alignItems: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  winTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 16,
  },
  winMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  winButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  winButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ffffff',
  },
});
