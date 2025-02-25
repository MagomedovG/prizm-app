import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Pressable,
    TextInput,
    Dimensions,
    Keyboard, 
    Platform, 
    KeyboardAvoidingView,
    Alert,
    Clipboard,
    StatusBar,
    ScrollView
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Link, useLocalSearchParams} from "expo-router";
import CategoryItemList from "@/src/components/CategoryItemComponents/CategoryItemList";
import {lightColor} from "@/assets/data/colors";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
const deviceWidth = Dimensions.get("window").width;
import QRCode from 'react-qr-code';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import ModalComponent from '@/src/components/dialog/ModalComponent';
import BottomSheetModal from '@/src/components/dialog/BottomSheetModal';
// const statusBarHeight = StatusBar.currentHeight

const deviceHeight = Dimensions.get('window').height;

export default function categoryId() {
    const { id } = useLocalSearchParams()
    const {theme} = useCustomTheme()
    const [isQrModal, setIsQrModal] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [prizmWallet, setPrizmWallet] = useState('')
    const [prizmQrCode, setPrizmQrCode] = useState('') 
    const [sheetHeight, setSheetHeight] = useState(200)

    const inputRef = useRef(null);
    const bottomSheetRef = useRef(null);
    // const snapPoints = useMemo(() => ['10%'], []);
    const handleThemeLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setSheetHeight(height);
      };

    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
        hideModal();
    }, [isModal]);
    
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
        handleClosePress()
        setTimeout(() => setIsQrModal(true), 100); 
    };
    
    const closeQrModal = () => {
        setIsQrModal(false); 
    };
    
    
   
    useEffect(() => {
        const getWallet = async () => {
            try {
                const url = await SecureStore.getItemAsync('prizm_wallet');
                const qr = await SecureStore.getItemAsync('prizm_qr_code_url');
                setPrizmWallet(url || '');
                setPrizmQrCode(qr || '');
            } catch (error) {
                console.error('Ошибка при получении данных из AsyncStorage:', error);
            }
        };
        getWallet()
    }, []);

    return (
        <>
            <KeyboardAvoidingView
                style={[styles.container,  Platform.OS === 'ios' && {marginBottom: keyboardHeight ? keyboardHeight  : 0}]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
            >

                <View style={{ flex:1,paddingHorizontal: 10, }}>
                    <CategoryItemList id={id} onWalletPress={(value)=>{
                        bottomSheetRef.current?.expand()
                        handleWalletPress(value)
                        }} />
                </View>
                <BottomSheetModal bottomSheetRef={bottomSheetRef} setIsModalVisible={setIsModal} isModalVisible={isModal} layoutHeight={sheetHeight}>
                    <View style={styles.modalView} onLayout={handleThemeLayout}>
                                <View style={{display:'flex', justifyContent:'space-between', flexDirection:'column',width:'100%'}}>
                                    <Text style={styles.subTitle}>Как получить vozvrat pzm?</Text>
                                        <Pressable onPress={openQrModal} style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                                            <Text style={styles.text}>
                                                При оплате <Text style={{color:theme === 'purple' ? '#6F1AEC' : '#375A2C',textDecorationLine:'underline'}}>покажите qr-код</Text> продавцу
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
                                            <Text style={styles.text}>Продавец начислит vozvrat pzm 
                                            на ваш кошелек</Text>
                                        </View>
                                    </View>


                                <View style={{display:'flex', justifyContent:'space-between', flexDirection:'column',marginBottom:20, marginTop:32}}>
                                    <Text style={styles.subTitle}>Как обменять vozvrat pzm на рубли?</Text>
                                    <View>
                                        <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                            <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                                            <View style={{display:'flex', flexDirection:'row'}}>
                                                <Text style={[styles.text]}>Перейдите в раздел </Text>
                                                <Link href={'/(user)/menu/pitopi'}>
                                                    <Text style={[styles.text,{textDecorationLine:'underline',color:theme === 'purple' ? '#6F1AEC' : '#375A2C',}]}>обменник</Text>
                                                </Link>
                                            </View>
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
                                            <Text style={[styles.text]}>Обменяйте vozvrat pzm на рубли в обменнике</Text>
                                        </View>
                                    </View>
                                </View>
                    </View>
                </BottomSheetModal>
            </KeyboardAvoidingView>
            <ModalComponent isVisible={isQrModal} onClose={closeQrModal} height={deviceWidth - 30}>
                <View style={{alignItems:'center',width:'100%', gap:20}}>
                    <QRCode size={deviceWidth / 1.7} value={prizmQrCode} level={'M'} />
                    <Pressable onPress={copyToClipboard} style={[styles.pressable, {width:deviceWidth / 1.7}]}>
                        <TextInput
                            ref={inputRef}
                            style={styles.input}
                            editable={false}
                            value={prizmWallet}
                        />
                        <View style={styles.copyButtonContainer}>
                            <FontAwesome5 name="copy" size={15} color="gray" />
                        </View>
                    </Pressable>
                </View>
            </ModalComponent>
        </>
        
    );
};
const styles = StyleSheet.create({
    centeredQrView:{
        
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,

    },
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
        paddingHorizontal: 20,
        paddingTop:16,
        paddingBottom:26,
        width: '100%',
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
        flex:1
    },
    container: {
        display:'flex',
        flexDirection:'column',
        flex:1,
        paddingTop: 36,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
        zIndex: 2,
        position: 'relative',
    },
    qrModal:{
        margin: 0,
        justifyContent: 'center',
        alignItems:'center',
        zIndex:3,
        position:'relative'
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
