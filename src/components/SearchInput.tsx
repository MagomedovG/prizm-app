import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

const SearchInput = ({ data, onFilteredData, placeholder }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (query) {
            const filtered = data.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View style={styles.container}>
                    <Feather name="search" size={18} color="gray" />
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={query}
                        onChangeText={setQuery}
                        placeholderTextColor='#8C8C8C'
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
        borderRadius: 50,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor:'#DCDCDC',
        backgroundColor: 'white',
    },
    input: {
        height: 40,
        padding: 12,
        width: '90%',
        color: '#8C8C8C', // Добавьте это, если хотите, чтобы текст был белым
    },
});

export default SearchInput;
