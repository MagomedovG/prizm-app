// import { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

// export const useAsyncTheme = () => {
//     const [asyncTheme, setAsyncTheme] = useState('purple');
//     const {setTheme} = useCustomTheme()
    
//     useEffect(() => {
//         const loadTheme = async () => {
//             try {
//                 const savedTheme = await AsyncStorage.getItem('theme');
//                 if (savedTheme !== null) {
//                     setAsyncTheme(savedTheme);
//                     setTheme(savedTheme)
//                 } else {
//                     await AsyncStorage.setItem('theme',asyncTheme);
//                 }
//             } catch (error) {
//                 console.error('Failed to load theme', error);
//             }
//         };
//         loadTheme();
//     }, []);

//     const changeTheme = async (newTheme:any) => {
//         try {
//             setAsyncTheme(newTheme);
//             setTheme(newTheme)
//             await AsyncStorage.setItem('theme', newTheme);
//         } catch (error) {
//             console.error('Failed to save theme', error);
//         }
//     };

//     return { asyncTheme, changeTheme };
// };
