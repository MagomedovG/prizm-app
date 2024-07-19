import { Pressable, StyleSheet, Text, View } from 'react-native';
import {Colors} from '@/constants/Colors';
import { forwardRef } from 'react';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {lightColor} from "@/assets/data/colors";
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";

type ButtonProps = {
    text: string;
    isAdminWallet?:boolean;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const UIButton = forwardRef<View | null, ButtonProps>(
    ({isAdminWallet, text, ...pressableProps }, ref) => {
        const { theme } = useCustomTheme();
        const {asyncTheme} = useAsyncTheme()
        console.log(theme, asyncTheme)
        return (
            <Pressable ref={ref} {...pressableProps} style={[styles.container, theme === 'purple' ? styles.purpleBackground : styles.greenBackground, isAdminWallet && {bottom: 70}]}>
                <Text style={styles.text}>{text}</Text>
            </Pressable>
        );
    }
);

const styles = StyleSheet.create({

    container: {
        // backgroundColor: lightColor,//41146D
        marginHorizontal:42,
        padding: 15,
        width:'80%',
        alignItems: 'center',
        borderRadius: 13,
        // marginVertical: 10,
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
