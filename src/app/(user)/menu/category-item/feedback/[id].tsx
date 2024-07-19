import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    FlatList
} from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/src/providers/CartProvider";
import { categories, defaultLogo } from "@/assets/data/categories";
import HeaderLink from "@/src/components/HeaderLink";
import { AntDesign } from '@expo/vector-icons';
import { ICategory, ICategoryItemList } from "@/src/types";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

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
    const categoryId = Number(id);
    const category: ICategory | undefined = categories.find(c => c.id.toString() === '1');

    if (!category) {
        return <Text>Wallet Not Found</Text>;
    }

    const categoryItem: ICategoryItemList = category.items[categoryId - 1];
    const feedbacks: Feedback[] = categoryItem.feedbacks;
    const averageMark = feedbacks.reduce((sum, feedback) => sum + (feedback.mark || 0), 0) / feedbacks.length;

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
        <ScrollView style={styles.cartContainer}>
            <Stack.Screen options={{
                headerShown: false,
                header: () => <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />,
            }} />
            <View style={styles.cart}>
                <Image
                    source={{ uri: category.items[categoryId - 1].logo ? categoryItem.logo : defaultLogo }}
                    style={[styles.cartLogo, {borderColor: theme === 'purple' ? '#957ABC' : '#4D7440', borderWidth:1}]} />
                <View style={styles.cartInfo}>
                    <Text style={styles.cartTitle}>{categoryItem.name}</Text>
                    <Text style={styles.cartSubtitle}>{categoryItem.subtitle}</Text>
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
                    <Text style={styles.averageMarkText}>{averageMark.toFixed(1)}</Text>
                    <View style={{display:'flex', flexDirection:'column',justifyContent:'space-between', height:52}}>
                        <View>{renderStars(averageMark, 20)}</View>
                        <View><Text style={{fontSize:16, color:'#C0C0C0'}}>{feedbacks && feedbacks.length} оценок</Text></View>
                    </View>
                </View>
                <Text style={{fontSize:14, color:'#C0C0C0', marginTop:13}}>Оцените и напишите отзыв</Text>
                <View>{renderStars(5, 42)}</View>



            </LinearGradient>
            <View style={{borderBottomWidth:1,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:20, borderBottomColor: theme === 'purple' ? '#41146D' : '#32933C'}}>
                <Text>54 отзыва</Text>
                <Text>По умолчанию</Text>
            </View>
            <FlatList
                data={feedbacks}
                renderItem={({ item }) => (
                    <View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start', paddingVertical:20, borderBottomWidth:1, borderBottomColor: theme === 'purple' ? '#41146D' : '#32933C'}}>
                        <Text style={{ color: 'black' }}>
                            {item.author_name}
                        </Text>
                        <View style={{gap:16,display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center', marginBottom:21}}>
                            <View>{item.mark && renderStars(item.mark, 22, theme === 'purple' ? '#41146D' : '#32933C') }</View>
                            <Text style={{fontSize:14}}>{item.date}</Text>
                        </View>
                        <Text style={{ color: 'black' }}>
                            {item.text}
                        </Text>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
            />


        </ScrollView>
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
