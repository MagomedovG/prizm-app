import React, {useEffect, useState} from 'react';
import {Text, View, Image, StyleSheet, Pressable, TextInput, Button, ScrollView, Dimensions} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useCart} from "@/src/providers/CartProvider";
// import {categories} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
import {ICategoryItem} from "@/src/types";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function BuisnessAdminPage() {
    // const router = useRouter()

    const [buisnesses, setBuisnesses] = useState(null)
    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/business`,
                );
                const data = await response.json();
                console.log(data);
                setBuisnesses(data);
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

    // const {addItem} = useCart()

    // const { id } = useLocalSearchParams()

    const id = '1'

    // const category = categories.find(c => c.id.toString() === id)

    const copyTextToClipboard = async () => {
        try {
            // await navigator.clipboard.writeText((wallet?.prizm).toString());
            console.log('Текст успешно скопирован в буфер обмена!');
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };



    // if (!category){
    //     return <Text>Wallet Not Found</Text>
    // }

    const [filteredData, setFilteredData] = useState<ICategoryItem>([]);
    const handleFilteredData = (data:[]) => {
        setFilteredData(data);
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown:false,
                header: () => <HeaderLink title="Главная" link="/"/>,
            }}/>
            {/*<Text style={styles.title}>{category.name}</Text>*/}

            <SearchInput data={buisnesses} onFilteredData={handleFilteredData} placeholder="Найти супермаркет"/>
            <CategoryItemList categoryList={filteredData} title={'Бизнесы'} isBonus={false} isAdmin={true} buttonLink='menu/buisness/add-business/'/>
        </ScrollView>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display:'flex',
        flexDirection:'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        paddingVertical: 50,
        // marginBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    }
})
