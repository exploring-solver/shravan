import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Config from '../../config/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../(tabs)/index';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { login } = useAuth();
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${Config.backendUrl}/api/auth/login`, { email, password });
      await AsyncStorage.setItem('token', response.data.token); // Store the token
      // console.log(response.data.token);
      await login(response.data.token);
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Log In{"\n"}Shravan</Text>
        <TextInput 
          placeholder="Email" 
          value={email} 
          onChangeText={setEmail} 
          style={styles.input} 
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          style={styles.input} 
          placeholderTextColor="#ccc"
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>
          New here?{' '}
          <Text onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c', // Dark gray background
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    backgroundColor: '#2d3748', // Darker gray box
    padding: 24,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4fd1c5', // Teal color
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#4a5568', // Medium gray input background
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#4fd1c5', // Teal button background
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    color: '#a0aec0', // Gray text
    textAlign: 'center',
    marginTop: 16,
  },
  registerLink: {
    color: '#4fd1c5', // Teal color for link
    fontWeight: 'bold',
  },
});

export default LoginScreen;
