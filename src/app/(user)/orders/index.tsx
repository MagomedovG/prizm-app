import {Button, FlatList, StyleSheet, TextInput} from 'react-native';
import orders from '@/assets/data/orders';
import OrderListItem from '@/src/components/OrderListItem';
import { Stack } from 'expo-router';
import { Text } from 'react-native'
import React, {useEffect, useState} from "react";
import {inspect} from "util";
import {Colors} from "@/constants/Colors";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
export default function OrdersScreen() {
    // const [form,setForm]=useState<Object | null>({
    //     username:'',
    //     prizm_wallet: ''
    // })
    const [name,setName]=useState('')
    const [prizm,setPrizm]=useState('')
    const postForm = async () => {
        const form = {
            username:name,
            prizm_wallet: prizm
        }

        try {
            const response = await fetch('http://localhost:8000/api/v1/users/get-or-create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error('Ошибка сети');
            } else {
                await asyncStorage.setItem('username', data?.username)
                await asyncStorage.setItem('prizm_wallet', data?.prizm_wallet)
                await asyncStorage.setItem('is_superuser', data?.is_superuser)
                await asyncStorage.setItem('user_id', data?.id)
                console.log('asyncstorage', asyncStorage.getItem('username'),asyncStorage.getItem('prizm_wallet'),asyncStorage.getItem('is_superuser'),asyncStorage.getItem('user_id'))
            }

            console.log('Успешно создано:', data);
        } catch (error) {
            console.error('Ошибка при создании:', error);
        }
    };
    return (
        <>
            <Stack.Screen options={{ title: 'Orders' }} />
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor='Имя'
            />
            <TextInput
                style={styles.input}
                value={prizm}
                onChangeText={setPrizm}
                placeholderTextColor='Кошелек'
            />
            <Button title='Отправить форму' onPress={postForm}/>
            {/*<FlatList*/}
            {/*    data={orders}*/}
            {/*    contentContainerStyle={{ gap: 10, padding: 10 }}*/}
            {/*    renderItem={({ item }) => <OrderListItem order={item}/>}*/}
            {/*/>*/}
        </>
    );
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        padding:10,
    },
    input:{
        backgroundColor: 'gray',
        padding:10,
        borderRadius:5,
        marginTop:5,
        marginBottom: 20
    },
    label:{
        color:"gray",
        fontSize:17,
    },
    image:{
        width:'50%',
        aspectRatio:1,
        alignSelf: "center"
    },
    textbutton:{
        alignSelf:"center",
        fontWeight:'bold',
        color: Colors.light.tint,
        marginVertical:20
    }
})
