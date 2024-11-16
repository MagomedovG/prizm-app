import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
SplashScreen.preventAutoHideAsync();
import { Alert, LogBox } from 'react-native';
import CustomThemeProvider from '../providers/CustomThemeProvider';
import QueryProvider from '../providers/QueryProvider';

LogBox.ignoreAllLogs(true); 

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };
  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  

  return (
    <ThemeProvider value={CustomDefaultTheme}>
        <QueryProvider>
            <CustomThemeProvider>
              <Stack screenOptions={{headerShown:false}}>
              </Stack>
            </CustomThemeProvider>
        </QueryProvider>
    </ThemeProvider>
  );
}
