import {Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {IWallet} from "@/src/types";
import {Link, useSegments} from "expo-router";
import { Dimensions, Image } from 'react-native';
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
    const {theme} = useCustomTheme()
    console.log(wallet?.logo)
    console.log(segments)
    return (
        <Link href={`${segments[0]}/menu/wallet/${wallet.id}`} asChild>
            <Pressable style={styles.container}>
                <View style={styles.image}>
                    <Image
                        source={{ uri: `${wallet?.logo}` }}
                        style={styles.logo}
                    />
                    {/* <QRCode
                        size={containerWidth-12}
                        value={wallet?.prizm_qr_code_url}
                    /> */}
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
        // aspectRatio:1,
        // borderWidth:6,
        // borderColor:'#fff',
        // height:83,
        borderRadius:10,
    },
    // title:{
    //     fontSize:14,
    //     fontWeight:'medium',
    //     marginTop:5,
    //     marginBottom:10,
    //     width:'100%',
    //     textAlign:'center'
    // },
    price:{
        color: Colors.light.tint
    }
})
