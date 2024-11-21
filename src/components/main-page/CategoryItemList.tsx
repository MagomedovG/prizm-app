import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions, ActivityIndicator, useWindowDimensions} from "react-native";
import {Link, useSegments} from "expo-router";
import { Entypo } from '@expo/vector-icons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import React from "react";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {IBusinessInCategory} from '../../types'
import CachedImage from "expo-cached-image";
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 26; // Оставляем немного пространства для отступов
const ITEM_HEIGHT = height 
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
    const {height, width} = useWindowDimensions();
    // const ITEMWIDTH = width / 2 - 26; 
    const isSingleColumn = categoryList && categoryList.length <= 7;
    // const isSingleColumn = true
    const handleWalletPress = () => {
        onWalletPress(true);
    };
    return (
        <View style={styles.container}>
            {isBonus
                &&
                <Pressable onPress={handleWalletPress} style={[styles.bonus, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]}>
                    <Entypo name="info-with-circle" size={18} color={theme === 'purple' ? '#EFEFEF' : '#363C36'} />
                    <Pressable onPress={handleWalletPress}>
                        <Text  style={[styles.bonusText, theme === 'purple' ? styles.purpleText : styles.greenText]}>
                            Как получить и обменять vozvrat pzm
                        </Text>
                    </Pressable>
                </Pressable> }
                <Text style={styles.title}>{title}</Text>
                {categoryList?.length ? (
                <FlatList
                    data={categoryList}
                    style={[styles.flatlist, isSingleColumn && { width: '100%' }]}
                    renderItem={({ item }) => (
                        <Link href={`/${segments[0]}/menu/category-item/${item.id}/`} asChild>
                            <Pressable 
                                style={[
                                    styles.itemContainer, 
                                    isSingleColumn ? { width: '100%'} : { width: width / 2 - 2 }
                                ]}
                                onPress={() => { console.log(item, item.id); }}
                            >
                                <View style={{ position: 'relative' }}>
                                    <CachedImage 
                                        source={{ uri: `${apiUrl}${item.logo}` }} 
                                        style={[styles.image,isSingleColumn ? { width: '100%',height:height / 5.1 } : { width: width / 2 - 26 ,height:110}]}
                                        cacheKey={`${item.id}-category-itemList-logo`}
                                    />
                                    <View style={styles.saleContainer}>
                                        <Text style={styles.sale}>{parseFloat(item?.cashback_size.toString())}%</Text>
                                    </View>
                                </View>
                                <Text style={styles.text}>{item.title || 'Без названия'}</Text>
                            </Pressable>
                        </Link>
                    )}
                    numColumns={isSingleColumn ? 1 : 2}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ gap: 11 }}
                    columnWrapperStyle={!isSingleColumn && { gap: 6 }}
                />
            ) : (
                <Text style={{ color: 'gray', marginTop: ITEM_HEIGHT / 3, fontSize: 18, width: '100%', textAlign: 'center' }}>
                    Нет подходящих бизнесов
                </Text>
            )}
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
        paddingVertical:4,
        paddingHorizontal:9,
        backgroundColor:'white',
        borderRadius:8,
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
        paddingLeft:12,
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
        paddingTop: 15,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        backgroundColor: 'white',
    },
    image: {
        
        objectFit:'cover',
        borderRadius: 13,
        borderWidth:1,
        borderColor:'#898989'
    },
    // title: {
    //     fontSize: 24,
    //     fontWeight: '600',
    // },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginTop: 30,
    },
    text:{
        marginTop:5,
        marginLeft:7,
        fontSize:15,
        fontWeight:'medium'
    },
});


