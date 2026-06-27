import React from 'react';
import BottomTabs from './BottomTabs';
import Logo from "../../assets/notrace_icon.svg";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator id="root-stack">
      <Stack.Screen
        name="NOTRACE"
        component={BottomTabs}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "900",
  },
});