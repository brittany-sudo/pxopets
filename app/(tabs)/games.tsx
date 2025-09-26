import { StyleSheet, ScrollView, View as RNView, Pressable, Image, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import JazzyTitle from '@/components/JazzyTitle';

// Import game images
const tikiGameImage = require('@/assets/images/tiki-game.png');
const fortunaGameImage = require('@/assets/images/fortuna-game.png');
const lostFoundImage = require('@/assets/images/lost-found.png');
const atomicSurfImage = require('@/assets/images/atomic-surf.png');

export default function GamesScreen() {
  const { addCoins, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  const games = [
    {
      id: 'lost-found',
      name: 'Lost \'n Found',
      icon: 'search',
      color: '#0ea5e9',
      world: 'Crystal Cove',
      description: 'Search for lost treasures and hidden items!',
      image: lostFoundImage
    },
    {
      id: 'atomic-surf',
      name: 'Atomic Surf',
      icon: 'diamond',
      color: '#f59e0b',
      world: 'Desert Oasis Resort',
      description: 'Ride the atomic waves in this retro surfing adventure!',
      image: atomicSurfImage
    },
    {
      id: 'plant-growing',
      name: 'Garden Magic',
      icon: 'leaf',
      color: '#10b981',
      world: 'Emerald Gardens',
      description: 'Grow magical plants and herbs!'
    },
    {
      id: 'grape-stomping',
      name: 'Grape Stomp',
      icon: 'glass',
      color: '#8b5cf6',
      world: 'Vintage Hollow',
      description: 'Stomp grapes to make wine!'
    },
    {
      id: 'bike-riding',
      name: 'Suburban Ride',
      icon: 'bicycle',
      color: '#64748b',
      world: 'The Pxoburbs',
      description: 'Ride your bike around town!'
    },
    {
      id: 'gem-mining',
      name: 'Ye Olde Wheele',
      icon: 'diamond',
      color: '#6b7280',
      world: 'Mystic Mountains',
      description: 'Mine precious gems and crystals!',
      image: fortunaGameImage
    },
    {
      id: 'treasure-hunt',
      name: 'Treasure Hunt',
      icon: 'map',
      color: '#dc2626',
      world: 'Pirate\'s Port',
      description: 'Find buried treasure on the high seas!'
    },
    {
      id: 'pottery-wheel',
      name: 'Pottery Master',
      icon: 'circle-o',
      color: '#ec4899',
      world: 'Artisan\'s Quarter',
      description: 'Shape clay on the spinning wheel!'
    },
    {
      id: 'spell-casting',
      name: 'Magic Spells',
      icon: 'magic',
      color: '#7c3aed',
      world: 'Scholar\'s Library',
      description: 'Cast spells by drawing runes!'
    },
    {
      id: 'hula-dancing',
      name: 'Pearl Diver',
      icon: 'music',
      color: '#f97316',
      world: 'Tiki Island',
      description: 'Learn ancient hula dances!',
      image: tikiGameImage
    },
    {
      id: 'wine-tasting',
      name: 'Wine Master',
      icon: 'glass',
      color: '#8b5cf6',
      world: 'Vintage Hollow',
      description: 'Taste and identify rare wines!'
    },
    {
      id: 'street-hockey',
      name: 'Street Hockey',
      icon: 'futbol-o',
      color: '#64748b',
      world: 'The Pxoburbs',
      description: 'Play hockey in the neighborhood!'
    },
    {
      id: 'cave-exploration',
      name: 'Cave Explorer',
      icon: 'flashlight',
      color: '#6b7280',
      world: 'Mystic Mountains',
      description: 'Explore dark caves with your torch!'
    },
    {
      id: 'ship-battles',
      name: 'Pirate Battles',
      icon: 'ship',
      color: '#dc2626',
      world: 'Pirate\'s Port',
      description: 'Battle enemy ships on the seas!'
    },
    {
      id: 'potion-brewing',
      name: 'Potion Brewing',
      icon: 'flask',
      color: '#10b981',
      world: 'Emerald Gardens',
      description: 'Brew magical potions and elixirs!'
    },
    {
      id: 'lei-making',
      name: 'Lei Crafting',
      icon: 'heart',
      color: '#f97316',
      world: 'Tiki Island',
      description: 'String beautiful flower leis!'
    }
  ];

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
        <JazzyTitle style={styles.title}>ARCADE</JazzyTitle>
        
        <RNView style={styles.gamesGrid}>
            {games.map((game, index) => (
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
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'left',
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


