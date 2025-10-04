import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';

export default function PostOfficeScreen() {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPOBoxModal, setShowPOBoxModal] = useState(false);
  const [showStampsModal, setShowStampsModal] = useState(false);
  const [showPostcardsModal, setShowPostcardsModal] = useState(false);

  // Delivery quests data
  const availableDeliveries = [
    {
      id: 1,
      recipient: 'Marty at QuickStop',
      item: 'Coffee Beans',
      reward: '50 tickets',
      location: 'QuickStop',
      description: 'Deliver fresh coffee beans to Marty for the morning rush!'
    },
    {
      id: 2,
      recipient: 'Vinnie at Shop',
      item: 'Rare Gem',
      reward: '100 tickets',
      location: 'Shop',
      description: 'Transport this valuable gem safely to Vinnie.'
    },
    {
      id: 3,
      recipient: 'Pool Attendant',
      item: 'Pool Supplies',
      reward: '75 tickets',
      location: 'Community Pool',
      description: 'Deliver maintenance supplies to the pool area.'
    }
  ];


  const handleMakeDelivery = () => {
    setShowDeliveryModal(true);
  };


  const handleGoToPOBox = () => {
    setShowPOBoxModal(true);
  };

  const handleBuyStamps = () => {
    setShowStampsModal(true);
  };

  const handleBuyPostcards = () => {
    setShowPostcardsModal(true);
  };

  const acceptDelivery = (delivery: any) => {
    Alert.alert(
      "📦 Delivery Accepted!",
      `You're now delivering ${delivery.item} to ${delivery.recipient} at ${delivery.location}. Complete the delivery to earn ${delivery.reward}!`,
      [
        { text: "Got it!", onPress: () => setShowDeliveryModal(false) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.navigate('/(tabs)/pxoburbs')}
        >
          <FontAwesome name="arrow-left" size={12} color="#8b5cf6" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>POST OFFICE</Text>
        </RNView>

        {/* Main Image */}
        <Image source={require('@/assets/images/pxopost-header.png')} style={styles.mainImage} />

        {/* Postal Worker NPC */}
        <RNView style={styles.npcContainer}>
          <RNView style={styles.speechBubble}>
            <Text style={styles.characterName}>POSTAL WORKER</Text>
            <Text style={styles.speechText}>"Welcome to Pxoburbs Post Office! How can I help you today?"</Text>
          </RNView>
          <Image 
            source={require('@/assets/images/pxopost-worker.png')} 
            style={styles.npcImage} 
            resizeMode="contain" 
          />
        </RNView>

        {/* Services Grid */}
        <RNView style={styles.servicesGrid}>
          {/* Make a Delivery */}
          <Pressable style={styles.serviceCard} onPress={handleMakeDelivery}>
            <RNView style={styles.serviceIconContainer}>
              <FontAwesome name="truck" size={24} color="#8b5cf6" />
            </RNView>
            <Text style={styles.serviceTitle}>MAKE A DELIVERY</Text>
            <Text style={styles.serviceDescription}>Take on fetch quests and deliver items to NPCs</Text>
          </Pressable>

          {/* PO Box */}
          <Pressable style={styles.serviceCard} onPress={handleGoToPOBox}>
            <RNView style={styles.serviceIconContainer}>
              <FontAwesome name="archive" size={24} color="#f59e0b" />
            </RNView>
            <Text style={styles.serviceTitle}>PO BOX</Text>
            <Text style={styles.serviceDescription}>Access your personal mailbox</Text>
          </Pressable>

          {/* Buy Stamps */}
          <Pressable style={styles.serviceCard} onPress={handleBuyStamps}>
            <RNView style={styles.serviceIconContainer}>
              <FontAwesome name="ticket" size={24} color="#ec4899" />
            </RNView>
            <Text style={styles.serviceTitle}>BUY STAMPS</Text>
            <Text style={styles.serviceDescription}>Purchase stamps for sending mail</Text>
          </Pressable>

          {/* Buy/Send Postcards */}
          <Pressable style={styles.serviceCard} onPress={handleBuyPostcards}>
            <RNView style={styles.serviceIconContainer}>
              <FontAwesome name="picture-o" size={24} color="#7c3aed" />
            </RNView>
            <Text style={styles.serviceTitle}>POSTCARDS</Text>
            <Text style={styles.serviceDescription}>Buy and send postcards to friends</Text>
          </Pressable>
        </RNView>

        {/* Bulletin Board Image */}
        <RNView style={styles.bulletinImageContainer}>
          <Image 
            source={require('@/assets/images/pxopost-bulletin.png')} 
            style={styles.bulletinImage} 
            resizeMode="contain" 
          />
        </RNView>

        {/* About Section */}
        <RNView style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About Pxoburbs Post Office</Text>
          <Text style={styles.aboutText}>
            The heart of communication in Pxoburbs! Here you can take on delivery quests, 
            check community announcements, manage your mail, and connect with friends across Pxopia.
          </Text>
        </RNView>
      </ScrollView>

      {/* Delivery Modal */}
      <Modal
        visible={showDeliveryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeliveryModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>AVAILABLE DELIVERIES</Text>
            <ScrollView style={styles.deliveryList}>
              {availableDeliveries.map((delivery) => (
                <Pressable 
                  key={delivery.id} 
                  style={styles.deliveryItem}
                  onPress={() => acceptDelivery(delivery)}
                >
                  <RNView style={styles.deliveryHeader}>
                    <Text style={styles.deliveryItemName}>{delivery.item}</Text>
                    <Text style={styles.deliveryReward}>{delivery.reward}</Text>
                  </RNView>
                  <Text style={styles.deliveryRecipient}>To: {delivery.recipient}</Text>
                  <Text style={styles.deliveryLocation}>Location: {delivery.location}</Text>
                  <Text style={styles.deliveryDescription}>{delivery.description}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowDeliveryModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>


      {/* PO Box Modal */}
      <Modal
        visible={showPOBoxModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPOBoxModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>YOUR PO BOX</Text>
            <RNView style={styles.poBoxContent}>
              <FontAwesome name="archive" size={48} color="#8b5cf6" />
              <Text style={styles.poBoxText}>Your mailbox is empty</Text>
              <Text style={styles.poBoxSubtext}>Check back later for mail and packages!</Text>
            </RNView>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowPOBoxModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Stamps Modal */}
      <Modal
        visible={showStampsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStampsModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>BUY STAMPS</Text>
            <RNView style={styles.stampsContent}>
              <FontAwesome name="ticket" size={48} color="#ec4899" />
              <Text style={styles.stampsText}>5 Stamps for 1 Ticket</Text>
              <Text style={styles.stampsSubtext}>Perfect for sending mail!</Text>
              <Pressable style={styles.buyButton}>
                <Text style={styles.buyButtonText}>BUY STAMPS</Text>
              </Pressable>
            </RNView>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowStampsModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>

      {/* Postcards Modal */}
      <Modal
        visible={showPostcardsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostcardsModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.modalContent}>
            <Text style={styles.modalTitle}>POSTCARDS</Text>
            <RNView style={styles.postcardsContent}>
              <FontAwesome name="picture-o" size={48} color="#7c3aed" />
              <Text style={styles.postcardsText}>3 Postcards for 1 Ticket Each</Text>
              <Text style={styles.postcardsSubtext}>Send quick messages to friends!</Text>
              <Pressable style={styles.buyButton}>
                <Text style={styles.buyButtonText}>BUY POSTCARDS</Text>
              </Pressable>
            </RNView>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowPostcardsModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
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
    fontSize: 14,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 0,
    paddingHorizontal: 4,
    height: 40,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b5cf6',
    letterSpacing: 1,
    textAlign: 'center',
  },
  mainImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  npcContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  speechBubble: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  characterName: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  speechText: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    lineHeight: 16,
  },
  npcImage: {
    width: 80,
    height: 80,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bulletinImageContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bulletinImage: {
    width: '100%',
    height: 150,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 10,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 14,
  },
  aboutContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  aboutTitle: {
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    lineHeight: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  deliveryList: {
    maxHeight: 300,
  },
  deliveryItem: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  deliveryItemName: {
    fontSize: 14,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  deliveryReward: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#10b981',
    fontWeight: 'bold',
  },
  deliveryRecipient: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    marginBottom: 2,
  },
  deliveryLocation: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    marginBottom: 5,
  },
  deliveryDescription: {
    fontSize: 11,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    lineHeight: 14,
  },
  poBoxContent: {
    alignItems: 'center',
    padding: 40,
  },
  poBoxText: {
    fontSize: 16,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  poBoxSubtext: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  stampsContent: {
    alignItems: 'center',
    padding: 40,
  },
  stampsText: {
    fontSize: 16,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  stampsSubtext: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  postcardsContent: {
    alignItems: 'center',
    padding: 40,
  },
  postcardsText: {
    fontSize: 16,
    fontFamily: 'Silkscreen_400Regular',
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  postcardsSubtext: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buyButtonText: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 12,
    fontFamily: 'Silkscreen_400Regular',
    color: '#64748b',
    fontWeight: 'bold',
  },
});