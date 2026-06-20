import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BrowserNavProvider } from "./context/BrowserNavContext";


export default function App() {
  return (
    <SafeAreaProvider>
      <BrowserNavProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </BrowserNavProvider>
    </SafeAreaProvider>
  )
}