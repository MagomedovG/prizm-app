import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, Image, Alert, Button, Pressable, ScrollView} from "react-native";
import UIButton from "@/src/components/UIButton";
import {defaultImage} from "@/assets/data/products";
import {Colors} from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import {Stack, useLocalSearchParams} from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const AddFondItem = () => {
    const [logo, setLogo] = useState<string | null>(null)
    const [name, setName] = useState<string | null>(null)
    const [adress, setAdress] = useState<string | null>(null)

    const { theme } = useCustomTheme();


    const pickLogo = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            setLogo(result.assets[0].uri);
        }
    };






    const handleClick = () => {
        console.log('Name:', name, 'Image:', image)
    }
    return (
        <>
            <View style={styles.container}>
                <Stack.Screen options={{headerShown:false, title: "Создать фонд"}}/>
                <Text style={styles.title}>Новый фонд</Text>
                <View style={[styles.inputContainer, theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor: '#86B57A'}]}>
                    <TextInput
                        placeholder={'Вставьте название фонда'}
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer, theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor: '#86B57A'}]}>
                    <TextInput
                        placeholder={'Вставьте адрес кошелька фонда'}
                        value={adress}
                        onChangeText={setAdress}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <Pressable onPress={pickLogo} style={[styles.imageContainer, {width:'39%', borderRadius: 100, aspectRatio:1}]}>
                    <Image source={{uri:logo}} style={[styles.image, {borderRadius: 100,}]}/>
                    <Text style={styles.textbutton}>Добавьте лого</Text>
                </Pressable>
            </View>
            <UIButton onPress={()=>{console.log('Фонд добавлен', name, adress,logo)}} text={'Ок'}/>
        </>

    );
};
const styles = StyleSheet.create({
    purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
    container:{
        flex: 1,
        display:'flex',
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'center',
        paddingHorizontal:49,
    },
    input: {
        padding: 16,
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        // borderColor: '#957ABC',
        marginBottom:8
    },
    imageContainer:{
        position:'relative',
        backgroundColor:'#F2F3F3',
        marginBottom:50,
        borderRadius:13,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:7
    },
    image:{
        width:'100%',
        height:114,
        alignSelf: "center",
        borderRadius:13,

    },
    textbutton:{
        position:'absolute',
        fontWeight:'bold',
        color: '#323232',
    },
    title:{
        fontSize:35,
        width:'100%',
        textAlign:'center',
        marginBottom:20
    }
})
export default AddFondItem;
