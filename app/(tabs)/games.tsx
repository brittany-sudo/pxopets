import { StyleSheet, ScrollView, View as RNView, Pressable, Image, Alert, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JazzyTitle from '@/components/JazzyTitle';
import React, { useState, useMemo } from 'react';

// Import game images
const arcadeImage = require('@/assets/images/arcade.png');
const tikiGameImage = require('@/assets/images/tiki-game.png');
const fortunaGameImage = require('@/assets/images/fortuna-game.png');
const lostFoundImage = require('@/assets/images/lost-found.png');
const atomicSurfImage = require('@/assets/images/atomic-surf.png');
const luckyGuessImage = require('@/assets/images/lucky-guess.png');
const stampSafariImage = require('@/assets/images/stamp-safari.png');
const keycardHuntImage = require('@/assets/images/keycard-hunt.png');
const perfumersLabImage = require('@/assets/images/perfumers-lab.png');
const driveInImage = require('@/assets/images/drive-in.png');
const grapeStompImage = require('@/assets/images/grape-stomp.png');

export default function GamesScreen() {
  const { addCoins, hydrated } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const categories = ['All', 'Adventure', 'Puzzle', 'Action', 'Simulation', 'Sports'];

  const games = [
    {
      id: 'lost-found',
      name: 'Lost \'n Found',
      icon: 'search',
      color: '#0ea5e9',
      world: 'Foggy Harbor',
      description: 'Search for lost treasures and hidden items!',
      image: lostFoundImage,
      category: 'Adventure'
    },
    {
      id: 'atomic-surf',
      name: 'Atomic Surf',
      icon: 'diamond',
      color: '#f59e0b',
      world: 'Desert Oasis Resort',
      description: 'Ride the atomic waves in this retro surfing adventure!',
      image: atomicSurfImage,
      category: 'Action'
    },
    {
      id: 'lucky-guess',
      name: 'Lucky Guess',
      icon: 'question',
      color: '#10b981',
      world: 'Crescent Oasis',
      description: 'Test your luck with mysterious guessing games!',
      category: 'Puzzle',
      image: luckyGuessImage
    },
    {
      id: 'grape-stomping',
      name: 'Grape Stomp',
      icon: 'glass',
      color: '#8b5cf6',
      world: 'Vintage Hollow',
      description: 'Stomp grapes to make wine!',
      image: grapeStompImage,
      category: 'Simulation'
    },
    {
      id: 'keycard-hunt',
      name: 'Lost Motel Key Card Hunt',
      icon: 'key',
      color: '#dc2626',
      world: 'The Pxoburbs',
      description: 'Find hidden key cards in the abandoned motel!',
      image: keycardHuntImage,
      category: 'Adventure'
    },
    {
      id: 'gem-mining',
      name: 'Ye Olde Wheele',
      icon: 'diamond',
      color: '#6b7280',
      world: 'Mystic Mountains',
      description: 'Mine precious gems and crystals!',
      image: fortunaGameImage,
      category: 'Puzzle'
    },
    {
      id: 'treasure-hunt',
      name: 'Treasure Hunt',
      icon: 'map',
      color: '#dc2626',
      world: 'Pirate\'s Port',
      description: 'Find buried treasure on the high seas!',
      category: 'Adventure'
    },
    {
      id: 'pottery-wheel',
      name: 'Pottery Master',
      icon: 'circle-o',
      color: '#ec4899',
      world: 'Artisan\'s Quarter',
      description: 'Shape clay on the spinning wheel!',
      category: 'Simulation'
    },
    {
      id: 'spell-casting',
      name: 'Magic Spells',
      icon: 'magic',
      color: '#7c3aed',
      world: 'Scholar\'s Library',
      description: 'Cast spells by drawing runes!',
      category: 'Puzzle'
    },
    {
      id: 'hula-dancing',
      name: 'Pearl Diver',
      icon: 'music',
      color: '#f97316',
      world: 'Tiki Island',
      description: 'Learn ancient hula dances!',
      image: tikiGameImage,
      category: 'Action'
    },
    {
      id: 'wine-tasting',
      name: 'Wine Master',
      icon: 'glass',
      color: '#8b5cf6',
      world: 'Vintage Hollow',
      description: 'Taste and identify rare wines!',
      category: 'Puzzle'
    },
    {
      id: 'stamp-safari',
      name: 'Stamp Safari',
      icon: 'book',
      color: '#8b5cf6',
      world: 'The Pxoburbs',
      description: 'Collect rare stamps from around the world!',
      image: stampSafariImage,
      category: 'Adventure'
    },
    {
      id: 'cave-exploration',
      name: 'Cave Explorer',
      icon: 'flashlight',
      color: '#6b7280',
      world: 'Mystic Mountains',
      description: 'Explore dark caves with your torch!',
      category: 'Adventure'
    },
    {
      id: 'drive-in-duel',
      name: 'Drive-In Duel',
      icon: 'car',
      color: '#dc2626',
      world: 'The Pxoburbs',
      description: 'Race and battle at the retro drive-in theater!',
      image: driveInImage,
      category: 'Action'
    },
    {
      id: 'perfumers-lab',
      name: 'Perfumer\'s Lab',
      icon: 'flask',
      color: '#10b981',
      world: 'Emerald Gardens',
      description: 'Create exquisite perfumes and fragrances!',
      image: perfumersLabImage,
      category: 'Simulation'
    },
    {
      id: 'lei-making',
      name: 'Lei Crafting',
      icon: 'heart',
      color: '#f97316',
      world: 'Tiki Island',
      description: 'String beautiful flower leis!',
      category: 'Simulation'
    }
  ];

  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleGamePress = (game: any) => {
    Alert.alert(
      `${game.name}`,
      `${game.description}\n\nWorld: ${game.world}\n\nComing Soon!`,
      [
        { text: "Play", onPress: () => addCoins(5) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Arcade Header with Welcome Box */}
        <RNView style={styles.arcadeHeader}>
          {/* Welcome Box with High Scores */}
          <RNView style={styles.welcomeBox}>
            <Text style={styles.welcomeTitle}>WELCOME TO THE ARCADE!</Text>
            <RNView>
              <RNView style={styles.highScoreItem}>
                <Text style={styles.highScoreText}>1. ATOMIC SURF</Text>
                <Text style={styles.highScoreValue}>12,450</Text>
              </RNView>
              <Text style={styles.playerName}>- NEO_PLAYER</Text>
              
              <RNView style={styles.highScoreItem}>
                <Text style={styles.highScoreText}>2. LOST 'N FOUND</Text>
                <Text style={styles.highScoreValue}>9,870</Text>
              </RNView>
              <Text style={styles.playerName}>- TREASURE_HUNTER</Text>
              
              <RNView style={styles.highScoreItem}>
                <Text style={styles.highScoreText}>3. LUCKY GUESS</Text>
                <Text style={styles.highScoreValue}>8,230</Text>
              </RNView>
              <Text style={styles.playerName}>- LUCKY_STAR</Text>
              
              <RNView style={styles.highScoreItem}>
                <Text style={styles.highScoreText}>4. STAMP SAFARI</Text>
                <Text style={styles.highScoreValue}>7,650</Text>
              </RNView>
              <Text style={styles.playerName}>- SAFARI_MASTER</Text>
              
              <RNView style={styles.highScoreItem}>
                <Text style={styles.highScoreText}>5. TIKI GAME</Text>
                <Text style={styles.highScoreValue}>6,420</Text>
              </RNView>
              <Text style={styles.playerName}>- TIKI_WARRIOR</Text>
            </RNView>
          </RNView>
          
          {/* Arcade Image */}
          <Image 
            source={arcadeImage} 
            style={styles.arcadeImage}
            resizeMode="contain"
          />
        </RNView>

        {/* Banner Section */}
        <RNView style={styles.bannerContainer}>
          <Pressable style={styles.bannerButton} onPress={() => Alert.alert('Favorites', 'Your favorite games will appear here!')}>
            <RNView style={styles.bannerContent}>
              <FontAwesome name="heart" size={20} color="#ec4899" />
              <Text style={styles.bannerTitle}>FAVORITES</Text>
              <Text style={styles.bannerSubtitle}>Your saved games</Text>
            </RNView>
          </Pressable>
          
          <Pressable style={styles.bannerButton} onPress={() => Alert.alert('Casino', 'Welcome to the Pxopia Casino!')}>
            <RNView style={styles.bannerContent}>
              <FontAwesome name="diamond" size={20} color="#f59e0b" />
              <Text style={styles.bannerTitle}>CASINO</Text>
              <Text style={styles.bannerSubtitle}>Betting games</Text>
            </RNView>
          </Pressable>
        </RNView>

        {/* Search Bar */}
        <RNView style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#0ea5e9" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </RNView>

        {/* Categories */}
        <BorderedBox style={styles.wideBox}>
          <RNView style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </RNView>
        </BorderedBox>
        
        <RNView style={styles.gamesGrid}>
            {filteredGames.map((game, index) => (
              <Pressable
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
              >
                {game.image ? (
                  <RNView style={styles.imageContainer}>
                    <Image
                      source={game.image}
                      style={styles.gameImage}
                      resizeMode="cover"
                    />
                  </RNView>
                ) : (
                  <RNView style={[styles.gameIcon, { backgroundColor: game.color + '20' }]}>
                    <FontAwesome name={game.icon as any} size={24} color={game.color} />
                  </RNView>
                )}
                <Text style={styles.gameName}>{game.name}</Text>
              </Pressable>
            ))}
          </RNView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flexGrow: 1,
  },
  arcadeHeader: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
    alignSelf: 'center',
  },
  arcadeImage: {
    width: '55%', // Slightly smaller width to balance better
    height: 211, // 10% bigger than 192 (192 * 1.1 = 211.2, rounded to 211)
  },
  welcomeBox: {
    width: '40%', // Made bigger
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    padding: 15, // Increased padding
    minHeight: 200, // Added minimum height
  },
  welcomeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0ea5e9',
    textAlign: 'center',
    marginBottom: 10,
  },
  highScoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(14, 165, 233, 0.2)',
  },
  highScoreText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
  },
  highScoreValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  playerName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#64748b',
    fontStyle: 'italic',
    marginLeft: 8,
    marginBottom: 4,
  },
  bannerContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
  },
  bannerButton: {
    flex: 1,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    padding: 12,
  },
  bannerContent: {
    alignItems: 'center',
    gap: 4,
  },
  bannerTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    width: '90%',
    marginBottom: 16,
    alignSelf: 'center',
  },
  wideBox: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 16,
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  categoriesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'left',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#0ea5e9',
  },
  categoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gameCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  gameName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
});


