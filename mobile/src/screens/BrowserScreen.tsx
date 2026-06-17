// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
// } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import SearchBar from '../../components/SearchBar';
// import WebView from 'react-native-webview';

// type IconName = keyof typeof MaterialIcons.glyphMap;

// // ---------------------------------------------------------------------------
// // Design tokens
// // ---------------------------------------------------------------------------
// const COLORS = {
//   background: '#141313',
//   surface: '#141313',
//   surfaceContainerLowest: '#0e0e0e',
//   surfaceContainerLow: '#1c1b1b',
//   surfaceContainer: '#201f1f',
//   surfaceContainerHigh: '#2a2a2a',
//   surfaceContainerHighest: '#353434',
//   primary: '#eeeded',
//   onPrimary: '#2f3131',
//   secondary: '#c8c6c5',
//   onBackground: '#e5e2e1',
//   outline: '#8e9192',
//   outlineVariant: '#444748',
//   borderHairline: '#222222',
//   borderActive: '#404040',
// };

// // ---------------------------------------------------------------------------
// // Pulsing status dot (kept for future use in a status pill)
// // ---------------------------------------------------------------------------
// const PulseDot: React.FC = () => {
//   const opacity = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
//         Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [opacity]);

//   return <Animated.View style={[styles.pulseDot, { opacity }]} />;
// };

// // ---------------------------------------------------------------------------
// // Main screen
// // ---------------------------------------------------------------------------
// export default function BrowserScreen() {
//   const webviewRef = useRef<WebView>(null);
//   const [url, setUrl] = useState('');
//   const [input, setInput] = useState('');
//   const [hasNavigated, setHasNavigated] = useState(false);

//   const loadUrl = () => {
//     if (!input.trim()) return;
//     let formatted = input.trim();
//     if (!formatted.startsWith('http')) {
//       formatted = 'https://' + formatted;
//     }
//     setUrl(formatted);
//     setHasNavigated(true);
//   };

//   return (
//     <SafeAreaView style={styles.root}>
//       <StatusBar style="light" />

//       {/* Hero — only shown before the first navigation, so it never
//           competes with the WebView for vertical space */}
//       {!hasNavigated && (
//         <View style={styles.heroSection}>
//           <MaterialIcons name="visibility-off" size={100} color={COLORS.primary} />
//           <Text style={styles.heroTitle}>Incognito Mode</Text>
//           <Text style={styles.heroSubtitle}>END-TO-END ENCRYPTED SESSION</Text>
//         </View>
//       )}

//       {/* Toolbar row — fixed height, sits above the WebView */}
//       <View style={styles.toolbarRow}>
//         <TouchableOpacity
//           style={styles.navIconButton}
//           onPress={() => webviewRef.current?.goBack()}
//           activeOpacity={0.7}
//         >
//           <MaterialIcons name="arrow-back" size={20} color={COLORS.secondary} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navIconButton}
//           onPress={() => webviewRef.current?.goForward()}
//           activeOpacity={0.7}
//         >
//           <MaterialIcons name="arrow-forward" size={20} color={COLORS.secondary} />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.navIconButton}
//           onPress={() => webviewRef.current?.reload()}
//           activeOpacity={0.7}
//         >
//           <MaterialIcons name="refresh" size={20} color={COLORS.secondary} />
//         </TouchableOpacity>

//         <SearchBar input={input} setInput={setInput} loadUrl={loadUrl} />
//       </View>

//       {/* WebView — flex:1 sibling, no ScrollView/height fight, fills the
//           rest of the screen on its own */}
//       <View style={styles.webviewContainer}>
//         {hasNavigated ? (
//           <WebView ref={webviewRef} style={{ flex: 1 }} source={{ uri: url }} />
//         ) : (
//           <View style={styles.webviewPlaceholder}>
//             <Text style={styles.placeholderText}>Enter a URL or search above to begin</Text>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   pulseDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.primary,
//   },
//   heroSection: {
//     alignItems: 'center',
//     paddingTop: 32,
//     paddingBottom: 24,
//   },
//   heroTitle: {
//     color: COLORS.onBackground,
//     fontSize: 24,
//     fontWeight: '700',
//     letterSpacing: -0.2,
//     marginTop: 14,
//   },
//   heroSubtitle: {
//     color: COLORS.secondary,
//     fontSize: 11,
//     letterSpacing: 1.2,
//     marginTop: 6,
//     textTransform: 'uppercase',
//   },
//   toolbarRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     gap: 4,
//   },
//   navIconButton: {
//     padding: 8,
//   },
//   webviewContainer: {
//     flex: 1,
//   },
//   webviewPlaceholder: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 32,
//   },
//   placeholderText: {
//     color: COLORS.outline,
//     fontSize: 13,
//     textAlign: 'center',
//   },
// });

import React, { useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import AddressPill from '../../components/AddressPill';
import SearchModal from '../../components/SearchModal';

const COLORS = {
  background: '#141313',
  surfaceContainerLow: '#1c1b1b',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  onBackground: '#e5e2e1',
  outline: '#8e9192',
  outlineVariant: '#444748',
};

interface Bookmark {
  url: string;
  title: string;
}

const isLikelyUrl = (value: string) => {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return true;
  return /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[^\s]*)?$/.test(trimmed) && !trimmed.includes(' ');
};

const buildTargetUrl = (rawInput: string) => {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';
  if (isLikelyUrl(trimmed)) {
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
};

export default function BrowserScreen() {
  const webviewRef = useRef<WebView>(null);

  const [hasNavigated, setHasNavigated] = useState(false);
  const [url, setUrl] = useState('');
  const [draft, setDraft] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const barOpacity = useRef(new Animated.Value(0)).current;

  const isBookmarked = bookmarks.some((b) => b.url === url);

  const openModal = () => {
    setDraft(hasNavigated ? url : '');
    setModalVisible(true);
  };

  const handleSubmit = useCallback((text: string) => {
    const target = buildTargetUrl(text);
    if (!target) return;
    setModalVisible(false);
    setUrl(target);
    setHasNavigated(true);
  }, []);

  const handleLoadStart = () => {
    progress.setValue(0);
    Animated.timing(barOpacity, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  };

  const handleLoadProgress = ({ nativeEvent }: any) => {
    Animated.timing(progress, {
      toValue: nativeEvent.progress,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleLoadEnd = () => {
    Animated.timing(progress, { toValue: 1, duration: 150, useNativeDriver: false }).start(() => {
      Animated.timing(barOpacity, {
        toValue: 0,
        duration: 250,
        delay: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNavStateChange = (navState: any) => {
    setUrl(navState.url);
    setPageTitle(navState.title || navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  const toggleBookmark = () => {
    if (!hasNavigated || !url) return;
    setBookmarks((prev) =>
      prev.some((b) => b.url === url)
        ? prev.filter((b) => b.url !== url)
        : [...prev, { url, title: pageTitle || url }]
    );
  };

  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* {!hasNavigated && (
        <View style={styles.heroSection}>
          <MaterialIcons name="visibility-off" size={88} color={COLORS.primary} />
          <Text style={styles.heroTitle}>Incognito Mode</Text>
          <Text style={styles.heroSubtitle}>END-TO-END ENCRYPTED SESSION</Text>
        </View>
      )} */}

      <View style={styles.toolbarRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => webviewRef.current?.goBack()}
          disabled={!canGoBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={20} color={canGoBack ? COLORS.secondary : COLORS.outlineVariant} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => webviewRef.current?.goForward()}
          disabled={!canGoForward}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-forward" size={20} color={canGoForward ? COLORS.secondary : COLORS.outlineVariant} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => webviewRef.current?.reload()} activeOpacity={0.7}>
          <MaterialIcons name="refresh" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        <AddressPill displayText={hasNavigated ? url : ''} placeholder="Search or enter URL" onPress={openModal} />

        <TouchableOpacity style={styles.iconButton} onPress={toggleBookmark} disabled={!hasNavigated} activeOpacity={0.7}>
          <MaterialIcons
            name={isBookmarked ? 'star' : 'star-border'}
            size={20}
            color={isBookmarked ? COLORS.primary : COLORS.secondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.webviewContainer}>
        <Animated.View style={[styles.loadingBarTrack, { opacity: barOpacity }]} pointerEvents="none">
          <Animated.View style={[styles.loadingBarFill, { width: barWidth }]} />
        </Animated.View>

        {hasNavigated ? (
          <WebView
            ref={webviewRef}
            style={{ flex: 1 }}
            source={{ uri: url }}
            onLoadStart={handleLoadStart}
            onLoadProgress={handleLoadProgress}
            onLoadEnd={handleLoadEnd}
            onNavigationStateChange={handleNavStateChange}
          />
        ) : (
          <View style={styles.webviewPlaceholder}>
            <Text style={styles.placeholderText}>Tap the search bar above to begin</Text>
          </View>
        )}
      </View>

      <SearchModal
        visible={modalVisible}
        value={draft}
        onChangeText={setDraft}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  heroSection: { alignItems: 'center', paddingTop: 28, paddingBottom: 20 },
  heroTitle: { color: COLORS.onBackground, fontSize: 22, fontWeight: '700', letterSpacing: -0.2, marginTop: 12 },
  heroSubtitle: { color: COLORS.secondary, fontSize: 11, letterSpacing: 1.2, marginTop: 6, textTransform: 'uppercase' },
  toolbarRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, gap: 2 },
  iconButton: { padding: 8 },
  webviewContainer: { flex: 1, position: 'relative' },
  loadingBarTrack: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10 },
  loadingBarFill: { height: 2, backgroundColor: COLORS.primary },
  webviewPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  placeholderText: { color: COLORS.outline, fontSize: 13, textAlign: 'center' },
});