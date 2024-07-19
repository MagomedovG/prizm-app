import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import CartProvider from "@/src/providers/CartProvider";
import AuthProvider from "@/src/providers/AuthProvider";
import QueryProvider from "@/src/providers/QueryProvider";
import CustomThemeProvider from "@/src/providers/CustomThemeProvider";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <ThemeProvider value={colorScheme === 'dark' ? CustomDefaultTheme : CustomDefaultTheme}>
      {/*<AuthProvider>*/}
        <QueryProvider>
          <CartProvider>
            <CustomThemeProvider>
              <Stack>
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(admin)" options={{headerShown: false }} />
                <Stack.Screen name="(auth)" options={{headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </CustomThemeProvider>
          </CartProvider>
        </QueryProvider>

      {/*</AuthProvider>*/}
    </ThemeProvider>
  );
}
// import React, { useEffect, useState } from 'react';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import 'react-native-reanimated';
//
// import { useColorScheme } from '@/hooks/useColorScheme';
// import CartProvider from "@/src/providers/CartProvider";
// import AuthProvider from "@/src/providers/AuthProvider";
// import QueryProvider from "@/src/providers/QueryProvider";
// import CustomThemeProvider from "@/src/providers/CustomThemeProvider";
//
// import SetPinScreen from '@/src/app/pin/setpinscreen'; // Импорт экрана установки PIN-кода
// import PinScreen from '@/src/app/pin/pinscreen'; // Импорт экрана проверки PIN-кода
// import UserScreen from '@/src/app/(user)'; // Импорт основного экрана пользователя
//
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();
//
// const Stack = createStackNavigator();
//
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
//   });
//   const [isPinSet, setIsPinSet] = useState<boolean | null>(null);
//
//   const CustomDefaultTheme = {
//     ...DefaultTheme,
//     colors: {
//       ...DefaultTheme.colors,
//       background: 'white',
//     },
//   };
//
//   useEffect(() => {
//     const checkPinSetup = async () => {
//       const storedPin = await AsyncStorage.getItem('userPin');
//       setIsPinSet(!!storedPin);
//     };
//
//     checkPinSetup();
//
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);
//
//   if (!loaded || isPinSet === null) {
//     return null;
//   }
//
//   return (
//       <NavigationContainer>
//
//         <ThemeProvider value={colorScheme === 'dark' ? CustomDefaultTheme : CustomDefaultTheme}>
//           <QueryProvider>
//             <CartProvider>
//               <CustomThemeProvider>
//                 <Stack.Navigator screenOptions={{ headerShown: false }}>
//                   {!isPinSet ? (
//                       <Stack.Screen name="SetPin" component={SetPinScreen} />
//                   ) : (
//                       <Stack.Screen name="Pin" component={PinScreen} />
//                   )}
//                   <Stack.Screen name="User" component={UserScreen} />
//                 </Stack.Navigator>
//               </CustomThemeProvider>
//             </CartProvider>
//           </QueryProvider>
//         </ThemeProvider>
//       </NavigationContainer>
//
//   );
// }
