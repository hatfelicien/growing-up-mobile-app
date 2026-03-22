import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ModuleScreen from '../screens/ModuleScreen';
import LessonScreen from '../screens/LessonScreen';
import QuizScreen from '../screens/QuizScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.primaryDark, headerTitleStyle: { fontWeight: '700' } }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Growing Up' }} />
        <Stack.Screen name="Module" component={ModuleScreen} options={{ title: 'Module' }} />
        <Stack.Screen name="Lesson" component={LessonScreen} options={{ title: 'Lesson' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Quiz' }} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin Login' }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard', headerLeft: () => null, gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
