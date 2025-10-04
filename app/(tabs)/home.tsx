import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View as RNView, ScrollView, Image, Pressable, TextInput, Animated, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { useInventory } from '@/store/InventoryStore';
import { usePets } from '@/store/PetStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useFocusEffect } from 'expo-router';

export default function PlayerHomeScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { state, hydrated, addStamina, claimStreakReward, setHometown, setAvatar, setPlayerTag } = useSimpleGame();
  const { state: inventoryState, addItem, clearAllItems } = useInventory();
  const { state: petState, getActivePet, resetAllPets } = usePets();
  
  const activePet = getActivePet();
  
  const getPetImage = (imageName: string) => {
    const imageMap: { [key: string]: any } = {
      'tigerguy': require('@/assets/images/tigerguy.png'),
      'plumeca': require('@/assets/images/plumeca.png'),
      'coco-guy': require('@/assets/images/coco-guy.png'),
      'lallazo': require('@/assets/images/lallazo.png'),
      'robot-guy': require('@/assets/images/robot-guy.png'),
      'sheep-guy': require('@/assets/images/sheep-guy.png'),
      'bull-guy': require('@/assets/images/bull-guy.png'),
      'storm-guy': require('@/assets/images/storm-guy.png'),
      'fish-guys': require('@/assets/images/fish-guys.png'),
      'sappo': require('@/assets/images/sappo.png'),
      'gazo': require('@/assets/images/gazo.png'),
    };
    return imageMap[imageName] || require('@/assets/images/tigerguy.png');
  };

  const getAvatarImage = (imageName: string) => {
    const avatarMap: { [key: string]: any } = {
      'avatar1.png': require('@/assets/images/avatar1.png'),
      'avatar2.png': require('@/assets/images/avatar2.png'),
      'avatar3.png': require('@/assets/images/avatar3.png'),
      'avatar4.png': require('@/assets/images/avatar4.png'),
      'avatar5.png': require('@/assets/images/avatar5.png'),
      'avatar6.png': require('@/assets/images/avatar6.png'),
      'avatar7.png': require('@/assets/images/avatar7.png'),
      'avatar8.png': require('@/assets/images/avatar8.png'),
    };
    
    return avatarMap[imageName] || require('@/assets/images/avatar1.png');
  };
  
  // Daily rewards state
  const [isFlashing, setIsFlashing] = useState(true);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streakCelebration, setStreakCelebration] = useState(false);
  const [showHometownModal, setShowHometownModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempPlayerTag, setTempPlayerTag] = useState(state.playerTag);
  
  // Animation values
  const celebrationScale = useRef(new Animated.Value(0)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;
  const celebrationTranslateY = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const streakCelebrationScale = useRef(new Animated.Value(0)).current;
  const streakCelebrationOpacity = useRef(new Animated.Value(0)).current;

  // Reset scroll position when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  // Flash animation for the gem icon
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlashing(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleDailyReward = () => {
    if (!rewardClaimed) {
      // Button press feedback
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      addStamina(5); // Give 5 stamina
      setRewardClaimed(true);
      setIsFlashing(false);
      setShowCelebration(true);
      
      // Spring celebration animation
      Animated.parallel([
        Animated.spring(celebrationScale, {
          toValue: 1.2,
          tension: 150,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationTranslateY, {
          toValue: -50,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out and reset after 1.2 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(celebrationOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationTranslateY, {
            toValue: -80,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(celebrationScale, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowCelebration(false);
          celebrationScale.setValue(0);
          celebrationOpacity.setValue(0);
          celebrationTranslateY.setValue(0);
        });
      }, 1200);
    }
  };

  const handleClaimStreakReward = () => {
    const success = claimStreakReward();
    if (success) {
      setStreakCelebration(true);
      
      // Celebration animation
      Animated.parallel([
        Animated.spring(streakCelebrationScale, {
          toValue: 1.2,
          tension: 150,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(streakCelebrationOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out after 2 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(streakCelebrationOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(streakCelebrationScale, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setStreakCelebration(false);
          streakCelebrationScale.setValue(0);
          streakCelebrationOpacity.setValue(0);
        });
      }, 2000);
    }
  };

  // Calculate streak progress
  const streakProgress = Math.min(state.loginStreak, 3);
  const streakPercentage = (streakProgress / 3) * 100;
  const canClaimStreak = state.loginStreak >= 3 && !state.streakRewardClaimed;

  // Hometown locations
  const locations = [
    { name: "Pxoburbs", color: "#8b5cf6", icon: "home" },
    { name: "Loomer's Wharf", color: "#0ea5e9", icon: "anchor" },
    { name: "Crescent Oasis", color: "#f59e0b", icon: "sun-o" },
    { name: "Barrelhaven", color: "#92400e", icon: "glass" },
    { name: "Shakespeare's Quarter", color: "#ec4899", icon: "paint-brush" },
    { name: "Stardiver Forest", color: "#10b981", icon: "leaf" },
    { name: "Lullaby Downs", color: "#6b7280", icon: "moon-o" },
    { name: "Bayou Nocturne", color: "#1f2937", icon: "tint" },
    { name: "Lumen Bazaar", color: "#fbbf24", icon: "lightbulb-o" },
    { name: "Twilight Atoll", color: "#f97316", icon: "music" },
    { name: "Thistledown", color: "#7c3aed", icon: "book" },
    { name: "Midwinter Crossing", color: "#94a3b8", icon: "snowflake-o" },
    { name: "Gossamer Midway", color: "#dc2626", icon: "star" },
  ];

  const currentLocation = locations.find(loc => loc.name === state.hometown) || locations[0];
  
  if (!hydrated) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Player Profile Card */}
        <RNView style={styles.playerProfileCard}>
          {/* Profile Header - Avatar on Right */}
          <RNView style={styles.profileHeader}>
            <RNView style={styles.playerInfo}>
              <Text style={styles.playerName}>PxopetMaster</Text>
              <Text style={styles.playerTitle}>{state.playerTag}</Text>
              <RNView>
                <Text style={styles.hometownLabel}>Hometown:</Text>
                <Pressable 
                  style={[styles.hometownBadge, { borderColor: currentLocation.color, backgroundColor: `${currentLocation.color}15` }]}
                  onPress={() => setShowHometownModal(true)}
                >
                  <FontAwesome name={currentLocation.icon as any} size={11} color={currentLocation.color} />
                  <Text style={[styles.playerHometown, { color: currentLocation.color }]}>{state.hometown}</Text>
                </Pressable>
              </RNView>
            </RNView>
            <Pressable 
              style={styles.avatarFrame}
              onPress={() => {
                setTempPlayerTag(state.playerTag);
                setShowAvatarModal(true);
              }}
            >
              <Image
                source={getAvatarImage(state.selectedAvatar)}
                style={styles.playerAvatar}
                resizeMode="contain"
              />
            </Pressable>
          </RNView>
          
          {/* Divider */}
          <RNView style={styles.profileDivider} />
          
          {/* Co-star Style Action Buttons */}
          <RNView style={styles.profileStats}>
            <RNView style={styles.actionButtonsRow}>
              <Pressable 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => router.push('/(tabs)/pets')}
              >
                <FontAwesome name="heart" size={14} color="#8b5cf6" />
                <Text style={styles.primaryButtonText}>Pets</Text>
              </Pressable>
              <Pressable 
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => router.push('/(tabs)/inventory')}
              >
                <FontAwesome name="archive" size={14} color="#8b5cf6" />
                <Text style={styles.secondaryButtonText}>Inventory</Text>
              </Pressable>
              <Pressable 
                style={[styles.actionButton, styles.accentButton]}
                onPress={() => router.push('/(tabs)/dailies')}
              >
                <FontAwesome name="calendar" size={14} color="#8b5cf6" />
                <Text style={styles.accentButtonText}>Dailies</Text>
              </Pressable>
            </RNView>
            <RNView style={styles.actionButtonsRow}>
              <Pressable style={[styles.actionButton, styles.warningButton]}>
                <FontAwesome name="exchange" size={14} color="#8b5cf6" />
                <Text style={styles.warningButtonText}>Trades</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.successButton]}>
                <FontAwesome name="shopping-cart" size={14} color="#8b5cf6" />
                <Text style={styles.successButtonText}>My Shop</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.infoButton]}>
                <FontAwesome name="users" size={14} color="#8b5cf6" />
                <Text style={styles.infoButtonText}>Clubs</Text>
              </Pressable>
            </RNView>
          </RNView>

          {/* Compact Active Pet Section - Inside Profile Card */}
          <RNView style={styles.compactPetSection}>
            <Text style={styles.compactPetTitle}>ACTIVE PET</Text>
            {activePet ? (
              <RNView style={styles.compactPetBar}>
                <Image
                  source={getPetImage(activePet.image)}
                  style={styles.compactPetSprite}
                  resizeMode="contain"
                />
                <RNView style={styles.compactPetInfo}>
                  <Text style={styles.compactPetName}>{activePet.name}</Text>
                  <Text style={styles.compactPetLevel}>Lv.{activePet.level}</Text>
                </RNView>
                <RNView style={styles.compactPetStats}>
                  <RNView style={styles.compactStatItem}>
                    <Text style={styles.compactStatLabel}>HP</Text>
                    <Text style={styles.compactStatValue}>{activePet.hp}</Text>
                  </RNView>
                  <RNView style={styles.compactStatItem}>
                    <Text style={styles.compactStatLabel}>ATK</Text>
                    <Text style={styles.compactStatValue}>{activePet.atk}</Text>
                  </RNView>
                  <RNView style={styles.compactStatItem}>
                    <Text style={styles.compactStatLabel}>DEF</Text>
                    <Text style={styles.compactStatValue}>{activePet.def}</Text>
                  </RNView>
                </RNView>
                <Pressable 
                  style={styles.compactPetLink}
                  onPress={() => router.push('/(tabs)/pets')}
                >
                  <FontAwesome name="chevron-right" size={12} color="#8b5cf6" />
                </Pressable>
              </RNView>
            ) : (
              <Pressable 
                style={styles.compactPetBarEmpty}
                onPress={() => router.push('/(tabs)/nursery')}
              >
                <FontAwesome name="plus-circle" size={16} color="#8b5cf6" />
                <Text style={styles.compactPetEmptyText}>Adopt a pet</Text>
              </Pressable>
            )}
          </RNView>
        </RNView>

        {/* Trophies Section - Separate Card */}
        <RNView style={styles.trophiesCard}>
          <Text style={styles.trophiesTitle}>TROPHIES</Text>
          <RNView style={styles.trophiesRow}>
            <Image
              source={require('@/assets/images/pxomillionaire-trophy.png')}
              style={styles.trophySprite}
              resizeMode="contain"
            />
            <Image
              source={require('@/assets/images/nap-trophy.png')}
              style={styles.trophySprite}
              resizeMode="contain"
            />
            <Image
              source={require('@/assets/images/festival-trophy.png')}
              style={styles.trophySprite}
              resizeMode="contain"
            />
          </RNView>
        </RNView>


        {/* Daily Quests Section - Moved from News */}
        <RNView style={styles.dailyQuestsContainer}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
          
          {/* Quest 1 - Daily Login */}
          <Pressable 
            style={[
              styles.questItem,
              canClaimStreak && styles.questItemClaimable,
              state.streakRewardClaimed && state.loginStreak >= 3 && styles.questItemClaimed
            ]}
            onPress={canClaimStreak ? handleClaimStreakReward : undefined}
            disabled={!canClaimStreak}
          >
            <FontAwesome 
              name={state.streakRewardClaimed && state.loginStreak >= 3 ? "check-circle" : "calendar"} 
              size={16} 
              color={state.streakRewardClaimed && state.loginStreak >= 3 ? "#10b981" : "#8b5cf6"} 
              style={styles.questIcon} 
            />
            <RNView style={styles.questContent}>
              <Text style={styles.questName}>Daily Login Streak</Text>
              <Text style={styles.questDescription}>
                {state.streakRewardClaimed && state.loginStreak >= 3 
                  ? "Reward claimed! Keep the streak going!" 
                  : "Log in for 3 consecutive days"}
              </Text>
              <RNView style={styles.questProgress}>
                <Text style={styles.questProgressText}>Progress: {streakProgress}/3 days</Text>
                <RNView style={styles.progressBar}>
                  <RNView style={[styles.progressFill, { width: `${streakPercentage}%` }]} />
                </RNView>
              </RNView>
            </RNView>
            {canClaimStreak ? (
              <Pressable style={styles.claimButton} onPress={handleClaimStreakReward}>
                <Text style={styles.claimButtonText}>CLAIM</Text>
              </Pressable>
            ) : (
              <Text style={[
                styles.questReward,
                state.streakRewardClaimed && state.loginStreak >= 3 && styles.questRewardClaimed
              ]}>
                {state.streakRewardClaimed && state.loginStreak >= 3 ? "✓" : "+25 ⚡"}
              </Text>
            )}
            
            {/* Streak Celebration */}
            {streakCelebration && (
              <Animated.View 
                style={[
                  styles.streakCelebrationContainer,
                  {
                    opacity: streakCelebrationOpacity,
                    transform: [{ scale: streakCelebrationScale }]
                  }
                ]}
              >
                <RNView style={styles.streakCelebrationBadge}>
                  <Text style={styles.streakCelebrationText}>+25 ⚡</Text>
                </RNView>
              </Animated.View>
            )}
          </Pressable>

          {/* Quest 2 - Pet Care */}
          <RNView style={styles.questItem}>
            <FontAwesome name="heart" size={16} color="#ef4444" style={styles.questIcon} />
            <RNView style={styles.questContent}>
              <Text style={styles.questName}>Pet Care Master</Text>
              <Text style={styles.questDescription}>Give your pet 5 treats today</Text>
              <RNView style={styles.questProgress}>
                <Text style={styles.questProgressText}>Progress: 3/5 treats</Text>
                <RNView style={styles.progressBar}>
                  <RNView style={[styles.progressFill, { width: '60%' }]} />
                </RNView>
              </RNView>
            </RNView>
            <Text style={styles.questReward}>+15 ⚡</Text>
          </RNView>

          {/* Quest 3 - Weekly Challenge */}
          <RNView style={styles.questItem}>
            <FontAwesome name="trophy" size={16} color="#f59e0b" style={styles.questIcon} />
            <RNView style={styles.questContent}>
              <Text style={styles.questName}>Weekly Explorer</Text>
              <Text style={styles.questDescription}>Visit 5 different areas this week</Text>
              <RNView style={styles.questProgress}>
                <Text style={styles.questProgressText}>Progress: 2/5 areas</Text>
                <RNView style={styles.progressBar}>
                  <RNView style={[styles.progressFill, { width: '40%' }]} />
                </RNView>
              </RNView>
            </RNView>
            <Text style={styles.questReward}>+25 ⚡</Text>
          </RNView>

        </RNView>

        {/* Reset Pets Button */}
        <RNView style={styles.devModeSection}>
          <Pressable 
            style={styles.resetPetsButton}
            onPress={() => {
              Alert.alert(
                'Reset All Pets',
                'Are you sure you want to delete all your pets? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: () => {
                      resetAllPets();
                      Alert.alert('Success', 'All pets have been reset!');
                    }
                  }
                ]
              );
            }}
          >
            <FontAwesome name="trash" size={16} color="#ef4444" />
            <Text style={styles.resetPetsButtonText}>Reset All Pets</Text>
          </Pressable>
        </RNView>

      </ScrollView>

      {/* Hometown Selection Modal */}
      <Modal
        visible={showHometownModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHometownModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowHometownModal(false)}
        >
          <Pressable 
            style={styles.hometownModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.hometownModalTitle}>Choose Your Hometown</Text>
            <Text style={styles.hometownModalSubtitle}>Where do you call home in Pxopia?</Text>
            
            <ScrollView 
              style={styles.locationsList}
              showsVerticalScrollIndicator={false}
            >
              {locations.map((location, index) => (
                <Pressable
                  key={location.name}
                  style={[
                    styles.locationItem,
                    state.hometown === location.name && styles.locationItemSelected
                  ]}
                  onPress={() => {
                    setHometown(location.name);
                    setTimeout(() => setShowHometownModal(false), 200);
                  }}
                >
                  <RNView style={[styles.locationIconContainer, { backgroundColor: `${location.color}20` }]}>
                    <FontAwesome name={location.icon as any} size={18} color={location.color} />
                  </RNView>
                  <Text style={[styles.locationName, { color: location.color }]}>
                    {location.name}
                  </Text>
                  {state.hometown === location.name && (
                    <FontAwesome name="check-circle" size={20} color={location.color} style={styles.checkIcon} />
                  )}
                </Pressable>
              ))}
            </ScrollView>

            <Pressable
              style={styles.closeModalButton}
              onPress={() => setShowHometownModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Avatar Customization Modal */}
      <Modal
        visible={showAvatarModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avatarModalContainer}
        >
          <Pressable 
            style={styles.avatarModalOverlay}
            onPress={() => setShowAvatarModal(false)}
          />
          <RNView style={styles.avatarModalContent}>
            <RNView style={styles.avatarModalHeader}>
              <Text style={styles.avatarModalTitle}>CUSTOMIZE PROFILE</Text>
              <Pressable onPress={() => setShowAvatarModal(false)}>
                <FontAwesome name="times" size={18} color="#8b5cf6" />
              </Pressable>
            </RNView>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.avatarModalScroll}
            >
              {/* Player Tag Input */}
              <RNView style={styles.tagSection}>
                <Text style={styles.tagSectionTitle}>Player Tag</Text>
                <TextInput
                  style={styles.tagInput}
                  value={tempPlayerTag}
                  onChangeText={setTempPlayerTag}
                  placeholder="Enter your tag"
                  maxLength={30}
                />
              </RNView>

              {/* Avatar Grid */}
              <RNView style={styles.avatarSection}>
                <Text style={styles.avatarSectionTitle}>Choose Avatar</Text>
                <Text style={styles.avatarSectionSubtitle}>
                  {state.collectedAvatars.length} / 50 collected
                </Text>
                <RNView style={styles.avatarGrid}>
                  {state.collectedAvatars.map((avatar, index) => (
                    <Pressable
                      key={avatar}
                      style={[
                        styles.avatarGridItem,
                        state.selectedAvatar === avatar && styles.avatarGridItemSelected
                      ]}
                      onPress={() => setAvatar(avatar)}
                    >
                      <Image
                        source={getAvatarImage(avatar)}
                        style={styles.avatarGridImage}
                        resizeMode="contain"
                      />
                      {state.selectedAvatar === avatar && (
                        <RNView style={styles.avatarSelectedBadge}>
                          <FontAwesome name="check" size={10} color="#ffffff" />
                        </RNView>
                      )}
                    </Pressable>
                  ))}
                </RNView>
              </RNView>
            </ScrollView>

            {/* Save Button */}
            <Pressable
              style={styles.saveProfileButton}
              onPress={() => {
                setPlayerTag(tempPlayerTag);
                setShowAvatarModal(false);
              }}
            >
              <Text style={styles.saveProfileButtonText}>Save Changes</Text>
            </Pressable>
          </RNView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  playerProfileCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    marginBottom: 12,
  },
  avatarFrame: {
    width: 80,
    height: 80,
    borderRadius: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  profileDivider: {
    height: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    marginVertical: 14,
  },
  levelBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#000000',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  levelText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playerInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  playerName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  playerTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#8b5cf6',
    fontWeight: '400',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  hometownLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
    marginTop: 6,
  },
  hometownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1.5,
    borderColor: '#8b5cf6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  playerHometown: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  bioContainer: {
    marginTop: 4,
  },
  bioLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  bioInput: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#000000',
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    borderWidth: 1,
    borderColor: '#14b8a6',
    borderRadius: 6,
    padding: 8,
    minHeight: 32,
  },
  playerDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  profileStats: {
    marginTop: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 4,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#6b7280',
    fontWeight: '400',
    marginBottom: 0,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 6,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  secondaryButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  accentButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  warningButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  successButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  infoButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  primaryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  secondaryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  accentButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  warningButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  successButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  infoButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    textAlign: 'center',
  },
  petSection: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  noPetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  noPetTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noPetText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  nurseryButtonHome: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nurseryButtonHomeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petImage: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  petLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#999999',
  },
  petHappiness: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  hpBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  hpLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    width: 30,
  },
  hpBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  hpBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 5,
  },
  hpText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    minWidth: 50,
    textAlign: 'right',
  },
  expBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    width: 30,
  },
  expBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  expBarFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  expText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    minWidth: 60,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 8,
  },
  condensedStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 8, // More compact padding
    borderWidth: 1,
    borderColor: 'rgba(20, 184, 166, 0.4)', // Transparent cyan border
    marginBottom: 8,
  },
  petActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  petActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  petActionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  // Compact Pet Section & Bar Styles (Pokemon-style horizontal sprite bar)
  compactPetSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
  },
  compactPetTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  compactPetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 8,
  },
  compactPetSprite: {
    width: 40,
    height: 40,
  },
  compactPetInfo: {
    flex: 1,
  },
  compactPetName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  compactPetLevel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#64748b',
  },
  compactPetStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  compactStatItem: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  compactStatLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
    textAlign: 'center',
  },
  compactStatValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'center',
  },
  compactPetLink: {
    padding: 6,
    marginLeft: 4,
  },
  compactPetBarEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderStyle: 'dashed',
    gap: 8,
  },
  compactPetEmptyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#8b5cf6',
  },
  // Compact Trophies Styles (inside profile card)
  compactTrophiesSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 92, 246, 0.2)',
  },
  compactTrophiesTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  compactTrophiesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  trophySprite: {
    width: 36,
    height: 36,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  actionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666666',
  },
  activityReward: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  inventorySection: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inventoryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  inventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  specialtyInventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  fishingInventoryItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 32,
  },
  inventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  specialtyInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  coffeeInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sodaInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  fishingInventoryImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  inventoryCount: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  emojiText: {
    fontSize: 20,
    textAlign: 'center',
  },
  inventoryItemName: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    right: 0,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 10,
  },
  clearInventoryButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clearInventoryButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  emptySlot: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#cccccc',
  },
  // Daily Reward Styles
  dailyRewardContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderStyle: 'dashed',
  },
  dailyRewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    justifyContent: 'center',
  },
  claimedSection: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
    borderColor: 'rgba(100, 116, 139, 0.3)',
  },
  flashingGem: {
    marginRight: 8,
  },
  dailyRewardText: {
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  claimedText: {
    color: '#64748b',
  },
  celebrationContainer: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  gradientBackground: {
    backgroundColor: '#8b5cf6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  celebrationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  celebrationText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  // Quest Styles
  questTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 12,
    marginBottom: 8,
    position: 'relative',
  },
  questItemClaimable: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    borderWidth: 2,
  },
  questItemClaimed: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  questIcon: {
    marginRight: 12,
    flexShrink: 0,
  },
  questContent: {
    flex: 1,
    marginRight: 8,
  },
  questName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  questDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 6,
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questProgressText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#0f172a',
    flexShrink: 0,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  questReward: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#8b5cf6',
    textAlign: 'right',
    flexShrink: 0,
  },
  questRewardClaimed: {
    color: '#10b981',
    fontSize: 16,
  },
  claimButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  claimButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  streakCelebrationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -20,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  streakCelebrationBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  streakCelebrationText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dailyQuestsContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trophiesCard: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trophiesTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  trophiesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  trophiesContainer: {
    gap: 12,
  },
  trophyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  trophyItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  trophyName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  // Dev Mode Styles
  devModeSection: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  resetPetsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  resetPetsButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ef4444',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  hometownModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  hometownModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
  },
  hometownModalSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  locationsList: {
    maxHeight: 400,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locationItemSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    flex: 1,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 8,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  closeModalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Avatar Customization Modal Styles
  avatarModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  avatarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  avatarModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 18,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  avatarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.15)',
  },
  avatarModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    letterSpacing: 0.5,
  },
  avatarModalScroll: {
    paddingBottom: 10,
  },
  tagSection: {
    marginBottom: 18,
  },
  tagSectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 6,
    fontWeight: '600',
  },
  tagInput: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 10,
    padding: 12,
    color: '#1e293b',
  },
  avatarSection: {
    marginBottom: 14,
  },
  avatarSectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 3,
    fontWeight: '600',
  },
  avatarSectionSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  avatarGridItem: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarGridItemSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 2.5,
  },
  avatarGridImage: {
    width: '75%',
    height: '75%',
    borderRadius: 6,
  },
  avatarSelectedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  saveProfileButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveProfileButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});


