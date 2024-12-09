import {Link, Stack, useFocusEffect} from 'expo-router';
import {
    View,
    FlatList,
    Text,
    Pressable,
    ScrollView,
    Dimensions,
    RefreshControl,
    StatusBar
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-native-modal";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
import MainHeader from "@/src/components/MainHeader";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import {AutocompleteResponse,ILocation} from "@/src/types";
import Loader from '@/src/components/Loader';
import { useQuery } from '@tanstack/react-query';
import LocationInput from '@/src/components/LocationInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaxiIcon from '@/src/components/Icons/TaxiIcon';
import BusinessIcon from '@/src/components/Icons/BusinessIcon';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight

export default function MenuScreen() {
    const { theme } = useCustomTheme();
    const [isModal, setIsModal] = useState(false);
    const { changeTheme } = useAsyncTheme();
    const [isChatModal, setIsChatModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [isShowLocationList, setIsShowLocationList] = useState(false)
    const [countries, setCountries] = useState<ILocation[]>([])
    const [localityType, setLocalityType] = useState('')
    const [localityId, setLocalityId] = useState('')
    const [filteredCountries, setFilteredCountries] = useState<AutocompleteResponse | null>(null)
    const getLocationTypeAndId = async () => {
        const localLocationId = await AsyncStorage.getItem('locality-id')
        const localLocationType = await AsyncStorage.getItem('locality-type')
        setLocalityId(localLocationId ? localLocationId : '')
        setLocalityType(localLocationType ? localLocationType : '')
        console.log(localLocationId, localLocationType, 'local')
    }

    useFocusEffect(
        React.useCallback(() => {
            getLocationTypeAndId()
        }, [])
    )
    const { data: chats, isLoading: isChatsLoading } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/api/v1/social-networks/`);
            return response.json();
        }
    });
    const { data: categories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
        queryKey:['categories',localityId,localityType],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/categories/?locality-id=${localityId}&locality-type=${localityType}`);
                console.log('refreshCategories',`${apiUrl}/api/v1/categories/?locality-id=${localityId}&locality-type=${localityType}`)
                return await response.json();
        },
        enabled: !!localityId && !!localityType, 
    });

    const { data: wallets, isLoading: isWalletsLoading, refetch: refetchWallets } = useQuery({
        queryKey:['wallets',localityId,localityType],
        queryFn:async () => {
            const response = await fetch(`${apiUrl}/api/v1/funds/?locality-id=${localityId}&locality-type=${localityType}`);
            console.log('fund',`${apiUrl}/api/v1/funds/?locality-id=${localityId}&locality-type=${localityType}`)
            
            return response.json();
        },
        enabled: !!localityId && !!localityType, 
    });

    const pressOnCity = (location: ILocation)=> {
        AsyncStorage.setItem('locality-type',location.type)
        AsyncStorage.setItem('locality-id',location.id.toString())
        AsyncStorage.setItem('locality-full-name', location.full_name);
        setIsShowLocationList(false)
        setLocalityId(location.id.toString())
        setLocalityType(location.type)
        setTimeout(()=>{
            refetchCategories()
            refetchWallets();
            console.log(`${apiUrl}/api/v1/funds/?locality-id=${localityId}&locality-type=${localityType}`)
        },100)
        
        
    }
    
    
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        },2000)
    }, []);
    
    const handleFilteredCounties = (data:AutocompleteResponse) => {
        setFilteredCountries(data);
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetchCategories();
        refetchWallets();
        setTimeout(()=>setRefreshing(false),1000)
    }, []);
    
    const toggleChatModal = () => {
        setIsChatModal(!isChatModal)
    }

    if (isLoading){
        return <Loader/>;
    }

    return (
        <View style={{ flex: 1,position:'relative' }}>
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
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                onBackButtonPress={()=>setIsShowLocationList(false)} 
                animationIn={'slideInUp'}
                isVisible={isShowLocationList}
                onSwipeComplete={()=>setIsShowLocationList(false)}
                onBackdropPress={()=>setIsShowLocationList(false)}
                animationInTiming={300}
                animationOut='slideOutDown'
                animationOutTiming={300}
                backdropTransitionOutTiming={0}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.locationModal}
                statusBarTranslucent
            >
                <View style={{width:'80%',height:'50%'}}>
                    <View style={styles.locationModalView}>
                        <View style={{}}>
                            <LocationInput data={countries} onFilteredData={handleFilteredCounties} placeholder='Найти место'/>
                            <FlatList
                                style={{marginLeft:13, marginTop:5}}
                                data={filteredCountries}
                                renderItem={({item})=> (
                                    <>
                                        <Pressable onPress={()=>pressOnCity(item)}>
                                            <Text style={[localityType === item.type && localityId === item.id.toString() ? {color:theme === 'purple' ? '#772899' : '#6A975E'} : {},{fontSize:18}]}>{item.full_name}</Text>
                                        </Pressable>
                                        
                                    </>
                                    
                                )}
                                keyExtractor={(item)=> item.id + item.type}
                                contentContainerStyle={{ gap: 8 }}
                            />
                        </View>
                    </View>
                </View>
                <Pressable style={styles.closeButton} onPress={()=>setIsShowLocationList(false)}>
                        <AntDesign name="close" size={30} color="white" />
                </Pressable>
            </Modal>

            <View style={{ flex: 1 }} >
                <MainHeader onChatPress={() => setIsChatModal(true)}  refreshData={refreshing} onDotsPress={() => setIsModal(true)} isWallet={wallets?.length > 0}/>
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
                        <CategoryList categories={categories} title="Категории" isInput={true} showModal={()=>setIsShowLocationList(true)} />
                    </ScrollView>
                    
                </View>
            </View>
                    
        <View style={styles.tabBar}>
            <Link href='/(user)/menu/taxi' style={styles.tabBarItem} asChild>
                <Pressable>
                    <TaxiIcon/>
                </Pressable>
                
            </Link>
            <Link href='/(user)/menu/partners'  style={styles.tabBarItem} asChild>
                <Pressable>
                    <BusinessIcon/>
                </Pressable>
            </Link>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fixedTextContainer: {
        position: "absolute",
        bottom: 23,
        right: 11,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        zIndex: 100,
    },
    fixedText: {
        color: "#828282",
        fontSize: 14,
    },
    locationModal:{
        margin: 0,
        justifyContent: 'center',
        alignItems:'center',
        zIndex:3,
        position:'relative'
    },
    locationModalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingTop:23,
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
        // flex:1
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
    tabBar: {
        position: 'absolute', 
        bottom: 0,          
        left: 0,      
        right: 0,
        height: 55,        
        backgroundColor: '#fff', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        borderTopWidth: 1,    
        borderTopColor: '#ccc', 
        zIndex:999
    },
    tabBarItem:{
        flex:1,
        display: 'flex',
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
    }
});
