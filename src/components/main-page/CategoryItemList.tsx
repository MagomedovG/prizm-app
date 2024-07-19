import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions} from "react-native";
import {Colors} from "@/constants/Colors";
import {ICategory, ICategoryItem} from "@/src/types";
import {Link, useRouter, useSegments} from "expo-router";
import wallet from "@/assets/data/wallet";
import { Entypo } from '@expo/vector-icons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import React from "react";

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 26 ; // Оставляем немного пространства для отступов

type CategoryListProps = {
    categoryList: ICategoryItem,
    title?: string,
    isBonus?:boolean,
    isAdmin?:boolean,
    buttonLink?:string
}
export default function CategoryItemList ({categoryList, title, isBonus, isAdmin, buttonLink}:CategoryListProps) {
    const segments = useSegments();
    const router = useRouter()
    console.log(segments);
    const { theme } = useCustomTheme();
    const handleAdminPage = () => {
        router.push(`${buttonLink}`)
    }

    return (
        <View style={styles.container}>
            {isBonus
                &&
                <View style={[styles.bonus, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]}>
                    <Entypo name="info-with-circle" size={24} color={theme === 'purple' ? '#EFEFEF' : '#363C36'} />
                    <Text style={[styles.bonusText, theme === 'purple' ? styles.purpleText : styles.greenText]}>Как получить бонусы?</Text>
                </View> }
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
                data={categoryList}
                style={styles.flatlist}
                renderItem={({item}) =>
                <Link href={`${segments[0]}/menu/category-item/${item.id}`} asChild>
                       <Pressable style={styles.itemContainer} onPress={() => {console.log(item, item.id)}}>
                            <Image source={{uri: item.image}} style={styles.image} resizeMode={"contain"}/>
                           <Text style={styles.text}>{item.name}</Text>
                           <View style={styles.saleContainer}>
                               <Text style={styles.sale}>{item?.sale}%</Text>
                           </View>

                       </Pressable>
                   </Link>
            }
                numColumns={2} // Указываем количество колонок
                keyExtractor={(item) => item.id.toString()} // Добавляем keyExtractor для уникальности
                contentContainerStyle={{gap:33}}
                columnWrapperStyle={{gap:6}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
    saleContainer:{
        paddingVertical:9,
        paddingHorizontal:12,
        backgroundColor:'white',
        borderRadius:10,
        position:'absolute',
        right:4,
        bottom:4
    },
    sale:{
        color:'#41146D',
        fontSize:16,
        fontWeight:'bold'
    },
    bonusText:{
        fontSize:16,
        fontWeight:600
    },
    bonus:{
        height:40,
        display:'flex',
        paddingLeft:15,
        flexDirection:'row',
        gap:20,
        alignItems:'center',
        borderRadius:11,
        marginBottom: 30,

    },
    greenText:{
        color:'#363C36'
    },
    purpleText:{
        color:'#EFEFEF'
    },
    purpleBackground:{
        backgroundColor:'#5C2389'
    },
    greenBackground:{
        backgroundColor:'#D5F7CC'
    },
    container: {
        width: '100%',
        marginBottom:50,

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
        height:131,
        position:'relative',
    },
    image: {
        // width: '100%',

        objectFit:'cover',
        height: '100%',
        borderRadius: 13,
        borderWidth:1,
        borderColor:'#898989'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',

    },
    text:{
        // position:'absolute',
        // bottom:10,
        // left:11,
        // right:11,
        marginTop:5,
        marginLeft:7,
        fontSize:14,
        fontWeight:'medium'
    },
});


