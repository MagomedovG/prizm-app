import React, { PropsWithChildren } from 'react';
import { View, Pressable, Dimensions, StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ModalComponent = ({ isVisible, onClose, height,width, children }: PropsWithChildren<{ isVisible: boolean; onClose: () => void; height: any; width?:number}>) => {
    return (
        <View style={{ position: 'relative' }}>
            <Overlay 
                isVisible={isVisible} 
                onBackdropPress={onClose} 
                overlayStyle={{
                    width: width ? width : deviceWidth / 1.2,
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
            
        </View>
    );
};

export default ModalComponent;

const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        // top: -40, // Расположение крестика сверху
        right: -10, // Расположение крестика справа
        zIndex: 110, // Убедитесь, что крестик находится над оверлеем
    },
});
