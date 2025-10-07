import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Image, Alert, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import DeveloperPanel from '@/components/DeveloperPanel';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { usePets } from '@/store/PetStore';

export default function NewsScreen() {
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [riddleAnswered, setRiddleAnswered] = useState(false);
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [riddleResult, setRiddleResult] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);
  const { addStaminaToPet, state: petState } = usePets();
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Get Pxopian Standard Time (PST) - a fictional time zone
  const getPxopianTime = () => {
    // Pxopian Standard Time is 3 hours ahead of UTC (like EST but fictional)
    const pxopianTime = new Date(currentTime.getTime() + (3 * 60 * 60 * 1000));
    
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    
    return pxopianTime.toLocaleTimeString('en-US', options);
  };
  
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
    options: [
      "A coin",
      "A snake", 
      "A fish",
      "A pencil"
    ],
    reward: "50 stamina"
  };

  const lotteryNumbers = "12 • 19 • 04 • 07";

  const handleRiddleSubmit = () => {
    if (!selectedAnswer) {
      setRiddleResult({ type: 'incorrect', message: 'Please select an answer before submitting!' });
      setShowRiddleModal(true);
      return;
    }

    if (selectedAnswer === dailyRiddle.answer) {
      // Correct answer - reward stamina to active pet
      const activePet = petState.adoptedPets.find(pet => pet.isActive);
      if (activePet) {
        const success = addStaminaToPet(activePet.id, 50);
        setRiddleResult({ 
          type: 'correct', 
          message: `You earned 50 stamina for ${activePet.name}!` 
        });
      } else {
        setRiddleResult({ 
          type: 'correct', 
          message: 'You earned 50 stamina! (No active pet to receive it)' 
        });
      }
      setRiddleAnswered(true);
    } else {
      setRiddleResult({ 
        type: 'incorrect', 
        message: `The correct answer was "${dailyRiddle.answer}". Try again tomorrow!` 
      });
    }
    setShowRiddleModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Second Top Navigation */}
      <RNView style={styles.secondNavContainer}>
        <Pressable style={styles.navButton} onPress={() => {}}>
          <FontAwesome name="bolt" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>BREAKING</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => {}}>
          <FontAwesome name="fire" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>TRENDING</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => {}}>
          <FontAwesome name="calendar" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>EVENTS</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => {}}>
          <FontAwesome name="archive" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>ARCHIVE</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => {}}>
          <FontAwesome name="cog" size={20} color="#8b5cf6" />
          <Text style={styles.navButtonText}>SETTINGS</Text>
        </Pressable>
      </RNView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* News Header */}
        <RNView style={styles.headerContainer}>
          <Text style={styles.headerTitle}>PXOPIA NEWS</Text>
          <Text style={styles.headerDate}>{getCurrentDate()}</Text>
          <Text style={styles.headerTime}>Pxopian Standard Time: {getPxopianTime()}</Text>
        </RNView>

        {/* Featured News Section */}
        <RNView style={styles.newsSectionContainer}>
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
        <RNView style={styles.newsSectionContainer}>
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
        <RNView style={styles.newsSectionContainer}>
          <Text style={styles.sectionTitle}>DAILY RIDDLE</Text>
          <RNView style={styles.riddleItem}>
            <RNView style={styles.riddleHeader}>
              <FontAwesome name="question-circle" size={16} color="#8b5cf6" />
              <Text style={styles.riddleQuestion}>{dailyRiddle.question}</Text>
            </RNView>
            <RNView style={styles.riddleReward}>
              <FontAwesome name="bolt" size={14} color="#f59e0b" />
              <Text style={styles.riddleRewardText}>Reward: {dailyRiddle.reward}</Text>
            </RNView>
            
            {!riddleAnswered ? (
              <>
                <RNView style={styles.riddleOptions}>
                  {dailyRiddle.options.map((option, index) => (
                    <Pressable
                      key={index}
                      style={[
                        styles.riddleOption,
                        selectedAnswer === option && styles.riddleOptionSelected
                      ]}
                      onPress={() => setSelectedAnswer(option)}
                    >
                      <Text style={[
                        styles.riddleOptionText,
                        selectedAnswer === option && styles.riddleOptionTextSelected
                      ]}>
                        {String.fromCharCode(65 + index)}. {option}
                      </Text>
                    </Pressable>
                  ))}
                </RNView>
                
                <Pressable 
                  style={[
                    styles.riddleSubmitButton,
                    !selectedAnswer && styles.riddleSubmitButtonDisabled
                  ]}
                  onPress={handleRiddleSubmit}
                  disabled={!selectedAnswer}
                >
                  <Text style={[
                    styles.riddleSubmitText,
                    !selectedAnswer && styles.riddleSubmitTextDisabled
                  ]}>
                    SUBMIT ANSWER
                  </Text>
                </Pressable>
              </>
            ) : (
              <RNView style={styles.riddleCompleted}>
                <FontAwesome name="check-circle" size={20} color="#10b981" />
                <Text style={styles.riddleCompletedText}>Riddle completed! Come back tomorrow for a new one.</Text>
              </RNView>
            )}
          </RNView>
        </RNView>

        {/* Lottery Section */}
        <RNView style={styles.newsSectionContainer}>
          <Text style={styles.sectionTitle}>DAILY LOTTERY</Text>
          <Text style={styles.lotteryDrawTime}>Draw at midnight Pxopia time</Text>
          <RNView style={styles.lotteryItem}>
            <RNView style={styles.lotteryNumbersContainer}>
              <RNView style={styles.lotteryBall}>
                <Text style={styles.lotteryNumber}>12</Text>
              </RNView>
              <RNView style={styles.lotteryBall}>
                <Text style={styles.lotteryNumber}>19</Text>
              </RNView>
              <RNView style={styles.lotteryBall}>
                <Text style={styles.lotteryNumber}>04</Text>
              </RNView>
              <RNView style={styles.lotteryBall}>
                <Text style={styles.lotteryNumber}>07</Text>
              </RNView>
              <RNView style={styles.lotteryBall}>
                <Text style={styles.lotteryNumber}>23</Text>
              </RNView>
            </RNView>
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

      {/* Riddle Result Modal */}
      <Modal
        visible={showRiddleModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRiddleModal(false)}
      >
        <RNView style={styles.modalOverlay}>
          <RNView style={styles.riddleModal}>
            <RNView style={styles.riddleModalHeader}>
              <FontAwesome 
                name={riddleResult?.type === 'correct' ? 'check-circle' : 'times-circle'} 
                size={24} 
                color={riddleResult?.type === 'correct' ? '#10b981' : '#ef4444'} 
              />
              <Text style={[
                styles.riddleModalTitle,
                { color: riddleResult?.type === 'correct' ? '#10b981' : '#ef4444' }
              ]}>
                {riddleResult?.type === 'correct' ? 'CORRECT!' : 'INCORRECT!'}
              </Text>
            </RNView>
            <Text style={styles.riddleModalMessage}>{riddleResult?.message}</Text>
            <Pressable 
              style={styles.riddleModalButton}
              onPress={() => setShowRiddleModal(false)}
            >
              <Text style={styles.riddleModalButtonText}>OK</Text>
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
  },
  secondNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 60,
    backgroundColor: 'transparent',
  },
  navButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  newsSectionContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: '#0f172a',
    marginBottom: 16,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 12,
    flexGrow: 1,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    marginBottom: 16,
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
    color: '#0f172a',
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headerDate: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  headerTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  newsItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#0f172a',
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
  riddleOptions: {
    marginTop: 12,
    gap: 6,
  },
  riddleOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  riddleOptionSelected: {
    backgroundColor: '#0f172a',
    borderWidth: 2,
  },
  riddleOptionText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  riddleOptionTextSelected: {
    color: '#ffffff',
  },
  riddleSubmitButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#0f172a',
    alignItems: 'center',
  },
  riddleSubmitButtonDisabled: {
    backgroundColor: '#e2e8f0',
    borderColor: '#e2e8f0',
  },
  riddleSubmitText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  riddleSubmitTextDisabled: {
    color: '#94a3b8',
  },
  riddleCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
    gap: 8,
  },
  riddleCompletedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  riddleModal: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: '#0f172a',
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  riddleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  riddleModalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  riddleModalMessage: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 14,
  },
  riddleModalButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  riddleModalButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  lotteryDrawTime: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#ff1493',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  lotteryItem: {
    padding: 8,
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
  lotteryNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  lotteryBall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  lotteryNumber: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
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
