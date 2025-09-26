import React from 'react';
import { StyleSheet, TextInput, View as RNView, ScrollView, Pressable, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
import { useGame } from '@/store/GameStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

const petIds = ['p1','p2','p3','p4','p5','p6','p7','p8'];

// Import pet images
const tigerguyImage = require('@/assets/images/tigerguy.png');
const pinkGuyImage = require('@/assets/images/pink-guy.png');

export default function CreatePet() {
  const { renamePet, increaseHappiness } = useGame();
  const [selected, setSelected] = React.useState<string>('p1');
  const [name, setName] = React.useState('Nova');

  const create = () => {
    renamePet(name.trim() || 'Nova');
    increaseHappiness(10);
  };

  const getPetImage = (id: string) => {
    if (id === 'p1') return tigerguyImage;
    if (id === 'p2') return pinkGuyImage;
    return null; // Other pets don't have images yet
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={16} color="#0f172a" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <BorderedBox>
          <Text style={styles.title}>CREATE A PET</Text>
          <RNView style={styles.grid}>
            {petIds.map(id => (
              <Pressable 
                key={id} 
                style={[styles.cell, selected === id && styles.cellSelected]}
                onPress={() => setSelected(id)}
              >
                <RNView style={styles.cellContent}>
                  {getPetImage(id) ? (
                    <Image 
                      source={getPetImage(id)} 
                      style={styles.petImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.petText}>{id.toUpperCase()}</Text>
                  )}
                  <Text style={styles.petName}>
                    {id === 'p1' ? 'SUDOTIGER' : 
                     id === 'p2' ? 'WHEEZIE' : 
                     id.toUpperCase()}
                  </Text>
                </RNView>
              </Pressable>
            ))}
          </RNView>
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />
          <RNView style={{ height: 15 }} />
          <PixelButton title="Create" onPress={create} width={200} />
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
  },
  backButtonText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    marginLeft: 6,
  },
  title: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16, 
    width: 360, 
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cell: { 
    width: 90, 
    height: 110, 
    borderWidth: 3, 
    borderColor: '#0ea5e9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 10,
    margin: 4,
    padding: 8,
  },
  cellContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cellSelected: { 
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  petImage: {
    width: 50,
    height: 50,
    imageRendering: 'pixelated' as any,
    marginBottom: 4,
  },
  petText: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  petName: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: { 
    borderWidth: 2, 
    borderColor: '#0ea5e9', 
    padding: 12, 
    width: 240, 
    backgroundColor: '#fff',
    borderRadius: 8,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});


