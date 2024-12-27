import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Animated, Pressable, StatusBar, TextInput,Clipboard } from 'react-native';
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
    const [currentAddress, setCurrentAddress] = useState<string>('не указано местоположение');
    const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isModal, setIsModal] = useState(false)
    const [isLogout, setIsLogout] = useState(false)
    const [userName, setUserName] = useState<string | null>(null)
    const [prizmWallet, setPrizmWallet] = useState<string | null>(null)
    const [isShowLogoutContent, setIsShowLogoutContent]  = useState(false)
    const logOut = () => {
        AsyncStorage.clear()
        router.replace('/pin/setpinscreen')
    }
  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);
  useEffect(() => {
    async function fetchUserId() {
        const storedUserName = await AsyncStorage.getItem('username');
        const parsedUserName = storedUserName ? JSON.parse(storedUserName) : null
        // const parsedUserName = storedUserName ? storedUserName : null
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

  const checkIfLocationEnabled = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      setLocationServicesEnabled(enabled);
    } catch (err) {
      setError('Ошибка проверки доступности геолокации.');
      console.error(err);
    }
  };

  const getServerLocation = async (lat: number, lon: number) => {
    try {
      const localFullName = await AsyncStorage.getItem('locality-full-name')
      const localLocationId = await AsyncStorage.getItem('locality-id')
      const localLocationType = await AsyncStorage.getItem('locality-type')
      const response = await fetch(`${apiUrl}/api/v1/localities/get-locality-by-coordinates/?latlon=${lat},${lon}`);
      const data = await response.json();
      if (response.ok ) {
        if (data?.full_name !== localFullName || data?.id !== localLocationId || data?.type !== localLocationType){
          await AsyncStorage.setItem('locality-full-name', data.full_name);
          await AsyncStorage.setItem('locality-type', data.type);
          await AsyncStorage.setItem('locality-id', data.id.toString());
        } else {
            console.log('Не нашли такую локацию в бд')
        }
        
      }
    } catch (err) {
      console.error('Ошибка получения локации с сервера:', err);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());
        getServerLocation(latitude, longitude);
      }
    } catch (err) {
      setError('Ошибка получения текущей геолокации.');
      console.error(err);
    }
  };
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
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                onSwipeComplete={()=>{
                    setIsModal(false)
                    setIsShowLogoutContent(false)
                }}
                onBackdropPress={()=>{
                    setIsModal(false)
                    setIsShowLogoutContent(false)
                }}
                onBackButtonPress={()=>{
                    setIsModal(false)
                    setIsShowLogoutContent(false)
                }}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={500}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.modal}
                backdropTransitionOutTiming={0}
                statusBarTranslucent
            >   
                <View style={styles.centeredView}>
                    <View style={styles.modalViewContainer}>
                        {!isShowLogoutContent ? 
                        <>
                            <Text style={styles.modalTitle}>
                                Если вы забыли код пароль, 
                                вам нужно выйти из аккаунта и 
                                войти заново. Для входа вам
                                понадобится <Text style={{fontWeight:'bold'}}>имя пользователя</Text> и <Text style={{fontWeight:'bold'}}>ваш кошелек.</Text>
                            </Text>
                            <Pressable onPress={() => setIsShowLogoutContent(true)} style={[{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13},theme === 'purple' ? {} : {borderColor:'#32933C'}]}>
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
                                    <Pressable  onPress={copyNameToClipboard} style={[theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor:'#32933C'}, {height:41, borderRadius:10, borderWidth:1, width:'100%', padding:8}]}>
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
                                    <Pressable onPress={copyWalletToClipboard} style={[theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor:'#32933C'}, {height:41, borderRadius:10, borderWidth:1, width:'100%', padding:8}]}>
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
                                <Pressable onPress={() => {
                                        logOut()
                                        setIsModal(false)
                                    }
                                    } 
                                    style={[{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13},theme === 'purple' ? {} : {borderColor:'#32933C'}]}>
                                    <Text style={{fontSize:18,textAlign:'center'}}>Я сохранил</Text>
                                </Pressable>

                            </View>
                        
                        }
                    </View>
                </View>
                <Pressable style={styles.closeButton} onPress={()=>setIsModal(false)}>
                        <AntDesign name="close" size={30} color="white" />
                </Pressable>
            </Modal>
            {/* <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                onBackButtonPress={()=>setIsLogout(false)} 
                animationIn={'slideInUp'}
                isVisible={isLogout}
                onSwipeComplete={()=>setIsLogout(false)}
                onBackdropPress={()=>setIsLogout(false)}
                animationInTiming={300}
                animationOut='slideOutDown'
                animationOutTiming={300}
                backdropTransitionOutTiming={0}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.logoutModal}
                statusBarTranslucent
            >
                <View style={{width:'80%',height:'50%',alignItems: 'center',
        justifyContent: 'center',}}>
                    <View style={styles.modalView}>
                        <Text style={{fontSize:18, fontWeight:'bold', textAlign:'center', marginBottom:14, marginTop:10}}>
                            Вы уверены, что хотите выйти из аккаунта?
                        </Text>
                        <View style={{display:'flex', justifyContent:'space-between',alignItems:'center', flexDirection:'column',width:'100%', gap:12}}>
                            <Pressable onPress={() => logOut()} style={[{paddingVertical:15, borderWidth:1, borderColor:'#41146D',backgroundColor:'#41146D', width:'100%', borderRadius: 13}, theme === 'purple' ? {backgroundColor:'#41146D',borderColor:'#41146D'} : {backgroundColor:"#32933C",borderColor:"#32933C"}]}>
                                <Text style={{fontSize:18,textAlign:'center', color:'white'}}>Выйти</Text>
                            </Pressable>
                            <Pressable onPress={() => setIsLogout(false)} style={[{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13},theme === 'purple' ? {} : {borderColor:'#32933C'}]}>
                                <Text style={{fontSize:18,textAlign:'center'}}>Остаться</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <Pressable style={styles.closeButton} onPress={() => setIsLogout(false)}>
                        <AntDesign name="close" size={30} color="white" />
                </Pressable>
            </Modal> */}
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
        marginBottom: 120,
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
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        // height: 20,
        marginHorizontal:50,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingVertical:27,
        paddingHorizontal:20,
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
