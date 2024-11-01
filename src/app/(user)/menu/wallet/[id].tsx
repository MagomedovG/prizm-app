import React, {useEffect, useState,useRef} from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Clipboard,
    Alert,
    Pressable,
    Dimensions,
    ScrollView,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import HeaderLink from "@/src/components/HeaderLink";
import QRCode from "react-qr-code";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { IFund } from '@/src/types';
const { width } = Dimensions.get('window');
const containerWidth = width - 34 - 84 ;

export default function walletId() {
    const [isFocused, setIsFocused]=useState(false)
    const [isUpdate, setIsUpdate]=useState(false)
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [wallet, setWallet] = useState<IFund | null>(
        null
    )
    const [prizmWallet, setPrizmWallet] = useState<string>('')
    const [publicKey, setPublicKey] = useState<string>('')
    const inputRef = useRef(null);
    const [keyboardStatus, setKeyboardStatus] = useState('Клавиатура закрыта');
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null); 
    useEffect(() => {
        if (isUpdate && inputRef && inputRef.current) {
            // inputRef.current?.focus();
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isUpdate]);

    useEffect(() => {
        if (isFocused && scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef?.current?.scrollToEnd({ animated: true });
            }, 100)
            
        }
    }, [isFocused]); 
    
    const routerTo = () => {
        if (isUpdate){
            setIsUpdate(false);
        } else if (id === 'user'){
            router.push('(user)/menu/share-prizm/')
        } else {
            router.back()
        }
        
    }

    async function getFunds() {
        const userId = await asyncStorage.getItem('user_id')

        try {
            const response = await fetch(
                id !== 'user' ?
                `${apiUrl}/api/v1/funds/${id}/`
                : `${apiUrl}/api/v1/users/${userId}/`
                ,
            );
            const data = await response.json();
            setWallet(data);
            setPrizmWallet(data?.prizm_wallet)
            setPublicKey(data?.prizm_public_key)
            console.log(data)

        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/funds/${id}/`);
        }
    }
    const getWallet = async () => {
        // try {
        //     const key = await AsyncStorage.getItem('public_key_hex');
        //     if (key){
        //         setPublicKey(JSON.parse(key) || '');
        //     }
            
        // } catch (error) {
        //     console.error('Ошибка при получении данных из AsyncStorage:', error);
        // }
    };
    useEffect(() => {
        getFunds()
        getWallet()
    },[])
    const updateUserWallet = async () => {
        const userId = await AsyncStorage.getItem('user_id');
        const parsedUserId = userId ? JSON.parse(userId) : null;
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/${parsedUserId}/`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prizm_wallet: prizmWallet,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert('Введен некорректный кошелек')
            } else {
                await asyncStorage.setItem('prizm_wallet', prizmWallet)
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsUpdate(false);
            getFunds()
        }
    }

    const copyWalletToClipboard = () => {
        if (wallet?.prizm_wallet && typeof wallet.prizm_wallet === "string" && wallet) {
            Clipboard.setString(wallet.prizm_wallet);
        }
        Alert.alert('Кошелек скопирован!', wallet?.prizm_wallet)
    };

    const copyPKeyToClipboard = () => {
        if (publicKey && typeof publicKey === "string") {
            Clipboard.setString(publicKey);
        }
        Alert.alert('Публичный ключ скопирован!', publicKey)
    };
    function getTitle(str:string, size:number) {
        if (typeof str !== 'string') {
            return ''; 
        }
        return str.length > size ? str.slice(0, size - 1) + '...' : str;
      }


    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ position: 'relative', flex: 1}} ref={scrollViewRef} >
                    <Stack.Screen options={{
                        headerShown: false,
                        header: () => <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />,
                    }} />
                    <View style={[styles.container, {marginVertical:28}]}>
                        <Text style={[styles.name, {marginTop:80}]}>{ id === 'user' ? 'Мой кошелек' : wallet?.title}</Text>
                        {wallet?.prizm_qr_code_url &&
                            <View style={styles.image}>
                                <QRCode
                                    size={containerWidth}
                                    value={wallet?.prizm_qr_code_url}
                                    level={'M'}
                                />
                            </View>
                        }
                        <View style={{
                            display: 'flex',
                            flexDirection: 'column',
                            // alignItems: 'center',
                            justifyContent:'center',
                            marginTop:5,
                            marginBottom:100
                        }}>
                            <Text style={{marginBottom:3,textAlign:'left',marginLeft:8,marginTop:10, color:'#262626', fontSize:14}}>Адрес кошелька:</Text>
                            <Pressable onPress={copyWalletToClipboard} style={styles.pressable}>
                                <TextInput
                                    ref={inputRef}
                                    style={styles.input}
                                    readOnly={!isUpdate}
                                    onChangeText={setPrizmWallet}
                                    value={prizmWallet}
                                    onFocus={() => setIsFocused(true)} 
                                    onBlur={() => setIsFocused(false)} 
                                />
                                <View style={styles.copyButtonContainer}>
                                    <AntDesign name="copy1" size={15} color="#262626" />
                                </View>
                            </Pressable>
                            
                            {id === 'user' && !isUpdate  && (
                                    <View style={{display:'flex',justifyContent:'flex-start',width:containerWidth + 34, marginBottom:10}}>
                                        <Pressable onPress={()=>setIsUpdate(true)} style={{marginTop:2, display:'flex',flexDirection:'row',gap:4, alignItems:'center'}}>
                                            <Text style={{color:'#262626',marginLeft:4, fontSize:13}}>Изменить кошелек </Text>
                                            <FontAwesome5 name="pencil-alt" size={10} color="#6B6B6B" />
                                        </Pressable>
                                    </View>
                                )
                            }
                            {id === 'user' && 
                                <View>
                                    <Text style={{marginBottom:3,textAlign:'left',marginLeft:8, color:'#262626', fontSize:14}}>Публичный ключ:</Text>
                                    <Pressable onPress={copyPKeyToClipboard} style={styles.pressable}>
                                        <TextInput
                                            style={styles.input}
                                            readOnly={true}
                                            value={getTitle(publicKey, 28)}
                                        />
                                        <View style={styles.copyButtonContainer}>
                                            <AntDesign name="copy1" size={15} color="#262626" />
                                        </View>
                                    </Pressable>
                                </View>
                            }
                        </View>
                    </View>
                    {wallet?.is_superuser && id === 'user' && !isUpdate && 
                        <View style={styles.adminLink}>
                            <Link href='https://backend.vozvrat-pzm.ru/prizm-admin' style={{textAlign:'center', textDecorationLine:'underline', color:'rgba(102, 102, 102, 1)'}}>
                                    Перейти в панель администратора
                                </Link>
                        </View>
                    }
                </ScrollView>
                
            </KeyboardAvoidingView>
            {(isUpdate || id !== 'user') && <UIButton 
                    text={isUpdate ? 'Сохранить'  :  'Назад'} 
                    onPress={()=> isUpdate ? updateUserWallet() : routerTo()} 
                    isAdminWallet={true}
            />}
        </>

    );
}

const styles = StyleSheet.create({
    pressable: {
        position: 'relative',
        width: containerWidth + 34,
        
    },
    copyButtonContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        fontSize:16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        // backgroundColor: '#EFEFEF',
        borderRadius: 10,
        color: '#070907',
    },
    adminLink:{
        position:'absolute',
        bottom:40,
        right:0,
        left:0,
        width:'100%',
    },
    name: {
        marginVertical: 13,
        fontSize: 30,
        marginTop: 80
    },
    link: {
        marginVertical: 23,
        fontSize: 16
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        marginHorizontal: 42,
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
        borderRadius:10,
        borderWidth:17,
        borderColor:'#fff'
    },
});
