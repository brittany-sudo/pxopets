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
    borderWidth: 2,
    borderColor: '#0ea5e9', // Premium rich teal-blue
    backgroundColor: 'transparent', // No fill - just border
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
