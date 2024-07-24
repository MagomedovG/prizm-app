import React from 'react';
import {Text, View, Image, StyleSheet, Button, TextInput, Clipboard, Alert, Pressable, ScrollView} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import { useCart } from "@/src/providers/CartProvider";
import wallets from "@/assets/data/wallet";
import UIButton from "@/src/components/UIButton";

import { AntDesign } from '@expo/vector-icons';
import HeaderLink from "@/src/components/HeaderLink";
// import * as Clipboard from 'expo-clipboard';

export default function walletId() {
    const router = useRouter();
    const { addItem } = useCart();
    const { id } = useLocalSearchParams();
    const wallet = wallets.find(w => w.id.toString() === id);

    if (!wallet) {
        return <Text>Кошелек не найден</Text>;
    }

    const copyToClipboard = () => {
        Clipboard.setString(wallet.prizm);
        Alert.alert('Кошелек скопирован!',wallet.prizm);
    };

    return (
        <View style={{ position: 'relative', flex: 1 }}>
            <Stack.Screen options={{
                headerShown: false,
                header: () => <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />,
            }} />
            <View style={styles.container}>

                <Text style={styles.name}>{wallet.name}</Text>
                <Image
                    source={{ uri: wallet.qr }}
                    style={styles.image}
                />
                {/*<Text style={styles.link}>{wallet.link}</Text>*/}
            </View>
            <Pressable onPress={copyToClipboard} style={styles.pressable}>
                {/*<TextInput*/}
                {/*    style={styles.input}*/}
                {/*    editable={false}*/}
                {/*    placeholder={wallet.prizm}*/}
                {/*    value={wallet.prizm}*/}
                {/*/>*/}
                <Text style={styles.input}>{wallet.prizm}</Text>
                <View style={styles.copyButtonContainer}>
                    <AntDesign name="copy1" size={15} color="#262626" />
                </View>
            </Pressable>


            <UIButton text={wallet.isAdmin ? 'Перевести PZM' : 'Ок'} isAdminWallet={true}/>
            {wallet.isAdmin && <Pressable style={styles.adminLink}>
                <Link href={'/(admin)/'} style={{textAlign:'center'}}>
                    Перейти в панель администратора
                </Link>
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
        marginVertical:28
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
    },
});
