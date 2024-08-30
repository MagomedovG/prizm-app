import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    Dimensions,
    StyleSheet, Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import HeaderLink from "@/src/components/HeaderLink";
import UIButton from "@/src/components/UIButton";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {useLocalSearchParams, useRouter} from "expo-router";
import {categories, defaultLogo} from "@/assets/data/categories";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import Entypo from '@expo/vector-icons/Entypo';

export default function AddFeedback() {
    const [text, setText] = useState('');
    const [activeStars, setActiveStars] = useState(2);
    const [business, setBusiness] = useState(null);
    const { id } = useLocalSearchParams();

    const router = useRouter()

    const { theme } = useCustomTheme();
    // const category = categories.find(c => c.id.toString() === '1');
    // const categoryItem = category.items[0]; // Update index based on your logic

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(`${apiUrl}/api/v1/business/${id}/`);
                const data = await response.json();
                setBusiness(data);
                console.log(data);
                
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        }

        getData();
    }, []);
    const postComment = async () => {
        const userId = await asyncStorage.getItem('user_id');
        const parsedUserId = JSON.parse(userId);
        console.log(userId,parsedUserId,id,text);
        try {
            const response = await fetch(`${apiUrl}/api/v1/feedbacks/`,{
                method:'POST',
                headers:{
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({created_by:parsedUserId, business:id, text})
            })
            const data = await response.json()
            if (response.ok){
                router.back()
            } else {
                Alert.alert('Ошибка!','Вы не можете добавить два отзыва в один бизнес');
            }


        } catch (e){
            console.warn(e)
        }
    }
    const postRating = async (rating: number) => {
        setActiveStars(rating)
        const userId = await asyncStorage.getItem('user_id');
        const parsedUserId = JSON.parse(userId);
        console.log('userId',userId,'parsedUserId',parsedUserId,'id',id,'text',text, 'rating',rating);
        try {
            const response = await fetch(`${apiUrl}/api/v1/ratings/update-or-create/`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({created_by:parsedUserId, business:id, rating_value:rating})
            })
            const data = await response.json()
            if (response.ok){
                console.log('ok');
            } else {
                console.log(data);
            }

        } catch (e){
            console.log(e)
        }
    }

    const renderStars = (activeStars, markSize, color = 'white', inactiveColor = 'white') => {
        return (
            <View style={styles.starContainer}>
                {[...Array(5)].map((_, index) => (
                    <Entypo
                        key={`star-${index}`}
                        name={index < activeStars ? 'star' : 'star-outlined'}
                        size={markSize}
                        color={index < activeStars ? color : inactiveColor}
                        onPress={() => postRating(index + 1)}
                    />
                ))}
            </View>
        );
    };

    return (
        <>
            <ScrollView style={{}}>
                <ScrollView style={styles.container}>
                    {/* <HeaderLink title="Супермаркеты" link={`/(user)/menu/category/${business?.id}`} emptyBackGround={false} /> */}

                    <View>
                        <View style={{ maxHeight: 140 }}>
                            <Image
                                style={{ width: ITEM_WIDTH - 30, height:ITEM_WIDTH - 80, borderRadius: 15 }}
                                source={{ uri:business?.logo ? `${apiUrl}${business.logo}` : defaultLogo}}
                            />
                        </View>
                        <LinearGradient
                            colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.cart}
                        >
                            <View style={styles.cartInfo}>
                                <View>
                                    <Text style={[styles.cartTitle, theme === 'purple' ? styles.purpleText : styles.greenText]}>
                                        {business?.title}
                                    </Text>
                                    <Text style={[styles.cartSubtitle, theme === 'purple' ? { color: '#CACACA' } : styles.greenText]}>
                                        {business?.description}
                                    </Text>
                                </View>
                                <Text style={[{ fontSize: 16, marginTop: 14, marginBottom: 23 }, theme === 'purple' ? styles.purpleText : styles.greenText]}>
                                    {business?.adress}
                                </Text>
                                <View style={styles.cartSaleContainer}>
                                    {renderStars(activeStars, 42)}
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
            <UIButton text={'Ок'} onPress={postComment}/>
        </>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 150,
    },
    textArea: {
        height: 178,
        padding: 13,
        backgroundColor: '#f0f0f0',
        borderColor: '#828282',
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'top',
        fontSize: 18,
        marginBottom: 160
    },
    greenText: {
        color: '#070907'
    },
    purpleText: {
        color: 'white'
    },
    cartSaleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    cartInfo: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',
        paddingBottom: 3
    },
    cartSubtitle: {
        color: '#CACACA',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight: '600',
        marginBottom: 3
    },
    cart: {
        backgroundColor: '#535353',
        paddingHorizontal: 32,
        paddingVertical: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 15,
        marginTop: 30,
        marginBottom: 50,
        alignSelf: 'center',
    },
    subTitle: {
        marginTop: 30,
        marginBottom: 5,
        color: '#323232',
        fontSize: 22,
    },
    starContainer: {
        flexDirection: 'row',
        marginTop: 5
    }
});
