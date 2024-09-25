import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {useRouter} from "expo-router";

import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
type IWallet = {
    balance_in_pzm:number;
    balance_in_rub:number;
    id:number | string;
    para_balance:number;
    prizm_to_rub_exchange_rate:number;
    prizm_wallet:string;
    username:string;
}
type MainHeaderProps = {
    onChatPress: () => void;
    onQrCodeUrlUpdate: (url: string) => void;
    refreshData: boolean;
}

const MainHeader = ({ onChatPress,onQrCodeUrlUpdate,refreshData }:MainHeaderProps) => {
    const { asyncTheme, changeTheme } = useAsyncTheme();
    const [isHidden, setIsHidden] = useState(false);
    const { theme } = useCustomTheme();
    const [info,setInfo] = useState<IWallet | null>(null)
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    // const userId =  asyncStorage.getItem('user_id')
    const username = asyncStorage.getItem('username')
    const prizm_wallet = asyncStorage.getItem('prizm_wallet')
    const is_superuser =  asyncStorage.getItem('is_superuser')
    const logOut = () => {
        asyncStorage.removeItem('username')
        asyncStorage.removeItem('prizm_wallet')
        asyncStorage.removeItem('is_superuser');
        asyncStorage.removeItem('user_id')
        router.replace('/pin/setnickname')
    }

    async function getData() {
        try {
            const userId = await asyncStorage.getItem('user_id')
            const response = await fetch(
                `${apiUrl}/api/v1/users/${userId}/wallet-data/`,{
                }
            );
            const data = await response.json();
            setInfo(data);
            onQrCodeUrlUpdate(data.prizm_qr_code_url);  
            console.log(11)
            if (!response.ok){
                console.log(response);
            } else {
                // console.log('okku',data)
            }

        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/${userId}/wallet-data/`);
            // console.log(response);
        }
    }

    useEffect(() => {
        async function fetchUserId() {
            const storedUserId = await asyncStorage.getItem('user_id');
            if (storedUserId) {
                setUserId(storedUserId); 
            } else {
                console.error('User ID не найден в asyncStorage');
            }
        }

        fetchUserId();
    }, []);
    
    

    useEffect(() => {
        
        const fetchHiddenState = async () => {
            try {
                const hiddenState = await AsyncStorage.getItem('isHidden');
                if (hiddenState !== null) {
                    setIsHidden(JSON.parse(hiddenState));
                }
            } catch (error) {
                console.error('Failed to load hidden state', error);
            }
        };
        setTimeout(()=>{
            getData()
        },0)
        // getData()
        fetchHiddenState();

        const intervalId = setInterval(() => {
            getData();
        }, 30000); 

        return () => clearInterval(intervalId);
    }, [refreshData]);

    const handleChatPress = () => {
        onChatPress(true);
    };

    const toggleHidden = async () => {
        try {
            const newHiddenState = !isHidden;
            setIsHidden(newHiddenState);
            await AsyncStorage.setItem('isHidden', JSON.stringify(newHiddenState));
        } catch (error) {
            console.error('Failed to save hidden state', error);
        }
    };

    return (
        <LinearGradient
            colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.headerContainer}
        >
            <View style={styles.headerTitleContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 7.5 }}>
                    <Pressable
                        // onPress={handleChatPress}
                    >
                        <Text style={[styles.headerTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>В кошельке</Text>
                    </Pressable>
                    <Pressable onPress={toggleHidden} style={{marginBottom:4}}>
                        <Feather name="eye" size={15} color={theme === 'purple' ? 'white' : 'black'} />
                    </Pressable>
                </View>

                <View style={[styles.headerProfileGroup, {position:'relative'}]}>
                    <Text style={{
                            position:'absolute',
                            top:-20,
                            right:0,
                            color:'white'
                        }}>{info?.username}</Text>
                    <Pressable
                        style={styles.headerPitopi}
                        onPress={logOut}
                    >
                        <Text>Обменник</Text>
                    </Pressable>
                    <Pressable
                        style={styles.headerPitopi}
                        onPress={handleChatPress}
                    >
                        <Text>Чаты</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.headerList}>
                <View style={styles.headerListItems}>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '****' : `B = ${info?.balance_in_pzm ? info?.balance_in_pzm : 0.0} pzm`}
                    </Text>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '****' : `P = ${info?.para_balance ? info?.para_balance : 0.0} pzm`}
                    </Text>
                </View>
                <View style={styles.headerListItems}>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText,{textAlign:'right'}]}>
                        {isHidden ? '****' : `1 pzm = ${info?.prizm_to_rub_exchange_rate ? info?.prizm_to_rub_exchange_rate.toFixed(4) : 0} руб`}
                    </Text>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText,{textAlign:'right'}]}>
                        {isHidden ? '****' : `баланс = ${info?.balance_in_rub ? info?.balance_in_rub.toFixed(2) : 0} руб`}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        borderBottomWidth: 0,
        width: '100%',
        padding: 25,
    },
    headerTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 39,
    },
    headerTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight:'bold'
    },
    headerProfileGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 15,
        alignItems: 'center',
    },
    headerPitopi: {
        color: '#262626',
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 9,
    },
    headerList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 25,
    },
    headerListItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    headerListItem: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    whiteText: {
        color: 'white'
    },
    blackText: {
        color: 'black'
    },
});

export default MainHeader;
