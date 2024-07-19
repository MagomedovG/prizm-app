import {Link, Stack} from "expo-router";
import {Pressable, View, Text} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";
import React from "react";
import { SimpleLineIcons } from '@expo/vector-icons';
import HeaderLink from "@/src/components/HeaderLink";

export default function MenuStack (){
    return (
        <Stack
            screenOptions={{

            }}
        >
            <Stack.Screen name="index" options={{
                title:"",
                header: () => (
                    <HeaderLink title="Главная" link={`/(user)/menu/`} emptyBackGround={false} />
                ),
                headerRight: () => (
                    <Link href="/(admin)/create" asChild>
                        <Pressable>
                            {({pressed}) => (
                                <View style={{
                                    display:'flex',
                                    flexDirection:'row',
                                    gap:13,
                                    alignItems:'center'

                                }}
                                >
                                    <SimpleLineIcons name="logout" size={24} color="black" />
                                    <Text>Выйти</Text>
                                </View>

                            )}
                        </Pressable>
                    </Link>
                )
            }}/>

        </Stack>
    )
}
