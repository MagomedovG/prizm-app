import {Link, Stack} from "expo-router";
import {Pressable} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";
import React from "react";

export default function MenuStack (){
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown:false, title:"Заказы"}}/>
        </Stack>
    )
}
