import {Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {IWallet} from "@/src/types";
import {Link, useSegments} from "expo-router";
import { Dimensions } from 'react-native';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import QRCode from "react-qr-code";
import React from "react";

const { width } = Dimensions.get('window');
const containerWidth = (width / 3) - 24;
type WalletItemProps = {
    wallet: IWallet,
    containerWidth?:number
}
export default function WalletItem ({ wallet }:WalletItemProps) {
    const segments = useSegments()
    const {theme} = useCustomTheme()
    console.log(segments)
    return (
        <Link href={wallet.id ? `${segments[0]}/menu/wallet/${wallet.id}` : '/(user)/menu/'} asChild>
            <Pressable style={styles.container}>
                <View style={styles.image}>
                    <QRCode
                        size={containerWidth-12}
                        value={wallet?.prizm_qr_code_url}
                    />
                </View>
                <Text style={[styles.title, theme === 'purple' ? styles.whiteText : styles.blackText]}>{wallet.title}</Text>
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

    },
    whiteText:{
        color:'white'
    },
    blackText:{
        color:'black'
    },
    image:{
        width:'100%',
        aspectRatio:1,
        borderWidth:6,
        borderColor:'#fff',
        borderRadius:10,
    },
    title:{
        fontSize:14,
        fontWeight:'medium',
        marginTop:5,
        marginBottom:10,
        width:'100%',
        textAlign:'center'
    },
    price:{
        color: Colors.light.tint
    }
})
