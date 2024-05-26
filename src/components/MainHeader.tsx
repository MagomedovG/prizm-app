import React from 'react';
import {Pressable, Text, View, StyleSheet} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
const MainHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTitleContainer}>
                {/*<View>*/}
                <Text style={styles.headerTitle}>В кошельке</Text>
                {/*</View>*/}
                <View style={styles.headerProfileGroup}>
                    <Pressable style={styles.headerPitopi}>
                        <Text>P2P</Text>
                    </Pressable>

                    <View><MaterialCommunityIcons name="account" size={24} color="white" /></View>
                </View>
            </View>
            <View style={styles.headerList}>
                <View style={styles.headerListItems}>
                    <Text style={styles.headerListItem}>B - 17350 pzm</Text>
                    <Text style={styles.headerListItem}>P - 0.00073 pzm</Text>
                </View>
                <View style={styles.headerListItems}>
                    <Text style={styles.headerListItem}>1 pzm = 1.00 руб</Text>
                    <Text style={styles.headerListItem}>баланс: 17350 руб</Text>
                </View>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        backgroundColor: '#6B6B6B',
        padding: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    headerTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 29
    },
    headerTitle: {
        fontSize: 29,
        color: 'white',
    },
    headerProfileGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 15,
        alignItems: 'center'
    },
    headerPitopi: {
        color: '#262626',
        backgroundColor: "white",
        paddingHorizontal: 28,
        paddingVertical: 7,
        borderRadius: 9
    },
    headerIcon: {},
    headerList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 16
    },
    headerListItems: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    headerListItem: {
        color: 'white'
    },
});


// const styles = StyleSheet.create({
//     headerContainer:{
//         width:'100%',
//         backgroundColor:'#6B6B6B',
//         padding:25,
//         borderBottomLeftRadius:25,
//         borderBottomRightRadius:25
//     },
//     headerTitleContainer:{
//         display:'flex',
//         flexDirection:'row',
//         justifyContent:"space-between",
//         marginTop:29
//
//     },
//     headerTitle:{
//         fontSize:29,
//         color:'white',
//     },
//     headerProfileGroup:{
//         display:'flex',
//         flexDirection:'row',
//         justifyContent:"space-between",
//         gap:15,
//         alignItems:'center'
//     },
//     headerPitopi:{
//         color:'#262626',
//         backgroundColor:"white",
//         paddingHorizontal:28,
//         paddingVertical:7,
//         borderRadius:9
//     },
//     headerIcon:{},
//     headerList:{
//         display:'flex',
//         flexDirection:'row',
//         justifyContent:"space-between",
//         marginTop:16
//     },
//     headerListItems:{
//         display:'flex',
//         flexDirection:'column',
//         justifyContent:"space-between",
//     },
//     headerListItem:{
//         color:'white'
//     },
// })

export default MainHeader;
