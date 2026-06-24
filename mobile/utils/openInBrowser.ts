import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '../src/navigation/types';

export type TabNavigation = BottomTabNavigationProp<RootTabParamList>;

export function openInBrowser(
  navigation: TabNavigation,
  url: string,
  title?: string
) {
  navigation.navigate('Home', { url, title, t: Date.now() });
}
