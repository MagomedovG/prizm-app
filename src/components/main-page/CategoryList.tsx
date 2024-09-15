import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions, ScrollView, Keyboard, Platform, KeyboardAvoidingView} from "react-native";
import {Colors} from "@/constants/Colors";
import {ICategory} from "@/src/types";
import {Link, useRouter, useSegments} from "expo-router";
import wallet from "@/assets/data/wallet";
import SearchInput from "@/src/components/SearchInput";
import React, {useEffect, useState} from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 20; // Оставляем немного пространства для отступов
const ITEM_HEIGHT = height / 2 -30
// import { Keyboard, Platform, KeyboardAvoidingView } from 'react-native';

type CategoryListProps = {
    title?:string,
    categories: ICategory[] | any,
    isInput?:boolean,
    isAdminFond?:boolean,
    linkButton?:string,
}
export default function CategoryList ({categories, title, isInput, isAdminFond, linkButton}:CategoryListProps) {
    const segments = useSegments();
    console.log(segments);
    const router = useRouter()
    const [filteredData, setFilteredData] = useState<any>([]);
    const {theme} = useCustomTheme()
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        const containerStyle = {
            ...styles.container,
            marginBottom: keyboardHeight ? ITEM_HEIGHT + keyboardHeight : ITEM_HEIGHT,
        };

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        setFilteredData(categories); // Обновление данных при изменении пропсов
    }, [categories]);
    const handleFilteredData = (data:[]) => {
        setFilteredData(data);
    };
    const handleAdminPage = () => {
        router.push(`${linkButton}`)
    }
    return (
        <KeyboardAvoidingView
            // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { marginBottom: keyboardHeight ? keyboardHeight + ITEM_HEIGHT : ITEM_HEIGHT }]}
        >
            {/* <View > */}
                {isInput && <SearchInput data={categories} onFilteredData={handleFilteredData} placeholder="Поиск"/>}
                {/*<Text style={styles.title}>{title}</Text>*/}
                <View style={styles.titleButton}>
                    <Text style={[styles.title, !isAdminFond ? {marginBottom: 15} : {marginBottom: 0}]}>{title}</Text>
                    {isAdminFond && (<Pressable onPress={handleAdminPage}
                                            style={[styles.button, theme === 'purple' ? {backgroundColor: '#5B1FB2'} : {backgroundColor: '#32933C'}, {borderColor: '#41146D'}]}>
                        <Text style={{color: 'white', textAlign: 'center'}}>
                            Добавить
                        </Text>
                    </Pressable>)}
                </View>

                <FlatList
                    data={filteredData}
                    // style={styles.flatlist}
                    renderItem={({item}) =>
                        <Link
                            href={!isAdminFond ? `${segments[0]}/menu/category/${item.id}` : `(admin)/menu/fonds/edit-fond/${item.id}`}
                            asChild
                            // style={{width:'100%'}}
                        >
                            <Pressable style={styles.itemContainer}>

                                <View style={{width:'100%',display:'flex', flexDirection:'row',alignItems:"center", justifyContent:'space-between', padding:16}}>
                                    <Text style={styles.text}>{item.title}</Text>
                                    <Image style={styles.image_logo} source={{uri: item?.logo}}/>
                                    {/* <Ionicons name="cafe-sharp" size={24} color="black" /> */}
                                    {/*<Image source={{uri: item.image}} style={styles.image} resizeMode={"contain"}/>*/}

                                </View>

                            </Pressable>
                        </Link>
                    }
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{gap:10}}
                    horizontal={false}

                />
            {/* </View> */}
        </KeyboardAvoidingView>
        
    );
}

const styles = StyleSheet.create({
    flatlist:{
        flexDirection:'column',
        width: '100%',
    },
    container: {
        width: '100%',
        flex:1,
        overflow:'scroll',
        // marginBottom:ITEM_HEIGHT,
        // marginBottom: keyboardHeight ? ITEM_HEIGHT + keyboardHeight : ITEM_HEIGHT,
    },
    itemContainer: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'white',
        height:80,
        borderRadius:13,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.1)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    image: {
        objectFit:'cover',
        height: '100%',
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16
    },
    text:{
        fontSize:16,
        fontWeight:'medium'
    },
    purpleBackground:{
        backgroundColor:'#5C2389'
    },
    titleButton:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    button:{
        borderRadius:33,
        borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:20
    },
    image_logo:{
        width:32,
        aspectRatio:1
    }
});


