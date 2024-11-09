import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import VoiceAssistant from '../screens/VoiceAssistant';
import ProjectList from '../screens/ProjectList';
import ProjectDetails from '../screens/project/[id]';
import CreateProject from '../screens/CreateProject';
import OsCommanderScreen from '../screens/OsCommandScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProjectStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Projects" component={ProjectList} />
    <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
    <Stack.Screen name="CreateProject" component={CreateProject} />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator>
    {/* <Tab.Screen
      name="Shravan AI"
      component={Shravan}
      options={{
        tabBarIcon: ({ color, size }) => (
          <IconButton icon="microphone" size={size} color={color} />
        ),
      }}
    /> */}
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

export default AppNavigator;