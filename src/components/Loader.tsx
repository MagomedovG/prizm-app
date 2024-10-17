import React from 'react';
import { View, StyleSheet,Image } from "react-native";




const Loader = () => {
    

    return (
            <View style={styles.container}>
                <Image source={require('../../assets/images/loader.png')}style={styles.image}/>
            </View>
    );
};

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
    },
    image:{
        width:'100%',
        height:'100%',
    }
});

export default Loader;
