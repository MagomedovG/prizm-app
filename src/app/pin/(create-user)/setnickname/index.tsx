import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const SetNickName = () => {
    const [name, setName] = useState<any>('');
    const router = useRouter();
    const { theme } = useCustomTheme();


    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('username');
            const parsedUserName = userName ? JSON.parse(userName) : '';
            if (userName){
                setName(parsedUserName);
            }
        };
        getAsyncName();
    }, [])

    const setNickName = async () => {
        if (name?.length === 0) {
            return
        }
        await AsyncStorage.setItem('username', name);
        router.push('/pin/setnickname/LoginScreen')
    }
    
    const handleNameChange = (text: string) => {
            const allowedCharsRegex = /^[a-zA-Zа-яА-Я0-9._@]*$/;
            if (allowedCharsRegex.test(text)) {
                setName(text);
            }
    };


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'SetNickName', headerShown: false }} />
            <View style={{paddingHorizontal: 45, width: '100%'}}>
                <Text style={styles.title}>
                    Придумайте имя пользователя
                </Text>
                <View style={[styles.inputContainer, theme === 'purple' ? {} : {borderColor:'#32933C'}]}>
                    <TextInput
                        placeholder="Имя пользователя"
                        value={name}
                        onChangeText={handleNameChange}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <Text style={styles.suggest}>
                    Имя пользователя может содержать только буквы, цифры и символы @, _, .
                </Text>
            </View>
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
