import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Pressable,
    TextInput,
    Button,
    ScrollView,
    Dimensions,
    FlatList
} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter, useSegments} from "expo-router";
import {useCart} from "@/src/providers/CartProvider";
import {categories, defaultLogo} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
import { AntDesign } from '@expo/vector-icons';
import {ICategory, ICategoryItemList} from "@/src/types";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {LinearGradient} from "expo-linear-gradient";
import {lightColor} from "@/assets/data/colors";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import Swiper from 'react-native-swiper'
const { width } = Dimensions.get('window');
// import ICategoryItemLi
const ITEM_WIDTH = width - 25;
export default function categoryId() {
    const router = useRouter()
    const {theme} = useCustomTheme()
    const { id } = useLocalSearchParams()
    const [business, setBusiness] = useState(null)
    const categoryId = Number(id)
    const category: ICategory | undefined = categories.find(c => c.id.toString() === '1');

    if (!category){
        return <Text>Wallet Not Found</Text>
    }
    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/business/${id}/`,
                );
                const data = await response.json();
                console.log(data);
                setBusiness(data);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        }

        getData();
    }, []);

    // const categoryItem: ICategoryItemList = category.items.find(item => item.[id] === categoryId);
    const categoryItem: ICategoryItemList = category.items[categoryId - 1]
    const segments = useSegments();
    return (
        <ScrollView style={{ paddingTop:173}}>
            {/*<Image style={{width:'100%',aspectRatio:1,minHeight:260, maxHeight:289, position:'absolute', top: 0}} source={{uri:business?.images[0] ? `${apiUrl}${business?.images[0]}` : defaultLogo}} />*/}
                <View style={{width:'100%', position:'absolute', top: -173}}>
                    {business?.images ?
                        <Swiper showsButtons={false} showsPagination={false} autoplay={true} style={{minHeight:260,
                            maxHeight:289}}>
                            {business?.images?.map((item, index) => (
                                <View key={index} style={styles.slide}>
                                    <Image
                                        style={styles.image}
                                        source={{uri: item?.image ? `${apiUrl}${item.image}` : defaultLogo}}
                                    />
                                </View>
                            ))}
                        </Swiper>
                        : <View/>
                    }
                </View>



            <ScrollView style={styles.container}>
                <Stack.Screen options={{
                    headerShown:false,
                    // header: () => <HeaderLink title="Супермаркеты" link={`/(user)/menu/category/${category.id}`} emptyBackGround={false}/>,
                }}/>

                <View>

                    <View style={styles.sale}>
                        <Text style={styles.saleText}>Кэшбек {business?.cashback_size}%</Text>
                    </View>
                    <LinearGradient
                        colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.cart}
                    >
                        <Image
                            source={{uri:business?.logo ? `${apiUrl}${business.logo}` : defaultLogo}}
                            style={styles.cartLogo}/>
                        <View style={styles.cartInfo}>
                            <View>
                                <Text style={[styles.cartTitle, theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.title}</Text>
                                <Text style={[styles.cartSubtitle, theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.description}</Text>
                            </View>
                            <View style={styles.cartSaleContainer}>
                                <AntDesign name="star" size={24} color={theme === 'purple' ? 'white' : '#070907'} />
                                <Text style={[{fontSize:15,color:'white', marginLeft:7, marginRight:17}, theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.ratings_number}</Text>
                                <Link href={`${segments[0]}/menu/category-item/feedback/${business?.id}`} style={[theme === 'purple' ? styles.purpleText : styles.greenText, {fontSize:15,textDecorationLine:'underline', paddingBottom:2}]}>Отзывы</Link>
                            </View>
                        </View>
                    </LinearGradient>

                    <Text style={styles.subTitle}>Адрес:</Text>
                    <Text style={[styles.text, {textDecorationLine:'underline'}]}>{business?.address}</Text>
                    <Text style={styles.subTitle}>Как получить кэшбек</Text>
                    <View>
                        <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
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
                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>2</Text></View>
                            <Text style={styles.text}>Кэшбэк начислится мгновенно</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>О партнере</Text>
                    <Text style={styles.text}>
                        {business?.description}
                    </Text>
                </View>


            </ScrollView>
        </ScrollView>



    );
};
const styles = StyleSheet.create({
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
        marginBottom:9,
        color:'#323232',
        fontSize:20,
        fontWeight:'bold'
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
        maxWidth:'70%',
        display:'flex',
        justifyContent:'space-between',
        // height:'100%',
        flexDirection:'column',
        height:85,
        paddingBottom:3
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
        backgroundColor:'white',
        paddingHorizontal:18,
        paddingVertical:9,
        // minWidth:127,
        // maxWidth:136,
        textAlign:'center',
        borderRadius:10,
        // marginTop:73,
        marginBottom:10,
        alignSelf: 'flex-start'
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
        paddingHorizontal: 10,
        position:'relative',

        marginBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        // aspectRatio:1,
        height:'100%'
        // resizeMode: 'cover',
    },

})
