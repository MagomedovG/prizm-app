import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCustomTheme } from '../providers/CustomThemeProvider';

const DismissKeyboard = ({ children }:any) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SearchInput = ({ data, onFilteredData, placeholder,isCategoryItem }:any) => {
    const [query, setQuery] = useState('');
    const { theme } = useCustomTheme();
    useEffect(() => {
        if (query) {
            const filtered = data.filter((item:any) => 
                isCategoryItem ? item?.title.toLowerCase().includes(query?.toLowerCase()) :
                item?.title.toLowerCase().startsWith(query?.toLowerCase())
                // item?.title.toLowerCase().includes(query?.toLowerCase())
        );
            onFilteredData(filtered);
        } else {
            onFilteredData(data);
        }
    }, [query, data]);

    return (
        <DismissKeyboard>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={[styles.container,{ backgroundColor:theme === 'purple' ? '#772899' : '#BAEBAD'}]}>
                    <Feather name="search" size={18} color={theme === 'purple' ? '#fff' : '#343434'} style={{marginBottom:1}}/>
                    <TextInput
                        style={[styles.input, { backgroundColor:theme === 'purple' ? '#772899' : '#BAEBAD',color:theme === 'purple' ? '#fff' : '#343434'}]}
                        placeholder={placeholder}
                        value={query}
                        onChangeText={setQuery}
                        placeholderTextColor={theme === 'purple' ? '#fff' : '#343434'}
                    />
                </View>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
};

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        // flex: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 20,
        paddingRight: 10,
        paddingLeft:15
    },
    input: {
        height: 45,
        padding: 10,
        width: '90%',
        fontSize:16
        // color: '#8C8C8C', // Добавьте это, если хотите, чтобы текст был белым
    },
});

export default SearchInput;
