import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, Image, Alert, Button, Pressable, ScrollView} from "react-native";
import UIButton from "@/src/components/UIButton";
import {defaultImage} from "@/assets/data/products";
import {Colors} from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import {Stack, useLocalSearchParams} from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const AddItem = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [adress, setAdress] = useState('')
    const [cashback, setCashback] = useState('')
    const [info, setInfo] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [logo, setLogo] = useState<string | null>(null)
    const [errors, setErrors] = useState('')

    const { theme } = useCustomTheme();

    const { id } = useLocalSearchParams()
    const isUpdating = !!id
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
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
    const resetFields = () => {
        // setPrice('')
        setName('')
        // setImage('')
    }

    const validateInput = () => {
        setErrors('')
        if (!name){
            setErrors('Имя не подходит')
            return false
        }
        // if (!price){
        //     setErrors('Цена не подходит')
        //     return false
        // }
        // if (!image){
        //     setErrors('Ссылка не подходит')
        //     return false
        // }
        // if (isNaN(parseFloat(price))){
        //     setErrors('Цена должна быть числом')
        //     return false
        // }
        return true
    }

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate
        } else {
            onCreate()
        }
    }
    const onUpdate = () => {
        if (!validateInput()){
            return
        }
        resetFields()
    }
    const onCreate = () => {
        if (!validateInput()){
            return
        }
        resetFields()
    }
    const onDelete = () => {
        console.warn("Deleted")
    }
    const handleDelete = () => {
        Alert.alert("Confirm", "Вы уверены?", [
            {
                text:"Отмена"
            },
            {
                text:"Удалить",
                style:"destructive",
                onPress: onDelete
            }
        ])
    }
    const handleClick = () => {
        console.log('Name:', name, 'Image:', image)
    }
    return (
        //66 and 42
        <View style={styles.container}>
            <Stack.Screen options={{headerShown:false, title: isUpdating ? "Изменить продукт" :  "Создать продукт"}}/>
            <ScrollView style={{paddingVertical:55}}>
                <View style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <Pressable style={[styles.imageContainer, {width:'58%'}]}  onPress={pickImage}>
                        <Image source={{uri:image}} style={styles.image}/>
                        <Text style={styles.textbutton}>Добавьте фото</Text>
                    </Pressable>
                    <Pressable style={[styles.imageContainer, {width:'39%', borderRadius: 100, aspectRatio:1}]}  onPress={pickLogo}>
                        <Image source={{uri:logo}} style={[styles.image, {borderRadius: 100,}]}/>
                        <Text style={styles.textbutton}>Добавьте лого</Text>
                    </Pressable>
                </View>

                {/*<Text style={styles.label}>Название</Text>*/}
                <View style={[styles.inputContainer,  theme === 'purple' ? {borderBottomColor: '#957ABC'} : {borderBottomColor: '#86B57A'}]}>
                    <TextInput
                        placeholder="Добавьте название"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer,  theme === 'purple' ? {borderBottomColor: '#957ABC'} : {borderBottomColor: '#86B57A'}]}>
                    <TextInput
                        placeholder="Добавьте описание"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer,  theme === 'purple' ? {borderBottomColor: '#957ABC'} : {borderBottomColor: '#86B57A'}]}>
                    <TextInput
                        placeholder="Добавьте адрес"
                        value={adress}
                        onChangeText={setAdress}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer,  theme === 'purple' ? {borderBottomColor: '#957ABC'} : {borderBottomColor: '#86B57A'}]}>
                    <TextInput
                        placeholder="Добавьте кэшбек"
                        value={cashback}
                        onChangeText={setCashback}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer,  theme === 'purple' ? {borderBottomColor: '#957ABC'} : {borderBottomColor: '#86B57A'}]}>
                    <TextInput
                        placeholder="Выберите категорию"
                        value={category}
                        onChangeText={setCategory}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>

                <Text style={{color: 'red'}}>{errors}</Text>

                {/*<View*/}
                {/*    style={{*/}
                {/*        borderBottomColor: '#000000',*/}
                {/*        borderBottomWidth: 1,*/}
                {/*    }}>*/}
                {/*    <TextInput*/}
                {/*        editable*/}
                {/*        multiline*/}
                {/*        numberOfLines={4}*/}
                {/*        maxLength={40}*/}
                {/*        onChangeText={setInfo}*/}
                {/*        value={info}*/}
                {/*        style={{padding: 10}}*/}
                {/*    />*/}
                {/*</View>*/}
            </ScrollView>

            {/*<UIButton onPress={onSubmit} text={isUpdating ? 'Изменить' : 'Создать'}/>*/}
            <View style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                gap:'2%',
                width:'100%',
                position:'absolute',
                bottom:30,
                alignItems: 'center',
                marginHorizontal:16
            }}>
                <Pressable style={[styles.button,{backgroundColor:'white', width:'49%', borderWidth:1, borderColor:'#595858'}]}>
                    <Text style={{color:'#595858', textAlign:'center'}}>
                        Отменить
                    </Text>
                </Pressable>
                <Pressable onPress={handleClick} style={[styles.button, theme === 'purple' ? styles.purpleBackground : styles.greenBackground,{width:'49%',borderWidth:1, borderColor:'#41146D'} ]}>
                    <Text style={{color:'white', textAlign:'center'}}>
                        Готово
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    inputContainer:{
        display:'flex',
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:1,
        // borderBottomColor:'#5B1FB2',
        marginBottom:25
    },
    button:{
        padding:16,
        borderRadius:13,

    },
    purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
    container:{
        flex: 1,
        padding:16,
    },
    input:{
        backgroundColor: 'white',
        padding:10,
        borderRadius:5,
        paddingLeft:4,
    },
    label:{
        color:"gray",
        fontSize:17,
    },
    imageContainer:{
        position:'relative',
        backgroundColor:'#F2F3F3',
        marginBottom:50,
        borderRadius:13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image:{
        width:'100%',
        height:150,
        alignSelf: "center",
        borderRadius:13,

    },
    textbutton:{
        position:'absolute',
        fontWeight:'bold',
        color: '#323232',
    }
})
export default AddItem;
