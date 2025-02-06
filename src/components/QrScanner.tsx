import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, Camera } from "expo-camera"; // добавляем Camera
import { useState, useEffect } from "react";
import { Pressable, View, StyleSheet, StatusBar, Platform, Text, Button } from "react-native";

const statusBarHeight = StatusBar.currentHeight || 0;

type QrScannerProps = {
    setIsScanner: (val: boolean) => void;
    handleAfterScanned:(data:any) => void;
};

export default function QrScanner({ setIsScanner, handleAfterScanned }: QrScannerProps) {
    const [flashStatus, setFlashStatus] = useState<boolean>(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    // Запрос разрешения на камеру
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    if (!hasPermission) {
        return (
            <View style={styles.permissioncontainer}>
                <Text style={styles.message}>Для использования каммеры необходимо предоставить доступ к ней</Text>
                <Button 
                    onPress={async () => {
                        const { status } = await Camera.requestCameraPermissionsAsync();
                        setHasPermission(status === "granted");
                    }} 
                    title="Предоставить доступ" 
                />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: "center" }}> 
            <View style={styles.fullscreenSlide}>
                <CameraView
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={handleAfterScanned}
                    style={styles.Scanner}
                    enableTorch={flashStatus}
                    facing="back"
                    zoom={0}
                />
                <Pressable 
                    onPress={() => setFlashStatus(!flashStatus)} 
                    style={Platform.OS === "ios" ? styles.flashButtonIos : styles.flashButtonAndroid}
                >
                    <View style={[flashStatus ? { backgroundColor: "#fff" } : { backgroundColor: "#000", opacity: 0.7 }, { padding: 12, borderRadius: 50 }]}>
                        <MaterialCommunityIcons name="flashlight" size={24} color={flashStatus ? "black" : "white"} /> 
                    </View>
                </Pressable>
                <Pressable 
                    style={Platform.OS === "ios" ? styles.closeButtonIos : styles.closeButtonAndroid} 
                    onPress={() => {
                        setIsScanner(false);
                        setFlashStatus(false);
                    }}
                >
                    <AntDesign name="close" size={22} color="white" style={styles.xIcon}/>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flashButtonAndroid: {
        position: "absolute",
        bottom: statusBarHeight + 10,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11111,
    },
    flashButtonIos: {
        position: "absolute",
        bottom: statusBarHeight + 50,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11111,
    },
    closeButtonAndroid: {
        position: "absolute",
        top: statusBarHeight + 10,
        right: 20,
        zIndex: 11111,
    },
    closeButtonIos: {
        position: "absolute",
        top: statusBarHeight + 50,
        right: 20,
        zIndex: 11111,
    },
    xIcon: {
        color: "grey",
        padding: 4,
        backgroundColor: "white",
        borderRadius: 50,
    },
    Scanner: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    fullscreenSlide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    permissioncontainer: {
        flex: 1,
        justifyContent: "center",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
});
