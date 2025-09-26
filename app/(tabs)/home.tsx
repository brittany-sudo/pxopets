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
                  
                  {/* Mini Health Bar */}
                  <RNView style={styles.miniHealthBar}>
                    <RNView style={[styles.miniHealthFill, { width: `${state.pet.happiness}%` }]} />
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
            </RNView>
          </RNView>
        </BorderedBox>

        <BorderedBox style={styles.leftAlignedBox}>
          <Text style={styles.sectionTitle}>STATS</Text>
          <Text style={styles.meta}>Coins: {state.coins}</Text>
          <Text style={styles.meta}>Unlocked levels: {state.unlockedLevels}</Text>
        </BorderedBox>

        <BorderedBox style={styles.leftAlignedBox}>
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

        <BorderedBox style={styles.leftAlignedBox}>
          <Text style={styles.sectionTitle}>INVENTORY</Text>
          <RNView style={styles.inventoryGrid}>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
            <View style={styles.inventorySlot}><Text style={styles.slotText}>—</Text></View>
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
    fontSize: 12,
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
  miniHealthBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    overflow: 'hidden',
    marginBottom: 4,
  },
  miniHealthFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
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
    gap: 8,
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


