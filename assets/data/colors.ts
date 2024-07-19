import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const { theme } = useCustomTheme();
export const darkColor = theme === 'purple' ? '#41146D' : '#32933C'
export const lightColor = theme === 'purple' ? '#5C2389' : '#CDF3C2'
export const borderColor = theme === 'purple' ? '#957ABC' : '#4D7440'
