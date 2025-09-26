import React, { useState } from 'react';
import { Image, StyleSheet, View as RNView, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import { Link } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PetsScreen() {
  const { state, increaseHappiness, hydrated } = useGame();
  const [activePet, setActivePet] = useState('juno'); // Default to Juno
  
  const pets = {
    juno: {
      name: 'JUNO',
      image: require('@/assets/images/tigerguy.png'),
      level: 1,
      hp: 100,
      atk: 50
    },
    frekki: {
      name: 'FREKKI',
      image: require('@/assets/images/coco-guy.png'),
      level: 3,
      hp: 85,
      atk: 42
    },
    noxia: {
      name: 'NOXIA',
      image: require('@/assets/images/purple-guy.png'),
      level: 5,
      hp: 92,
      atk: 38
    },
    technor: {
      name: 'TECHNOR',
      image: require('@/assets/images/robot-guy.png'),
      level: 2,
      hp: 78,
      atk: 45
    }
  };

  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.collectionTitle, { marginTop: 8 }]}>ACTIVE PET</Text>
        <BorderedBox>
        {/* Pet with full-width border */}
        <RNView style={styles.petImageContainer}>
          <Image
            source={require('@/assets/images/bg1.png')}
            style={styles.petBackgroundImage}
            resizeMode="cover"
          />
          <Image
            source={pets[activePet].image}
            style={styles.petImage}
          />
          
          {/* Pet info on left side of image */}
          <RNView style={styles.petInfoOverlay}>
            <Text style={styles.petName}>{pets[activePet].name}</Text>
            <Text style={styles.petLevel}>Level {pets[activePet].level}</Text>
          </RNView>
          
          {/* Stamina on right side of image */}
          <RNView style={styles.staminaOverlay}>
            <Text style={styles.staminaLabel}>STAMINA</Text>
            <RNView style={styles.staminaContainer}>
              <FontAwesome name="bolt" size={12} color="#f59e0b" />
              <Text style={styles.staminaText}>{state.coins}</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Action boxes underneath */}
        <RNView style={styles.actionBoxes}>
          <RNView style={styles.actionBox}>
            <FontAwesome name="cutlery" size={20} color="#8b5cf6" />
            <Text style={styles.actionLabel}>FEED</Text>
          </RNView>
          <RNView style={styles.actionBox}>
            <FontAwesome name="futbol-o" size={20} color="#8b5cf6" />
            <Text style={styles.actionLabel}>PLAY</Text>
          </RNView>
          <RNView style={styles.actionBox}>
            <FontAwesome name="map" size={20} color="#8b5cf6" />
            <Text style={styles.actionLabel}>EXPLORE</Text>
          </RNView>
        </RNView>

        {/* Stats and Closet Side by Side */}
        <RNView style={styles.statsClosetContainer}>
          {/* Stats Section - Left Half */}
          <RNView style={styles.statsSection}>
            <Text style={styles.statsTitle}>STATS</Text>
            <RNView style={styles.barStatsContainer}>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>ATK</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 10) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 10) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>DEF</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 8) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 8) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>SPD</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 12) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 12) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>HP</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 15) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 15) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>LUCK</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 7) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 7) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>INT</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 9) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 9) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>CHARM</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 6) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 6) % 100)}</Text>
              </RNView>
              <RNView style={styles.barStatRow}>
                <Text style={styles.barStatLabel}>DEX</Text>
                <RNView style={styles.barStatBar}>
                  <RNView style={[styles.barStatFill, { width: `${Math.min(100, (state.pet.level * 11) % 100)}%` }]} />
                </RNView>
                <Text style={styles.barStatValue}>{Math.min(100, (state.pet.level * 11) % 100)}</Text>
              </RNView>
            </RNView>
          </RNView>

          {/* Closet Section - Right Half */}
          <RNView style={styles.closetSection}>
            <Text style={styles.closetTitle}>CLOSET</Text>
            <RNView style={styles.closetContainer}>
              <RNView style={styles.closetItem}>
                <FontAwesome name="star" size={20} color="#f59e0b" />
              </RNView>
              <RNView style={styles.closetItem}>
                <FontAwesome name="leaf" size={20} color="#10b981" />
              </RNView>
              <RNView style={styles.closetItem}>
                <FontAwesome name="gem" size={20} color="#8b5cf6" />
              </RNView>
              <RNView style={styles.closetItem}>
                <FontAwesome name="heart" size={20} color="#ec4899" />
              </RNView>
              <RNView style={styles.closetItem}>
                <FontAwesome name="diamond" size={20} color="#06b6d4" />
              </RNView>
              <RNView style={styles.closetItem}>
                <FontAwesome name="trophy" size={20} color="#fbbf24" />
              </RNView>
            </RNView>
          </RNView>
        </RNView>
      </BorderedBox>

      <Text style={[styles.collectionTitle, { marginTop: 16 }]}>ALL PETS</Text>
      <BorderedBox>
        <RNView style={styles.petCollection}>
          {/* Pet 1 - FREKKI */}
          <Pressable 
            style={[styles.petSlot, activePet === 'frekki' && styles.activePetSlot]}
            onPress={() => setActivePet('frekki')}
          >
            <RNView style={styles.petSlotHeader}>
              <Image source={require('@/assets/images/coco-guy.png')} style={styles.petSlotImage} />
              <Text style={styles.petSlotName}>FREKKI</Text>
            </RNView>
            <RNView style={styles.petSlotStats}>
              <Text style={styles.petSlotStat}>Lvl 3</Text>
              <Text style={styles.petSlotStat}>HP: 85</Text>
              <Text style={styles.petSlotStat}>ATK: 42</Text>
            </RNView>
          </Pressable>
          
          {/* Pet 2 - NOXIA */}
          <Pressable 
            style={[styles.petSlot, activePet === 'noxia' && styles.activePetSlot]}
            onPress={() => setActivePet('noxia')}
          >
            <RNView style={styles.petSlotHeader}>
              <Image source={require('@/assets/images/purple-guy.png')} style={styles.petSlotImage} />
              <Text style={styles.petSlotName}>NOXIA</Text>
            </RNView>
            <RNView style={styles.petSlotStats}>
              <Text style={styles.petSlotStat}>Lvl 5</Text>
              <Text style={styles.petSlotStat}>HP: 92</Text>
              <Text style={styles.petSlotStat}>ATK: 38</Text>
            </RNView>
          </Pressable>
          
          {/* Pet 3 - TECHNOR */}
          <Pressable 
            style={[styles.petSlot, activePet === 'technor' && styles.activePetSlot]}
            onPress={() => setActivePet('technor')}
          >
            <RNView style={styles.petSlotHeader}>
              <Image source={require('@/assets/images/robot-guy.png')} style={styles.petSlotImage} />
              <Text style={styles.petSlotName}>TECHNOR</Text>
            </RNView>
            <RNView style={styles.petSlotStats}>
              <Text style={styles.petSlotStat}>Lvl 2</Text>
              <Text style={styles.petSlotStat}>HP: 78</Text>
              <Text style={styles.petSlotStat}>ATK: 45</Text>
            </RNView>
          </Pressable>
        </RNView>
      </BorderedBox>

      <RNView style={styles.adoptButtons}>
        <Link href="/(tabs)/adoption/pound" asChild>
          <RNView style={styles.adoptButton}>
            <FontAwesome name="heart" size={24} color="#8b5cf6" />
            <Text style={styles.adoptButtonText}>ADOPT</Text>
            <Text style={styles.adoptButtonSubtext}>From The Pound</Text>
          </RNView>
        </Link>
        <Link href="/(tabs)/adoption/create" asChild>
          <RNView style={styles.adoptButton}>
            <FontAwesome name="plus-circle" size={24} color="#8b5cf6" />
            <Text style={styles.adoptButtonText}>CREATE</Text>
            <Text style={styles.adoptButtonSubtext}>New Pet</Text>
          </RNView>
        </Link>
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // Premium deep slate
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'left',
  },
    petImageContainer: {
      width: '100%',
      height: 240,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    },
    petBackgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    petInfoOverlay: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    staminaOverlay: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      alignItems: 'center',
    },
    actionBoxes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 24,
      width: '100%',
    },
    statsClosetContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    statsSection: {
      flex: 1,
    },
    closetSection: {
      flex: 1,
    },
    statsTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#0f172a',
      textAlign: 'left',
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    closetTitle: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 10,
      fontWeight: 'bold',
      color: '#0f172a',
      textAlign: 'left',
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    closetContainer: {
      borderWidth: 2,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.05)',
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      minHeight: 120,
    },
    closetItem: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      minWidth: '30%',
      minHeight: 40,
    },
    actionBox: {
      borderWidth: 1,
      borderColor: '#10b981',
      backgroundColor: '#ffffff',
      paddingHorizontal: 24,
      paddingVertical: 20,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 8,
      flex: 1,
      height: 80,
      boxShadow: '3px 3px 0px #10b981',
      elevation: 4,
    },
    actionLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 12,
      color: '#8b5cf6',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  petImage: {
    width: 110,
    height: 110,
    imageRendering: 'pixelated' as any,
    marginTop: 80, // Moved down a bit more
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'left',
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'left',
    opacity: 0.8,
  },
    staminaLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#ffffff',
      textAlign: 'right',
      marginBottom: 4,
    },
    staminaContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    staminaText: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#f59e0b',
      fontWeight: 'bold',
    },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    opacity: 0.7,
    marginTop: 2,
  },
  equipmentContainer: {
    width: '100%',
  },
  equipmentTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  equipmentSlots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  equipmentSlot: {
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    padding: 8,
    minWidth: 60,
  },
  equipmentIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  equipmentLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  equipmentItem: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#0f172a',
    opacity: 0.6,
    textAlign: 'center',
  },
  collectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0ea5e9',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 8,
  },
  petCollection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  petSlot: {
    width: '30%',
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    padding: 8,
    marginBottom: 8,
  },
  petSlotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  petSlotImage: {
    width: 24,
    height: 24,
    marginRight: 8,
    imageRendering: 'pixelated' as any,
  },
  petSlotName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    flex: 1,
  },
  petSlotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  petSlotStat: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    marginBottom: 2,
  },
  activePetSlot: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  barStatsContainer: {
    width: '100%',
    marginBottom: 16,
  },
    barStatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
      paddingHorizontal: 10,
    },
    barStatLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0f172a',
      fontWeight: 'bold',
      width: 40,
    },
    barStatBar: {
      flex: 1,
      height: 4,
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderRadius: 2,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      overflow: 'hidden',
      marginLeft: 8,
      marginRight: 8,
    },
    barStatFill: {
      height: '100%',
      backgroundColor: '#8b5cf6',
      borderRadius: 1,
    },
    barStatValue: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0f172a',
      fontWeight: 'bold',
      width: 30,
      textAlign: 'right',
    },
  adoptButtons: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 40,
    width: '100%',
  },
  adoptButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 28,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
    adoptButtonText: {
      fontFamily: 'PressStart2P_400Regular',
      fontSize: 14,
      fontWeight: 'bold',
      color: '#8b5cf6',
      marginTop: 8,
      marginBottom: 4,
    },
    adoptButtonSubtext: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0f172a',
      textAlign: 'center',
      opacity: 0.8,
    },
});


