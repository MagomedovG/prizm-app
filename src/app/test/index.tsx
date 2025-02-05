import React, { useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard, ScrollView, Dimensions, StatusBar, FlatList, ActivityIndicator, Modal} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import {borderColor} from "@/assets/data/colors";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { Ionicons } from '@expo/vector-icons';
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { useCustomTheme } from '@/src/providers/CustomThemeProvider';
import StaticButton from '@/src/components/StaticButton';
import AntDesign from '@expo/vector-icons/AntDesign';
import TransactionItem from '@/src/components/TransactionItem';
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
import { BarCodeScanner } from "expo-barcode-scanner";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const deviceWidth = width;
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useQuery } from '@tanstack/react-query';
import PrizmWallet from '@/src/utils/PrizmWallet';
import curve25519 from '../../utils/curve2';
import converters from '../../utils/converters';
const CryptoJS = require('crypto-js');
import signBytes from '../../utils/main';

const SharePrizm = () => {
    const [wallet, setWallet] = useState('');
    const [sid, setSid] = useState('');
    const [hasPermission, setHasPermission] = useState<null | boolean>(null);
    const [count,setCount]=useState<number | null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null)
    const [course, setCourse] = useState<number | null>(null)
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const [isScanner, setIsScanner] = useState(false)
    const { theme } = useCustomTheme();
    const [transactionList, setTransactionList] = useState([{number:1}, {number:2}, {number:3}, {number:4}, {number:5}, {number:6}, {number:7}, {number:8}, {number:9}, {number:10}])
    const [permission, requestPermission] = useCameraPermissions();
    const [secretPhrase, setSecretPhrase] = useState<string | null>(null);
    const [addressatPublicKey, setAddressatPublicKey] = useState('')
    const [message, setMessage] = useState('')
    const [userWallet, setUserWallet] = useState()
    const [flashStatus, setFlashStatus] = useState<boolean>(false)
    const { data: transactions, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useQuery({
        queryKey:['transactions',userWallet],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/wallet/get-transactions/?wallet=${userWallet}`);
                return await response.json();
        },
        enabled: !!userWallet, 
    });
    function splitQrText(qrtext:string) {
        if (typeof qrtext !== 'string' || !qrtext.includes(':')) {
            return { error: 'Invalid format: String must contain a colon.' };
        }
    
        const [beforeColon, afterColon] = qrtext.split(/:(.+)/);
    
        if (!beforeColon || !afterColon) {
            return { error: 'Invalid format: Both parts must be non-empty.' };
        }
    
        return { beforeColon, afterColon };
    }
    const scanQrCode = async (afterColon:string | undefined) => {
        try {
            if (!afterColon) return;
            const response = await fetch(`${apiUrl}/api/v1/wallet/get-data-by-public-key/?public-key=${afterColon}`)
            const data = await response.json()
            if (response.ok){
                setAddressatPublicKey(data?.public_key_hex)
                setWallet(data?.account_rs)
                console.log('adressantpublic_key_hex',data?.public_key_hex)
            } else {
                console.log('Try Error to fetch qr code text')
            }
        } catch {
            console.log('Error to fetch qr code text')
        }
    }
    const loadSecretPhraseAndWallet = async () => {
        try {
            // const storedPhrase = 'await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase")await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secrawait AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");et-phrase");;'
            const storedPhrase = await AsyncStorage.getItem("secret-phrase");
            const storedWallet = await AsyncStorage.getItem("prizm_wallet");
            if (storedPhrase) {
                setSecretPhrase(storedPhrase);
            } else {
                setSecretPhrase(null);
            }
            if (storedWallet) {
                setUserWallet(storedWallet)
            }
        } catch (error) {
            // console.error("Ошибка загрузки секретной фразы:", error);
        }
    };

    useEffect(() => {
        loadSecretPhraseAndWallet();
    }, []);
    // const askCameraPermission = async () => {
    //     const { status } = await BarCodeScanner.requestPermissionsAsync();
    //     console.log(status)
    //     if (permission?.granted) {
    //       setHasPermission(true);
    //     }
    //   };
    
    // useEffect(() => {
    //     askCameraPermission();
    //   }, []);
      const handleAfterScanned = ({ data, type }: any) => {
        setIsScanner(false)
        const result = splitQrText(data)
        scanQrCode(result?.afterColon)
        console.log(result, result.afterColon, result.beforeColon);
    };
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
        if (value.length > 9) return;
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
            setCourse(data?.prizm_to_rub_exchange_rate)
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/${userId}/wallet-data/`);
        }
    }
    useEffect(()=>{
        getData()
    },[])

    const sendTransactionsBytes = async (transactionsBytes: string, attachment?:any) => {
        const form = {
            transaction_bytes:transactionsBytes,
            ...(attachment && { attachment: attachment })
        }
        console.log(form)
        try {
            const response = await fetch(`${apiUrl}/api/v1/pzm-wallet/broadcast-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            console.log('data',data)

            if (response.ok){
                setSid('')
                setCount(null)
                setWallet('')
                Alert.alert(
                    'Транзакция прошла успешно', 
                    data?.detail, 
                );
            } else {
                Alert.alert(
                    'Ошибка при проведении транзакции', 
                    data?.detail, 
                );
            }
        } catch (err) {
            console.log('Ошибка при переводе:', err,`${apiUrl}/api/v1/pzm-wallet/broadcast-transaction`,transactionsBytes );
        }
    }
    // PRIZM-M6WK-ZBUJ-LKPR-8HWPR
    const secret = 'prizm squeeze treat dress nervous fright whistle spread certainly crush nobodyxhxhdbdbdbxhdbrh second taken forest serve doom split'
    const senderPrizmWallet = new PrizmWallet(false, secret, null)
    const getPzmWallet = async () => {
        try {
            console.log('publicKeyHex',senderPrizmWallet.publicKeyHex)
    
            console.log('accountId',senderPrizmWallet.accountId)

            // console.log('privatekey',senderPrizmWallet.privateKey)
    
            console.log('accountRs',senderPrizmWallet.accountRs)

            console.log('secretPhraseee',senderPrizmWallet.secretPhrase)
        } catch (e) {
            console.log('error')
        }
        


    }
    const postForm = async () => {

        setIsLoading(true);

        const form = {
            sender_public_key:senderPrizmWallet.publicKeyHex,
            recipient_wallet:'PRIZM-M6WK-ZBUJ-LKPR-8HWPR',
            prizm_amount:1,
            ...(message && { message: message })
            // recipient_public_key:addressatPublicKey ? addressatPublicKey : null,
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
            console.log('data form',data, form)
            
            if (response.ok){
                
                const unsignedTransactionsBytes = data.transaction_data.unsignedTransactionBytes
                const attachment = data.transaction_data.transactionJSON.attachment
                console.log('attachment', data.transaction_data.transactionJSON.attachment)
                const singTransaction = signBytes(unsignedTransactionsBytes, secret);
                // sendTransactionsBytes(singTransaction,attachment)
                console.log(singTransaction, attachment)
            } else if (data && !data?.header) {
                const message = data.secret_phrase?.[0] || data.sender_public_key?.[0] || data.recipient_public_key?.[0] || data;
                Alert.alert(message);
            }  
        } catch (error) {
            console.log('Ошибка при создании:', error,`${apiUrl}/api/v1/users/send-prizm/`,form );
        } finally {
            setIsLoading(false);
        }
    };
    
    

    return (
        <>
        
            {isScanner ?
            <View style={{
                    flex: 1,
                    justifyContent: "center",
                }}> 
                
                <View style={styles.fullscreenSlide}>
                    
                    <CameraView
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={handleAfterScanned}
                        style={styles.Scanner}
                        enableTorch={flashStatus}
                        facing='back'
                        zoom={0}
                    >

                    </CameraView>
                    <Pressable onPress={()=>setFlashStatus(!flashStatus)} style={[styles.flashButton]}>
                        <View style={[flashStatus ? {backgroundColor:'#fff'} : {backgroundColor:'#000',opacity:0.7}, {padding:12, borderRadius:50}]}>
                           <MaterialCommunityIcons name="flashlight" size={24} color={flashStatus ? "black" : "white"} /> 
                        </View>
                        
                    </Pressable>
                    <Pressable style={styles.closeButton} onPress={()=>{
                            setIsScanner(false)
                            setFlashStatus(false)
                        }}>
                            <AntDesign name="close" size={22} color="white" style={styles.xIcon}/>
                        </Pressable>
                </View>
            </View> :
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.container, {marginTop:deviceHeight/4.5}]}>
                    <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
                    
                    <View style={{paddingHorizontal: 26, width: '100%'}}>
                        <Text style={styles.title}>
                            Перевести pzm
                        </Text>
                        <View style={[styles.pressable, {marginBottom: 8}]}>
                            <TextInput
                                style={[styles.input,{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'}]}
                                editable={true}
                                placeholder={'Кошелек получателя'}
                                value={wallet}
                                onChangeText={(str)=>{
                                    setWallet(str)
                                    setAddressatPublicKey('')
                                }
                                }
                                placeholderTextColor='#8C8C8C'
                            />
                            <Pressable style={styles.scanIconContainer} onPress={()=>setIsScanner(true)}>
                                <AntDesign name="scan1" size={24} color="black" />
                            </Pressable>
                        </View>
                        <View style={[styles.pressable, ]}>
                            <TextInput
                                style={[styles.input,{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'},  errorMessage || Number(count) > calculateMaxTransfer(balance) ? styles.inputError : null, balance === 0 || Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}
                                editable={true}
                                onChangeText={validateCount}
                                placeholder={'Сумма pzm'}
                                value={count}
                                keyboardType={"numeric"}
                                placeholderTextColor='#8C8C8C'
                                type={'number'}
                            />
                            <View style={styles.convertToRubContainer}>
                                <Text style={styles.convertToRubText}>
                                    {count * course > 0 ? parseFloat((count * course).toFixed(5)) : 0} руб
                                </Text>
                            </View>
                            
                        </View>
                        {errorMessage && <Text style={[styles.errorText, {color:'#C85557'}]}>{errorMessage}</Text>}
                        {!errorMessage && !count && <Text style={styles.errorText}>коммисия сети 0,5% (не менее 0,05 и не более 10 pzm)</Text>}
                        {!errorMessage && count && <Text style={[styles.errorText, Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}>{Number(count) > calculateMaxTransfer(balance)  ? `максимальная сумма с учетом комиссии: ${calculateMaxTransfer(balance).toFixed(3)} pzm` : `коммисия сети ${parseFloat(getComission(count).toFixed(3))} pzm`}</Text>}
                         <Pressable 
                            onPress={copySidToClipboard} 
                            style={[
                                styles.pressable, 
                                {
                                    flex: 1,
                                    justifyContent: 'center',
                                    marginTop: 5,
                                    
                                }
                            ]}
                        >
                            <TextInput
                                style={[styles.textArea,{ height: 40, paddingVertical: 8, width:'50%'},{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'}]}
                                editable={true}
                                // multiline={true}
                                onChangeText={setMessage}
                                placeholder={'Комментарий'}
                                value={message}
                                placeholderTextColor='#8C8C8C'
                            />
                            
                        </Pressable>
                        {!secretPhrase && <Pressable 
                            onPress={copySidToClipboard} 
                            style={[
                                styles.pressable, 
                                {
                                    flex: 1,
                                    justifyContent: 'center',
                                    marginTop: 10,
                                    
                                }
                            ]}
                        >
                            <TextInput
                                style={[styles.textArea,{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'}]}
                                editable={true}
                                multiline={true}
                                onChangeText={setSid}
                                placeholder={'Парольная фраза'}
                                value={sid}
                                placeholderTextColor='#8C8C8C'
                            />
                            
                        </Pressable>}
                        {!secretPhrase && <View style={{display:'flex', flexDirection:'row', alignItems:'center', gap:5}}>
                            <Pressable
                                role="checkbox"
                                aria-checked={checked}
                                // style={[styles.checkboxBase, checked && theme === 'purple' ? styles.checkboxPurpleChecked : checked && theme === 'green' ? styles.checkboxGreenChecked : {}]}
                                style={[styles.checkboxBase, checked && styles.checkboxPurpleChecked]}
                                onPress={() => setChecked(!checked)}>
                                {checked && <Ionicons name="checkmark-sharp" size={17} color="white" />}
                            </Pressable>
                            <Text style={styles.checkboxText}>cохранить мою парольную фразу</Text>
                        </View>}
                        <View style={{marginTop: 20}}>
                            <StaticButton 
                                text={`Перевести ${count ? `${count} ` : ''}pzm`} 
                                // disabled={!!errorMessage || (!secretPhrase && !sid) || !count  || !wallet || isLoading || Number(count) > calculateMaxTransfer(balance)} 
                                onPress={()=>{postForm()}}
                            />
                        </View>
                        <Text style={styles.transactionsTitle}>
                            История транзакций
                        </Text>
                        {/* <FlatList
                            data={transactionList}
                            renderItem={({item, index})=><TransactionItem num={item.number}/>}
                            keyExtractor={(item, index)=> `${index}`}
                            contentContainerStyle={{ gap: 9 }}
                            style={{marginBottom:50}}
                        /> */}
                        {
                            <View style={{marginBottom:50}}>
                                {transactions && transactions.map((item, index)=>( 
                                    <View style={{marginBottom:9}} key={index}>
                                        <TransactionItem item={item}/>
                                    </View>
                                ))}
                            </View>
                        }
                        
                    </View>
                </View>
                
                
                
            </ScrollView>
            }
        </>
    );
};

export default SharePrizm;

const styles = StyleSheet.create({
    fullscreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // position:'relative'
    },
    flashButton: {
        position: 'absolute',
        bottom: statusBarHeight + 10,
        // right: 20,
        width:'100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent:'center',
        zIndex: 11111,
    },
    closeButton: {
        position: 'absolute',
        top: statusBarHeight + 10,
        right: 20,
        zIndex: 11111,
    },
    xIcon: {
        color: 'grey',
        padding:4,
        backgroundColor:'white',
        borderRadius:50
    },
    Scanner: {
        width: '100%',
        height: "100%",
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "black",
    },
    scanIconContainer: {
        position: 'absolute',
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        right:0,
        paddingRight: 10,
        paddingLeft: 10,
        width:50,
        height:50,
        bottom: -9,
        transform: [{ translateY: -12 }], // выравнивание по центру
    },
    transactionsTitle:{
        fontSize:20,
        marginTop:23,
        marginBottom:9
    },
    checkboxBase: {
        width: 21,
        height: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#957ABC',
        backgroundColor: 'transparent',
        marginTop:4,
        marginLeft:5
      },
      checkboxPurpleChecked: {
        backgroundColor: '#41146D',
      },
      checkboxGreenChecked: {
        backgroundColor: '#32933C',
      },
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
        paddingVertical: 13,
        paddingHorizontal: 8,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize:16,
        color: '#000000',
        // lineHeight: 13
        // borderColor: borderColor
    },
    textArea: {
        height: 120,
        paddingVertical: 13,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        fontSize: 16,
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
        marginBottom: 36,
        fontSize: 26,
        textAlign: 'center',
        // fontWeight: 'bold'
    },
    errorText: {
        marginLeft:8,
        marginBottom:8,
        fontWeight: 'bold',
        fontSize: 12.5,
    },
    inputError: {
        borderColor: '#C85557',
    },
    convertToRubContainer: {
        position: 'absolute',
        right: 0,
        top: 1,
        bottom: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#D9D9D9',
        paddingHorizontal: 10, // Дополнительный отступ для текста
    },
    convertToRubText: {
        fontSize: 16,
        color: '#808080',
    },
    checkboxText: {
        fontSize: 14,
        lineHeight: 18, // Немного больше для центрирования относительно чекбокса
        // marginLeft: 6,  // Расстояние от чекбокса до текста
        textAlignVertical: 'center', // Для текстового центрирования
    },
});
