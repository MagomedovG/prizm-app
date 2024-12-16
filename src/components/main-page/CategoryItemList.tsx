import {
        FlatList,
        Pressable,
        StyleSheet,
        Text,
        View,
        Dimensions,
        useWindowDimensions,
    } from "react-native";
import { Link } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import React from "react";
import { Image } from "expo-image";
import { IBusiness } from "@/src/types";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { height: windowHeight } = Dimensions.get("window");

type CategoryListProps = {
categoryList: IBusiness[] | null;
title?: string;
isBonus?: boolean;
isAdmin?: boolean;
buttonLink?: string;
onWalletPress?: (value:boolean) => void;
};

export default function CategoryItemList({
categoryList,
title,
isBonus,
onWalletPress,
}: CategoryListProps) {
const { theme } = useCustomTheme();
const { height, width } = useWindowDimensions();

const isSingleColumn = !!categoryList && categoryList.length <= 7;

const handleWalletPress = () => {
    onWalletPress?.(true);
};

const RenderCategoryItem = ({ item }: { item: IBusiness }) => {
    return (

    
    <Link href={`/(user)/menu/category-item/${item.id}`} asChild >
    <Pressable
        style={[
        styles.itemContainer,
        isSingleColumn
            ? { width: "100%" }
            : { width: width / 2 - 26 },
        ]}
    >
        <View style={{ position: "relative" }}>
        <Image
            source={{ uri: `${apiUrl}${item.logo}` }}
            style={[
            styles.image,
            isSingleColumn
                ? { width: "100%", height: height / 5.1 }
                : { width: width / 2 - 26, height: 110 },
            ]}
            cachePolicy="memory-disk"
        />
        <View style={styles.saleContainer}>
            <Text style={[styles.sale, theme === 'purple' ? {} : {color:'#32933C'},]}>
                {parseFloat(item.cashback_size.toString())}%
            </Text>
        </View>
        </View>
        <Text style={[styles.text,isSingleColumn
                ? { width: "100%" }
                : { width: width / 2 - 33},]} numberOfLines={2}>{item.title || "Без названия"}</Text>
    </Pressable>
    </Link>
    )
};

return (
    <View style={styles.container}>
    {isBonus && (
        <Pressable
        onPress={handleWalletPress}
        style={[
            styles.bonus,
            theme === "purple"
            ? styles.purpleBackground
            : styles.greenBackground,
        ]}
        >
        <Entypo
            name="info-with-circle"
            size={18}
            color={theme === "purple" ? "#EFEFEF" : "#363C36"}
        />
        <Text
            style={[
            styles.bonusText,
            theme === "purple" ? styles.purpleText : styles.greenText,
            ]}
        >
            Как получить и обменять vozvrat pzm
        </Text>
        </Pressable>
    )}
    <Text style={styles.title}>{title}</Text>
    {categoryList?.length ? (
        // <View style={[styles.flatlist, isSingleColumn ? { width: "100%" } : {}]}>

        //     {categoryList.map((category)=>(
        //         <RenderCategoryItem item={category}/>
        //     ))}
        // </View>
        <FlatList
            data={categoryList}
            style={[styles.flatlist, isSingleColumn && { width: "100%" }]}
            renderItem={RenderCategoryItem}
            numColumns={isSingleColumn ? 1 : 2}
            keyExtractor={(item) => `${item.id}`}
            contentContainerStyle={{ gap: 11 }}
            columnWrapperStyle={!isSingleColumn && { gap: 6 }}
            key={isSingleColumn ? 'single-column' : 'multi-column'}
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
    marginBottom: 50,
},
bonus: {
    height: 44,
    display: "flex",
    paddingLeft: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderRadius: 11,
},
greenBackground: {
    backgroundColor: "#D5F7CC",
},
purpleBackground: {
    backgroundColor: "#5C2389",
},
bonusText: {
    fontSize: 15,
    fontWeight: "600",
},
greenText: {
    color: "#363C36",
},
purpleText: {
    color: "#EFEFEF",
},
title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 30,
},
flatlist: {
    paddingTop: 15,
    // display:'flex',
    // flexDirection:'row',
    // flexWrap: 'wrap',
    // justifyContent:'space-between'
},
itemContainer: {
    backgroundColor: "white",
},
image: {
    objectFit: "contain",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#898989",
},
saleContainer: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    backgroundColor: "white",
    borderRadius: 8,
    position: "absolute",
    right: 4,
    bottom: 4,
},
sale: {
    color: "#41146D",
    fontSize: 16,
    fontWeight: "bold",
},
text: {
    marginTop: 5,
    marginLeft: 7,
    fontSize: 15,
    fontWeight: "500",
},
noDataText: {
    color: "gray",
    marginTop: windowHeight / 3,
    fontSize: 18,
    width: "100%",
    textAlign: "center",
},
});
