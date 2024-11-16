import {FlatList, Image, Pressable, StyleSheet, Text, View, Dimensions, Keyboard, KeyboardAvoidingView, Platform, ActivityIndicator} from "react-native";
import {ICategory} from "@/src/types";
import {Link, useRouter, useSegments} from "expo-router";
import SearchInput from "@/src/components/SearchInput";
import React, {useEffect, useState} from "react";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";
import CachedImage from "expo-cached-image";
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 20; // Оставляем немного пространства для отступов
const ITEM_HEIGHT = height / 2 -30

type CategoryListProps = {
    title?:string,
    categories: ICategory[] | any,
    isInput?:boolean,
    isAdminFond?:boolean,
    linkButton?:string,
    showModal?: () => void,
}
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function CategoryList ({categories, title, isInput, isAdminFond, linkButton, showModal}:CategoryListProps) {
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
            style={[styles.container, { marginBottom: keyboardHeight ? keyboardHeight + ITEM_HEIGHT : ITEM_HEIGHT + (Platform.OS === 'ios' ? 0 : 35) }]}
            // style={styles.container}
                // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} 
        >
                
                {isInput && 
                    <View style={{marginHorizontal:10}}>
                        <SearchInput data={categories} onFilteredData={handleFilteredData} placeholder="Поиск"/>
                    </View>
                    
                }
                <Pressable style={styles.locationContainer} onPress={showModal}>
                    <Text style={styles.locationTitle}>
                        Махачкала
                    </Text>
                </Pressable>
                <View style={styles.titleButton}>
                    <Text style={[styles.title, {marginBottom: 5}]}>{title}</Text>
                    
                </View>

                {filteredData?.length ? <FlatList
                    data={filteredData}
                    renderItem={({item}) =>
                        <Link
                            href={`${segments[0]}/menu/category/${item.id}`}
                            asChild
                        >
                            <Pressable style={Platform.OS === 'ios' ? styles.itemIosContainer : styles.itemAndroidContainer}>

                                <View style={{width:'100%',display:'flex', flexDirection:'row',alignItems:"center", justifyContent:'space-between', padding:16}}>
                                    <Text style={styles.text}>{item.title}</Text>
                                    <CachedImage 
                                        style={styles.image_logo} 
                                        source={{uri: `${apiUrl}${item?.logo}`}}
                                        cacheKey={`${item.id}-category-logo`} 
                                        placeholderContent={( 
                                            <ActivityIndicator 
                                                size="small"
                                            />
                                        )} 
                                    />
                                </View>

                            </Pressable>
                        </Link>
                    }
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={false}

                /> : 
                        <Text style={{color:'gray', marginTop:ITEM_HEIGHT / 4, fontSize:18, width:'100%', textAlign:'center'}}>
                            Нет подходящих категорий
                        </Text>
                         
                    }
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
    },
    itemIosContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'white',
        height:80,
        borderRadius:13,
        marginTop:5,
        marginBottom:5,
        marginHorizontal:10,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    itemAndroidContainer: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: 'white',
        height:80,
        borderRadius:13,
        marginTop:5,
        marginBottom:5,
        marginHorizontal:10,
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        shadowColor: 'rgba(0,0,0,0.7)',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 3,
    },
    image: {
        objectFit:'cover',
        height: '100%',
        borderRadius: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
        marginLeft:10
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
    },
    locationContainer:{
        marginLeft:10
    },
    locationTitle:{
        color:'rgba(160, 158, 158, 1)'
    }
});


