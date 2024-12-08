import { Pressable, StyleSheet, Text, View } from 'react-native';
import { forwardRef } from 'react';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

type ButtonProps = {
    text: string;
    disabled?: boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const StaticButton = forwardRef<View | null, ButtonProps>(
    ({ text,disabled, ...pressableProps }, ref) => {
        const { theme } = useCustomTheme();
        return (
            <Pressable ref={ref} {...pressableProps} style={[styles.container, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]}>
                <Text style={[styles.text, {color: disabled ? '#BDBBBB' : 'white'}]}>{text}</Text>
            </Pressable>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        // marginHorizontal:42,
        padding: 15,
        width:'100%',
        alignItems: 'center',
        borderRadius: 13,
        // position:'absolute',
        // bottom:40,
        // zIndex:9999
    },
    purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});

export default StaticButton;
