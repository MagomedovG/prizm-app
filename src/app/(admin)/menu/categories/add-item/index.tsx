import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Image, Alert, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Stack, useLocalSearchParams } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const AddItem = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [errors, setErrors] = useState('');

    const { theme } = useCustomTheme();
    const { id } = useLocalSearchParams();
    const isUpdating = !id;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log('result.assets[0].uri', result.assets[0].uri);
        }
    };

    const convertToBase64 = async (uri) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            return base64;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            return null;
        }
    };

    const createBlobFromBase64 = (base64, mimeType) => {
        const byteString = atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeType });
    };

    const postCategory = async () => {
        if (!name) {
            setErrors('Имя не подходит');
            return;
        }

        const formData = new FormData();
        formData.append('title', name);

        if (image) {
            try {
                const base64 = await convertToBase64(image);
                if (base64) {
                    const mimeType = 'image/png'; // или другой MIME тип в зависимости от изображения
                    const blob = createBlobFromBase64(base64, mimeType);
                    formData.append('logo', blob, 'image.png'); // 'image.png' или любое другое имя файла
                }
            } catch (error) {
                console.error('Error handling image:', error);
            }
        }

        try {
            const response = await fetch(`${apiUrl}/api/v1/categories/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                return;
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const resetFields = () => {
        setName('');
        setImage(null);
    };

    const validateInput = () => {
        setErrors('');
        if (!name) {
            setErrors('Имя не подходит');
            return false;
        }
        return true;
    };

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate();
        } else {
            onCreate();
        }
    };

    const onUpdate = () => {
        if (!validateInput()) {
            return;
        }
        resetFields();
    };

    const onCreate = () => {
        if (!validateInput()) {
            return;
        }
        postCategory();
        resetFields();
    };

    const onDelete = () => {
        console.warn("Deleted");
    };

    const handleDelete = () => {
        Alert.alert("Confirm", "Вы уверены?", [
            {
                text: "Отмена"
            },
            {
                text: "Удалить",
                style: "destructive",
                onPress: onDelete
            }
        ]);
    };

    const handleClick = () => {
        console.log('Name:', name, 'Image:', image);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false, title: isUpdating ? "Изменить продукт" : "Создать продукт" }} />
            <Pressable style={styles.imageContainer} onPress={pickImage}>
                <Image source={{ uri: image || 'defaultImage' }} style={styles.image} />
                <Text style={styles.textbutton} onPress={pickImage}>Добавьте фото</Text>
            </Pressable>
            <View style={[{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomWidth: 1,
            }, theme === 'purple' ? { borderBottomColor: '#957ABC' } : { borderBottomColor: '#86B57A' }]}
            >
                <TextInput
                    placeholder="Добавьте название"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    placeholderTextColor="gray"
                />
                <FontAwesome name="pencil" size={20} color="black" />
            </View>

            <Text style={{ color: 'red' }}>{errors}</Text>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: '2%',
                width: '100%',
                position: 'absolute',
                bottom: 30,
                alignItems: 'center',
                marginHorizontal: 16
            }}>
                <Pressable style={[styles.button, { backgroundColor: 'white', width: '49%', borderWidth: 1, borderColor: '#595858' }]}>
                    <Text style={{ color: '#595858', textAlign: 'center' }}>
                        Отменить
                    </Text>
                </Pressable>
                <Pressable onPress={postCategory} style={[styles.button, theme === 'purple' ? styles.purpleBackground : styles.greenBackground, { width: '49%', borderWidth: 1, borderColor: '#41146D' }]}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        Готово
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 16,
        borderRadius: 13,
    },
    purpleBackground: {
        backgroundColor: '#41146D'
    },
    greenBackground: {
        backgroundColor: "#32933C"
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 105
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        paddingLeft: 4,
    },
    label: {
        color: "gray",
        fontSize: 17,
    },
    imageContainer: {
        position: 'relative',
        backgroundColor: '#F2F3F3',
        marginBottom: 50
    },
    image: {
        width: '100%',
        height: 150,
        alignSelf: "center",
        borderRadius: 13
    },
    textbutton: {
        position: 'absolute',
        left: 20,
        bottom: 18,
        alignSelf: "center",
        fontWeight: 'bold',
        color: '#323232'
    }
});

export default AddItem;
