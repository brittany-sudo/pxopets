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
  return <FontAwesome size={26} style={{ marginBottom: 2, marginTop: -4 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#8b5cf6' : '#8b5cf6',
        tabBarInactiveTintColor: colorScheme === 'dark' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
        tabBarLabelStyle: { 
          fontFamily: 'Silkscreen_400Regular', 
          fontSize: 8, // Bigger font for better readability
          fontWeight: '500',
          marginTop: 2, // Reduced space from icons
          marginBottom: 0,
          color: colorScheme === 'dark' ? '#ffffff' : '#000000',
          letterSpacing: 0, // No negative kerning to prevent clipping
          textAlign: 'center',
        },
        tabBarItemStyle: { 
          paddingVertical: 6, // Reduced vertical padding
          paddingHorizontal: 1, // Minimal horizontal padding for maximum text space
          justifyContent: 'center', // Center content
          alignItems: 'center', // Center alignment
          flex: 1, // Equal distribution - let flex handle the width
          minWidth: 0, // Allow text to wrap/truncate properly
        },
        tabBarStyle: {
          height: 85 + insets.bottom, // Reduced height since icons are smaller
          backgroundColor: '#1a120d', // Always use dark background
          borderTopColor: '#333333',
          borderTopWidth: 1,
          paddingTop: 8, // Reduced top padding
          paddingBottom: insets.bottom + 6, // Reduced bottom padding
          paddingHorizontal: 0, // No horizontal padding for maximum tab space
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
          title: 'Map',
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
        name="mail"
        options={{
          title: 'Mail',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="envelope" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pets"
        options={{
          title: 'Pets',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="paw" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          href: null, // Hide from tab bar
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
        name="moonbeam-motel"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="moonbeam-motel-room"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="moonbeam-motel-room-interior"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="broken-vending-machine"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="neon-rooftop-lounge"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="dailies"
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
        name="starlight-glide"
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
      <Tabs.Screen
        name="trappers-shack"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lighthouse-keeper"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="treading-fields"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="silver-crust"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="radio-circuit"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="retro-threads"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pixel-pages"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="the-lost-and-found"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pxoburbs-spa"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="pixel-playground"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="food-court"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="twilight-teahouse"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="bank"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="stocks"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="nursery"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="cosmic-drive-in"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="lone-airstream"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="neon-slot-machines"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="the-old-winery"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="the-ivy-post"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="cellar-keeper"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}