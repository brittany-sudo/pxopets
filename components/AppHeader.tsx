import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Image, Animated } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, usePathname, router } from 'expo-router';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS, ICON_SIZES, SHADOWS } from '@/constants/Styles';
import { useSimpleGame } from '@/store/SimpleGameStore';
import { usePets } from '@/store/PetStore';

export default function AppHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const { state } = useSimpleGame();
  const { checkAndAddDailyStamina } = usePets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshRotation = useRef(new Animated.Value(0)).current;
  
  // Check and add daily stamina when component mounts or when route changes
  useEffect(() => {
    checkAndAddDailyStamina();
  }, []);
  
  // Weather that changes 2-3 times per day based on time periods
  const getCurrentWeather = () => {
    const hour = new Date().getHours();
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Use day of year as seed for consistent weather per day
    const weatherSeed = (dayOfYear * 7) % 100; // Changes every ~14 days
    
    // Temperature varies realistically throughout the day
    let temp;
    if (hour >= 6 && hour < 12) {
      temp = 72 + (weatherSeed % 6); // Morning: 72-77°F
    } else if (hour >= 12 && hour < 18) {
      temp = 78 + (weatherSeed % 8); // Afternoon: 78-85°F
    } else if (hour >= 18 && hour < 22) {
      temp = 74 + (weatherSeed % 6); // Evening: 74-79°F
    } else {
      temp = 68 + (weatherSeed % 6); // Night: 68-73°F
    }
    
    // Weather changes 2-3 times per day based on time periods
    let weatherIcon, weatherColor;
    if (hour >= 6 && hour < 12) {
      // Morning: usually sunny or partly cloudy
      if (weatherSeed < 30) {
        weatherIcon = 'cloud-sun-o';
        weatherColor = '#fbbf24';
      } else {
        weatherIcon = 'sun-o';
        weatherColor = '#f59e0b';
      }
    } else if (hour >= 12 && hour < 18) {
      // Afternoon: sunny or occasional clouds
      if (weatherSeed < 20) {
        weatherIcon = 'cloud';
        weatherColor = '#6b7280';
      } else {
        weatherIcon = 'sun-o';
        weatherColor = '#f59e0b';
      }
    } else if (hour >= 18 && hour < 22) {
      // Evening: sunset colors
      weatherIcon = 'sun-o';
      weatherColor = '#f97316';
    } else {
      // Night: moon or stars
      if (weatherSeed < 50) {
        weatherIcon = 'moon-o';
        weatherColor = '#8b5cf6';
      } else {
        weatherIcon = 'star';
        weatherColor = '#fbbf24';
      }
    }
    
    return { temp, weatherIcon, weatherColor };
  };
  
  const { temp: temperature, weatherIcon, weatherColor } = getCurrentWeather();

  const pathname = usePathname();
  const isHome = pathname === '/(tabs)/home' || pathname === '/home';

  const handleRefresh = () => {
    // Start rotation animation
    setIsRefreshing(true);
    refreshRotation.setValue(0);
    
    Animated.timing(refreshRotation, {
      toValue: 1,
      duration: 900, // Slower rotation (was 600ms)
      useNativeDriver: true,
    }).start(() => {
      setIsRefreshing(false);
    });

    // Simple refresh by navigating to the current path
    try {
      const currentPath = pathname || '/(tabs)/index';
      router.replace(currentPath);
    } catch (error) {
      console.log('Refresh error:', error);
      // Fallback to home if there's an issue
      router.replace('/(tabs)/index');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff' }]}> 
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed
          ]}
          onPress={() => router.push('/more')}
        >
          <FontAwesome name="bars" size={20} color={colorScheme === 'dark' ? '#ffffff' : '#6b46c1'} />
        </Pressable>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/pxopets-nav-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Pressable 
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed
          ]}
          onPress={handleRefresh}
        >
          <Animated.View style={{
            transform: [{
              rotate: refreshRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })
            }]
          }}>
            <FontAwesome name="refresh" size={20} color={colorScheme === 'dark' ? '#ffffff' : '#6b46c1'} />
          </Animated.View>
        </Pressable>
      </View>
      
      {/* Stylized divider under logo and buttons */}
      <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#333333' : '#e5e5e5' }]} />
      
      {/* User Info and Currency Bar */}
      <View style={styles.userBar}>
        <View style={styles.leftSection}>
          <Text style={[styles.greeting, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
            Hello, Pxopete
          </Text>
        </View>
        
        <View style={styles.currencyContainer}>
          <View style={styles.currencyItem}>
            <FontAwesome name="bolt" size={16} color="#f59e0b" />
            <Text style={[styles.currencyText, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
              {state.stamina}
            </Text>
          </View>
          <View style={styles.currencyItem}>
            <FontAwesome name="ticket" size={16} color="#8b5cf6" />
            <Text style={[styles.currencyText, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
              {state.tickets}
            </Text>
          </View>
          <View style={styles.currencyItem}>
            <FontAwesome name="diamond" size={16} color="#06b6d4" />
            <Text style={[styles.currencyText, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
              {state.gems || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0, // No top padding
    paddingBottom: 0, // No bottom padding
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16, // iOS safe area padding
    paddingBottom: 8,
    minHeight: 70, // Consistent height
  },
  iconButton: {
    width: 44, // Smaller buttons (was 60)
    height: 44, // Smaller buttons (was 60)
    borderRadius: 22, // Adjusted for smaller size (was 30)
    backgroundColor: 'transparent',
    borderWidth: 1.5, // Slightly thinner border (was 2)
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconButtonPressed: {
    backgroundColor: 'rgba(107, 70, 193, 0.15)', // Transparent purple background
    borderColor: '#6b46c1', // Purple border when pressed
    transform: [{ scale: 0.95 }], // Slight scale down effect
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  logo: {
    width: 280,
    height: 100,
    marginTop: 16, // Better alignment with buttons
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 32, // Push it down closer to bottom
    paddingBottom: 16, // Less bottom padding
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Increased from 16 for more spacing
    flex: 1,
  },
  greeting: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: '500',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  temperatureText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    fontWeight: '500',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Reduced spacing between currency items
    marginLeft: 'auto', // Push to the right
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced from 6 for tighter spacing
  },
  currencyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
    marginVertical: -12, // Better spacing from logo
    marginTop: -16, // Closer to logo but not too tight
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});