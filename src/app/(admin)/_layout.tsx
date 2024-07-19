import {Link, Redirect, Stack, Tabs} from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
// import {useAuth} from "@/src/providers/AuthProvider";
import {is} from "@babel/types";

export default function TabLayout() {
  const colorScheme = useColorScheme();
    // const { isAdmin } = useAuth()
    // if (!isAdmin) {
    //     return <Redirect href={'/'}/>
    // }

  return (
      <Stack
          screenOptions={{
              headerShown: false,
          }}
      >
          {/*<Stack.Screen name="index" options={{title:"Menu", headerShown: false,}}/>*/}
      </Stack>
  );
}
