import React, { PropsWithChildren } from 'react';
import { View, Pressable, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Overlay } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ModalComponent = ({ isVisible, onClose, height = 300,width = deviceWidth / 1.2, children }: PropsWithChildren<{ isVisible: boolean; onClose: () => void; height: any; width?:number}>) => {
    return (
        <KeyboardAvoidingView style={{ position: 'relative' }}>
            <Overlay 
                isVisible={isVisible} 
                onBackdropPress={onClose} 
                overlayStyle={{
                    width,
                    height,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    padding: 20,
                    zIndex:9
                }}
            >
                <View>{children}</View>
                <Pressable style={[styles.closeButton, {top: -((deviceHeight - height) / 2 - 80)}]} onPress={onClose}>
                    <AntDesign name="close" size={30} color="white" />
                </Pressable>
            </Overlay>
            
        </KeyboardAvoidingView>
    );
};

export default ModalComponent;

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: -30, // Расположение крестика справа
        zIndex: 110, // Убедитесь, что крестик находится над оверлеем
    },
});
