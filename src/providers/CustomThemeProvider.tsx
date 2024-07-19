import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";

type ThemeType = {
    theme: string;
    setTheme: (theme: string) => void;
};

const CustomThemeContext = createContext<ThemeType>({
    theme: '',
    setTheme: () => {}
});

const CustomThemeProvider = ({ children }: PropsWithChildren) => {
    const { asyncTheme, changeTheme } = useAsyncTheme();
    const [theme, setTheme] = useState<string>(asyncTheme);

    return (
        <CustomThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </CustomThemeContext.Provider>
    );
};

export default CustomThemeProvider;

export const useCustomTheme = () => useContext(CustomThemeContext);
