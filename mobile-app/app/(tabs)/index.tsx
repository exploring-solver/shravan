import React, { createContext, useContext, useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';

// Import all screens
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import VoiceAssistant from '../screens/VoiceAssistant';
import ProjectList from '../screens/ProjectList';
import ProjectDetails from '../screens/project/[id]';
import CreateProject from '../screens/CreateProject';
import OsCommanderScreen from '../screens/OsCommandScreen';

// Create Auth Context
const AuthContext = createContext(null);

// Create Auth Provider
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async (navigation) => {
    try {
      await AsyncStorage.removeItem('token');
      setIsLoggedIn(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Project Stack
const ProjectStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Projects" component={ProjectList} />
    <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
    <Stack.Screen name="CreateProject" component={CreateProject} />
  </Stack.Navigator>
);

// Main Tab Navigator with Logout Function
const TabNavigator = ({ navigation }) => {
  const { logout } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={() => logout(navigation)}>
            <IconButton icon="logout" size={24} color="#4fd1c5" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen
        name="Shravan AI"
        component={OsCommanderScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceAssistant}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="microphone" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="IOT Interaction"
        component={ProjectStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="folder" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

// Main App Navigator with Auth Provider and Navigation Container
const AppNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;