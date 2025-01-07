import React, { useState, useEffect, useCallback } from 'react';
import { Pressable, Text, View, StyleSheet, Platform, Alert, useWindowDimensions, StatusBar, Dimensions } from "react-native";
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {Link, useRouter} from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import prizm from '@/src/utils/prizmparacalc'
import Modal from 'react-native-modal';
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
type IWallet = {
    balance_in_pzm:number;
    balance_in_rub:number;
    id:number | string;
    para_balance:number;
    prizm_to_rub_exchange_rate:number;
    prizm_wallet:string;
    username:string;
    para_values?: {
        amount:number;
        balance:number;
        height:number;
        hold:number;
        last:number;
        multiplier:number;
        requestProcessingTime:number;
        last_block_height:number;
        emission_number:number
    }
}
type MainHeaderProps = {
    onDotsPress: (value?: boolean) => void;
    onChatPress: (value?: boolean) => void;
    refreshData: boolean;
    isWallet:boolean
}

const MainHeader = ({ onChatPress,refreshData,onDotsPress,isWallet }:MainHeaderProps) => {
    // const { asyncTheme, changeTheme } = useAsyncTheme();
    const [para, setPara]=useState<number | null>(null)
    const [isHidden, setIsHidden] = useState(false);
    const { theme } = useCustomTheme();
    const [info,setInfo] = useState<IWallet | null>(null)
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const [userNumber, setUserNumber] = useState('') 
    const { width } = useWindowDimensions();
    const logOut = () => {
        AsyncStorage.clear()
        router.replace('/pin/setpinscreen')
    }
    async function checkUser() {
        try {
            const userId = await AsyncStorage.getItem('user_id')
            const response = await fetch(
                `${apiUrl}/api/v1/users/${userId}/check/`,{
                }
            );
            // console.log(response.status)
            if (response.status === 403) {
                Alert.alert('Ваш аккаунт был заблокирован','',[{ text: "OK" ,
                    onPress: () => {
                        logOut()
                    }
                  }])
            }
            if (response.status === 404) {
                Alert.alert('Аккаунт не найден','',[{ text: "OK" ,
                    onPress: () => {
                        logOut()
                    }
                  }])
            }
            // setUserNumber(data?.users_number);
        } catch (error) {
            console.error("Ошибка при загрузке активности пользователя:", error,`${apiUrl}/api/v1/users/${userId}/check/`);
        }
    }
    async function getUsersNumber() {
        try {
            const response = await fetch(
                `${apiUrl}/api/v1/users/get-number/`,{
                }
            );
            const data = await response.json();
            setUserNumber(data?.users_number);
        } catch (error) {
            console.error("Ошибка при загрузке количества пользователей:", error);
        }
    }
    async function getData() {
        try {
            const userId = await AsyncStorage.getItem('user_id')
            const response = await fetch(
                `${apiUrl}/api/v1/users/${userId}/wallet-data/`,{
                }
            );
            const data = await response.json();
            setInfo(data);
            await AsyncStorage.setItem('prizm_qr_code_url', data?.prizm_qr_code_url)
            await AsyncStorage.setItem('prizm_wallet', data?.prizm_wallet)
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/${userId}/wallet-data/`);
        }
    }
    var genesis = 'PRIZM-TE8N-B3VM-JJQH-5NYJB';
    var maxEmission = 6000000000;

    var calc = new prizm.Para();
    var LAST_BLOCK_HEIGHT = info?.para_values?.last_block_height; //текущая высота последнего блока в блокчейн
    var para_status = false;
    var lastNumber = Number(info?.para_values?.last); //last из метода getPara
    var amountNumber = Number(info?.para_values?.amount); //amount из метода getPara
    var balanceNumber = Number(info?.para_values?.balance); //баланс из метода getPara
    var heightParaNumber = Number(info?.para_values?.height); // высота из метода getPara
    var emissionNumber = info?.para_values?.emission_number; //текущий баланс генезиса


    function updatePayoutValues() {
        // Рассчет красной зоны
        para_status = LAST_BLOCK_HEIGHT >= 1200000 && LAST_BLOCK_HEIGHT - heightParaNumber <= 100000 && balanceNumber <= 11000000;

        // Вычисление значений
        var payout = calc.calc(balanceNumber, amountNumber, lastNumber, emissionNumber, para_status);
        var payout2 = calc.calc(balanceNumber, amountNumber, lastNumber - 86400, emissionNumber, para_status);
        var paraDaily = payout2 > payout ? payout2 - payout : 0;
        setPara(payout.toFixed(8));
    }
    useFocusEffect(() => {
        if (info?.balance_in_pzm && info?.balance_in_pzm !== 0){
        const intervalId = setInterval(updatePayoutValues, 300); 
        return () => clearInterval(intervalId);
        } else {
            setPara(info?.para_balance ? info?.para_balance : 0.0)
        }
    })
    
    
    const { data: exchanger} = useQuery({
        queryKey: ['exchanger'],
        queryFn: async () => {
            const response = await fetch(
                `${apiUrl}/api/v1/exchanger/`
            );
            const data = await response.json();
            const exchanger = data.exchanger
            return exchanger;
        }
    });
    

    useEffect(() => {
        async function fetchUserId() {
            const storedUserId = await AsyncStorage.getItem('user_id');
            if (storedUserId) {
                setUserId(storedUserId); 
            } else {
                console.error('User ID не найден в asyncStorage');
            }
        }
        fetchUserId();
        getUsersNumber()
        checkUser()
    }, []);
    
    const fetchHiddenState = async () => {
        try {
            const hiddenState = await AsyncStorage.getItem('isHidden');
            if (hiddenState !== null) {
                setIsHidden(JSON.parse(hiddenState))
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
      const getFontSize = () => {
        if (width < 350) return 5;
        if (width < 500) return 5.5;
        if (width < 600) return 5.8;
        return 6;
    };
      

    return (
        <>
            <LinearGradient
                colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={[styles.headerContainer, !isWallet ? {borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12} : {}, { display: 'flex',
                        justifyContent: "space-between",
                        alignItems: "center",}]}
            >
                <View style={styles.headerTitleContainer}>
                    <View style={{
                            position:'absolute',
                            top:-18,
                            // right:0,
                            display:'flex',
                            flexDirection:'row',
                            // backgroundColor:'#f0f0f0',
                            width:'100%',
                            justifyContent: 'space-between',
                        }}
                    >
                         <Text style={[ theme === 'purple' ? styles.whiteText : styles.blackText, {opacity:0.5}]}>
                                {userNumber ? `пользователей: ${userNumber}` : ''}
                        </Text> 
                        <Text style={[ theme === 'purple' ? styles.whiteText : styles.blackText]}>
                                {info?.username}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom:4 }}>
                        <Pressable
                        >  
                            <Text style={[styles.headerTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>В кошельке</Text>
                        </Pressable> 
                        <Pressable onPress={toggleHidden} style={{paddingBottom:4, padding:7.5}}>
                            <Feather name={!isHidden ? "eye-off" : "eye"} size={15} color={theme === 'purple' ? 'white' : 'black'} />
                        </Pressable>
                    </View>

                    <View style={[styles.headerProfileGroup, {position:'relative'}]}>
                        
                        <Pressable
                                onPress={handleDotsPress}
                        >
                            <View>
                                <Entypo name="dots-three-horizontal" size={18} color={theme === 'purple' ? 'white' : 'black'} style={{padding:10, paddingRight:5}} />
                            </View>
                        </Pressable>
                        <Pressable
                            style={styles.headerPitopi}
                        >
                            {/* <Link href={exchanger ?? ''} style={{fontSize:14}}>Обменник</Link> */}
                            <Link href={'/(user)/menu/exchanger'} style={{fontSize:14}}>Обменник</Link>
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
                    <View style={[{borderRadius:5, height:26},styles.headerFirstListItem]}>
                        <Text
                            style={[
                                {fontWeight:'bold',lineHeight:23.5},
                                theme === 'purple' ? { color: '#56007B' } : styles.blackText,
                            ]}
                        >
                            <Text style={{ fontSize: 18}}>
                                Баланс:
                            </Text>
                            <Text style={{ fontSize: 20 }}>
                                {isHidden ? ' ****' : ` ${info?.balance_in_rub ? parseFloat(info?.balance_in_rub.toFixed(2)) : 0} `}
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                {isHidden ? '' : `РУБ.`}
                            </Text>
                        </Text>
                    </View>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText,{textAlign:'right', fontSize:15,lineHeight:15}]}>
                        <Text style={{ fontSize: 15 }}>
                            {`курс: ${info?.prizm_to_rub_exchange_rate ? parseFloat(info?.prizm_to_rub_exchange_rate.toFixed(5)) : 0} `}
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                            РУБ.
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
                                {isHidden ? '****' : `P: ${para  ? para : 0.0} pzm`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerCartButtonContainer}>
                        <View style={[styles.headerCartContainer,{backgroundColor: theme === 'purple' ? '#772899' : '#BAEAAE'} ]}>
                            <View style={[styles.headerCartTitle, {backgroundColor: theme === 'purple' ? '#56007B' : '#6A975E'}]}>
                                <Text style={[styles.cartTitle,styles.whiteText ]}>
                                    PZM Wallet
                                </Text>
                                <Text style={[styles.cartName,styles.whiteText]}>
                                    {getTitle(info?.username ?? '')}
                                </Text>
                            </View>
                            <Text style={[styles.headerCartWallet,theme === 'purple' ? styles.whiteText : {color:'#fff'}, {fontSize:getFontSize()}]}>
                                {info?.prizm_wallet ?? ''}
                            </Text>
                        </View>
                        <View style={styles.headerCartButtonsContainer}>
                            <View style={styles.cartButton}>
                                <FontAwesome5 name="long-arrow-alt-up" size={7} color={theme === 'purple' ? "white" : "black"}/>
                                {Platform.OS === 'ios' ? 
                                    <View style={[{height:19},styles.cartButtonLink,theme === 'purple' ? { backgroundColor:'#fff'} : {backgroundColor:'#fff'}]}>
                                        <Link href="/(user)/menu/share-prizm" style={[{
                                                fontSize:11,
                                                lineHeight:10
                                            }, 
                                            theme === 'purple' ? {color:'#2E0E5D'} : {}
                                        ]}>
                                            отправить
                                        </Link>
                                    </View>
                                : <Link href="/(user)/menu/share-prizm" style={[{height:19},styles.cartButtonLink,theme === 'purple' ? { backgroundColor:'#fff'} : {backgroundColor:'#fff'}]}>
                                    <Text style={[{
                                            fontSize:11,
                                            lineHeight:10
                                        }, 
                                        theme === 'purple' ? {color:'#2E0E5D'} : {}
                                    ]}>
                                        отправить
                                    </Text>
                                </Link>} 
                            </View>
                            <View  style={styles.cartButton}>
                                <FontAwesome5 name="long-arrow-alt-down" size={7} color={theme === 'purple' ? "white" : "black"} />
                                <Link href="/(user)/menu/wallet/user" style={[styles.cartButtonLink, {borderWidth:0.5,height:19}, theme === 'purple' ? {borderColor:'#fff'} : {}]}>
                                    <Text style={[
                                            {
                                                fontSize:11,
                                                lineHeight:10
                                            }, 
                                            theme === 'purple' ? {color:'#fff'} : {}
                                        ]}>
                                        получить
                                    </Text>
                                </Link>
                                
                            </View>
                        </View>
                    </View>
                </View>
                
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
    headerContainer: {
        borderBottomWidth: 0,
        width: '100%',
        paddingHorizontal:16,
        padding: 25,
        paddingBottom: 20,
        
    },
    headerTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 49,
        maxWidth:900,
        width: '100%',
    },
    headerTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight:'bold',
        lineHeight:24
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
        marginTop:15,
        maxWidth:900,
        width: '100%',
    },
    headerFirstListItem:{
        paddingHorizontal:6,
        paddingVertical:1,
        borderRadius:5,
        // fontSize: 18,
        fontWeight: 'bold',
        backgroundColor:'white',
    },
    headerSecondList:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems:'center',
        marginTop:5,
        maxWidth:900,
        width: '100%',
    },
    headerCartButtonContainer:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        alignItems:'center'
    },

    headerCartContainer:{
        width:130,
        height:70,
        borderWidth:3,
        borderColor:'#FFFF',
        borderRadius:5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        paddingVertical:6,
        paddingBottom:7.5
    },
    headerCartTitle:{
        width:'100%',
        padding:4,
        paddingHorizontal:6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems:'center'
    }, 
    cartTitle:{
        fontSize:8,
        fontWeight: 'bold',
    }, 
    cartName:{
        fontSize:8.5
    }, 
    headerCartWallet:{
        // fontSize:6.5,
        fontWeight: 'bold',
        paddingHorizontal:6,
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
        alignItems:'center',
        borderRadius:5,
    },
    cartButtonLink:{
        paddingHorizontal:6,
    
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:5,
        borderRadius:5,
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
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop:16,
        paddingBottom:26,
        alignItems: 'center',
        shadowColor: '#000',
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    logoutModal:{
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 111,
    },
});

export default MainHeader;
