import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Pressable,
    Alert,
    TextInput,
    Keyboard,
    Clipboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import UIButton from "@/src/components/UIButton";
import { useRouter } from "expo-router";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";

const { width, height } = Dimensions.get("window");

export default function SecretPhrase() {
    const router = useRouter();
    const [secretPhrase, setSecretPhrase] = useState<string | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [newPhrase, setNewPhrase] = useState("");
    const { theme } = useCustomTheme();
    const inputRef = useRef<TextInput>(null);

    const loadSecretPhrase = async () => {
        try {
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

    const saveSecretPhrase = async () => {
        try {
            await AsyncStorage.setItem("secret-phrase", newPhrase);
            setSecretPhrase(newPhrase);
            setNewPhrase("");
            setIsEditable(false);
            Alert.alert("Парольная фраза сохранена!");
        } catch (error) {
            console.error("Ошибка сохранения секретной фразы:", error);
        }
    };

    useEffect(() => {
        loadSecretPhrase();
    }, []);

    useEffect(() => {
        if (isEditable) {
            inputRef.current?.focus();
        }
    }, [isEditable]);

    const copySidToClipboard = () => {
        if (secretPhrase) {
            Clipboard.setString(secretPhrase);
            Alert.alert("Парольная фраза скопирована!", "");
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
                <Pressable style={[styles.pressable]}>
                    <View
                        style={[
                            styles.textContainer,
                            !secretPhrase && !isEditable && { justifyContent: "center" },
                            theme === 'purple' ? { borderColor: '#957ABC' } : { borderColor: '#32933C' },
                            !!isEditable && {marginBottom:15}
                        ]}
                    >
                        {isEditable ? (
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                value={newPhrase}
                                onChangeText={setNewPhrase}
                                placeholder="Введите новую фразу"
                                placeholderTextColor="#8C8C8C"
                                multiline
                            />
                        ) : secretPhrase ? (
                            <View style={styles.secretText}>
                                <Text
                                    style={{
                                        color: "#8C8C8C",
                                        fontSize: 16,
                                        textAlign: "left",
                                        lineHeight:17
                                    }}
                                >
                                    {secretPhrase}
                                </Text>
                                
                            </View>
                        ) : (
                            <Pressable style={[styles.secretText, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}]} onPress={() => {
                                    setIsEditable(true);
                                    setNewPhrase(secretPhrase || "");
                                }}
                            >
                                <Text style={styles.placeholder}>
                                    нет парольной фразы
                                </Text>
                                    <Text style={{color:'#909090', opacity:0.6, fontSize:12}}>
                                        нажмите чтобы ввести ее
                                    </Text>
                            </Pressable>
                        )}
                        
                    </View>
                    {secretPhrase && !isEditable && (
                        <View style={styles.copyButtonContainer}>
                            <FontAwesome5 name="copy" size={15} color="gray" onPress={copySidToClipboard} />
                        </View>
                    )}
                    {
                            !isEditable && secretPhrase && (
                                <View style={{
                                    display:'flex',
                                    justifyContent:'flex-start',
                                    // width:containerWidth + 34, 
                                    marginBottom:10
                                }}>
                                        <Pressable onPress={()=>{
                                                setNewPhrase(secretPhrase)
                                                setIsEditable(true)
                                            }} style={{paddingTop:2, paddingLeft:8, paddingBottom:8, display:'flex',flexDirection:'row',gap:4, alignItems:'center'}}>
                                            <Text style={{color:'#957ABC', fontSize:13,paddingBottom:3}}>редактировать</Text>
                                            <FontAwesome5 name="pencil-alt" size={9} color="#957ABC" />
                                        </Pressable>
                                    </View>
                                // <Pressable onPress={()=>{
                                //     setNewPhrase(secretPhrase)
                                //     setIsEditable(true)
                                // }}>
                                //     <Text style={{color:'#808080',paddingHorizontal:8, paddingTop:2, paddingBottom:8}}>
                                //         изменить
                                //     </Text>
                                // </Pressable>
                            )
                        }
                </Pressable>

                <Text style={styles.pressable}>
                    Уважаемый пользователь, приложение хранит вашу парольную фразу в памяти вашего телефона. Восстановить парольную фразу невозможно, она генерируется на вашем устройстве и нигде более не сохраняется. Обязательно сохраняйте резервные копии на других носителях (записать на бумаге, сделать фото экрана). Парольную фразу нельзя показывать никому, так как это даст возможность украсть ваши средства PZM.
                </Text>
            </View>
            <UIButton text={isEditable ? 'Сохранить' : 'Закрыть'} onPress={isEditable ? saveSecretPhrase : () => { router.back(); }} />
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
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 40,
    },
    pressable: {
        position: "relative",
        marginHorizontal: 42,
        width: '80%'
    },
    copyButtonContainer: {
        position: "absolute",
        right: 4,
        top: 4,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: 'rgba(255, 255, 255,1)',
        padding: 5,
        borderRadius: 4,
        opacity: 0.8
    },
    textContainer: {
        borderWidth: 1,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 8,
        paddingRight:24,
        minHeight: 118,
        maxHeight:250
    },
    secretText: {
        width: "100%",
    },
    placeholder: {
        textAlign: "center",
        color: "#8C8C8C",
        fontSize: 17,
    },
    input: {
        width: "100%",
        fontSize: 16,
        color: "#000",
        lineHeight:17
    },
    infoText: {
        marginTop: 20,
        marginHorizontal: 20,
        fontSize: 14,
        color: "#555",
        textAlign: "center",
    }
});
