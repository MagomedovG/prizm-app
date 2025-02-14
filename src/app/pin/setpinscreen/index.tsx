import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Animated, Pressable, StatusBar, TextInput,Clipboard, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { AntDesign, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { RFValue } from "react-native-responsive-fontsize";
import ModalComponent from '@/src/components/dialog/ModalComponent';
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
const MARGIN_PIN = width / 14;

const SetPinScreen = () => {
    const router = useRouter();
    const [storedPinHash, setStoredPinHash] = useState<any>(null);
    const [pin, setPin] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [initialPin, setInitialPin] = useState('');
    const [isError, setIsError] = useState(false);
    const { theme } = useCustomTheme();
    const [isModal, setIsModal] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const [prizmWallet, setPrizmWallet] = useState<string | null>(null)
    const [isShowLogoutContent, setIsShowLogoutContent]  = useState(false)
    const [modalHeight, setModalHeight] = useState(200)
    const [modalWidth, setModalWidth] = useState(100)

    const handleModalLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        const {width} = event.nativeEvent.layout
        setModalHeight(height);
        setModalWidth(width);
      };

    const logOut = () => {
        AsyncStorage.clear()
        router.replace('/pin/setpinscreen')
    }

  useEffect(() => {
    async function fetchUserId() {
        const storedUserName = await AsyncStorage.getItem('username');
        const parsedUserName = storedUserName ? JSON.parse(storedUserName) : null
        const storedPrizmWallet = await AsyncStorage.getItem('prizm_wallet');
        console.log(storedUserName)
        if (storedPrizmWallet) {
            setPrizmWallet(storedPrizmWallet); 
        } 
        if (storedUserName) {
            setUserName(parsedUserName); 
        } else {
            console.error('User ID не найден в asyncStorage');
        }
    }
    fetchUserId();
}, []);

  
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
        if (!state.isConnected) {
            Alert.alert(
            "Нет соединения",
            "Пожалуйста, проверьте интернет-соединение.",
            [{ text: "OK" ,
               
            }]
            );
        }
        });

        return () => unsubscribe();
    }, [NetInfo]);
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('username');
            const walletName = await AsyncStorage.getItem('prizm_wallet');
            const userId = await AsyncStorage.getItem('user_id');
            // if (!userName && !walletName && !userId) {
            //     router.replace('/pin/setnickname')
            // }
        };
        const getStoredPinHash = async () => {
            const pinHash = await AsyncStorage.getItem('userPinCode');
            setStoredPinHash(pinHash);
        };

        getStoredPinHash();

        getAsyncName();
    }, [])

    
    const hashPin = async (inputPin:any) => {
        const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, inputPin);
        return hashed;
    };

    const handlePress = (num:any) => {
        if (pin.length < 5) {
            setPin(pin + num);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const setPinCode = async () => {
        if (pin.length === 5) {
            await handlePinComplete(pin);
            setPin('');
        }
    };
    useEffect(()=>{
        setPinCode()
    },[pin])

    const handlePinComplete = async (inputPin:any) => {
        const userName = await AsyncStorage.getItem('username');
        const walletName = await AsyncStorage.getItem('prizm_wallet');
        const userId = await AsyncStorage.getItem('user_id');
        if (storedPinHash === null) {
            if (!confirming) {
                setInitialPin(inputPin);
                setConfirming(true);
                // Alert.alert('Подтвердите PIN');
            } else {
                if (inputPin === initialPin) {
                    const inputPinHash = await hashPin(inputPin);
                    await AsyncStorage.setItem('userPinCode', inputPinHash);
                    // Alert.alert('PIN установлен');
                    if (!userName || !walletName || !userId) {
                        router.replace('/pin/setnickname');
                    } else {
                        router.replace('/(user)/menu');
                    }
                    // router.replace('/pin/setnickname');
                } else {
                    Alert.alert('PIN не совпадает, попробуйте снова');
                    triggerShake();
                }
                setConfirming(false);
                setInitialPin('');
            }
        } else {
            const inputPinHash = await hashPin(inputPin);
            if (inputPinHash === storedPinHash) {
                if (!userName || !walletName || !userId){
                    router.replace('/pin/setnickname');
                } else {
                    router.replace('/(user)/menu');
                }
                
            } else {
                Alert.alert('Неправильный код-пароль');
                triggerShake();
            }
        }
    };

    const triggerShake = () => {
        setIsError(true);
        Animated.sequence([
            Animated.timing(shakeAnimation, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnimation, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(shakeAnimation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true
            })
        ]).start(() => setIsError(false));
    };

    const handleBiometricAuth = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert('Ваше устройство не поддерживает биометрическую аутентификацию');
            return;
        }

        const isBiometricSupported = await LocalAuthentication.isEnrolledAsync();
        if (!isBiometricSupported) {
            Alert.alert('Биометрическая аутентификация не настроена');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Войдите с помощью биометрии',
            fallbackLabel: 'Использовать PIN-код'
        });

        if (result.success) {
            router.replace('/(user)/menu'); 
            Alert.alert('Аутентификация успешна');
        } else {
            Alert.alert('Аутентификация не удалась');
        }
    };
    const copyWalletToClipboard = () => {
        if (prizmWallet && typeof prizmWallet === "string" ) {
            Clipboard.setString(prizmWallet);
        }
        if (prizmWallet){
            Alert.alert('Кошелек скопирован!', prizmWallet)
        } else {
            Alert.alert('Кошелек не найден, войдите в систему!')
        }
    };
    const copyNameToClipboard = () => {
        if (userName && typeof userName === "string" ) {
            Clipboard.setString(userName);
        }
        if (userName){
            Alert.alert('Имя пользователя скопировано!', userName)
        } else {
            Alert.alert('Имя пользователя не найдено, войдите в систему!')
        }
    };

    

    return (
        <>
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'SetPin', headerShown: false }} />
                <View style={styles.pinContainer}>
                    <Text style={{ color: '#6A6A6A', fontSize: 18 }}>
                        {storedPinHash ? (confirming ? 'Подтвердите' : 'Введите код') : (confirming ? 'Подтвердите' : 'Придумайте')}
                    </Text>
                    <Text style={{ color: '#6A6A6A', marginBottom: 50, fontSize: 18 }}>
                        {storedPinHash ? (confirming ? 'код-пароль' : 'для входа') : (confirming ? 'код-пароль' : 'код-пароль')}
                    </Text>
                    <View style={styles.pinDisplay}>
                        {Array(5).fill().map((_, i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.pinDot, 
                                    { 
                                        backgroundColor: pin.length > i ? (theme === 'purple' ? '#6F1AEC' : '#32933C') : 'transparent', 
                                        borderColor: isError ? 'red' : (theme === 'purple' ? '#6F1AEC' : '#32933C') 
                                    }, 
                                    { transform: [{ translateX: shakeAnimation }] }
                                ]} 
                            />
                        ))}
                    </View>
                    {storedPinHash && <Pressable onPress={()=>setIsModal(true)}>
                        <Text style={{color:theme === 'purple' ? '#CBA8FF' : 'rgba(106,151,92,0.6)', fontSize:16, marginBottom:15}}>
                            не помню код-пароль
                        </Text>
                    </Pressable>}
                    <View style={styles.pinButtons}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((num) => (
                            <TouchableOpacity key={num} style={styles.pinButton} onPress={() => handlePress(num.toString())}>
                                <Text style={styles.pinButtonText}>{num}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.pinButton} onPress={handleDelete}>
                            <FontAwesome6 name="delete-left" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
            <ModalComponent 
                isVisible={isModal} 
                onClose={()=> {
                    setIsModal(false)
                    setIsShowLogoutContent(false)
                }} 
                height={modalHeight}
                width={modalWidth}
            >
                    <View style={styles.modalViewContainer} onLayout={handleModalLayout}>
                        {!isShowLogoutContent ? 
                        <>
                            <Text style={styles.modalTitle}>
                                Если вы забыли код пароль, 
                                вам нужно выйти из аккаунта и 
                                войти заново. Для входа вам
                                понадобится <Text style={{fontWeight:'bold'}}>имя пользователя</Text> и <Text style={{fontWeight:'bold'}}>ваш кошелек.</Text>
                            </Text>
                            <Pressable onPress={() => setIsShowLogoutContent(true)} style={[{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13},theme === 'purple' ? {} : {borderColor:'#32933C'},Platform.OS === 'ios' ? {height:35,paddingVertical:10} : {}, {borderRadius:10, borderWidth:1, width:'100%', paddingHorizontal:8}]}>
                                <Text style={{fontSize:18,textAlign:'center'}}>Выйти из аккаунта</Text>
                            </Pressable>
                        </> : 
                            <View style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                                <Text style={[styles.modalTitle, {textAlign:'center', width:'85%'}]}>
                                    Советуем сохранить <Text style={[{fontWeight:'bold'}, theme === 'purple' ? {color:'#6F1AEC'} : {color:'#32933C'} ]}>
                                        имя пользователя
                                    </Text> и <Text style={[{fontWeight:'bold'}, theme === 'purple' ? {color:'#6F1AEC'} : {color:'#32933C'} ]}>
                                        адрес кошелька</Text> перед выходом 
                                </Text>
                                <View style={{width:'100%', marginBottom:4}}>
                                    <Text style={styles.inputLable}>имя пользователя</Text>
                                    <Pressable  onPress={copyNameToClipboard} style={[theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor:'#32933C'},Platform.OS === 'ios' ? {height:35,paddingVertical:10} : {}, {borderRadius:10, borderWidth:1, width:'100%', paddingHorizontal:8}]}>
                                        <TextInput
                                            placeholder="Имя пользователя"
                                            value={userName}
                                            // onChangeText={handleNameChange}
                                            style={styles.inputText}
                                            placeholderTextColor="gray"
                                            editable={false}
                                        />
                                        <View style={styles.copyButtonContainer}>
                                            <FontAwesome5 name="copy" size={15} color="gray" />
                                        </View>
                                    </Pressable>
                                </View>
                                <View style={{width:'100%', marginBottom:24}}>
                                    <Text style={styles.inputLable}>адрес кошелька</Text>
                                    <Pressable onPress={copyWalletToClipboard} style={[theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor:'#32933C'},,Platform.OS === 'ios' ? {height:35,paddingVertical:10} : {}, {borderRadius:10, borderWidth:1, width:'100%', paddingHorizontal:8}]}>
                                        <TextInput
                                            placeholder="Адрес кошелька"
                                            value={prizmWallet}
                                            // onChangeText={handleNameChange}
                                            style={styles.inputText}
                                            placeholderTextColor="gray"
                                            editable={false}
                                        />
                                        <View style={styles.copyButtonContainer}>
                                            <FontAwesome5 name="copy" size={15} color="gray" />
                                        </View>
                                    </Pressable>
                                </View>
                                <Pressable 
                                    onPress={() => {
                                        logOut()
                                        setIsModal(false)
                                    }} 
                                    style={[{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13},theme === 'purple' ? {} : {borderColor:'#32933C'},Platform.OS === 'ios' ? {height:35,paddingVertical:10} : {}, {borderRadius:10, borderWidth:1, width:'100%', paddingHorizontal:8}]}
                                >
                                    <Text style={{fontSize:RFValue(13, 812),textAlign:'center'}}>Я сохранил</Text>
                                </Pressable>

                            </View>
                        
                        }
                    </View>
            </ModalComponent>
        </>
    );
};

const styles = StyleSheet.create({
    copyButtonContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input:{

    },
    inputText:{
        color:'black',
        fontSize: RFValue(13, 812),
        // fontSize:13
    },
    inputLable:{
        fontSize:12,
        color:'rgba(0,0,0,0.5)',
        marginLeft:8,
        // marginBottom:2
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinContainer: {
        alignItems: 'center',
    },
    pinDisplay: {
        flexDirection: 'row',
        marginBottom: Platform.OS === 'ios' ? 50 : 120,
        
    },
    pinDot: {
        width: 16,
        height: 16,
        marginHorizontal: 15,
        borderRadius: 8,
        borderWidth: 2,
    },
    
    pinButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: MARGIN_PIN,
    },
    pinButton: {
        width: '25%',
        height: 80,
        margin: 8,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinButtonText: {
        fontSize: 36,
        color: '#000',
        // fontWeight: 'bold',
    },
    centeredView: {
        justifyContent: 'center',
    },
    modal: {
        margin: 0,
        justifyContent: 'center',
        position:'relative',
        
    },
    modalViewContainer:{
        borderRadius: 20,
        marginHorizontal:50,
        paddingVertical:27,
        paddingHorizontal:20,
        width:deviceWidth / 1.5
    },
    modalTitle:{
        fontSize:16,
        marginBottom:16
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 111,
    },
});

export default SetPinScreen;
