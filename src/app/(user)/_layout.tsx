import {Stack, Tabs, useRouter} from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as Network from 'expo-network';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function UserLayout() {
  // const colorScheme = useColorScheme();
  const router = useRouter()
  const replaceToPin = () => router.replace('/pin/setpinscreen')
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        Alert.alert(
          "Нет соединения",
          "Пожалуйста, проверьте интернет-соединение.",
          [{ text: "OK" ,
            onPress: () => {
                replaceToPin()
            }
          }]
        );
      }
    });

    return () => unsubscribe();
  }, [NetInfo]);
  
  return (
    <Stack screenOptions={{headerShown:false}}/>
  );
}
