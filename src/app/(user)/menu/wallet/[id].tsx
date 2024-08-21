import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Button,
    TextInput,
    Clipboard,
    Alert,
    Pressable,
    ScrollView,
    Dimensions
} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import { useCart } from "@/src/providers/CartProvider";
import wallets from "@/assets/data/wallet";
import UIButton from "@/src/components/UIButton";

import { AntDesign } from '@expo/vector-icons';
import HeaderLink from "@/src/components/HeaderLink";
import {IWallet} from "@/src/types";
import QRCode from "react-qr-code";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
// import * as Clipboard from 'expo-clipboard';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const { width } = Dimensions.get('window');
const containerWidth = ((width- 10) * 3 / 4) - 40 ;

export default function walletId() {
    const router = useRouter();
    const { addItem } = useCart();
    const { id } = useLocalSearchParams();
    console.log(id)
    const [wallet, setWallet] = useState<IWallet | null>(null)
    // const is_superuser:boolean | string =  asyncStorage.getItem('is_superuser')
    // const wallet = wallets.find(w => w.id.toString() === id);

    const routerTo = () => {
        if (id === 'user'){
            router.push('(user)/menu/share-prizm/')
        } else {
            router.back()
        }
    }

    // if (!wallet) {
    //     return <Text>Кошелек не найден</Text>;
    // }



    useEffect(() => {
        async function getFunds() {
            const userId = await asyncStorage.getItem('user_id')

            try {
                const response = await fetch(
                    id !== 'user' ?
                    `${apiUrl}/api/v1/funds/${id}/`
                    : `${apiUrl}/api/v1/users/${userId}/`
                    ,
                );
                const data = await response.json();
                console.log(data);
                setWallet(data);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/funds/${id}/`);
                // console.log(response);
            }
        }
        getFunds()
        console.log(containerWidth);
    },[])

    const copyToClipboard = () => {
        if (wallet?.prizm_wallet && typeof wallet.prizm_wallet === "string" && wallet) {
            Clipboard.setString(wallet.prizm_wallet);
        }
        Alert.alert('Кошелек скопирован!', wallet?.prizm_wallet)
    };

    return (
        <View style={{ position: 'relative', flex: 1 }}>
            <Stack.Screen options={{
                headerShown: false,
                header: () => <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />,
            }} />
            <View style={styles.container}>

                <Text style={styles.name}>{ id === 'user' ? 'Мой кошелек' : wallet?.title}</Text>
                {wallet?.prizm_qr_code_url &&
                    <View style={styles.image}>
                        <QRCode
                            size={containerWidth}
                            // style={{width: "100%", height: "100%" }}
                            value={wallet?.prizm_qr_code_url}
                            level={'M'}
                            // viewBox={`0 0 256 256`}
                            // style={styles.image}
                        />
                    </View>

                }

                {/*<Text style={styles.link}>{wallet.link}</Text>*/}
            </View>
            <Pressable onPress={copyToClipboard} style={styles.pressable}>
                {/*<TextInput*/}
                {/*    style={styles.input}*/}
                {/*    editable={false}*/}
                {/*    placeholder={wallet.prizm}*/}
                {/*    value={wallet.prizm}*/}
                {/*/>*/}
                <Text style={styles.input}>{wallet?.prizm_wallet}</Text>
                <View style={styles.copyButtonContainer}>
                    <AntDesign name="copy1" size={15} color="#262626" />
                </View>
            </Pressable>


            <UIButton text={id === 'user'  ? 'Перевести PZM' : 'Назад'} onPress={routerTo} isAdminWallet={true}/>
            {wallet?.is_superuser && id === 'user' && <Pressable style={styles.adminLink}>
            
            <Text style={{textAlign:'center'}}>
                    Перейти в панель администратора
                </Text>
            </Pressable>}
        </View>
    );
}

const styles = StyleSheet.create({
    pressable: {
        position: 'relative',
        marginHorizontal: 42,
        marginBottom: 20,
    },
    copyButtonContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#EFEFEF',
        borderRadius: 5,
        color: '#707070',
    },
    adminLink:{
        // marginHorizontal:50,
        position:'absolute',
        bottom:40,
        right:0,
        left:0,
        width:'100%',
        // textAlign:'center'
    },
    name: {
        marginVertical: 13,
        fontSize: 30,
        marginTop: 80
    },
    link: {
        marginVertical: 23,
        fontSize: 16
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        marginVertical:28,
        // marginRight:8
    },
    image: {
        width: '75%',
        marginHorizontal: 42,
        aspectRatio: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
        borderRadius:10,
        borderWidth:17,
        borderColor:'#fff'
    },
});
