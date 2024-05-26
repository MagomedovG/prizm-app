import { Pressable, StyleSheet, Text, View } from 'react-native';
import {Colors} from '@/constants/Colors';
import { forwardRef } from 'react';

type ButtonProps = {
    text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const UIButton = forwardRef<View | null, ButtonProps>(
    ({ text, ...pressableProps }, ref) => {
        return (
            <Pressable ref={ref} {...pressableProps} style={styles.container}>
                <Text style={styles.text}>{text}</Text>
            </Pressable>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#6B6B6B',
        marginHorizontal:42,
        padding: 15,
        width:'80%',
        alignItems: 'center',
        borderRadius: 50,
        // marginVertical: 10,
        position:'absolute',
        bottom:40
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});

export default UIButton;
