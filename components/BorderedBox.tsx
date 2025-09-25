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
    width: '80%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#0ecab8', // Same teal as navigation bars
    backgroundColor: '#f5f5dc', // Off-bone white interior
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
