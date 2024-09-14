import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const SetNickName = () => {
    const [name, setName] = useState('');
    const [asyncName, setAsyncName] = useState<string | null>(null);
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const router = useRouter();

    const postName = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/?username=${name}`,{
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            

            const data = await response.json();
            console.log(data)
            if (data.length < 1) {
                setIsNameSet(true);
                await AsyncStorage.setItem('usernamess', name);
            } else {
                Alert.alert('Имя пользователя занято')
                
            }

            if (!response.ok) {
                throw new Error('Ошибка сети');
            } else {
            }

            console.log('Успешно создано:', data);
        } catch (error) {
            console.error('Ошибка при создании:', error);
        }
    };

    const postForm = async () => {
        const username = await asyncStorage.getItem('username')
        const prizm_wallet = name
        
        const form = {
            username,
            prizm_wallet
        }

        try {
            console.log(`${apiUrl}/api/v1/users/get-or-create/`)
            console.log(form)
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
                Alert.alert('Такой пары имя - кошелек нет в базе')
                setIsNameSet(false);
            } else {
                Alert.alert('Адрес кошелька сохранен');
                router.replace('/(user)/menu');
                await asyncStorage.setItem('username', JSON.stringify(data?.username))
                await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.prizm_wallet))
                await asyncStorage.setItem('is_superuser', JSON.stringify(data?.is_superuser));
                await asyncStorage.setItem('user_id', JSON.stringify(data?.id))
                console.log('asyncstorage', asyncStorage.getItem('username'),asyncStorage.getItem('prizm_wallet'),asyncStorage.getItem('is_superuser'),asyncStorage.getItem('user_id'))
            }

            console.log('Успешно создано:', data);
        } catch (error) {
            await AsyncStorage.removeItem('username')
            setIsNameSet(false);
            Alert.alert('Такой пары имя - кошелек нет в базе')
            console.error('Ошибка при создании:', error);
        }
    };

    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('username');
            const walletName = await AsyncStorage.getItem('prizm_wallet');
            if (userName && walletName) {
                // router.replace('/(user)')
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
            setIsNameSet(true);
            await AsyncStorage.setItem('username', name);
            setName('')
        } else {
            postForm()
            setName('');
        }
        
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
                        placeholder={isNameSet ? "PRIZM-1234-..." : "Имя пользователя"}
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
        paddingLeft:12,
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
