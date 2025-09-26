import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';

interface JazzyTitleProps {
  children: string;
  style?: any;
}

export default function JazzyTitle({ children, style }: JazzyTitleProps) {
  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // Dark navy
    textAlign: 'left',
  },
});
