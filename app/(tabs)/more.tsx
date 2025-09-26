import React from 'react';
import { StyleSheet, ScrollView, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
          <RNView style={styles.menuItem}>
            <FontAwesome name="cog" size={20} color="#0ea5e9" />
            <Text style={styles.menuText}>Settings</Text>
          </RNView>

          <RNView style={styles.menuItem}>
            <FontAwesome name="user" size={20} color="#0ea5e9" />
            <Text style={styles.menuText}>Profile</Text>
          </RNView>

          <RNView style={styles.menuItem}>
            <FontAwesome name="info-circle" size={20} color="#0ea5e9" />
            <Text style={styles.menuText}>About</Text>
          </RNView>

          <RNView style={styles.menuItem}>
            <FontAwesome name="question-circle" size={20} color="#0ea5e9" />
            <Text style={styles.menuText}>Help & Support</Text>
          </RNView>

          <RNView style={styles.menuItem}>
            <FontAwesome name="sign-out" size={20} color="#ef4444" />
            <Text style={[styles.menuText, styles.signOutText]}>Sign Out</Text>
          </RNView>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(14, 165, 233, 0.1)',
  },
  menuText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 12,
    flex: 1,
  },
  signOutText: {
    color: '#ef4444',
  },
});
