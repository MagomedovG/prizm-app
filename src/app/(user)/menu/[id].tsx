import React from 'react';
import {Text, View, Image, StyleSheet, Pressable} from "react-native";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import products from "@/assets/data/products";
import {useState} from "react";
import UIButton from "@/src/components/UIButton";
import {useCart} from "@/src/providers/CartProvider";
import {PizzaSize} from "@/src/types";

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL']
const Product = () => {
    const router = useRouter()

    const {addItem} = useCart()

    const { id } = useLocalSearchParams()

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M')

    const product = products.find(p => p.id.toString() === id)

    const addToCart = () => {
        if (!product) {
            return
        }
        addItem(product, selectedSize)
        router.push('/(user)/cart')
        // console.warn('Adding to cart', selectedSize)
    }

    if (!product){
        return <Text>Product Not Found</Text>
    }
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{title: product?.name}}
            />
            <Image
                source={{uri:product.image}}
                style={styles.image}

            />
            <Text style={styles.chooseSze}>Выберите размер</Text>
            <View style={styles.sizes}>
                {sizes.map(size =>
                    <Pressable
                        onPress={()=>{setSelectedSize(size)}}
                        style={[
                            styles.size, {backgroundColor: selectedSize === size ? 'gainsboro' : 'white'}
                        ]}
                        key={size}>
                        <Text style={[styles.sizeText, {color: selectedSize === size ? 'black' : 'gray'}]}>{size}</Text>
                    </Pressable>

                )}
            </View>

            <Text style={styles.price}>₽{product.price} за литр</Text>
            <UIButton onPress={addToCart} text='Add to cart'/>
        </View>
    );
};
const styles = StyleSheet.create({
    chooseSze:{
        marginVertical:10,
        fontSize:15
    },
    container:{
        backgroundColor:'white',
        flex:1,
        padding:10
    },
    sizes:{
        flexDirection:"row",
        justifyContent:"space-around",
        marginVertical:10
    },
    size:{
        backgroundColor:'gainsboro',
        width:50,
        aspectRatio:1,
        borderRadius:25,
        alignItems:"center",
        justifyContent:'center'
    },
    sizeText:{
        fontSize:20,
        fontWeight: '500'
    },
    image:{
        width:'100%',
        aspectRatio:1
    },
    price:{
        fontSize:18,
        fontWeight:'bold',
        marginTop:'auto'
    }
})
export default Product;
