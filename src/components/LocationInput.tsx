import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCustomTheme } from '../providers/CustomThemeProvider';
import { useAutocomplete } from '../api/localityAutocomplete';

const DismissKeyboard = ({ children }:any) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const LocationInput = ({ data, onFilteredData, placeholder }:any) => {
    const [query, setQuery] = useState('');
    const { theme } = useCustomTheme();
    const { data: filteredCountries, isLoading, error } = useAutocomplete(query, true);
    useEffect(() => {
        if (query) {
            onFilteredData(filteredCountries);
        }
        console.log(filteredCountries)
    }, [filteredCountries]);

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                    <View style={[styles.container,Platform.OS === 'ios' ? styles.searchIosShadow : styles.searchAndroidShadow, ]}>
                        <Feather name="search" size={18} color={'rgb(195,195,195)'} style={{marginBottom:1}}/>
                        <TextInput
                            style={[styles.input, {color:'#343434'}]}
                            placeholder={placeholder}
                            value={query}
                            onChangeText={setQuery}
                            placeholderTextColor='rgb(195,195,195)'
                        />
                    </View>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        borderRadius: 10
        // flex: 1,
    },
    container: {
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // marginTop: 20,
        marginBottom:15,
        paddingVertical:2,
        borderRadius: 10,
        paddingRight: 10,
        paddingLeft:13,
        backgroundColor:'#fff'
    },
    input: {
        height: 45,
        padding: 10,
        width: '90%',
        fontSize:16,
        borderRadius: 10,
        backgroundColor:'#fff',
        // color: '#8C8C8C', // Добавьте это, если хотите, чтобы текст был белым
    },
    searchIosShadow:{
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    searchAndroidShadow: {
        borderColor:'rgba(0,0,0,0.2)',
        shadowColor: 'rgba(0,0,0,0.7)',
        shadowOffset: { width: 8, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 7,
        borderRadius: 10,
    },
});

export default LocationInput;
