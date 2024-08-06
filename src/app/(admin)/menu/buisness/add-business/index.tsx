import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Image, Alert, Pressable, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { Picker } from '@react-native-picker/picker';

const AddItem = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [cashback, setCashback] = useState('');
    const [info, setInfo] = useState('');
    const [category, setCategory] = useState<string>(''); // Сохранение ID категории
    const [image, setImage] = useState<string[]>([]); // Массив строк для изображений
    const [logo, setLogo] = useState<string | null>(null);
    const [categories, setCategories] = useState<Array<{ id: string, title: string }>>([]);
    const [errors, setErrors] = useState('');

    const { theme } = useCustomTheme();

    const { id } = useLocalSearchParams();
    const isUpdating = !!id;

    useEffect(() => {
        // Получение категорий при монтировании компонента
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/categories/');
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Ошибка при получении категорий:', error);
            }
        };

        fetchCategories();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage([...image, result.assets[0].uri]);
        }
    };

    const pickLogo = async () => {
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
        setName('');
        setDescription('');
        setAddress('');
        setCashback('');
        setInfo('');
        setCategory('');
        setImage([]);
        setLogo(null);
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

    const onCreate = async () => {
        if (!validateInput()) {
            return;
        }

        const businessData = {
            title: name,
            description: description,
            address: address,
            cashback_size: parseFloat(cashback), // Преобразование в число
            category: parseInt(category), // Преобразование в число
            created_by: 1, // Замените на реальный ID создателя
            uploaded_images: image,
            logo: logo // Предполагается, что сервер сможет обработать URL как логотип
        };

        try {
            const response = await fetch('http://localhost:8000/api/v1/business/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(businessData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors(JSON.stringify(errorData));
                throw new Error('Ошибка сети');
            }

            const data = await response.json();
            console.log('Успешно создано:', data);
            resetFields();
        } catch (error) {
            console.error('Ошибка при создании:', error);
        }
    };

    const onDelete = () => {
        console.warn("Deleted");
    };

    const handleDelete = () => {
        Alert.alert("Confirm", "Вы уверены?", [
            { text: "Отмена" },
            { text: "Удалить", style: "destructive", onPress: onDelete }
        ]);
    };

    const handleClick = () => {
        onSubmit();
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false, title: isUpdating ? "Изменить продукт" : "Создать продукт" }} />
            <ScrollView style={{ paddingVertical: 55 }}>
                <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pressable style={[styles.imageContainer, { width: '58%' }]} onPress={pickImage}>
                        <Image source={{ uri: image[0] }} style={styles.image} />
                        <Text style={styles.textbutton}>Добавьте фото</Text>
                    </Pressable>
                    <Pressable style={[styles.imageContainer, { width: '39%', borderRadius: 100, aspectRatio: 1 }]} onPress={pickLogo}>
                        <Image source={{ uri: logo }} style={[styles.image, { borderRadius: 100 }]} />
                        <Text style={styles.textbutton}>Добавьте лого</Text>
                    </Pressable>
                </View>

                <View style={[styles.inputContainer, theme === 'purple' ? { borderBottomColor: '#957ABC' } : { borderBottomColor: '#86B57A' }]}>
                    <TextInput
                        placeholder="Добавьте название"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer, theme === 'purple' ? { borderBottomColor: '#957ABC' } : { borderBottomColor: '#86B57A' }]}>
                    <TextInput
                        placeholder="Добавьте описание"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer, theme === 'purple' ? { borderBottomColor: '#957ABC' } : { borderBottomColor: '#86B57A' }]}>
                    <TextInput
                        placeholder="Добавьте адрес"
                        value={address}
                        onChangeText={setAddress}
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={[styles.inputContainer, theme === 'purple' ? { borderBottomColor: '#957ABC' } : { borderBottomColor: '#86B57A' }]}>
                    <TextInput
                        placeholder="Добавьте кэшбек"
                        value={cashback}
                        onChangeText={setCashback}
                        style={styles.input}
                        placeholderTextColor="gray"
                        keyboardType="numeric" // Для ввода только чисел
                    />
                </View>
                <View style={[styles.inputContainer, theme === 'purple' ? { borderBottomColor: '#957ABC' } : { borderBottomColor: '#86B57A' }]}>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => setCategory(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Выберите категорию" value="" />
                        {categories.map(cat => (
                            <Picker.Item key={cat.id} label={cat.title} value={cat.id} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.textContainer}>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={4}
                        value={info}
                        onChangeText={text => setInfo(text)}
                        placeholder="Общая информация"
                    />
                </View>

                <Text style={{ color: 'red' }}>{errors}</Text>
            </ScrollView>

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
                <Pressable onPress={handleClick} style={[styles.button, theme === 'purple' ? styles.purpleBackground : styles.greenBackground, { width: '49%', borderWidth: 1, borderColor: '#41146D' }]}>
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        Готово
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        height: 50,
        width: '100%',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 80
    },
    textArea: {
        height: 178,
        padding: 13,
        backgroundColor: '#fff',
        borderColor: '#828282',
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'top',
        fontSize: 18
    },
    inputContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginBottom: 25
    },
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
        marginBottom: 50,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 150,
        alignSelf: "center",
        borderRadius: 13,
    },
    textbutton: {
        position: 'absolute',
        fontWeight: 'bold',
        color: '#323232',
    }
});

export default AddItem;
