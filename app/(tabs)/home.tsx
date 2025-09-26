import React from 'react';
import { StyleSheet, View as RNView, ScrollView, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import { useGame } from '@/store/GameStore';
import JazzyTitle from '@/components/JazzyTitle';
import { SHADOWS } from '@/constants/Styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PlayerHomeScreen() {
  const { state, hydrated } = useGame();
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox style={styles.leftAlignedBox}>
          <Text style={styles.sectionTitle}>ACTIVE PET</Text>
          <RNView style={styles.petSectionContainer}>
            {/* Pet with Border */}
            <RNView style={styles.petWithBorder}>
              <RNView style={styles.pokemonStyleContainer}>
                {/* Pet Sprite */}
                <RNView style={styles.spriteContainer}>
                  <Image
                    source={require('@/assets/images/tigerguy.png')}
                    style={styles.pokemonSprite}
                  />
                </RNView>
                
                {/* Compact Stats */}
                <RNView style={styles.compactStats}>
                  <Text style={styles.pokemonName}>{state.pet.name}</Text>
                  <Text style={styles.pokemonLevel}>Lv.{state.pet.level}</Text>
                  
                  {/* Lightning Bolt Currency */}
                  <RNView style={styles.staminaContainer}>
                    <FontAwesome name="bolt" size={12} color="#f59e0b" />
                    <Text style={styles.staminaText}>{state.coins} ⚡</Text>
                  </RNView>
                  
                  {/* Mini Stats */}
                  <RNView style={styles.miniStats}>
                    <Text style={styles.miniStat}>ATK {state.pet.level * 10}</Text>
                    <Text style={styles.miniStat}>DEF {state.pet.level * 8}</Text>
                    <Text style={styles.miniStat}>SPD {state.pet.level * 12}</Text>
                    <Text style={styles.miniStat}>HP {state.pet.level * 15}</Text>
                  </RNView>
                </RNView>
              </RNView>
            </RNView>
            
            {/* Action Buttons */}
            <RNView style={styles.actionButtons}>
              <RNView style={styles.actionButton}>
                <Text style={styles.actionButtonText}>VIEW STATS</Text>
              </RNView>
              <RNView style={styles.actionButton}>
                <Text style={styles.actionButtonText}>SWAP PET</Text>
              </RNView>
              <RNView style={styles.actionButton}>
                <Text style={styles.actionButtonText}>EXPLORE</Text>
              </RNView>
            </RNView>
          </RNView>
        </BorderedBox>

        <RNView style={styles.sideBySideContainer}>
          <BorderedBox style={styles.halfWidthBox}>
            <Text style={styles.sectionTitle}>INFO</Text>
            <Text style={styles.meta}>Username: PxopetMaster</Text>
            <Text style={styles.meta}>Guild: Pixel Pioneers</Text>
            <Text style={styles.meta}>Level: {state.pet.level}</Text>
            <Text style={styles.meta}>Unlocked: {state.unlockedLevels}</Text>
          </BorderedBox>

          <BorderedBox style={styles.halfWidthBox}>
            <Text style={styles.sectionTitle}>FAVORITES</Text>
            <RNView style={styles.favoritesContainer}>
              <RNView style={styles.favoriteItem}>
                <FontAwesome name="star" size={16} color="#f59e0b" />
                <Text style={styles.favoriteText}>Atomic Surf</Text>
              </RNView>
              <RNView style={styles.favoriteItem}>
                <FontAwesome name="star" size={16} color="#f59e0b" />
                <Text style={styles.favoriteText}>Daily Riddle</Text>
              </RNView>
              <RNView style={styles.favoriteItem}>
                <FontAwesome name="star" size={16} color="#f59e0b" />
                <Text style={styles.favoriteText}>Pearl Diver</Text>
              </RNView>
              <RNView style={styles.emptyFavorite}>
                <FontAwesome name="star-o" size={16} color="#64748b" />
                <Text style={styles.emptyFavoriteText}>No more favorites yet</Text>
              </RNView>
            </RNView>
          </BorderedBox>
        </RNView>

        <BorderedBox style={styles.leftAlignedBox}>
          <Text style={styles.sectionTitle}>INVENTORY</Text>
          <RNView style={styles.inventoryGrid}>
            <View style={styles.inventorySlot}>
              <Image 
                source={require('@/assets/images/moonpetal-tea.png')} 
                style={styles.inventoryImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.inventorySlot}>
              <Image 
                source={require('@/assets/images/milkshakes.png')} 
                style={styles.inventoryImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.inventorySlot}>
              <Image 
                source={require('@/assets/images/glowcorn.png')} 
                style={styles.inventoryImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
          </RNView>
        </BorderedBox>
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'left',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'left',
  },
  frame: {
    width: '100%',
    height: 160,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    marginBottom: 12,
  },
  placeholderText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    opacity: 0.6,
  },
  meta: { 
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    marginBottom: 4,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  inventorySlot: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
  },
  slotText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    opacity: 0.4,
  },
  inventoryImage: {
    width: 50,
    height: 50,
  },
  // Pokemon-style compact layout
  pokemonStyleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  spriteContainer: {
    marginRight: 12,
  },
  pokemonSprite: {
    width: 64,
    height: 64,
    imageRendering: 'pixelated' as any,
  },
  compactStats: {
    flex: 1,
  },
  pokemonName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  pokemonLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    opacity: 0.7,
    marginBottom: 4,
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  miniStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  miniStat: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0f172a',
    opacity: 0.8,
  },
  leftAlignedBox: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  sideBySideContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '85%',
    marginBottom: 16,
    alignSelf: 'center',
  },
  halfWidthBox: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  petSectionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  petWithBorder: {
    borderWidth: 1,
    borderColor: '#0ea5e9',
    padding: 8,
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 6,
    alignItems: 'flex-start',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#0ea5e9',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    width: 100,
    boxShadow: SHADOWS.halftone.boxShadow,
    elevation: 4,
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0ea5e9',
    textAlign: 'center',
  },
  favoritesContainer: {
    width: '100%',
    gap: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  favoriteText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
  },
  emptyFavorite: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    opacity: 0.5,
  },
  emptyFavoriteText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
  },
});


