import React, {useState} from 'react';
import {Text, View, Image, StyleSheet, Pressable, TextInput, Button, ScrollView, Dimensions} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useCart} from "@/src/providers/CartProvider";
import {categories, defaultLogo} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
import { AntDesign } from '@expo/vector-icons';
import {ICategory, ICategoryItemList} from "@/src/types";
const { width } = Dimensions.get('window');
// import ICategoryItemLi
const ITEM_WIDTH = width - 25;
export default function categoryId() {
    const router = useRouter()



    const { id } = useLocalSearchParams()
    const categoryId = Number(id)


    const category: ICategory | undefined = categories.find(c => c.id.toString() === '1');



    if (!category){

        return <Text>Wallet Not Found</Text>

    }


    console.log(category.items[categoryId-1])

    // const categoryItem: ICategoryItemList = category.items.find(item => item.id === categoryId);
    const categoryItem: ICategoryItemList = category.items[categoryId - 1]

    return (
        <ScrollView style={{ flex:1}}>
            <Image style={{width:'100%',minHeight:180, maxHeight:289, position:'absolute', top: 100}} source={{uri:categoryItem.image}} />

            <ScrollView style={styles.container}>
                <Stack.Screen options={{
                    headerShown:true,
                    header: () => <HeaderLink title="Супермаркеты" link={`/(user)/menu/category/${category.id}`} emptyBackGround={false}/>,
                }}/>

                <View>
                    {/*<Image source={{uri:category.items[categoryId - 1].logo ? categoryItem.logo : defaultLogo}}/>*/}
                    <View style={styles.sale}>
                        <Text style={styles.saleText}>Кэшбек {categoryItem.sale}%</Text>
                    </View>
                    <View style={styles.cart}>
                        <Image
                            source={{uri:category.items[categoryId - 1].logo ? categoryItem.logo : defaultLogo}}
                            style={styles.cartLogo}/>
                        <View style={styles.cartInfo}>
                            <Text style={styles.cartTitle}>{categoryItem.name}</Text>
                            <Text style={styles.cartSubtitle}>{categoryItem.subtitle}</Text>
                            <View style={styles.cartSaleContainer}>
                                <AntDesign name="star" size={24} color="white" />
                                <Text style={{color:'white', marginLeft:7, marginRight:17}}>4.5</Text>
                                <Text style={{color:'white'}}>Отзывы</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>Адрес:</Text>
                    <Text style={styles.text}>{categoryItem?.adress}</Text>
                    <Text style={styles.subTitle}>Как получить кэшбек</Text>
                    <View>
                        <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                            <View style={styles.circle}></View>
                            <Text style={styles.text}>При отплате покажите qr-код продавцу dw wecwfce fq fsd</Text>
                        </View>
                        <View style={{width: 1,
                            height: 20,
                            backgroundColor: 'black',
                            alignSelf: 'flex-start',
                            marginVertical: 10,
                            marginLeft:21.5
                        }}></View>
                        <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                            <View style={styles.circle}></View>
                            <Text style={styles.text}>Кэшбэк начислится мгновенно</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>О партнере</Text>
                    <Text style={styles.text}>
                        {categoryItem?.description}
                    </Text>
                </View>


            </ScrollView>
        </ScrollView>



    );
};
const styles = StyleSheet.create({
    circle:{
        borderRadius:50,
        backgroundColor:'#D9D9D9',
        width:43,
        height:43
    },
    subTitle:{
        marginTop:52,
        marginBottom:9,
        color:'#323232',
        fontSize:20,
        fontWeight:800
    },
    text:{
        fontSize:16,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartSaleContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    cartInfo:{
        maxWidth:'70%'
    },
    cartSubtitle:{
        color:'white',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartTitle:{
        fontSize:22,
        color:'white',
        fontWeight:600
    },
    cartLogo:{
        width:85,
        height:85,
        borderRadius:100,
        objectFit:'cover'
    },
    cart:{
        backgroundColor:'#535353',
        paddingHorizontal:16,
        paddingVertical:25,
        borderRadius:15,
        display:'flex',
        flexDirection:'row',
        // justifyContent:'space-between',
        alignItems:'center',
        gap:32
    },
    sale:{
        backgroundColor:'#313131',
        paddingHorizontal:18,
        paddingVertical:9,
        width:127,
        textAlign:'center',
        borderRadius:10,
        marginTop:73,
        marginBottom:10
    },
    saleText:{
        color:'#D9D9D9',
        fontSize:16,
        fontWeight:600
    },
    container: {
        flex: 1,
        display:'flex',
        flexDirection:'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        position:'relative',
        marginTop:100,
        marginBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    }
})
