import React from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorSchemeContext } from '@/components/ColorSchemeContext';
import BottomNavigation from '@/components/BottomNavigation';

export default function MoreScreen() {
  const { colorScheme, toggleColorScheme, isDark } = useColorSchemeContext();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BorderedBox>
          <RNView style={styles.menuItem}>
            <FontAwesome name="cog" size={20} color="#0ea5e9" />
            <Text style={styles.menuText}>Settings</Text>
          </RNView>

          <Pressable style={styles.menuItem} onPress={toggleColorScheme}>
            <FontAwesome name={isDark ? "sun-o" : "moon-o"} size={20} color="#0ea5e9" />
            <Text style={styles.menuText}>Dark Mode</Text>
            <RNView style={styles.toggleContainer}>
              <RNView style={[styles.toggle, isDark && styles.toggleActive]}>
                <RNView style={[styles.toggleThumb, isDark && styles.toggleThumbActive]} />
              </RNView>
            </RNView>
          </Pressable>

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
      <BottomNavigation />
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
  toggleContainer: {
    marginLeft: 'auto',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
});
