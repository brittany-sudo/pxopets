import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: any;
};

export default function BorderedBox({ children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle white border
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Subtle white background
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
});
