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

          const pathname = usePathname();
          const isHome = pathname === '/(tabs)/home' || pathname === '/home';
          const iconColor = isHome ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.8)'; // Always purple with 80% opacity

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
        source={require('@/assets/images/pxopets-logo.png')} 
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
                  <Text style={styles.greeting}>Hello, [user]!</Text>
                  <View style={styles.mailContainer}>
                    <FontAwesome name="envelope" size={16} color="#f59e0b" />
                    <Text style={styles.mailText}>[3]</Text>
                  </View>
                </View>
                <View style={styles.currencyContainer}>
                  <View style={styles.coinsContainer}>
                    <FontAwesome name="bolt" size={16} color="#f59e0b" />
                    <Text style={styles.coinsText}>{state.coins}</Text>
                  </View>
                  <View style={styles.ticketsContainer}>
                    <FontAwesome name="ticket" size={16} color="#0ea5e9" />
                    <Text style={styles.ticketsText}>0</Text>
                  </View>
                  <Pressable 
                    style={styles.shopButton}
                    onPress={() => router.push('/(tabs)/shop')}
                  >
                    <FontAwesome name="shopping-bag" size={16} color="#0ea5e9" />
                  </Pressable>
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
    width: 240, // 200% bigger (120 * 2)
    height: 120, // Made taller
    marginTop: -15, // A half smidge higher
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
  mailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mailText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: FONT_SIZES.sm,
    color: '#f59e0b', // Amber/orange to match the envelope icon
    fontWeight: 'bold',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  shopButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderWidth: 1,
    borderColor: '#0ea5e9',
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
    color: '#0f172a', // Premium deep slate
    fontWeight: 'bold',
  },
});


