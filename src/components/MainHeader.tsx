import React, { useState, useEffect } from 'react';
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAsyncTheme} from "@/src/providers/useAsyncTheme";
import {useCustomTheme} from "@/src/providers/CustomThemeProvider";

const MainHeader = () => {
    const { asyncTheme, changeTheme } = useAsyncTheme();
    const [isHidden, setIsHidden] = useState(false);
    const { theme } = useCustomTheme();

    useEffect(() => {
        const fetchHiddenState = async () => {
            try {
                const hiddenState = await AsyncStorage.getItem('isHidden');
                if (hiddenState !== null) {
                    setIsHidden(JSON.parse(hiddenState));
                }
            } catch (error) {
                console.error('Failed to load hidden state', error);
            }
        };

        fetchHiddenState();
    }, []);

    const toggleHidden = async () => {
        try {
            const newHiddenState = !isHidden;
            setIsHidden(newHiddenState);
            await AsyncStorage.setItem('isHidden', JSON.stringify(newHiddenState));
        } catch (error) {
            console.error('Failed to save hidden state', error);
        }
    };

    return (
        <LinearGradient
            colors={theme === 'purple' ? ['#130347', '#852DA5'] : ['#BAEAAC', '#E5FEDE']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.headerContainer}
        >
            <View style={styles.headerTitleContainer}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 7.5 }}>
                    <Text style={[styles.headerTitle, theme === 'purple' ? styles.whiteText : styles.blackText]}>В кошельке</Text>
                    <Pressable onPress={toggleHidden}>
                        <Feather name="eye" size={15} color={theme === 'purple' ? 'white' : 'black'} />
                    </Pressable>
                </View>

                <View style={styles.headerProfileGroup}>
                    <Pressable style={styles.headerPitopi} onPress={() => changeTheme('purple')}>
                        <Text>Обменник</Text>
                    </Pressable>
                    <Pressable style={styles.headerPitopi} onPress={() => changeTheme('green')}>
                        <Text>Чаты</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.headerList}>
                <View style={styles.headerListItems}>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '***' : 'B : 17350 pzm'}
                    </Text>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '***' : 'P : 0.00073 pzm'}
                    </Text>
                </View>
                <View style={styles.headerListItems}>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '***' : '1 pzm = 1.00 руб'}
                    </Text>
                    <Text style={[styles.headerListItem, theme === 'purple' ? styles.whiteText : styles.blackText]}>
                        {isHidden ? '***' : 'баланс = 17350 руб'}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        borderBottomWidth: 0,
        width: '100%',
        padding: 25,
    },
    headerTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 29,
    },
    headerTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight:'bold'
    },
    headerProfileGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 15,
        alignItems: 'center',
    },
    headerPitopi: {
        color: '#262626',
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 7,
        borderRadius: 9,
    },
    headerList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 25,
    },
    headerListItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    headerListItem: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    whiteText: {
        color: 'white'
    },
    blackText: {
        color: 'black'
    },
});

export default MainHeader;
