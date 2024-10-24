import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions} from "react-native";
import {Link, useSegments} from "expo-router";
import { Entypo } from '@expo/vector-icons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import React from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {IBusinessInCategory} from '../../types'
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 26 ; // Оставляем немного пространства для отступов

type CategoryListProps = {
    categoryList:  IBusinessInCategory | null,
    title?: string,
    isBonus?:boolean,
    isAdmin?:boolean,
    buttonLink?:string,
    onWalletPress?:any
}
export default function CategoryItemList ({categoryList, title, isBonus, isAdmin, buttonLink,onWalletPress}:CategoryListProps) {
    const segments = useSegments();
    console.log(segments);
    const { theme } = useCustomTheme();
    const handleWalletPress = () => {
        onWalletPress(true);
    };
    return (
        <View style={styles.container}>
            {isBonus
                &&
                <Pressable onPress={handleWalletPress} style={[styles.bonus, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]}>
                    <Entypo name="info-with-circle" size={24} color={theme === 'purple' ? '#EFEFEF' : '#363C36'} />
                    <Pressable onPress={handleWalletPress}>
                        <Text  style={[styles.bonusText, theme === 'purple' ? styles.purpleText : styles.greenText]}>
                            Как получить и вывести кэшбэк pzm
                        </Text>
                    </Pressable>
                </Pressable> }
            <FlatList
                data={categoryList}
                style={styles.flatlist}
                renderItem={({item}) =>
                    <Link href={`/${segments[0]}/menu/category-item/${item.id}/`} asChild>
                       <Pressable style={styles.itemContainer} onPress={() => {console.log(item, item.id)}}>
                            {/* <FastImage
                                style={styles.image}
                                source={{
                                    uri: `${apiUrl}${item.logo}`,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            /> */}
                            <View style={{position:'relative'}}>
                                <Image source={{uri: `${apiUrl}${item.logo}`}} style={styles.image} resizeMode={"contain"}/> 
                                <View style={styles.saleContainer}>
                                    <Text style={styles.sale}>{item?.cashback_size}%</Text>
                                </View>
                            </View>
                            <Text style={styles.text}>{item.title ? item.title : 'Без названия'}</Text>
                           
                       </Pressable>
                   </Link>
            }
                numColumns={2} // Указываем количество колонок
                keyExtractor={(item) => item.id.toString()} // Добавляем keyExtractor для уникальности
                contentContainerStyle={{gap:11}}
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
        fontSize:15,
        fontWeight:600
    },
    bonus:{
        height:44,
        display:'flex',
        paddingLeft:15,
        flexDirection:'row',
        gap:8,
        alignItems:'center',
        borderRadius:11,
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
    },
    flatlist:{
        paddingTop: 30,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        backgroundColor: 'white',
    },
    image: {
        height:110,
        objectFit:'cover',
        borderRadius: 13,
        borderWidth:1,
        borderColor:'#898989'
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    text:{
        marginTop:5,
        marginLeft:7,
        fontSize:15,
        fontWeight:'medium'
    },
});


