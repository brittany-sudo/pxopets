import React from 'react';
import { StyleSheet, TextInput, View as RNView, ScrollView, Pressable, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import PixelButton from '@/components/PixelButton';
import BorderedBox from '@/components/BorderedBox';
import { useGame } from '@/store/GameStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

const petIds = ['p1','p2','p3','p4','p5','p6','p7','p8'];

const randomNames = [
  'clio', 'jonesy', 'bite', 'malone', 'hekate', 'jimmy', 'addison', 
  'princess', 'yummy', 'coats', 'martini', 'tank', 'professor', 
  'scully', 'coats', 'chug', 'chunk'
];

// Import pet images
const tigerguyImage = require('@/assets/images/tigerguy.png');
const pinkGuyImage = require('@/assets/images/pink-guy.png');
const coconutGuyImage = require('@/assets/images/coco-guy.png');
const purpleGuyImage = require('@/assets/images/purple-guy.png');
const robotGuyImage = require('@/assets/images/robot-guy.png');
const createPetImage = require('@/assets/images/create-a-pet.png');

export default function CreatePet() {
  const { renamePet, increaseHappiness } = useGame();
  const [selected, setSelected] = React.useState<string>('p1');
  const [name, setName] = React.useState('Nova');

  const create = () => {
    renamePet(name.trim() || 'Nova');
    increaseHappiness(10);
  };

  const randomizeName = () => {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    setName(randomName);
  };

  const getPetImage = (id: string) => {
    if (id === 'p1') return tigerguyImage;
    if (id === 'p2') return pinkGuyImage;
    if (id === 'p3') return coconutGuyImage;
    if (id === 'p4') return purpleGuyImage;
    if (id === 'p5') return robotGuyImage;
    // p6, p7, p8 will use placeholder icons
    return null;
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

        <RNView>
          <Image 
            source={createPetImage} 
            style={styles.titleImage}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>select a pxopet</Text>
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
                  ) : id === 'p6' ? (
                    <FontAwesome name="star" size={40} color="#0ea5e9" />
                  ) : id === 'p7' ? (
                    <FontAwesome name="heart" size={40} color="#8b5cf6" />
                  ) : id === 'p8' ? (
                    <FontAwesome name="diamond" size={40} color="#f59e0b" />
                  ) : (
                    <Text style={styles.petText}>{id.toUpperCase()}</Text>
                  )}
                  <Text style={styles.petName}>
                    {id === 'p1' ? 'SUDOTIGER' : 
                     id === 'p2' ? 'WHEEZIE' : 
                     id === 'p3' ? 'FREKKI' :
                     id === 'p4' ? 'NOXIA' :
                     id === 'p5' ? 'TECHNOR' :
                     id === 'p6' ? 'DOPPIO' :
                     id === 'p7' ? 'CURSIVE' :
                     id === 'p8' ? 'LEMENTO' :
                     id.toUpperCase()}
                  </Text>
                </RNView>
              </Pressable>
            ))}
          </RNView>
          <RNView style={styles.nameSection}>
            <RNView style={styles.inputContainer}>
              <TextInput 
                value={name} 
                onChangeText={setName} 
                style={styles.input} 
                placeholder="Name"
                placeholderTextColor="#9ca3af"
              />
              <Pressable style={styles.randomizeButton} onPress={randomizeName}>
                <FontAwesome name="magic" size={18} color="#8b5cf6" />
              </Pressable>
            </RNView>
          </RNView>
          <RNView style={styles.buttonContainer}>
            <RNView style={styles.buttonWrapper}>
              <PixelButton title="Create" onPress={create} width={200} />
            </RNView>
          </RNView>
        </RNView>
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
  titleImage: {
    width: '100%',
    height: 158,
    marginTop: 8,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    width: '100%', 
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  cell: { 
    width: 120, 
    height: 140, 
    borderWidth: 3, 
    borderColor: '#0ea5e9', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 10,
    margin: 1,
    padding: 10,
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
  nameSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  buttonWrapper: {
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderRadius: 8,
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
    paddingRight: 40,
    width: 240, 
    backgroundColor: '#fff',
    borderRadius: 8,
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  randomizeButton: {
    position: 'absolute',
    right: 6,
    padding: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});


