import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable} from "react-native";
import {Stack, useRouter, Link} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { useFocusEffect } from '@react-navigation/native';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const SetWallet = () => {

    const [name, setName] = useState('');
    const router = useRouter();
    const { theme } = useCustomTheme();

    const postForm = async () => {
        const username = await asyncStorage.getItem('username')
        const public_key_hex = await asyncStorage.getItem('public_key_hex')
        const prizm_wallet = name
        const walletName = await AsyncStorage.getItem('prizm_wallet');
        const isUpdatedName = walletName ? JSON.parse(walletName) !== name : true
        
        const form = {
            username,
            prizm_wallet,
            ...(public_key_hex && !isUpdatedName && { public_key_hex: JSON.parse(public_key_hex) })
        };
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/get-or-create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            
            if (response.ok) {
                router.replace('/(user)/menu');
                await asyncStorage.setItem('username', JSON.stringify(data?.username))
                await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.prizm_wallet))
                await asyncStorage.setItem('is_superuser', JSON.stringify(data?.is_superuser));
                await asyncStorage.setItem('user_id', JSON.stringify(data?.id))
            } else {
                const result = data?.username ? data?.username[0] : data?.prizm_wallet ? data?.prizm_wallet[0] : 'Ошибка'
                Alert.alert(result)
                throw new Error('Ошибка сети');
            }
        } catch (error) {
            await AsyncStorage.removeItem('username')
            await AsyncStorage.removeItem('prizm_wallet')
            router.replace('/pin/setnickname');
        }
    };
    
    useFocusEffect(
        React.useCallback(() => {
            const getAsyncName = async () => {
                const walletName = await AsyncStorage.getItem('prizm_wallet');
                if (walletName) {
                    setName(JSON.parse(walletName));
                }
            };
            getAsyncName();
        }, [])
    );
    


    const setWallet = async () => {
        if (name.length === 0) {
            return
        }
        postForm();
    }
    
    const handleNameChange = (text: string) => {
            setName(text);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'SetNickName', headerShown: false }} />
            <View style={{paddingHorizontal: 45, width: '100%'}}>
                <Text style={styles.title}>
                    Вставьте адрес кошелька
                </Text>
                <View style={[styles.inputContainer, theme === 'purple' ? {} : {borderColor:'#32933C'}]}>
                    <TextInput
                        placeholder="PRIZM-1234-..."
                        value={name}
                        onChangeText={handleNameChange}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
            </View>
                <Link asChild href="/pin/setnickname/LoginScreen" style={styles.createWallet}>
                    <Pressable>
                        <Text style={{color:'#000000'}}>
                            У меня нет кошелька
                        </Text>
                    </Pressable>
                </Link>
            <UIButton text='Ок' onPress={setWallet}/>
        </View>
    );
};

export default SetWallet;

const styles = StyleSheet.create({
    createWallet:{
        marginHorizontal:42,
        alignItems: 'center',
        marginVertical: 15,
        position:'absolute',
        bottom:95
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical:12,
        paddingLeft:12,
        width: '100%',
        fontSize: 16,
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#957ABC'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative'
    },
    title: {
        color: '#6A6A6A',
        marginBottom: 40,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'medium'
    },
    suggest: {
        marginTop:5,
        marginLeft:5,
        fontSize: 11,
        color:'#000',
        opacity:0.4
    }
});
