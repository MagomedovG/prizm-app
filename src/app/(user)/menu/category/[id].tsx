import React, {useEffect, useState} from 'react';
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
    KeyboardAvoidingView
} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import {useCart} from "@/src/providers/CartProvider";
import {categories} from "@/assets/data/categories";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import SearchInput from "@/src/components/SearchInput";
import MainHeader from "@/src/components/MainHeader";
import HeaderLink from "@/src/components/HeaderLink";
import {ICategoryItem} from "@/src/types";
import {LinearGradient} from "expo-linear-gradient";
import Modal from "react-native-modal";
import {lightColor} from "@/assets/data/colors";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {IBusinessInCategory} from '../../../../types'
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );

export default function categoryId() {

    const router = useRouter()
    const { id } = useLocalSearchParams()
    const {theme} = useCustomTheme()

    const [categoryList, setCategoryList] = useState<IBusinessInCategory | null>(null)
    const [isModal, setIsModal] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
        setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
    });

    const containerStyle = {
        ...styles.container,
        // marginBottom: keyboardHeight ? ITEM_HEIGHT + keyboardHeight : ITEM_HEIGHT,
      };

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


    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(
                    `${apiUrl}/api/v1/categories/${id}/get-businesses`,
                );
                const data = await response.json();
                console.log(data);
                setCategoryList(data);
                if (!response.ok){
                    console.log(response);
                }

            } catch (error) {
                console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/categories/`);
            }
        }

        getData();
    }, []);




    const [filteredData, setFilteredData] = useState<IBusinessInCategory | null>(null);
    const handleFilteredData = (data:any) => {
        setFilteredData(data);
    };

    return (
        <KeyboardAvoidingView
            // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { marginBottom: keyboardHeight ? keyboardHeight  : 0}]}
        >
            <Stack.Screen options={{
                headerShown:false,
                header: () => <HeaderLink title="Главная" link="/(user)/menu"/>,
            }}/>
            {/*<Text style={styles.title}>{category.name}</Text>*/}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <SearchInput data={categoryList?.businesses} onFilteredData={handleFilteredData} placeholder="Найти супермаркет"/>
                <CategoryItemList categoryList={filteredData} title={categoryList?.category?.title} isBonus={true} onWalletPress={handleWalletPress} />
            </ScrollView>
            
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
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/*<Text style={styles.modalText}>Как получить бонусы?</Text>*/}
                        <View style={{display:'flex', justifyContent:'space-between', flexDirection:'column',marginTop:47}}>
                            <Text style={styles.subTitle}>Как получить бонусы?</Text>
                            <View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                                    <Text style={styles.text}>При отплате покажите qr-код продавцу</Text>
                                </View>
                                <View style={{width: 1,
                                    height: 20,
                                    backgroundColor: 'black',
                                    alignSelf: 'flex-start',
                                    marginVertical: 10,
                                    marginLeft:21.5
                                }}></View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>2</Text></View>
                                    <Text style={styles.text}>Кэшбэк начислится мгновенно</Text>
                                </View>
                            </View>


                        </View>
                        <View style={{display:'flex', justifyContent:'space-between', flexDirection:'column',marginBottom:45, marginTop:62}}>
                            <Text style={styles.subTitle}>Как вывести бонусы?</Text>
                            <View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>1</Text></View>
                                    <Text style={styles.text}>При отплате покажите qr-код продавцу</Text>
                                </View>
                                <View style={{width: 1,
                                    height: 20,
                                    backgroundColor: 'black',
                                    alignSelf: 'flex-start',
                                    marginVertical: 10,
                                    marginLeft:21.5
                                }}></View>
                                <View style={{display:'flex', flexDirection:'row', gap:15, alignItems:'center'}}>
                                    <View style={[styles.circle, theme === 'purple' ? styles.purpleCircle : styles.greenCircle]}><Text style={theme === 'purple' ? styles.purpleCircleText : styles.greenCircleText}>2</Text></View>
                                    <Text style={styles.text}>Кэшбэк начислится мгновенно</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>


    );
};
const styles = StyleSheet.create({
    modalText:{},
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
    centeredView: {
        // flex: 1,
        justifyContent: 'flex-end',
    },
    container: {
        // flex: 1,
        display:'flex',
        flexDirection:'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        paddingTop: 36,
        // paddingBottom:50,
        alignSelf: 'center',
        // overflow: 'scroll'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
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
        width:43,
        height:43,
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
        // marginTop:62,
        marginBottom:9,
        color:'#323232',
        fontSize:20,
        fontWeight:'medium'
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
