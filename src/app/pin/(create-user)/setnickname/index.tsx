import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput, Pressable, Dimensions, StatusBar, ScrollView, Platform} from "react-native";
import {Stack, useRouter} from "expo-router";
import UIButton from "@/src/components/UIButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
import {text} from '@/assets/data/text'
const SetNickName = () => {
    const [name, setName] = useState<any>('');
    const router = useRouter();
    const { theme } = useCustomTheme();
    const [checked, setChecked] = useState(false);
    const [isModal, setIsModal] = useState(false)
    
    useEffect(()=> {
        const getAsyncName = async () => {
            const userName = await AsyncStorage.getItem('username');
            const parsedUserName = userName ? userName: '';
            if (userName){
                setName(parsedUserName);
            }
        };
        getAsyncName();
    }, [])

    const setNickName = async () => {
        if (name?.length === 0) {
            return
        }
        await AsyncStorage.setItem('username', name);
        router.push('/pin/setnickname/LoginScreen')
    }
    
    const handleNameChange = (text: string) => {
            const allowedCharsRegex = /^[a-zA-Zа-яА-Я0-9._@]*$/;
            if (allowedCharsRegex.test(text)) {
                setName(text);
            }
    };


    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'SetNickName', headerShown: false }} />
            <View style={{paddingHorizontal: 45, width: '100%'}}>
                <Text style={styles.title}>
                    Придумайте имя пользователя
                </Text>
                <View style={[styles.inputContainer, theme === 'purple' ? {} : {borderColor:'#32933C'}]}>
                    <TextInput
                        placeholder="Имя пользователя"
                        value={name}
                        onChangeText={handleNameChange}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <Text style={styles.suggest}>
                    Имя пользователя может содержать только буквы, цифры и символы @, _, .
                </Text>
                <View style={styles.checkboxContainer}>
                        <Pressable
                            role="checkbox"
                            aria-checked={checked}
                            style={[styles.checkboxBase, checked && (theme === 'purple' ? styles.checkboxPurpleChecked : styles.checkboxGreenChecked), theme === 'purple' ? {} : {borderColor:"#32933C"}]}
                            onPress={() => setChecked(!checked)}>
                            {checked && <Ionicons name="checkmark-sharp" size={17} color="white" />}
                        </Pressable>
                        <Pressable onPress={()=>setIsModal(true)}>
                            <Text style={styles.checkboxText}>
                                Я прочитал и согласен {''}
                                    <Text style={theme === "purple" ? {color:'#41146D'} : {color:"#32933C"}}>
                                        с условиями
                                    </Text>
                            </Text>
                        </Pressable>
                    </View>
            </View>
            <UIButton text='Ок' onPress={()=>!checked || !name ? console.log('') : setNickName()} disabled={!checked || !name}/>
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                onBackButtonPress={()=>setIsModal(false)}
                animationInTiming={200}
                animationOutTiming={300} // Уменьшите время анимации
                backdropTransitionOutTiming={50} 
                backdropColor='black'
                hardwareAccelerated
                style={styles.modal}
                statusBarTranslucent
            >   
                <View style={styles.centeredView}>
                    <View style={styles.modalViewContainer}>
                        
                        <ScrollView>
                            <Text style={styles.modalTitle}>
                                Условия обслуживания Vozvrat pzm.
                            </Text>
                            <Text style={{fontSize:16, marginBottom:120}}>
                                {text}
                            </Text>
                        </ScrollView>
                        
                    </View>
                </View>
                <UIButton text="Ознакомился" onPress={()=>setIsModal(false)}/>

            </Modal>
        </View>
    );
};

export default SetNickName;

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: 'flex-end',
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
        position:'relative',
    },
    modalViewContainer:{
        backgroundColor: '#f5f5f5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: '#000',
        width: '100%',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height:height - 100,
        paddingTop:26,
        paddingHorizontal:21,
    },
    modalTitle:{
        fontSize:20,
        fontWeight: 'bold',
        marginBottom:15,
        marginTop:15
    },
    checkboxBase: {
        width: 21,
        height: 21,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#957ABC',
        backgroundColor: 'transparent',
        marginLeft:5
      },
      checkboxPurpleChecked: {
        backgroundColor: '#41146D',
      },
      checkboxGreenChecked: {
        backgroundColor: '#32933C',
      },
      checkboxContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginBottom: 20,
        marginTop:4,
    },
    checkboxText: {
        fontSize: 14,
        lineHeight: 18, // Немного больше для центрирования относительно чекбокса
        textAlignVertical: 'center', // Для текстового центрирования
    },
    createWallet:{
        marginHorizontal:42,
        alignItems: 'center',
        marginVertical: 15,
        position:'absolute',
        bottom:95
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical:12,
        paddingLeft:12,
        width: '100%',
        fontSize: 16,
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#957ABC'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative'
    },
    title: {
        color: '#6A6A6A',
        marginBottom: 40,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'medium'
    },
    suggest: {
        marginTop:5,
        marginLeft:5,
        fontSize: 11,
        color:'#000',
        opacity:0.4
    }
});
