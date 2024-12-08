import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function TransactionItem({num}:Number) {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Отправлено
                        <Text style={styles.dateTime}>
                            {'   '}01.01.2025 14:67
                        </Text>
                    </Text>
                </View>
                <Text style={styles.recipient}>
                    Получатель: PRIZM-FKFK-EFKF-3455
                </Text>
                <Text style={styles.comission}>
                    Комиссия сети: 0.25
                </Text>
            </View>
            <View style={styles.sumContainer}>
                <Text style={styles.sum}>
                    -50 {num}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 9,
        paddingVertical: 6,
        backgroundColor: '#F4F4F4',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 6,
    },
    title: {
        fontSize: RFValue(15, 812), // 812 — высота экрана Pixel 8 Pro
        lineHeight: RFValue(17.5, 812),
    },
    dateTime: {
        fontSize: RFValue(9, 812),
        color: '#B1AFAF',
    },
    recipient: {
        fontSize: RFValue(11, 812),
    },
    comission: {
        fontSize: RFValue(10, 812),
        color: '#B5B5B5',
        lineHeight: RFValue(12, 812),
    },
    sumContainer: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    sum: {
        fontSize: RFValue(15, 812),
        lineHeight: RFValue(19, 812),
        fontWeight: 'bold',
    },
});
