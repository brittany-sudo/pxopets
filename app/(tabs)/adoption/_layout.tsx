import React from 'react';
import { Stack } from 'expo-router';

export default function AdoptionLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Adoption Center'
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="pound" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}
