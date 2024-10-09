import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, ActivityIndicator} from "react-native";
import {Stack, useRouter,useLocalSearchParams} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { useFocusEffect } from '@react-navigation/native';
const SetNickName = () => {
    const [name, setName] = useState('');
    const [asyncName, setAsyncName] = useState<string | null>(null);
    const [isNameSet, setIsNameSet] = useState<boolean>(false);
    const [loading, setloading]=useState(false)
    const router = useRouter();
    const local = useLocalSearchParams()

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
        const public_key_hex = await asyncStorage.getItem('public_key_hex')
        const prizm_wallet = name
        const walletName = await AsyncStorage.getItem('prizm_wallet');
        const isUpdatedName = walletName ? JSON.parse(walletName) !== name : true
        
        const form = {
            username,
            prizm_wallet,
            ...(public_key_hex && !isUpdatedName && { public_key_hex: JSON.parse(public_key_hex) })
        };
        
        
        console.log(form)
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
                console.log('result',data )
                const result = data?.username ? data?.username[0] : data?.prizm_wallet ? data?.prizm_wallet[0] : 'Ошибка'
                Alert.alert(result)
                setIsNameSet(false);
                throw new Error('Ошибка сети');
                
            } else {
                setName('');
                router.replace('/(user)/menu');
                await asyncStorage.setItem('username', JSON.stringify(data?.username))
                await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.prizm_wallet))
                await asyncStorage.setItem('is_superuser', JSON.stringify(data?.is_superuser));
                await asyncStorage.setItem('user_id', JSON.stringify(data?.id))
                console.log('!result',data )
            }

            console.log('Успешно создано:', data);
        } catch (error) {
            await AsyncStorage.removeItem('username')
            await AsyncStorage.removeItem('prizm_wallet')
            setIsNameSet(false);
            setName('');
            // Alert.alert('Такой пары имя - кошелек нет в базе')
            console.log('Ошибка при создании:', error,`${apiUrl}/api/v1/users/get-or-create/`,form );
        }
    };
    
    useFocusEffect(
        React.useCallback(() => {
            const getAsyncName = async () => {
                const walletName = await AsyncStorage.getItem('prizm_wallet');
                if (walletName && isNameSet) {
                    setName(JSON.parse(walletName));
                }
            };

            getAsyncName();
        }, [isNameSet])
    );
    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('username');
            const walletName = await AsyncStorage.getItem('prizm_wallet');
            if (isNameSet && walletName){
                setName(JSON.parse(walletName))
            }
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
        if (name.length === 0) {
            return
        }

        if (!isNameSet) {
            console.log(isNameSet);
            setIsNameSet(true);
            await AsyncStorage.setItem('username', name);
            setName('')
        } else {
            postForm()
            
        }
        
    }
    const createwallet = () => {
        router.push('/pin/createwallet');
        
        
    }
    const handleNameChange = (text: string) => {
        if (!isNameSet) {
            const allowedCharsRegex = /^[a-zA-Z0-9._@]*$/;
            
            if (allowedCharsRegex.test(text)) {
                setName(text);
            }
        } else {
            setName(text);
        }
    };


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
                        onChangeText={handleNameChange}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                {
                    !isNameSet && (
                        <Text style={styles.suggest}>
                            Имя пользователя может содержать только латинские буквы (a-z, A-Z), цифры и символы @, _, .
                        </Text>
                    )
                }
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
