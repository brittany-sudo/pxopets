import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function StocksScreen() {
  const [portfolio, setPortfolio] = useState<Set<string>>(new Set());

  const handleStockPress = (stock: any) => {
    Alert.alert(
      stock.name,
      `Current Price: ${stock.price} 🎫\nChange: ${stock.change}%\nVolume: ${stock.volume.toLocaleString()}\n\n${stock.description}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: portfolio.has(stock.id) ? "Sell" : "Buy", onPress: () => {
          setPortfolio(prev => {
            const newPortfolio = new Set(prev);
            if (newPortfolio.has(stock.id)) {
              newPortfolio.delete(stock.id);
              Alert.alert("Stock Sold!", `You sold ${stock.name} for ${stock.price} tickets!`);
            } else {
              newPortfolio.add(stock.id);
              Alert.alert("Stock Purchased!", `You bought ${stock.name} for ${stock.price} tickets!`);
            }
            return newPortfolio;
          });
        }}
      ]
    );
  };

  const stocks = [
    {
      id: 'carrot-corp',
      name: 'Carrot Corp',
      symbol: 'CRRT',
      price: 45,
      change: 15.2,
      volume: 1250000,
      description: 'Leading producer of premium carrots and root vegetables.',
      icon: 'carrot',
      category: 'Agriculture'
    },
    {
      id: 'wheat-works',
      name: 'Wheat Works',
      symbol: 'WHTW',
      price: 32,
      change: -8.5,
      volume: 890000,
      description: 'Global wheat and grain processing company.',
      icon: 'leaf',
      category: 'Agriculture'
    },
    {
      id: 'tech-tomato',
      name: 'Tech Tomato',
      symbol: 'TMTM',
      price: 78,
      change: 22.1,
      volume: 2100000,
      description: 'Innovative tomato farming with AI-powered growth systems.',
      icon: 'microchip',
      category: 'Technology'
    },
    {
      id: 'lettuce-labs',
      name: 'Lettuce Labs',
      symbol: 'LTLB',
      price: 28,
      change: -5.3,
      volume: 650000,
      description: 'Sustainable lettuce production and distribution.',
      icon: 'pagelines',
      category: 'Agriculture'
    },
    {
      id: 'potato-power',
      name: 'Potato Power',
      symbol: 'PTPW',
      price: 41,
      change: 12.7,
      volume: 980000,
      description: 'Energy-efficient potato farming and processing.',
      icon: 'bolt',
      category: 'Energy'
    },
    {
      id: 'onion-optics',
      name: 'Onion Optics',
      symbol: 'ONOP',
      price: 35,
      change: 7.4,
      volume: 720000,
      description: 'Advanced onion cultivation with precision optics.',
      icon: 'eye',
      category: 'Technology'
    },
    {
      id: 'bean-bank',
      name: 'Bean Bank',
      symbol: 'BNBK',
      price: 29,
      change: -2.1,
      volume: 540000,
      description: 'Financial services for the legume industry.',
      icon: 'bank',
      category: 'Finance'
    },
    {
      id: 'corn-crypto',
      name: 'Corn Crypto',
      symbol: 'CRNC',
      price: 67,
      change: 18.9,
      volume: 1800000,
      description: 'Blockchain-based corn trading platform.',
      icon: 'bitcoin',
      category: 'Technology'
    }
  ];

  const portfolioValue = Array.from(portfolio).reduce((total, stockId) => {
    const stock = stocks.find(s => s.id === stockId);
    return total + (stock ? stock.price : 0);
  }, 0);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Row */}
        <RNView style={styles.headerRow}>
          <Text style={styles.locationTitle}>PXOPIA STOCK MARKET</Text>
        </RNView>

        {/* Portfolio Summary */}
        <RNView style={styles.portfolioContainer}>
          <Text style={styles.portfolioLabel}>Your Portfolio</Text>
          <Text style={styles.portfolioValue}>{portfolioValue.toLocaleString()} 🎫</Text>
          <Text style={styles.portfolioCount}>{portfolio.size} stocks owned</Text>
        </RNView>

        {/* Market Overview */}
        <RNView style={styles.marketContainer}>
          <Text style={styles.sectionTitle}>MARKET OVERVIEW</Text>
          <RNView style={styles.marketStats}>
            <RNView style={styles.statItem}>
              <FontAwesome name="line-chart" size={20} color="#8b5cf6" />
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>2.4B 🎫</Text>
            </RNView>
            <RNView style={styles.statItem}>
              <FontAwesome name="trending-up" size={20} color="#10b981" />
              <Text style={styles.statLabel}>Gainers</Text>
              <Text style={styles.statValue}>5 stocks</Text>
            </RNView>
            <RNView style={styles.statItem}>
              <FontAwesome name="trending-down" size={20} color="#ef4444" />
              <Text style={styles.statLabel}>Losers</Text>
              <Text style={styles.statValue}>3 stocks</Text>
            </RNView>
          </RNView>
        </RNView>

        {/* Stocks List */}
        <RNView style={styles.stocksContainer}>
          <Text style={styles.sectionTitle}>AVAILABLE STOCKS</Text>
          <RNView style={styles.stocksList}>
            {stocks.map((stock) => (
              <Pressable
                key={stock.id}
                style={styles.stockItem}
                onPress={() => handleStockPress(stock)}
              >
                <RNView style={styles.stockHeader}>
                  <FontAwesome 
                    name={stock.icon as any} 
                    size={20} 
                    color={stock.change >= 0 ? "#10b981" : "#ef4444"} 
                  />
                  <RNView style={styles.stockInfo}>
                    <Text style={styles.stockName}>{stock.name}</Text>
                    <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                    <Text style={styles.stockCategory}>{stock.category}</Text>
                  </RNView>
                  <RNView style={styles.stockPrice}>
                    <Text style={styles.stockPriceValue}>{stock.price} 🎫</Text>
                    <Text style={[
                      styles.stockChange,
                      { color: stock.change >= 0 ? "#10b981" : "#ef4444" }
                    ]}>
                      {stock.change >= 0 ? "+" : ""}{stock.change}%
                    </Text>
                    <Text style={styles.stockVolume}>Vol: {stock.volume.toLocaleString()}</Text>
                  </RNView>
                </RNView>
                <Text style={styles.stockDescription}>{stock.description}</Text>
                {portfolio.has(stock.id) && (
                  <RNView style={styles.ownedBadge}>
                    <FontAwesome name="check" size={12} color="#ffffff" />
                    <Text style={styles.ownedText}>OWNED</Text>
                  </RNView>
                )}
              </Pressable>
            ))}
          </RNView>
        </RNView>

        {/* Market Info */}
        <RNView style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Pxopia Stock Market</Text>
          <Text style={styles.infoText}>
            Trade stocks from Pxopia's leading agricultural and technology companies. 
            Prices update in real-time based on market conditions and company performance. 
            Build your portfolio and watch your investments grow!
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
    paddingHorizontal: 40,
    height: 40,
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
  portfolioContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  portfolioLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  portfolioValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 24,
    color: '#1a1a1a',
    fontWeight: '700',
    marginBottom: 4,
  },
  portfolioCount: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  marketContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 16,
    textAlign: 'center',
  },
  marketStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  stocksContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stocksList: {
    width: '100%',
    gap: 12,
  },
  stockItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    position: 'relative',
  },
  stockHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  stockSymbol: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stockCategory: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  stockPriceValue: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stockChange: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  stockVolume: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 9,
    color: '#64748b',
  },
  stockDescription: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
  },
  ownedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  ownedText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  infoTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 13,
    color: '#1a1a1a',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
    textAlign: 'center',
  },
});
