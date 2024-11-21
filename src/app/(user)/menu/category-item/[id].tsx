import React, {useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Pressable,
    TextInput,
    ScrollView,
    Dimensions,
    Platform,
    Alert,
    StatusBar,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { Animated,Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Link, Stack, useLocalSearchParams, useRouter, useSegments} from "expo-router";
import CachedImage from 'expo-cached-image'
import {defaultLogo} from "@/assets/data/categories";
import { AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import {LinearGradient} from "expo-linear-gradient";
import {lightColor} from "@/assets/data/colors";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import Swiper from 'react-native-swiper'
const { width, height } = Dimensions.get('window');
import { IBusiness } from '@/src/types';
const deviceWidth = Dimensions.get("window").width;
import QRCode from 'react-qr-code';
import Modal from "react-native-modal";
import { useQuery } from '@tanstack/react-query';
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight

const ITEM_WIDTH = width - 25;

export default function categoryId() {
    const {theme} = useCustomTheme()
    const { id } = useLocalSearchParams()
    // const [business, setBusiness] = useState<IBusiness | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
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
    
    const openQrModal = () => {
        setIsQrModal(true) 
    };
    
    const closeQrModal = () => {
        setIsQrModal(false); 
    };
    const toggleText = () => {
        setIsExpanded(true);
    };

    const getDisplayText = (text:string) => {
        if (isExpanded) {
            return text;
        }
        return text?.length > 225 ? `${text.slice(0, 220)}` : text;
    };
    const { data: business, isLoading: isBusinessLoading } = useQuery<IBusiness>({
        queryKey: ['business', id],
        queryFn: async () => {
            const response = await fetch(
                `${apiUrl}/api/v1/business/${id}/`,
            );
            const data = await response.json();
            const business = data.business;
            return business;
        },
    });
    useEffect(() => {
        const getWallet = async () => {
            try {
                const url = await AsyncStorage.getItem('prizm_wallet');
                const qr = await AsyncStorage.getItem('prizm_qr_code_url');       
                setPrizmWallet(url || '');
                setPrizmQrCode(qr || '');
            } catch (error) {
                console.error('Ошибка при получении данных из AsyncStorage:', error);
            }
        };
        getWallet()
    }, []);

    const openFullscreen = (index: number) => {
        setFullscreenImageIndex(index);
        setIsFullscreen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreen(false);
    };

    const segments = useSegments();

    if (isBusinessLoading){
        return <Text>Loading...</Text>
    }

    
    return (
        <ScrollView style={[{  flex:1}, Platform.OS === "ios" ? {paddingTop: 173} : {}]}>
            <View style={[{width:'100%', position:'absolute'}, Platform.OS === "ios" ? {top: -173} : {top: 0}]}>
                {business?.images ?
                    <Swiper showsButtons={false} showsPagination={false} autoplay={false} style={{
                        minHeight:260,
                        maxHeight:289
                        }}>
                        {business?.images?.map((item:any, index:number) => (
                                <Pressable key={index} onPress={() => openFullscreen(index)} style={styles.slide}>
                                    <CachedImage
                                        cacheKey={`${item.id}-category-item-preview-slider`} 
                                        style={styles.image}
                                        source={{uri: item?.image ? `${apiUrl}${item.image}` : defaultLogo}}
                                    />
                                </Pressable>
                            
                        ))}
                    </Swiper>
                    : <View/>
                }
            </View>

            <View style={[styles.container, Platform.OS === "ios" ? {} : {paddingTop:173}]}>
                <Stack.Screen options={{
                    headerShown:false,
                }}/>

                <View style={{marginBottom:180}}>
                    {/* borderColor:'#535353', */}
                    <View style={styles.saleContainer}>
                        <View style={[styles.sale, {borderColor: theme === 'purple' ?  '#852DA5' : '#BAEAAC'}]}>
                            <Text style={styles.saleText}>Vozvrat pzm { business?.cashback_size ? parseFloat(business?.cashback_size?.toString()) : 0}%</Text>
                        </View>
                        {business?.images  &&  <View style={[styles.sale, {borderColor: theme === 'purple' ?  '#852DA5' : '#BAEAAC'}]}>
                            {/* <Pressable></Pressable> */}
                            {/* <Text style={styles.saleText}>{business.images.length} фото</Text> */}
                            <Pressable onPress={() => openFullscreen(fullscreenImageIndex)}>
                                <Text style={styles.saleText}>{business.images.length} фото</Text>
                            </Pressable>
                        </View>}
                    </View>
                    
                    <LinearGradient
                        colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.cart}
                    >
                        <CachedImage
                            cacheKey={`${business?.id}-category-item-logo`} 
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

                    {business?.map_url &&
                        <>
                            <Text style={styles.subTitle}>Адрес:</Text>
                            <Link href={business?.map_url ? business?.map_url : ''} asChild >
                                <Pressable>
                                    {({pressed}) => (
                                        <View>
                                            <Text style={[styles.text, {textDecorationLine:'underline',color:theme === 'purple' ? '#6F1AEC' : '#375A2C',}]}>{business?.address}</Text>
                                        </View>
                                    )}
                                </Pressable>
                            </Link>
                        </>
                        }
                        <Text style={styles.subTitle}>Контакты:</Text>
                        {business?.contacts.length && business?.contacts.length > 1 ?
                            <>
                                
                                <FlatList
                                    data={[...business?.contacts,{
                                        value: "https://whatsapp.com",
                                        contact_type: {
                                            name: "WhatsApp",
                                            text_color: "FFFFFF",
                                            background_color: "33CC33",
                                            logo: "/media/logos/contact_buttons/channels4_profile.jpg",
                                            contact_value_type: "url",
                                            order_number: 2
                                        },
                                        business: 2
                                    },{
                                        value: "+79997779977",
                                        contact_type: {
                                            name: "Телефон",
                                            text_color: "313131",
                                            background_color: "D9D9D9",
                                            logo: "/media/logos/contact_buttons/channels4_profile.jpg",
                                            contact_value_type: "tel",
                                            order_number: 2
                                        },
                                        business: 2
                                    }]}
                                    columnWrapperStyle={styles.row} // Стили для строки
                                    contentContainerStyle={styles.listContainer} 
                                    renderItem={({item}) => (
                                        <Link href={item.contact_type.contact_value_type === 'phone_number' ? `tel:${item.value}` : item.value} style={[styles.contactContainer,{backgroundColor:`#${item.contact_type.background_color}`}]} asChild>
                                            <Pressable>
                                                <View style={{display: 'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10, margin:0, padding:0}}>
                                                    <CachedImage
                                                        cacheKey={`${id}-business-contact-logo-${item.value}`} 
                                                        style={{width:27, height:27, borderRadius:50}}
                                                        source={{uri: `${apiUrl}/${item.contact_type.logo}`}}
                                                    />
                                                    <Text style={[styles.contactText,{color:`#${item.contact_type.text_color}`}]}>
                                                        {item.contact_type.name}
                                                    </Text>
                                                </View>
                                                
                                            </Pressable>
                                         </Link>
                                        
                                    )}
                                    numColumns={[...business?.contacts, {
                                        value: "https://whatsapp.com",
                                        contact_type: {
                                            name: "WhatsApp",
                                            text_color: "FFFFFF",
                                            background_color: "33CC33",
                                            logo: "/media/logos/contact_buttons/channels4_profile.jpg",
                                            contact_value_type: "url",
                                            order_number: 2
                                        },
                                        business: 2
                                    },{
                                        value: "https://whatsapp.com",
                                        contact_type: {
                                            name: "WhatsApp",
                                            text_color: "FFFFFF",
                                            background_color: "33CC33",
                                            logo: "/media/logos/contact_buttons/channels4_profile.jpg",
                                            contact_value_type: "url",
                                            order_number: 2
                                        },
                                        business: 2
                                    }].length > 2 ? 3 : business?.contacts.length} 
                                    keyExtractor={(item) => item.value}
                                    // horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </>
                            : <Text style={{fontWeight:600, fontSize:17, color:'rgba(0, 0, 0, 0.6)'}}>Нет контактов</Text>
                        }
                    <Text style={styles.subTitle}>Как получить vozvrat pzm</Text>
                    <View>
                        <View style={{display:'flex', flexDirection:'row', gap:13, alignItems:'center'}}>
                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                            <Pressable onPress={openQrModal} style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center',maxWidth:'90%'}}>
                                    <Text style={styles.text}>
                                        При оплате <Text style={{color:theme === 'purple' ? '#6F1AEC' : '#375A2C',textDecorationLine:'underline'}}>покажите
                                        qr-код</Text> продавцу
                                    </Text>
                                </Pressable>
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
                            <Text style={styles.text}>Продавец начислит vozvrat pzm 
                            на ваш кошелек</Text>
                        </View>
                    </View>
                    <Text style={styles.subTitle}>О партнере</Text>
                    <Pressable  onPress={toggleText}>
                        <Text style={[styles.text]}>
                            {business && getDisplayText(business?.description)}
                            {business && business?.description?.length > 225 && !isExpanded && (
                                <Text style={[{fontSize: 16,fontWeight:'bold',lineHeight:16, textAlign:'center'}]}>еще...</Text>
                            )}
                        </Text>
                    </Pressable>
                    
                    
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
                    onBackButtonPress={closeQrModal}
                    backdropColor='black'
                    hardwareAccelerated
                    swipeDirection={'down'}
                    style={styles.qrModal}
                    statusBarTranslucent
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
                                    value={prizmWallet}
                                />
                                <View style={styles.copyButtonContainer}>
                                    <AntDesign name="copy1" size={15} color="#262626" />
                                </View>
                            </Pressable>

                        </View>
                    </View>
                    <Pressable style={styles.closeButton} onPress={closeQrModal}>
                            <AntDesign name="close" size={30} color="white" />
                        </Pressable>
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
                backdropOpacity={1} // настройка прозрачности фона
                backdropColor='white'
                animationInTiming={300}
                animationOutTiming={300}
                backdropTransitionOutTiming={0}
                onBackButtonPress={closeFullscreen}
                statusBarTranslucent
            >
                <View style={styles.fullscreenContainer}>
                    <Swiper
                        index={fullscreenImageIndex}
                        showsButtons={true}
                        showsPagination={false}
                        loop={false}
                        style={{ minHeight: 260, maxHeight: deviceHeight }}
                        nextButton={
                            <View style={{
                                backgroundColor:'#fff',
                                borderRadius:50
                            }}>
                                <AntDesign name="right" style={[styles.arrowIcon, {paddingLeft:10}]} size={20} />
                            </View>
                            
                        }
                        prevButton={
                                <View style={{
                                    backgroundColor:'#fff',
                                    borderRadius:50
                                }}>
                                    <AntDesign name="left" style={[styles.arrowIcon, {paddingRight:10}]} size={20} />
                                </View>
                            
                        }
                        scrollEnabled={false}
                    >
                        {business?.images?.map((item: any, index: number) => (
                            <View key={index} style={styles.fullscreenSlide}>
                                <CachedImage
                                    cacheKey={`${item.id}-category-item-full-slider`}
                                    style={styles.fullscreenImage}
                                    placeholderContent={( 
                                        <ActivityIndicator 
                                          size="small"
                                          style={{
                                            flex: 1,
                                            justifyContent: "center",
                                          }}
                                        />
                                      )}
                                    source={{ uri: item?.image ? `${apiUrl}${item.image}` : defaultLogo }}
                                />
                            </View>
                        ))}
                    </Swiper>
                    <Pressable style={styles.closeButton} onPress={closeFullscreen}>
                        <AntDesign name="close" size={26} color="white" style={styles.arrowIcon}/>
                    </Pressable>
                </View>
            </Modal>
            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        gap: 7,
      },
      row: {
        justifyContent: 'space-between', 
        gap:5,
      },
      contactContainer: {
        flex: 1, 
        padding: 10,
        borderRadius: 8,
      },
      contactText: {
        textAlign: 'center',
        fontWeight: 600,
        fontSize: 15,
      },
    qrimage:{
        marginHorizontal: 13,
        marginBottom:23,
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
    },
    centeredView: {
        justifyContent: 'flex-end',
    },
    qrModal:{
        margin: 0,
        justifyContent: 'center',
        alignItems:'center',
        zIndex:3,
        position: 'relative',
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
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingVertical: 15,
        paddingHorizontal: 15,
        paddingRight:25,
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
    saleContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    sale: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 9,
        textAlign: 'center',
        borderRadius: 10,
        marginBottom: 5,
        // alignSelf: 'flex-start',
        borderWidth: 0.5,
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
        // aspectRatio:1
    },
    fullscreenContainer: {
        flex: 1,
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
        height: deviceHeight,
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
        padding:8,
        
    },
});
