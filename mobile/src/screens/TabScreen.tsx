import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../navigation/types";
import { useBrowserNav } from "../../context/BrowserNavContext";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const COLORS = {
  bg: "#141313",
  surface: "#1c1b1b",
  surfaceHigh: "#242323",
  border: "#2a2a2a",
  borderActive: "#e0dedd",
  primary: "#eeeded",
  secondary: "#c8c6c5",
  muted: "#555352",
  accent: "#eeeded",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// Two-column grid with gutters
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 0.85; // aspect-ratio-like scaling

export default function TabScreen() {
  const { tabs, activeTabId, createTab, closeTab, switchTab } =
    useBrowserNav();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const insets = useSafeAreaInsets();

  const fadeAnims = useRef<{ [key: string]: Animated.Value }>({}).current;
  const slideAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  tabs.forEach((tab) => {
    if (!fadeAnims[tab.id]) fadeAnims[tab.id] = new Animated.Value(0);
    if (!slideAnims[tab.id]) slideAnims[tab.id] = new Animated.Value(24);
  });

  useFocusEffect(
    useCallback(() => {
      tabs.forEach((tab) => {
        fadeAnims[tab.id].setValue(0);
        slideAnims[tab.id].setValue(24);
      });

      const animations = tabs.map((tab) =>
        Animated.parallel([
          Animated.timing(fadeAnims[tab.id], {
            toValue: 1,
            duration: 280,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnims[tab.id], {
            toValue: 0,
            duration: 280,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(40, animations).start();
    }, [tabs, fadeAnims, slideAnims])
  );

  const handleCloseTab = (tabId: string) => {
    Animated.parallel([
      Animated.timing(fadeAnims[tabId], {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnims[tabId], {
        toValue: 16,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      closeTab(tabId);
    });
  };

  const handleSelectTab = (tabId: string) => {
    switchTab(tabId);
    navigation.navigate("Home");
  };

  const handleNewTab = () => {
    createTab();
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.main, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tabs</Text>
            <Text style={styles.subtitle}>
              {tabs.length} {tabs.length === 1 ? "session" : "sessions"} · MEMORY
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={handleNewTab}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={20} color={COLORS.bg} />
          </TouchableOpacity>
        </View>

        {/* Tabs Grid */}
        <View style={styles.grid}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const fAnim = fadeAnims[tab.id] || new Animated.Value(1);
            const sAnim = slideAnims[tab.id] || new Animated.Value(0);

            const displayTitle = tab.title || "New Tab";
            const displayUrl = tab.hasNavigated ? tab.url : "No site loaded";

            return (
              <Animated.View
                key={tab.id}
                style={[
                  styles.cardWrapper,
                  {
                    opacity: fAnim,
                    transform: [{ translateY: sAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => handleSelectTab(tab.id)}
                  style={[styles.card, isActive && styles.activeCard]}
                >
                  {/* Active glow line at top */}
                  {isActive && <View style={styles.activeTopBar} />}

                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.badge,
                        isActive ? styles.badgeActive : styles.badgeInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isActive
                            ? styles.badgeTextActive
                            : styles.badgeTextInactive,
                        ]}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCloseTab(tab.id);
                      }}
                      style={styles.closeBtn}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={isActive ? COLORS.secondary : COLORS.muted}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardBody}>
                    <Text
                      style={[
                        styles.cardTitle,
                        !isActive && { color: COLORS.muted },
                      ]}
                      numberOfLines={2}
                    >
                      {displayTitle}
                    </Text>
                    <Text style={styles.cardSub} numberOfLines={1}>
                      {displayUrl}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* New Tab Button */}
        <TouchableOpacity
          style={styles.newTabBtn}
          onPress={handleNewTab}
          activeOpacity={0.75}
        >
          <View style={styles.newTabIconCircle}>
            <Ionicons name="add" size={18} color={COLORS.bg} />
          </View>
          <Text style={styles.newTabText}>New Tab</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  main: {
    paddingHorizontal: GRID_PADDING,
    // paddingTop is applied dynamically via insets.top + 20
    paddingBottom: 120,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 3,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  headerAddBtn: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Grid ────────────────────────────────────────────────────────────────────
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },

  cardWrapper: {
    width: CARD_WIDTH,
  },

  card: {
    width: "100%",
    height: CARD_HEIGHT,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    justifyContent: "space-between",
    overflow: "hidden",
  },

  activeCard: {
    backgroundColor: COLORS.surfaceHigh,
    borderColor: COLORS.borderActive,
    borderWidth: 1.5,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  activeTopBar: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    opacity: 0.9,
  },

  // ── Card internals ───────────────────────────────────────────────────────────
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  badgeActive: {
    backgroundColor: COLORS.primary,
  },

  badgeInactive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  badgeTextActive: {
    color: COLORS.bg,
  },

  badgeTextInactive: {
    color: COLORS.muted,
  },

  closeBtn: {
    padding: 2,
    opacity: 0.8,
  },

  cardBody: {
    gap: 4,
  },

  cardTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
  },

  cardSub: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 0.2,
  },

  // ── New Tab Button ───────────────────────────────────────────────────────────
  newTabBtn: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 16,
  },

  newTabIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  newTabText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});