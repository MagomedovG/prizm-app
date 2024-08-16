import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const SetNickName = () => {
    const [name, setName] = useState('');
    const [asyncName, setAsyncName] = useState(null);
    const [isNameSet, setIsNameSet] = useState(false);
    const router = useRouter();

    const postForm = async () => {
        const username = await asyncStorage.getItem('username')
        const prizm_wallet = await asyncStorage.getItem('prizm_wallet')
        const form = {
            username,
            prizm_wallet
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/users/get-or-create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error('Ошибка сети');
            } else {
                await asyncStorage.setItem('username', JSON.stringify(data?.username))
                await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.prizm_wallet))
                await asyncStorage.setItem('is_superuser', JSON.stringify(data?.is_superuser));
                await asyncStorage.setItem('user_id', JSON.stringify(data?.id))
                console.log('asyncstorage', asyncStorage.getItem('username'),asyncStorage.getItem('prizm_wallet'),asyncStorage.getItem('is_superuser'),asyncStorage.getItem('user_id'))
            }

            console.log('Успешно создано:', data);
        } catch (error) {
            console.error('Ошибка при создании:', error);
        }
    };

    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('userNamess');
            const walletName = await AsyncStorage.getItem('walletAddressss');
            if (userName && walletName) {
                router.replace('/(user)')
            }
        };

        getAsyncName();
    }, [isNameSet])

    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('username');
            setAsyncName(userName);
            if (userName) {
                setIsNameSet(true);
            }
        };

        getAsyncName();
    }, [isNameSet])

    const setNickName = async () => {
        if (!isNameSet) {
            console.log(isNameSet);
            await AsyncStorage.setItem('username', name);
            setIsNameSet(true);
            console.log(isNameSet);
            Alert.alert('Имя пользователя сохранено');
        } else {
            await AsyncStorage.setItem('prizm_wallet', name);
            postForm()
            Alert.alert('Адрес кошелька сохранен');
            router.replace('/(user)/menu');
        }
        setName('');
    }
    const createwallet = () => {
        router.push('/pin/createwallet');
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'SetNickName', headerShown: false }} />
            <View style={{paddingHorizontal: 45, width: '100%'}}>
                <Text style={styles.title}>
                    {isNameSet ? 'Введите адрес кошелька' : 'Придумайте имя пользователя'}
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={isNameSet ? "PRIZM-1234567890" : "username"}
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
            </View>
            {
                isNameSet && <Pressable style={styles.createWallet} onPress={createwallet}>
                    <Text style={{color:'#B6B6B6'}}>
                        Хочу создать кошелек
                    </Text>
                </Pressable>
            }

            <UIButton text='Ок' onPress={setNickName}/>
        </View>
    );
};

export default SetNickName;

const styles = StyleSheet.create({
    createWallet:{
        marginHorizontal:42,
        alignItems: 'center',
        marginVertical: 15,
        position:'absolute',
        bottom:95
    },
    input: {
        padding: 16,
        width: '100%',
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
    }
});
