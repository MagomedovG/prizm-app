import React, { PropsWithChildren, useMemo, useEffect,useCallback, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { BackHandler, Dimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const WINDOW_Height = Dimensions.get("window").height;

const BottomSrollableSheetModal = ({ bottomSheetRef, isModalVisible, setIsModalVisible,layoutHeight,staticHeight,backgroundColor, children }: PropsWithChildren<{ backgroundColor?:string,bottomSheetRef: any; isModalVisible: boolean;layoutHeight:number;staticHeight?:string[], setIsModalVisible: (val: boolean) => void;}>) => {
    useEffect(() => {
        const handleBackPress = () => {
            if (isModalVisible) {
                setIsModalVisible(false);
                bottomSheetRef.current?.close();
                return true;
            }
            return false;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    }, [isModalVisible]);
    const snapPoints = useMemo(() => {
            const sheetHeight = layoutHeight / WINDOW_Height * 100
            console.log(layoutHeight,sheetHeight)
            return [sheetHeight.toString()]; 
      }, [layoutHeight]);
    return (

        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={staticHeight ? staticHeight : snapPoints}
            // enablePanDownToClose
            backgroundStyle={{
                backgroundColor:backgroundColor ? '#f5f5f5' : 'inherit',
            }}
            onClose={() => {
                setIsModalVisible(false);
                bottomSheetRef.current?.close();
            }}
        >
            {
                <BottomSheetScrollView style={{ height: '100%' }} showsHorizontalScrollIndicator={false}>
                     <View style={{}}>
                        {children}
                    </View>
                </BottomSheetScrollView> 
            }
        </BottomSheet>

    );
};
export default BottomSrollableSheetModal;