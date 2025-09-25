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
    width: '100%',
    maxWidth: 360,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2a7a75', // Teal border
    backgroundColor: '#a8c5c2', // Dingy goth pastel teal interior
    marginVertical: 8,
  },
});
