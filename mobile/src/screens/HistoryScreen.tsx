import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  TouchableOpacity,
} from "react-native";

const historyData = [
  { id: "1", title: "Scan Session #1", time: "2 mins ago" },
  { id: "2", title: "Scan Session #2", time: "10 mins ago" },
  { id: "3", title: "Scan Session #3", time: "1 hour ago" },
  { id: "4", title: "Scan Session #4", time: "Yesterday" },
];

const HistoryScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* List */}
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141313", // matches tailwind background
  },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e5e2e1",
  },

  list: {
    padding: 16,
  },

  card: {
    backgroundColor: "#1c1b1b",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e2e1",
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#8e9192",
    marginTop: 4,
  },
});