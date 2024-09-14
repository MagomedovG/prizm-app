import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard,Dimensions,Platform} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AntDesign} from "@expo/vector-icons";
import Modal from "react-native-modal";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );
const CreateWallet = () => {
    const [wallet, setWallet] = useState('Кошелек');
    const [sid, setSid] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation');
    const [isNameSet, setIsNameSet] = useState(false);
    const router = useRouter();
    const [isModal, setIsModal] = useState(false);
    const toggleModal = () => {
        setIsModal(!isModal);
    };
    const copyWalletToClipboard = () => {
        Clipboard.setString(wallet);
        Alert.alert('Кошелек скопирован!','');
    };
    const copySidToClipboard = () => {
        Clipboard.setString(sid);
        Alert.alert('Парольная фраза скопирована!','');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
            <View style={{paddingHorizontal: 26, width: '100%'}}>
                <Text style={styles.title}>
                    Новый кошелек
                </Text>
                <Text style={styles.label}>Адрес нового кошелька</Text>
                <Pressable onPress={copyWalletToClipboard} style={[styles.pressable, {marginBottom: 43}]}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        placeholder={'wallet'}
                        value={wallet}
                    />
                    <View style={[styles.copyButtonContainer, {bottom:0}]}>
                        <AntDesign name="copy1" size={15} color="#262626" />
                    </View>
                </Pressable>
                <Text style={styles.label}>Парольная фраза</Text>
                <Pressable onPress={copySidToClipboard} style={[styles.pressable, {marginBottom: 7}]}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        multiline={true}
                        placeholder={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation'}
                        value={sid}
                    />
                    <View style={[styles.copyButtonContainer, {top:16,right: 15}]}>
                        <AntDesign name="copy1" size={15} color="#262626" />
                    </View>
                </Pressable>
                <Text style={{marginLeft:9, color:'#B81C1C'}}>Обязательно сохраните парольную фразу! Ее нельзя
                    будет получить еще раз.</Text>
            </View>
            <UIButton text='Я сохранил парольную фразу' onPress={()=>{toggleModal()}}/>
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                onSwipeComplete={toggleModal}
                onBackdropPress={toggleModal}
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
                        <Text style={styles.modalText}>Обязательно сохраните сид-фразу! 
                        Ее нельзя будет получить еще раз.</Text>
                        <View style={{display:'flex', justifyContent:'space-between',alignItems:'center', flexDirection:'column',width:'100%', gap:6}}>
                            <Pressable onPress={() => toggleModal()} style={{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13}}>
                                <Text style={{fontSize:18,textAlign:'center'}}>Я сохранил</Text>
                            </Pressable>
                            <Pressable onPress={() => toggleModal()} style={{paddingVertical:15, borderWidth:1, borderColor:'#41146D',backgroundColor:'#41146D', width:'100%', borderRadius: 13}}>
                                <Text style={{fontSize:18,textAlign:'center', color:'white'}}>Забыл сохранить</Text>
                            </Pressable>
                        </View>


                        {/*<Text style={styles.modalText}>Hello World!</Text>*/}
                        {/*<Pressable*/}
                        {/*    style={[styles.button, styles.buttonClose]}*/}
                        {/*    onPress={hideModal}>*/}
                        {/*    <Text style={styles.textStyle}>Hide Modal</Text>*/}
                        {/*</Pressable>*/}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CreateWallet;

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize:15
    },
    centeredView: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 27,
        paddingTop:19,
        paddingBottom:29,
        // margin:'0 auto',
        alignItems: 'center',
        shadowColor: '#000',
        width: '80%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    pressable: {
        position: 'relative',
    },
    copyButtonContainer: {
        position: 'absolute',
        right: 15,
        top: 0,
        // bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label:{
        color:'#B6B6B6',
        fontSize:14,
        marginLeft:9,
        marginBottom:2
    },
    createWallet:{
        marginHorizontal:42,
        alignItems: 'center',
        marginVertical: 15,
        position:'absolute',
        bottom:95
    },
    input: {
        borderWidth: 1,
        borderColor: '#957ABC',
        paddingVertical: 15,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        fontSize:18,
        color: '#000000',
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#957ABC'
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        marginTop:88,
        alignItems: 'center',
        position:'relative'
    },
    title: {
        color: '#070907',
        marginBottom: 40,
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
