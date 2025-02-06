import { View, Text, Pressable, StyleSheet } from "react-native";
import PrizmWallet from '@/src/utils/PrizmWallet';
import { useState } from "react";
import walletUtils from "@/src/utils/walletUtils"
export default function CreateWallet(){
    const [wallet, setWallet] = useState()
    const newWallet = new PrizmWallet(true)

    const generateWallet = ()=> {
        setWallet(newWallet.accountRs)
        walletUtils.logWallet()
        console.log('ddd',newWallet)
    }
    return(
        <View style={styles.container}>
            <Text>
                Создание кошелька
            </Text>
            <Pressable style={styles.button} onPress={generateWallet}>
                <Text style={styles.buttonText}>
                    Создать кошелек
                </Text>
            </Pressable>
            <Text>
                {wallet}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        display: 'flex',
        flexDirection:'column',
        alignItems:'center',
        marginTop:50
    },
    button:{
        padding:10,
        backgroundColor:'black',
        borderRadius:10,
        width:'50%',
        marginTop:100
    },
    buttonText:{
        color:'white',
        textAlign:'center',
    }
})