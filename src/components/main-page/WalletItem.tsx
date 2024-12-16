import {ActivityIndicator, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {IWallet} from "@/src/types";
import {Link, useSegments} from "expo-router";
import { Dimensions } from 'react-native';
import {Image} from 'expo-image'
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import QRCode from "react-qr-code";
import React from "react";

const { width } = Dimensions.get('window');
const containerWidth = (width / 3) - 17;
type WalletItemProps = {
    wallet: IWallet,
    containerWidth?:number
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export default function WalletItem ({ wallet }:WalletItemProps) {
    const segments = useSegments()
    return (
        <Link href={`/(user)/menu/wallet/${wallet.id}`} asChild>
            <Pressable style={styles.container}>
                <View style={styles.image}>
                    <Image
                        source={{ uri: `${apiUrl}${wallet?.logo}` }}
                        style={styles.logo}
                        cachePolicy={'memory-disk'}
                    />
                </View>
            </Pressable>
        </Link>
    )
}
const styles = StyleSheet.create({
    container:{
        borderRadius: 20,
        width:containerWidth,
        display:'flex',
        flexDirection:'column',
        alignItems:"center",
        marginBottom:14

    },
    whiteText:{
        color:'white'
    },
    blackText:{
        color:'black'
    },
    logo:{
        width:'100%',
        // aspectRatio:1,
        objectFit:'cover',
        borderRadius:10,
        height:83
    },
    image:{
        width:'100%',
        borderRadius:10,
    },
    price:{
        color: Colors.light.tint
    }
})
