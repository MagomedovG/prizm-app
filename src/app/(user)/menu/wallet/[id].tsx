import React from 'react';
import {Text, View, Image, StyleSheet, Button, TextInput, Clipboard, Alert} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/src/providers/CartProvider";
import wallets from "@/assets/data/wallet";
import UIButton from "@/src/components/UIButton";

import { AntDesign } from '@expo/vector-icons';
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
        Alert.alert('Кошелек скопирован!','');
    };

    return (
        <View style={{ position: 'relative', flex: 1 }}>
            <View style={styles.container}>
                <Stack.Screen options={{ title: wallet?.name }} />
                <Text style={styles.name}>{wallet.name}</Text>
                <Image
                    source={{ uri: wallet.qr }}
                    style={styles.image}
                />
                <Text style={styles.link}>{wallet.link}</Text>
            </View>
            <TextInput
                style={styles.input}
                editable={false}
                placeholder={wallet.prizm}
                value={wallet.prizm}
            />
            <View style={styles.copyButtonContainer}>

                <Text onPress={copyToClipboard} style={styles.copyButton}>Скопировать</Text>
                <AntDesign name="copy1" size={15} color="#262626" />
            </View>

            <UIButton text='Готово' />
        </View>
    );
}

const styles = StyleSheet.create({
    copyButtonContainer:{
        marginHorizontal: 42,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:5
    },
    copyButton:{
        color:'#262626',

        fontSize:16
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 25,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#EFEFEF',
        borderRadius: 5,
        color: '#707070',
        marginHorizontal: 42
    },
    name: {
        marginVertical: 50,
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
    },
    image: {
        width: '90%',
        aspectRatio: 1
    },
});
