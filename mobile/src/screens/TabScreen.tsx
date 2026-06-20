import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function TabScreen() {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      {/* <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="security" size={22} color="#eeeded" />
          <Text style={styles.logoText}>NOTRACE</Text>
        </View>

        <View style={styles.headerIcons}>
          <Ionicons name="search-outline" size={22} color="#c8c6c5" />
          <MaterialIcons name="vpn-key" size={22} color="#eeeded" />
        </View>
      </View> */}

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

          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={22} color="#2f3131" />
          </TouchableOpacity>
        </View>

        {/* Tabs Grid */}
        <View style={styles.grid}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                tab.active && styles.activeCard,
              ]}
            >
              <View style={styles.cardTop}>
                <Text
                  style={[
                    styles.badge,
                    tab.active ? styles.badgeActive : styles.badgeInactive,
                  ]}
                >
                  {tab.id}
                </Text>
                <Ionicons
                  name="close"
                  size={14}
                  color="#c8c6c5"
                  style={{ opacity: 0.5 }}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.cardTitle,
                    !tab.active && { color: "#c8c6c5" },
                  ]}
                  numberOfLines={1}
                >
                  {tab.title}
                </Text>
                <Text style={styles.cardSub} numberOfLines={1}>
                  {tab.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* New Tab */}
        <TouchableOpacity style={styles.newTab}>
          <Ionicons name="add-circle-outline" size={20} color="#c8c6c5" />
          <Text style={styles.newTabText}>NEW INSTANCE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      {/* <View style={styles.bottomNav}>
        <NavItem icon="home-outline" label="HOME" />
        <NavItem icon="layers" label="TABS" active />
        <NavItem icon="bookmark-outline" label="SAVED" />
        <NavItem icon="time-outline" label="HISTORY" />
      </View> */}
    </View>
  );
}

const NavItem = ({ icon, label, active }) => (
  <View style={styles.navItem}>
    <Ionicons
      name={icon}
      size={22}
      color={active ? "#eeeded" : "#c8c6c5"}
    />
    <Text
      style={[
        styles.navText,
        active && { color: "#eeeded" },
      ]}
    >
      {label}
    </Text>
  </View>
);

/* Sample Data */
const tabs = [
  {
    id: "S_01",
    title: "TERMINAL ALPHA",
    subtitle: "tty/pts/0 — Secure",
    active: true,
  },
  {
    id: "S_04",
    title: "SECURE SEARCH",
    subtitle: "Anonymous Query",
  },
  {
    id: "S_09",
    title: "ENCRYPTED MAIL",
    subtitle: "PGP Protocol",
  },
  {
    id: "S_12",
    title: "NODE MAP",
    subtitle: "Global Relay",
  },
];

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141313",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#353434",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoText: {
    color: "#eeeded",
    fontWeight: "800",
    fontSize: 18,
  },

  headerIcons: {
    flexDirection: "row",
    gap: 16,
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

  card: {
    width: "48%",
    height: 100,
    backgroundColor: "#201f1f",
    borderWidth: 1,
    borderColor: "#222",
    padding: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#d1d1d1",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#0e0e0e",
    borderTopWidth: 1,
    borderColor: "#353434",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 9,
    color: "#c8c6c5",
  },
});