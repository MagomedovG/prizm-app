
import {Link, Stack} from 'expo-router';
import {View, FlatList, ActivityIndicator, Text, Pressable, ScrollView} from "react-native";
import {StyleSheet} from "react-native";
import {Colors} from '@/constants/Colors'
import React, {useEffect} from "react";

import wallets from "@/assets/data/wallet";
import WalletItem from "@/src/components/main-page/WalletItem";
import CategoryList from "@/src/components/main-page/CategoryList";
import {categories} from "@/assets/data/categories";
import MainHeader from "@/src/components/MainHeader";
import {LinearGradient} from "expo-linear-gradient";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function MenuScreen() {
    const { theme } = useCustomTheme();
    // useEffect(()=>{
        // const getName = async () => {
        //     const userName = await AsyncStorage.getItem('userName')
        //     const walletName = await AsyncStorage.getItem('walletAddress')
        //     console.log(userName, walletName)
        // }
        // getName()
    // }
    //     , [theme])

    return (
        <View>
            <Stack.Screen
                options={{
                    // title: 'mm',
                    headerShown:true,
                    header: () => <MainHeader />,

            }} />
            <View>

            </View>
            {/*<LinearGradient*/}
            {/*    colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}*/}
            {/*    start={{ x: 1, y: 0 }}*/}
            {/*    end={{ x: 0, y: 0 }}*/}
            {/*>*/}
            {/*    <MainHeader/>*/}
            {/**/}
            {/*</LinearGradient>*/}
            <View>
                <LinearGradient
                    colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.walletContainer}
                >
                    <Text style={[styles.walletTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>Кошельки</Text>
                    <FlatList
                        data={wallets}
                        renderItem={({ item }) => <WalletItem wallet={item} />}
                        contentContainerStyle={{ gap: 8 }}
                        style={styles.flatlist}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}

                    />
                </LinearGradient>

                <ScrollView style={styles.container}>
                    <CategoryList categories={categories} title="Кэшбек у партнеров" isInput={true}/>
                </ScrollView>
            </View>



        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        paddingHorizontal:16,
        // flex: 1,
        // display:'flex',
        // flexDirection:'column',
        // alignSelf: 'center',
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
        paddingHorizontal:25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        // marginBottom:15,
        // paddingTop:163
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
        // flex:1
    },
    whiteText:{
        color:'white'
    },
    blackText:{
        color:'black'
    },
})
