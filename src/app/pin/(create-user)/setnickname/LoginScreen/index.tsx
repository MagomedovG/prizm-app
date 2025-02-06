import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View, StyleSheet, Text, Dimensions, StatusBar, Platform } from "react-native";
import Modal from "react-native-modal";
import UIButton from "@/src/components/UIButton";
const {width, height} = Dimensions.get("window");
const deviceWidth = width
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
const LoginScreen = () => {
    const { theme } = useCustomTheme();
    const [isModal, setIsModal] = useState(false)
    const router = useRouter()
    const routerBack = () => {
        router.push("/pin/setnickname/SetWallet")
    }
    return (
        <>
            <Stack.Screen options={{ title: '', headerShown: false }} />
            <View style={{display:'flex', justifyContent:'center', alignItems:'center', flex:1}}>
                <View style={{position:'relative',width:'100%',}}>
                    <Link href="/pin/createwallet" style={[styles.buttonContainer, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]} asChild>
                        <Pressable>
                            <Text style={[styles.text]}>Создать кошелек</Text>
                        </Pressable>
                    </Link>
                </View>
                
            </View>
            
                <Pressable onPress={routerBack} style={[styles.container,{borderWidth:1,borderColor:'#7F7F7F'}]}>
                    <Text style={[styles.text,{color:'#7F7F7F'}]}>У меня уже есть кошелек</Text>
                </Pressable>
            <Modal
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInUp'}
                isVisible={isModal}
                onBackButtonPress={()=>setIsModal(false)}
                animationInTiming={200}
                animationOut='slideOutDown'
                animationOutTiming={300} // Уменьшите время анимации
                backdropTransitionOutTiming={50} 
                backdropColor='black'
                hardwareAccelerated
                swipeDirection={'down'}
                style={styles.modal}
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