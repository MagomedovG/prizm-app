import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, View, StyleSheet, Text, Dimensions, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import UIButton from "@/src/components/UIButton";
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
const LoginScreen = () => {
    const { theme } = useCustomTheme();
    const [checked, setChecked] = useState(false);
    const [isModal, setIsModal] = useState(false)
    return (
        <>
            <Stack.Screen options={{ title: '', headerShown: false }} />
            <View style={{display:'flex', justifyContent:'center', alignItems:'center', flex:1}}>
                <View style={{position:'relative',width:'100%',}}>
                    <Link href="/pin/createwallet" style={[styles.buttonContainer, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]} asChild>
                        <Pressable disabled={!checked}>
                            <Text style={[styles.text]}>Создать кошелек</Text>
                        </Pressable>
                    </Link>
                    <View style={styles.checkboxContainer}>
                        <Pressable
                            role="checkbox"
                            aria-checked={checked}
                            style={[styles.checkboxBase, checked && styles.checkboxPurpleChecked]}
                            onPress={() => setChecked(!checked)}>
                            {checked && <Ionicons name="checkmark-sharp" size={17} color="white" />}
                        </Pressable>
                        <Pressable onPress={()=>setIsModal(true)}>
                            <Text style={styles.checkboxText}>
                                я ознакомлен c {''}
                                
                                    <Text style={{color:'#41146D'}}>
                                        здесь ссылка
                                    </Text>
                            </Text>
                        </Pressable>
                    </View>
                </View>
                
            </View>
            
            <Link href="/pin/setnickname/SetWallet" style={[styles.container,{borderWidth:1,borderColor:'#7F7F7F'}]} asChild>
                <Pressable disabled={!checked}>
                    <Text style={[styles.text,{color:'#7F7F7F'}]}>У меня уже есть кошелек</Text>
                </Pressable>
            </Link>
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                // onSwipeComplete={()=>setIsModal(false)}
                // onBackdropPress={()=>setIsModal(false)}
                onBackButtonPress={()=>setIsModal(false)}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={500}
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.modal}
                backdropTransitionOutTiming={0}
                statusBarTranslucent
            >   
                <View style={styles.centeredView}>
                    <View style={styles.modalViewContainer}>
                        <Text style={styles.modalTitle}>
                            Соглашение...
                        </Text>
                    </View>
                </View>
                <UIButton text="Ознакомился" onPress={()=>setIsModal(false)}/>

            </Modal>
            
        </>
    )
}
export default LoginScreen;
const styles = StyleSheet.create({
    container: {
        marginHorizontal:42,
        padding: 15,
        width:'80%',
        alignItems: 'center',
        borderRadius: 13,
        position:'absolute',
        bottom:40,
        zIndex:9999
    },
    buttonContainer:{
        marginHorizontal:42,
        padding: 15,
        alignItems: 'center',
        borderRadius: 13,
        zIndex:9999
    },
    purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
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
        marginTop:4,
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
        position: 'absolute',
        bottom: '-100%',
        left: '12%',
    },
    checkboxText: {
        fontSize: 14,
        lineHeight: 18, // Немного больше для центрирования относительно чекбокса
        // marginLeft: 6,  // Расстояние от чекбокса до текста
        textAlignVertical: 'center', // Для текстового центрирования
    },
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
        // alignItems: 'center',
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
        paddingVertical:26,
        paddingHorizontal:21,
    },
    modalTitle:{
        fontSize:20,
        fontWeight: 'bold',
    }
});