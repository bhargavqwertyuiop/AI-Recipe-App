import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantryScreen from '../screens/PantryScreen';
import ScanScreen from '../screens/ScanScreen';
import RecipesScreen from '../screens/RecipesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Simple stack-based navigation between core screens
const Stack = createNativeStackNavigator();

export default function Tabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Pantry" component={PantryScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Recipes" component={RecipesScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}