import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import BorderedBox from '@/components/BorderedBox';
import JazzyTitle from '@/components/JazzyTitle';

export default function MailScreen() {
  return (
    <View style={styles.container}>
      <BorderedBox>
        <JazzyTitle style={styles.title}>MAIL</JazzyTitle>
        <Text style={styles.mailItem}>📧 Welcome to Pxopets!</Text>
        <Text style={styles.mailItem}>🎁 Daily reward available</Text>
        <Text style={styles.mailItem}>🏆 Contest results are in!</Text>
        <Text style={styles.mailItem}>💌 New friend request</Text>
        <Text style={styles.mailItem}>📢 Community announcement</Text>
      </BorderedBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a', // Premium deep slate
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'left',
  },
  mailItem: {
    fontSize: 13,
    fontFamily: 'Silkscreen_400Regular',
    marginBottom: 8,
    color: '#0f172a', // Premium deep slate
  },
});
