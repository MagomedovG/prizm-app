import React, {useEffect} from 'react';
import {Text, View, Image, StyleSheet, Pressable, ScrollView} from "react-native";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import products from "@/assets/data/products";
import {useState} from "react";
import {useCart} from "@/src/providers/CartProvider";
import CategoryList from "@/src/components/main-page/CategoryList";
// import {categories} from "@/assets/data/categories";
import UIButton from "@/src/components/UIButton";
import MainHeader from "@/src/components/MainHeader";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const CategoriesAdminPage = () => {

    const [categories, setCategories] = useState(null)
    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/categories`,
                );
                const data = await response.json();
                console.log(data);
                setCategories(data);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/categories/`);
                // console.log(response);
            }
        }

        getData();
    }, []);
    // const { id } = useLocalSearchParams()

    const router = useRouter()

    return (
        <View style={{flex:1}}>
            <Stack.Screen
                options={{
                    // title: 'mm',
                    headerShown:false,

                }} />
            <ScrollView style={styles.containers}>
                <CategoryList categories={categories} title="Категории" isInput={false} isAdmin={true}/>
            </ScrollView>
            <UIButton text='Добавить категорию' onPress={() => router.push(`menu/categories/add-item/`)}/>
        </View>
    );
};
const styles = StyleSheet.create({
    containers:{
        padding:16,
        marginTop:50
    },
    container:{
        backgroundColor:'white',
        flex:1,
        padding:10
    },
    image:{
        width:'100%',
        aspectRatio:1
    },
    price:{
        fontSize:18,
        fontWeight:'bold',
        marginTop:5
    },
    title:{
        fontSize:22,
        fontWeight:'bold',
        marginTop:20
    }
})
export default CategoriesAdminPage;
