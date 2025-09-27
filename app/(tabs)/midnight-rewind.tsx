import React, { useState, useRef } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Animated } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the video store image
const midnightRewindImage = require('@/assets/images/midnight-rewind-main.png');
const lilMovieReelImage = require('@/assets/images/lil-movie-reel.png');
const lilVhsImage = require('@/assets/images/lil-vhs.png');
const vinnieShopkeeperImage = require('@/assets/images/vinnie-shopkeeper.png');

// Snack images
const popcornImage = require('@/assets/images/lil-popcorn.png');
const gumballsImage = require('@/assets/images/gumballs.png');
const iceCreamSandwichImage = require('@/assets/images/icecreamsandwich.png');
const chipsImage = require('@/assets/images/chips.png');
const chocolateImage = require('@/assets/images/chocolate.png');
const cupNoddleImage = require('@/assets/images/cupnoddle.png');
const hotChipsImage = require('@/assets/images/hotchips.png');
const milkshakeImage = require('@/assets/images/milkshake.png');

// DVD images
const dvd1Image = require('@/assets/images/dvd1.png');
const dvd2Image = require('@/assets/images/dvd2.png');
const dvd3Image = require('@/assets/images/dvd3.png');
const dvd4Image = require('@/assets/images/dvd4.png');
const dvd5Image = require('@/assets/images/dvd5.png');
const dvd6Image = require('@/assets/images/dvd6.png');
const dvd7Image = require('@/assets/images/dvd7.png');
const dvd8Image = require('@/assets/images/dvd8.png');

const dvdImageMap: { [key: string]: any } = {
  'dvd1.png': dvd1Image,
  'dvd2.png': dvd2Image,
  'dvd3.png': dvd3Image,
  'dvd4.png': dvd4Image,
  'dvd5.png': dvd5Image,
  'dvd6.png': dvd6Image,
  'dvd7.png': dvd7Image,
  'dvd8.png': dvd8Image,
};

const snackImageMap: { [key: string]: any } = {
  'lil-popcorn.png': popcornImage,
  'gumballs.png': gumballsImage,
  'icecreamsandwich.png': iceCreamSandwichImage,
  'chips.png': chipsImage,
  'chocolate.png': chocolateImage,
  'cupnoddle.png': cupNoddleImage,
  'hotchips.png': hotChipsImage,
  'milkshake.png': milkshakeImage,
};

export default function MidnightRewindScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [vhsCollection, setVhsCollection] = useState<string[]>([]);
  const [weeklyRentalUsed, setWeeklyRentalUsed] = useState(false);
  const [weeklyMovieUsed, setWeeklyMovieUsed] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState('');
  const [showRentalSelection, setShowRentalSelection] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const spinAnimation = useRef(new Animated.Value(0)).current;

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

  const vhsTapes = [
    // Common - Junk VHS
    { name: "Bad Sitcom Collection", rarity: "common", description: "Unfunny 80s sitcoms", stamina: 0, type: "junk" },
    { name: "Unlabeled Home Tape", rarity: "common", description: "Someone's vacation footage", stamina: 0, type: "junk" },
    { name: "Weather Report Compilation", rarity: "common", description: "24 hours of weather", stamina: 0, type: "junk" },
    
    // Uncommon - Retro Movie Covers
    { name: "Retro Action Poster", rarity: "uncommon", description: "Vintage movie poster art", stamina: 5, type: "collectible" },
    { name: "Horror Movie Cover", rarity: "uncommon", description: "Classic horror artwork", stamina: 5, type: "collectible" },
    { name: "Sci-Fi Poster", rarity: "uncommon", description: "Futuristic movie art", stamina: 5, type: "collectible" },
    
    // Rare - Buff Tapes
    { name: "Energy Boost Tape", rarity: "rare", description: "Gives your pet energy", stamina: 15, type: "buff" },
    { name: "Happiness VHS", rarity: "rare", description: "Makes your pet happy", stamina: 20, type: "buff" },
    
    // Ultra Rare - Director's Cut
    { name: "Director's Cut: The Lost Scene", rarity: "ultra-rare", description: "Unlocks special décor", stamina: 30, type: "directors-cut" },
    { name: "Behind the Scenes Tape", rarity: "ultra-rare", description: "Rare lore content", stamina: 25, type: "directors-cut" }
  ];

  const staffRecommendations = [
    "I saw something weird at Makeout Hill last night...",
    "The arcade has a new game that's been glitching out.",
    "Someone left a mysterious package at the post office.",
    "The radio station is playing some strange frequencies.",
    "I heard the old lighthouse keeper has been acting odd.",
    "There's been unusual activity at the pier lately.",
    "The corner store got some weird new snacks in.",
    "I saw lights in the sky over the suburbs last night."
  ];

  const rentalVhs = [
    {
      id: 'pool-lurker',
      title: 'Pool Lurker',
      genre: 'Horror',
      description: 'A mysterious creature haunts the local swimming pool at night.',
      price: 1,
      stamina: 10,
      icon: 'dvd1.png'
    },
    {
      id: 'neon-spaceman',
      title: 'Neon Spaceman 9000',
      genre: 'Sci-Fi',
      description: 'A futuristic astronaut battles aliens in a neon-lit cityscape.',
      price: 1,
      stamina: 12,
      icon: 'dvd2.png'
    },
    {
      id: 'dreamcore-dimension',
      title: 'Dreamcore Dimension',
      genre: 'Fantasy',
      description: 'A young girl discovers a portal to a surreal dream world.',
      price: 1,
      stamina: 8,
      icon: 'dvd3.png'
    },
    {
      id: 'kung-fu-babysitter',
      title: 'Kung Fu Babysitter',
      genre: 'Action',
      description: 'A martial arts expert must protect children from dangerous criminals.',
      price: 1,
      stamina: 10,
      icon: 'dvd4.png'
    },
    {
      id: 'neighbor-werewolf',
      title: 'My Neighbor the Werewolf',
      genre: 'Comedy',
      description: 'A suburban family discovers their next-door neighbor is a werewolf.',
      price: 1,
      stamina: 6,
      icon: 'dvd5.png'
    },
    {
      id: 'satellite-boy',
      title: 'Satellite Boy',
      genre: 'Adventure',
      description: 'A boy builds a rocket to reach a mysterious satellite in orbit.',
      price: 1,
      stamina: 15,
      icon: 'dvd6.png'
    },
    {
      id: 'brainwave-overdrive',
      title: 'Brainwave Overdrive',
      genre: 'Thriller',
      description: 'A scientist experiments with mind control technology with deadly results.',
      price: 1,
      stamina: 18,
      icon: 'dvd7.png'
    },
    {
      id: 'astro-junkyard',
      title: 'Astro-Junkyard Terror',
      genre: 'Horror',
      description: 'Space debris crashes to Earth, bringing an alien terror to a junkyard.',
      price: 1,
      stamina: 12,
      icon: 'dvd8.png'
    },
    {
      id: 'mutant-mosquito',
      title: 'Mutant Mosquito Massacre',
      genre: 'Horror',
      description: 'Giant mutated mosquitoes terrorize a small town during summer.',
      price: 1,
      stamina: 14,
      icon: 'dvd1.png'
    },
    {
      id: 'neon-spaceman-2',
      title: 'Neon Spaceman 9000',
      genre: 'Sci-Fi',
      description: 'A futuristic astronaut battles aliens in a neon-lit cityscape.',
      price: 1,
      stamina: 8,
      icon: 'dvd2.png'
    },
    {
      id: 'dreamcore-2',
      title: 'Dreamcore Dimension',
      genre: 'Fantasy',
      description: 'A young girl discovers a portal to a surreal dream world.',
      price: 1,
      stamina: 16,
      icon: 'dvd3.png'
    },
    {
      id: 'kung-fu-2',
      title: 'Kung Fu Babysitter',
      genre: 'Action',
      description: 'A martial arts expert must protect children from dangerous criminals.',
      price: 1,
      stamina: 7,
      icon: 'dvd4.png'
    }
  ];

  const movieSnacks = [
    {
      id: 'popcorn',
      name: 'Buttered Popcorn',
      description: 'Classic movie theater popcorn',
      price: 1,
      stamina: 8,
      icon: 'lil-popcorn.png'
    },
    {
      id: 'gumballs',
      name: 'Rainbow Gumballs',
      description: 'Colorful chewy treats',
      price: 1,
      stamina: 5,
      icon: 'gumballs.png'
    },
    {
      id: 'ice-cream',
      name: 'Ice Cream Sandwich',
      description: 'Sweet frozen treat',
      price: 1,
      stamina: 6,
      icon: 'icecreamsandwich.png'
    },
    {
      id: 'chips',
      name: 'Salty Chips',
      description: 'Crispy potato chips',
      price: 1,
      stamina: 4,
      icon: 'chips.png'
    },
    {
      id: 'chocolate',
      name: 'Chocolate Bar',
      description: 'Rich milk chocolate',
      price: 1,
      stamina: 7,
      icon: 'chocolate.png'
    },
    {
      id: 'cup-noodles',
      name: 'Cup Noodles',
      description: 'Warm instant noodles',
      price: 1,
      stamina: 10,
      icon: 'cupnoddle.png'
    },
    {
      id: 'hot-chips',
      name: 'Spicy Hot Chips',
      description: 'Extra spicy potato chips',
      price: 1,
      stamina: 6,
      icon: 'hotchips.png'
    },
    {
      id: 'milkshake',
      name: 'Vanilla Milkshake',
      description: 'Creamy cold drink',
      price: 1,
      stamina: 9,
      icon: 'milkshake.png'
    }
  ];

  const weeklyRentalMovies = [
    { id: 'weekly-1', title: 'Pool Lurker', genre: 'Horror', icon: 'dvd1.png' },
    { id: 'weekly-2', title: 'Neon Spaceman 9000', genre: 'Sci-Fi', icon: 'dvd2.png' },
    { id: 'weekly-3', title: 'Dreamcore Dimension', genre: 'Fantasy', icon: 'dvd3.png' },
    { id: 'weekly-4', title: 'Kung Fu Babysitter', genre: 'Action', icon: 'dvd4.png' },
    { id: 'weekly-5', title: 'My Neighbor the Werewolf', genre: 'Comedy', icon: 'dvd5.png' },
    { id: 'weekly-6', title: 'Satellite Boy', genre: 'Adventure', icon: 'dvd6.png' },
    { id: 'weekly-7', title: 'Brainwave Overdrive', genre: 'Thriller', icon: 'dvd7.png' },
    { id: 'weekly-8', title: 'Astro-Junkyard Terror', genre: 'Horror', icon: 'dvd8.png' }
  ];

  const openWeeklyRental = () => {
    if (weeklyRentalUsed) return;
    setShowRentalSelection(true);
  };

  const selectWeeklyRental = (movie: any) => {
    setWeeklyRentalUsed(true);
    setShowRentalSelection(false);
    setLastResult(`Free weekly rental selected: ${movie.title}! Added to your inventory. Your pet gained +15 stamina from this classic film! Return within a week to get tokens back!`);
    setShowResult(true);
  };

  const spinVhsRack = () => {
    if (weeklyRentalUsed || isSpinning) return;
    
    setIsSpinning(true);
    
    // Animate the spin
    Animated.sequence([
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(spinAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Determine result based on rarity
      const random = Math.random();
      let selectedTape;
      
      if (random < 0.5) {
        // 50% - Common
        const commonTapes = vhsTapes.filter(t => t.rarity === 'common');
        selectedTape = commonTapes[Math.floor(Math.random() * commonTapes.length)];
      } else if (random < 0.8) {
        // 30% - Uncommon
        const uncommonTapes = vhsTapes.filter(t => t.rarity === 'uncommon');
        selectedTape = uncommonTapes[Math.floor(Math.random() * uncommonTapes.length)];
      } else if (random < 0.95) {
        // 15% - Rare
        const rareTapes = vhsTapes.filter(t => t.rarity === 'rare');
        selectedTape = rareTapes[Math.floor(Math.random() * rareTapes.length)];
      } else {
        // 5% - Ultra Rare
        const ultraRareTapes = vhsTapes.filter(t => t.rarity === 'ultra-rare');
        selectedTape = ultraRareTapes[Math.floor(Math.random() * ultraRareTapes.length)];
      }
      
      setLastResult(selectedTape);
      setShowResult(true);
      setDailySpinUsed(true);
      setIsSpinning(false);
      
      // Add to collection if it's a collectible
      if (selectedTape.type === 'collectible' || selectedTape.type === 'directors-cut') {
        setVhsCollection(prev => [...prev, selectedTape.name]);
      }
    });
  };

  const getRecommendation = () => {
    const randomRec = staffRecommendations[Math.floor(Math.random() * staffRecommendations.length)];
    setCurrentRecommendation(randomRec);
  };

  const checkOutMovie = () => {
    if (weeklyMovieUsed) return;
    setWeeklyMovieUsed(true);
    setLastResult("Movie Night Buff activated! Your pet gained happiness and a Popcorn Charm!");
    setShowResult(true);
  };

  const rentVhs = (vhs: any) => {
    setLastResult(`Rented ${vhs.title}! Your pet gained +${vhs.stamina} stamina and happiness from watching this ${vhs.genre} classic!`);
    setShowResult(true);
  };

  const buySnack = (snack: any) => {
    setLastResult(`Bought ${snack.name}! Your pet gained +${snack.stamina} stamina and happiness from this tasty ${snack.description}!`);
    setShowResult(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>MIDNIGHT REWIND</Text>

        {/* Store Image */}
        <RNView style={styles.storeImageContainer}>
          <Image source={midnightRewindImage} style={styles.storeImage} />
        </RNView>

        {/* Vinnie the Clerk */}
        <RNView style={styles.vinnieContainer}>
          <Image source={vinnieShopkeeperImage} style={styles.vinnieImage} />
          <RNView style={styles.speechBubble}>
            <Text style={styles.speechText}>
              "Welcome to Midnight Rewind! I'm Vinnie, your friendly video store clerk. 
              We've got the best collection of classic movies and rare tapes in town!"
            </Text>
          </RNView>
        </RNView>

        {/* Core Activities */}
        <RNView style={styles.pubActivitiesContainer}>
          {/* Free Weekly Rental */}
          <RNView style={styles.pubActivityItem}>
            <Pressable 
              style={styles.pubActivityPressable}
              onPress={openWeeklyRental}
              disabled={weeklyRentalUsed}
            >
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <Image source={lilVhsImage} style={styles.pubActivityImageIcon} />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>Free Weekly Rental</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>
                      {weeklyRentalUsed ? "Already used this week" : "Choose from 6 special weekly titles"}
                    </Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>

          {/* Movie Night Buff */}
          <RNView style={styles.pubActivityItem}>
            <Pressable 
              style={styles.pubActivityPressable}
              onPress={checkOutMovie}
              disabled={weeklyMovieUsed}
            >
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <Image source={lilVhsImage} style={styles.pubActivityImageIcon} />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>Movie Night Buff</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>
                      {weeklyMovieUsed ? "Already used this week" : "Check out a film for happiness boost"}
                    </Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>

          {/* Staff Gossip */}
          <RNView style={styles.pubActivityItem}>
            <Pressable 
              style={styles.pubActivityPressable}
              onPress={getRecommendation}
            >
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <Image source={lilVhsImage} style={styles.pubActivityImageIcon} />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>Staff Gossip</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>
                      Get random recommendations and hints from Vinnie
                    </Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        </RNView>

        {/* Recommendation Display */}
        {currentRecommendation ? (
          <RNView style={styles.recommendationBox}>
            <Text style={styles.recommendationText}>"{currentRecommendation}"</Text>
          </RNView>
        ) : null}

        {/* VHS Storefront */}
        <Text style={styles.storefrontTitle}>VHS RENTAL STOREFRONT</Text>
        <RNView style={styles.storefrontGrid}>
          {rentalVhs.map((vhs) => (
            <Pressable
              key={vhs.id}
              style={styles.vhsRentalCard}
              onPress={() => rentVhs(vhs)}
            >
              <RNView style={styles.vhsCardContent}>
                <Image source={dvdImageMap[vhs.icon]} style={styles.vhsCardIcon} />
                <Text style={styles.vhsCardTitle}>{vhs.title}</Text>
                <Text style={styles.vhsCardGenre}>{vhs.genre}</Text>
                <Text style={styles.vhsCardDescription}>{vhs.description}</Text>
                <RNView style={styles.vhsCardFooter}>
                  <RNView style={styles.vhsPriceContainer}>
                    <Text style={styles.vhsPrice}>{vhs.price}</Text>
                        <FontAwesome name="ticket" size={12} color="#8b5cf6" />
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          ))}
        </RNView>

        {/* Movie Snacks */}
        <RNView style={styles.snacksShelf}>
          <Text style={styles.snacksTitle}>MOVIE SNACKS</Text>
          <RNView style={styles.snacksGrid}>
            {movieSnacks.map((snack) => (
              <RNView key={snack.id} style={styles.snackItem}>
                <Image source={snackImageMap[snack.icon]} style={styles.snackImage} />
                <Text style={styles.snackName}>{snack.name}</Text>
                <Text style={styles.snackPrice}>{snack.price} ⚡</Text>
                <Text style={styles.snackStamina}>+{snack.stamina} Stamina</Text>
                <RNView style={styles.snackActions}>
                  <Pressable 
                    style={[styles.actionButton, styles.snackBuyButton]}
                    onPress={() => buySnack(snack)}
                  >
                    <Text style={styles.buyButtonText}>BUY</Text>
                  </Pressable>
                </RNView>
              </RNView>
            ))}
          </RNView>
        </RNView>

        {/* VHS Collection */}
        {vhsCollection.length > 0 && (
          <RNView style={styles.collectionSection}>
            <Text style={styles.collectionTitle}>📼 Your VHS Collection</Text>
            <RNView style={styles.collectionGrid}>
              {vhsCollection.map((tape, index) => (
                <RNView key={index} style={styles.vhsSpine}>
                  <Text style={styles.vhsSpineText}>{tape}</Text>
                </RNView>
              ))}
            </RNView>
          </RNView>
        )}

        {/* Result Popup */}
        {showResult && lastResult && (
          <RNView style={styles.resultOverlay}>
            <RNView style={styles.resultBox}>
              <Text style={styles.resultTitle}>VHS Found!</Text>
              <Text style={styles.resultText}>
                {typeof lastResult === 'string' ? lastResult : 
                 `${lastResult.name} (${lastResult.rarity.toUpperCase()})\n${lastResult.description}${lastResult.stamina > 0 ? `\n+${lastResult.stamina} Stamina` : ''}`}
              </Text>
              <Pressable 
                style={styles.closeButton}
                onPress={() => setShowResult(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </RNView>
          </RNView>
        )}

        {/* Weekly Rental Selection Popup */}
        {showRentalSelection && (
          <RNView style={styles.rentalOverlay}>
            <RNView style={styles.rentalBox}>
              <Text style={styles.rentalTitle}>Free Weekly Rental</Text>
              <Text style={styles.rentalSubtitle}>Choose one title to rent for free this week</Text>
              <RNView style={styles.rentalGrid}>
                {weeklyRentalMovies.map((movie) => (
                  <Pressable
                    key={movie.id}
                    style={styles.rentalMovieCard}
                    onPress={() => selectWeeklyRental(movie)}
                  >
                    <RNView style={styles.rentalCardContent}>
                      <Image source={dvdImageMap[movie.icon]} style={styles.rentalCardIcon} />
                      <Text style={styles.rentalCardTitle}>{movie.title}</Text>
                      <Text style={styles.rentalCardGenre}>{movie.genre}</Text>
                      <Text style={styles.rentalCardFree}>FREE</Text>
                    </RNView>
                  </Pressable>
                ))}
              </RNView>
              <Pressable 
                style={styles.rentalCloseButton}
                onPress={() => setShowRentalSelection(false)}
              >
                <Text style={styles.rentalCloseButtonText}>Cancel</Text>
              </Pressable>
            </RNView>
          </RNView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
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
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
    marginTop: -10,
    textAlign: 'center',
  },
  storeImageContainer: {
    width: '100%',
    height: 400,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  vinnieContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  vinnieImage: {
    width: 58,
    height: 58,
    marginRight: 12,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  speechText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
  },
  pubActivitiesContainer: {
    marginBottom: 24,
  },
  pubActivityItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 10,
    marginBottom: 8,
    width: '100%',
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
    width: 20,
    height: 20,
    marginRight: 8,
    alignSelf: 'center',
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
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  pubActivityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
  },
  menuTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  menuItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuItemIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    lineHeight: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuItemPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  recommendationBox: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  recommendationText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontStyle: 'italic',
  },
  collectionSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  collectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  collectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vhsSpine: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  vhsSpineText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    textAlign: 'center',
  },
  resultOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    zIndex: 9999,
  },
  resultBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 40,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  resultTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  storefrontTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    alignSelf: 'center',
  },
  storefrontGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  vhsRentalCard: {
    width: '32%',
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    padding: 8,
    marginBottom: 10,
    aspectRatio: 1.1,
  },
  vhsCardContent: {
    alignItems: 'center',
  },
  vhsCardIcon: {
    width: 30,
    height: 30,
    marginBottom: 6,
  },
  vhsCardTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  vhsCardGenre: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  vhsCardDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'justify',
    lineHeight: 10,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  vhsCardFooter: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  vhsPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  vhsPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  snacksShelf: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#8b5cf6',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  snacksTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    marginTop: 0,
    textAlign: 'center',
    alignSelf: 'center',
  },
  snacksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  snackItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    minHeight: 120,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  snackImage: {
    width: 30,
    height: 30,
    marginBottom: 6,
    imageRendering: 'pixelated' as any,
  },
  snackName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 12,
  },
  snackPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#06b6d4',
    textAlign: 'center',
    marginBottom: 2,
  },
  snackStamina: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 6,
  },
  snackActions: {
    flexDirection: 'column',
    gap: 6,
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  snackBuyButton: {
    backgroundColor: '#ff1493',
  },
  buyButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  rentalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    zIndex: 9999,
  },
  rentalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    maxHeight: '70%',
  },
  rentalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  rentalSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  rentalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rentalMovieCard: {
    width: '48%',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    padding: 8,
    marginBottom: 8,
  },
  rentalCardContent: {
    alignItems: 'center',
  },
  rentalCardIcon: {
    width: 20,
    height: 20,
    marginBottom: 6,
  },
  rentalCardTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 3,
  },
  rentalCardGenre: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 4,
  },
  rentalCardFree: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#10b981',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rentalCloseButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'center',
  },
  rentalCloseButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
