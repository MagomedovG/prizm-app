import React from 'react';
import {Text, View, Image, StyleSheet, Pressable} from "react-native";
import {Link, Stack, useLocalSearchParams, useRouter} from "expo-router";
import products from "@/assets/data/products";
import {useState} from "react";
import UIButton from "@/src/components/UIButton";
import {useCart} from "@/src/providers/CartProvider";
import {PizzaSize} from "@/src/types";
import {FontAwesome} from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";

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
        router.push('/cart')
        // console.warn('Adding to cart', selectedSize)
    }

    if (!product){
        return <Text>Product Not Found</Text>
    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title:"Menu",
                headerRight: () => (
                    <Link href={`/(admin)/create?id=${id}`} asChild>
                        <Pressable>
                            {({pressed}) => (
                                <FontAwesome
                                    name="pencil"
                                    size={25}
                                    color={Colors.light.tint}
                                    style={{marginRight:15, opacity: pressed ? 0.5 : 1}}
                                />
                            )}
                        </Pressable>
                    </Link>
                )
            }}/>
            <Stack.Screen
                options={{title: product?.name}}
            />
            <Image
                source={{uri:product.image}}
                style={styles.image}

            />

            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>₽{product.price} за литр</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        padding:10
    },
    image:{
        width:'100%',
        aspectRatio:1
    },
    price:{
        fontSize:18,
        fontWeight:'bold',
        marginTop:5
    },
    title:{
        fontSize:22,
        fontWeight:'bold',
        marginTop:20
    }
})
export default Product;
