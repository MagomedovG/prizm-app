import React, { useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard, ScrollView} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import {borderColor} from "@/assets/data/colors";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

const SharePrizm = () => {
    const [wallet, setWallet] = useState('');
    const [sid, setSid] = useState('');
    const [count,setCount]=useState<number | null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null)
    const router = useRouter();
    const copyWalletToClipboard = () => {
        Clipboard.setString(wallet);
        Alert.alert('Кошелек скопирован!','');
    };
    const copySidToClipboard = () => {
        Clipboard.setString(sid);
        Alert.alert('Парольная фраза скопирована!','');
    };
    function calculateMaxTransfer(balance) {
        let commission = balance * 0.005;
    
        if (commission < 0.05) {
            commission = 0.05;
        } else if (commission > 10) {
            commission = 10;
        }
    
        const maxTransferAmount = balance - commission;
        return maxTransferAmount > 0 ? maxTransferAmount : 0;
    }
    function getComission(balance) {
        let commission = balance * 0.005;
    
        if (commission < 0.05) {
            commission = 0.05;
        } else if (commission > 10) {
            commission = 10;
        }
    
        const maxTransferAmount = commission;
        return maxTransferAmount > 0 ? maxTransferAmount : 0;
    }
    const validateCount = (value: string) => {
        const normalizedValue = value.replace(',', '.');
        const parsedValue = parseFloat(normalizedValue);
        
        if (balance === 0) {
            setErrorMessage(`недостаточно средств на балансе: ${calculateMaxTransfer(balance)} pzm`)
        } else if( isNaN(parsedValue) || parsedValue < 0.01 || parsedValue > 10000000){
            setErrorMessage('сумма должна быть в пределах от 0.01 до 10 000 000');
        } else {
            setErrorMessage(null);
        }
        setCount(normalizedValue);  
    };
    async function getData() {
        const userId = await asyncStorage.getItem('user_id')
        try {
            
            const response = await fetch(
                `${apiUrl}/api/v1/users/${userId}/wallet-data/`,{
                }
            );
            const data = await response.json();
            setBalance(data?.balance_in_pzm);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/${userId}/wallet-data/`);
        }
    }
    useEffect(()=>{
        getData()
    },[])
    const postForm = async () => {
        setIsLoading(true);
        const form = {
            secret_phrase:sid,
            recipient_wallet:wallet,
            prizm_amount:count
        };
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/send-prizm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (data?.header && data?.description){
                Alert.alert(
                    data?.header, 
                    data?.description, 
                  );
            }
            if (response.ok){
                setSid('')
                setCount(null)
                setWallet('')
                router.replace('/(user)/menu');
            } else if (data && !data?.header) {
                const message = data.recipient_wallet?.[0] || data.secret_phrase?.[0] || data.prizm_amount?.[0] || data;
                Alert.alert(message);
            } 
        } catch (error) {
            console.log('Ошибка при создании:', error,`${apiUrl}/api/v1/users/get-or-create/`,form );
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
            <ScrollView style={{paddingHorizontal: 26, width: '100%'}}>
                <Text style={styles.title}>
                    Перевести pzm
                </Text>
                <View style={[styles.pressable, {marginBottom: 10}]}>
                    <TextInput
                        style={[styles.input,  errorMessage || Number(count) > calculateMaxTransfer(balance) ? styles.inputError : null, balance === 0 || Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}
                        editable={true}
                        onChangeText={validateCount}
                        placeholder={'Сумма pzm'}
                        value={count}
                        keyboardType={"numeric"}
                        placeholderTextColor='#8C8C8C'
                        type={'number'}
                    />
                    {errorMessage && <Text style={[styles.errorText, {color:'#C85557'}]}>{errorMessage}</Text>}
                    {!errorMessage && !count && <Text style={styles.errorText}>коммисия сети 0,5% (не менее 0,05 и не более 10 pzm)</Text>}
                    {!errorMessage && count && <Text style={[styles.errorText, Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}>{Number(count) > calculateMaxTransfer(balance)  ? `максимальная сумма с учетом комиссии: ${calculateMaxTransfer(balance).toFixed(3)} pzm` : `коммисия сети ${parseFloat(getComission(count).toFixed(3))} pzm`}</Text>}
                </View>
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
            </ScrollView>
            <UIButton text='Перевести pzm' disabled={!!errorMessage || !sid || !wallet || isLoading || Number(count) > calculateMaxTransfer(balance)} onPress={()=>{errorMessage || !sid || !wallet ? console.log('') : postForm()}}/>
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
        // marginTop: 5,
        fontSize: 13,
    },
    inputError: {
        borderColor: '#C85557',
    },
});
