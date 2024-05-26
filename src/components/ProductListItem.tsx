import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {Product} from "@/src/types";
import {Link, useSegments} from "expo-router";

type ProductListItemProps = {
    product: Product
}
export default function ProductListItem ({product}:ProductListItemProps) {
    const segments = useSegments()
    console.log(segments)
    return (
        <Link href={`${segments[0]}/menu/${product.id}`} asChild>
            <Pressable style={styles.container}>
                <Image source={{uri: product.image}} style={styles.image} resizeMode={"contain"}/>
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>₽{product.price} за литр</Text>
            {/*<Link*/}
            {/*    href={{*/}
            {/*        pathname: "/user/[id]",*/}
            {/*        params: { id: 'bacon' }*/}
            {/*    }}>*/}
            {/*    View user*/}
            {/*</Link>*/}
            </Pressable>
        </Link>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white',
        padding:10,
        borderRadius: 20,
        maxWidth:'50%'
    },
    image:{
        width:"100%",
        aspectRatio:1,
        // borderWidth:1,
        // borderRadius:5,
        // borderColor: 'black'
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
