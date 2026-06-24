import AsyncStorage from "@react-native-async-storage/async-storage";

export type HistoryEntry = {
  id: string;
  title: string;
  url: string;
  visitedAt: number;
};

const KEY = "browse_history";
const MAX_ENTRIES = 100;

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

async function saveHistory(entries: HistoryEntry[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(entries));
  } catch (e) {
    console.log("History save error:", e);
  }
}

export async function addHistoryEntry(entry: { title: string; url: string }) {
  const existing = await getHistory();
  const withoutDuplicate = existing.filter((item) => item.url !== entry.url);
  const updated: HistoryEntry[] = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: entry.title,
      url: entry.url,
      visitedAt: Date.now(),
    },
    ...withoutDuplicate,
  ].slice(0, MAX_ENTRIES);

  await saveHistory(updated);
  return updated;
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.log("History clear error:", e);
  }
}

export function formatVisitedAt(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString();
}
