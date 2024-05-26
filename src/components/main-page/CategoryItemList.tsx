import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions} from "react-native";
import {Colors} from "@/constants/Colors";
import {ICategory, ICategoryItem} from "@/src/types";
import {Link, useSegments} from "expo-router";
import wallet from "@/assets/data/wallet";
import { Entypo } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 20 ; // Оставляем немного пространства для отступов

type CategoryListProps = {
    categoryList: ICategoryItem,
    title?: string,
    isBonus?:boolean
}
export default function CategoryItemList ({categoryList, title, isBonus}:CategoryListProps) {
    const segments = useSegments();
    console.log(segments);
    return (
        <View style={styles.container}>
            {isBonus
                ?
                <View style={{height:40, backgroundColor:'#D9D9D9',display:'flex',paddingLeft:15,flexDirection:'row', gap:20,alignItems:'center', borderRadius:11}}>
                    <Entypo name="info-with-circle" size={24} color="#6B6B6B" />
                    <Text style={{color:'#6C6868', fontSize:16, fontWeight:600}}>Как получить бонусы?</Text>
                </View>

                :
                <Text></Text> }
            <Text style={styles.title}>{title}</Text>
            <FlatList
                data={categoryList}
                style={styles.flatlist}
                renderItem={({item}) =>
                <Link href={`${segments[0]}/menu/category/${item.id}`} asChild>
                       <Pressable style={styles.itemContainer}>
                            <Image source={{uri: item.image}} style={styles.image} resizeMode={"contain"}/>
                           <Text style={styles.text}>{item.name}</Text>
                       </Pressable>
                   </Link>
            }
                numColumns={2} // Указываем количество колонок
                keyExtractor={(item) => item.id.toString()} // Добавляем keyExtractor для уникальности
                contentContainerStyle={{gap:11}}
                columnWrapperStyle={{gap:11}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        // flex:1,
        // aspectRatio:1

    },
    flatlist:{
        // flex:1
    },
    itemContainer: {
        width: ITEM_WIDTH,
        // margin: 5,
        // padding: 10,
        backgroundColor: 'white',
        height:100,
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
    },
});


