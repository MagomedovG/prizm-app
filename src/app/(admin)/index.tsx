
import {Link, router, Stack} from 'expo-router';
import {View, FlatList, ActivityIndicator, Text, TextInput} from "react-native";
import {StyleSheet} from "react-native";
import {Colors} from '@/constants/Colors'
import ProductListItem from "@/src/components/ProductListItem";
import React, {useState} from "react";
import {useProductList} from "@/src/api/products";
import UIButton from "@/src/components/UIButton";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";


export default function AdminMenuScreen() {
    const [password, setPassword] = useState('')
    const {theme} = useCustomTheme()
    async function signInAdminAccount () {
        console.log(password);
        if (password === '1') {
            router.push('/(admin)/menu/')
        }
    }
    return (
        <View style={styles.container}>
            <View style={{marginBottom:100, padding:37}}>
                <Text style={styles.title}>Войти</Text>
                <View style={[styles.inputContainer,theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor: '#86B57A'}]}>
                    <TextInput
                        placeholder={'Пароль'}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
            </View>

            <UIButton text='Ок' onPress={signInAdminAccount}/>
        </View>
    );
}
const styles = StyleSheet.create({
    title:{
        fontSize:40,
        marginBottom:55,
        fontWeight:'normal'
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        // padding:10,
        borderRadius: 20,
    },
    input: {
        padding: 16,
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
    },
})
