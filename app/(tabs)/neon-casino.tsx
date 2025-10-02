import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Modal, Alert, Vibration } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the casino image
const neonCasinoImage = require('@/assets/images/neon-casino.png');
const lilChipImage = require('@/assets/images/lil-chip.png');

// Import game images
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const iceCreamSandwichImage = require('@/assets/images/icecreamsandwich.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const lilAtomicDinerImage = require('@/assets/images/lil-atomic-diner.png');
const rinkPizzaImage = require('@/assets/images/rinkpizza.png');
const glowCornImage = require('@/assets/images/glowcorn.png');
const galaxySundaeImage = require('@/assets/images/galaxysundae.png');
const blueTboneImage = require('@/assets/images/blue-tbone.png');

// Image mapping
const imageMap: { [key: string]: any } = {
  'cosmicburger.png': cosmicBurgerImage,
  'icecreamsandwich.png': iceCreamSandwichImage,
  'gumballs.png': gumballsImage,
  'lil-atomic-diner.png': lilAtomicDinerImage,
  'rinkpizza.png': rinkPizzaImage,
  'glowcorn.png': glowCornImage,
  'galaxysundae.png': galaxySundaeImage,
  'blue-tbone.png': blueTboneImage,
  'lil-chip.png': lilChipImage,
};

export default function NeonCasinoScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [dealerSaying, setDealerSaying] = useState<string>('');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showBlackjackModal, setShowBlackjackModal] = useState(false);
  const [playerStamina, setPlayerStamina] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [activePetName, setActivePetName] = useState("Pixel");
  const [showWinModal, setShowWinModal] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  const [playerCoins, setPlayerCoins] = useState(1000);
  const [slotbotSaying, setSlotbotSaying] = useState<string>('');

  // Dex's Mischievous Personality
  const getDexGreeting = () => {
    const greetings = [
      "Well, well, well... look who wandered into my neon playground! I'm Dex, and I'm about to make your day... interesting.",
      "Oh ho! Another sucker—I mean, customer! I'm Dex, and I've got some games that'll make your head spin faster than my slot machines!",
      "Welcome to the Neon Casino, my friend! I'm Dex, and I'm here to... help you part with your gems. *winks mischievously*",
      "Ah, fresh meat—I mean, fresh faces! I'm Dex, and this here's my little slice of cosmic chaos. Care to play?",
      "Well, well, what do we have here? I'm Dex, and I'm the master of this neon maze. Ready to lose some gems? I mean, win big!",
      "Step right up, space cadet! I'm Dex, and I've got games that'll make your head spin and your wallet... lighter. *grins*",
      "Oh my, another brave soul! I'm Dex, and I'm here to show you games that are... let's say, educational. You'll learn about probability!",
      "Welcome to my neon kingdom, traveler! I'm Dex, and I'm about to teach you the fine art of... strategic gem management. *evil chuckle*",
      "Well, well, another cosmic gambler! I'm Dex, and I've got some games that'll make you question everything you know about luck!",
      "Ah, a new face in my electric empire! I'm Dex, and I'm here to... entertain you with some of the most... interesting games in the galaxy!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleDexInteraction = () => {
    setDealerSaying(getDexGreeting());
  };

  // Initialize Dex's greeting on component mount
  React.useEffect(() => {
    setDealerSaying(getDexGreeting());
  }, []);

  // Slotbot's Robotic Personality
  const getSlotbotGreeting = () => {
    const greetings = [
      "BEEP BOOP! Welcome to the rewards section! I am Slotbot777, your automated assistant for all casino prizes!",
      "Greetings, human! I am Slotbot777, programmed to help you with your cosmic casino rewards! BEEP!",
      "Hello there! I'm Slotbot777, the casino's reward distribution unit! Ready to show you some amazing prizes!",
      "BEEP BOOP! I am Slotbot777, your friendly neighborhood casino bot! Let me show you what treasures await!",
      "Welcome to the rewards terminal! I am Slotbot777, and I'm here to assist with all your prize needs! BEEP!",
      "Greetings, space traveler! I'm Slotbot777, the casino's automated reward system! What can I help you with?",
      "BEEP! I am Slotbot777, your cosmic casino companion! Ready to explore the wonderful world of rewards?",
      "Hello! I'm Slotbot777, programmed to make your casino experience more rewarding! BEEP BOOP!",
      "Greetings! I am Slotbot777, the casino's prize distribution bot! Let's find you something special!",
      "BEEP BOOP! Welcome to my domain! I'm Slotbot777, and I'm here to help you discover amazing casino rewards!"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleSlotbotInteraction = () => {
    setSlotbotSaying(getSlotbotGreeting());
  };

  // Initialize Slotbot's greeting on component mount
  React.useEffect(() => {
    setSlotbotSaying(getSlotbotGreeting());
  }, []);

  // Slot machine functionality
  const slotSymbols = ['🍒', '🍋', '🍊', '⭐', '💎', '🎰', '🔔', '7️⃣'];
  const [slotReels, setSlotReels] = useState(['🍒', '🍋', '🍊']);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinSlots = () => {
    if (playerStamina < 10) {
      Alert.alert("Not Enough Stamina", "You need more energy to play the slots!");
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setPlayerStamina(prev => prev - 10);
    
    // Simulate spinning for 2 seconds
    setTimeout(() => {
      const newReels = [
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)]
      ];
      
      setSlotReels(newReels);
      setIsSpinning(false);
      
      // Check for wins
      if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
        const winAmount = newReels[0] === '7️⃣' ? 100 : 50;
        setPlayerCoins(prev => prev + winAmount);
        setWinMessage(`🎉 JACKPOT! 🎉\n\nYou won ${winAmount} gems!\n\n${newReels[0]} ${newReels[1]} ${newReels[2]}`);
        setShowWinModal(true);
      } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
        const winAmount = 20;
        setPlayerCoins(prev => prev + winAmount);
        setWinMessage(`🎊 You won ${winAmount} gems!\n\n${newReels[0]} ${newReels[1]} ${newReels[2]}`);
        setShowWinModal(true);
      } else {
        setWinMessage(`Better luck next time!\n\n${newReels[0]} ${newReels[1]} ${newReels[2]}`);
        setShowWinModal(true);
      }
    }, 2000);
  };

  // Blackjack functionality
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [betAmount, setBetAmount] = useState(50);

  const dealCard = (): number => {
    return Math.floor(Math.random() * 13) + 1;
  };

  const getCardValue = (card: number): number => {
    if (card === 1) return 11; // Ace
    if (card > 10) return 10; // Face cards
    return card;
  };

  const getHandValue = (hand: number[]): number => {
    let value = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card === 1).length;
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const startBlackjack = () => {
    if (playerStamina < 15) {
      Alert.alert("Not Enough Stamina", "You need more energy to play blackjack!");
      return;
    }

    if (playerCoins < betAmount) {
      Alert.alert("Not Enough Gems", "You need more gems to place this bet!");
      return;
    }

    setPlayerStamina(prev => prev - 15);
    setPlayerCoins(prev => prev - betAmount);
    
    const newPlayerHand = [dealCard(), dealCard()];
    const newDealerHand = [dealCard()];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStatus('playing');
  };

  const hit = () => {
    if (gameStatus !== 'playing') return;
    
    const newCard = dealCard();
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);
    
    if (getHandValue(newHand) > 21) {
      setGameStatus('finished');
      setWinMessage(`Bust! You went over 21.\n\nDealer wins this round.`);
      setShowWinModal(true);
    }
  };

  const stand = () => {
    if (gameStatus !== 'playing') return;
    
    let newDealerHand = [...dealerHand];
    while (getHandValue(newDealerHand) < 17) {
      newDealerHand.push(dealCard());
    }
    
    setDealerHand(newDealerHand);
    setGameStatus('finished');
    
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(newDealerHand);
    
    if (dealerValue > 21) {
      setPlayerCoins(prev => prev + betAmount * 2);
      setWinMessage(`Dealer busts! You win ${betAmount * 2} gems!`);
    } else if (playerValue > dealerValue) {
      setPlayerCoins(prev => prev + betAmount * 2);
      setWinMessage(`You win! ${playerValue} beats ${dealerValue}.\n\nYou won ${betAmount * 2} gems!`);
    } else if (playerValue === dealerValue) {
      setPlayerCoins(prev => prev + betAmount);
      setWinMessage(`Push! It's a tie.\n\nYour bet is returned.`);
    } else {
      setWinMessage(`Dealer wins! ${dealerValue} beats ${playerValue}.`);
    }
    
    setShowWinModal(true);
  };

  const resetBlackjack = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameStatus('waiting');
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const casinoActivities = [
    {
      id: 'rooftop-pool',
      name: 'Neon Rooftop Pool & Lounge',
      description: 'Exclusive VIP area with cosmic cocktails and stellar views',
      stamina: 0,
      price: 100,
      icon: 'star',
      isHighlighted: true
    },
    {
      id: 'slot-machines',
      name: 'Neon Slot Machines',
      description: 'Try your luck at the glowing cosmic slot machines',
      stamina: 10,
      price: 25,
      icon: 'gamepad'
    },
    {
      id: 'blackjack',
      name: 'Cosmic Blackjack',
      description: 'Play the classic card game with cosmic twists',
      stamina: 15,
      price: 50,
      icon: 'diamond'
    },
    {
      id: 'luxe-shop',
      name: 'Luxe Casino Shop',
      description: 'Browse exclusive high-end casino merchandise and collectibles',
      stamina: 0,
      price: 0,
      icon: 'shopping-bag'
    },
    {
      id: 'chat-dealer',
      name: 'Chat with Dex',
      description: 'Talk to the mischievous cosmic dealer',
      stamina: 5,
      price: 0,
      icon: 'user'
    }
  ];

  const casinoRewards = [
    {
      id: 'cosmic-chips',
      name: 'Cosmic Chips',
      description: 'Glowing casino chips that pulse with stardust energy',
      price: 100,
      stamina: 0,
      icon: 'lil-chip.png'
    },
    {
      id: 'lucky-charm',
      name: 'Lucky Charm',
      description: 'A mystical charm that increases your gambling luck',
      price: 200,
      stamina: 0,
      icon: 'icecreamsandwich.png'
    },
    {
      id: 'golden-dice',
      name: 'Golden Dice',
      description: 'Magical dice that always land on your lucky number',
      price: 300,
      stamina: 0,
      icon: 'glowcorn.png'
    },
    {
      id: 'neon-crown',
      name: 'Neon Crown',
      description: 'A crown that glows with the colors of the casino',
      price: 500,
      stamina: 0,
      icon: 'galaxysundae.png'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/crescent-oasis')}
          >
            <FontAwesome name="arrow-left" size={12} color="#ec4899" />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.locationTitle}>NEON CASINO</Text>
        </RNView>

        {/* Casino Image */}
        <Image source={neonCasinoImage} style={styles.casinoImage} />

        {/* Dex the Dealer */}
        <RNView style={styles.attendantContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>DEX:</Text>
            <Text style={styles.speechText}>
              {dealerSaying}
            </Text>
          </RNView>
          <Image source={require('@/assets/images/dex-guy.png')} style={styles.dexImage} />
        </RNView>

        {/* Chip Purchase Options */}
        <RNView style={styles.chipPurchaseContainer}>
          <Text style={styles.chipPurchaseTitle}>BUY CASINO CHIPS</Text>
          <RNView style={styles.chipOptionsContainer}>
            <Pressable 
              style={styles.chipOption}
              onPress={() => Alert.alert("Chip Purchase", "You bought 50 chips for 5 tickets!")}
            >
              <Image source={lilChipImage} style={styles.chipIcon} />
              <Text style={styles.chipAmount}>50 CHIPS</Text>
              <RNView style={styles.chipPrice}>
                <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                <Text style={styles.chipPriceText}>5</Text>
              </RNView>
            </Pressable>
            
            <Pressable 
              style={styles.chipOption}
              onPress={() => Alert.alert("Chip Purchase", "You bought 150 chips for 12 tickets!")}
            >
              <Image source={lilChipImage} style={styles.chipIcon} />
              <Text style={styles.chipAmount}>150 CHIPS</Text>
              <RNView style={styles.chipPrice}>
                <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                <Text style={styles.chipPriceText}>12</Text>
              </RNView>
            </Pressable>
            
            <Pressable 
              style={styles.chipOption}
              onPress={() => Alert.alert("Chip Purchase", "You bought 300 chips for 20 tickets!")}
            >
              <Image source={lilChipImage} style={styles.chipIcon} />
              <Text style={styles.chipAmount}>300 CHIPS</Text>
              <RNView style={styles.chipPrice}>
                <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                <Text style={styles.chipPriceText}>20</Text>
              </RNView>
            </Pressable>
          </RNView>
        </RNView>

        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>CASINO ACTIVITIES</Text>
        
        {/* Activities */}
        {casinoActivities.map((activity) => (
          <RNView key={activity.id} style={activity.isHighlighted ? styles.highlightedActivityItem : styles.pubActivityItem}>
            <Pressable 
              style={styles.pubActivityPressable}
              onPress={() => {
                if (activity.id === 'rooftop-pool') {
                  router.navigate('/(tabs)/neon-rooftop-lounge');
                } else if (activity.id === 'slot-machines') {
                  setShowSlotModal(true);
                } else if (activity.id === 'blackjack') {
                  setShowBlackjackModal(true);
                } else if (activity.id === 'luxe-shop') {
                  Alert.alert("Luxe Casino Shop", "Welcome to our exclusive boutique! Browse premium casino merchandise, limited edition collectibles, and luxury accessories.");
                } else if (activity.id === 'chat-dealer') {
                  handleDexInteraction();
                }
              }}
            >
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <FontAwesome name={activity.icon as any} size={20} color="#8b5cf6" style={styles.pubActivityImageIcon} />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>{activity.name}</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        ))}

        {/* Slotbot777 Character */}
        <RNView style={styles.slotbotContainer}>
          <RNView style={styles.slotbotSpeechBubble}>
            <Text style={styles.slotbotCharacterName}>SLOTBOT777:</Text>
            <Text style={styles.slotbotSpeechText}>
              {slotbotSaying}
            </Text>
          </RNView>
          <Pressable onPress={handleSlotbotInteraction}>
            <Image source={require('@/assets/images/slotbot777.png')} style={styles.slotbotImage} />
          </Pressable>
        </RNView>

        {/* Casino Rewards */}
        <Text style={styles.rewardsTitle}>CASINO REWARDS</Text>
        
        <RNView style={styles.rewardsContainer}>
          {casinoRewards.map((item) => (
            <RNView key={item.id} style={styles.rewardItem}>
              <RNView style={styles.rewardItemHeader}>
                <Image source={imageMap[item.icon]} style={styles.rewardItemIcon} />
                <RNView style={styles.rewardItemInfo}>
                  <Text style={styles.rewardItemName}>{item.name}</Text>
                  <Text style={styles.rewardItemDescription}>{item.description}</Text>
                </RNView>
              </RNView>
              <RNView style={styles.rewardItemFooter}>
                <RNView style={styles.ticketPriceContainer}>
                  <Text style={styles.rewardItemPrice}>{item.price}</Text>
                  <FontAwesome name="diamond" size={10} color="#ec4899" />
                </RNView>
              </RNView>
            </RNView>
          ))}
        </RNView>

        {/* Slot Machine Modal */}
        <Modal
          visible={showSlotModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowSlotModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.slotModal}>
              <View style={styles.slotHeader}>
                <Text style={styles.slotTitle}>NEON SLOT MACHINE</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setShowSlotModal(false)}
                >
                  <FontAwesome name="times" size={20} color="#ec4899" />
                </Pressable>
              </View>
              
              <RNView style={styles.slotMachine}>
                <RNView style={styles.slotReels}>
                  {slotReels.map((symbol, index) => (
                    <RNView key={index} style={styles.slotReel}>
                      <Text style={styles.slotSymbol}>{symbol}</Text>
                    </RNView>
                  ))}
                </RNView>
                <Pressable 
                  style={[styles.spinButton, isSpinning && styles.spinningButton]}
                  onPress={spinSlots}
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

        {/* Blackjack Modal */}
        <Modal
          visible={showBlackjackModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowBlackjackModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.blackjackModal}>
              <View style={styles.blackjackHeader}>
                <Text style={styles.blackjackTitle}>COSMIC BLACKJACK</Text>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => {
                    setShowBlackjackModal(false);
                    resetBlackjack();
                  }}
                >
                  <FontAwesome name="times" size={20} color="#ec4899" />
                </Pressable>
              </View>
              
              <RNView style={styles.blackjackGame}>
                <RNView style={styles.betContainer}>
                  <Text style={styles.betLabel}>Bet Amount:</Text>
                  <RNView style={styles.betButtons}>
                    <Pressable style={styles.betButton} onPress={() => setBetAmount(25)}>
                      <Text style={styles.betButtonText}>25</Text>
                    </Pressable>
                    <Pressable style={styles.betButton} onPress={() => setBetAmount(50)}>
                      <Text style={styles.betButtonText}>50</Text>
                    </Pressable>
                    <Pressable style={styles.betButton} onPress={() => setBetAmount(100)}>
                      <Text style={styles.betButtonText}>100</Text>
                    </Pressable>
                  </RNView>
                </RNView>

                {gameStatus === 'waiting' && (
                  <Pressable style={styles.dealButton} onPress={startBlackjack}>
                    <Text style={styles.dealButtonText}>DEAL CARDS</Text>
                  </Pressable>
                )}

                {gameStatus === 'playing' && (
                  <RNView style={styles.gameArea}>
                    <RNView style={styles.handContainer}>
                      <Text style={styles.handLabel}>Your Hand ({getHandValue(playerHand)})</Text>
                      <RNView style={styles.hand}>
                        {playerHand.map((card, index) => (
                          <RNView key={index} style={styles.card}>
                            <Text style={styles.cardText}>{card === 1 ? 'A' : card > 10 ? 'JQK'[card-11] : card}</Text>
                          </RNView>
                        ))}
                      </RNView>
                    </RNView>

                    <RNView style={styles.handContainer}>
                      <Text style={styles.handLabel}>Dealer's Hand ({getHandValue(dealerHand)})</Text>
                      <RNView style={styles.hand}>
                        {dealerHand.map((card, index) => (
                          <RNView key={index} style={styles.card}>
                            <Text style={styles.cardText}>{card === 1 ? 'A' : card > 10 ? 'JQK'[card-11] : card}</Text>
                          </RNView>
                        ))}
                      </RNView>
                    </RNView>

                    <RNView style={styles.actionButtons}>
                      <Pressable style={styles.actionButton} onPress={hit}>
                        <Text style={styles.actionButtonText}>HIT</Text>
                      </Pressable>
                      <Pressable style={styles.actionButton} onPress={stand}>
                        <Text style={styles.actionButtonText}>STAND</Text>
                      </Pressable>
                    </RNView>
                  </RNView>
                )}
              </RNView>
              
            </View>
          </View>
        </Modal>

        {/* Win Modal */}
        <Modal
          visible={showWinModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.winModal}>
              <Text style={styles.winTitle}>🎰 Casino Result 🎰</Text>
              <Text style={styles.winMessage}>{winMessage}</Text>
              <Pressable
                style={styles.winButton}
                onPress={() => {
                  setShowWinModal(false);
                  if (gameStatus === 'finished') {
                    resetBlackjack();
                  }
                }}
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
    backgroundColor: '#fce7f3', // Light pink desert background
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
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    flex: 1,
    marginLeft: 16,
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ec4899',
    marginLeft: 6,
    fontWeight: 'bold',
  },
  casinoImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  attendantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '95%',
    alignSelf: 'center',
  },
  dexImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginLeft: 2,
  },
  speechBubble: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ec4899',
    maxWidth: 250,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  characterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ec4899',
    marginBottom: 4,
    textAlign: 'center',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 16,
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
  chipIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginBottom: 6,
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
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  highlightedActivityItem: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ffd700',
    padding: 16,
    marginBottom: 12,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pubActivityItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pubActivityPressable: {
    width: '100%',
  },
  pubActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pubActivityInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  pubActivityImageIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignSelf: 'center',
    color: '#ec4899',
  },
  pubActivityText: {
    flex: 1,
  },
  pubActivityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  pubActivityName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    lineHeight: 16,
    marginBottom: 3,
  },
  pubActivityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    textAlign: 'justify',
  },
  rewardsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  rewardsContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    padding: 16,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rewardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardItemIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: 'contain',
  },
  rewardItemInfo: {
    flex: 1,
  },
  rewardItemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 3,
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  rewardItemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    textAlign: 'justify',
  },
  rewardItemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardItemPrice: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slotModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
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
  slotMachine: {
    alignItems: 'center',
  },
  slotReels: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  slotReel: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSymbol: {
    fontSize: 24,
  },
  spinButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#db2777',
  },
  spinningButton: {
    backgroundColor: '#64748b',
  },
  spinButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  blackjackModal: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  blackjackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  blackjackTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#ec4899',
    textAlign: 'center',
    flex: 1,
  },
  blackjackGame: {
    alignItems: 'center',
  },
  betContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  betLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    marginBottom: 10,
  },
  betButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  betButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  betButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
  },
  dealButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  dealButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
  },
  gameArea: {
    width: '100%',
  },
  handContainer: {
    marginBottom: 15,
  },
  handLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  hand: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  card: {
    width: 40,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
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
  // Slotbot777 Styles
  slotbotContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  slotbotSpeechBubble: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ec4899',
    maxWidth: 280,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  slotbotCharacterName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: '#ec4899',
    marginBottom: 4,
    textAlign: 'center',
  },
  slotbotSpeechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 16,
  },
  slotbotImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
});
