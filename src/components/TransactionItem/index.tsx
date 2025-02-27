import { View, Text, StyleSheet, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
type TransactionType = "received" | "para" | "sent";
type TransactionItem = {
    item:{
        sender:string,
        recipient:string,
        amount:number,
        fee:number,
        datetime:string,
        type:TransactionType,
    }
}
export default function TransactionItem({item}:TransactionItem) {
    const transactionType = {
        received:{
            color:'#2C9E6E',
            title:'Получено'
        },
        para:{
            color:'#41146D',
            title:'Парамайнинг'
        },
        sent:{
            color:'#F84646',
            title:'Отправлено'
        },
    }
    const typeData = transactionType[item?.type]; 
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title,  { color: typeData?.color }]}>
                        {typeData?.title}
                        <Text style={styles.dateTime}>
                            {'   ' + item?.datetime}
                        </Text>
                    </Text>
                </View>
                <Text style={styles.recipient}>
                    {item?.type === 'sent' ? 'Получатель:' : 'Отправитель'} {item?.type === 'sent' ? item?.recipient : item?.sender}
                </Text>
                <Text style={styles.comission}>
                    Комиссия сети: {item?.fee}
                </Text>
            </View>
            <View style={styles.sumContainer}>
                <Text style={[styles.sum, { color: typeData?.color }]}>
                    {item.type === 'sent' ? '-' : '+'}{parseFloat(item?.amount.toString())}
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
        backgroundColor: Platform.OS === 'ios' ? '#E7E7E7' :  '#F4F4F4',
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
        fontSize: RFValue(15, 812), 
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
