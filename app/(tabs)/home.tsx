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
        {/* PLAYER STATS Section - Neopets Style */}
        <BorderedBox style={styles.fullWidthBox}>
          <RNView style={styles.statsContainer}>
            {/* Basic Info Row */}
            <RNView style={styles.basicInfoRow}>
              <RNView style={styles.playerInfo}>
                <Text style={styles.playerName}>PxopetMaster</Text>
                <Text style={styles.playerTitle}>Pixel Pioneer</Text>
              </RNView>
              <RNView style={styles.bankBalance}>
                <FontAwesome name="bank" size={16} color="#10b981" />
                <Text style={styles.balanceAmount}>Lvl {state.pet.level}</Text>
              </RNView>
            </RNView>

            {/* About Me Section */}
            <RNView style={styles.aboutMeSection}>
              <RNView style={styles.avatarContainer}>
                <Image
                  source={require('@/assets/images/lil-guy.png')}
                  style={styles.userAvatar}
                  resizeMode="contain"
                />
                <RNView style={styles.avatarBadge}>
                  <FontAwesome name="star" size={12} color="#fbbf24" />
                </RNView>
              </RNView>
              <RNView style={styles.aboutMeContent}>
                <Text style={styles.aboutMeTitle}>ABOUT ME</Text>
                <Text style={styles.aboutMeText}>
                  "I love exploring Pxopia and collecting rare items! 
                  My favorite game is Atomic Surf and I'm always 
                  looking for new adventures. Join me on my journey!"
                </Text>
                <RNView style={styles.statusContainer}>
                  <RNView style={styles.statusItem}>
                    <FontAwesome name="circle" size={8} color="#10b981" />
                    <Text style={styles.statusText}>Online</Text>
                  </RNView>
                  <RNView style={styles.statusItem}>
                    <FontAwesome name="calendar" size={10} color="#64748b" />
                    <Text style={styles.statusText}>Member since 2024</Text>
                  </RNView>
                </RNView>
              </RNView>
            </RNView>

            {/* Bank and Shopfront Side by Side */}
            <RNView style={styles.bankShopContainer}>
              {/* Bank Section */}
              <RNView style={styles.bankSection}>
                <Text style={styles.bankTitle}>BANK ACCOUNT</Text>
                <RNView style={styles.bankInfo}>
                  <RNView style={styles.bankRow}>
                    <FontAwesome name="coins" size={14} color="#f59e0b" />
                    <Text style={styles.bankAmount}>{state.coins.toLocaleString()} ⚡</Text>
                  </RNView>
                  <RNView style={styles.bankRow}>
                    <FontAwesome name="percent" size={12} color="#10b981" />
                    <Text style={styles.interestRate}>2.5% daily</Text>
                  </RNView>
                  <RNView style={styles.bankRow}>
                    <FontAwesome name="clock-o" size={12} color="#64748b" />
                    <Text style={styles.nextInterest}>4h 23m</Text>
                  </RNView>
                </RNView>
                <RNView style={styles.collectButton}>
                  <Text style={styles.collectButtonText}>COLLECT</Text>
                </RNView>
              </RNView>

              {/* Shopfront Section */}
              <RNView style={styles.shopfrontSection}>
                <Text style={styles.shopfrontTitle}>SHOPFRONT</Text>
                <RNView style={styles.shopfrontInfo}>
                  <RNView style={styles.shopfrontRow}>
                    <FontAwesome name="store" size={14} color="#8b5cf6" />
                    <Text style={styles.shopfrontText}>Pixel Emporium</Text>
                  </RNView>
                  <RNView style={styles.shopfrontRow}>
                    <FontAwesome name="star" size={12} color="#fbbf24" />
                    <Text style={styles.shopfrontText}>Rating: 4.8/5</Text>
                  </RNView>
                  <RNView style={styles.shopfrontRow}>
                    <FontAwesome name="users" size={12} color="#10b981" />
                    <Text style={styles.shopfrontText}>1,234 customers</Text>
                  </RNView>
                </RNView>
                <RNView style={styles.manageButton}>
                  <Text style={styles.manageButtonText}>MANAGE</Text>
                </RNView>
              </RNView>
            </RNView>

            {/* Trophies Section */}
            <RNView style={styles.trophiesBox}>
              <Text style={styles.trophiesTitle}>TROPHIES</Text>
              <RNView style={styles.trophiesContainer}>
                <FontAwesome name="trophy" size={24} color="#fbbf24" />
                <FontAwesome name="trophy" size={24} color="#f59e0b" />
                <FontAwesome name="trophy" size={24} color="#8b5cf6" />
                <FontAwesome name="trophy" size={24} color="#10b981" />
              </RNView>
            </RNView>
          </RNView>
        </BorderedBox>

        {/* ACTIVE PET Section */}
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

        {/* FAVORITES Section - Full Width */}
        <BorderedBox style={styles.fullWidthBox}>
          <Text style={styles.sectionTitle}>FAVORITES</Text>
          <RNView style={styles.favoritesContainer}>
            <RNView style={styles.favoriteItem}>
              <FontAwesome name="star" size={18} color="#f59e0b" />
              <Text style={styles.favoriteText}>Atomic Surf</Text>
              <Text style={styles.favoriteSubtext}>High Score: 12,450</Text>
            </RNView>
            <RNView style={styles.favoriteItem}>
              <FontAwesome name="star" size={18} color="#f59e0b" />
              <Text style={styles.favoriteText}>Daily Riddle</Text>
              <Text style={styles.favoriteSubtext}>Streak: 7 days</Text>
            </RNView>
            <RNView style={styles.favoriteItem}>
              <FontAwesome name="star" size={18} color="#f59e0b" />
              <Text style={styles.favoriteText}>Pearl Diver</Text>
              <Text style={styles.favoriteSubtext}>Best Time: 2:34</Text>
            </RNView>
            <RNView style={styles.favoriteItem}>
              <FontAwesome name="star" size={18} color="#f59e0b" />
              <Text style={styles.favoriteText}>Lost 'n Found</Text>
              <Text style={styles.favoriteSubtext}>Items Found: 23</Text>
            </RNView>
            <RNView style={styles.emptyFavorite}>
              <FontAwesome name="star-o" size={18} color="#64748b" />
              <Text style={styles.emptyFavoriteText}>Add more favorites</Text>
            </RNView>
          </RNView>
        </BorderedBox>

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
    width: '90%',
    marginBottom: 16,
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  fullWidthBox: {
    width: '90%',
    marginBottom: 16,
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  statsContainer: {
    width: '100%',
    gap: 16,
  },
  basicInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0ea5e9',
  },
  playerInfo: {
    alignItems: 'flex-start',
  },
  playerName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  playerTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  bankBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  balanceAmount: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#10b981',
    fontWeight: 'bold',
  },
  aboutMeSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  avatarBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  aboutMeContent: {
    flex: 1,
    gap: 6,
  },
  aboutMeTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  aboutMeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 14,
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
  },
  trophiesBox: {
    marginTop: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fbbf24',
    alignItems: 'center',
  },
  trophiesTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  trophiesContainer: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankShopContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  bankSection: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    minHeight: 160,
  },
  shopfrontSection: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    minHeight: 160,
  },
  bankTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  bankInfo: {
    gap: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 1,
    justifyContent: 'center',
  },
  bankAmount: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  interestRate: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
  },
  nextInterest: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  collectButton: {
    borderWidth: 1,
    borderColor: '#0ea5e9',
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    width: 70,
    boxShadow: SHADOWS.halftone.boxShadow,
    elevation: 4,
    alignSelf: 'center',
  },
  collectButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#0ea5e9',
    textAlign: 'center',
  },
  shopfrontTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  shopfrontInfo: {
    gap: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  shopfrontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 1,
    justifyContent: 'center',
  },
  shopfrontText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  manageButton: {
    borderWidth: 1,
    borderColor: '#8b5cf6',
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    width: 70,
    boxShadow: SHADOWS.halftone.boxShadow,
    elevation: 4,
    alignSelf: 'center',
  },
  manageButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#8b5cf6',
    textAlign: 'center',
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
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 6,
    marginBottom: 6,
  },
  favoriteText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteSubtext: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
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


