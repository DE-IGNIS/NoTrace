// import { View, Text } from "react-native"
// import SearchBar from "../../components/SearchBar"

// export default function BrowserScreen() {
//     return (
//         <View>
//             <SearchBar />
//             <Text>This is the Browser Screen</Text>
//         </View>
//     )
// }
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

type IconName = keyof typeof MaterialIcons.glyphMap;

// ---------------------------------------------------------------------------
// Design tokens — ported 1:1 from the original Tailwind config so the two
// surfaces stay visually identical.
// ---------------------------------------------------------------------------
const COLORS = {
  background: '#141313',
  surface: '#141313',
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerLow: '#1c1b1b',
  surfaceContainer: '#201f1f',
  surfaceContainerHigh: '#2a2a2a',
  surfaceContainerHighest: '#353434',
  primary: '#eeeded',
  onPrimary: '#2f3131',
  secondary: '#c8c6c5',
  onBackground: '#e5e2e1',
  outline: '#8e9192',
  outlineVariant: '#444748',
  borderHairline: '#222222',
  borderActive: '#404040',
};

interface Tile {
  id: string;
  icon: IconName;
  label: string;
  sublabel: string;
}

const TILES: Tile[] = [
  { id: 'search', icon: 'explore', label: 'Quick Search', sublabel: 'ANONYMOUS QUERY' },
  { id: 'vault', icon: 'lock', label: 'Vault Privacy', sublabel: 'ENCRYPTED STORAGE' },
  { id: 'settings', icon: 'settings', label: 'System Settings', sublabel: 'PROTOCOL CONFIG' },
  { id: 'history', icon: 'history', label: 'Trace History', sublabel: 'CLEAR LOGS' },
  { id: 'nodes', icon: 'hub', label: 'Nodes Relay', sublabel: 'ACTIVE HOPS: 12' },
  { id: 'mail', icon: 'mail', label: 'Secure Mail', sublabel: 'ALIAS: TEMP_482' },
];

const INITIAL_LOGS = [
  '> INITIALIZING STEALTH HANDSHAKE...',
  '> HANDSHAKE COMPLETE. TUNNEL ID: 0x8F2A9',
  '> AES-256 KEY ROTATED. NEXT ROTATION IN 240S',
  '> ALL TRAFFIC NOW ROUTED THROUGH TOR-NODE: ICELAND-1',
  '> SYSTEM STATUS: INCOGNITO',
];

const ROTATING_LOGS = [
  '> PACKET ENCRYPTION: VERIFIED',
  '> IP LEAK PROTECTION: SECURE',
  '> SESSION PERSISTENCE: DISABLED',
  '> METADATA SCRUBBING: COMPLETE',
  '> NEW IDENTITY ASSIGNED: GHOST-892',
];

let logIdCounter = 0;

// ---------------------------------------------------------------------------
// Pulsing status dot (VPN ACTIVE indicator)
// ---------------------------------------------------------------------------
const PulseDot: React.FC = () => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.pulseDot, { opacity }]} />;
};

// ---------------------------------------------------------------------------
// A single terminal feed line that fades in once when mounted
// ---------------------------------------------------------------------------
const LogLine: React.FC<{ text: string }> = ({ text }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [opacity]);

  const isStatusLine = text.includes('INCOGNITO');

  return (
    <Animated.Text
      style={[styles.logLine, isStatusLine && styles.logLineHighlight, { opacity }]}
      numberOfLines={1}
    >
      {text}
    </Animated.Text>
  );
};

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function BrowserScreen() {
  const [searchText, setSearchText] = useState('');
  const [logs, setLogs] = useState<{ id: number; text: string }[]>(
    INITIAL_LOGS.map((text) => ({ id: logIdCounter++, text }))
  );

  // Simulated rotating connection stream, mirrors the original setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      const nextText = ROTATING_LOGS[Math.floor(Math.random() * ROTATING_LOGS.length)];
      setLogs((prev) => {
        const next = [...prev, { id: logIdCounter++, text: nextText }];
        return next.length > 5 ? next.slice(next.length - 5) : next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* Top navigation bar */}
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="security" size={22} color={COLORS.primary} />
          <Text style={styles.brand}>NOTRACE</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.vpnPill}>
            <PulseDot />
            <Text style={styles.vpnPillText}>VPN ACTIVE</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.iconButton}>
            <MaterialIcons name="vpn-key" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      </View> */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Incognito logo section */}
        <View style={styles.heroSection}>
          <MaterialIcons name="visibility-off" size={100} color={COLORS.primary} />
          <Text style={styles.heroTitle}>Incognito Mode</Text>
          <Text style={styles.heroSubtitle}>END-TO-END ENCRYPTED SESSION</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={COLORS.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or enter URL"
            placeholderTextColor="rgba(200,198,197,0.5)"
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.searchActions}>
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons name="mic" size={20} color={COLORS.secondary} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons name="qr-code-scanner" size={20} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick action tiles (bento grid) */}
        <View style={styles.grid}>
          {TILES.map((tile) => (
            <TouchableOpacity key={tile.id} activeOpacity={0.8} style={styles.tile}>
              <MaterialIcons name={tile.icon} size={22} color={COLORS.primary} />
              <View>
                <Text style={styles.tileLabel}>{tile.label}</Text>
                <Text style={styles.tileSublabel}>{tile.sublabel}</Text>
              </View>
              <MaterialIcons
                name="call-made"
                size={14}
                color={COLORS.secondary}
                style={styles.tileCorner}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Terminal feed mockup */}
        <View style={styles.terminal}>
          <View style={styles.terminalHeader}>
            <Text style={styles.terminalHeaderText}>ACTIVE CONNECTION STREAM</Text>
            <View style={styles.terminalDots}>
              <View style={[styles.dot, { backgroundColor: '#7f1d1d' }]} />
              <View style={[styles.dot, { backgroundColor: '#713f12' }]} />
              <View style={[styles.dot, { backgroundColor: '#14532d' }]} />
            </View>
          </View>
          <View style={styles.terminalFeed}>
            {logs.map((log) => (
              <LogLine key={log.id} text={log.text} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom navigation bar (fixed) */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity activeOpacity={0.7} style={styles.navButton}>
          <MaterialIcons name="arrow-back" size={22} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.navButton}>
          <MaterialIcons name="arrow-forward" size={22} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.navHome}>
          <MaterialIcons name="home" size={20} color={COLORS.onPrimary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.navButton}>
          <MaterialIcons name="stop" size={20} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.navButton}>
          <MaterialIcons name="bookmark" size={22} color={COLORS.secondary} />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceContainerHighest,
    backgroundColor: COLORS.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vpnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  vpnPillText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  iconButton: {
    padding: 6,
    borderRadius: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 110,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  heroTitle: {
    color: COLORS.onBackground,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: 14,
  },
  heroSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderHairline,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 40,
  },
  searchInput: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 14,
    padding: 0,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  tile: {
    width: '48%',
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    padding: 16,
    marginBottom: 14,
    gap: 14,
    position: 'relative',
  },
  tileLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tileSublabel: {
    color: 'rgba(200,198,197,0.6)',
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  tileCorner: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.5,
  },
  terminal: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.borderHairline,
    borderRadius: 8,
    padding: 14,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderHairline,
  },
  terminalHeaderText: {
    color: COLORS.secondary,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  terminalDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  terminalFeed: {
    height: 96,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    gap: 4,
  },
  logLine: {
    color: 'rgba(200,198,197,0.8)',
    fontSize: 11,
  },
  logLineHighlight: {
    color: COLORS.primary,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerHighest,
  },
  navButton: {
    padding: 8,
  },
  navHome: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    padding: 9,
  },
});