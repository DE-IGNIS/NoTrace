import AsyncStorage from "@react-native-async-storage/async-storage";

export type Bookmark = {
  title: string;
  url: string;
};

const KEY = "bookmarks";

export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveBookmarks(bookmarks: Bookmark[]) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.log("Save error:", e);
  }
}

export async function addBookmark(newBookmark: Bookmark) {
  const existing = await getBookmarks();

  // avoid duplicates
  const alreadyExists = existing.some((b) => b.url === newBookmark.url);

  if (!alreadyExists) {
    const updated = [...existing, newBookmark];
    await saveBookmarks(updated);
    return updated;
  }

  return existing;
}

export async function removeBookmark(url: string) {
  const existing = await getBookmarks();
  const updated = existing.filter((b) => b.url !== url);
  await saveBookmarks(updated);
  return updated;
}
