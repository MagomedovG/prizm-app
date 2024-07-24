import React from 'react';
import {Stack} from "expo-router";
import HeaderLink from "@/src/components/HeaderLink";
import SearchInput from "@/src/components/SearchInput";
import CategoryItemList from "@/src/components/main-page/CategoryItemList";
import {Dimensions, ScrollView, StyleSheet} from "react-native";
import {adminFonds} from "@/assets/data/categories";
import CategoryList from "@/src/components/main-page/CategoryList";
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
const FondAdminPage = () => {

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{
                headerShown:false,
                header: () => <HeaderLink title="Главная" link="/"/>,
            }}/>
            {/*<Text style={styles.title}>{category.name}</Text>*/}

            {/*<SearchInput data={category.items} onFilteredData={handleFilteredData} placeholder="Найти супермаркет"/>*/}
            <CategoryList categories={adminFonds} title='Фонды' linkButton={'/menu/fonds/add-fond/'} isAdminFond={true}/>
        </ScrollView>
    );
};

export default FondAdminPage;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display:'flex',
        flexDirection:'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        marginTop: 69,
        marginBottom:50,
        alignSelf: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10
    }
})
