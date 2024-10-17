import {Stack} from "expo-router";
import React from "react";

export default function MenuStack (){
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    )
}
