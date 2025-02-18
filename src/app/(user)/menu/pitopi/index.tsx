import StaticButton from "@/src/components/StaticButton";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { useFocusEffect, useRouter } from "expo-router";
import React from "react";
import { forwardRef, useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions, Linking, Pressable, Text, ActivityIndicator, Alert } from "react-native";
const { width } = Dimensions.get("window");
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
type ButtonProps = {
    text: string;
    disabled?: boolean;
    isLoading?:boolean
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const PiToPiButton = forwardRef<View | null, ButtonProps>(
    ({ text,disabled,isLoading, ...pressableProps }, ref) => {
        const { theme } = useCustomTheme();
        return (
            <Pressable ref={ref} {...pressableProps} style={[styles.PiToPiButtoncontainer, theme === 'purple' ? {backgroundColor:disabled ? '#AF94CA' : '#41146D'} : {backgroundColor:disabled ? '#91C797' : '#32933C'} ]}>
                <Text style={[styles.PiToPiButtontext, {color: 'white'}]}>
                    {text}
                </Text>
            </Pressable>
        );
    }
);
export default function PiToPiScreen() {
    const [isP2PAvailable, setIsP2PAvailable] = useState<boolean>(false);
    const [p2pUrl, setP2pUrl] = useState<null | string>(null);
    const router = useRouter()
    const getSettings = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/utils/settings/?ids=is_p2p_available,p2p_url`);
            const data = await response.json();
            if (response.ok) {
                console.log(data);

                const isAvailable = data?.is_p2p_available;
                const url = data?.p2p_url;
                const isValidUrl = typeof url === "string" && url.startsWith("http");

                setIsP2PAvailable(isAvailable && isValidUrl);
                setP2pUrl(isValidUrl ? url : null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getSettings();
        }, [])
    )

    const handleP2PPress = () => {
        if (isP2PAvailable && p2pUrl) {
            Linking.openURL(p2pUrl);
        } else{
            Alert.alert(
                'P2P временно недоступен'
            )
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                source={require("@/assets/images/p2picon.png")}  
                style={styles.image} 
                resizeMode="cover"
            />
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <StaticButton text="Продать" onPress={()=>router.push('/(user)/menu/exchanger')}/>
                </View>
                <View style={styles.button}>
                    <PiToPiButton 
                        text="P2P" 
                        onPress={handleP2PPress} 
                        disabled={!isP2PAvailable} 
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 60,
        display:"flex",

        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: width - 120,  
        height: (width - 120) * 1.15, 
    },
    buttonContainer: {
        display:"flex",
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginVertical: 85,
    },
    button: {
        width: '48%',
    },
    PiToPiButtoncontainer: {
        padding: 15,
        width:'100%',
        alignItems: 'center',
        borderRadius: 13,
    },
    PiToPiButtontext: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
});
