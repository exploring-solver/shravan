import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Config from '../../config/Config';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      await axios.post(`${Config.backendUrl}/api/auth/register`, { email, password });
      Alert.alert("Registration Successful", "You can now log in.");
      navigation.navigate('Login');  // Navigate to login page after successful registration
    } catch (err) {
      console.error(err);
      Alert.alert('Registration Failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.registerBox}>
        <Text style={styles.title}>Register{"\n"}Shravan</Text>
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
        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Already registered?{' '}
          <Text onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            Login
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
  registerBox: {
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
  registerButton: {
    backgroundColor: '#4fd1c5', // Teal button background
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  registerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#a0aec0', // Gray text
    textAlign: 'center',
    marginTop: 16,
  },
  loginLink: {
    color: '#4fd1c5', // Teal color for link
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
