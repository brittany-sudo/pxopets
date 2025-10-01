import React, { useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useInventory } from '@/store/InventoryStore';

interface InventoryManagerProps {
  visible: boolean;
  onClose: () => void;
}

export default function InventoryManager({ visible, onClose }: InventoryManagerProps) {
  const { 
    state, 
    getMainInventoryCount, 
    getSafetyDepositCount 
  } = useInventory();
  
  const [activeTab, setActiveTab] = useState<'main' | 'safety'>('main');

  if (!visible) return null;


  const mainInventoryCount = getMainInventoryCount();
  const safetyDepositCount = getSafetyDepositCount();

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Inventory Manager</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <Pressable 
            style={[styles.tab, activeTab === 'main' && styles.activeTab]}
            onPress={() => setActiveTab('main')}
          >
            <Text style={[styles.tabText, activeTab === 'main' && styles.activeTabText]}>
              Main ({mainInventoryCount}/20)
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'safety' && styles.activeTab]}
            onPress={() => setActiveTab('safety')}
          >
            <Text style={[styles.tabText, activeTab === 'safety' && styles.activeTabText]}>
              Safety ({safetyDepositCount})
            </Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          {activeTab === 'main' ? (
            <View>
              <Text style={styles.sectionTitle}>Main Inventory</Text>
              {state.mainInventory.length === 0 ? (
                <Text style={styles.emptyText}>No items in main inventory</Text>
              ) : (
                state.mainInventory.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Safety Deposit Box</Text>
              {Object.keys(state.safetyDepositBox).length === 0 ? (
                <Text style={styles.emptyText}>No items in safety deposit box</Text>
              ) : (
                Object.values(state.safetyDepositBox).map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 16,
    color: '#64748b',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#8b5cf6',
  },
  tabText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    maxHeight: 300,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    marginBottom: 6,
  },
  itemName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#1e293b',
    flex: 1,
  },
  itemQuantity: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
});
