import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import React, { useState } from 'react';
import UIButton from '@/src/components/UIButton';
import {Colors} from '../../constants/Colors';
import {Link, Redirect, Stack, useRouter} from 'expo-router';
import {borderColor} from "@/assets/data/colors";
// import {supabase} from "@/src/lib/supabase";

const SignInScreen = () => {
    const [prizm, setPrizm] = useState<string>('');
    // const [password, setPassword] = useState<string>('');
    const [loading, setloading] = useState<boolean>(false)
    const router = useRouter()
    async function signInWithEmail () {
        console.log(prizm);
        if (prizm === '1'){
            router.push('/(user)/')
        }
        // console.warn('dd')
        // setloading(true)
        // const { error } = await supabase.auth.signInWithPassword({
        //     email, password
        // })
        // if (error){
        //     Alert.alert(error.message)
        // }
        // setloading(false)
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Sign in', headerShown:false }} />

            <Text style={styles.label}>Вставьте адрес кошелька</Text>
            <TextInput
                value={prizm}
                onChangeText={setPrizm}
                placeholder="PRIZM-1234567890"
                style={styles.input}
            />
            {/*<View  style={styles.textButton}>*/}
                <UIButton text={loading ? "Входим в систему" : "Ок"} onPress={signInWithEmail} disabled={loading}/>
            {/*</View>*/}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
        position:"relative"
    },
    label: {
        color: '#262626',
        fontSize:35,
        textAlign:"center",
        marginBottom: 44,
        borderColor: borderColor
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 25,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#EFEFEF',
        borderRadius: 5,
        color:'#707070',
        marginHorizontal:42

    },
    textButton: {
        // position:'absolute',
        // bottom:40,
        // width:'100%',

    },
});

export default SignInScreen;
