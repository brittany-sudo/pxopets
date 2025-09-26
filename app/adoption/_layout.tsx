import React from 'react';
import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';

export default function AdoptionLayout() {
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
            header: () => <AppHeader />,
            title: 'Create Pet'
          }} 
        />
        <Stack.Screen 
          name="pound" 
          options={{ 
            header: () => <AppHeader />,
            title: 'The Pound'
          }} 
        />
      </Stack>
      <BottomNavigation />
    </>
  );
}
