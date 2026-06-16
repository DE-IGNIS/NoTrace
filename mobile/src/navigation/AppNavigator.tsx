// import React from 'react';
// import BottomTabs from './BottomTabs';
// import Logo from "../../assets/notrace_icon.svg";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { View, Text } from 'react-native';

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="NOTRACE"
//         component={BottomTabs}
//         options={{
//           headerShown: true,
//           headerTitle: () => (
//             <>
//               <View>
//                 <Text>NoTrace</Text>
//                 <Logo width={120} height={40} />
//               </View>
//             </>
//           ),
//           headerTitleAlign: "center"
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

import React from 'react';
import BottomTabs from './BottomTabs';
import Logo from "../../assets/notrace_icon.svg";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NOTRACE"
        component={BottomTabs}
        options={{
          headerShown: true,
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Logo width={28} height={28} />
              <Text style={styles.headerText}>NoTrace</Text>
            </View>
          ),
          headerTitleAlign: "left"
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
  },
  headerText: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
  },
});