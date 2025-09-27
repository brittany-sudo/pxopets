import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';

// Import the Starlight Cinema image
const starlightCinemaImage = require('@/assets/images/starlight-cinema-im.png');

export default function StarlightCinemaScreen() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Cinema ticket options
  const [ticketOptions, setTicketOptions] = useState([
    { 
      id: '1', 
      name: 'Matinee Show', 
      price: 8, 
      time: '2:00 PM',
      description: 'Afternoon screening with discounted prices',
      available: true
    },
    { 
      id: '2', 
      name: 'Evening Show', 
      price: 12, 
      time: '7:30 PM',
      description: 'Prime time viewing experience',
      available: true
    },
    { 
      id: '3', 
      name: 'Late Night Show', 
      price: 10, 
      time: '10:45 PM',
      description: 'Perfect for night owls',
      available: true
    },
    { 
      id: '4', 
      name: 'VIP Experience', 
      price: 25, 
      time: '8:00 PM',
      description: 'Premium seating with complimentary snacks',
      available: false
    },
  ]);

  const handleTicketPurchase = (ticket: any) => {
    if (!ticket.available) {
      Alert.alert("Sold Out", "This show is currently sold out. Please try another time.");
      return;
    }

    Alert.alert(
      "Purchase Cinema Ticket",
      `Buy a ${ticket.name} ticket for ${ticket.price} ⚡?\n\nTime: ${ticket.time}\n${ticket.description}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy Ticket", onPress: () => {
          Alert.alert(
            "Ticket Purchased!", 
            `You've successfully purchased a ${ticket.name} ticket!\n\nShow time: ${ticket.time}\nEnjoy your movie! 🍿`
          );
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={14} color="#0ea5e9" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Cinema Image */}
        <RNView style={styles.cinemaImageContainer}>
          <Image source={starlightCinemaImage} style={styles.cinemaImage} />
        </RNView>

        {/* Welcome Message */}
        <BorderedBox>
          <RNView style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Starlight Cinema!</Text>
            <Text style={styles.welcomeText}>
              Experience the magic of movies in our state-of-the-art theater. 
              Choose from our selection of showtimes and enjoy the latest blockbusters 
              in comfort and style.
            </Text>
          </RNView>
        </BorderedBox>

        {/* Ticket Options */}
        <BorderedBox>
          <Text style={styles.sectionTitle}>🎬 CINEMA TICKETS 🎬</Text>
          <RNView style={styles.ticketsGrid}>
            {ticketOptions.map((ticket) => (
              <RNView key={ticket.id} style={[
                styles.ticketItem,
                !ticket.available && styles.soldOutItem
              ]}>
                <RNView style={styles.ticketHeader}>
                  <Text style={styles.ticketName}>{ticket.name}</Text>
                  <Text style={styles.ticketTime}>{ticket.time}</Text>
                </RNView>
                <Text style={styles.ticketDescription}>{ticket.description}</Text>
                <RNView style={styles.ticketFooter}>
                  <Text style={styles.ticketPrice}>{ticket.price} ⚡</Text>
                  <Pressable 
                    style={[
                      styles.ticketButton,
                      !ticket.available && styles.soldOutButton
                    ]}
                    onPress={() => handleTicketPurchase(ticket)}
                    disabled={!ticket.available}
                  >
                    <Text style={[
                      styles.ticketButtonText,
                      !ticket.available && styles.soldOutButtonText
                    ]}>
                      {ticket.available ? 'BUY TICKET' : 'SOLD OUT'}
                    </Text>
                  </Pressable>
                </RNView>
              </RNView>
            ))}
          </RNView>
        </BorderedBox>

        {/* Cinema Info */}
        <BorderedBox>
          <RNView style={styles.cinemaInfo}>
            <Text style={styles.infoTitle}>CINEMA INFO</Text>
            <Text style={styles.infoText}>• Premium sound and projection systems</Text>
            <Text style={styles.infoText}>• Comfortable reclining seats</Text>
            <Text style={styles.infoText}>• Concession stand available</Text>
            <Text style={styles.infoText}>• Wheelchair accessible</Text>
            <Text style={styles.infoText}>• Group discounts available for 10+ people</Text>
          </RNView>
        </BorderedBox>
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
  cinemaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0f172a',
    fontFamily: 'PressStart2P_400Regular',
  },
  cinemaImageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cinemaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  welcomeSection: {
    padding: 16,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  ticketsGrid: {
    flexDirection: 'column',
    gap: 12,
    padding: 8,
  },
  ticketItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
    padding: 16,
  },
  soldOutItem: {
    backgroundColor: 'rgba(107, 114, 128, 0.05)',
    borderColor: 'rgba(107, 114, 128, 0.2)',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  ticketTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#06b6d4',
    fontWeight: 'bold',
  },
  ticketDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 14,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketPrice: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  ticketButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  soldOutButton: {
    backgroundColor: '#9ca3af',
  },
  ticketButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  soldOutButtonText: {
    color: '#ffffff',
  },
  cinemaInfo: {
    padding: 16,
  },
  infoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 4,
  },
});
