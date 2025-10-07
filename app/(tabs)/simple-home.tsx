import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSimpleGame } from '@/store/SimpleGameStore';
import SimpleCurrencyDisplay from '@/components/SimpleCurrencyDisplay';
import SimpleDeveloperPanel from '@/components/SimpleDeveloperPanel';

export default function SimpleHomeScreen() {
  const { state, addTickets } = useSimpleGame();
  const [showDevPanel, setShowDevPanel] = useState(false);

  const handleTestAddTickets = () => {
    addTickets(10);
  };

  return (
    <View style={styles.container}>
      {/* Currency Display */}
      <SimpleCurrencyDisplay />
      
      {/* Test Button */}
      <Pressable style={styles.testButton} onPress={handleTestAddTickets}>
        <FontAwesome name="plus" size={20} color="#fff" />
        <Text style={styles.testButtonText}>Test +10 Tickets</Text>
      </Pressable>

      {/* Developer Panel Button */}
      <Pressable 
        style={styles.devButton} 
        onPress={() => setShowDevPanel(true)}
      >
        <FontAwesome name="code" size={20} color="#fff" />
        <Text style={styles.devButtonText}>🛠️ Dev Panel</Text>
      </Pressable>

      {/* Debug Info */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>Debug: Tickets={state.tickets}, Stamina={state.stamina}, Coins={state.coins}</Text>
      </View>

      {/* Developer Panel Modal */}
      <SimpleDeveloperPanel 
        visible={showDevPanel}
        onClose={() => setShowDevPanel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f0f0f',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#059669',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d97706',
  },
  devButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  debugContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  debugText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});



