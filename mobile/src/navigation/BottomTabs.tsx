// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// import BrowserScreen from '../screens/BrowserScreen';
// import TabScreen from '../screens/TabScreen';
// import BookMarkScreen from '../screens/BookMarkScreen';
// import HistoryScreen from '../screens/HistoryScreen';

// const Tab = createBottomTabNavigator();

// export default function BottomTabs() {
//   return (
//     <Tab.Navigator
//       ScreenOptions={{
//         tabBarActiveTintColor: "blue",
//         tabBarInactiveTintColor: "gray",
//       }}>
//       <Tab.Screen name="Home"
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             <Ionicons
//               name={focused ? "home" : "home-outline"}
//               size={size}
//               color={color}
//             />
//           )
//         }} component={BrowserScreen} />

//       <Tab.Screen name="Tabs"
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             <Ionicons
//               name={focused ? "copy" : "copy-outline"}
//               size={size}
//               color={color} />
//           )
//         }}
//         component={TabScreen} />

//       <Tab.Screen name="Saved"
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             <Ionicons
//               name={focused ? "bookmark" : "bookmark-outline"}
//               size={size}
//               color={color} />
//           )
//         }}
//         component={BookMarkScreen} />

//       <Tab.Screen name="History"
//         options={{
//           tabBarIcon: ({ focused, color, size }) => (
//             <Ionicons
//               name={focused ? "time" : "time-outline"}
//               size={size}
//               color={color} />
//           )
//         }}
//         component={HistoryScreen} />
//     </Tab.Navigator>
//   );
// }

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import BrowserScreen from '../screens/BrowserScreen';
import TabScreen from '../screens/TabScreen';
import BookMarkScreen from '../screens/BookMarkScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // ✅ removes "Home" header
        tabBarActiveTintColor: styles.active.color,
        tabBarInactiveTintColor: styles.inactive.color,
        // tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen
        name="Home"
        component={BrowserScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Tabs"
        component={TabScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "copy" : "copy-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Saved"
        component={BookMarkScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // tabBar: {
  //   height: 60,
  //   paddingBottom: 6,
  //   paddingTop: 6,
  // },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  active: {
    color: "#007AFF", // iOS blue
  },
  inactive: {
    color: "#8E8E93",
  },
});