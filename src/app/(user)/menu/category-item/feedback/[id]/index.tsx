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
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/src/providers/CartProvider";
import { categories, defaultLogo } from "@/assets/data/categories";
import HeaderLink from "@/src/components/HeaderLink";
import { AntDesign } from '@expo/vector-icons';
import { ICategory, ICategoryItemList } from "@/src/types";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import UIButton from "@/src/components/UIButton";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

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

    const [business, setBusiness] = useState(null)
    const [feedbacks, setFeedbacks] = useState(null)
    const [starsCount, setStarsCount] = useState(1)

    const [refreshing, setRefreshing] = React.useState(false);

    const formatDate = (dateString: string) => {
        const date = parseISO(dateString);
    
        const isCurrentYear = new Date().getFullYear() === date.getFullYear();
    
        return isCurrentYear
            ? format(date, 'd MMMM', { locale: ru })
            : format(date, 'd MMMM yyyy', { locale: ru }) + ' год';
    };

    async function getFeedbacks() {
        try {
            const response = await fetch(
                `${apiUrl}/api/v1/business/${id}/get-feedbacks/`,
            );
            const data = await response.json();

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
            const response = await fetch(
                `${apiUrl}/api/v1/business/${id}/`,
            );
            const data = await response.json();

            if (!response.ok) {
                console.error("Ошибка при загрузке бизнес данных:", response);
            } else {
                setBusiness(data);
                setStarsCount(data.ratings_number)
                setRefreshing(false)
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных бизнеса:", error);
        }
    }


    useEffect(() => {


        getFeedbacks();
        getBusiness();
    }, [id, apiUrl]);

    const goToAddFeedBack = () => {
        router.push(`(user)/menu/category-item/feedback/${id}/add-feedback`)
    }
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getBusiness()
        getFeedbacks()
        // setTimeout(() => {
        //     setRefreshing(false);
        // }, 2000);
    }, []);


    // const categoryItem: ICategoryItemList = category.items[categoryId - 1];
    // const feedbacks: Feedback[] = categoryItem.feedbacks;
    // const averageMark = feedbacks.reduce((sum, feedback) => sum + (feedback.mark || 0), 0) / feedbacks.length;
    const averageMark = 4
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
                <View style={styles.cart}>
                    {/*<Image*/}
                    {/*    source={{ uri: category.items[categoryId - 1].logo ? categoryItem.logo : defaultLogo }}*/}
                    {/*    style={[styles.cartLogo, {borderColor: theme === 'purple' ? '#957ABC' : '#4D7440', borderWidth:1}]} />*/}
                    <View style={styles.cartInfo}>
                        <Text style={styles.cartTitle}>{business?.title}</Text>
                        <Text style={styles.cartSubtitle}>{business?.description}</Text>
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
                            {business?.average_rating}
                        </Text>
                        <View style={{display:'flex', flexDirection:'column',justifyContent:'space-between', height:52}}>
                            <View>{renderStars(starsCount, 20)}</View>
                            <View><Text style={{fontSize:16, color:'#C0C0C0'}}>{starsCount} оценок</Text></View>
                        </View>
                    </View>
                    <Text style={{fontSize:14, color:'#C0C0C0', marginTop:13}}>Оцените и напишите отзыв</Text>
                    <View>{renderStars(5, 42)}</View>

                </LinearGradient>
                <View style={{borderBottomWidth:1,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:20, borderBottomColor: theme === 'purple' ? '#41146D' : '#32933C'}}>
                    <Text>{feedbacks && feedbacks.length} отзыва</Text>
                    <Text>По умолчанию</Text>
                </View>
                <FlatList
                    data={feedbacks}
                    renderItem={({ item }) => (
                        <View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start', paddingVertical:20, borderBottomWidth:1, borderBottomColor: theme === 'purple' ? '#41146D' : '#32933C'}}>
                            <View style={{display:'flex', flexDirection:'row', gap:12}} >
                                <Text style={{ color: 'black' }}>
                                    {item?.created_by ? item?.created_by : 'Неизвестный'}
                                </Text>
                                <View style={{gap:16,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center', marginBottom:21}}>
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
            <UIButton text='Добавить отзыв' onPress={goToAddFeedBack}/>
        </>

    );
};

const styles = StyleSheet.create({
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
        maxWidth: '70%'
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
