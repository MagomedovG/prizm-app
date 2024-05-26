
import {Link, Stack} from 'expo-router';
import {View, FlatList, ActivityIndicator, Text} from "react-native";
import {StyleSheet} from "react-native";
import {Colors} from '@/constants/Colors'
import ProductListItem from "@/src/components/ProductListItem";
import React from "react";
import {useProductList} from "@/src/api/products";


export default function MenuScreen() {
    const {data:products, error,  isLoading} = useProductList()

    if (isLoading){
        return <ActivityIndicator/>
    }
    if (error){
        return <Text>Failed to fetch product</Text>
    }
    return (
        <View>
            {/*<Stack.Screen*/}
            {/*    options={{title: 'Menu'}}*/}
            {/*/>*/}
            <FlatList
                data={products}
                renderItem={({item}) => <ProductListItem product={item}/>}
                numColumns={2}
                contentContainerStyle={{gap:10}}
                columnWrapperStyle={{gap:10}}
        />
            {/*<ProductListItem product={products[0]}/>*/}
            {/*<ProductListItem product={products[5]}/>*/}
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding:10,
        borderRadius: 20
    },
    image:{
        width:"100%",
        aspectRatio:1
    },
    title:{
        fontSize:18,
        fontWeight:'600',
        marginVertical:10
    },
    price:{
        color: Colors.light.tint
    }
})
