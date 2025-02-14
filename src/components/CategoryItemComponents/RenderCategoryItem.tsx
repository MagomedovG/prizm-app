import { IBusiness } from "@/src/types";
import { Link } from "expo-router";
import { Pressable,View,Text, useWindowDimensions, StyleSheet, TouchableOpacity } from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import { Image } from "expo-image";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";

export default function RenderCategoryItem ({ item, isSingleColumn}: { item: IBusiness,isSingleColumn:boolean }) {
    const { height, width } = useWindowDimensions();
    const { theme } = useCustomTheme();

    return (
    <Link href={`/(user)/menu/category-item/${item.id}`} asChild >
        <TouchableOpacity
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
        </TouchableOpacity>
    </Link>
    )
};
const styles = StyleSheet.create({
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
    itemContainer: {
        backgroundColor: "white",
    },
    
    text: {
        marginTop: 5,
        marginLeft: 7,
        fontSize: 15,
        fontWeight: "500",
    },
})