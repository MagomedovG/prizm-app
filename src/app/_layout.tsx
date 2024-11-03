import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import QueryProvider from "@/src/providers/QueryProvider";
import CustomThemeProvider from "@/src/providers/CustomThemeProvider";
SplashScreen.preventAutoHideAsync();
import { Alert, LogBox } from 'react-native';

LogBox.ignoreAllLogs(true); 

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <ThemeProvider value={colorScheme === 'dark' ? CustomDefaultTheme : CustomDefaultTheme}>
        <QueryProvider>
            <CustomThemeProvider>
              <Stack screenOptions={{headerShown:false}}>
              </Stack>
            </CustomThemeProvider>
        </QueryProvider>
    </ThemeProvider>
  );
}
