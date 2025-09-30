import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Link } from 'expo-router';

// Import the banner image
const staticTvImage = require('@/assets/images/static-tv.png');
const pxoburbsSkylineImage = require('@/assets/images/pxoburbs-skyline.png');
const cosmicBurgerImage = require('@/assets/images/cosmicburger.png');
const lilSodaImage = require('@/assets/images/lil-soda.png');
const lilArcadeImage = require('@/assets/images/lil-arcade.png');
const lilMovieReelImage = require('@/assets/images/lil-movie-reel.png');
const rolerImage = require('@/assets/images/roler.png');
const makeoutHillImage = require('@/assets/images/makeout-hill.png');
const lilRadioImage = require('@/assets/images/lil-radio.png');
const lilMailImage = require('@/assets/images/lil-mail.png');
const lilMallImage = require('@/assets/images/lil-mall.png');
const lilPxosupplyImage = require('@/assets/images/lil-pxosupply.png');
const lilRubberduckImage = require('@/assets/images/lil-rubberduck.png');
const lilTagImage = require('@/assets/images/lil-tag.png');
const lilComputer90Image = require('@/assets/images/lil-computer90.png');

export default function PxoburbsScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (activityId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(activityId)) {
        newFavorites.delete(activityId);
      } else {
        newFavorites.add(activityId);
      }
      return newFavorites;
    });
  };


  const activities = [
    {
      id: 'mall-food-court',
      name: 'Pxoburbs Mall',
      description: 'Shop and eat at the bustling food court.',
      lightning: 25,
      difficulty: 'Medium',
      icon: 'shopping-bag'
    },
    {
      id: 'corner-store',
      name: 'Quickstop Corner Store',
      description: 'Marty\'s corner store with snacks, lottery tickets, special imports, and free coffee!',
      lightning: 12,
      difficulty: 'Easy',
      icon: 'chips'
    },
    {
      id: 'roller-rink',
      name: 'Starlight Roller Rink',
      description: 'Skate under the disco lights and neon stars.',
      lightning: 20,
      difficulty: 'Easy',
      icon: 'roler'
    },
    {
      id: 'makeout-hill',
      name: 'Lovers Hill',
      description: 'The legendary spot for romantic encounters.',
      lightning: 15,
      difficulty: 'Medium',
      icon: 'makeout-hill'
    },
    {
      id: 'midnight-rewind',
      name: 'Midnight Rewind',
      description: 'Rent classic movies and rare video tapes.',
      lightning: 10,
      difficulty: 'Easy',
      icon: 'lil-movie-reel.png'
    },
    {
      id: 'radio-station',
      name: 'PXO 101.8 FM',
      description: 'Local radio station with community shows.',
      lightning: 18,
      difficulty: 'Medium',
      icon: 'microphone'
    },
    {
      id: 'post-office',
      name: 'Pxoburbs Post Office',
      description: 'Send mail and packages to friends.',
      lightning: 6,
      difficulty: 'Easy',
      icon: 'envelope'
    },
    {
      id: 'pet-supply',
      name: 'PXOPET SUPPLY CO.',
      description: 'Everything your pets need for a happy life.',
      lightning: 14,
      difficulty: 'Medium',
      icon: 'paw'
    },
    {
      id: 'community-pool',
      name: 'Pxoburbs Community Pool',
      description: 'Swimming, diving, and poolside relaxation.',
      lightning: 8,
      difficulty: 'Easy',
      icon: 'tree'
    },
    {
      id: 'frog-market-thrift',
      name: 'Frog Market Thrift',
      description: 'Vintage finds and second-hand treasures.',
      lightning: 16,
      difficulty: 'Easy',
      image: 'lil-tag'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Back Button - Fixed Position */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/explore')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>THE PXOBURBS</Text>
        </RNView>

        {/* Banner Image */}
        <RNView style={styles.bannerContainer}>
          <Image source={pxoburbsSkylineImage} style={styles.bannerImage} />
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          Welcome to The Pxoburbs! This bustling suburban district is where the action happens. 
          From the neon-lit arcade to the local corner store, every block offers something exciting. 
          Catch a movie at the cinema, grab snacks at the mall food court, or explore the arcade. 
          It's the perfect place to hang out, explore, and make memories with friends!
        </Text>


        {/* Activities Title */}
        <Text style={styles.activitiesTitle}>NEIGHBORHOOD ACTIVITIES</Text>

        {/* Activities List */}
        {activities.map((activity) => (
          <RNView key={activity.id} style={styles.activityItem}>
            {activity.id === 'corner-store' ? (
              <Link href="/quickstop" asChild>
                <Pressable style={styles.activityPressable}>
                  <RNView style={styles.activityHeader}>
                    <RNView style={styles.activityInfo}>
                      {activity.id === 'corner-store' ? (
                        <Image source={cosmicBurgerImage} style={styles.activityImageIcon} />
                      ) : (
                        <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
                      )}
                      <RNView style={styles.activityText}>
                        <RNView style={styles.activityTitleRow}>
                          <Text style={styles.activityName}>{activity.name}</Text>
                        </RNView>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      </RNView>
                    </RNView>
                  </RNView>
                  <RNView style={styles.activityFooter}>
                    <Pressable
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(activity.id)}
                    >
                      <FontAwesome 
                        name={favorites.has(activity.id) ? "star" : "star-o"} 
                        size={16} 
                        color={favorites.has(activity.id) ? "#94a3b8" : "#94a3b8"} 
                      />
                    </Pressable>
                  </RNView>
                </Pressable>
              </Link>
            ) : activity.id === 'frog-market-thrift' ? (
              <Link href="/frog-market-thrift" asChild>
                <Pressable style={styles.activityPressable}>
                  <RNView style={styles.activityHeader}>
                    <RNView style={styles.activityInfo}>
                      <Image source={lilTagImage} style={styles.activityImageIcon} />
                      <RNView style={styles.activityText}>
                        <RNView style={styles.activityTitleRow}>
                          <Text style={styles.activityName}>{activity.name}</Text>
                        </RNView>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      </RNView>
                    </RNView>
                  </RNView>
                  <RNView style={styles.activityFooter}>
                    <Pressable
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(activity.id)}
                    >
                      <FontAwesome 
                        name={favorites.has(activity.id) ? "star" : "star-o"} 
                        size={16} 
                        color={favorites.has(activity.id) ? "#94a3b8" : "#94a3b8"} 
                      />
                    </Pressable>
                  </RNView>
                </Pressable>
              </Link>
           ) : activity.id === 'roller-rink' ? (
             <Link href="/(tabs)/starlight-roller-rink" asChild>
               <Pressable style={styles.activityPressable}>
                 <RNView style={styles.activityHeader}>
                   <RNView style={styles.activityInfo}>
                     {activity.id === 'roller-rink' ? (
                       <Image source={rolerImage} style={styles.activityImageIcon} />
                     ) : (
                       <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
                     )}
                     <RNView style={styles.activityText}>
                       <RNView style={styles.activityTitleRow}>
                         <Text style={styles.activityName}>{activity.name}</Text>
                       </RNView>
                       <Text style={styles.activityDescription}>{activity.description}</Text>
                     </RNView>
                   </RNView>
                 </RNView>
                 <RNView style={styles.activityFooter}>
                   <Pressable
                     style={styles.favoriteButton}
                     onPress={() => toggleFavorite(activity.id)}
                   >
                     <FontAwesome
                       name={favorites.has(activity.id) ? "star" : "star-o"}
                       size={16}
                       color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"}
                     />
                   </Pressable>
                 </RNView>
               </Pressable>
             </Link>
           ) : activity.id === 'makeout-hill' ? (
             <Link href="/(tabs)/makeout-hill" asChild>
               <Pressable style={styles.activityPressable}>
                 <RNView style={styles.activityHeader}>
                   <RNView style={styles.activityInfo}>
                     {activity.id === 'makeout-hill' ? (
                       <Image source={makeoutHillImage} style={styles.activityImageIcon} />
                     ) : (
                       <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
                     )}
                     <RNView style={styles.activityText}>
                       <RNView style={styles.activityTitleRow}>
                         <Text style={styles.activityName}>{activity.name}</Text>
                       </RNView>
                       <Text style={styles.activityDescription}>{activity.description}</Text>
                     </RNView>
                   </RNView>
                 </RNView>
                 <RNView style={styles.activityFooter}>
                   <Pressable
                     style={styles.favoriteButton}
                     onPress={() => toggleFavorite(activity.id)}
                   >
                     <FontAwesome
                       name={favorites.has(activity.id) ? "star" : "star-o"}
                       size={16}
                       color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"}
                     />
                   </Pressable>
                 </RNView>
               </Pressable>
             </Link>
          ) : activity.id === 'radio-station' ? (
            <Pressable 
              style={styles.activityPressable}
              onPress={() => router.navigate('/(tabs)/pxo-radio')}
            >
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityInfo}>
                  <Image source={lilRadioImage} style={styles.activityImageIcon} />
                  <RNView style={styles.activityText}>
                    <RNView style={styles.activityTitleRow}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                    </RNView>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
              <RNView style={styles.activityFooter}>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(activity.id)}
                >
                  <FontAwesome 
                    name={favorites.has(activity.id) ? "star" : "star-o"} 
                    size={16} 
                    color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"} 
                  />
                </Pressable>
              </RNView>
            </Pressable>
          ) : activity.id === 'midnight-rewind' ? (
            <Pressable 
              style={styles.activityPressable}
              onPress={() => router.navigate('/(tabs)/midnight-rewind')}
            >
               <RNView style={styles.activityHeader}>
                 <RNView style={styles.activityInfo}>
                   <Image source={lilMovieReelImage} style={styles.activityImageIcon} />
                   <RNView style={styles.activityText}>
                     <RNView style={styles.activityTitleRow}>
                       <Text style={styles.activityName}>{activity.name}</Text>
                     </RNView>
                     <Text style={styles.activityDescription}>{activity.description}</Text>
                   </RNView>
                 </RNView>
               </RNView>
               <RNView style={styles.activityFooter}>
                 <Pressable
                   style={styles.favoriteButton}
                   onPress={() => toggleFavorite(activity.id)}
                 >
                   <FontAwesome 
                     name={favorites.has(activity.id) ? "star" : "star-o"} 
                     size={16} 
                     color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"} 
                   />
                 </Pressable>
               </RNView>
            </Pressable>
          ) : activity.id === 'mall-food-court' ? (
            <Pressable 
              style={styles.activityPressable}
              onPress={() => router.navigate('/(tabs)/pxoburbs-mall')}
            >
              <RNView style={styles.activityHeader}>
                <RNView style={styles.activityInfo}>
                  <Image source={lilMallImage} style={styles.activityImageIcon} />
                  <RNView style={styles.activityText}>
                    <RNView style={styles.activityTitleRow}>
                      <Text style={styles.activityName}>{activity.name}</Text>
                    </RNView>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                  </RNView>
                </RNView>
              </RNView>
              <RNView style={styles.activityFooter}>
                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(activity.id)}
                >
                  <FontAwesome 
                    name={favorites.has(activity.id) ? "star" : "star-o"} 
                    size={16} 
                    color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"} 
                  />
                </Pressable>
              </RNView>
            </Pressable>
          ) : (
            <Pressable 
              style={styles.activityPressable}
              onPress={() => {
                if (activity.id === 'post-office') {
                  router.navigate('/(tabs)/post-office');
                } else if (activity.id === 'pet-supply') {
                  router.navigate('/(tabs)/pxopet-supply');
                } else if (activity.id === 'community-pool') {
                  router.navigate('/(tabs)/community-pool');
                }
              }}
            >
              <>
                <RNView style={styles.activityHeader}>
                  <RNView style={styles.activityInfo}>
                {activity.id === 'corner-store' ? (
                  <Image source={cosmicBurgerImage} style={styles.activityImageIcon} />
                ) : activity.id === 'arcade' ? (
                  <Image source={lilArcadeImage} style={styles.arcadeImageIcon} />
                ) : activity.id === 'makeout-hill' ? (
                  <Image source={makeoutHillImage} style={styles.activityImageIcon} />
                ) : activity.id === 'roller-rink' ? (
                  <Image source={rolerImage} style={styles.activityImageIcon} />
                ) : activity.id === 'post-office' ? (
                  <Image source={lilMailImage} style={styles.activityImageIcon} />
                ) : activity.id === 'mall-food-court' ? (
                  <Image source={lilMallImage} style={styles.activityImageIcon} />
                ) : activity.id === 'pet-supply' ? (
                  <Image source={lilPxosupplyImage} style={styles.activityImageIcon} />
                ) : activity.id === 'community-pool' ? (
                  <Image source={lilRubberduckImage} style={styles.activityImageIcon} />
                ) : activity.id === 'frog-market-thrift' ? (
                  <Image source={lilTagImage} style={styles.activityImageIcon} />
                ) : (
                  <FontAwesome name={activity.icon as any} size={32} color="#8b5cf6" style={styles.activityIcon} />
                )}
                    <RNView style={styles.activityText}>
                      <RNView style={styles.activityTitleRow}>
                        <Text style={styles.activityName}>{activity.name}</Text>
                      </RNView>
                      <Text style={styles.activityDescription}>{activity.description}</Text>
                    </RNView>
                  </RNView>
                </RNView>
                <RNView style={styles.activityFooter}>
                  <Pressable
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(activity.id)}
                  >
                    <FontAwesome 
                      name={favorites.has(activity.id) ? "star" : "star-o"} 
                      size={16} 
                      color={favorites.has(activity.id) ? "#8b5cf6" : "rgba(139, 92, 246, 0.3)"} 
                    />
                  </Pressable>
                </RNView>
              </>
            </Pressable>
            )}
          </RNView>
        ))}
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
    padding: 20,
    paddingTop: 80,
    paddingBottom: 100,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    marginTop: 20,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginTop: -10,
    marginBottom: 24,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  activitiesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    marginTop: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    width: '100%',
  },
  activityItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 16,
    marginBottom: 16,
    width: '100%',
    minHeight: 100,
    justifyContent: 'center',
  },
  activityPressable: {
    width: '100%',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityInfo: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  activityIcon: {
    marginRight: 12,
    alignSelf: 'center',
  },
  activityImageIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
    alignSelf: 'center',
    imageRendering: 'pixelated' as any,
  },
  arcadeImageIcon: {
    width: 36,
    height: 36,
    marginRight: 12,
    alignSelf: 'center',
    imageRendering: 'pixelated' as any,
    resizeMode: 'contain',
  },
  activityText: {
    flex: 1,
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  activityName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'left',
  },
  activityDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
    textAlign: 'left',
  },
  favoriteButton: {
    padding: 4,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
});
