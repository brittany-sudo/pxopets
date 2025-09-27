import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FONT_SIZES, SPACING, ICON_SIZES } from '@/constants/Styles';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={ICON_SIZES.md} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
              screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabActive,
                tabBarInactiveTintColor: 'rgba(139, 92, 246, 0.8)', // Purple with 80% opacity
        tabBarLabelStyle: { fontFamily: 'Silkscreen_400Regular', fontSize: FONT_SIZES.xs, paddingBottom: 0, marginTop: 6 },
        tabBarItemStyle: { 
          paddingVertical: SPACING.xs,
          marginHorizontal: 2,
        },
        tabBarStyle: {
          height: 90,
          backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
          borderTopColor: Colors[colorScheme ?? 'light'].tabBarBorder,
          borderTopWidth: 2,
          paddingTop: 8,
          paddingBottom: 8,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <TabBarIcon name="gamepad" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
              <Tabs.Screen
                name="mail"
                options={{
                  title: 'Mail',
                  tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
                }}
              />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      {/* Hidden pages - use built-in tab bar but don't show in tab bar */}
      <Tabs.Screen
        name="more"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pxoburbs"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="artisan-quarter"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="crescent-oasis"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="enchanted-island"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="foggy-harbor"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="barrelhaven"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="bag-of-stars-forest"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="saltwick-pier"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="scarecrow-vale"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      {/* Adoption pages - hidden from tab bar but accessible via navigation */}
      <Tabs.Screen
        name="adoption"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="quickstop"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="masquerade-hall"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
