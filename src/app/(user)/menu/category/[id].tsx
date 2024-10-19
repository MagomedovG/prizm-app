import React, {useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Pressable,
    TextInput,
    Button,
    ScrollView,
    Dimensions,
    Keyboard, 
    Platform, 
    KeyboardAvoidingView,
    Alert,
    Clipboard
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter} from "expo-router";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import HeaderLink from "@/src/components/HeaderLink";
import Modal from "react-native-modal";
import {lightColor} from "@/assets/data/colors";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {IBusinessInCategory} from '../../../../types'
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
const deviceWidth = Dimensions.get("window").width;
import QRCode from 'react-qr-code';
import { AntDesign } from '@expo/vector-icons';

const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );

export default function categoryId() {
    const { id } = useLocalSearchParams()
    const {theme} = useCustomTheme()
    const [isQrModal, setIsQrModal] = useState(false);

    const [categoryList, setCategoryList] = useState<IBusinessInCategory | null>(null)
    const [isModal, setIsModal] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [prizmWallet, setPrizmWallet] = useState('')
    
    const [prizmQrCode, setPrizmQrCode] = useState('') 
    const inputRef = useRef(null);
    const copyToClipboard = () => {
        if (prizmWallet && typeof prizmWallet === "string" ) {
            Clipboard.setString(prizmWallet);
        }
        Alert.alert('Кошелек скопирован!', prizmWallet)
    };
    useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
        setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
    });

    

    return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
    };
    }, []);

    const handleWalletPress = (value: boolean) => {
        setIsModal(value);
    };
    const hideModal = () => {
        setIsModal(false);
    };
    const openQrModal = () => {
        setIsModal(false); // Закрываем первую модалку
        setTimeout(() => setIsQrModal(true), 350); // Открываем QR модалку с задержкой
        
    };
    
    const closeQrModal = () => {
        setIsQrModal(false); // Закрываем QR модалку
    };
    
    
    
    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/categories/${id}/get-businesses`,
                );
                const data = await response.json();
                setCategoryList(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/categories/`);
            }
        }
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
        getData();
    }, []);




    const [filteredData, setFilteredData] = useState<IBusinessInCategory | null>(null);
    const handleFilteredData = (data:any) => {
        setFilteredData(data);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { marginBottom: keyboardHeight ? keyboardHeight  : 0}]}
        >
            <Stack.Screen options={{
                headerShown:false,
                header: () => <HeaderLink title="Главная" link="/(user)/menu"/>,
            }}/>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <SearchInput data={categoryList?.businesses} onFilteredData={handleFilteredData} placeholder="Поиск" isCategoryItem/>
                <CategoryItemList categoryList={filteredData} title={categoryList?.category?.title} isBonus={true} onWalletPress={handleWalletPress} />
            </ScrollView>
            
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                onSwipeComplete={hideModal}
                onBackdropPress={hideModal}
                animationInTiming={300}
                animationOut='slideOutDown'
                animationOutTiming={200}
                backdropColor='black'
                hardwareAccelerated
                backdropTransitionOutTiming={0}
                swipeDirection={'down'}
                style={styles.modal}

            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{display:'flex', justifyContent:'space-between', flexDirection:'column',marginTop:17}}>
                            <Text style={styles.subTitle}>Как получить кэшбэк?</Text>
                            <View>
                                <Pressable onPress={openQrModal} style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                                    <Text style={styles.text}>
                                        При оплате покажите
                                        <Text style={{color:theme === 'purple' ? '#6F1AEC' : '#375A2C',textDecorationLine:'underline'}}> qr-код продавцу</Text>
                                    </Text>
                                </Pressable>
                                <View style={{width: 1,
                                    height: 17,
                                    backgroundColor: 'black',
                                    alignSelf: 'flex-start',
                                    marginVertical: 5,
                                    marginLeft:19
                                }}></View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>2</Text></View>
                                    <Text style={styles.text}>Кэшбэк начислится мгновенно</Text>
                                </View>
                            </View>


                        </View>
                        <View style={{display:'flex', justifyContent:'space-between', flexDirection:'column',marginBottom:20, marginTop:32}}>
                            <Text style={styles.subTitle}>Как вывести кэшбек?</Text>
                            <View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                                    <Text style={styles.text}>Перейдите в приложение обменника</Text>
                                </View>
                                <View style={{width: 1,
                                    height: 17,
                                    backgroundColor: 'black',
                                    alignSelf: 'flex-start',
                                    marginVertical: 5,
                                    marginLeft:19
                                }}></View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>2</Text></View>
                                    <Text style={styles.text}>Обменяйте PRIZM на рубли в обменнике</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.qrModal}
            >
                <View style={styles.centeredQrView}>
                    <View style={styles.qrModalView}>
                        <View style={styles.image}>
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
            </Modal>
        </KeyboardAvoidingView>


    );
};
const styles = StyleSheet.create({
    modalText:{},
    pressable: {
        position: 'relative',
        width:deviceWidth / 1.8 + 34
    },
    image: {
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
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop:16,
        paddingBottom:26,
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
    centeredView: {
        justifyContent: 'flex-end',
    },
    container: {
        display:'flex',
        flexDirection:'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        paddingTop: 36,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
        zIndex: 2
    },
    qrModal:{
        margin: 0,
        justifyContent: 'center',
        alignItems:'center',
        zIndex:3
    },
    purpleCircleText:{
        color:'white',
    },
    greenCircleText:{
        color:'black',
    },
    circle:{
        borderRadius:50,
        backgroundColor: lightColor,
        width:38,
        height:38,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize:16,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    subTitle:{
        marginBottom:16,
        color:'#323232',
        fontSize:20,
        fontWeight:'bold'
    },
    greenText:{
        color:'#070907'
    },
    purpleText:{
        color:'white'
    },
    purpleCircle:{
        backgroundColor:'#5C2389',
    },
    greenCircle:{
        backgroundColor:'#CDF3C2',
    },
})
