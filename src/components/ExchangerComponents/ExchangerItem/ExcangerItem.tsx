import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
type TransactionType = "received" | "para" | "sent";
type ExchangerItem = {
    item:{
        created_at:string,
        transaction_fee_amount:number,
        prizm_amount:number,
        prizm_exchange_rate:number,
        sum_to_send:number,
        is_processed: boolean, 
    }
}
export default function ExchangerItem({item}:ExchangerItem) {
    function formatDate(inputDate:string) {
        const date = new Date(inputDate);
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
      
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
      
        return `${day}.${month}.${year} ${hours}:${minutes}`;
      }
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title]}>
                        <Text style={{fontWeight:'bold'}}>{item?.prizm_amount} pzm</Text>
                        <Text style={styles.dateTime}>
                            {'   ' + formatDate(item?.created_at)}
                        </Text>
                    </Text>
                </View>
                {/* <Text style={styles.recipient}>
                    {item.type === 'sent' ? 'Получатель:' : 'Отправитель'} {item.type === 'sent' ? item.recipient : item.sender}
                </Text> */}
                <Text style={styles.comission}>
                    Комиссия сети: {item?.transaction_fee_amount} <Text style={styles.comissionValute}>PZM</Text>  курс PZM: {parseFloat(item?.prizm_exchange_rate.toFixed(5).toString())} <Text style={styles.comissionValute}>₽</Text>
                </Text>
            </View>
            <View style={styles.sumDotContainer}>
                <View
                    style={[
                        styles.circle,
                        { backgroundColor: !item.is_processed ? '#769AEE' : '#2C9E6E' } // Зеленый, если true, красный если false
                    ]}
                />
                <View style={styles.sumContainer}>
                    <Text style={styles.sum}>
                        {parseFloat(item?.sum_to_send.toFixed(5).toString())} <Text style={{fontSize: RFValue(12, 812),}}>₽</Text>
                    </Text>
                </View>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 9,
        backgroundColor: '#F4F4F4',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height:47
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 2,
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
    comissionValute: {
        fontSize: RFValue(8, 812),
        color: '#B5B5B5',
        lineHeight: RFValue(10, 812),
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
        color:'#2C9E6E'
    },
    circle: {
        width: 7,
        height: 7,
        borderRadius: 4, // Полностью круглый элемент
        marginRight: 8, // Отступ на 10px от текста sum
    },
    sumDotContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    }
});
