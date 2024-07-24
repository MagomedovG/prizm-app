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
import { StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import wallets from "@/assets/data/wallet";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
import { categories } from "@/assets/data/categories";
import MainHeader from "@/src/components/MainHeader";
import { LinearGradient } from "expo-linear-gradient";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
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

    const handleWalletPress = (value: boolean) => {
        setIsModal(value);
    };

    const hideModal = () => {
        console.log('hide');
    };

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

            <View style={{ flex: 1 }} >
                {isModal && <View style={styles.overlay} />}
                <MainHeader onWalletPress={handleWalletPress} />
                <View>
                    <LinearGradient
                        colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.walletContainer}
                    >
                        <Text style={[styles.walletTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>Кошельки</Text>
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
        marginBottom: 15,
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
