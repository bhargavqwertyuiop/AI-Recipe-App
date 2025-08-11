import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function SignInScreen() {
  const { signInAnonymously } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantry AI</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <Button title="Continue (Anonymous)" onPress={signInAnonymously} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
});