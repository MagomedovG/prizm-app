import {Link, Redirect, Tabs} from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {useAuth} from "@/src/providers/AuthProvider";
import {is} from "@babel/types";

export default function TabLayout() {
  const colorScheme = useColorScheme();
    const { isAdmin } = useAuth()
    if (!isAdmin) {
        return <Redirect href={'/'}/>
    }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.background,
          tabBarInactiveTintColor: 'gainsboro',
        headerShown: false,
          tabBarStyle: {
            backgroundColor:Colors.light.tint
          }
      }}>
      <Tabs.Screen name="index" options={{href:null}}/>
        <Tabs.Screen name="create"  options={{ href:null, headerShown:true}}/>
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          // headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
            headerShown:false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
