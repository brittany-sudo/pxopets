import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Modal, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// No header image for cosmic drive-in

export default function CosmicDriveInScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [playerStamina, setPlayerStamina] = useState(100);

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

  const driveInServices = [
    {
      id: 'movie-screen',
      name: 'Cosmic Movie Screen',
      description: 'Watch alien movies under the desert stars.',
      icon: 'film',
      staminaCost: 5
    },
    {
      id: 'snack-bar',
      name: 'Intergalactic Snack Bar',
      description: 'Get cosmic treats and space sodas.',
      icon: 'cutlery',
      staminaCost: 3
    },
    {
      id: 'parking-spot',
      name: 'Hovercar Parking',
      description: 'Park your hovercar and enjoy the show.',
      icon: 'car',
      staminaCost: 0
    },
    {
      id: 'speaker-system',
      name: 'Retro Speaker System',
      description: 'Hang the old-school speaker on your window.',
      icon: 'volume-up',
      staminaCost: 2
    }
  ];

  const cosmicMovies = [
    {
      id: 1,
      title: "Invasion of the Space Slugs",
      year: "1957",
      genre: "Sci-Fi Horror",
      description: "Giant space slugs terrorize a small desert town. Will the local sheriff save the day?",
      duration: "87 minutes",
      rating: "⭐ 7.2/10"
    },
    {
      id: 2,
      title: "The Cosmic Cowboy",
      year: "1962",
      genre: "Space Western",
      description: "A lone space ranger rides his hoverhorse across the galaxy to bring justice to the frontier.",
      duration: "94 minutes",
      rating: "⭐ 8.1/10"
    },
    {
      id: 3,
      title: "Attack of the 50-Foot Alien",
      year: "1958",
      genre: "Sci-Fi Comedy",
      description: "A friendly alien grows to enormous size and tries to help humans, but chaos ensues.",
      duration: "76 minutes",
      rating: "⭐ 6.8/10"
    },
    {
      id: 4,
      title: "The Phantom Planet",
      year: "1961",
      genre: "Space Adventure",
      description: "Astronauts discover a mysterious planet where time moves differently.",
      duration: "82 minutes",
      rating: "⭐ 7.5/10"
    }
  ];

  const handleServicePress = (service: any) => {
    if (service.staminaCost > 0 && playerStamina < service.staminaCost) {
      Alert.alert("Not Enough Stamina", `You need ${service.staminaCost} stamina to use this service!`);
      return;
    }

    if (service.id === 'movie-screen') {
      setShowMovieModal(true);
    } else if (service.id === 'snack-bar') {
      Alert.alert("Snack Bar", "You grab some cosmic popcorn and a space soda! +5 Energy");
      setPlayerStamina(prev => Math.min(100, prev + 5));
    } else if (service.id === 'parking-spot') {
      Alert.alert("Parking", "You park your hovercar in the perfect spot with a great view of the screen!");
    } else if (service.id === 'speaker-system') {
      Alert.alert("Speaker System", "You hang the retro speaker on your window. The sound quality is surprisingly good!");
    }

    if (service.staminaCost > 0) {
      setPlayerStamina(prev => prev - service.staminaCost);
    }
  };

  const watchMovie = (movie: any) => {
    if (playerStamina < 5) {
      Alert.alert("Not Enough Stamina", "You need 5 stamina to watch a movie!");
      return;
    }

    setPlayerStamina(prev => prev - 5);
    setShowMovieModal(false);
    Alert.alert(
      "Movie Experience", 
      `You watch "${movie.title}" under the stars!\n\n${movie.description}\n\nDuration: ${movie.duration}\nRating: ${movie.rating}\n\n+10 Energy from the relaxing experience!`
    );
    setPlayerStamina(prev => Math.min(100, prev + 10));
  };

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
          <Text style={styles.locationTitle}>COSMIC DRIVE-IN</Text>
        </RNView>


        {/* Services Title */}
        <Text style={styles.servicesTitle}>DRIVE-IN SERVICES</Text>

        {/* Services List */}
        {driveInServices.map((service) => (
          <Pressable 
            key={service.id} 
            style={styles.serviceItem}
            onPress={() => handleServicePress(service)}
          >
            <RNView style={styles.serviceHeader}>
              <RNView style={styles.serviceInfo}>
                <RNView style={styles.serviceIconContainer}>
                  <FontAwesome name={service.icon as any} size={20} color="#ec4899" />
                </RNView>
                <RNView style={styles.serviceText}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  {service.staminaCost > 0 && (
                    <Text style={styles.staminaCost}>Cost: {service.staminaCost} stamina</Text>
                  )}
                </RNView>
              </RNView>
              <RNView style={styles.serviceFooter}>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(service.id)}
                >
                  <FontAwesome 
                    name={favorites.has(service.id) ? "star" : "star-o"} 
                    size={16} 
                    color={favorites.has(service.id) ? "#ec4899" : "rgba(236, 72, 153, 0.3)"} 
                  />
                </Pressable>
              </RNView>
            </RNView>
          </Pressable>
        ))}

        {/* Player Stats */}
        <RNView style={styles.statsContainer}>
          <Text style={styles.statsTitle}>PLAYER STATS</Text>
          <RNView style={styles.statRow}>
            <Text style={styles.statLabel}>Stamina:</Text>
            <Text style={styles.statValue}>{playerStamina}/100</Text>
          </RNView>
        </RNView>
      </ScrollView>

      {/* Movie Selection Modal */}
      <Modal
        visible={showMovieModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMovieModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>COSMIC MOVIE SELECTION</Text>
            <Text style={styles.modalSubtitle}>Choose a movie to watch under the stars</Text>
            
            <ScrollView style={styles.movieList}>
              {cosmicMovies.map((movie) => (
                <Pressable
                  key={movie.id}
                  style={styles.movieItem}
                  onPress={() => watchMovie(movie)}
                >
                  <RNView style={styles.movieInfo}>
                    <Text style={styles.movieTitle}>{movie.title}</Text>
                    <Text style={styles.movieYear}>{movie.year} • {movie.genre}</Text>
                    <Text style={styles.movieDescription}>{movie.description}</Text>
                    <RNView style={styles.movieDetails}>
                      <Text style={styles.movieDuration}>{movie.duration}</Text>
                      <Text style={styles.movieRating}>{movie.rating}</Text>
                    </RNView>
                  </RNView>
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setShowMovieModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
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
    marginLeft: 16,
  },
  servicesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    marginTop: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
    textTransform: 'uppercase',
  },
  serviceItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    minHeight: 65,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 35, // Space for favorite button
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  serviceText: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  serviceName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#0f172a',
    marginBottom: 2,
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  serviceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 13,
    textAlign: 'left',
  },
  staminaCost: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    marginTop: 2,
    fontWeight: 'bold',
  },
  serviceFooter: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 20,
    justifyContent: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  statsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fef7f7',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  movieList: {
    maxHeight: 400,
  },
  movieItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    marginBottom: 8,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  movieYear: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  movieDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
    marginBottom: 6,
  },
  movieDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieDuration: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#ec4899',
    fontWeight: 'bold',
  },
  movieRating: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ec4899',
    fontWeight: 'bold',
  },
});
