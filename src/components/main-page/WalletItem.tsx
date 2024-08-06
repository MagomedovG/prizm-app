import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {IWallet, Product} from "@/src/types";
import {Link, useSegments} from "expo-router";
import { Dimensions } from 'react-native';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const { width } = Dimensions.get('window');
const containerWidth = (width / 3) - 24;
type WalletItemProps = {
    wallet: IWallet,
    containerWidth?:number
}
export default function WalletItem ({ wallet, containerWidth }:WalletItemProps) {
    const segments = useSegments()
    const {theme} = useCustomTheme()
    console.log(segments)
    return (
        <Link href={`${segments[0]}/menu/wallet/${wallet.id}`} asChild>
            <Pressable style={styles.container}>
                <Image source={{uri: wallet.logo}} style={styles.image} resizeMode={"contain"}/>
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
        width:"100%",
        aspectRatio:1,

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
