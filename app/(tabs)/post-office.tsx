import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Image, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function PostOfficeScreen() {
  const [mailCount, setMailCount] = useState(3);
  const [packageCount, setPackageCount] = useState(1);
  const [stamps, setStamps] = useState(12);

  const handleSendMail = () => {
    if (mailCount > 0) {
      setMailCount(prev => prev - 1);
      Alert.alert(
        "📮 Mail Sent!",
        "Your letter has been sent to its destination. The recipient will be happy to hear from you!"
      );
    } else {
      Alert.alert(
        "📮 No Mail",
        "You don't have any mail to send right now. Check back later!"
      );
    }
  };

  const handleSendPackage = () => {
    if (packageCount > 0) {
      setPackageCount(prev => prev - 1);
      Alert.alert(
        "📦 Package Sent!",
        "Your package has been shipped! It will arrive at its destination within 2-3 business days."
      );
    } else {
      Alert.alert(
        "📦 No Packages",
        "You don't have any packages to send right now. Check back later!"
      );
    }
  };

  const handleBuyStamps = () => {
    setStamps(prev => prev + 5);
    Alert.alert(
      "🪙 Stamps Purchased!",
      "You bought 5 stamps for 1 ticket each. You now have " + (stamps + 5) + " stamps total!"
    );
  };

  const handleGoToPOBox = () => {
    Alert.alert(
      "📮 PO Box Access",
      "You've accessed your PO Box! You can store mail and packages here for pickup."
    );
  };

  const handleBuyPostcards = () => {
    Alert.alert(
      "📮 Postcards Purchased!",
      "You bought 3 postcards for 1 ticket each. Perfect for sending quick messages to friends!"
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button - Fixed Position */}
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

        {/* Post Office Header */}
        <RNView style={styles.headerContainer}>
          <Text style={styles.postOfficeTitle}>PXOBURBS POST OFFICE</Text>
          <Text style={styles.tagline}>Connecting Pxopia, One Letter at a Time</Text>
        </RNView>

        {/* Post Office Image */}
        <RNView style={styles.imageContainer}>
          <Image 
            source={require('@/assets/images/post-office-header.png')} 
            style={styles.postOfficeImage} 
            resizeMode="contain" 
          />
        </RNView>

        {/* Mail Services */}
        <RNView style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>MAIL SERVICES</Text>
          
          <Pressable style={styles.serviceButton} onPress={handleSendMail}>
            <FontAwesome name="envelope" size={20} color="#8b5cf6" />
            <RNView style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Send Mail</Text>
              <Text style={styles.serviceDescription}>Send letters to friends</Text>
              <Text style={styles.serviceCount}>Available: {mailCount}</Text>
            </RNView>
          </Pressable>

          <Pressable style={styles.serviceButton} onPress={handleSendPackage}>
            <FontAwesome name="gift" size={20} color="#10b981" />
            <RNView style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Send Package</Text>
              <Text style={styles.serviceDescription}>Ship items to friends</Text>
              <Text style={styles.serviceCount}>Available: {packageCount}</Text>
            </RNView>
          </Pressable>

          <Pressable style={styles.serviceButton} onPress={handleGoToPOBox}>
            <FontAwesome name="archive" size={20} color="#f59e0b" />
            <RNView style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Go to PO Box</Text>
              <Text style={styles.serviceDescription}>Access your personal mailbox</Text>
            </RNView>
          </Pressable>

          <Pressable style={styles.serviceButton} onPress={handleBuyPostcards}>
            <FontAwesome name="picture-o" size={20} color="#ec4899" />
            <RNView style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Buy Postcards</Text>
              <Text style={styles.serviceDescription}>3 postcards for 1 ticket each</Text>
            </RNView>
          </Pressable>

          <Pressable style={styles.serviceButton} onPress={handleBuyStamps}>
            <FontAwesome name="ticket" size={20} color="#8b5cf6" />
            <RNView style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Buy Stamps</Text>
              <Text style={styles.serviceDescription}>5 stamps for 1 ticket</Text>
              <Text style={styles.serviceCount}>Owned: {stamps}</Text>
            </RNView>
          </Pressable>
        </RNView>

        {/* Post Office Stats */}
        <RNView style={styles.statsContainer}>
          <Text style={styles.statsTitle}>POST OFFICE STATS</Text>
          <RNView style={styles.statsRow}>
            <Text style={styles.statLabel}>Letters Sent Today:</Text>
            <Text style={styles.statValue}>{3 - mailCount}</Text>
          </RNView>
          <RNView style={styles.statsRow}>
            <Text style={styles.statLabel}>Packages Shipped:</Text>
            <Text style={styles.statValue}>{1 - packageCount}</Text>
          </RNView>
          <RNView style={styles.statsRow}>
            <Text style={styles.statLabel}>Stamps in Collection:</Text>
            <Text style={styles.statValue}>{stamps}</Text>
          </RNView>
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
    paddingBottom: 100,
    paddingTop: 10,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    marginLeft: 6,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  postOfficeTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 20,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  imageContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 30,
    alignItems: 'center',
  },
  postOfficeImage: {
    width: '100%',
    height: 200,
  },
  servicesContainer: {
    marginBottom: 30,
  },
  servicesTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  serviceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  serviceCount: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.2)',
  },
  statsTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
