import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard,Dimensions,Platform, ScrollView} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import {AntDesign} from "@expo/vector-icons";
import Modal from "react-native-modal";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const CreateWallet = () => {
    const [publicKey, setPublicKey] = useState('');
    const [prizmWallet, setPrizmWallet] = useState('');
    const [secretPhrase, setSecretPhrase] = useState('');
    const router = useRouter();
    const [isModal, setIsModal] = useState(false);
    const toggleModal = () => {
        setIsModal(!isModal);
    };
    const copyWalletToClipboard = () => {
        Clipboard.setString(prizmWallet);
        Alert.alert('Кошелек скопирован!','');
    };
    const copyPublicKeyToClipboard = () => {
        Clipboard.setString(publicKey);
        Alert.alert('Публичный ключ скопирован!','');
    };
    const copySidToClipboard = () => {
        Clipboard.setString(secretPhrase);
        Alert.alert('Парольная фраза скопирована!','');
    };

    const postForm = async () => {
        const username = await asyncStorage.getItem('username')
        const public_key_hex = await asyncStorage.getItem('public_key_hex')
        const prizm_wallet = await asyncStorage.getItem('prizm_wallet')
        const walletName = await asyncStorage.getItem('prizm_wallet');
        // const isUpdatedName = walletName ? JSON.parse(walletName) !== name : true
        
        const form = {
            username,
            prizm_wallet:prizmWallet,
            public_key_hex:publicKey 
        };
        try {
            const response = await fetch(`${apiUrl}/api/v1/users/get-or-create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            console.log(form)
            const data = await response.json();
            if (!response.ok) {
                const result = data?.username ? data?.username[0] : data?.prizm_wallet ? data?.prizm_wallet[0] : 'Ошибка'
                Alert.alert(result)
                throw new Error('Ошибка сети');
            } else {
                router.replace('/(user)/menu');
                await asyncStorage.setItem('username', JSON.stringify(data?.username))
                await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.prizm_wallet))
                await asyncStorage.setItem('is_superuser', JSON.stringify(data?.is_superuser));
                await asyncStorage.setItem('user_id', JSON.stringify(data?.id))
            }
        } catch (error) {
            // await asyncStorage.removeItem('username')
            await asyncStorage.removeItem('prizm_wallet')
        }
    };

    useEffect(() => {
        const createNewWallet = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/v1/users/create-new-wallet/`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json()
                if (response.ok){
                    setSecretPhrase(data?.secret_phrase)
                    setPrizmWallet(data?.account_rs)
                    setPublicKey(data?.public_key_hex)
                    await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.account_rs))
                    await asyncStorage.setItem('public_key_hex', JSON.stringify(data?.public_key_hex))
                }
            } catch (error) {
                console.log(error)
            }
        }
        createNewWallet()
    },[])

    const menuScreen = () => {
        setTimeout(() => {
            router.push('/(user)/menu/');
        }, 300); 
        // toggleModal()
        // router.replace('/(user)/menu/');
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>

            
                <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
                <View style={{paddingHorizontal: 26, width: '100%'}}>
                    <Text style={styles.title}>
                        Новый кошелек
                    </Text>
                    <Text style={styles.label}>Адрес нового кошелька</Text>
                    <Pressable onPress={copyWalletToClipboard} style={[styles.pressable, {marginBottom: 15}]}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            placeholder={'Prizm Wallet'}
                            value={prizmWallet}
                            placeholderTextColor='#8C8C8C'
                        />
                        <View style={[styles.copyButtonContainer, {bottom:0}]}>
                            <AntDesign name="copy1" size={15} color="#262626" />
                        </View>
                    </Pressable>
                    <Text style={styles.label}>Публичный ключ</Text>
                    <Pressable onPress={copyPublicKeyToClipboard} style={[styles.pressable, {marginBottom: 15}]}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            placeholder={'Public Key'}
                            value={publicKey}
                            placeholderTextColor='#8C8C8C'
                        />
                        <View style={[styles.copyButtonContainer, {bottom:0}]}>
                            <AntDesign name="copy1" size={15} color="#262626" />
                        </View>
                    </Pressable>
                    <Text style={styles.label}>Парольная фраза</Text>
                    <Pressable onPress={copySidToClipboard} style={[styles.pressable, {marginBottom: 7}]}>
                        <TextInput
                            style={[styles.input, {paddingRight:30}]}
                            editable={false}
                            multiline={true}
                            placeholder={'Secret Phrase'}
                            value={secretPhrase}
                            placeholderTextColor='#8C8C8C'
                        />
                        <View style={[styles.copyButtonContainer, {top:16,right: 15}]}>
                            <AntDesign name="copy1" size={15} color="#262626" />
                        </View>
                    </Pressable>
                    <Text style={{marginLeft:9, color:'#B81C1C'}}>Обязательно сохраните парольную-фразу! 
                        Ее нельзя будет получить еще раз. Без нее
                        нельзя будет обменять pzm на рубли
                    </Text>
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
                    backdropTransitionOutTiming={0}
                    swipeDirection={'down'}
                    onBackButtonPress={toggleModal}
                    style={styles.modal}

                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{color:'#B81C1C', fontWeight: 500,fontSize:23, marginBottom:7}}>
                                Внимание!
                            </Text>
                        <Text style={styles.modalText}>
                            Обязательно сохраните парольную фразу! 
                            Ее нельзя будет получить еще раз. 
                            <Text style={{color:'#B81C1C', fontWeight: 500}}>
                                {' '}
                                Без нее нельзя будет обменять pzm на рубли
                            </Text>
                        </Text>

                            <View style={{display:'flex', justifyContent:'space-between',alignItems:'center', flexDirection:'column',width:'100%', gap:12}}>
                                <Pressable onPress={() => postForm()} style={{paddingVertical:15, borderWidth:1, borderColor:'#41146D', width:'100%', borderRadius: 13}}>
                                    <Text style={{fontSize:18,textAlign:'center'}}>Я сохранил</Text>
                                </Pressable>
                                <Pressable onPress={() => toggleModal()} style={{paddingVertical:15, borderWidth:1, borderColor:'#41146D',backgroundColor:'#41146D', width:'100%', borderRadius: 13}}>
                                    <Text style={{fontSize:18,textAlign:'center', color:'white'}}>Забыл сохранить</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
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
        textAlign: 'left',
        fontSize:15
    },
    centeredView: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 27,
        paddingTop:19,
        paddingBottom:29,
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
        paddingRight:32
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#957ABC'
    },
    container: {
        flex: 1,
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
