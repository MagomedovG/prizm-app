import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions, ScrollView} from "react-native";
import {Colors} from "@/constants/Colors";
import {ICategory} from "@/src/types";
import {Link, useRouter, useSegments} from "expo-router";
import wallet from "@/assets/data/wallet";
import SearchInput from "@/src/components/SearchInput";
import React, {useEffect, useState} from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 20; // Оставляем немного пространства для отступов

type CategoryListProps = {
    title?:string,
    categories: ICategory[] | any,
    isInput?:boolean,
    isAdmin?:boolean,
    linkButton?:string
}
export default function CategoryList ({categories, title, isInput, isAdmin, linkButton}:CategoryListProps) {
    const segments = useSegments();
    console.log(segments);
    const router = useRouter()
    const [filteredData, setFilteredData] = useState<any>([]);
    const {theme} = useCustomTheme()

    useEffect(() => {
        setFilteredData(categories); // Обновление данных при изменении пропсов
    }, [categories]);
    const handleFilteredData = (data:[]) => {
        setFilteredData(data);
    };
    const handleAdminPage = () => {
        router.push(`${linkButton}`)
    }
    return (
        <View style={styles.container}>
            {isInput && <SearchInput data={categories} onFilteredData={handleFilteredData} placeholder="Поиск"/>}
            {/*<Text style={styles.title}>{title}</Text>*/}
            <View style={styles.titleButton}>
                <Text style={[styles.title, !isAdmin ? {marginBottom: 15} : {marginBottom: 0}]}>{title}</Text>
                {isAdmin && (<Pressable onPress={handleAdminPage}
                                        style={[styles.button, theme === 'purple' ? {backgroundColor: '#5B1FB2'} : {backgroundColor: '#32933C'}, {borderColor: '#41146D'}]}>
                    <Text style={{color: 'white', textAlign: 'center'}}>
                        Добавить
                    </Text>
                </Pressable>)}
            </View>

            <FlatList
                data={filteredData}
                // style={styles.flatlist}
                renderItem={({item}) =>
                    <Link href={`${segments[0]}/menu/category/${item.id}`} asChild>
                        <Pressable style={styles.itemContainer}>

                            <View style={{width:'100%',display:'flex', flexDirection:'row', justifyContent:'space-between', padding:16}}>
                                <Text style={styles.text}>{item.name}</Text>
                                <Ionicons name="cafe-sharp" size={24} color="black" />
                                {/*<Image source={{uri: item.image}} style={styles.image} resizeMode={"contain"}/>*/}

                            </View>

                        </Pressable>
                    </Link>
                }
                numColumns={3} // Указываем количество колонок
                keyExtractor={(item) => item.id.toString()} // Добавляем keyExtractor для уникальности
                contentContainerStyle={{gap:10}}
                columnWrapperStyle={{gap:10}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flatlist:{
        // width: '100%',
        // flex:1
    },
    container: {
        width: '100%',
        height:'100%',
        // flex:1,
        overflow:'scroll',
        marginBottom:300,
        // backgroundColor:'#000'

        // aspectRatio:1
    },
    itemContainer: {
        // width: '100%',
        // margin: 5,
        // padding: 10,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'white',
        height:80,
        borderRadius:13,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.1)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    image: {
        // width: '100%',

        objectFit:'cover',
        height: '100%',
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16
    },
    text:{
        // position:'absolute',
        // bottom:10,
        // left:11,
        // right:11,
        fontSize:16,
        fontWeight:'medium'
    },
    purpleBackground:{
        backgroundColor:'#5C2389'
    },
    titleButton:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:19
    },
    button:{
        borderRadius:33,
        // width:'30%',
        borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:20
    },
});


