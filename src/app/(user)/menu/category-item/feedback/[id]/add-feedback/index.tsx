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
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import UIButton from "@/src/components/UIButton";
import * as SecureStore from 'expo-secure-store';
import {useLocalSearchParams, useRouter} from "expo-router";
import { defaultLogo} from "@/assets/data/categories";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {IBusiness} from '../../../../../../../types'
import PostRating from "@/src/components/PostRating";

export default function AddFeedback() {
    const [text, setText] = useState('');
    const [business, setBusiness] = useState<IBusiness | null>(null);
    const [isMineRating, setIsMineRating] = useState()

    const { id } = useLocalSearchParams();

    const router = useRouter()

    const { theme } = useCustomTheme();
    async function getData() {
        try {
            const response = await fetch(`${apiUrl}/api/v1/business/${id}/`);
            const data = await response.json();
            setBusiness(data?.business);
            getMyFeedback()
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const postComment = async () => {
        const userId = await SecureStore.getItemAsync('user_id');
        const parsedUserId = userId ? JSON.parse(userId) : null
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
                Alert.alert(data.non_field_errors[0]);
            }
        } catch (e){
            console.warn(e)
        }
    }
    async function getMyFeedback() {
        try {
            const userId = await SecureStore.getItemAsync('user_id');
            const response = await fetch(
                `${apiUrl}/api/v1/ratings/?created_by=${userId}&business=${id}`,
            );
            const data = await response.json();
            if (response.ok){
                setIsMineRating(data[0]?.rating_value)
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных фидбэков:", error);
        }
    }    
    return (
        <>
            <ScrollView style={{}}>
                <ScrollView style={styles.container}>
                    <View>
                        <View style={{ maxHeight: 140 }}>
                            <Image
                                style={{ width: ITEM_WIDTH - 30, height:ITEM_WIDTH - 172 - 53, borderTopLeftRadius: 15,borderTopRightRadius: 15,objectFit: 'cover' }}
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
                                        {business?.short_description}
                                    </Text>
                                </View>
                                <Text style={[{ fontSize: 16, marginTop: 14, marginBottom: 23 }, theme === 'purple' ? styles.purpleText : styles.greenText]}>
                                    {business?.address}
                                </Text>
                                <View style={styles.cartSaleContainer}>
                                    <PostRating id={id} markSize={42} refreshBusiness={getData} initialStars={isMineRating ? isMineRating : 0}/>
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
        borderRadius: 15,
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
