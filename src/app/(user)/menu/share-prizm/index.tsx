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

const deviceWidth = width;
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useQuery } from '@tanstack/react-query';
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
    const [userWallet, setUserWallet] = useState()

    const { data: transactions, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useQuery({
        queryKey:['transactions',userWallet],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/wallet/get-transactions/?wallet=${userWallet}`);
                console.log('refresuserWallet',`${apiUrl}/api/v1/wallet/get-transactions/?wallet=${userWallet}}`)
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
            console.error("Ошибка загрузки секретной фразы:", error);
        }
    };

    useEffect(() => {
        loadSecretPhraseAndWallet();
    }, []);
    const askCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        console.log(status)
        if (permission?.granted) {
          setHasPermission(true);
        }
      };
    
    useEffect(() => {
        askCameraPermission();
      }, []);
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
        console.log(secretPhrase)
    },[])
    
    const postForm = async () => {
        setIsLoading(true);
        const form = {
            secret_phrase:secretPhrase || sid,
            recipient_wallet:wallet,
            prizm_amount:count,
            ...(addressatPublicKey && { recipient_public_key: addressatPublicKey })
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
                if (!secretPhrase && checked){
                    await asyncStorage.setItem("secret-phrase", sid)
                    console.log('secret phrase memoried')
                }
                setSid('')
                setCount(null)
                setWallet('')
                router.replace('/(user)/menu');
            } else if (data && !data?.header) {
                const message = data.recipient_wallet?.[0] || data.secret_phrase?.[0] || data.prizm_amount?.[0] || data.recipient_public_key?.[0] || data;
                Alert.alert(message);
            }  
            // await asyncStorage.setItem("secret-phrase", secretPhrase);
        } catch (error) {
            console.log('Ошибка при создании:', error,`${apiUrl}/api/v1/users/get-or-create/`,form );
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
                        facing='back'
                    >

                    </CameraView>
                    <Pressable style={styles.closeButton} onPress={()=>setIsScanner(false)}>
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
                                    {count * course > 0 ? parseFloat((count * course).toFixed(2)) : 0} руб
                                </Text>
                            </View>
                            
                        </View>
                        {errorMessage && <Text style={[styles.errorText, {color:'#C85557'}]}>{errorMessage}</Text>}
                        {!errorMessage && !count && <Text style={styles.errorText}>коммисия сети 0,5% (не менее 0,05 и не более 10 pzm)</Text>}
                        {!errorMessage && count && <Text style={[styles.errorText, Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}>{Number(count) > calculateMaxTransfer(balance)  ? `максимальная сумма с учетом комиссии: ${calculateMaxTransfer(balance).toFixed(3)} pzm` : `коммисия сети ${parseFloat(getComission(count).toFixed(3))} pzm`}</Text>}
                        {!secretPhrase && <Pressable 
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
                            <StaticButton text={`Перевести ${count ? `${count} ` : ''}pzm`} disabled={!!errorMessage || (!secretPhrase && !sid) || !count  || !wallet || isLoading || Number(count) > calculateMaxTransfer(balance)} onPress={()=>{errorMessage || (!secretPhrase && !sid) || !wallet ? console.log('d') : postForm()}}/>
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
                
                
                {/* <Modal
                    isVisible={isScanner} // это свойство отвечает за видимость модалки
                    onSwipeComplete={()=> setIsScanner(false)} // закрытие модалки при свайпе вниз
                    swipeDirection="down" // определяем направление свайпа
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                    style={{width:deviceWidth,height:deviceHeight,margin:0}} // стили для модалки
                    animationIn="slideInUp" // анимация при открытии
                    animationOut="slideOutDown" // анимация при закрытии
                    backdropOpacity={1} // настройка прозрачности фона
                    backdropColor='white'
                    animationInTiming={300}
                    animationOutTiming={300}
                    backdropTransitionOutTiming={0}
                    onBackButtonPress={()=>setIsScanner(false)}
                    statusBarTranslucent
                >
                    <View style={styles.fullscreenContainer}>
                        <View style={styles.fullscreenSlide}>
                            <BarCodeScanner
                                onBarCodeScanned={handleAfterScanned}
                                style={styles.Scanner}
                            />
                        </View>
                        <Pressable style={styles.closeButton} onPress={()=>setIsScanner(false)}>
                            <AntDesign name="close" size={26} color="white" style={styles.xIcon}/>
                        </Pressable>
                    </View>
                </Modal> */}
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
        height: 178,
        paddingVertical: 16,
        paddingHorizontal: 13,
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
