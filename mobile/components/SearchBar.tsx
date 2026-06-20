// import React, { forwardRef } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// const COLORS = {
//   surfaceContainerLow: '#1c1b1b',
//   primary: '#eeeded',
//   secondary: '#c8c6c5',
//   borderHairline: '#222222',
// };

// interface SearchBarProps {
//   value: string;
//   onChangeText: (text: string) => void;
//   onSubmit: () => void;
// }

// const SearchBar = forwardRef<TextInput, SearchBarProps>(
//   ({ value, onChangeText, onSubmit }, ref) => {
//     return (
//       <View style={styles.searchBar}>
//         <MaterialIcons name="search" size={20} color={COLORS.secondary} />

//         <TextInput
//           ref={ref}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder="Search or enter URL"
//           placeholderTextColor="rgba(200,198,197,0.5)"
//           style={styles.searchInput}
//           onSubmitEditing={onSubmit}
//           autoCapitalize="none"
//           autoCorrect={false}
//           returnKeyType="go"
//           selectTextOnFocus
//         />

//         <TouchableOpacity style={styles.goButton} onPress={onSubmit} activeOpacity={0.7}>
//           <Text style={styles.goButtonText}>Go</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// );

// export default SearchBar;

// const styles = StyleSheet.create({
//   searchBar: {
//     // flex: 1,
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     backgroundColor: COLORS.surfaceContainerLow,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: COLORS.borderHairline,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//   },
//   searchInput: { flex: 1, color: COLORS.primary, fontSize: 14, padding: 0 },
//   goButton: { paddingHorizontal: 10, paddingVertical: 4 },
//   goButtonText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   TextInput,
//   TextInputProps,
//   StyleSheet,
//   View,
//   Animated,
//   Platform,
//   StyleProp,
//   ViewStyle,
// } from 'react-native';

// // ----- 1️⃣  Theme (you can replace this with your own theme provider) -----
// const theme = {
//   // Colours – adapt to your design system / dark‑mode handling
//   surfaceContainerLow: '#F5F5F5',
//   primary: '#0066FF',
//   textPrimary: '#111111',
//   textSecondary: '#777777',
//   // You can also add a library like `react-native-paper` or a custom theme context.
// };

// // ----- 2️⃣  Props interface -------------------------------------------------
// export interface SearchInputProps extends TextInputProps {
//   /** Placeholder text (defaults to the same as in the HTML example) */
//   placeholder?: string;
//   /** Optional external style for the wrapper View */
//   containerStyle?: StyleProp<ViewStyle>;
// }

// /**
//  * A reusable, stylised TextInput that mimics the Tailwind‑styled <input>
//  * from the question.
//  *
//  * Usage:
//  * ```tsx
//  * <SearchInput
//  *   value={search}
//  *   onChangeText={setSearch}
//  *   placeholder="Search or enter URL"
//  * />
//  * ```
//  */
// export const SearchInput: React.FC<SearchInputProps> = ({
//   placeholder = 'Search or enter URL',
//   value,
//   onChangeText,
//   style,
//   containerStyle,
//   ...rest
// }) => {
//   // ----- 3️⃣  Focus handling & animation ---------------------------------
//   const [isFocused, setIsFocused] = useState(false);
//   const focusAnim = new Animated.Value(0); // 0 = unfocused, 1 = focused

//   useEffect(() => {
//     Animated.timing(focusAnim, {
//       toValue: isFocused ? 1 : 0,
//       duration: 150, // quick transition, similar to Tailwind's default
//       useNativeDriver: false,
//     }).start();
//   }, [isFocused]);

//   // Interpolate border colour from the animation value
//   const borderColor = focusAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['#222222', theme.primary],
//   });

//   // ----- 4️⃣  Render -------------------------------------------------------
//   return (
//     <Animated.View
//       style={[
//         styles.wrapper,
//         containerStyle,
//         // Animated border colour (only the bottom border)
//         { borderBottomColor: borderColor },
//       ]}
//     >
//       <TextInput
//         style={[styles.input, style]}
//         placeholder={placeholder}
//         placeholderTextColor={`${theme.textSecondary}88`} // 50% opacity
//         value={value}
//         onChangeText={onChangeText}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         // Remove Android's default underline + iOS clear button
//         underlineColorAndroid="transparent"
//         clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
//         // Forward any other TextInput props (`keyboardType`, `secureTextEntry`, …)
//         {...rest}
//       />
//     </Animated.View>
//   );
// };

// // ----- 5️⃣  Styles ---------------------------------------------------------
// const styles = StyleSheet.create({
//   /**
//    * Wrapper mimics the Tailwind classes that affect the *container*:
//    *   - w-full          → width: '100%'
//    *   - bg‑surface‑container‑low → backgroundColor from theme
//    *   - border‑b        → borderBottomWidth: 1
//    *   - transition‑all  → we handle this via Animated
//    */
//   wrapper: {
//     width: '100%',
//     backgroundColor: theme.surfaceContainerLow,
//     borderBottomWidth: 1,
//     // The base (unfocused) border colour matches `border-[#222222]`
//     borderBottomColor: '#222222',
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 20,
//     paddingLeft: 64,
//     paddingRight: 24,
//     fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
//     fontSize: 16,
//     color: theme.textPrimary,
//     // Prevent auto‑caps & auto‑correction unless you want them
//     // autoCapitalize: 'none',
//     // autoCorrect: false,
//   },
// });

// export default SearchInput;

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─────────────────────────────────────────────────────────
// Design tokens (mirrors the Tailwind config from the source mockup)
// ─────────────────────────────────────────────────────────
const COLORS = {
  background: '#141313',
  surface: '#141313',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353434',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onBackground: '#e5e2e1',
  onSurfaceVariant: '#c4c7c7',
  outline: '#8e9192',
  border: '#222222',
  borderActive: '#404040',
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // VPN status dot — pulsing animation, replaces the CSS `animate-pulse`
  // useEffect(() => {
  //   const loop = Animated.loop(
  //     Animated.sequence([
  //       Animated.timing(pulseAnim, {
  //         toValue: 0.3,
  //         duration: 800,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(pulseAnim, {
  //         toValue: 1,
  //         duration: 800,
  //         useNativeDriver: true,
  //       }),
  //     ])
  //   );
  //   loop.start();
  //   return () => loop.stop();
  // }, [pulseAnim]);

  // Terminal feed — periodically appends a random status line, keeps last 5
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const next = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
  //     setLogs((prev) => {
  //       const updated = [...prev, { id: `${Date.now()}`, text: next }];
  //       return updated.length > 5 ? updated.slice(updated.length - 5) : updated;
  //     });
  //   }, 3500);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <View style={styles.screen}>
      <View>
        {/* ── Incognito Logo Section ─────────────────────── */}
        <View style={styles.logoSection}>
          <View style={styles.logoGlowWrap}>
            <MaterialCommunityIcons
              name="eye-outline"
              size={140}
              color={COLORS.primary}
            />
          </View>
          {/* To be replaced with a dynaimic mode option btw standard and incognito */}
          <Text style={styles.title}>Standard Mode</Text>
          <Text style={styles.subtitle}>END-TO-END ENCRYPTED</Text>
        </View>

        {/* ── Search Bar ──────────────────────────────────── */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBar,
              inputFocused && styles.searchBarFocused,
            ]}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={inputFocused ? COLORS.primary : COLORS.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search or enter URL"
              placeholderTextColor="rgba(200,198,197,0.5)"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* ── Quote ───────────────────────────────────────── */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>
            “Privacy is not an option, it is a prerequisite.”
          </Text>
          <View style={styles.quoteDivider} />
        </View>

        <View style={{ height: 96 }} />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHighest,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  vpnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9999,
  },
  vpnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  vpnBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: 8,
    borderRadius: 4,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'center',
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },

  // Logo / hero section
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoGlowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: COLORS.onBackground,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1.3,
    color: COLORS.secondary,
    textTransform: 'uppercase',
    marginTop: 8,
  },

  // Search bar
  searchSection: {
    width: '100%',
    maxWidth: 640,
    marginBottom: 64,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  searchBarFocused: {
    borderBottomColor: COLORS.primary,
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    letterSpacing: 0.5,
    color: COLORS.primary,
    paddingVertical: 0,
  },
  searchActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },

  // Quote
  quoteSection: {
    width: '100%',
    maxWidth: 640,
    alignItems: 'center',
    paddingVertical: 48,
  },
  quoteText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontStyle: 'italic',
    color: 'rgba(200,198,197,0.8)',
    textAlign: 'center',
  },
  quoteDivider: {
    height: 1,
    width: 48,
    backgroundColor: 'rgba(238,237,237,0.2)',
    marginTop: 24,
  },

  // Terminal feed
  terminalWrapper: {
    width: '100%',
    maxWidth: 960,
    paddingHorizontal: 16,
  },
  terminalCard: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
  },
  terminalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  terminalHeaderText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.1,
    color: COLORS.secondary,
    textTransform: 'uppercase',
  },
  terminalDots: {
    flexDirection: 'row',
    gap: 4,
  },
  terminalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  terminalBody: {
    minHeight: 96,
    gap: 4,
  },
  terminalLine: {
    fontSize: 11,
    letterSpacing: 0.3,
    color: 'rgba(200,198,197,0.8)',
  },
  terminalLineHighlight: {
    color: COLORS.primary,
  },

  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerHighest,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  navLabel: {
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.secondary,
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});