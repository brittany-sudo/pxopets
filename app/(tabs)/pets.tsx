import React from 'react';
import { Image, StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useGame } from '@/store/GameStore';
import PixelButton from '@/components/PixelButton';
import { Link } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PetsScreen() {
  const { state, increaseHappiness, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <BorderedBox>
        {/* Pet with full-width border */}
        <RNView style={styles.petImageContainer}>
          <Image
            source={require('@/assets/images/tigerguy.png')}
            style={styles.petImage}
          />
        </RNView>
        
        {/* Pet info and health bar side by side */}
        <RNView style={styles.petInfoSection}>
          <RNView style={styles.petBasicInfo}>
            <Text style={styles.petName}>{state.pet.name}</Text>
            <Text style={styles.petLevel}>Level {state.pet.level}</Text>
          </RNView>
          
          <RNView style={styles.healthSection}>
            <Text style={styles.healthLabel}>HEALTH</Text>
            <RNView style={styles.healthBar}>
              <RNView style={[styles.healthFill, { width: `${state.pet.happiness}%` }]} />
            </RNView>
            <Text style={styles.healthValue}>{state.pet.happiness}%</Text>
          </RNView>
        </RNView>

        {/* Action boxes underneath */}
        <RNView style={styles.actionBoxes}>
          <RNView style={styles.actionBox}>
            <FontAwesome name="cutlery" size={12} color="#0ea5e9" />
            <Text style={styles.actionLabel}>FEED</Text>
          </RNView>
          <RNView style={styles.actionBox}>
            <FontAwesome name="gamepad" size={12} color="#0ea5e9" />
            <Text style={styles.actionLabel}>PLAY</Text>
          </RNView>
          <RNView style={styles.actionBox}>
            <FontAwesome name="map" size={12} color="#0ea5e9" />
            <Text style={styles.actionLabel}>EXPLORE</Text>
          </RNView>
        </RNView>

        {/* Stats Title */}
        <Text style={styles.statsTitle}>STATS</Text>

          {/* All Stats with Bars */}
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
      </BorderedBox>

      <BorderedBox>
        <Text style={styles.collectionTitle}>SWITCH MAIN PET</Text>
        <RNView style={styles.petCollection}>
          {/* All Empty Pet Slots */}
          {[1, 2, 3, 4].map((index) => (
            <Link key={index} href="/adoption" asChild>
              <RNView style={styles.petSlot}>
                <RNView style={styles.emptyPetSlot}>
                  <Text style={styles.plusIcon}>+</Text>
                </RNView>
                <Text style={styles.emptySlotText}>Adopt Pet</Text>
              </RNView>
            </Link>
          ))}
        </RNView>
      </BorderedBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
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
      height: 200,
      borderRadius: 0,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      padding: 20,
    },
    petInfoSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
      gap: 250,
    },
    petBasicInfo: {
      flex: 1,
      alignItems: 'flex-start',
      marginTop: -8,
    },
    healthSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    actionBoxes: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 24,
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
    actionBox: {
      borderWidth: 1,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
      minWidth: 80,
    },
    actionLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 10,
      color: '#0ea5e9',
      textAlign: 'center',
    },
  petImage: {
    width: 96,
    height: 96,
    imageRendering: 'pixelated' as any,
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 8,
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 12,
  },
    healthLabel: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0f172a',
      textAlign: 'right',
      marginBottom: 4,
    },
    healthBar: {
      width: 120,
      height: 6,
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: '#0ea5e9',
      overflow: 'hidden',
    },
    healthFill: {
      height: '100%',
      backgroundColor: '#10b981',
      borderRadius: 2,
    },
    healthValue: {
      fontFamily: 'Silkscreen_400Regular',
      fontSize: 8,
      color: '#0f172a',
      textAlign: 'right',
      marginTop: 2,
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
    color: '#0f172a',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  petCollection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  petSlot: {
    width: 60,
    alignItems: 'center',
  },
  emptyPetSlot: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  plusIcon: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 24,
    color: 'rgba(14, 165, 233, 0.6)',
    fontWeight: 'bold',
  },
  emptySlotText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: 'rgba(14, 165, 233, 0.6)',
    textAlign: 'center',
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
});


