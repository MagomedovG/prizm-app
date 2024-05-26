import React, {useState} from 'react';
import {Text, View, StyleSheet, TextInput, Image, Alert} from "react-native";
import UIButton from "@/src/components/UIButton";
import {defaultImage} from "@/assets/data/products";
import {Colors} from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import {Stack, useLocalSearchParams} from "expo-router";

const CreateProductScreen = () => {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState<string | null>(null)
    const [errors, setErrors] = useState('')

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
    const resetFields = () => {
        setPrice('')
        setName('')
        // setImage('')
    }

    const validateInput = () => {
        setErrors('')
        if (!name){
            setErrors('Имя не подходит')
            return false
        }
        if (!price){
            setErrors('Цена не подходит')
            return false
        }
        // if (!image){
        //     setErrors('Ссылка не подходит')
        //     return false
        // }
        if (isNaN(parseFloat(price))){
            setErrors('Цена должна быть числом')
            return false
        }
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
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title: isUpdating ? "Изменить продукт" :  "Создать продукт"}}/>
            <Image source={{uri:image || defaultImage}} style={styles.image}/>
            <Text style={styles.textbutton} onPress={pickImage}>Выберите фотографию</Text>
            <Text style={styles.label}>Название</Text>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Text style={styles.label}>Цена (₽)</Text>
            <TextInput
                placeholder="399"
                style={styles.input}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
            />
            {/*<Text style={styles.label}>Ссылка на фотографию</Text>*/}
            {/*<TextInput*/}
            {/*    placeholder="https://..."*/}
            {/*    style={styles.input}*/}
            {/*    value={image}*/}
            {/*    onChangeText={setImage}*/}
            {/*/>*/}
            <Text style={{color: 'red'}}>{errors}</Text>
            <UIButton onPress={onSubmit} text={isUpdating ? 'Изменить' : 'Создать'}/>
            {isUpdating && <Text onPress={handleDelete} style={styles.textbutton}>Удалить</Text>}
        </View>
    );
};
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        padding:10,
    },
    input:{
        backgroundColor: 'white',
        padding:10,
        borderRadius:5,
        marginTop:5,
        marginBottom: 20
    },
    label:{
        color:"gray",
        fontSize:17,
    },
    image:{
        width:'50%',
        aspectRatio:1,
        alignSelf: "center"
    },
    textbutton:{
        alignSelf:"center",
        fontWeight:'bold',
        color: Colors.light.tint,
        marginVertical:20
    }
})
export default CreateProductScreen;
