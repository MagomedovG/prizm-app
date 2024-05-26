import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {inspect} from "util";
import {Link} from "expo-router";
import {Colors} from "@/constants/Colors";
import products from "@/assets/data/products"
const product = products[1]
import {useContext} from "react";
import {useCart} from "@/src/providers/CartProvider";
import CartListItem from "@/src/components/CartListItem";

export default function CartScreen ()  {
    const { items, total } = useCart()

    return (
        <View>
            <FlatList
                data={items}
                renderItem={ ({item}) => <CartListItem cartItem={item}/> }
                contentContainerStyle={{padding:10, gap:10}}
            />
            <Text style={styles.totalText}>Сумма: {total}₽</Text>
            {/*<Text style={styles.text}>Cart items lenght: {items.length}</Text>*/}
        </View>
    );
};
const styles = StyleSheet.create({
    text:{
        color:'white'
    },
    totalText:{
        margin:20,
        fontSize:20,
        marginTop:20,
        fontWeight: "500"
    }
})
