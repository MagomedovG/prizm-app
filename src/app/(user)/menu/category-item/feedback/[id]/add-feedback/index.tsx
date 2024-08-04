
import {Link, router, Stack, useLocalSearchParams, useRouter, useSegments} from 'expo-router';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    Image,
    Dimensions
} from "react-native";
import {StyleSheet} from "react-native";
import {Colors} from '@/constants/Colors'
import ProductListItem from "@/src/components/ProductListItem";
import React, {useEffect, useState} from "react";
import UIButton from "@/src/components/UIButton";
import {adminCategories, categories, defaultLogo} from "@/assets/data/categories";
import {LinearGradient} from "expo-linear-gradient";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import HeaderLink from "@/src/components/HeaderLink";
import {AntDesign} from "@expo/vector-icons";
import {lightColor} from "@/assets/data/colors";
import {ICategory, ICategoryItemList} from "@/src/types";
const { width } = Dimensions.get('window');
// import ICategoryItemLi
const ITEM_WIDTH = width - 25;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;


export default function AddFeedback() {
    const [number, setNumber] = useState()
    const [password, setPassword] = useState()
    const {theme} = useCustomTheme()
    const [text, setText] = useState('');
    const [business, setBusiness] = useState(null)

    const { id } = useLocalSearchParams()

    const categoryId = Number(id)
    const category: ICategory = categories.find(c => c.id.toString() === '1');
    const segments = useSegments();
    const categoryItem: ICategoryItemList = category.items[categoryId - 1]
    useEffect(() => {
        async function getData() {
            try {
                // CookieManager.getAll(true)
                //     .then((cookies) => {
                //         console.log('CookieManager.getAll =>', cookies);
                //     });
                // const cookies = await Cookies.get(apiUrl);
                // const csrfToken = cookies['csrftoken'];
                const response = await fetch(
                    `${apiUrl}/api/v1/business/${id}/`,
                    // {
                    // credentials: "include",
                    // headers: {
                    //     "X-CSRFToken": `${csrfToken}`,
                    // },
                    // }
                );
                const data = await response.json();
                console.log(data);
                setBusiness(data);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                // console.log(response);
            }
        }

        getData();
    }, []);

    const router = useRouter()
    // getCategories ([id])  => {
    //     router.push(`/(admin)/menu/${[id]}`)
    // }
    const renderStars = (averageMark: number, markSize: number, color?: string) => {
        const fullStars = Math.floor(averageMark);
        const halfStar = averageMark % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <View style={styles.starContainer}>
                {[...Array(fullStars)].map((_, index) => (
                    <AntDesign key={`full-${index}`} name="star" size={markSize} color={color ? color : 'white'} />
                ))}
                {halfStar === 1 && <AntDesign key="half" name="staro" size={markSize} color={color ? color : 'white'} />}
                {[...Array(emptyStars)].map((_, index) => (
                    <AntDesign key={`empty-${index}`} name="staro" size={markSize} color={color ? color : 'white'} />
                ))}
            </View>
        );
    };
    return (
        <>
            <ScrollView style={{ }}>


                <ScrollView style={styles.container}>
                    <Stack.Screen options={{
                        headerShown:false,
                        header: () => <HeaderLink title="Супермаркеты" link={`/(user)/menu/category/${category.id}`} emptyBackGround={false}/>,
                    }}/>

                    <View>
                        {/*<Image source={{uri:category.items[categoryId - 1].logo ? categoryItem.logo : defaultLogo}}/>*/}
                        {/*<View style={styles.sale}>*/}
                            {/*<Text style={styles.saleText}>Кэшбек {categoryItem.sale}%</Text>*/}
                        {/*</View>*/}
                        <Image style={{width:'100%',aspectRatio:1, maxHeight:140,borderTopRightRadius:15, borderTopLeftRadius:15}} source={{uri:categoryItem.image}} />
                        <LinearGradient
                            colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.cart}
                        >
                            {/*<Image*/}
                            {/*    source={{uri:category.items[categoryId - 1].logo ? categoryItem.logo : defaultLogo}}*/}
                            {/*    style={styles.cartLogo}/>*/}
                            <View style={styles.cartInfo}>
                                <View>
                                    <Text style={[styles.cartTitle, theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.title}</Text>
                                    <Text style={[styles.cartSubtitle, theme === 'purple' ? {color:'#CACACA'}  : styles.greenText]}>{business?.description}</Text>
                                </View>
                                <Text style={[{fontSize:16, marginTop:14, marginBottom:23},theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.adress}</Text>
                                <View style={styles.cartSaleContainer}>
                                    {renderStars(5, 42)}
                                </View>
                            </View>

                        </LinearGradient>
                        <Text style={styles.subTitle}>Опишите плюсы и минусы</Text>
                        <View style={styles.textContainer}>
                            <TextInput
                                style={styles.textArea}
                                multiline
                                numberOfLines={4}
                                value={text}
                                onChangeText={text => setText(text)}
                                placeholder="Начните писать отзыв"
                            />
                        </View>

                    </View>


                </ScrollView>
            </ScrollView>
            <UIButton text={'Ок'}/>
        </>

    );
}
const styles = StyleSheet.create({
    textContainer:{
        flex: 1,
        justifyContent: 'center',
        marginTop:5,
        marginBottom:150
        // padding: 16,
    },
    textArea:{
        height: 178,
        padding: 13,
        backgroundColor: '#f0f0f0',
        borderColor: '#828282',
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'top',
        fontSize:18
    },
    greenText:{
        color:'#070907'
    },
    purpleText:{
        color:'white'
    },
    purpleCircle:{
        backgroundColor:'#5C2389',
    },
    greenCircle:{
        backgroundColor:'#CDF3C2',
    },
    purpleCircleText:{
        color:'white',
    },
    greenCircleText:{
        color:'black',
    },
    circle:{
        borderRadius:50,
        backgroundColor: lightColor,
        width:43,
        height:43,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    subTitle:{
        marginTop:30,
        marginBottom:5,
        color:'#323232',
        fontSize:22,
        // fontWeight:'bold'
    },
    text:{
        fontSize:16,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartSaleContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:'100%'
    },
    cartInfo:{
        // maxWidth:'70%',
        width:'100%',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'flex-start',
        // height:'100%',
        flexDirection:'column',
        // height:85,
        paddingBottom:3
    },
    cartSubtitle:{
        color:'#CACACA',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartTitle:{
        fontSize:22,
        color:'white',
        fontWeight:600,
        marginBottom:3
    },
    cartLogo:{
        width:85,
        height:85,
        borderRadius:100,
        objectFit:'cover'
    },
    cart:{
        backgroundColor:'#535353',
        paddingHorizontal:32,
        paddingVertical:20,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,
        display:'flex',
        flexDirection:'row',
        // justifyContent:'space-between',
        alignItems:'center',
        gap:32
    },
    sale:{
        backgroundColor:'white',
        paddingHorizontal:18,
        paddingVertical:9,
        minWidth:127,
        maxWidth:136,
        textAlign:'center',
        borderRadius:10,
        marginTop:73,
        marginBottom:10,
    },
    saleText:{
        color:'#000',
        fontSize:16,
        fontWeight:'bold'
    },
    container: {
        flex: 1,
        display:'flex',
        flexDirection:'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 25,
        // marginHorizontal:42,
        position:'relative',
        marginTop:30,
        marginBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    starContainer: {
        flexDirection: 'row',
        marginTop: 5
    }
})

