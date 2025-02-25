import {
        FlatList,
        Pressable,
        StyleSheet,
        Text,
        View,
        Dimensions,
        useWindowDimensions,
    } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import React, { useState } from "react";
import { IBusiness, IBusinessInCategory } from "@/src/types";
import { useQuery } from "@tanstack/react-query";
import SearchInput from "../SearchInput";
import * as SecureStore from 'expo-secure-store';
import HeaderCategoryItem from "./CategoryItemHeader";
import RenderCategoryItem from "./RenderCategoryItem";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { height: windowHeight } = Dimensions.get("window");

type CategoryListProps = {
    onWalletPress?: (value:boolean) => void;
    id:string | string[]
};

export default function CategoryItemList({
    id,
    onWalletPress,
}: CategoryListProps) {
    const [localityType, setLocalityType] = useState('')
    const [localityId, setLocalityId] = useState('')
    const [filteredData, setFilteredData] = useState<IBusinessInCategory | null>(null);
    const handleFilteredData = React.useCallback((data: any) => {
        setFilteredData(data);
    }, []);

    const getLocationTypeAndId = async () => {
        const localLocationId = await SecureStore.getItemAsync('locality-id')
        const localLocationType = await SecureStore.getItemAsync('locality-type')
        setLocalityId(localLocationId ? localLocationId : '')
        setLocalityType(localLocationType ? localLocationType : '')
    }
    useFocusEffect(
        React.useCallback(() => {
            getLocationTypeAndId()
        }, [])
    )
    const handleWalletPress = () => {
        onWalletPress?.(true);
    };
    const { data: categoryList, isLoading: isCategoryListLoading } = useQuery<IBusinessInCategory>({
        queryKey: ['categoryList', id, localityId, localityType],
        queryFn: async () => {
            const response = await fetch(
                `${apiUrl}/api/v1/categories/${id}/get-businesses/?locality-id=${localityId}&locality-type=${localityType}`,
            );
            const data = await response.json();
            return data;
        },
        enabled: !!localityId && !!localityType
    });
    const isSingleColumn = !!filteredData && filteredData?.length <= 7;
    const memoizedData = React.useMemo(() => categoryList?.businesses || [], [categoryList]);
    const flatListKey = React.useMemo(() => (isSingleColumn ? 'single-column' : 'multi-column'), [isSingleColumn]);

    
    
    
return (
    <View style={styles.container}>
        <SearchInput data={memoizedData} onFilteredData={handleFilteredData} placeholder="Поиск" isCategoryItem/>

        {categoryList?.businesses?.length ? (
            <FlatList
                data={filteredData}
                style={[styles.flatlist, isSingleColumn && { width: "100%" }]}
                renderItem={({item})=> <RenderCategoryItem item={item} isSingleColumn={isSingleColumn}/>}
                numColumns={isSingleColumn ? 1 : 2}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={{ gap: 11,paddingBottom: 120 }}
                columnWrapperStyle={!isSingleColumn && { gap: 6 }}
                key={flatListKey}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={()=>(
                    <HeaderCategoryItem  title={categoryList?.category?.title} handleWalletPress={handleWalletPress}/>
                )}
            />
        ) : (
            <Text style={styles.noDataText}>
                Нет подходящих бизнесов
            </Text>
        )}
    </View>
);
}

const styles = StyleSheet.create({
container: {
    width: "100%",
    // paddingBottom: 150,
},


flatlist: {
    paddingTop: 15,
    // paddingBottom: 150,
},

noDataText: {
    color: "gray",
    marginTop: windowHeight / 3,
    fontSize: 18,
    width: "100%",
    textAlign: "center",
},
});
