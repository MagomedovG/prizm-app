import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import UIButton from '@/src/components/UIButton';
import {Link, Redirect} from 'expo-router';
import {useAuth} from "@/src/providers/AuthProvider";
import {supabase} from "@/src/lib/supabase";

const index = () => {
    const {session, loading, isAdmin} = useAuth()


    if(loading){
        return <ActivityIndicator/>
    }

    if (!session){
        return <Redirect href={'/sign-in'}/>
    }

    if (!isAdmin){
        return <Redirect href={'/(user)'}/>
    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <Link href={'/(user)'} asChild>
                <UIButton text="User" />
            </Link>
            <Link href={'/(admin)'} asChild>
                <UIButton text="Admin" />
            </Link>
            <UIButton onPress={() => supabase.auth.signOut()} text="Sign out" />
        </View>
    );
};

export default index;
