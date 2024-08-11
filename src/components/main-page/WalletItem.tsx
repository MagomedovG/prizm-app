import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {IWallet, Product} from "@/src/types";
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
                        // style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={wallet?.prizm_qr_code_url}
                        // viewBox={`0 0 256 256`}
                        // size={40}
                        // style={{width:'100%', height:'100%'}}
                        // level={'L'}
                    />
                </View>

                {/*<Image source={{uri: wallet.logo}} style={styles.image} resizeMode={"contain"}/>*/}
                <Text style={[styles.title, theme === 'purple' ? styles.whiteText : styles.blackText]}>{wallet.title}</Text>

            </Pressable>
        </Link>
    )
}
const styles = StyleSheet.create({
    container:{
        // flex:1,
        // backgroundColor: 'white',
        // padding:10,
        borderRadius: 20,
        width:containerWidth,
        // aspectRatio:1,
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
        // height:114,
        borderWidth:6,
        borderColor:'#fff',
        // borderWidth:1,
        borderRadius:10,
        // borderColor: 'black'
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
