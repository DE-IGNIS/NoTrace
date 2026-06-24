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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "../navigation/types";
import { useBrowserNav } from "../../context/BrowserNavContext";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function TabScreen() {
  const { tabs, activeTabId, createTab, closeTab, switchTab } = useBrowserNav();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  // Animation values for entering and exiting cards
  const fadeAnims = useRef<{ [key: string]: Animated.Value }>({}).current;
  const slideAnims = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Make sure we have animated values for all tabs
  tabs.forEach((tab) => {
    if (!fadeAnims[tab.id]) {
      fadeAnims[tab.id] = new Animated.Value(0);
    }
    if (!slideAnims[tab.id]) {
      slideAnims[tab.id] = new Animated.Value(30);
    }
  });

  useFocusEffect(
    useCallback(() => {
      // Reset animations
      tabs.forEach((tab) => {
        fadeAnims[tab.id].setValue(0);
        slideAnims[tab.id].setValue(30);
      });

      // Staggered entry animation
      const animations = tabs.map((tab) =>
        Animated.parallel([
          Animated.timing(fadeAnims[tab.id], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnims[tab.id], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );

      Animated.stagger(50, animations).start();
    }, [tabs, fadeAnims, slideAnims])
  );

  const handleCloseTab = (tabId: string) => {
    // Fade out and slide down
    Animated.parallel([
      Animated.timing(fadeAnims[tabId], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnims[tabId], {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Layout animation for structural shifts
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      closeTab(tabId);
    });
  };

  const handleSelectTab = (tabId: string) => {
    switchTab(tabId);
    navigation.navigate('Home');
  };

  const handleNewTab = () => {
    createTab();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.main}>
        {/* Toggle */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggle}>
            <Text style={styles.toggleActive}>STANDARD</Text>
            <Text style={styles.toggleText}>INCOGNITO</Text>
          </View>
        </View>

        {/* Header Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.title}>Open Sessions</Text>
            <Text style={styles.subtitle}>VOLATILE MEMORY</Text>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleNewTab}>
            <Ionicons name="add" size={22} color="#2f3131" />
          </TouchableOpacity>
        </View>

        {/* Tabs Grid */}
        <View style={styles.grid}>
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTabId;
            const fAnim = fadeAnims[tab.id] || new Animated.Value(1);
            const sAnim = slideAnims[tab.id] || new Animated.Value(0);

            // Format displayed title and url/subtitle
            const displayTitle = tab.title || 'New Tab';
            const displayUrl = tab.hasNavigated ? tab.url : 'No site loaded';

            return (
              <Animated.View
                key={tab.id}
                style={[
                  styles.cardContainer,
                  {
                    opacity: fAnim,
                    transform: [{ translateY: sAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSelectTab(tab.id)}
                  style={[
                    styles.card,
                    isActive && styles.activeCard,
                  ]}
                >
                  <View style={styles.cardTop}>
                    <Text
                      style={[
                        styles.badge,
                        isActive ? styles.badgeActive : styles.badgeInactive,
                      ]}
                    >
                      {`S_${String(index + 1).padStart(2, '0')}`}
                    </Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleCloseTab(tab.id);
                      }}
                      style={styles.closeBtn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name="close"
                        size={16}
                        color="#c8c6c5"
                        style={{ opacity: 0.7 }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.cardTitle,
                        !isActive && { color: "#c8c6c5" },
                      ]}
                      numberOfLines={1}
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

        {/* New Tab */}
        <TouchableOpacity style={styles.newTab} onPress={handleNewTab}>
          <Ionicons name="add-circle-outline" size={20} color="#c8c6c5" />
          <Text style={styles.newTabText}>NEW INSTANCE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141313",
  },

  main: {
    padding: 16,
    paddingBottom: 100,
  },

  toggleWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: "#0e0e0e",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#353434",
    overflow: "hidden",
  },

  toggleText: {
    padding: 8,
    color: "#c8c6c5",
    fontSize: 10,
  },

  toggleActive: {
    padding: 8,
    backgroundColor: "#eeeded",
    color: "#2f3131",
    fontSize: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: "#eeeded",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#c8c6c5",
    fontSize: 10,
    marginTop: 2,
    opacity: 0.6,
  },

  addBtn: {
    backgroundColor: "#eeeded",
    padding: 10,
    borderRadius: 6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardContainer: {
    width: "48%",
    marginBottom: 10,
  },

  card: {
    width: "100%",
    height: 100,
    backgroundColor: "#201f1f",
    borderWidth: 1,
    borderColor: "#222",
    padding: 10,
    justifyContent: "space-between",
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#d1d1d1",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    fontSize: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  badgeActive: {
    backgroundColor: "#eeeded",
    color: "#2f3131",
  },

  badgeInactive: {
    borderWidth: 1,
    borderColor: "#404040",
    color: "#c8c6c5",
  },

  closeBtn: {
    padding: 4,
  },

  cardTitle: {
    color: "#eeeded",
    fontSize: 12,
    fontWeight: "700",
  },

  cardSub: {
    color: "#c8c6c5",
    fontSize: 9,
    opacity: 0.6,
  },

  newTab: {
    marginTop: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#333",
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  newTabText: {
    color: "#c8c6c5",
    fontSize: 10,
    letterSpacing: 1,
  },
});