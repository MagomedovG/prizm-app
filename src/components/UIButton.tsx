import { Pressable, StyleSheet, Text, View } from 'react-native';
import { forwardRef } from 'react';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

type ButtonProps = {
    text: string;
    isAdminWallet?:boolean;
    disabled?: boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const UIButton = forwardRef<View | null, ButtonProps>(
    ({isAdminWallet, text,disabled, ...pressableProps }, ref) => {
        const { theme } = useCustomTheme();
        return (
            <Pressable ref={ref} {...pressableProps} style={[styles.container, theme === 'purple' ? styles.purpleBackground : styles.greenBackground, isAdminWallet && {bottom: 70}]}>
                <Text style={[styles.text, {color: disabled ? '#BDBBBB' : 'white'}]}>{text}</Text>
            </Pressable>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        marginHorizontal:42,
        padding: 15,
        width:'80%',
        alignItems: 'center',
        borderRadius: 13,
        position:'absolute',
        bottom:40,
        zIndex:9999
    },
    purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});

export default UIButton;
