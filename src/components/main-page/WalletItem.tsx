import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {IWallet, Product} from "@/src/types";
import {Link, useSegments} from "expo-router";

type WalletItemProps = {
    wallet: IWallet
}
export default function WalletItem ({wallet}:WalletItemProps) {
    const segments = useSegments()
    console.log(segments)
    return (
        <Link href={`${segments[0]}/menu/wallet/${wallet.id}`} asChild>
            <Pressable style={styles.container}>
                <Image source={{uri: wallet.qr}} style={styles.image} resizeMode={"contain"}/>
                <Text style={styles.title}>{wallet.name}</Text>

            </Pressable>
        </Link>
    )
}
const styles = StyleSheet.create({
    container:{
        // flex:1,
        // backgroundColor: 'white',
        padding:10,
        borderRadius: 20,
        width:110,
        // aspectRatio:1,
        display:'flex',
        flexDirection:'column',
        alignItems:"center",

    },
    image:{
        width:"100%",
        aspectRatio:1,

        // borderWidth:1,
        // borderRadius:5,
        // borderColor: 'black'
    },
    title:{
        fontSize:18,
        fontWeight:'600',
        marginVertical:10
    },
    price:{
        color: Colors.light.tint
    }
})
