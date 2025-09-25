import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import { Link } from 'expo-router';

export default function AdoptionHub() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adoption Center</Text>
      <RNView style={{ height: 12 }} />
      <Link href="/adoption/create" asChild>
        <View><PixelButton title="Create a new pet" onPress={() => {}} width={260} /></View>
      </Link>
      <RNView style={{ height: 8 }} />
      <Link href="/adoption/pound" asChild>
        <View><PixelButton title="Visit the Pound" onPress={() => {}} width={260} /></View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#1a1a3a',
    marginTop: 8,
    marginBottom: 16 
  },
});


