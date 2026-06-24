import { View, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBrowserNav } from '../../context/BrowserNavContext';

import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { RootTabParamList } from './types';

import BrowserScreen from '../screens/BrowserScreen';
import TabScreen from '../screens/TabScreen';
import BookMarkScreen from '../screens/BookMarkScreen';
import HistoryScreen from '../screens/HistoryScreen';

const COLORS = {
  surfaceContainerLowest: '#0e0e0e',
  surfaceContainerHighest: '#353434',
  primary: '#eeeded',
  secondary: '#c8c6c5',
  outlineVariant: '#444748',
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { canGoBack, canGoForward, goBack, goForward, goHome, tabs, activeTabId } = useBrowserNav();

  // Reference for storing the latest states to prevent re-binding the listener
  const lastStateRef = useRef({ state, activeTabId, tabs, goBack, goHome });

  useEffect(() => {
    lastStateRef.current = { state, activeTabId, tabs, goBack, goHome };
  }, [state, activeTabId, tabs, goBack, goHome]);

  useEffect(() => {
    const handleBackPress = () => {
      const { state: s, activeTabId: actId, tabs: ts, goBack: gb, goHome: gh } = lastStateRef.current;
      const activeRouteName = s.routes[s.index].name;

      if (activeRouteName === 'Home') {
        const activeTab = ts.find((t) => t.id === actId);
        if (activeTab && activeTab.canGoBack) {
          // If WebView can go back, navigate back inside the WebView
          gb();
          return true; // intercept back press
        } else if (activeTab && activeTab.hasNavigated) {
          // If at the root of page navigation but showing content, return to idle/home screen
          gh();
          return true; // intercept back press
        }
        // If already at root/idle screen, let default action exit the app
        return false;
      } else {
        // If on other screens, navigate back to Browser tab
        navigation.navigate('Home');
        return true; // intercept back press
      }
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || 12 }]}>
      <TouchableOpacity style={styles.navItem} onPress={goBack} disabled={!canGoBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={20} color={canGoBack ? COLORS.secondary : COLORS.outlineVariant} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={goForward} disabled={!canGoForward} activeOpacity={0.7}>
        <Ionicons name="arrow-forward" size={20} color={canGoForward ? COLORS.secondary : COLORS.outlineVariant} />
      </TouchableOpacity>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? COLORS.primary : COLORS.secondary;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

          if (!event.defaultPrevented) {
            if (route.name === 'Home' && focused) {
              goHome();
            } else if (!focused) {
              navigation.navigate(route.name);
            }
          }
        };
        return (
          <TouchableOpacity key={route.key} style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
            {options.tabBarIcon?.({ focused, color, size: 20 })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      id="bottom-tabs"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: styles.active.color,
        tabBarInactiveTintColor: styles.inactive.color,
        tabBarLabelStyle: styles.label,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={BrowserScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Tabs"
        component={TabScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "copy" : "copy-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Saved"
        component={BookMarkScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  active: {
    color: "#007AFF",
  },
  inactive: {
    color: "#8E8E93",
  }, bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceContainerHighest,
    paddingTop: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});