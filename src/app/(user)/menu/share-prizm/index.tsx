import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard, ScrollView} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AntDesign} from "@expo/vector-icons";
import {borderColor} from "@/assets/data/colors";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const SharePrizm = () => {
    const [wallet, setWallet] = useState('');
    const [sid, setSid] = useState('');
    const [count,setCount]=useState<number | null>(null)
    const [isNameSet, setIsNameSet] = useState(false);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const copyWalletToClipboard = () => {
        Clipboard.setString(wallet);
        Alert.alert('Кошелек скопирован!','');
    };
    const copySidToClipboard = () => {
        Clipboard.setString(sid);
        Alert.alert('Парольная фраза скопирована!','');
    };
    const validateCount = (value: string) => {
        // Заменяем запятую на точку
        const normalizedValue = value.replace(',', '.');
        const parsedValue = parseFloat(normalizedValue);
        
        // Проверяем, что значение является числом и находится в пределах от 0.01 до 10 000 000
        if (isNaN(parsedValue) || parsedValue < 0.01 || parsedValue > 10000000) {
            setErrorMessage('Сумма должна быть в пределах от 0.01 до 10 000 000');
        } else {
            setErrorMessage(null);
        }
        setCount(normalizedValue);  // Сохраняем нормализованное значение
    };
    
    const postForm = async () => {
        
        const form = {
            secret_phrase:sid,
            recipient_wallet:wallet,
            prizm_amount:count
        };
        
        
        try {
            console.log(`${apiUrl}/api/v1/users/get-or-create/`)
            console.log(form)
            const response = await fetch(`${apiUrl}/api/v1/users/send-prizm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.log('result',data )
                const result = data?.username ? data?.username[0] : data?.prizm_wallet ? data?.prizm_wallet[0] : 'Ошибка при проведении транзакции'
                Alert.alert(result)
                setIsNameSet(false);
                throw new Error('Ошибка сети');
                
            } else {
                router.replace('/(user)/menu');
                console.log('!result',data )
            }

            console.log('Успешно создано:', data);
        } catch (error) {
            console.log('Ошибка при создании:', error,`${apiUrl}/api/v1/users/get-or-create/`,form );
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
            <ScrollView style={{paddingHorizontal: 26, width: '100%'}}>
                <Text style={styles.title}>
                    Перевести pzm
                </Text>
                {/*<Text style={styles.label}>Адрес нового кошелька</Text>*/}
                <Pressable onPress={copyWalletToClipboard} style={[styles.pressable, {marginBottom: 10}]}>
                    <TextInput
                        style={[styles.input, errorMessage ? styles.inputError : null]}
                        editable={true}
                        onChangeText={validateCount}
                        placeholder={'Сумма pzm'}
                        value={count}
                        keyboardType={"numeric"}
                        placeholderTextColor='#8C8C8C'
                        type={'number'}
                    />
                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                </Pressable>
                <Pressable onPress={copyWalletToClipboard} style={[styles.pressable, {marginBottom: 10}]}>
                    <TextInput
                        style={styles.input}
                        editable={true}
                        placeholder={'Кошелек получателя'}
                        value={wallet}
                        onChangeText={setWallet}
                        placeholderTextColor='#8C8C8C'
                    />
                </Pressable>
                {/*<Text style={styles.label}>Парольная фраза</Text>*/}
                <Pressable onPress={copySidToClipboard} style={[styles.pressable, {flex: 1,
                    justifyContent: 'center',
                    marginTop: 5,
                    marginBottom: 120}]}>
                    <TextInput
                        style={styles.textArea}
                        editable={true}
                        multiline={true}
                        onChangeText={setSid}
                        placeholder={'Парольная фраза'}
                        value={sid}
                        placeholderTextColor='#8C8C8C'
                    />
                </Pressable>
                {/*<Text style={{marginLeft:9}}>Обязательно сохраните парольную фразу! Ее нельзя*/}
                {/*    будет получить еще раз.</Text>*/}
            </ScrollView>
            <UIButton text='Перевести pzm' disabled={errorMessage || !sid || !wallet} onPress={()=>{errorMessage || !sid || !wallet ? console.log('ss') : postForm()}}/>
        </View>
    );
};

export default SharePrizm;

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
        marginLeft:9,
        marginBottom:2
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
        // borderColor: '#957ABC',
        paddingVertical: 16,
        paddingHorizontal: 13,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize:18,
        color: '#000000',
        borderColor: borderColor
    },
    textArea: {
        height: 178,
        paddingVertical: 16,
        paddingHorizontal: 13,
        backgroundColor: '#fff',
        // borderColor: '#828282',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        fontSize: 18,
        borderColor: borderColor
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
    },
    errorText: {
        marginLeft:5,
        color: 'red',
        marginTop: 5,
        fontSize: 14,
    },
    inputError: {
        
        borderColor: 'red',
    },
});
