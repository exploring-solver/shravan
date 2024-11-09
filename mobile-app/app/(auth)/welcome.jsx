import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/react-logo.png')} // replace with your logo path
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to Shravan AI</Text>
        <Text style={styles.subtitle}>Empowering Automation & Accessibility</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.description}>
          Seamlessly manage tasks, IoT devices, and more through voice commands. Control your environment effortlessly.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.buttonLogin} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.buttonRegister} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F2C', // Deep dark background for a modern look
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00BFA6', // Complementary color for text
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#C0C0C0',
    textAlign: 'center',
    marginTop: 10,
  },
  body: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  buttonLogin: {
    backgroundColor: '#00BFA6',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonRegister: {
    backgroundColor: '#0E74FF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
