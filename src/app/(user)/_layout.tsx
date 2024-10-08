import {Link, Redirect, Tabs} from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import UIButton from "@/src/components/UIButton";

export default function TabLayout() {
  const colorScheme = useColorScheme();
    // const { session } = useAuth()
    // if (!session) {
    //     return <Redirect href={'/'}/>
    // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen name="index" options={{href:null}}/>
      <Tabs.Screen
        name="menu"
        options={{
            headerShown: false,
          title: 'Menu',
          tabBarStyle: { display: 'none' },
          // headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
