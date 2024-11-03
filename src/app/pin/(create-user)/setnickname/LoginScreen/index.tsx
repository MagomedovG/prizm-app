import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { Link, Stack } from "expo-router";
import { Pressable, View, StyleSheet, Text } from "react-native";

const LoginScreen = () => {
    const { theme } = useCustomTheme();
    return (
        <>
            <Stack.Screen options={{ title: '', headerShown: false }} />
            <View style={{display:'flex', justifyContent:'center', alignItems:'center', flex:1}}>
                <Link href="/pin/createwallet" style={[styles.buttonContainer, theme === 'purple' ? styles.purpleBackground : styles.greenBackground]} asChild>
                    <Pressable>
                        <Text style={[styles.text]}>Создать кошелек</Text>
                    </Pressable>
                </Link>
                
            </View>
            <Link href="/pin/setnickname/SetWallet" style={[styles.container,{borderWidth:1,borderColor:'#7F7F7F'}]} asChild>
                <Pressable>
                    <Text style={[styles.text,{color:'#7F7F7F'}]}>У меня уже есть кошелек</Text>
                </Pressable>
            </Link>
            
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
        width:'80%',
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
});