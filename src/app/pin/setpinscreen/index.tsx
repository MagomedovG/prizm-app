import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import UIButton from '@/src/components/UIButton';

const { width } = Dimensions.get('window');
const MARGIN_PIN = width / 14;

const SetPinScreen = () => {
    const router = useRouter();
    const [storedPinHash, setStoredPinHash] = useState(null);
    const [pin, setPin] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [initialPin, setInitialPin] = useState('');

    // Хэширование PIN-кода
    const hashPin = async (inputPin) => {
        const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, inputPin);
        return hashed;
    };

    const handlePress = (num) => {
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

    const handlePinComplete = async (inputPin) => {
        if (storedPinHash === null) {
            if (!confirming) {
                setInitialPin(inputPin);
                setConfirming(true);
                Alert.alert('Подтвердите PIN');
            } else {
                if (inputPin === initialPin) {
                    const inputPinHash = await hashPin(inputPin);
                    await AsyncStorage.setItem('userPinCode', inputPinHash);
                    Alert.alert('PIN установлен');
                    router.replace('/pin/setnickname'); // Используем replace для обновления истории навигации
                } else {
                    Alert.alert('PIN не совпадает, попробуйте снова');
                }
                setConfirming(false);
                setInitialPin('');
            }
        } else {
            const inputPinHash = await hashPin(inputPin);
            if (inputPinHash === storedPinHash) {
                router.replace('/(user)/menu');
                Alert.alert('Доступ разрешен');
            } else {
                Alert.alert('Неправильный PIN');
            }
        }
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
            router.replace('/(user)/menu'); // Используем replace для обновления истории навигации
            Alert.alert('Аутентификация успешна');
        } else {
            Alert.alert('Аутентификация не удалась');
        }
    };

    useEffect(() => {
        const getStoredPinHash = async () => {
            const pinHash = await AsyncStorage.getItem('userPinCode');
            setStoredPinHash(pinHash);
        };

        getStoredPinHash();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'SetPin', headerShown: false }} />
            <View style={styles.pinContainer}>
                <Text style={{ color: '#6A6A6A', marginBottom:30, fontSize:18 }}>
                    {storedPinHash ? (confirming ? 'Подтвердите код-пароль' : 'Введите код-пароль') : (confirming ? 'Подтвердите код-пароль' : 'Придумайте код-пароль')}
                </Text>
                <View style={styles.pinDisplay}>
                    {Array(5).fill().map((_, i) => (
                        <View key={i} style={styles.pinDot(pin.length > i)} />
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
            <UIButton text={'Готово'} onPress={setPinCode} />
            {/*<UIButton text={'Войти с биометрией'} onPress={handleBiometricAuth} />*/}
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
    pinDot: (filled:any) => ({
        width: 16,
        height: 16,
        marginHorizontal: 12,
        borderRadius: 8,
        backgroundColor: filled ? '#6F1AEC' : 'transparent',
        borderWidth: 2,
        borderColor: '#6F1AEC',
    }),
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
