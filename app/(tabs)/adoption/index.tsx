import React from 'react';
import { StyleSheet, View as RNView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
import { Link } from 'expo-router';

export default function AdoptionHub() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
          <Text style={styles.title}>ADOPTION CENTER</Text>
          <RNView style={{ height: 20 }} />
          <Link href="/(tabs)/adoption/create" asChild>
            <View><PixelButton title="Create a new pet" onPress={() => {}} width={260} /></View>
          </Link>
          <RNView style={{ height: 12 }} />
          <Link href="/(tabs)/adoption/pound" asChild>
            <View><PixelButton title="Visit the Pound" onPress={() => {}} width={260} /></View>
          </Link>
        </BorderedBox>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    flexGrow: 1,
  },
  title: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
});


