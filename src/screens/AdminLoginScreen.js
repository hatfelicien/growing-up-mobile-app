import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/api';
import { colors } from '../theme/colors';

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const result = await api.login(username, password);
    if (result.success) {
      navigation.replace('AdminDashboard');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔐</Text>
      </View>
      <Text style={styles.title}>Admin Portal</Text>
      <Text style={styles.subtitle}>Sign in to manage content</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 20, alignItems: 'center' },
  iconContainer: { width: 60, height: 60, backgroundColor: colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  icon: { fontSize: 32 },
  title: { fontSize: 28, fontWeight: '700', color: colors.primaryDark, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, marginBottom: 32 },
  form: { width: '100%', backgroundColor: colors.surface, borderRadius: 16, padding: 24 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textMain, marginBottom: 8 },
  input: { borderWidth: 2, borderColor: colors.surfaceMuted, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: colors.textInverse, fontSize: 16, fontWeight: '600' },
});
