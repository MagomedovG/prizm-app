import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Entypo, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {Link, useRouter} from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { useFocusEffect } from '@react-navigation/native';
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
    onDotsPress: (value?: boolean) => void;
    onChatPress: (value?: boolean) => void;
    refreshData: boolean;
}

const MainHeader = ({ onChatPress,refreshData,onDotsPress }:MainHeaderProps) => {
    // const { asyncTheme, changeTheme } = useAsyncTheme();
    const [isHidden, setIsHidden] = useState(false);
    const { theme } = useCustomTheme();
    const [info,setInfo] = useState<IWallet | null>(null)
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const [prizmWallet, setPrizmWallet] = useState('') 
    const [exchanger, setExchanger] = useState<string>('')
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
            await AsyncStorage.setItem('prizm_qr_code_url', data.prizm_qr_code_url)
            await AsyncStorage.setItem('prizm_wallet', data.prizm_wallet)

        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/${userId}/wallet-data/`);
        }
    }
    async function getExchanger() {
        try {
            const response = await fetch(
                `${apiUrl}/api/v1/exchanger/`,{
                }
            );
            const data = await response.json();
            setExchanger(data?.exchanger);
        } catch (error) {
            console.error("Ошибка при загрузке exchangera:", error);
        }
    }
    const getWallet = async () => {
        try {
            const url = await AsyncStorage.getItem('prizm_wallet');
            setPrizmWallet(url || '');
        } catch (error) {
            console.error('Ошибка при получении данных из AsyncStorage:', error);
        }
    };

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
        getExchanger();
        getWallet()
    }, []);
    
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

    useFocusEffect(
        useCallback(() => {
            const fetchData = () => {
                getData();
                fetchHiddenState();
            };
            fetchData(); 
            const intervalId = setInterval(() => {
                getData();
            }, 30000); 
    
            return () => clearInterval(intervalId); 
        }, [refreshData])
    );

    const handleChatPress = () => {
        onChatPress(true);
    };
    const handleDotsPress = () => {
        onDotsPress(true)
    }

    const toggleHidden = async () => {
        try {
            const newHiddenState = !isHidden;
            setIsHidden(newHiddenState);
            await AsyncStorage.setItem('isHidden', JSON.stringify(newHiddenState));
        } catch (error) {
            console.error('Failed to save hidden state', error);
        }
    };

    function getTitle(str:string) {
        if (typeof str !== 'string') {
            return ''; 
        }
        return str.length > 13 ? str.slice(0, 12) + '...' : str;
      }
      

    return (
        <LinearGradient
            colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.headerContainer}
        >
            <View style={styles.headerTitleContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                     <Pressable
                         onPress={logOut}
                    > 
                        <Text style={[styles.headerTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>В кошельке</Text>
                    </Pressable> 
                    <Pressable onPress={toggleHidden} style={{paddingBottom:4, padding:7.5}}>
                        <Feather name={!isHidden ? "eye-off" : "eye"} size={15} color={theme === 'purple' ? 'white' : 'black'} />
                    </Pressable>
                </View>

                <View style={[styles.headerProfileGroup, {position:'relative'}]}>
                    <Text style={[ theme === 'purple' ? styles.whiteText : styles.blackText,{
                            position:'absolute',
                            top:-26,
                            right:0,
                        }]}>
                            {info?.username}
                    </Text>
                    <Pressable
                            onPress={handleDotsPress}
                    >
                        <View>
                            <Entypo name="dots-three-horizontal" size={20} color={theme === 'purple' ? 'white' : 'black'} />
                        </View>
                    </Pressable>
                    <Pressable
                        style={styles.headerPitopi}
                    >
                        <Link href={exchanger} style={{fontSize:14}}>Обменник</Link>
                    </Pressable>
                    <Pressable
                        style={styles.headerPitopi}
                        onPress={handleChatPress}
                    >
                        <Text style={{fontSize:14}}>Чаты</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.headerFirstListItems}>
                <Text
                    style={[
                        styles.headerFirstListItem,
                        theme === 'purple' ? { color: '#56007B' } : styles.blackText,
                    ]}
                >
                    <Text style={{ fontSize: 18 }}>
                        Баланс:
                    </Text>
                    <Text style={{ fontSize: 20 }}>
                        {isHidden ? ' ****' : ` ${info?.balance_in_rub ? info?.balance_in_rub.toFixed(2) : 0} `}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                        {isHidden ? '' : `РУБ.`}
                    </Text>
                </Text>

                <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText,{textAlign:'right', fontSize:15}]}>
                    <Text style={{ fontSize: 15 }}>
                        {isHidden ? '****' : `курс: ${info?.prizm_to_rub_exchange_rate ? info?.prizm_to_rub_exchange_rate.toFixed(4) : 0} `}
                    </Text>
                    <Text style={{ fontSize: 12 }}>
                        {isHidden ? '' : `РУБ.`}
                    </Text>
                    
                </Text>
            </View>
            <View style={styles.headerSecondList}>
                <View style={styles.headerList}>
                    <View style={styles.headerListItems}>
                        <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                            {isHidden ? '****' : `B: ${info?.balance_in_pzm ? info?.balance_in_pzm : 0.0} pzm`}
                        </Text>
                        <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                            {isHidden ? '****' : `P: ${info?.para_balance ? info?.para_balance : 0.0} pzm`}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerCartButtonContainer}>
                    <View style={styles.headerCartContainer}>
                        <View style={styles.headerCartTitle}>
                            <Text style={[styles.cartTitle,theme === 'purple' ? styles.whiteText : styles.blackText]}>
                                PZM Wallet
                            </Text>
                            <Text style={[styles.cartName,theme === 'purple' ? styles.whiteText : styles.blackText]}>
                                {getTitle(info?.username ?? '')}
                            </Text>
                        </View>
                        <Text style={[styles.headerCartWallet,theme === 'purple' ? styles.whiteText : styles.blackText]}>
                            {prizmWallet ?? ''}
                        </Text>
                    </View>
                    <View style={styles.headerCartButtonsContainer}>
                        <View style={styles.cartButton}>
                            <FontAwesome5 name="long-arrow-alt-up" size={7} color={theme === 'purple' ? "white" : "black"}/>
                            <Link href="/(user)/menu/share-prizm" style={[styles.cartButtonLink, theme === 'purple' ? {color:'#2E0E5D', backgroundColor:'#fff'} : {}]}>
                                отправить
                            </Link>
                        </View>
                        <View style={styles.cartButton}>
                            <FontAwesome5 name="long-arrow-alt-down" size={7} color={theme === 'purple' ? "white" : "black"} />
                            <Link href="/(user)/menu/wallet/user"  style={[styles.cartButtonLink,{borderWidth:0.5}, theme === 'purple' ? {color:'#fff', borderColor:'#fff'} : {}]}>
                                получить
                            </Link>
                        </View>
                    </View>
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
        paddingBottom: 20
    },
    headerTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 49,
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
        gap: 7,
        alignItems: 'center',
    },
    headerPitopi: {
        color: '#262626',
        backgroundColor: "white",
        paddingHorizontal: 7,
        paddingVertical: 6,
        borderRadius: 9,
    },
    headerList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        // marginTop: 25,
    },
    headerFirstListItems:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'flex-start',
        marginTop:15
    },
    headerFirstListItem:{
        // color: '#56007B',
        paddingHorizontal:6,
        paddingVertical:1,
        borderRadius:5,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor:'white',
    },
    headerSecondList:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems:'center',
        marginTop:5
    },
    headerCartButtonContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        alignItems:'center'
    },

    headerCartContainer:{
        width:100,
        height:55,
        borderWidth:3,
        borderColor:'#FFFF',
        borderRadius:5,
        backgroundColor:'#772899',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        paddingVertical:6
    },
    headerCartTitle:{
        width:'100%',
        backgroundColor:'#56007B',
        padding:4,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
    }, 
    cartTitle:{
        fontSize:6
    }, 
    cartName:{
        fontSize:5
    }, 
    headerCartWallet:{
        fontSize:5,
        paddingHorizontal:4,
    },
    headerCartButtonsContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        gap:6,
        marginTop:4
    },
    cartButton:{
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: "space-between",
        gap:2,
        alignItems:'center'
    },
    cartButtonLink:{
        paddingHorizontal:3,
        paddingVertical:2,
        borderRadius:5,
        fontSize:10
    },
    headerListItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        // gap:5
    },
    headerListItem: {
        color: 'white',
        fontSize: 18,
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
