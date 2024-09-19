import React, {useEffect, useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    FlatList, RefreshControl, SafeAreaView
} from "react-native";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

import { Link, Stack, useLocalSearchParams, useRouter,useFocusEffect } from "expo-router";
import {  defaultLogo } from "@/assets/data/categories";
import HeaderLink from "@/src/components/HeaderLink";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import UIButton from "@/src/components/UIButton";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import Entypo from '@expo/vector-icons/Entypo';
import { IFeedbacks,IBusiness } from '@/src/types';
import PostRating from '@/src/components/PostRating';
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;

type Feedback = {
    id?: number,
    mark?: number,
    date?: string,
    author_name?: string,
    text?: string
}

export default function feedbackId() {
    const router = useRouter();
    const { theme } = useCustomTheme();
    const { id } = useLocalSearchParams();

    const [business, setBusiness] = useState<IBusiness | null>(null)
    const [feedbacks, setFeedbacks] = useState<IFeedbacks[] | null>(null)
    const [isMineFeedbacks, setIsMineFeedbacks] = useState<Feedback[]>([])
    const [starsCount, setStarsCount] = useState(0)

    const [refreshing, setRefreshing] = React.useState(false);

    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);
    
        const isCurrentYear = new Date().getFullYear() === date.getFullYear();
    
        return isCurrentYear
            ? format(date, 'd MMMM', { locale: ru })
            : format(date, 'd MMMM yyyy', { locale: ru }) + ' год';
    };

    // const userId = await asyncStorage.getItem('user_id');
    async function getMyFeedback() {
        try {
            const userId = await asyncStorage.getItem('user_id');
            const response = await fetch(
                `${apiUrl}/api/v1/feedbacks/?created_by=${userId}&business=${id}`,
            );
            let data = await response.json();
            setIsMineFeedbacks(data)
            
        } catch (error) {
            console.error("Ошибка при загрузке данных фидбэков:", error);
        }
    }
    async function getFeedbacks() {
        try {
            const response = await fetch(
                `${apiUrl}/api/v1/business/${id}/get-feedbacks/`,
            );
            let data = await response.json();

            if (!response.ok) {
                console.error("Ошибка при загрузке фидбэков:", response);
            } else {
                setFeedbacks(data);
            }
            console.log(data)
        } catch (error) {
            console.error("Ошибка при загрузке данных фидбэков:", error);
        }
    }

    async function getBusiness() {
        try {
            const userId = await asyncStorage.getItem('user_id');
            console.log('feedback-w-rating',`${apiUrl}/api/v1/business/${id}/?rating-created-by=${userId}`)
            const response = await fetch(
                `${apiUrl}/api/v1/business/${id}/?rating-created-by=${userId}`,
            );
            const data = await response.json();

            if (!response.ok) {
                console.error("Ошибка при загрузке бизнес данных:", response);
            } else {
                setBusiness(data?.business);
                setStarsCount(data?.user_rating_value)
                setRefreshing(false)
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных бизнеса:", error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            getBusiness()
        }, [])
    )


    useEffect(() => {

        getMyFeedback()
        getFeedbacks();
        getBusiness();
    }, [id, apiUrl]);

    const goToAddFeedBack = () => {
        router.push(`/(user)/menu/category-item/feedback/${id}/add-feedback`)
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getBusiness()
        getFeedbacks()
        getMyFeedback()
        
    }, []);

    const getFeedbackWord = (count:number) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
    
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'отзывов';
        } else if (lastDigit === 1) {
            return 'отзыв';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return 'отзыва';
        } else if (count===0) {
            return 'отзывов';
        } else {
            return 'отзывов';
        }
    };


    const getRatingWord = (count: any) => {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'оценок';
        } else if (lastDigit === 1) {
            return 'оценка';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return 'оценки';
        } else {
            return 'оценок';
        }
    };
    
    const renderStars = (averageMark: number, markSize: number, color?: string) => {
        const fullStars = Math.floor(averageMark);
        const halfStar = averageMark % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <View style={styles.starContainer}>
                {[...Array(fullStars)].map((_, index) => (
                    <Entypo key={`full-${index}`} name="star" size={markSize} color={color ? color : 'white'} />
                ))}
                {halfStar === 1 && <Entypo key="half" name="star-outlined" size={markSize} color={color ? color : 'white'} />}
                {[...Array(emptyStars)].map((_, index) => (
                    <Entypo key={`empty-${index}`} name="star-outlined" size={markSize} color={color ? color : 'white'} />
                ))}
            </View>
        );
    };
    

    return (
        // style={styles.cartContainer}
        <>
            <Stack.Screen options={{
                headerShown: false,
                header: () => <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />,
            }} />
            <ScrollView
                contentContainerStyle={styles.cartContainer}
                 refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                 }
            >
                <View style={styles.cartHeader}>
                    <Image
                       source={{ uri:business?.logo ? `${apiUrl}${business.logo}` : defaultLogo}}
                       style={[styles.cartLogo, {borderColor: theme === 'purple' ? '#957ABC' : '#4D7440', borderWidth:1}]} />
                    <View style={styles.cartInfo}>
                        <Text style={styles.cartTitle}>{business?.title}</Text>
                        <Text style={styles.cartSubtitle}>{business?.short_description}</Text>
                    </View>
                </View>
                <Text style={{fontSize:20}}>Отзывы</Text>
                <LinearGradient
                    colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.cart, styles.cartFeedback]}
                >
                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', gap:30}}>
                        <Text style={styles.averageMarkText}>
                            {/*{averageMark.toFixed(1)}*/}
                            {business?.average_rating ? business.average_rating : 0}
                        </Text>
                        <View style={{display:'flex', flexDirection:'column',justifyContent:'space-between', height:52}}>
                            <View>{renderStars(business ? business?.average_rating : 4, 20)}</View>
                            <Text style={{ fontSize: 16, color: '#C0C0C0' }}>
                                {business?.ratings_number} {getRatingWord(business?.ratings_number)}
                            </Text>
                        </View>
                    </View>
                    <Text style={{fontSize:14, color:'#C0C0C0', marginTop:13}}>Оцените и напишите отзыв</Text>
                    {/* <View>{renderStars(5, 42)}</View> */}
                    <PostRating id={id} markSize={42} refreshBusiness={getBusiness} initialStars={starsCount ? starsCount : 0}/>

                </LinearGradient>
                <View style={{
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'space-between',
                        alignItems:'center',
                        // paddingVertical:10, 
                        paddingTop:20,
                        borderBottomColor: theme === 'purple' ? '#41146D' : '#32933C'}}
                    >
                    <Text>{feedbacks ? feedbacks?.length : ''} {feedbacks ? getFeedbackWord(feedbacks?.length) : ''}</Text>
                </View>
                <FlatList
                    data={feedbacks}
                    renderItem={({ item }) => (
                        <View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start', paddingTop:20,paddingBottom:12, borderBottomWidth:1, borderBottomColor: theme === 'purple' ? '#41146D' : '#32933C'}}>
                            <View style={{display:'flex', flexDirection:'row', gap:12, alignItems:'center', marginBottom:15}} >
                                <Text style={{ color: 'black',fontSize:15, fontWeight:'500'}}>
                                    {item?.created_by ? item?.created_by?.username : 'Неизвестный'}
                                </Text>
                                <View style={{gap:16,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                    {/*<View>{item.mark && renderStars(item.mark, 22, theme === 'purple' ? '#41146D' : '#32933C') }</View>*/}
                                    <Text style={{fontSize:14}}>{formatDate(item?.created_at)}</Text>
                                </View>
                            </View>

                            <Text style={{ color: 'black' }}>
                                {item?.text}
                            </Text>
                        </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                />
            </ScrollView>
            
            {isMineFeedbacks?.length < 1 && 
                <UIButton text='Добавить отзыв' onPress={goToAddFeedBack}/>
            }
        </>

    );
};

const styles = StyleSheet.create({
    pickerWrapper: {
        borderWidth: 1,
        // borderColor: theme === 'purple' ? '#41146D' : '#32933C',
        borderColor:'#32933C',

        borderRadius: 5,
        overflow: 'hidden',
        width: 150, // или любая другая подходящая ширина
        height: 40,
        justifyContent: 'center',
    },
    picker: {
        height: 40,
        width: '100%',
        color: '#32933C'
        // color: theme === 'purple' ? '#41146D' : '#32933C', // Цвет текста выбранного элемента
    },
    pickerItem: {
        fontSize: 16, // Размер шрифта элементов
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
    subTitle: {
        marginTop: 52,
        marginBottom: 9,
        color: '#323232',
        fontSize: 20,
        fontWeight: '800'
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
        width: '60%'
    },
    cartSubtitle: {
        color: '#383838',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartTitle: {
        fontSize: 22,
        color: 'black',
        fontWeight: '600'
    },
    cartLogo: {
        width: 110,
        height: 110,
        borderRadius: 100,
        objectFit: 'cover'
    },
    cart: {
        paddingHorizontal: 16,
        paddingVertical: 25,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        // gap: 32,
        marginTop: 26
    },
    cartHeader:{
        // paddingHorizontal: 16,
        paddingVertical: 25,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        // gap: 32,
        marginTop: 26
    },
    cartContainer: {
        marginHorizontal: 16,
    },
    cartFeedback: {
        marginTop: 10,
        paddingHorizontal: 50,
        flexDirection: 'column',


    },
    sale: {
        backgroundColor: '#313131',
        paddingHorizontal: 18,
        paddingVertical: 9,
        width: 127,
        textAlign: 'center',
        borderRadius: 10,
        marginTop: 73,
        marginBottom: 10
    },
    saleText: {
        color: '#D9D9D9',
        fontSize: 16,
        fontWeight: '600'
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        position: 'relative',
        marginTop: 100,
        marginBottom: 50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    averageMarkText: {
        color: 'white',
        fontSize: 65,
        fontWeight: 'bold'
    },
    starContainer: {
        flexDirection: 'row',
        marginTop: 5
    }
});
