import { Link, Stack } from 'expo-router';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    Pressable,
    ScrollView,
    Alert,
    Dimensions,
    Platform
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import wallets from "@/assets/data/wallet";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
// import { categories } from "@/assets/data/categories";
import MainHeader from "@/src/components/MainHeader";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import CookieManager, { Cookies } from '@react-native-cookies/cookies';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );

export default function MenuScreen() {
    const { theme } = useCustomTheme();
    const [isModal, setIsModal] = useState(false);
    const { asyncTheme, changeTheme } = useAsyncTheme();
    const [isChatModal, setIsChatModal] = useState(false);
    const [categories, setCategories] = useState(null)

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
                        `${apiUrl}/api/v1/categories`,
                    // {
                        // credentials: "include",
                        // headers: {
                        //     "X-CSRFToken": `${csrfToken}`,
                        // },
                    // }
                );
                const data = await response.json();
                console.log(data);
                setCategories(data);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/categories/`);
                // console.log(response);
            }
        }

        getData();
    }, []);

    const handleWalletPress = (value: boolean) => {
        setIsModal(value);
    };
    const handleChatPress = (value: boolean) => {
        setIsChatModal(value);
    };

    const hideModal = () => {
        setIsModal(false);
    };
    const hideChatModal = () => {
        setIsChatModal(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                onSwipeComplete={hideModal}
                onBackdropPress={hideModal}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={500}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.modal}

            >
                <Pressable style={styles.centeredView} onPress={hideModal}>
                    <Pressable style={styles.modalView} onPress={() => {}}>
                        <Text style={styles.modalText}>Цвет оформления</Text>
                        <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
                            <Pressable onPress={() => changeTheme('green')} style={{width:'48%', aspectRatio:1}}>
                                <LinearGradient
                                    colors={['#BAEAAC', '#E5FEDE']}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 0 }}
                                    style={{width:'100%', aspectRatio:1,borderRadius:10}}
                                ></LinearGradient>
                            </Pressable>
                            <Pressable onPress={() => changeTheme('purple')} style={{width:'48%', aspectRatio:1}}>
                                <LinearGradient
                                    colors={['#130347', '#852DA5']}
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 0 }}
                                    style={{borderRadius:10,width:'100%', aspectRatio:1}}
                                ></LinearGradient>
                            </Pressable>


                        </View>


                        {/*<Text style={styles.modalText}>Hello World!</Text>*/}
                        {/*<Pressable*/}
                        {/*    style={[styles.button, styles.buttonClose]}*/}
                        {/*    onPress={hideModal}>*/}
                        {/*    <Text style={styles.textStyle}>Hide Modal</Text>*/}
                        {/*</Pressable>*/}
                    </Pressable>
                </Pressable>
            </Modal>
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isChatModal}
                onSwipeComplete={hideChatModal}
                onBackdropPress={hideChatModal}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={500}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.modal}

            >
                <Pressable style={styles.centeredView} onPress={hideChatModal}>
                    <Pressable style={[styles.modalView, {padding:0}]} onPress={() => {}}>
                        <View style={styles.chatModalView}>
                            <AntDesign name="youtube" size={23} color="black" />
                            <Text>YouTube</Text>
                        </View>
                        <View  style={styles.chatModalView}>
                            <FontAwesome5 name="whatsapp" size={23} color="black" />
                            <Text>WhatsApp</Text>
                        </View>
                        <View style={[styles.chatModalView,{borderBottomWidth: 0}]}>
                            <FontAwesome5 name="telegram-plane" size={23} color="black" />
                            <Text>Telegram</Text>
                        </View>

                    </Pressable>
                </Pressable>
            </Modal>

            <View style={{ flex: 1 }} >
                {isModal && <View style={styles.overlay} />}
                <MainHeader onChatPress={handleChatPress} />
                <View>
                    <LinearGradient
                        colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.walletContainer}
                    >
                        <View style={{display:'flex', width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center',marginBottom: 15}}>
                            <Text style={[styles.walletTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>Кошельки</Text>
                            <Pressable
                                onPress={handleWalletPress}
                                       // style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center',}}
                            >
                                <View><Entypo name="dots-three-horizontal" size={22} color={theme === 'purple' ? 'white' : 'black'} /></View>
                            </Pressable>
                        </View>
                        <FlatList
                            data={wallets}
                            renderItem={({ item }) => <WalletItem wallet={item} />}
                            contentContainerStyle={{ gap: 8 }}
                            style={styles.flatlist}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </LinearGradient>

                    <ScrollView style={styles.container}>
                        <CategoryList categories={categories} title="Кэшбек у партнеров" isInput={true} />
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize:22
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    chatModalView:{
        display:'flex',
        flexDirection:"row",
        justifyContent:'center',
        alignItems:'center',
        gap:15,
        paddingVertical:17,
        borderBottomColor:'#D7D7D7',
        borderBottomWidth:1
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop:16,
        paddingBottom:26,
        // alignItems: 'center',
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
    container: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    price: {
        color: Colors.light.tint,
    },
    walletContainer: {
        backgroundColor: '#D9D9D9',
        paddingHorizontal: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    walletTitle: {
        fontSize: 20,
        color: '#323232',
        fontWeight: '600',

    },
    flatlist: {},
    whiteText: {
        color: 'white',
    },
    blackText: {
        color: 'black',
    },
    overlay: {
        // ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
});
