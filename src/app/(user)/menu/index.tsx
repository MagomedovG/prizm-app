
import {Link, Stack} from 'expo-router';
import {View, FlatList, ActivityIndicator, Text, Pressable, ScrollView} from "react-native";
import {StyleSheet} from "react-native";
import {Colors} from '@/constants/Colors'
import React from "react";

import wallets from "@/assets/data/wallet";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
import {categories} from "@/assets/data/categories";
import MainHeader from "@/src/components/MainHeader";
export default function MenuScreen() {

    // const {data:products, error,  isLoading} = useProductList()

    // if (isLoading){
    //     return <ActivityIndicator/>
    // }
    // if (error){
    //     return <Text>Failed to fetch product</Text>
    // }
    return (
        <View style={{paddingTop: 165,flex:1}}>
            <Stack.Screen
                options={{
                    // title: 'mm',
                    headerShown:true,
                    header: () => <MainHeader />,

            }} />
            <ScrollView style={styles.container}>
                <View style={styles.walletContainer}>
                    <Text style={styles.walletTitle}>Кошельки</Text>
                    <FlatList
                        data={wallets}
                        renderItem={({item}) => <WalletItem wallet={item}/>}
                        contentContainerStyle={{gap:25}}
                        style={styles.flatlist}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <CategoryList categories={categories} title="Кэшбек у партнеров"/>
            </ScrollView>
            {/*<View>*/}
            {/*    <Text>yyy</Text>*/}
            {/*</View>*/}


        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding:16,
        height:'100%',
        // borderRadius: 20
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
    },
    walletContainer:{
        backgroundColor:'#D9D9D9',
        padding:25,
        borderRadius:17,
        marginBottom:15
        // height:'50%'
    },
    walletTitle:{
        fontSize:20,
        color:'#323232',
        fontWeight:'600',
        marginBottom:15
    },
    flatlist:{
        // display:'flex',
        // flexDirection:'row',
    }
})
