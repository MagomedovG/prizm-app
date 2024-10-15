import React, {useEffect, useRef, useState} from 'react';
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
    FlatList,
    // Modal,
    Platform,
    Alert,
    
} from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Animated,Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Link, Stack, useLocalSearchParams, useRouter, useSegments} from "expo-router";

import {categories, defaultLogo} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
import { AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import {ICategory, ICategoryItemList} from "@/src/types";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {LinearGradient} from "expo-linear-gradient";
import {lightColor} from "@/assets/data/colors";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import Swiper from 'react-native-swiper'
const { width, height } = Dimensions.get('window');
import { IFeedbacks,IBusiness } from '@/src/types';
const deviceWidth = Dimensions.get("window").width;
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import QRCode from 'react-qr-code';
// import { AsyncStorage } from 'react-native';
import Modal from "react-native-modal";

const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );
const ITEM_WIDTH = width - 25;

export default function categoryId() {
    const router = useRouter()
    const {theme} = useCustomTheme()
    const { id } = useLocalSearchParams()
    const [business, setBusiness] = useState<IBusiness | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const categoryId = Number(id)
    const [isQrModal, setIsQrModal] = useState(false);
    const [prizmWallet, setPrizmWallet] = useState('')
    
    const [prizmQrCode, setPrizmQrCode] = useState('') 
    const inputRef = useRef(null);
    const copyToClipboard = () => {
        if (prizmWallet && typeof prizmWallet === "string" ) {
            Clipboard.setString(prizmWallet);
        }
        Alert.alert('Кошелек скопирован!', prizmWallet)
    };
    const descr = 'Зеленое яблоко - это яблоко зеленого цвета. Большой магазин не в форме яблока где продают яблоки разного цвета, не только зеленые, но и красные и Зеленое яблоко - это яблоко зеленого цвета. Большой магазин не в форме яблока где продают яблоки разного цвета, не только зеленые, но и красные и Зеленое яблоко - это яблоко зеленого цвета. Большой магазин не в форме яблока где продают яблоки разного цвета, не только зеленые, но и красные и Зеленое яблоко - это яблоко зеленого цвета. Большой магазин не в форме яблока где продают яблоки разного цвета, не только зеленые, но и красные'
    // const category: ICategory | undefined = categories.find(c => c.id.toString() === '1');

    // if (!category){
    //     return <Text>Wallet Not Found</Text>
    // }
    const openQrModal = () => {
        setIsQrModal(true) 
        
    };
    
    const closeQrModal = () => {
        setIsQrModal(false); 
    };
    const toggleText = () => {
        setIsExpanded(!isExpanded);
    };

    const getDisplayText = (text:string) => {
        if (isExpanded) {
            return text;
        }
        return text?.length > 225 ? `${text.slice(0, 220)} ` : text;
    };

    useEffect(() => {
        const getWallet = async () => {
            try {
                const url = await AsyncStorage.getItem('prizm_wallet');
                const qr = await AsyncStorage.getItem('prizm_qr_code_url');
        
                // Проверяем, нужно ли парсить данные
                // const parsedUrl = url ? JSON.parse(url) : url;
                // const parsedQr = qr ? JSON.parse(qr) : qr;
        
                console.log('parsedQr', url, 'parsedUrl',typeof url);
                setPrizmWallet(url || '');
                setPrizmQrCode(qr || '');
            } catch (error) {
                console.error('Ошибка при получении данных из AsyncStorage:', error);
            }
        };
        async function getData() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/business/${id}/`,
                );
                const data = await response.json();
                console.log(data);
                setBusiness(data?.business);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        }

        getData();
        getWallet()
    }, []);

    const openFullscreen = (index: number) => {
        setFullscreenImageIndex(index);
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    // const categoryItem: ICategoryItemList = category.items[categoryId - 1]
    const segments = useSegments();

    const [pan] = useState(new Animated.ValueXY());

    const handleGesture = Animated.event(
        [{ nativeEvent: { translationY: pan.y } }],
        { useNativeDriver: false }
    );

    const handleGestureEnd = (event:any) => {
        const { translationY } = event.nativeEvent;

        if (translationY > 150) { // чувствительность к свайпу вниз
            closeFullscreen();
        } else {
            pan.setValue({ x: 0, y: 0 });
        }
    };
    
    return (
        <ScrollView style={{ paddingTop:173, flex:1}}>
            <View style={{width:'100%', position:'absolute', top: -173}}>
                {business?.images ?
                    <Swiper showsButtons={false} showsPagination={false} autoplay={false} style={{minHeight:260,
                        maxHeight:289}}>
                        {business?.images?.map((item:any, index:number) => (
                            <Pressable key={index} onPress={() => openFullscreen(index)} style={styles.slide}>
                                <Image
                                    style={styles.image}
                                    source={{uri: item?.image ? `${apiUrl}${item.image}` : defaultLogo}}
                                />
                            </Pressable>
                        ))}
                    </Swiper>
                    : <View/>
                }
            </View>

            <View style={styles.container}>
                <Stack.Screen options={{
                    headerShown:false,
                }}/>

                <View style={{marginBottom:180}}>
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
                                <Text style={[styles.cartSubtitle, theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.short_description}</Text>
                            </View>
                            <View style={styles.cartSaleContainer}>
                                <Entypo name="star" size={24} color={theme === 'purple' ? 'white' : '#070907'} />
                                <Text style={[{fontSize:15,color:'white', marginLeft:7, marginRight:17}, theme === 'purple' ? styles.purpleText : styles.greenText]}>{business?.ratings_number}</Text>
                                <Link href={`${segments[0]}/menu/category-item/feedback/${business?.id}`} style={[theme === 'purple' ? styles.purpleText : styles.greenText, {fontSize:15,textDecorationLine:'underline', paddingBottom:2}]}>Отзывы</Link>
                            </View>
                        </View>
                    </LinearGradient>

                    <Text style={styles.subTitle}>Адрес:</Text>
                    <Link href={business?.map_url ? business?.map_url : ''} asChild >
                        <Pressable>
                            {({pressed}) => (
                                <View>
                                    <Text style={[styles.text, {textDecorationLine:'underline'}]}>{business?.address}</Text>
                                </View>
                            )}
                        </Pressable>
                    </Link>
                    <Text style={styles.subTitle}>Как получить кэшбек</Text>
                    <View>
                        <View style={{display:'flex', flexDirection:'row', gap:13, alignItems:'center'}}>
                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                            <Pressable onPress={openQrModal} style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    {/* <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View> */}
                                    <Text style={styles.text}>
                                        При оплате покажите
                                        <Text style={{color:theme === 'purple' ? '#6F1AEC' : '#375A2C',textDecorationLine:'underline'}}> qr-код продавцу</Text>
                                    </Text>
                                </Pressable>
                            {/* <Text style={styles.text}>При оплате покажите qr-код продавцу</Text> */}
                        </View>
                        <View style={{width: 1,
                            height: 17,
                            backgroundColor: 'black',
                            alignSelf: 'flex-start',
                            marginVertical: 5,
                            marginLeft:19
                        }}></View>
                        <View style={{display:'flex', flexDirection:'row', gap:13, alignItems:'center'}}>
                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>2</Text></View>
                            <Text style={styles.text}>Кэшбэк начислится мгновенно</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>О партнере</Text>
                    <Text style={[styles.text]}>
                    {/* {business?.description} */}
                        {/* {descr} */}
                        {business && getDisplayText(business?.description)}
                        {business && business?.description?.length > 225 && !isExpanded && (
                            <Pressable onPress={toggleText}>
                                <Text style={[{fontSize: 16,height:17,fontWeight:'bold',display:'flex',alignItems:'center',flexDirection:'row',justifyContent:'center', textAlign:'center'}]}> еще...</Text>
                            </Pressable>
                        )}
                    </Text>
                    
                    
                </View>
                <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isQrModal}
                onSwipeComplete={closeQrModal}
                onBackdropPress={closeQrModal}
                animationInTiming={300}
                animationOut='slideOutDown'
                animationOutTiming={300}
                backdropTransitionOutTiming={0}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.qrModal}
            >
                <View style={styles.centeredQrView}>
                    <View style={styles.qrModalView}>
                        <View style={styles.qrimage}>
                            <QRCode
                                size={deviceWidth / 1.8}
                                value={prizmQrCode}
                                level={'M'}
                            />
                        </View>
                        <Pressable onPress={copyToClipboard} style={styles.pressable}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                editable={false}
                                // onChangeText={setPrizmWallet}
                                value={prizmWallet}
                            />
                            <View style={styles.copyButtonContainer}>
                                <AntDesign name="copy1" size={15} color="#262626" />
                            </View>
                        </Pressable>

                    </View>
                </View>
            </Modal>

            </View>

            <Modal
            isVisible={isFullscreen} // это свойство отвечает за видимость модалки
            onSwipeComplete={closeFullscreen} // закрытие модалки при свайпе вниз
            swipeDirection="down" // определяем направление свайпа
            deviceWidth={deviceWidth}
            deviceHeight={deviceHeight}
            style={{width:deviceWidth,height:deviceHeight,margin:0}} // стили для модалки
            animationIn="slideInUp" // анимация при открытии
            animationOut="slideOutDown" // анимация при закрытии
            backdropOpacity={0.8} // настройка прозрачности фона
        >
            <View style={styles.fullscreenContainer}>
                <Swiper
                    index={fullscreenImageIndex}
                    showsButtons={true}
                    showsPagination={false}
                    loop={false}
                    style={{ minHeight: 260, maxHeight: deviceHeight }}
                    nextButton={<AntDesign name="right" style={styles.arrowIcon} size={24} />}
                    prevButton={<AntDesign name="left" style={styles.arrowIcon} size={24} />}
                >
                    {business?.images?.map((item: any, index: number) => (
                        <View key={index} style={styles.fullscreenSlide}>
                            <Image
                                style={styles.fullscreenImage}
                                source={{ uri: item?.image ? `${apiUrl}${item.image}` : defaultLogo }}
                            />
                        </View>
                    ))}
                </Swiper>
                <Pressable style={styles.closeButton} onPress={closeFullscreen}>
                    <AntDesign name="close" size={30} color="white" />
                </Pressable>
            </View>
        </Modal>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    qrimage:{
        marginHorizontal: 13,
        marginBottom:23,
        // aspectRatio: 1,
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
        borderRadius:10,
        borderWidth:17,
        borderColor:'#fff'
    },

    greenText: {
        color: '#070907'
    },
    purpleText: {
        color: 'white'
    },
    purpleCircle: {
        backgroundColor: '#5C2389',
    },
    greenCircle: {
        backgroundColor: '#CDF3C2',
    },
    purpleCircleText: {
        color: 'white',
    },
    greenCircleText: {
        color: 'black',
    },
    qrModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop:38,
        paddingBottom:26,
        alignItems: 'center',
        shadowColor: '#000',
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    centeredQrView:{
        // width:deviceWidth - 60,
        // width:'100%'

    },
    centeredView: {
        // flex: 1,
        justifyContent: 'flex-end',
    },
    qrModal:{
        margin: 0,
        justifyContent: 'center',
        alignItems:'center',
        zIndex:3
    },
    pressable: {
        position: 'relative',
        width:deviceWidth / 1.8 + 34
    },
    copyButtonContainer: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // width:'100%'
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#EFEFEF',
        borderRadius: 5,
        color: '#707070',
        width:'100%'
    },
    circle: {
        borderRadius: 50,
        backgroundColor: lightColor,
        width: 38,
        height: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    subTitle: {
        marginTop: 30,
        marginBottom: 9,
        color: '#323232',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartSaleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cartInfo: {
        maxWidth: '70%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 85,
        paddingBottom: 3
    },
    cartSubtitle: {
        color: 'white',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight: '600'
    },
    cartLogo: {
        width: 85,
        height: 85,
        borderRadius: 100,
        objectFit: 'cover'
    },
    cart: {
        backgroundColor: '#535353',
        paddingHorizontal: 16,
        paddingVertical: 25,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32
    },
    sale: {
        backgroundColor: 'white',
        paddingHorizontal: 18,
        paddingVertical: 9,
        textAlign: 'center',
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'flex-start'
    },
    saleText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        position: 'relative',
        marginBottom: 50,
        alignSelf: 'center',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    fullscreenContainer: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenSlide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: deviceWidth,
        height: height,
        resizeMode: 'contain',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    arrowButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowIcon: {
        color: 'grey',
    },
});
