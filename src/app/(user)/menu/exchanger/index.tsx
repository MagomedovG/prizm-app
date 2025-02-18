import {Text, View, Pressable, StyleSheet, ScrollView, TextInput, Dimensions, StatusBar, Alert, Platform,FlatList, ActivityIndicator} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from 'expo-router';
import { useCustomTheme } from '@/src/providers/CustomThemeProvider';
import {Image} from 'expo-image'
import { memo, useEffect, useState } from 'react';
import TransactionItem from '@/src/components/TransactionItem';
import { useQuery } from '@tanstack/react-query';
import { IWallet } from '@/src/types';
import React from 'react';
import ExchangerItem from '@/src/components/ExchangerComponents/ExchangerItem/ExcangerItem';
import ExchangerHeaderComponent from '@/src/components/ExchangerComponents/ExchangerHeader/ExchangerHeader';
const { width, height } = Dimensions.get('window');
// const deviceHeight = height + statusBarHeight
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ExchangerScreen (){
    const [orders, setOrders] = useState([]); // Данные для отображения
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [page, setPage] = useState(0); // Текущий offset
    const [hasMore, setHasMore] = useState(true); // Флаг для проверки, есть ли еще данные
    const [prizmWallet, setPrizmWallet] = useState('');
    const limit = 4; // Лимит записей на запрос
    const [nextLink, setNextLink] = useState('')
    

    const fetchOrders = async (wallet?:string) => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(
                nextLink || `${apiUrl}/api/v1/pzm-orders/?user-account-rs=${wallet}`
            );
            const data = await response.json();
            console.log(data?.results.length)
            console.log(`${apiUrl}/api/v1/pzm-orders/?user-account-rs=${wallet}/`)
            if (data?.next){
                setNextLink(data.next)
            } else {
                setHasMore(false)
            }
            if (nextLink){
                console.log('nextLink',nextLink)
            }
            setOrders((prevOrders) => prevOrders ? [...prevOrders, ...data?.results] : data?.results);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };


    


    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator style={styles.loader} />;
      };

      useEffect(() => {
        const getWallet = async () => {
            const prizmWallet = await AsyncStorage.getItem('prizm_wallet')
            if(prizmWallet){
                fetchOrders(prizmWallet);
            } else {
                console.log('wallet не найден')
            }
            
        }
        getWallet()
        // getFee()
        
    }, []);
      
      
    return (
            <FlatList 
                data={orders}
                renderItem={ExchangerItem}
                style={{paddingHorizontal: 26, width: '100%'}}
                onEndReached={()=>fetchOrders()} 
                onEndReachedThreshold={0.4} 
                ListFooterComponent={renderFooter}
                ListHeaderComponent={ExchangerHeaderComponent}
                contentContainerStyle={{gap:7,paddingBottom:50 }}
                keyExtractor={(item, index) => item.created_at?.toString()} 
            />
    );
};


const styles = StyleSheet.create({
    loader: {
        marginVertical: 5,
      },
});
