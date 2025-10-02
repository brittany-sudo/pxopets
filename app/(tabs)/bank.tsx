import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function BankScreen() {
  const [tickets, setTickets] = useState(150);
  const [gems, setGems] = useState(25);
  const [hasAccount, setHasAccount] = useState(false);
  const [dailyInterestCollected, setDailyInterestCollected] = useState(false);
  const [vaultItems, setVaultItems] = useState([]);
  const [investmentItems, setInvestmentItems] = useState([]);
  const [raffleItems, setRaffleItems] = useState([]);
  const bankHeaderImage = require('@/assets/images/pxopia-national-bank.png');

  const handleCreateAccount = () => {
    if (tickets >= 100) {
      setTickets(prev => prev - 100);
      setHasAccount(true);
      Alert.alert('Account Created!', 'Welcome to Pxopia National Bank! You can now collect daily interest and use our premium services.');
    } else {
      Alert.alert('Insufficient Funds', 'You need 100 tickets to open an account.');
    }
  };

  const handleCollectInterest = () => {
    if (hasAccount && !dailyInterestCollected) {
      setGems(prev => prev + 1);
      setDailyInterestCollected(true);
      Alert.alert('Interest Collected!', 'You received 1 gem as daily interest!');
    } else if (dailyInterestCollected) {
      Alert.alert('Already Collected', 'You\'ve already collected your daily interest today.');
    } else {
      Alert.alert('No Account', 'You need to create an account first.');
    }
  };


  const bankServices = [
    {
      id: 'vault',
      name: 'Prestige Vault',
      description: 'Showcase your rare items',
      icon: 'star',
      rate: 'Display on profile'
    },
    {
      id: 'inventory-expansion',
      name: 'Inventory Expansion',
      description: 'Buy more inventory slots',
      icon: 'plus-square',
      rate: '50 tickets per slot'
    },
    {
      id: 'gem-conversion',
      name: 'Gem Conversion',
      description: 'Convert tickets to gems',
      icon: 'diamond',
      rate: '5 tickets = 1 gem'
    },
    {
      id: 'raffle',
      name: 'Raffle Box',
      description: 'Deposit junk for weekly lottery',
      icon: 'gift',
      rate: 'Chance at rare items'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>PXOPIA{'\n'}NATIONAL BANK</Text>
        </RNView>

        {/* Bank Header Image */}
        <Image source={bankHeaderImage} style={styles.bankHeaderImage} resizeMode="contain" />

        {/* Bank Teller Greeting */}
        <RNView style={styles.tellerContainer}>
          <Text style={styles.tellerGreeting}>
            {hasAccount 
              ? "Welcome back! Your account is in good standing. Don't forget to collect your daily interest!"
              : "Welcome to Pxopia National Bank! Open an account to access our premium services and collect daily interest."
            }
          </Text>
        </RNView>

        {/* Account Status & Interest */}
        <RNView style={styles.accountContainer}>
          <Text style={styles.accountLabel}>Account Status</Text>
          <RNView style={styles.accountRow}>
            <RNView style={styles.accountStatusContainer}>
              <FontAwesome 
                name={hasAccount ? "check-circle" : "times-circle"} 
                size={16} 
                color={hasAccount ? "#059669" : "#dc2626"} 
              />
              <Text style={styles.accountText}>
                {hasAccount ? "Active Account" : "No Account"}
              </Text>
            </RNView>
            {hasAccount && (
              <Pressable 
                style={[styles.interestButton, dailyInterestCollected && styles.interestButtonDisabled]} 
                onPress={handleCollectInterest}
                disabled={dailyInterestCollected}
              >
                <FontAwesome name="gem" size={14} color="#ffffff" />
                <Text style={styles.interestButtonText}>
                  {dailyInterestCollected ? "Interest Collected" : "Collect Interest"}
                </Text>
              </Pressable>
            )}
          </RNView>
          {!hasAccount && (
            <Pressable style={styles.createAccountButton} onPress={handleCreateAccount}>
              <FontAwesome name="ticket" size={12} color="#ffffff" />
              <Text style={styles.createAccountText}>Create Account (100)</Text>
            </Pressable>
          )}
        </RNView>

        {/* Personal Wallet */}
        <RNView style={styles.walletContainer}>
          <Text style={styles.walletLabel}>Your Wallet</Text>
          <RNView style={styles.walletRow}>
            <RNView style={styles.walletItem}>
              <FontAwesome name="ticket" size={14} color="#8b5cf6" />
              <Text style={styles.walletText}>Tickets: {tickets.toLocaleString()}</Text>
            </RNView>
            <RNView style={styles.walletItem}>
              <FontAwesome name="diamond" size={14} color="#8b5cf6" />
              <Text style={styles.walletText}>Gems: {gems.toLocaleString()}</Text>
            </RNView>
          </RNView>
        </RNView>


        {/* Banking Services */}
        <Text style={styles.sectionTitle}>BANKING SERVICES</Text>
        <RNView style={styles.servicesList}>
          {bankServices.map((service) => (
            <Pressable
              key={service.id}
              style={styles.serviceItem}
              onPress={() => Alert.alert(service.name, `${service.description}\n\nRate: ${service.rate}`)}
            >
              <RNView style={styles.serviceIconContainer}>
                <FontAwesome name={service.icon as any} size={20} color="#8b5cf6" />
              </RNView>
              <RNView style={styles.serviceTextContainer}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceRate}>{service.rate}</Text>
              </RNView>
              <FontAwesome name="chevron-right" size={16} color="#8b5cf6" />
            </Pressable>
          ))}
        </RNView>

        {/* Bank Info */}
        <RNView style={styles.bankInfoContainer}>
          <Text style={styles.bankInfoTitle}>About Pxopia National Bank</Text>
          <Text style={styles.bankInfoText}>
            Your premier financial institution in Pxopia! Create an account to collect daily interest, 
            showcase rare items in your prestige vault, expand your inventory, invest items for transformation, 
            and participate in our weekly raffle for amazing prizes.
          </Text>
        </RNView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 0,
    paddingHorizontal: 40,
    height: 48,
  },
  locationTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 16,
  },
  bankHeaderImage: {
    width: '100%',
    height: 180,
    marginBottom: 16,
    alignSelf: 'center',
  },
  tellerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tellerGreeting: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  accountContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accountLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
    fontWeight: '500',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 20,
    gap: 6,
  },
  interestButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  interestButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  createAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  createAccountText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  walletContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  walletLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accountStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  quickTicketActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 0,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  quickActionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  sectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  servicesList: {
    width: '100%',
    marginBottom: 24,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  serviceTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 16,
    fontWeight: '600',
  },
  serviceDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#666666',
    lineHeight: 14,
    marginBottom: 2,
  },
  serviceRate: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  bankInfoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  bankInfoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  bankInfoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
    textAlign: 'center',
  },
});
