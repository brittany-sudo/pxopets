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
const starlightGlideImage = require('@/assets/images/starlightglide.png');
const lavaJugTossImage = require('@/assets/images/lavajugtoss.png');

export default function GamesScreen() {
  const { addCoins, hydrated } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const categories = ['All', 'Adventure', 'Puzzle', 'Action', 'Simulation', 'Sports', 'Casino', 'Favorites'];

  const toggleFavorite = (gameId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(gameId)) {
        newFavorites.delete(gameId);
      } else {
        newFavorites.add(gameId);
      }
      return newFavorites;
    });
  };

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
      id: 'starlight-glide',
      name: 'Starlight Glide',
      icon: 'star',
      color: '#dc2626',
      world: 'Starlight Roller Rink',
      description: 'Glide through the stars in this magical skating adventure!',
      image: starlightGlideImage,
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
      id: 'lava-jug-toss',
      name: 'Lava Jug Toss',
      icon: 'fire',
      color: '#7c3aed',
      world: 'Volcanic Peaks',
      description: 'Toss lava jugs with precision and skill!',
      image: lavaJugTossImage,
      category: 'Action'
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
      
      let matchesCategory = false;
      if (selectedCategory === 'All') {
        matchesCategory = true;
      } else if (selectedCategory === 'Favorites') {
        matchesCategory = favorites.has(game.id);
      } else if (selectedCategory === 'Casino') {
        // For now, we'll treat casino as a special category - you can add casino games later
        matchesCategory = game.category === 'Casino' || game.name.toLowerCase().includes('casino');
      } else {
        matchesCategory = game.category === selectedCategory;
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, favorites]);

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
        {/* Arcade Header Image - Above welcome text */}
        <RNView style={styles.arcadeImageContainer}>
          <Image 
            source={arcadeImage} 
            style={styles.arcadeHeaderImage}
            resizeMode="contain"
          />
        </RNView>

        {/* Full Width Welcome Box with High Scores */}
        <RNView style={styles.welcomeBox}>
          <Text style={styles.welcomeTitle}>WELCOME TO THE GAME ROOM</Text>
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


        {/* Search Bar */}
        <RNView style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#8b5cf6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </RNView>

        {/* Categories */}
        <RNView style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <RNView style={styles.categoriesBox}>
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
                  {category === 'Favorites' ? (
                    <FontAwesome 
                      name="star" 
                      size={12} 
                      color={selectedCategory === category ? "#ffffff" : "#8b5cf6"} 
                    />
                  ) : (
                    <Text style={[
                      styles.categoryText,
                      selectedCategory === category && styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  )}
                </Pressable>
              ))}
            </RNView>
          </RNView>
        </RNView>
        
        <RNView style={styles.gamesGrid}>
            {filteredGames.map((game, index) => (
              <Pressable
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleGamePress(game)}
              >
                <RNView style={styles.gameCardHeader}>
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(game.id);
                    }}
                  >
                    <FontAwesome 
                      name={favorites.has(game.id) ? "star" : "star-o"} 
                      size={14} 
                      color={favorites.has(game.id) ? "#8b5cf6" : "#999999"} 
                    />
                  </Pressable>
                </RNView>
                
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
  arcadeImageContainer: {
    width: '95%',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  arcadeHeaderImage: {
    width: 200, // Fixed width for header
    height: 120, // Smaller height since it's now a header
  },
  welcomeBox: {
    width: '95%', // Full width like categories
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Clean white background
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border like explore page
    borderRadius: 12, // More rounded for sleek look
    padding: 20, // More padding for premium feel
    marginBottom: 16, // Space before search
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  welcomeTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16, // Larger title (was 12)
    color: '#1f2937', // Darker, more premium color
    textAlign: 'center',
    marginBottom: 16, // More space below
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  highScoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6, // More padding for better spacing
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.15)', // Purple divider
    backgroundColor: 'rgba(139, 92, 246, 0.05)', // Subtle background
    borderRadius: 4, // Rounded score items
    marginBottom: 2, // Space between items
  },
  highScoreText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Larger (was 9)
    color: '#374151', // Softer dark color
    fontWeight: '500',
  },
  highScoreValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Larger (was 9)
    color: '#8b5cf6', // Purple to match theme
    fontWeight: 'bold',
  },
  playerName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10, // Larger (was 8)
    color: '#6b7280', // Softer gray
    fontStyle: 'italic',
    marginLeft: 8,
    marginBottom: 6, // More space
    opacity: 0.8,
  },
  gameCardHeader: {
    position: 'absolute',
    top: 12, // More centered vertically
    right: 12, // More centered from right edge
    zIndex: 1,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Cleaner white like other elements
    borderRadius: 12, // More rounded like other co-star elements
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Better shadow like other elements
    shadowOpacity: 0.1,
    shadowRadius: 8, // Larger shadow radius
    elevation: 3, // Higher elevation
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10, // Slightly more padding
    paddingHorizontal: 16, // More horizontal padding
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border like scoreboard
    borderRadius: 12, // More rounded like scoreboard
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Clean white background
    width: '90%', // Smaller width
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  categoriesSection: {
    width: '95%',
    marginBottom: 16,
    alignSelf: 'center',
  },
  categoriesTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#0ea5e9',
    marginBottom: 3,
    textAlign: 'left',
  },
  categoriesBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)', // Clean white background
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border like scoreboard
    borderRadius: 12, // More rounded like scoreboard
    padding: 16, // More padding for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14, // Larger (was 12)
    color: '#374151', // Softer dark color like scoreboard
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  categoriesTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16, // Larger (was 12)
    fontWeight: 'bold',
    color: '#1f2937', // Darker, more premium color like scoreboard
    marginBottom: 8, // Closer to categories (was 16)
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8, // More padding
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)', // Purple border
    borderRadius: 8, // More rounded
    backgroundColor: 'rgba(139, 92, 246, 0.05)', // Subtle purple background
  },
  selectedCategory: {
    backgroundColor: '#8b5cf6', // Purple selected state
    borderColor: '#8b5cf6',
  },
  categoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12, // Larger (was 10)
    color: '#8b5cf6', // Purple text
    fontWeight: '500',
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
    padding: 2,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 6, // Less rounded (was 8)
    borderWidth: 2,
    borderColor: '#0ea5e9',
    overflow: 'hidden',
    marginBottom: 4, // Closer to text (was 8)
  },
  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4, // Closer to text (was 8)
  },
  gameImage: {
    width: '100%',
    height: '100%',
  },
  gameName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14, // Larger (was 12)
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 0,
  },
});


