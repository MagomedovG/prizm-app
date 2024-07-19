import {Link, Stack} from "expo-router";
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";
import React from "react";
import UIButton from "@/src/components/UIButton";
// import {supabase} from "@/src/lib/supabase";

export default function MenuStack (){
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            {/*<Stack.Screen name="index" options={{title:"Menu", headerShown: false,}}/>*/}
        </Stack>
    )
}
