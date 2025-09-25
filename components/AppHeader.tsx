import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, usePathname } from 'expo-router';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function AppHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const bg = Colors[colorScheme].tabBarBackground;
  const border = Colors[colorScheme].tabBarBorder;

  const pathname = usePathname();
  const isHome = pathname === '/(tabs)/home' || pathname === '/home';
  const iconColor = isHome ? Colors[colorScheme].tabActive : Colors[colorScheme].tabBarBorder;

  return (
    <View style={[styles.container, { backgroundColor: bg, borderBottomColor: border }]}> 
      <View style={styles.left} />
      <Text style={styles.logo}>pxopets</Text>
      <View style={styles.right}>
        <Link href="/(tabs)/home">
          <FontAwesome name="home" size={22} color={iconColor} />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logo: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#0f0f2a', // Darker navy
    letterSpacing: 1,
  },
  left: { position: 'absolute', left: 12 },
  right: { position: 'absolute', right: 12 },
});


