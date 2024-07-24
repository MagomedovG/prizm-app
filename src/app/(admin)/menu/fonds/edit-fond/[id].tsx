import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, Pressable, TextInput, Button, ScrollView, Dimensions} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useCart} from "@/src/providers/CartProvider";
import {categories} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
import {ICategoryItem} from "@/src/types";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
export default function editFond() {
    const router = useRouter()



    // const {addItem} = useCart()

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


    if (!category){
        return <Text>Fond Not Found</Text>
    }

    const [filteredData, setFilteredData] = useState<ICategoryItem>([]);
    const handleFilteredData = (data:[]) => {
        setFilteredData(data);
    };

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown:false,
                header: () => <HeaderLink title="Главная" link="/(user)/menu"/>,
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
        paddingTop: 36,
        paddingBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    }
})
