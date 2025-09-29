import React from 'react';
import { StyleSheet, View, Pressable, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, usePathname, router } from 'expo-router';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { SPACING, FONT_SIZES, BORDER_RADIUS, ICON_SIZES, SHADOWS } from '@/constants/Styles';
import { useGame } from '@/store/GameStore';

export default function AppHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const bg = Colors[colorScheme].tabBarBackground;
  const border = Colors[colorScheme].tabBarBorder;
  const { state } = useGame();
  
  // Dynamic temperature and weather with random weather symbols and colors
  const getCurrentWeather = () => {
    const hour = new Date().getHours();
    
    // Temperature varies throughout the day: cooler at night, warmer during day
    let temp;
    if (hour >= 6 && hour < 12) {
      temp = 72 + Math.floor(Math.random() * 6); // Morning: 72-77°F
    } else if (hour >= 12 && hour < 18) {
      temp = 78 + Math.floor(Math.random() * 8); // Afternoon: 78-85°F
    } else if (hour >= 18 && hour < 22) {
      temp = 74 + Math.floor(Math.random() * 6); // Evening: 74-79°F
    } else {
      temp = 68 + Math.floor(Math.random() * 6); // Night: 68-73°F
    }
    
    // Random weather symbols with corresponding colors
    const weatherOptions = [
      { icon: 'sun-o', color: '#f59e0b' }, // Yellow for sun
      { icon: 'cloud', color: '#6b7280' }, // Gray for cloud
      { icon: 'cloud-sun-o', color: '#fbbf24' }, // Light yellow for partly cloudy
      { icon: 'tint', color: '#3b82f6' }, // Blue for rain
      { icon: 'flash', color: '#ef4444' }, // Red for lightning
      { icon: 'snowflake-o', color: '#3b82f6' }, // Blue for snow
      { icon: 'moon-o', color: '#8b5cf6' }, // Purple for moon
      { icon: 'star', color: '#fbbf24' }, // Gold for star
      { icon: 'heart', color: '#ec4899' }, // Pink for heart
      { icon: 'leaf', color: '#10b981' } // Green for leaf
    ];
    
    const weather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    
    return { temp, weatherIcon: weather.icon, weatherColor: weather.color };
  };
  
  const { temp: temperature, weatherIcon, weatherColor } = getCurrentWeather();

          const pathname = usePathname();
          const isHome = pathname === '/(tabs)/home' || pathname === '/home';
          const iconColor = isHome ? '#8b5cf6' : '#8b5cf6'; // Always purple with full opacity

  const handleRefresh = () => {
    router.replace(router.pathname);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, borderBottomColor: border }]}> 
      <View style={styles.left}>
        <Pressable 
          style={[styles.iconButton, { borderColor: border }]}
          onPress={() => router.push('/more')}
        >
          <FontAwesome name="bars" size={24} color={iconColor} />
        </Pressable>
      </View>
      <Image 
        source={require('@/assets/images/pxopets-logo-2.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.right}>
        <Pressable 
          style={[styles.iconButton, { borderColor: border }]}
          onPress={handleRefresh}
        >
          <FontAwesome name="refresh" size={24} color={iconColor} />
        </Pressable>
      </View>
      
      {/* Subtle line with drop shadow */}
      <View style={[styles.divider, { backgroundColor: border }]} />
      
              {/* User greeting and coins */}
              <View style={styles.userBar}>
                <View style={styles.leftSection}>
                  <Text style={styles.greeting}>Hello, PxopetMaster!</Text>
                  <Pressable 
                    style={styles.mailContainer}
                    onPress={() => router.push('/(tabs)/mail')}
                  >
                    <FontAwesome name="envelope" size={16} color="#06b6d4" />
                    {state.coins > 0 && ( // Using coins as a placeholder for mail count - you can change this logic
                      <View style={styles.mailDot} />
                    )}
                  </Pressable>
                  <View style={styles.temperatureContainer}>
                    <FontAwesome name={weatherIcon as any} size={14} color={weatherColor} />
                    <Text style={styles.temperatureText}>{temperature}°F</Text>
                  </View>
                </View>
                <View style={styles.currencyContainer}>
                  <View style={styles.coinsContainer}>
                    <FontAwesome name="bolt" size={16} color="#f59e0b" />
                    <Text style={styles.coinsText}>{state.coins}</Text>
                  </View>
                  <View style={styles.ticketsContainer}>
                    <FontAwesome name="ticket" size={16} color="#8b5cf6" />
                    <Text style={styles.ticketsText}>0</Text>
                  </View>
                </View>
              </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140, // Increased to accommodate new elements
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  logo: {
    width: 220, // Made smaller
    height: 110, // Made smaller
    marginTop: -10, // Moved down
  },
  left: { 
    position: 'absolute', 
    left: 12,
    top: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: { 
    position: 'absolute', 
    right: 12,
    top: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.xl, // Slightly curved corners
    borderWidth: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: SHADOWS.halftone.boxShadow,
    elevation: 4, // Android shadow
  },
  divider: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    height: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBar: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 24,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  greeting: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: FONT_SIZES.sm,
    color: '#0f172a', // Premium deep slate
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  temperatureText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  mailContainer: {
    position: 'relative',
    padding: 4,
    borderRadius: 4,
  },
  mailDot: {
    position: 'absolute',
    top: 3,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2.5,
    elevation: 4,
    zIndex: 1,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: FONT_SIZES.sm,
    color: '#f59e0b', // Amber to match lightning bolt
    fontWeight: 'bold',
  },
  ticketsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketsText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: FONT_SIZES.sm,
    color: '#8b5cf6', // Purple to match ticket icon
    fontWeight: 'bold',
  },
});


