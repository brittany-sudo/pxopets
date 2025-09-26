import React from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MailScreen() {
  const inboxLetters = [
    {
      id: 1,
      from: 'Captain Puffington',
      subject: 'Welcome to Pxopets!',
      preview: 'Ahoy there, new adventurer! Welcome to our pixelated paradise...',
      time: '2 hours ago',
      unread: true,
      icon: 'envelope'
    },
    {
      id: 2,
      from: 'Professor Whiskers',
      subject: 'Daily Research Report',
      preview: 'My latest findings on the mysterious crystals in Mystic Mountains...',
      time: '4 hours ago',
      unread: true,
      icon: 'flask'
    },
    {
      id: 3,
      from: 'Luna the Moon Cat',
      subject: 'Midnight Adventure Invite',
      preview: 'The stars are calling! Join me for a secret exploration tonight...',
      time: '6 hours ago',
      unread: false,
      icon: 'moon-o'
    },
    {
      id: 4,
      from: 'Baron Von Pixels',
      subject: 'Estate Sale Notice',
      preview: 'Rare items from my collection are now available at the shop...',
      time: '1 day ago',
      unread: false,
      icon: 'diamond'
    },
    {
      id: 5,
      from: 'Chef Spatula',
      subject: 'New Recipe Discovered!',
      preview: 'I\'ve created the most delicious pixelated cake recipe ever...',
      time: '2 days ago',
      unread: false,
      icon: 'cutlery'
    },
    {
      id: 6,
      from: 'Mystic Sage',
      subject: 'Ancient Prophecy Update',
      preview: 'The crystal orbs have revealed new information about...',
      time: '3 days ago',
      unread: false,
      icon: 'magic'
    }
  ];

  const activeTrades = [
    {
      id: 1,
      item: 'Golden Watering Can',
      offer: '50 Gems + 3 Rare Seeds',
      trader: 'GardenMaster99',
      timeLeft: '2h 15m',
      status: 'pending'
    },
    {
      id: 2,
      item: 'Mystic Crystal Shard',
      offer: 'Ancient Scroll + 25 Gems',
      trader: 'CrystalHunter',
      timeLeft: '5h 42m',
      status: 'pending'
    },
    {
      id: 3,
      item: 'Pixel Art Frame',
      offer: '100 Coins + 2 Paint Brushes',
      trader: 'ArtLover42',
      timeLeft: '1d 3h',
      status: 'accepted'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Inbox Section */}
        <BorderedBox>
          <JazzyTitle style={styles.sectionTitle}>INBOX</JazzyTitle>
          <RNView style={styles.inboxList}>
            {inboxLetters.map((letter) => (
              <Pressable key={letter.id} style={styles.letterItem}>
                <RNView style={styles.letterHeader}>
                  <FontAwesome 
                    name={letter.icon as any} 
                    size={16} 
                    color={letter.unread ? '#0ea5e9' : '#64748b'} 
                  />
                  <RNView style={styles.letterInfo}>
                    <Text style={[
                      styles.letterFrom,
                      letter.unread && styles.unreadText
                    ]}>
                      {letter.from}
                    </Text>
                    <Text style={[
                      styles.letterSubject,
                      letter.unread && styles.unreadText
                    ]}>
                      {letter.subject}
                    </Text>
                    <Text style={styles.letterPreview}>
                      {letter.preview}
                    </Text>
                  </RNView>
                  <RNView style={styles.letterMeta}>
                    <Text style={styles.letterTime}>{letter.time}</Text>
                    {letter.unread && <RNView style={styles.unreadDot} />}
                  </RNView>
                </RNView>
              </Pressable>
            ))}
          </RNView>
        </BorderedBox>

        {/* Active Trades Section */}
        <BorderedBox>
          <JazzyTitle style={styles.sectionTitle}>ACTIVE TRADES</JazzyTitle>
          <RNView style={styles.tradesList}>
            {activeTrades.map((trade) => (
              <Pressable key={trade.id} style={styles.tradeItem}>
                <RNView style={styles.tradeHeader}>
                  <Text style={styles.tradeItemName}>{trade.item}</Text>
                  <Text style={[
                    styles.tradeStatus,
                    trade.status === 'accepted' && styles.acceptedStatus
                  ]}>
                    {trade.status.toUpperCase()}
                  </Text>
                </RNView>
                <Text style={styles.tradeOffer}>Offering: {trade.offer}</Text>
                <Text style={styles.tradeTrader}>Trader: {trade.trader}</Text>
                <Text style={styles.tradeTime}>Time Left: {trade.timeLeft}</Text>
              </Pressable>
            ))}
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
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'left',
  },
  inboxList: {
    width: '100%',
    gap: 8,
  },
  letterItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(14, 165, 233, 0.2)',
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  letterInfo: {
    flex: 1,
  },
  letterFrom: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 2,
  },
  letterSubject: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  letterPreview: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    opacity: 0.8,
  },
  letterMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  letterTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    opacity: 0.7,
  },
  unreadText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0ea5e9',
  },
  tradesList: {
    width: '100%',
    gap: 12,
  },
  tradeItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderRadius: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeItemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tradeStatus: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  acceptedStatus: {
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  tradeOffer: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 4,
  },
  tradeTrader: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  tradeTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    opacity: 0.7,
  },
});
