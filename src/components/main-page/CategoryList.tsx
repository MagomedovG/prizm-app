import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions} from "react-native";
import {Colors} from "@/constants/Colors";
import {ICategory} from "@/src/types";
import {Link, useSegments} from "expo-router";
import wallet from "@/assets/data/wallet";
import SearchInput from "@/src/components/SearchInput";
import {useEffect, useState} from "react";

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 20; // Оставляем немного пространства для отступов

type CategoryListProps = {
    title?:string,
    categories: ICategory[]
}
export default function CategoryList ({categories, title}:CategoryListProps) {
    const segments = useSegments();
    console.log(segments);
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        setFilteredData(categories); // Обновление данных при изменении пропсов
    }, [categories]);
    const handleFilteredData = (data:[]) => {
        setFilteredData(data);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <SearchInput data={categories} onFilteredData={handleFilteredData} placeholder="Найти супермаркет"/>
            <FlatList
                data={filteredData}
                style={styles.flatlist}
                renderItem={({item}) =>
                    <Link href={`${segments[0]}/menu/category/${item.id}`} asChild>
                        <Pressable style={styles.itemContainer}>
                            <Image source={{uri: item.image}} style={styles.image} resizeMode={"contain"}/>
                            <Text style={styles.text}>{item.name}</Text>
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
        flex:1
    },
    container: {
        width: '100%',
        flex:1,
        marginBottom:50
        // aspectRatio:1
    },
    itemContainer: {
        width: ITEM_WIDTH,
        // margin: 5,
        // padding: 10,
        backgroundColor: 'white',
        height:167,
        position:'relative',
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
        marginVertical: 10
    },
    text:{
        position:'absolute',
        bottom:10,
        left:11,
        right:11,
        fontSize:12
    }
});


