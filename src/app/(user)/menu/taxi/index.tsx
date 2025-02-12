import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

import { Text, View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import TaxiItem from '@/src/components/TaxiItem';
import UIButton from '@/src/components/UIButton';
import { useQuery } from '@tanstack/react-query';
const statusBarHeight = StatusBar.currentHeight || 0;
export default function TaxiScreen () {
    const [localityName,setLocalityName]=useState('')
    const [localityType, setLocalityType] = useState('')
    const [localityId, setLocalityId] = useState('')
    const router = useRouter()
    const backToMenu = () => {
        router.back()
    }
    const [taxiList, setTaxiList] = useState([
        {title:'Такси анжи1',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи большое название',cashbackSize:4.5,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:50,telNumber:89999999999},
        {title:'Такси анжи большое название еще больit tot ,jkmit',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:12,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи большое название',cashbackSize:4.5,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:50.8787,telNumber:89999999999},
        {title:'Такси анжи большое название еще больit tot ,jkmit',cashbackSize:58.9889,telNumber:89999999999},
        {title:'Такси анжи',cashbackSize:5,telNumber:89999999999},
        {title:'Такси анжи2',cashbackSize:12.78000,telNumber:89999999999},
    ])
    const { data: taxis, isLoading: isTaxisLoading, refetch: refetchTaxis } = useQuery({
        queryKey:['taxis',localityId,localityType],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/taxi/get-taxis-for-locality/?locality-id=${localityId}&locality-type=${localityType}`);
                return await response.json();
        },
        enabled: !!localityId && !!localityType, 
    });
    const getLocationTypeAndId = async () => {
        const localLocationName = await AsyncStorage.getItem('locality-full-name')
        setLocalityName(localLocationName ? localLocationName : 'не указано местоположение')
        const localLocationId = await AsyncStorage.getItem('locality-id')
        const localLocationType = await AsyncStorage.getItem('locality-type')
        setLocalityId(localLocationId ? localLocationId : '')
        setLocalityType(localLocationType ? localLocationType : '')
        console.log( localLocationName, 'local')
    }
    useFocusEffect(
        React.useCallback(() => {
            getLocationTypeAndId()
        }, [])
    )
    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Такси</Text>
                    <Pressable style={styles.locationContainer} onPress={refetchTaxis}>
                        <Text style={styles.locationTitle}>
                            {localityName ? localityName : 'не указано местоположение'}
                        </Text>
                    </Pressable>
                    <View  style={{paddingBottom:150}}>
                        {taxis && taxis?.length > 0 && taxis?.map((taxi,index)=>(
                            <TaxiItem item={taxi} key={index}/>
                        ))}
                    </View>
                
                </View>
                
            </ScrollView>
            <UIButton text={'На главную'} onPress={backToMenu}/>
        </>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'100%',
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
    },
    title:{
        fontSize:32,
        fontWeight:'bold',
        marginTop:statusBarHeight + 104,
        marginBottom:16
    },
    locationContainer:{
        backgroundColor:'#F5F5F5',
        borderRadius:7,
        paddingHorizontal:14,
        paddingVertical:5,
        marginBottom:52
    },
    locationTitle:{
        fontSize:14,
        color:'#C3C3C3',
        lineHeight:15.5
    },
    taxiList:{
        width:'100%',
    }
})