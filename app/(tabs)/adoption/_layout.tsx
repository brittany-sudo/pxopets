import React from 'react';
import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { usePathname } from 'expo-router';

export default function AdoptionLayout() {
  const pathname = usePathname();
  
  // Only show bottom navigation on the main adoption index page
  const showBottomNav = pathname === '/adoption' || pathname === '/adoption/';
  
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            header: () => <AppHeader />,
            title: 'Adoption Center'
          }} 
        />
        <Stack.Screen 
          name="create" 
          options={{ 
            headerShown: false,
            title: 'Create Pet'
          }} 
        />
        <Stack.Screen 
          name="pound" 
          options={{ 
            headerShown: false,
            title: 'The Pound'
          }} 
        />
      </Stack>
      {showBottomNav && <BottomNavigation />}
    </>
  );
}
