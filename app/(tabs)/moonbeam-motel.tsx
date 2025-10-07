import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import images
const moonbeamMotelImage = require('@/assets/images/moonbeam-motel.png');

export default function MoonbeamMotelScreen() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  const motelServices = [
    {
      id: 'room-rental',
      name: 'Hourly Room Rental',
      description: 'Rest and recover in our retro-futuristic rooms.',
      icon: 'bed'
    },
    {
      id: 'broken-vending-machine',
      name: 'Broken Vending Machine',
      description: 'Try to coax snacks from the flickering machine.',
      icon: 'exclamation-triangle'
    },
  ];

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
          <Text style={styles.locationTitle}>MOONBEAM MOTEL</Text>
        </RNView>

        {/* Banner Image - Raw */}
        <Image source={moonbeamMotelImage} style={styles.bannerImage} />

        {/* Services Title */}
        <Text style={styles.servicesTitle}>MOTEL SERVICES</Text>

        {/* Services List */}
        {motelServices.map((service) => (
          <Pressable 
            key={service.id} 
            style={styles.serviceItem}
            onPress={() => {
              if (service.id === 'room-rental') {
                router.push('/(tabs)/moonbeam-motel-room');
              } else if (service.id === 'broken-vending-machine') {
                router.push('/(tabs)/broken-vending-machine');
              }
            }}
          >
            <RNView style={styles.serviceHeader}>
              <RNView style={styles.serviceInfo}>
                <RNView style={styles.serviceIconContainer}>
                  <FontAwesome name={service.icon as any} size={20} color="#ec4899" />
                </RNView>
                <RNView style={styles.serviceText}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
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
      </ScrollView>
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
    position: 'absolute',
    left: 0,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  bannerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  servicesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  serviceItem: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    padding: 12,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceText: {
    flex: 1,
    marginLeft: 8,
    paddingRight: 40,
  },
  serviceName: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 3,
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  serviceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
    marginBottom: 8,
    textAlign: 'justify',
  },
  favoriteButton: {
    padding: 4,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  serviceFooter: {
    position: 'absolute',
    top: 8,
    right: 8,
    justifyContent: 'center',
  },
});
