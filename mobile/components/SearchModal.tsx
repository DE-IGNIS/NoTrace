// import React from 'react';
// import { Modal, View, Pressable, StyleSheet } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import SearchBar from './SearchBar';

// const COLORS = {
//   background: '#141313',
//   surfaceContainerLowest: '#0e0e0e',
// };

// interface SearchModalProps {
//   visible: boolean;
//   value: string;
//   onChangeText: (text: string) => void;
//   onClose: () => void;
//   onSubmit: (text: string) => void;
// }

// export default function SearchModal({
//   visible,
//   value,
//   onChangeText,
//   onClose,
//   onSubmit,
// }: SearchModalProps) {
//   return (
//     <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
//       <SafeAreaView style={styles.root}>
//         <View style={styles.searchRow}>
//           <SearchBar
//             value={value}
//             onChangeText={onChangeText}
//             onSubmit={() => onSubmit(value)}
//           />
//         </View>

//         {/* tapping anywhere below the input dismisses without navigating */}
//         <Pressable style={styles.backdrop} onPress={onClose} />
//       </SafeAreaView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: COLORS.background },
//   searchRow: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
//   backdrop: { flex: 1, backgroundColor: COLORS.surfaceContainerLowest },
// });


import React from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from './SearchBar';

const COLORS = {
  background: '#141313',
  surfaceContainerLowest: '#0e0e0e',
};

interface SearchModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export default function SearchModal({
  visible,
  value,
  onChangeText,
  onClose,
  onSubmit,
}: SearchModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.searchRow}>
          <SearchBar
            value={value}
            onChangeText={onChangeText}
            onSubmit={() => onSubmit(value)}
          />
        </View>

        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  searchRow: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  backdrop: { flex: 1, backgroundColor: COLORS.surfaceContainerLowest },
}); 