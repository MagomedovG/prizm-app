import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AntDesign} from "@expo/vector-icons";

const CreateWallet = () => {
    const [wallet, setWallet] = useState('Кошелек');
    const [sid, setSid] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation');
    const [isNameSet, setIsNameSet] = useState(false);
    const router = useRouter();

    const copyWalletToClipboard = () => {
        Clipboard.setString(wallet);
        Alert.alert('Кошелек скопирован!','');
    };
    const copySidToClipboard = () => {
        Clipboard.setString(sid);
        Alert.alert('Сид-фраза скопирована!','');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
            <View style={{paddingHorizontal: 26, width: '100%'}}>
                <Text style={styles.title}>
                    Новый кошелек
                </Text>
                <Text style={styles.label}>Адрес нового кошелька</Text>
                <Pressable onPress={copyWalletToClipboard} style={[styles.pressable, {marginBottom: 43}]}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        placeholder={'wallet'}
                        value={wallet}
                    />
                    <View style={[styles.copyButtonContainer, {bottom:0}]}>
                        <AntDesign name="copy1" size={15} color="#262626" />
                    </View>
                </Pressable>
                <Text style={styles.label}>Парольная фраза</Text>
                <Pressable onPress={copySidToClipboard} style={[styles.pressable, {marginBottom: 7}]}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        multiline={true}
                        placeholder={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation'}
                        value={sid}
                    />
                    <View style={[styles.copyButtonContainer, {top:16,right: 15}]}>
                        <AntDesign name="copy1" size={15} color="#262626" />
                    </View>
                </Pressable>
                <Text style={{marginLeft:9}}>Обязательно сохраните сид-фразу! Ее нельзя
                    будет получить еще раз.</Text>
            </View>
            <UIButton text='Я сохранил сид-фразу' onPress={()=>{console.log('ss')}}/>
        </View>
    );
};

export default CreateWallet;

const styles = StyleSheet.create({
    pressable: {
        position: 'relative',
    },
    copyButtonContainer: {
        position: 'absolute',
        right: 15,
        top: 0,
        // bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label:{
        color:'#B6B6B6',
        fontSize:14,
        marginLeft:9
    },
    createWallet:{
        marginHorizontal:42,
        alignItems: 'center',
        marginVertical: 15,
        position:'absolute',
        bottom:95
    },
    input: {
        borderWidth: 1,
        borderColor: '#957ABC',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        fontSize:18,
        color: '#000000',
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#957ABC'
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        marginTop:88,
        alignItems: 'center',
        position:'relative'
    },
    title: {
        color: '#070907',
        marginBottom: 40,
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
