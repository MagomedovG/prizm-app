import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { forwardRef } from 'react';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

type ButtonProps = {
    text: string;
    disabled?: boolean;
    isLoading?:boolean
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const StaticButton = forwardRef<View | null, ButtonProps>(
    ({ text,disabled,isLoading, ...pressableProps }, ref) => {
        const { theme } = useCustomTheme();
        return (
            <Pressable ref={ref} disabled={disabled} {...pressableProps} style={[styles.container, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]}>
                <Text style={[styles.text, {color: disabled ? '#BDBBBB' : 'white'}]}>
                    {isLoading ? <ActivityIndicator/> : text}
                </Text>
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
