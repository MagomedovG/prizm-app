import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
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

    useEffect(() => {
        async function getData() {
            const userId =  JSON.parse(await asyncStorage.getItem('user_id'))
            const username = JSON.parse(await asyncStorage.getItem('username'))
            const prizm_wallet = JSON.parse(await asyncStorage.getItem('prizm_wallet'))
            const is_superuser = JSON.parse(await asyncStorage.getItem('is_superuser'))

            const form = {
                is_superuser,
                username,
                prizm_wallet,
            }
            console.log(form, userId)
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/users/${userId}/wallet-data/`,{
                        // method: 'GET',
                        // headers: {
                        //     'Content-Type': 'application/json',
                        // },
                        // body: JSON.stringify(form),
                    }
                );
                const data = await response.json();

                console.log(data);
                setInfo(data);
                // if (data.prizm_qr_code_url) {
                    onQrCodeUrlUpdate(data.prizm_qr_code_url);  // Обновляем URL
                // }
                console.log('Mainheader info',data)
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/${userId}/wallet-data/`);
                // console.log(response);
            }
        }
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

        getData()
        fetchHiddenState();
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

                <View style={styles.headerProfileGroup}>
                    <Pressable
                        style={styles.headerPitopi}
                        // onPress={() => changeTheme('purple')}
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
                        {isHidden ? '****' : `B : ${info?.balance_in_pzm} pzm`}
                    </Text>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '****' : `P : ${info?.para_balance} pzm`}
                    </Text>
                </View>
                <View style={styles.headerListItems}>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '****' : `1 pzm = ${info?.prizm_to_rub_exchange_rate ? info?.prizm_to_rub_exchange_rate.toFixed(3) : 0} руб`}
                    </Text>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '****' : `баланс = ${info?.balance_in_rub ? info?.balance_in_rub.toFixed(3) : 0} руб`}
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
        marginTop: 29,
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
