import {Link, Stack, useFocusEffect} from 'expo-router';
import {
    View,
    FlatList,
    Text,
    Pressable,
    ScrollView,
    Dimensions,
    RefreshControl,
    StatusBar,
    Platform
} from "react-native";
import { StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef, useState, useMemo } from "react";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
import MainHeader from "@/src/components/MainHeader";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import {AutocompleteResponse,ILocation} from "@/src/types";
import Loader from '@/src/components/Loader';
import { useQuery } from '@tanstack/react-query';
import LocationInput from '@/src/components/LocationInput';
import * as SecureStore from 'expo-secure-store';
import TaxiIcon from '@/src/components/Icons/TaxiIcon';
import BusinessIcon from '@/src/components/Icons/BusinessIcon';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
import * as Location from 'expo-location';
import ModalComponent from '@/src/components/dialog/ModalComponent';
import BottomSheetModal from '@/src/components/dialog/BottomSheetModal';

export default function MenuScreen() {
    const { theme } = useCustomTheme();
    const [isModal, setIsModal] = useState(false);
    const { setTheme } = useCustomTheme();
    const [isChatModal, setIsChatModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [isShowLocationList, setIsShowLocationList] = useState(false)
    const [countries, setCountries] = useState<ILocation[]>([])
    const [localityType, setLocalityType] = useState('')
    const [localityId, setLocalityId] = useState('')
    const [filteredCountries, setFilteredCountries] = useState<AutocompleteResponse | null>(null)
    const [ setLocationServicesEnabled] = useState<boolean>(false);
    const [latitude, setLatitude] = useState<string>('');
    const [longTitude, setLongitude] = useState<string>('');
    const [chatHeight, setChatHeight] = useState(200)
    const [themeHeight, setThemeHeight] = useState(200)

    const bottomSheetChatRef = useRef(null);
    const bottomSheetThemeRef = useRef(null);

    const handleChatLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setChatHeight(height);
      };

      const handleThemeLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setThemeHeight(height);
      };

    const getLocationTypeAndId = async () => {
        const localLocationId = await SecureStore.getItemAsync('locality-id')
        const localLocationType = await SecureStore.getItemAsync('locality-type')
        setLocalityId(localLocationId ? localLocationId : '')
        setLocalityType(localLocationType ? localLocationType : '')
    }

    useFocusEffect(
        React.useCallback(() => {
            getLocationTypeAndId()
        }, [])
    )
    const { data: chats} = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/api/v1/social-networks/`);
            return response.json();
        }
    });
    const { data: categories, refetch: refetchCategories } = useQuery({
        queryKey:['categories',localityId,localityType],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/categories/?locality-id=${localityId}&locality-type=${localityType}`);
                return await response.json();
        },
        enabled: !!localityId && !!localityType, 
    });

    const { data: wallets, refetch: refetchWallets } = useQuery({
        queryKey:['wallets',localityId,localityType],
        queryFn:async () => {
            const response = await fetch(`${apiUrl}/api/v1/funds/?locality-id=${localityId}&locality-type=${localityType}`);
            
            return response.json();
        },
        enabled: !!localityId && !!localityType, 
    });


      const getServerLocation = async (lat: number, lon: number) => {
        try {
          const localFullName = await SecureStore.getItemAsync('locality-full-name')
          const localLocationId = await SecureStore.getItemAsync('locality-id')
          const localLocationType = await SecureStore.getItemAsync('locality-type')
          const response = await fetch(`${apiUrl}/api/v1/localities/get-locality-by-coordinates/?latlon=${lat},${lon}`);

          const data = await response.json();
          if (response.ok ) {
            if (data?.full_name !== localFullName || data?.id !== localLocationId || data?.type !== localLocationType){
              setLocalityId(data?.id)
              setLocalityType(data?.type)
              await SecureStore.setItemAsync('locality-full-name', data.full_name);
              await SecureStore.setItemAsync('locality-type', data.type);
              await SecureStore.setItemAsync('locality-id', data.id.toString());
            } else {
                console.log('Не нашли такую локацию в бд')
            }
            
          }
        } catch (err) {
          console.error('Ошибка получения локации с сервера:', err);
        }
      };
    
      const getCurrentLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Нет разрешения на локацию')
            return
          };
          const { coords } = await Location.getCurrentPositionAsync();
          if (coords) {
            const { latitude, longitude } = coords;
            const strLang = latitude.toString()
            const strLong = longitude.toString()
            setLatitude(strLang);
            setLongitude(strLong);
            getServerLocation(latitude, longitude);
            await refetchCategories()
          } else{
            console.log('Нет coords')
          }
        } catch (err) {
          setError('Ошибка получения текущей геолокации.');
          console.error(err);
        }
      };

    const pressOnCity = (location: ILocation)=> {
        SecureStore.setItemAsync('locality-type',location.type)
        SecureStore.setItemAsync('locality-id',location.id.toString())
        SecureStore.setItemAsync('locality-full-name', location.full_name);
        setIsShowLocationList(false)
        setLocalityId(location.id.toString())
        setLocalityType(location.type)
        setTimeout(()=>{
            refetchCategories()
            refetchWallets();
        },100)
    }
    
    
    useEffect(() => {
        getCurrentLocation()
        setTimeout(() => {
            setIsLoading(false);
        },2000)
       
    }, []);
    
    const handleFilteredCounties = (data:AutocompleteResponse) => {
        setFilteredCountries(data);
    };
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetchCategories();
        refetchWallets();
        setTimeout(()=>setRefreshing(false),1000)
    }, []);
    

    if (isLoading){
        return <Loader/>;
    }

    return (
        <View style={{ flex: 1,position:'relative' }}>
            
                <ModalComponent isVisible={isShowLocationList} onClose={()=> setIsShowLocationList(false)} height={400}>
                    <View style={styles.locationModalView}>
                        <View style={{}}>
                            <LocationInput data={countries} onFilteredData={handleFilteredCounties} placeholder='Найти город, район, регион'/>
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
                </ModalComponent>
                    
            

                <View style={{ flex: 1 }} >
                    <MainHeader onChatPress={() => {
                            bottomSheetThemeRef.current?.close()
                            bottomSheetChatRef.current?.expand()
                            setIsChatModal(true)
                        }}  
                        refreshData={refreshing} 
                        onDotsPress={() => {
                            bottomSheetChatRef.current?.close()
                            bottomSheetThemeRef.current?.expand()
                            setIsModal(true)
                        }} 
                        isWallet={wallets?.length > 0}
                    />
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
                    <Link href='/(user)/menu/taxi' style={[styles.tabBarItem,{paddingRight:Platform.OS === 'ios' ? 30 : 0}]} asChild>
                        <Pressable style={styles.tabBarItemContainer}>
                            <TaxiIcon/>
                            <Text style={{color:"#ccc",fontSize:12}}>такси</Text>
                        </Pressable>
                        
                    </Link>
                    <Link href='/(user)/menu/partners'  style={[styles.tabBarItem,{paddingLeft:Platform.OS === 'ios' ? 30 : 0}]} asChild>
                        <Pressable style={styles.tabBarItemContainer}>
                            <BusinessIcon/>
                            <Text style={{color:"#ccc",fontSize:11}}>партнёрам</Text>
                        </Pressable>
                    </Link>
                </View>
                <BottomSheetModal bottomSheetRef={bottomSheetThemeRef} setIsModalVisible={setIsModal} isModalVisible={isModal}  layoutHeight={themeHeight}>
                        <View style={styles.centeredView} onLayout={handleThemeLayout}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Цвет оформления</Text>
                                <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row',width:'100%'}}>
                                    <Pressable onPress={() => setTheme('green')} style={{width:'48%', aspectRatio:1}}>
                                        <LinearGradient
                                            colors={['#BAEAAC', '#E5FEDE']}
                                            start={{ x: 1, y: 0 }}
                                            end={{ x: 0, y: 0 }}
                                            style={{width:'100%', aspectRatio:1,borderRadius:10}}
                                        ></LinearGradient>
                                    </Pressable>
                                    <Pressable onPress={() => setTheme('purple')} style={{width:'48%', aspectRatio:1}}>
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
                </BottomSheetModal>
                <BottomSheetModal bottomSheetRef={bottomSheetChatRef} setIsModalVisible={setIsChatModal} isModalVisible={isChatModal} layoutHeight={chatHeight}>
                    <View style={[styles.chatModalViewContainer, {padding: 0}]} onLayout={handleChatLayout}>
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
                </BottomSheetModal>
        </View>
    );
}

const styles = StyleSheet.create({
    tabBarItemContainer:{
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
    },
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
        alignItems: 'center',
        shadowColor: '#000',
        width: '100%',
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
        flex:1
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
        width: '100%',
        
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
        height: 59,        
        backgroundColor: '#fff', 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        borderTopWidth: 1,    
        borderTopColor: '#ccc', 
        // zIndex:999
    },
    tabBarItem:{
        flex:1,
        display: 'flex',
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
    }
});

