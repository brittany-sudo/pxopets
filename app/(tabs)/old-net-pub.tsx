import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function OldNetPubScreen() {

  const handleItemPress = (item: any) => {
    Alert.alert(
      item.name,
      `${item.description}\n\nPrice: ${item.price} ⚡`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Purchase", onPress: () => {
          Alert.alert("Purchase Complete!", `You've bought ${item.name}!`);
        }}
      ]
    );
  };

  const pubActivities = [
    {
      id: 'clam-chowder-bowl',
      name: 'Clam Chowder Bowl',
      description: 'Steaming white chowder with oyster crackers',
      price: 1,
      stamina: 15,
      icon: 'spoon'
    },
    {
      id: 'fried-clam-basket',
      name: 'Fried Clam Basket',
      description: 'Golden fried clams in a paper tray',
      price: 1,
      stamina: 12,
      icon: 'cutlery'
    },
    {
      id: 'lobster-roll',
      name: 'Lobster Roll',
      description: 'Buttered bun, chunks of lobster, lemon slice',
      price: 1,
      stamina: 25,
      icon: 'bug'
    },
    {
      id: 'salted-pretzel',
      name: 'Salted Pretzel',
      description: 'Pub snack, served with mustard',
      price: 1,
      stamina: 8,
      icon: 'circle'
    },
    {
      id: 'pickled-herring',
      name: 'Pickled Herring Jar',
      description: 'A quirky but thematic jar snack',
      price: 1,
      stamina: 10,
      icon: 'glass'
    },
    {
      id: 'glowfish-stew',
      name: 'Glowfish Stew',
      description: 'Chowder with faintly glowing blue broth',
      price: 1,
      stamina: 20,
      icon: 'spoon'
    },
    {
      id: 'fog-ale',
      name: 'Fog Ale',
      description: 'Frothy beer with a misty swirl above it',
      price: 1,
      stamina: 18,
      icon: 'beer'
    },
    {
      id: 'ghost-shrimp',
      name: 'Ghost Shrimp Cocktail',
      description: 'Shrimp that look semi-transparent',
      price: 1,
      stamina: 22,
      icon: 'glass'
    },
    {
      id: 'storm-biscuit',
      name: 'Storm Biscuit',
      description: 'A biscuit shaped like a lightning bolt',
      price: 1,
      stamina: 14,
      icon: 'circle'
    },
    {
      id: 'whale-tail-pie',
      name: 'Whale Tail Pie',
      description: 'Sweet pastry shaped like a whale\'s tail',
      price: 1,
      stamina: 16,
      icon: 'heart'
    },
    {
      id: 'lantern-cider',
      name: 'Lantern Cider',
      description: 'Mug of cider with a tiny lantern charm',
      price: 1,
      stamina: 12,
      icon: 'glass'
    },
    {
      id: 'sea-glass-candy',
      name: 'Sea Glass Candy',
      description: 'Bright-colored sweets that look like polished glass',
      price: 1,
      stamina: 6,
      icon: 'heart'
    },
    {
      id: 'fishermans-jerky',
      name: 'Fisherman\'s Jerky',
      description: 'Tough strips of dried fish',
      price: 1,
      stamina: 20,
      icon: 'cutlery'
    },
    {
      id: 'salt-widows-special',
      name: 'The Salt Widow\'s Special',
      description: 'Mystery dish, changes daily',
      price: 1,
      stamina: 30,
      icon: 'question'
    }
  ];


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/foggy-harbor')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE OLD NET PUB</Text>
        </RNView>

        {/* Pub Image */}
        <Image 
          source={require('@/assets/images/theoldnetpub.png')} 
          style={styles.pubImage}
          resizeMode="contain"
        />

        {/* Pub Title */}
        <Text style={styles.pubTitle}>Welcome to The Old Net Pub!</Text>

        {/* Pub Activities */}
        <RNView style={styles.pubActivitiesContainer}>
                  <RNView style={styles.pubActivityItem}>
                    <Pressable style={styles.pubActivityPressable}>
                      <RNView style={styles.pubActivityHeader}>
                        <RNView style={styles.pubActivityInfo}>
                          <Image 
                            source={require('@/assets/images/lil-anchor.png')} 
                            style={styles.pubActivityImageIcon} 
                          />
                          <RNView style={styles.pubActivityText}>
                            <RNView style={styles.pubActivityTitleRow}>
                              <Text style={styles.pubActivityName}>Play Pool</Text>
                            </RNView>
                            <Text style={styles.pubActivityDescription}>Challenge other patrons to a game of billiards</Text>
                          </RNView>
                        </RNView>
                      </RNView>
                    </Pressable>
                  </RNView>
          <RNView style={styles.pubActivityItem}>
            <Pressable style={styles.pubActivityPressable}>
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <Image 
                    source={require('@/assets/images/lil-anchor.png')} 
                    style={styles.pubActivityImageIcon} 
                  />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>Chat with Paddy</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>Listen to stories from the old sea captain</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
          <RNView style={styles.pubActivityItem}>
            <Pressable style={styles.pubActivityPressable}>
              <RNView style={styles.pubActivityHeader}>
                <RNView style={styles.pubActivityInfo}>
                  <Image 
                    source={require('@/assets/images/lil-anchor.png')} 
                    style={styles.pubActivityImageIcon} 
                  />
                  <RNView style={styles.pubActivityText}>
                    <RNView style={styles.pubActivityTitleRow}>
                      <Text style={styles.pubActivityName}>Use the Vending Machine</Text>
                    </RNView>
                    <Text style={styles.pubActivityDescription}>Get snacks and drinks from the old machine</Text>
                  </RNView>
                </RNView>
              </RNView>
            </Pressable>
          </RNView>
        </RNView>

        {/* William Image */}
        <RNView style={styles.williamContainer}>
          <Image source={require('@/assets/images/old-net-william.png')} style={styles.williamImage} />
          <Text style={styles.williamName}>William the Bartender</Text>
        </RNView>

        {/* Chat Bubble */}
        <RNView style={styles.chatBubble}>
          <Text style={styles.dialogueText}>
            <Text style={styles.characterName}>William the Bartender:</Text> (gruff) Welcome to The Old Net! Best grub and grog this side of the harbor. What'll it be?
          </Text>
        </RNView>

        {/* Tavern Menu Title */}
        <Text style={styles.menuTitle}>TAVERN MENU</Text>


        {/* Activities Grid */}
        <RNView style={styles.activitiesGrid}>
          {pubActivities.map((item) => (
            <Pressable
              key={item.id}
              style={styles.activityCard}
              onPress={() => handleItemPress(item)}
            >
                <RNView style={styles.activityHeader}>
                  <RNView style={styles.activityIconContainer}>
                    {item.icon === 'spoon' ? (
                      <Image 
                        source={require('@/assets/images/fishstew.png')} 
                        style={styles.activityFoodIcon} 
                      />
                    ) : item.icon === 'beer' ? (
                      <Image 
                        source={require('@/assets/images/fogale.png')} 
                        style={styles.activityFoodIcon} 
                      />
                    ) : item.icon === 'glass' ? (
                      <Image 
                        source={require('@/assets/images/shrimpcocktail.png')} 
                        style={styles.activityFoodIcon} 
                      />
                    ) : item.icon === 'cutlery' ? (
                      <Image 
                        source={require('@/assets/images/pickledherring.png')} 
                        style={styles.activityFoodIcon} 
                      />
                    ) : (
                      <FontAwesome name={item.icon as any} size={12} color="#0ea5e9" />
                    )}
                  </RNView>
                </RNView>
              
              <Text style={styles.activityName}>{item.name}</Text>
              <Text style={styles.activityDescription}>{item.description}</Text>
              
              <RNView style={styles.activityFooter}>
                <RNView style={styles.ticketPriceContainer}>
                  <Text style={styles.activityPrice}>{item.price}</Text>
                  <FontAwesome name="ticket" size={10} color="#8b5cf6" />
                </RNView>
                <RNView style={styles.staminaContainer}>
                  <Text style={styles.staminaText}>⚡ {item.stamina}</Text>
                </RNView>
              </RNView>
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
    backgroundColor: '#f0f9ff',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
    height: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Higher up, below the status bar
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 80, // Same width as back button to balance the layout
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0ea5e9',
    marginLeft: 8,
  },
  pubImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  pubTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  pubActivitiesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  pubActivityItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 10,
    marginBottom: 8,
    width: '100%',
  },
  pubActivityPressable: {
    width: '100%',
  },
  pubActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pubActivityInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  pubActivityIcon: {
    marginRight: 8,
    alignSelf: 'center',
  },
  pubActivityImageIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    alignSelf: 'center',
  },
  pubActivityText: {
    flex: 1,
  },
  pubActivityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  pubActivityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  pubActivityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
  },
  menuTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  activityCard: {
    width: '45%',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityFoodIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    lineHeight: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ticketPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  staminaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  staminaText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  williamContainer: {
    width: '100%',
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  williamImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  williamName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  chatBubble: {
    marginTop: -30,
    marginBottom: 8,
    marginHorizontal: 40,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    backgroundColor: '#ffffff',
  },
  dialogueText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'left',
    lineHeight: 14,
  },
  characterName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
