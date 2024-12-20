import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Animated } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');
const MARGIN_PIN = width / 14;

const SetPinScreen = () => {
    const router = useRouter();
    const [storedPinHash, setStoredPinHash] = useState<any>(null);
    const [pin, setPin] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [initialPin, setInitialPin] = useState('');
    const [isError, setIsError] = useState(false);
    const { theme } = useCustomTheme();
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

    

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'SetPin', headerShown: false }} />
            <View style={styles.pinContainer}>
                <Text style={{ color: '#6A6A6A', marginBottom: 30, fontSize: 18 }}>
                    {storedPinHash ? (confirming ? 'Подтвердите код-пароль' : 'Введите код-пароль') : (confirming ? 'Подтвердите код-пароль' : 'Придумайте код-пароль')}
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
    );
};

const styles = StyleSheet.create({
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
        marginBottom: 24,
    },
    pinDot: {
        width: 16,
        height: 16,
        marginHorizontal: 12,
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
    },
});

export default SetPinScreen;
