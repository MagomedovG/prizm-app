import { Entypo } from "@expo/vector-icons";
import { Pressable, Text, StyleSheet } from "react-native";
import SearchInput from "../SearchInput";
import { useCustomTheme } from "@/src/providers/CustomThemeProvider";


type HeaderCategoryItemProps = {
    title:string,
    handleWalletPress:() => void;
}
export default function HeaderCategoryItem({title,handleWalletPress}:HeaderCategoryItemProps){
    const { theme } = useCustomTheme();
    console.log('HeaderCategoryItem Rerender')
        
    return (
        <>
            {/* <SearchInput data={data} onFilteredData={handleFilteredData} placeholder="Поиск" isCategoryItem/> */}

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
            <Text style={styles.title}>{title}</Text>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
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
})