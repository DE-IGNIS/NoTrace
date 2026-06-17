// import React from 'react';
// import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// const COLORS = {
//     background: '#141313',
//     surface: '#141313',
//     surfaceContainerLowest: '#0e0e0e',
//     surfaceContainerLow: '#1c1b1b',
//     surfaceContainer: '#201f1f',
//     surfaceContainerHigh: '#2a2a2a',
//     surfaceContainerHighest: '#353434',
//     primary: '#eeeded',
//     onPrimary: '#2f3131',
//     secondary: '#c8c6c5',
//     onBackground: '#e5e2e1',
//     outline: '#8e9192',
//     outlineVariant: '#444748',
//     borderHairline: '#222222',
//     borderActive: '#404040',
// };

// interface SearchBarProps {
//     input: string;
//     setInput: (text: string) => void;
//     loadUrl: () => void;
// }

// export default function SearchBar({ input, setInput, loadUrl }: SearchBarProps) {
//     return (
//         <View style={styles.searchBar}>
//             <MaterialIcons name="search" size={20} color={COLORS.secondary} />

//             <TextInput
//                 value={input}
//                 onChangeText={setInput}
//                 placeholder="Search or enter URL"
//                 placeholderTextColor="rgba(200,198,197,0.5)"
//                 style={styles.searchInput}
//                 onSubmitEditing={loadUrl}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 returnKeyType="go"
//             />

//             <View style={styles.searchActions}>
//                 <TouchableOpacity activeOpacity={0.7}>
//                     <MaterialIcons name="mic" size={20} color={COLORS.secondary} />
//                 </TouchableOpacity>
//                 <TouchableOpacity activeOpacity={0.7}>
//                     <MaterialIcons name="qr-code-scanner" size={20} color={COLORS.secondary} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     searchBar: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         backgroundColor: COLORS.surfaceContainerLow,
//         borderRadius: 8,
//         paddingVertical: 10,
//         paddingHorizontal: 14,
//     },
//     searchInput: {
//         flex: 1,
//         color: COLORS.primary,
//         fontSize: 14,
//         padding: 0,
//     },
//     searchActions: {
//         flexDirection: 'row',
//         gap: 12,
//     },
// });

// import React from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// const COLORS = {
//     surfaceContainerLow: '#1c1b1b',
//     primary: '#eeeded',
//     secondary: '#c8c6c5',
//     borderHairline: '#222222',
// };

// interface SearchBarProps {
//     value: string;
//     onChangeText: (text: string) => void;
//     onSubmit: () => void;
//     autoFocus?: boolean;
// }

// export default function SearchBar({ value, onChangeText, onSubmit, autoFocus }: SearchBarProps) {
//     return (
//         <View style={styles.searchBar}>
//             <MaterialIcons name="search" size={20} color={COLORS.secondary} />

//             <TextInput
//                 value={value}
//                 onChangeText={onChangeText}
//                 placeholder="Search or enter URL"
//                 placeholderTextColor="rgba(200,198,197,0.5)"
//                 style={styles.searchInput}
//                 onSubmitEditing={onSubmit}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 returnKeyType="go"
//                 autoFocus={autoFocus}
//                 selectTextOnFocus
//             />

//             <TouchableOpacity style={styles.goButton} onPress={onSubmit} activeOpacity={0.7}>
//                 <Text style={styles.goButtonText}>Go</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     searchBar: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10,
//         backgroundColor: COLORS.surfaceContainerLow,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: COLORS.borderHairline,
//         paddingVertical: 10,
//         paddingHorizontal: 14,
//     },
//     searchInput: { flex: 1, color: COLORS.primary, fontSize: 14, padding: 0 },
//     goButton: { paddingHorizontal: 10, paddingVertical: 4 },
//     goButtonText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
// });


import React, { forwardRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = {
  surfaceContainerLow: '#1c1b1b',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  borderHairline: '#222222',
};

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ value, onChangeText, onSubmit }, ref) => {
    return (
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color={COLORS.secondary} />

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder="Search or enter URL"
          placeholderTextColor="rgba(200,198,197,0.5)"
          style={styles.searchInput}
          onSubmitEditing={onSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          selectTextOnFocus
        />

        <TouchableOpacity style={styles.goButton} onPress={onSubmit} activeOpacity={0.7}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

export default SearchBar;

const styles = StyleSheet.create({
  searchBar: {
    // flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: COLORS.primary, fontSize: 14, padding: 0 },
  goButton: { paddingHorizontal: 10, paddingVertical: 4 },
  goButtonText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
});