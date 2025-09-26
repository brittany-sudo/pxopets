import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { usePathname } from 'expo-router';
import { FONT_SIZES, SPACING, ICON_SIZES } from '@/constants/Styles';

// Custom TabBarIcon for better spacing
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={ICON_SIZES.sm} style={{ marginBottom: 6 }} {...props} />;
}

export default function BottomNavigation() {
  const colorScheme = useColorScheme() ?? 'light';
  const pathname = usePathname();
  
  const bg = Colors[colorScheme].tabBarBackground;
  const border = Colors[colorScheme].tabBarBorder;
  const activeColor = Colors[colorScheme].tabActive;
  const inactiveColor = 'rgba(139, 92, 246, 0.8)'; // Match exactly

  const tabs = [
    { name: 'News', route: '/(tabs)', icon: 'newspaper-o' },
    { name: 'Explore', route: '/(tabs)/explore', icon: 'map' },
    { name: 'Games', route: '/(tabs)/games', icon: 'gamepad' },
    { name: 'Shop', route: '/(tabs)/shop', icon: 'shopping-bag' },
    { name: 'Pets', route: '/(tabs)/pets', icon: 'heart' }, // Match the main tabs icon
    { name: 'Mail', route: '/(tabs)/mail', icon: 'envelope' },
  ];

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: bg, borderTopColor: border }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route || 
          (tab.route === '/(tabs)' && pathname === '/(tabs)/index') ||
          (tab.route === '/(tabs)' && pathname === '/(tabs)');
        
        return (
          <Pressable
            key={tab.name}
            style={styles.tab}
            onPress={() => handleTabPress(tab.route)}
          >
            <TabBarIcon 
              name={tab.icon as any} 
              color={isActive ? activeColor : inactiveColor} 
            />
            <Text style={[
              styles.tabLabel, 
              { color: isActive ? activeColor : inactiveColor }
            ]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80, // Increase height for better spacing
    borderTopWidth: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginHorizontal: 2,
    gap: 4, // Increase gap between icon and text
  },
  tabLabel: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: FONT_SIZES.xs, // Match exactly
    paddingBottom: 2, // Match exactly
    textAlign: 'center',
  },
});
