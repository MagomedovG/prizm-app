
import {Link, router, Stack, useRouter} from 'expo-router';
import {View, FlatList, ActivityIndicator, Text, TextInput, Pressable, ScrollView} from "react-native";
import {StyleSheet} from "react-native";
import {Colors} from '@/constants/Colors'
import ProductListItem from "@/src/components/ProductListItem";
import React, {useState} from "react";
import {useProductList} from "@/src/api/products";
import UIButton from "@/src/components/UIButton";
import {adminCategories} from "@/assets/data/categories";
import {LinearGradient} from "expo-linear-gradient";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";


export default function MenuScreen() {
    const [number, setNumber] = useState()
    const [password, setPassword] = useState()
    const {theme} = useCustomTheme()


    const router = useRouter()
    // getCategories ([id])  => {
    //     router.push(`/(admin)/menu/${[id]}`)
    // }
    return (
        <ScrollView style={styles.container}>

            <FlatList
                data={adminCategories}
                renderItem={({item})=>
                    <Pressable onPress={() => router.push(`/(admin)/menu/${item.path}`)}>
                        <LinearGradient
                            colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#76CD7F', '#16651E']}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 0 }}
                            style={styles.item}
                        >
                            <Text style={styles.itemName}>{item.name}</Text>
                        </LinearGradient>
                    </Pressable>
                }

            />


            <View style={[styles.usersCount, theme === 'purple' ? {borderTopColor: '#5B1FB2'} : {borderTopColor: '#16651E'}]}>
                <Text style={styles.usersCountTitle}>Всего пользователей:</Text>
                <Text style={{fontSize:20, fontWeight:'bold'}}>124</Text>
            </View>

        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container:{
        padding:16,
        marginTop:100
    },
    usersCountTitle:{
        fontSize:20,
        fontWeight:'medium'
    },
    item:{
        paddingTop:147,
        paddingLeft:32,
        paddingBottom:15,
        marginBottom:6,
        borderRadius:16,

        // height:'30%',

    },
    itemName:{
        color:'#ffffff',
        fontSize:25
    },
    usersCount:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:23,
        paddingTop:30,
        borderTopWidth:1,
    }

})
