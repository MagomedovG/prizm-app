import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Alert, Pressable, Clipboard,Dimensions,Platform, ScrollView, StatusBar} from "react-native";
import {Link, Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import {AntDesign} from "@expo/vector-icons";
import Modal from "react-native-modal";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import PrizmWallet from '@/src/utils/PrizmWallet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceWidth = Dimensions.get("window").width;
const { width, height } = Dimensions.get('window');

const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const CONTAINER_TOP = height / 20
const CreateWallet = () => {
    const [publicKey, setPublicKey] = useState<string | null>('');
    const [prizmWallet, setPrizmWallet] = useState<string | bigint | null>('');
    const [secretPhrase, setSecretPhrase] = useState<string | null>('');
    const router = useRouter();
    const [isModal, setIsModal] = useState(false);

    const newWallet = new PrizmWallet(true)


    const toggleModal = () => {
        setIsModal(!isModal);
    };

    const replaceToMenu = () => {
        setIsModal(false);
        setTimeout(() => {
            router.replace('/(user)/menu');
        }, 600); 
    };
    
    
    const copySidToClipboard = () => {
        Clipboard.setString(secretPhrase);
        Alert.alert('Парольная фраза скопирована!','');
    };

    const postForm = async () => {
        
        const username = await AsyncStorage.getItem('username');
        console.log(username);
        const public_key_hex = await asyncStorage.getItem('public_key_hex');
        const prizm_wallet = await asyncStorage.getItem('prizm_wallet');
        const walletName = await asyncStorage.getItem('prizm_wallet');
        
        const form = {
            username: username,
            prizm_wallet: prizmWallet,
            public_key_hex: publicKey 
        };
        console.log(form,)
        try {
            
            const response = await fetch(`${apiUrl}/api/v1/users/get-or-create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            console.log('dd',data)

            if (!response.ok) {
                const result = data.username?.[0] || data.prizm_wallet?.[0] || 'Ошибка'
                Alert.alert(result)
                
                throw new Error('Ошибка сети');
            } else {
                setIsModal(false);
                await asyncStorage.setItem('username', JSON.stringify(data?.username))
                await asyncStorage.setItem('prizm_wallet', JSON.stringify(data?.prizm_wallet))
                await asyncStorage.setItem('is_superuser', JSON.stringify(data?.is_superuser));
                await asyncStorage.setItem('user_id', JSON.stringify(data?.id))
                await asyncStorage.setItem("secret-phrase", secretPhrase);
                replaceToMenu() 
            }
        } catch (error) {
            console.log(error)
        }
    };
    const createNewWallet = async () => {
        try {
                // const w = await newWallet

                setSecretPhrase(newWallet.secretPhrase)
                setPrizmWallet(newWallet.accountRs)
                setPublicKey(newWallet.publicKeyHex)
                
                console.log(newWallet,prizmWallet, publicKey, secretPhrase )
                await asyncStorage.setItem('secret-phrase', newWallet.secretPhrase || '')
                await asyncStorage.setItem('prizm_wallet', newWallet.accountRs && typeof newWallet.accountRs === 'string' ? newWallet.accountRs : '')
                await asyncStorage.setItem('public_key_hex', newWallet.publicKeyHex || '')
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        setTimeout(()=>{
            createNewWallet()
        })
    },[])
    const nwallet = () => {
        console.log(newWallet.secretPhrase)
    }
    const menuScreen = () => {
        setTimeout(() => {
            router.push('/(user)/menu/');
        }, 300); 
        // toggleModal()
        // router.replace('/(user)/menu/');
    }

    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom:150 }}>
                <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
                <View style={styles.container}>
                    <View style={{paddingHorizontal: 26, width: '100%',maxWidth:900}}>
                        
                        <Text style={styles.title}>
                            ПРЕДУПРЕЖДЕНИЕ
                        </Text>
                        <View style={styles.message}>
                            <Text style={styles.messageText}>
                                Обязательно сохраните парольную-фразу! 
                                Без неё невозможно будет восстановить  аккаунт(кошелёк)
                                Обязательно сохраните так,чтобы вы могли её использовать при случае утере телефона. (Сделайте фото экрана или перепишите на лист бумаги).
                            </Text>
                            <Text style={styles.messageText}>
                                    Парольную фразу нельзя показывать никому,так как это даст возможность украсть ваши средства PZM.
                                </Text>
                        </View>
                        <Text style={styles.label}>Парольная-фраза</Text>
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
                                <FontAwesome5 name="copy" size={15} color="gray" />
                            </View>
                        </Pressable>
                        
                    </View>
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
                        {...(Platform.OS !== 'ios' ? { backdropTransitionOutTiming: 0 } : {})}
                        swipeDirection={'down'}
                        onBackButtonPress={toggleModal}
                        style={styles.modal}
                        statusBarTranslucent
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{color:'rgba(255, 49, 49, 1)', fontWeight: 500,fontSize:23, marginBottom:7}}>
                                    Внимание!
                                </Text>
                                <Text style={styles.modalText}>
                                    Обязательно сохраните парольную фразу! 
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
            <UIButton text='Я сохранил парольную фразу' onPress={()=>{toggleModal()}}/>

        </>
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
        color:'rgba(7, 9, 7, 1)',
        fontSize:14,
        marginLeft:9,
        marginBottom:2,
        fontWeight:'700'
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
        borderRadius: 10,
        fontSize:18,
        color: '#000000',
        paddingRight:32
    },
    message:{
        borderWidth: 1,
        borderColor: '#B81C1C',
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        fontSize:18,
        color: '#000000',
        paddingRight:32,
        marginBottom:16
    },
    messageText:{
        fontSize:18,
        color:'#B81C1C',
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
        position:'relative',
    },
    title: {
        color: '#B81C1C',
        marginTop: CONTAINER_TOP ,
        fontSize: 20,
        marginBottom:11,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
