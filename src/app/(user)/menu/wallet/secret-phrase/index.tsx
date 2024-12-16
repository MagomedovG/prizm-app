import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, Alert, Clipboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import UIButton from "@/src/components/UIButton";
import { useRouter } from "expo-router";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
const { width, height } = Dimensions.get("window");

export default function SecretPhrase() {
    const router = useRouter()
    const [secretPhrase, setSecretPhrase] = useState<string | null>(null);
    const { theme } = useCustomTheme();

    // Функция загрузки секретной фразы из AsyncStorage
    const loadSecretPhrase = async () => {
        try {
            // const storedPhrase = 'await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase")await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secrawait AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");await AsyncStorage.getItem("secret-phrase");et-phrase");;'
            const storedPhrase = await AsyncStorage.getItem("secret-phrase");
            if (storedPhrase) {
                setSecretPhrase(storedPhrase);
            } else {
                setSecretPhrase(null);
            }
        } catch (error) {
            console.error("Ошибка загрузки секретной фразы:", error);
        }
    };

    useEffect(() => {
        loadSecretPhrase();
    }, []);

    const copySidToClipboard = () => {
        if (secretPhrase) {
            Clipboard.setString(secretPhrase); // Копируем оригинальный текст
            Alert.alert("Парольная фраза скопирована!", "");
        } else {
            // Alert.alert("Нет парольной фразы для копирования.", "");
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title} numberOfLines={2}>
                    Парольная
                </Text>
                <Text style={[styles.title, { marginBottom: 34 }]} numberOfLines={2}>
                    фраза
                </Text>
                <Pressable onPress={copySidToClipboard} style={[styles.pressable, { marginBottom: 7 }]}>
                    <View style={[styles.textContainer, !secretPhrase && {justifyContent: "center"},theme === 'purple' ? {borderColor: '#957ABC'} : {borderColor:'#32933C'}]}>
                        {secretPhrase ? (
                            <View style={styles.secretText}>
                                <Text style={{color: "#8C8C8C",fontSize: 16,
            textAlign: "left",}}>
                                    {/* {"*".repeat(secretPhrase.length)} */}
                                    {secretPhrase}
                                </Text>
                            </View>
                        ) : (
                            <View style={[styles.secretText,{display:'flex', alignItems:'center', justifyContent:'center', width:'100%'}]}>
                                <Text style={styles.placeholder}>
                                    нет парольной фразы
                                </Text>
                            </View>
                        )}
                    </View>
                    {secretPhrase && <View style={[styles.copyButtonContainer]}>
                        <FontAwesome5 name="copy" size={15} color="gray" />
                    </View>}
                </Pressable>
                <Text style={{width:'98%'}}>
                    Приложение хранит вашу парольную фразу в памяти вашего телефона.
                    Восстановить парольную фразу невозможно, она генерируется на вашем устройстве и нигде более не сохраняется. Обязательно сохраняйте резервные копии на других носителях (записать на бумаге, сделать фото экрана).
                </Text>
                
            </View>
            <UIButton text='Закрыть' onPress={()=>{router.back()}}/>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: height / 3.9,
        paddingHorizontal: 51,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 40,
    },
    pressable: {
        position: "relative",
    },
    copyButtonContainer: {
        position: "absolute",
        right: 8,
        top: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#fff',
        padding:5,
        borderRadius:4
    },
    textContainer: {
        borderWidth: 1,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 8,
        width: width - 102,
        height: 150,
        // justifyContent: "center",
    },
    secretText: {
        width: "100%",
    },
    placeholder: {
        textAlign: "center",
        color: "#8C8C8C",
        fontSize: 17,
    },
});
