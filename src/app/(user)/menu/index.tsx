import {Link, Stack} from 'expo-router';
import {
    View,
    FlatList,
    Text,
    Pressable,
    ScrollView,
    Dimensions,
    Platform, RefreshControl,
    StatusBar
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
import MainHeader from "@/src/components/MainHeader";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import {IWallet} from "@/src/types";
import Loader from '@/src/components/Loader';
import { useQuery } from '@tanstack/react-query';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
type IChats = {
    whatsapp:string,
    youtube:string,
    telegram:string,
}
export default function MenuScreen() {
    const { theme } = useCustomTheme();
    const [isModal, setIsModal] = useState(false);
    const { changeTheme } = useAsyncTheme();
    const [isChatModal, setIsChatModal] = useState(false);
    // const [categories, setCategories] = useState(null)
    // const [wallets, setWallets] = useState<IWallet[]>([])
    // const [chats, setChats] = useState<IChats | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // async function getChats() {
    //     try{
    //         const response = await fetch(`${apiUrl}/api/v1/social-networks/`)
    //         const data = await response.json();
    //         setChats(data)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    // useEffect(() => {
    //     getChats()
    // }, []);

    const { data: chats, isLoading: isChatsLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/api/v1/social-networks/`);
            console.log('social-networks')
            return response.json();
        }
    });
    const { data: categories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
        queryKey:['categories'],
        queryFn:async () => {
            const response = await fetch(`${apiUrl}/api/v1/categories/`);
            console.log('categories')
            setRefreshing(false)
            return response.json();
        }
    });

    const { data: wallets, isLoading: isWalletsLoading, refetch: refetchWallets } = useQuery({
        queryKey:['wallets'],
        queryFn:async () => {
            const response = await fetch(`${apiUrl}/api/v1/funds/`);
            console.log('funds')
            return response.json();
        }
    });
    
    // const getData = async () => {
    //     try {
    //         const response = await fetch(
    //             `${apiUrl}/api/v1/categories/`,
    //         );
    //         const data = await response.json();
    //         setCategories(data);
            
    //         setRefreshing(false)

    //     } catch (error) {
    //         console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/categories/`);
    //     }
    // }

    

    //   const getFunds = async () => {
    //     try {
    //         const response = await fetch(
    //             `${apiUrl}/api/v1/funds/`,
    //         );
    //         const data = await response.json();
    //         setWallets(data);
    //     } catch (error) {
    //         console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/funds/`);
    //     }
    // }
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        },2000)
    }, []);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetchCategories();
        refetchWallets();
    }, []);

    
    const toggleChatModal = () => {
        setIsChatModal(!isChatModal)
    }

    // if (isLoading){
    //     return <Loader />;
    // }


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
                onSwipeComplete={() => setIsModal(false)}
                onBackdropPress={() => setIsModal(false)}
                onBackButtonPress={() => setIsModal(false)}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={500}
                backdropColor='black'
                hardwareAccelerated
                backdropTransitionOutTiming={0}
                swipeDirection={'down'}
                style={styles.modal}
                statusBarTranslucent

            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Цвет оформления</Text>
                        <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row',width:'100%'}}>
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
                    </View>
                </View>
                <Pressable style={styles.closeButton} onPress={()=>setIsModal(false)}>
                        <AntDesign name="close" size={30} color="white" />
                    </Pressable>
            </Modal>
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isChatModal}
                onSwipeComplete={()=>setIsChatModal(false)}
                onBackdropPress={()=>setIsChatModal(false)}
                onBackButtonPress={()=>setIsChatModal(false)}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={500}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.modal}
                backdropTransitionOutTiming={0}
                statusBarTranslucent
            >
                <View style={styles.centeredView}>
                    <View style={[styles.chatModalViewContainer, {padding: 0}]}>
                        <Link href={chats ? chats?.youtube : '/(user)/menu/'} style={[styles.chatModalView, {paddingTop:20}]} asChild>
                            <Pressable>
                                    <View style={styles.iconAndTextContainer}>
                                        <AntDesign name="youtube" size={23} color="rgb(234,57,42)" />
                                        <Text style={{fontSize: 16, fontWeight: 'semibold', marginLeft: 15, color:'rgb(234,57,42)'}}>YouTube</Text>
                                    </View>
                            </Pressable>
                        </Link>
                        <Link href={chats ? chats?.whatsapp : '/(user)/menu/'} style={styles.chatModalView} asChild >
                            <Pressable>
                                    <View style={styles.iconAndTextContainer}>
                                        <FontAwesome5 name="whatsapp" size={23} color="rgb(101,208,114)" />
                                        <Text style={{fontSize: 16, fontWeight: 'semibold', marginLeft: 15, color:'rgb(101,208,114)'}}>WhatsApp</Text>
                                    </View>
                            </Pressable>
                        </Link>
                        <Link href={chats ? chats?.telegram : '/(user)/menu/'} asChild style={[styles.chatModalView, {borderBottomWidth: 0, paddingBottom: 29}]}>
                            <Pressable >
                                    <View style={styles.iconAndTextContainer}>
                                        <FontAwesome5 name="telegram-plane" size={23} color="rgb(78,142,229)" />
                                        <Text style={{fontSize: 16, fontWeight: 'semibold', marginLeft: 15,color:'rgb(78,142,229)'}}>Telegram</Text>
                                    </View>
                            </Pressable>
                        </Link>
                    </View>
                    </View>
                    <Pressable style={styles.closeButton} onPress={()=>setIsChatModal(false)}>
                        <AntDesign name="close" size={30} color="white" />
                    </Pressable>
            </Modal>

            <View style={{ flex: 1 }} >
                <MainHeader onChatPress={() => setIsChatModal(true)}  refreshData={refreshing} onDotsPress={() => setIsModal(true)}/>
                <View>
                    <LinearGradient
                        colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.walletContainer}
                    >
                        
                        <FlatList
                            data={wallets}
                            renderItem={({ item }) => <WalletItem wallet={item} />}
                            contentContainerStyle={{ gap: 8 }}
                            style={styles.flatlist}
                            keyExtractor={(item) => item.title}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </LinearGradient>

                    <ScrollView
                        style={styles.container}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        <CategoryList categories={categories} title="Категории" isInput={true} />
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 111,
    },
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
        justifyContent: 'flex-end',
    },
    chatModalView:{
        display:'flex',
        flexDirection:"row",
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal: 20,
        paddingVertical:17,
        borderBottomColor:'#D7D7D7',
        borderBottomWidth:1,
        width:'100%'
    },
    chatModalViewContainer:{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    iconAndTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop:16,
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
    container: {
        backgroundColor: 'white',
        marginHorizontal: 6,
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
        paddingLeft: 16,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
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
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
        position:'relative'
    },
});
