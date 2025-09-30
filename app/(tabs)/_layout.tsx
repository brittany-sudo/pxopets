import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FONT_SIZES, SPACING, ICON_SIZES } from '@/constants/Styles';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return <FontAwesome size={ICON_SIZES.md} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#666666' : '#999999',
        tabBarLabelStyle: { 
          fontFamily: 'Silkscreen_400Regular', 
          fontSize: 9, 
          fontWeight: '500',
          marginTop: 2,
          marginBottom: 0,
          color: colorScheme === 'dark' ? '#ffffff' : '#000000',
        },
        tabBarItemStyle: { 
          paddingVertical: 6,
          paddingHorizontal: 4,
        },
        tabBarStyle: {
          height: 90 + insets.bottom,
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#333333' : '#e5e5e5',
          borderTopWidth: 1,
          paddingTop: 12,
          paddingBottom: insets.bottom + 8,
          paddingHorizontal: 16,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'News',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="newspaper-o" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="map" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="gamepad" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="shopping-cart" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="heart" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mail"
        options={{
          title: 'Mail',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="envelope" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="simple-home"
        options={{
          href: null, // Hide from tab bar
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
      <Tabs.Screen
        name="starlight-roller-rink"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pxo-radio"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="post-office"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="makeout-hill"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="whale-watching"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="old-net-pub"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lowtide-pier"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="gossamer-midway"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="atomic-diner"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="neon-casino"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lucky-strike-speedway"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="midnight-rewind"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pxopet-supply"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="community-pool"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pxoburbs-mall"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="bayou-nocturne"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="midwinter-crossing"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lumen-bazaar"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lullaby-downs"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="frog-market-thrift"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lap-trainer"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pool-volleyball"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}