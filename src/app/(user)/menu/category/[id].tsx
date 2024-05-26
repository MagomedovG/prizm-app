import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, Pressable, TextInput, Button, ScrollView, Dimensions} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useCart} from "@/src/providers/CartProvider";
import {categories} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
export default function categoryId() {
    const router = useRouter()



    const {addItem} = useCart()

    const { id } = useLocalSearchParams()


    const category = categories.find(c => c.id.toString() === id)

    const copyTextToClipboard = async () => {
        try {
            // await navigator.clipboard.writeText((wallet?.prizm).toString());
            console.log('Текст успешно скопирован в буфер обмена!');
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    // const addToCart = () => {
    //     if (!product) {
    //         return
    //     }
    //     addItem(product, selectedSize)
    //     router.push('/(user)/cart')
    //     // console.warn('Adding to cart', selectedSize)
    // }

    if (!category){
        return <Text>Wallet Not Found</Text>
    }

    const [filteredData, setFilteredData] = useState([]);
    const handleFilteredData = (data:[]) => {
        setFilteredData(data);
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown:true,
                header: () => <HeaderLink/>,
            }}/>
            {/*<Text style={styles.title}>{category.name}</Text>*/}

            <SearchInput data={category.items} onFilteredData={handleFilteredData} placeholder="Найти супермаркет"/>
            <CategoryItemList categoryList={filteredData} title={category.name} isBonus={true}/>
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
        marginTop: 100,
        marginBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    }
})
