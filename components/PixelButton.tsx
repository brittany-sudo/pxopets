import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  width?: number | string;
  variant?: 'primary' | 'important';
};

export default function PixelButton({ title, onPress, disabled, width, variant = 'primary' }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const shadow = Colors[colorScheme].tabBarBorder;
  const isImportant = variant === 'important';
  const bg = disabled
    ? '#e6e6e6'
    : (isImportant ? Colors[colorScheme].accentPurpleBg : Colors[colorScheme].accent2);
  const border = isImportant ? Colors[colorScheme].accentPurple : Colors[colorScheme].accent3;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.6 : 1 }}>
      <View style={[styles.outer, { width: width ?? 220, borderColor: shadow }]}> 
        <View style={[styles.inner, { backgroundColor: bg, borderColor: border }]}> 
          <Text style={styles.label}>{title}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    padding: 2,
    backgroundColor: 'transparent',
  },
  inner: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  label: {
    fontFamily: 'Silkscreen_400Regular',
    fontSize: 14,
    color: '#0f0f2a', // Darker navy
  },
});


