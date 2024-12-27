import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
// import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = {
    theme: string;
    setTheme: (theme: string) => void;
};

const CustomThemeContext = createContext<ThemeType>({
    theme: '',
    setTheme: () => {}
});

const CustomThemeProvider = ({ children }: PropsWithChildren) => {
    const [theme, setTheme] = useState<string>('purple'); 

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          await AsyncStorage.setItem('theme', theme); 
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    loadTheme();
  }, []);

  const changeTheme = async (newTheme: string) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

    return (
        <CustomThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
            {children}
        </CustomThemeContext.Provider>
    );
};

export default CustomThemeProvider;

export const useCustomTheme = () => useContext(CustomThemeContext);
