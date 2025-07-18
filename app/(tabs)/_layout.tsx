import { Tabs } from "expo-router";
import { Home, Search, PlusSquare, Heart, User, Radio, Zap } from "lucide-react-native";
import React from "react";
import { colors, spacing, typography } from "@/constants/colors";
import { useLanguageStore } from "@/store/language-store";
import { Avatar } from "@/components/Avatar";
import { getCurrentUser } from "@/mocks/users";

export default function TabLayout() {
  const currentUser = getCurrentUser();
  const { t } = useLanguageStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarShowLabel: false,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: typography.sizes.xl,
          fontWeight: typography.weights.bold,
          color: colors.text,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Elenty.app",
          tabBarIcon: ({ color, focused }) => (
            <Home 
              color={color} 
              size={24} 
              fill={focused ? color : 'transparent'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('explore'),
          tabBarIcon: ({ color, focused }) => (
            <Search color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('create'),
          tabBarIcon: ({ color, focused }) => (
            <PlusSquare 
              color={color} 
              size={24} 
              fill={focused ? color : 'transparent'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: t('live'),
          tabBarIcon: ({ color, focused }) => (
            <Radio 
              color={color} 
              size={24} 
              fill={focused ? color : 'transparent'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: t('reels'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Zap 
              color={color} 
              size={24} 
              fill={focused ? color : 'transparent'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('notifications'),
          tabBarIcon: ({ color, focused }) => (
            <Heart 
              color={color} 
              size={24} 
              fill={focused ? color : 'transparent'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('messages'),
          tabBarIcon: ({ color, focused }) => (
            <User 
              color={color} 
              size={24} 
              fill={focused ? color : 'transparent'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}