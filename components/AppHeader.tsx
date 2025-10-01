import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, usePathname, router } from 'expo-router';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS, ICON_SIZES, SHADOWS } from '@/constants/Styles';
import { useSimpleGame } from '@/store/SimpleGameStore';

export default function AppHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const { state } = useSimpleGame();
  
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
    router.replace(router.pathname);
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff' }]}> 
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <Pressable 
          style={styles.iconButton}
          onPress={() => router.push('/more')}
        >
          <FontAwesome name="bars" size={20} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
        </Pressable>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/pxopets-logo-2.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Pressable 
          style={styles.iconButton}
          onPress={handleRefresh}
        >
          <FontAwesome name="refresh" size={20} color={colorScheme === 'dark' ? '#ffffff' : '#000000'} />
        </Pressable>
      </View>
      
      {/* Stylized divider under logo and buttons */}
      <View style={[styles.divider, { backgroundColor: colorScheme === 'dark' ? '#333333' : '#e5e5e5' }]} />
      
      {/* User Info and Currency Bar */}
      <View style={styles.userBar}>
        <View style={styles.leftSection}>
          <Text style={[styles.greeting, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
            Hello, PxopetMaster
          </Text>
          <View style={styles.weatherContainer}>
            <FontAwesome name={weatherIcon as any} size={14} color={weatherColor} />
            <Text style={[styles.temperatureText, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
              {temperature}°
            </Text>
          </View>
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
            <FontAwesome name="diamond" size={16} color="#0ea5e9" />
            <Text style={[styles.currencyText, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
              {state.coins}
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
    paddingHorizontal: 20,
    paddingVertical: 0, // No vertical padding
    paddingTop: 0, // No top padding
    marginTop: -10, // Reduced negative margin
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 100,
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8, // Increased for more breathing room
    paddingTop: 12, // Extra top padding
    paddingBottom: 12, // Extra bottom padding
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Increased from 16 for more spacing
    flex: 1,
  },
  greeting: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
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
    gap: 20, // Increased from 16 for more spacing
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 0,
    marginVertical: 4, // Reduced from 8
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});