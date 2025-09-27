import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

// Import the masquerade night image
const masqNightImage = require('@/assets/images/masq-night.png');

export default function MasqueradeHallScreen() {
  const [selectedDancer, setSelectedDancer] = useState<string | null>(null);

  const dancers = [
    {
      id: 'mysterious-1',
      name: 'The Enigmatic Stranger',
      description: 'A figure in a deep purple mask with silver trim. Their movements are graceful and mysterious.',
      mask: 'purple',
      position: { top: 20, left: 50 }
    },
    {
      id: 'mysterious-2', 
      name: 'The Golden Phantom',
      description: 'Dressed in shimmering gold with an ornate mask. They dance with ethereal elegance.',
      mask: 'gold',
      position: { top: 60, left: 20 }
    },
    {
      id: 'mysterious-3',
      name: 'The Midnight Shadow',
      description: 'Cloaked in black with a silver mask. Their dance is intense and captivating.',
      mask: 'black',
      position: { top: 40, left: 80 }
    }
  ];

  const handleDancerSelect = (dancerId: string) => {
    setSelectedDancer(dancerId);
    const dancer = dancers.find(d => d.id === dancerId);
    Alert.alert(
      'Dance Partner Selected!',
      `You have chosen to dance with ${dancer?.name}. The music swells as you join them on the dance floor.`,
      [
        { text: 'Continue Dancing', onPress: () => setSelectedDancer(null) },
        { text: 'Return to Hall', onPress: () => setSelectedDancer(null) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/artisan-quarter')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>MASQUERADE HALL</Text>

        {/* Main Image Container */}
        <RNView style={styles.imageContainer}>
          <Image source={masqNightImage} style={styles.mainImage} />
          
          {/* Interactive Dancer Overlays */}
          {dancers.map((dancer) => (
            <Pressable
              key={dancer.id}
              style={[
                styles.dancerOverlay,
                {
                  top: `${dancer.position.top}%`,
                  left: `${dancer.position.left}%`,
                  backgroundColor: selectedDancer === dancer.id ? 'rgba(236, 72, 153, 0.3)' : 'rgba(14, 165, 233, 0.2)',
                  borderColor: selectedDancer === dancer.id ? '#ec4899' : '#0ea5e9',
                }
              ]}
              onPress={() => handleDancerSelect(dancer.id)}
            >
              <FontAwesome 
                name="user" 
                size={20} 
                color={selectedDancer === dancer.id ? '#ec4899' : '#0ea5e9'} 
              />
            </Pressable>
          ))}
        </RNView>

        {/* Description */}
        <Text style={styles.description}>
          The grand ballroom is alive with music and mystery. Three masked strangers dance 
          in the moonlight, each more intriguing than the last. The air is thick with 
          anticipation as you must choose your dance partner for the evening. 
          Who will you select to share this magical moment with?
        </Text>

        {/* Dancer Selection Info */}
        <RNView style={styles.selectionInfo}>
          <Text style={styles.selectionTitle}>Choose Your Dance Partner</Text>
          <Text style={styles.selectionSubtitle}>
            Tap on the glowing figures in the image above to select a partner
          </Text>
        </RNView>

        {/* Dancer Details */}
        {dancers.map((dancer) => (
          <RNView key={dancer.id} style={[
            styles.dancerCard,
            selectedDancer === dancer.id && styles.selectedDancerCard
          ]}>
            <RNView style={styles.dancerHeader}>
              <FontAwesome 
                name="user" 
                size={24} 
                color={selectedDancer === dancer.id ? '#ec4899' : '#8b5cf6'} 
              />
              <Text style={[
                styles.dancerName,
                selectedDancer === dancer.id && styles.selectedDancerName
              ]}>
                {dancer.name}
              </Text>
            </RNView>
            <Text style={styles.dancerDescription}>{dancer.description}</Text>
          </RNView>
        ))}

        {/* Event Info */}
        <RNView style={styles.eventInfo}>
          <Text style={styles.eventTitle}>Weekly Masquerade Ball</Text>
          <Text style={styles.eventDetails}>
            • Every Saturday at 8 PM{'\n'}
            • Formal attire required{'\n'}
            • Live orchestra performance{'\n'}
            • Refreshments provided{'\n'}
            • Mystery prizes for best costumes
          </Text>
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
    padding: 20,
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0ea5e9',
    marginLeft: 6,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  dancerOverlay: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  description: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 18,
    marginBottom: 24,
    textAlign: 'center',
    alignSelf: 'center',
  },
  selectionInfo: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  selectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectionSubtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dancerCard: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  selectedDancerCard: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  dancerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dancerName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 12,
  },
  selectedDancerName: {
    color: '#ec4899',
  },
  dancerDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    lineHeight: 16,
  },
  eventInfo: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  eventTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  eventDetails: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    lineHeight: 16,
    textAlign: 'left',
  },
});

