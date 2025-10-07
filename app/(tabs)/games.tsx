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
const lavaJugTossImage = require('@/assets/images/lavajugtoss.png');
const cellarKeeperImage = require('@/assets/images/cellarkeeper.png');

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
      world: 'Cosmic Oasis',
      description: 'Test your luck with mysterious guessing games!',
      category: 'Puzzle',
      image: luckyGuessImage
    },
    {
      id: 'grape-stomping',
      name: 'Grape Stomp',
      icon: 'glass',
      color: '#8b5cf6',
      world: 'Barrelhaven',
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
      name: 'Cellar Keeper',
      icon: 'glass',
      color: '#8b5cf6',
      world: 'Barrelhaven',
      description: 'Taste and identify rare wines!',
      image: cellarKeeperImage,
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
        {/* Co-Star/GameBoy Style Welcome Box */}
        <RNView style={styles.welcomeBox}>
          <Text style={styles.welcomeTitle}>GAME ROOM</Text>
          <Text style={styles.welcomeSubtitle}>Digital Arcade Experience</Text>
          
          <RNView style={styles.actionButtons}>
            <Pressable style={styles.actionButton}>
              <FontAwesome name="trophy" size={16} color="#8b5cf6" />
              <Text style={styles.actionButtonText}>HIGH SCORES</Text>
            </Pressable>
            
            <Pressable style={styles.actionButton}>
              <FontAwesome name="star" size={16} color="#8b5cf6" />
              <Text style={styles.actionButtonText}>FAVORITES</Text>
            </Pressable>
            
            <Pressable style={styles.actionButton}>
              <FontAwesome name="gamepad" size={16} color="#8b5cf6" />
              <Text style={styles.actionButtonText}>QUICK PLAY</Text>
            </Pressable>
          </RNView>
          
          {/* Search Bar - Moved inside welcome box */}
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
                      size={12} 
                      color={favorites.has(game.id) ? "#fbbf24" : "#8b5cf6"} 
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
    width: '95%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 6,
    gap: 6,
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gameCardHeader: {
    position: 'absolute',
    top: 12, // More centered vertically
    right: 12, // More centered from right edge
    zIndex: 1,
  },
  favoriteButton: {
    padding: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    marginTop: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  categoriesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'space-between',
  },
  categoryButton: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    borderRadius: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 0,
  },
  selectedCategory: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  categoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 14,
  },
  selectedCategoryText: {
    color: '#000000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    overflow: 'hidden',
    marginBottom: 4,
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
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 0,
  },
});


