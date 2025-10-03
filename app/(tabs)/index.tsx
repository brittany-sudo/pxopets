import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import DeveloperPanel from '@/components/DeveloperPanel';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function NewsScreen() {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const newsArticles = [
    {
      id: 1,
      title: 'New Pet Companions Available!',
      summary: 'Flufftail Rabbit and Pebbleback Turtle have joined the adventure roster.',
      category: 'Pets',
      time: '2 hours ago',
      featured: true,
      icon: 'heart'
    },
    {
      id: 2,
      title: 'Autumn Harvest Festival Begins',
      summary: 'Stock up on apples and participate in seasonal challenges for exclusive rewards.',
      category: 'Events',
      time: '4 hours ago',
      featured: true,
      icon: 'calendar'
    },
    {
      id: 3,
      title: 'Golden Watering Can Spotted',
      summary: 'Rare item now available in shops with a chance to double your harvest.',
      category: 'Items',
      time: '6 hours ago',
      featured: false,
      icon: 'diamond'
    },
    {
      id: 4,
      title: 'Daily Guild Challenges Added',
      summary: 'Complete tasks together with your guild for bonus rewards and special items.',
      category: 'Features',
      time: '1 day ago',
      featured: false,
      icon: 'users'
    },
    {
      id: 5,
      title: 'Pixel Pet Parade This Weekend',
      summary: 'Show off your best pets in the community parade and win amazing prizes.',
      category: 'Events',
      time: '2 days ago',
      featured: false,
      icon: 'trophy'
    },
    {
      id: 6,
      title: 'Rainbow Carrot Discovery',
      summary: 'New rare food item gives pets an instant level-up when consumed.',
      category: 'Items',
      time: '3 days ago',
      featured: false,
      icon: 'star'
    }
  ];

  const dailyRiddle = {
    question: "What has a head, a tail, but no body?",
    answer: "A coin",
    reward: "50 tickets"
  };

  const lotteryNumbers = "12 • 19 • 04 • 07";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* News Header */}
        <RNView style={styles.headerContainer}>
          <Image
            source={require('@/assets/images/daily-news.png')}
            style={styles.headerImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>PXOPIA NEWS</Text>
          <Text style={styles.headerDate}>January 1, 1991</Text>
        </RNView>

        {/* Featured News Section */}
        <RNView style={styles.featuredContainer}>
          <Text style={styles.sectionTitle}>FEATURED NEWS</Text>
          <RNView style={styles.featuredList}>
            {newsArticles.filter(article => article.featured).map((article) => (
              <Pressable key={article.id} style={styles.featuredItem}>
                <RNView style={styles.articleHeader}>
                  <FontAwesome 
                    name={article.icon as any} 
                    size={20} 
                    color="#8b5cf6" 
                  />
                  <RNView style={styles.articleInfo}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleSummary}>{article.summary}</Text>
                    <Text style={styles.articleCategory}>{article.category}</Text>
                  </RNView>
                  <RNView style={styles.articleMeta}>
                    <Text style={styles.articleTime}>{article.time}</Text>
                    <RNView style={styles.featuredBadge}>
                      <Text style={styles.featuredBadgeText}>FEATURED</Text>
                    </RNView>
                  </RNView>
                </RNView>
              </Pressable>
            ))}
          </RNView>
        </RNView>

        {/* All News Section */}
        <RNView style={styles.newsContainer}>
          <Text style={styles.sectionTitle}>ALL NEWS</Text>
          <RNView style={styles.newsList}>
            {newsArticles.filter(article => !article.featured).map((article) => (
              <Pressable key={article.id} style={styles.newsItem}>
                <RNView style={styles.articleHeader}>
                  <FontAwesome 
                    name={article.icon as any} 
                    size={16} 
                    color="#64748b" 
                  />
                  <RNView style={styles.articleInfo}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Text style={styles.articleSummary}>{article.summary}</Text>
                    <Text style={styles.articleCategory}>{article.category}</Text>
                  </RNView>
                  <RNView style={styles.articleMeta}>
                    <Text style={styles.articleTime}>{article.time}</Text>
                  </RNView>
                </RNView>
              </Pressable>
            ))}
          </RNView>
        </RNView>

        {/* Daily Riddle Section */}
        <RNView style={styles.riddleContainer}>
          <Text style={styles.sectionTitle}>DAILY RIDDLE</Text>
          <RNView style={styles.riddleItem}>
            <RNView style={styles.riddleHeader}>
              <FontAwesome name="question-circle" size={16} color="#8b5cf6" />
              <Text style={styles.riddleQuestion}>{dailyRiddle.question}</Text>
            </RNView>
            <RNView style={styles.riddleReward}>
              <FontAwesome name="ticket" size={14} color="#f59e0b" />
              <Text style={styles.riddleRewardText}>Reward: {dailyRiddle.reward}</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Lottery Section */}
        <RNView style={styles.lotteryContainer}>
          <Text style={styles.sectionTitle}>DAILY LOTTERY</Text>
          <RNView style={styles.lotteryItem}>
            <RNView style={styles.lotteryHeader}>
              <FontAwesome name="ticket" size={16} color="#ff1493" />
              <Text style={styles.lotteryNumbers}>{lotteryNumbers}</Text>
            </RNView>
            <Text style={styles.lotteryText}>Draw at midnight Pxopia time</Text>
          </RNView>
        </RNView>

        {/* Dev Panel Button */}
        <RNView style={styles.devPanelContainer}>
          <Pressable 
            style={styles.devPanelButton}
            onPress={() => setShowDevPanel(true)}
          >
            <FontAwesome name="cog" size={16} color="#8b5cf6" />
            <Text style={styles.devPanelText}>DEV PANEL</Text>
          </Pressable>
        </RNView>
      </ScrollView>

      {/* Dev Panel Modal */}
      <DeveloperPanel 
        visible={showDevPanel} 
        onClose={() => setShowDevPanel(false)} 
      />
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
  headerContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  headerImage: {
    width: '60%',
    height: 80,
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDate: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  featuredContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  riddleContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lotteryContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuredList: {
    width: '100%',
    gap: 8,
  },
  newsList: {
    width: '100%',
    gap: 8,
  },
  featuredItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  newsItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  articleSummary: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
    lineHeight: 14,
  },
  articleCategory: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  articleMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  articleTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    opacity: 0.7,
  },
  featuredBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  featuredBadgeText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 7,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  riddleItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  riddleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  riddleQuestion: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#0f172a',
    fontWeight: 'bold',
    flex: 1,
  },
  riddleReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riddleRewardText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  lotteryItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  lotteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  lotteryNumbers: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#ff1493',
    fontWeight: 'bold',
  },
  lotteryText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
    opacity: 0.7,
  },
  // Dev Panel Styles
  devPanelContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  devPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    gap: 8,
  },
  devPanelText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
  },
});
