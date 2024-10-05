import React, {useEffect, useState,useRef} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Button,
    TextInput,
    Clipboard,
    Alert,
    Pressable,
    ScrollView,
    Dimensions
} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import wallets from "@/assets/data/wallet";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AntDesign } from '@expo/vector-icons';
import HeaderLink from "@/src/components/HeaderLink";
import {IWallet} from "@/src/types";
import QRCode from "react-qr-code";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
// import * as Clipboard from 'expo-clipboard';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { IFund } from '@/src/types';
const { width } = Dimensions.get('window');
const containerWidth = width - 34 - 84 ;

export default function walletId() {
    const [isFocused, setIsFocused]=useState(false)
    const [isUpdate, setIsUpdate]=useState(false)
    const router = useRouter();
    const { id } = useLocalSearchParams();
    console.log(id)
    const [wallet, setWallet] = useState<IFund | null>(
        null
    )
    const [prizmWallet, setPrizmWallet] = useState<string>('')
    const inputRef = useRef(null);

    useEffect(() => {
        if (isUpdate && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [isUpdate]);
    
    const routerTo = () => {
        if (isUpdate){
            setIsUpdate(false);
        } else if (id === 'user'){
            router.push('(user)/menu/share-prizm/')
        } else {
            router.back()
        }
        
    }

    // if (!wallet) {
    //     return <Text>Кошелек не найден</Text>;
    // }

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
            console.log(data);
            setWallet(data);
            setPrizmWallet(data?.prizm_wallet)
            if (!response.ok){
                console.log(response);
            }

        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/funds/${id}/`);
            // console.log(response);
        }
    }

    useEffect(() => {
       
        getFunds()
    },[])
    const updateUserWallet = async () => {
        const userId = await AsyncStorage.getItem('user_id');
        const parsedUserId = userId ? JSON.parse(userId) : null;
        console.log(`${apiUrl}/api/v1/users/${parsedUserId}/`);
        
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

        console.log('form',JSON.stringify({
            prizm_wallet: prizmWallet,
        }));
        const data = await response.json();
        if (response.ok) {
            console.log('ok',data);
        } else {
            Alert.alert('Введен некорректный кошелек')
            console.log('neok',data);
        }

        } catch (e) {
            console.log(e);
        } finally {
            setIsUpdate(false);
            console.log('getFunds');
            getFunds()

        }
    }

    const copyToClipboard = () => {
        if (wallet?.prizm_wallet && typeof wallet.prizm_wallet === "string" && wallet) {
            Clipboard.setString(wallet.prizm_wallet);
        }
        Alert.alert('Кошелек скопирован!', wallet?.prizm_wallet)
    };

    return (
        <View style={{ position: 'relative', flex: 1,'overflow':isFocused ? 'scroll' : 'hidden' }}>
            <Stack.Screen options={{
                headerShown: false,
                header: () => <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />,
            }} />
            <View style={[styles.container, {marginVertical:28}]}>

                <Text style={[styles.name, {marginTop:isUpdate && isFocused ? 10 : 80}]}>{ id === 'user' ? 'Мой кошелек' : wallet?.title}</Text>
                {wallet?.prizm_qr_code_url &&
                    <View style={styles.image}>
                        <QRCode
                            size={containerWidth}
                            // style={{width: "100%", height: "100%" }}
                            value={wallet?.prizm_qr_code_url}
                            level={'M'}
                            // viewBox={`0 0 256 256`}
                            // style={styles.image}
                        />
                    </View>

                }

                {/*<Text style={styles.link}>{wallet.link}</Text>*/}
            </View>
            <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:'center'
                }}>
                <Pressable onPress={copyToClipboard} style={styles.pressable}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        editable={isUpdate}
                        // placeholder={wallet?.prizm_wallet}
                        onChangeText={setPrizmWallet}
                        // autoFocus={isUpdate}
                        value={prizmWallet}
                        onFocus={() => setIsFocused(true)} 
                        onBlur={() => setIsFocused(false)} 
                    />
                    <View style={styles.copyButtonContainer}>
                        <AntDesign name="copy1" size={15} color="#262626" />
                    </View>
                </Pressable>
               {id === 'user'  && (
                <View style={{display:'flex',justifyContent:'flex-start',width:containerWidth + 34}}>
                    <Pressable onPress={()=>setIsUpdate(true)} style={{marginTop:8, display:'flex',flexDirection:'row',gap:4, alignItems:'flex-start'}}>
                        <Text style={{color:'#262626',marginLeft:5,}}>Редактировать </Text>
                        <FontAwesome5 name="pencil-alt" size={12} color="#6B6B6B" />
                    </Pressable>
                </View>
                
               )
               
                }
            </View>

            


            <UIButton text={isUpdate ? 'Ок' : id === 'user'  ? 'Перевести PZM' :  'Назад'} onPress={()=> isUpdate ? updateUserWallet() : routerTo()} isAdminWallet={true}/>
            {wallet?.is_superuser && id === 'user' && !isUpdate && <Pressable style={styles.adminLink}>
            
                <Text style={{textAlign:'center'}}>
                        Перейти в панель администратора
                    </Text>
            </Pressable>}
        </View>
    );
}

const styles = StyleSheet.create({
    pressable: {
        position: 'relative',
        width: containerWidth + 34,
        
        
        // marginBottom: 20,
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#EFEFEF',
        borderRadius: 5,
        color: '#707070',
    },
    adminLink:{
        // marginHorizontal:50,
        position:'absolute',
        bottom:40,
        right:0,
        left:0,
        width:'100%',
        // textAlign:'center'
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
        // marginHorizontal: 42,
        // padding: 10,
        
        // marginRight:8
    },
    image: {
        // width: '75%',
        marginHorizontal: 42,
        // aspectRatio: 1,
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
