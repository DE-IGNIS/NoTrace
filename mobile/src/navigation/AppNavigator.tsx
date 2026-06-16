import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="NOTRACE" 
        component={BottomTabs} 
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}