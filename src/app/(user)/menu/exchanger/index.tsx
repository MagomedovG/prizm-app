import {Text, View, Pressable, StyleSheet, ScrollView, TextInput, Dimensions, StatusBar} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from 'expo-router';
import { useCustomTheme } from '@/src/providers/CustomThemeProvider';
import { useState } from 'react';
import TransactionItem from '@/src/components/TransactionItem';
import { useQuery } from '@tanstack/react-query';
import ExchangerItem from '@/src/components/ExchangerItem/ExcangerItem';
const { width, height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;
const deviceHeight = height + statusBarHeight
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ExchangerScreen (){
    
    const { theme } = useCustomTheme();
    const [count,setCount]=useState<number | null | string>(null)
    const [phoneNumber,setPhoneNumber]=useState<number | null | string>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null)
const banks = [{title:'СБЕР'},{title:'ТБАНК'},{title:'АЛЬФА'},{title:'ВТБ'}]
    const { data: transactions, isLoading: isTransactionsLoading, refetch: refetchTransactions } = useQuery({
        queryKey:['transactions'],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/wallet/get-transactions/?wallet=PRIZM-M6WK-ZBUJ-LKPR-8HWPR`);
                console.log('refresuserWallet',`${apiUrl}/api/v1/wallet/get-transactions/?wallet=PRIZM-M6WK-ZBUJ-LKPR-8HWPR}`)
                return await response.json();
        },
        enabled: !!true, 
    });

    function calculateMaxTransfer(balance) {
        let commission = balance * 0.005;
    
        if (commission < 0.05) {
            commission = 0.05;
        } else if (commission > 10) {
            commission = 10;
        }
    
        const maxTransferAmount = balance - commission;
        return maxTransferAmount > 0 ? maxTransferAmount : 0;
    }
    function getComission(balance) {
        let commission = balance * 0.005;
    
        if (commission < 0.05) {
            commission = 0.05;
        } else if (commission > 10) {
            commission = 10;
        }
    
        const maxTransferAmount = commission;
        return maxTransferAmount > 0 ? maxTransferAmount : 0;
    }

    const validateCount = (value: string) => {
        if (value.length > 9) return;
        const normalizedValue = value.replace(',', '.');
        const parsedValue = parseFloat(normalizedValue);
        
        if (balance === 0) {
            setErrorMessage(`недостаточно средств на балансе: ${calculateMaxTransfer(balance)} pzm`)
        } else if( isNaN(parsedValue) || parsedValue < 0.01 || parsedValue > 10000000){
            setErrorMessage('сумма должна быть в пределах от 0.01 до 10 000 000');
        } else {
            setErrorMessage(null);
        }
        setCount(normalizedValue);  
    };

    return (
        <>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.container, {marginTop: statusBarHeight + 58}]}>
                    <Stack.Screen options={{ title: 'CreateWallet', headerShown: false }} />
                    <View style={{paddingHorizontal: 26, width: '100%'}}>
                        <Text style={styles.title}>
                            Продать pzm
                        </Text>
                        <View style={{
                            width:'100%',display: 'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            marginBottom:35
                        }}>
                            <View style={{
                                display: 'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                backgroundColor:'#F6F6F6',
                                paddingVertical:6,
                                paddingHorizontal:40,
                                borderRadius:5
                            }}>
                                <Text style={{fontSize:12, color:'#989898', marginBottom:3}}>ваш баланс</Text>
                                <Text style={{fontWeight:'bold',fontSize:20, lineHeight:20}}>17350 <Text style={{fontSize:16}}>PZM</Text></Text>
                                <Text style={{fontWeight:'bold',fontSize:20,lineHeight:20}}>100 000 <Text style={{fontSize:18}}>₽</Text></Text>
                            </View>
                        </View>
                        <View style={[styles.pressable]}>
                            <Text style={styles.label}>Вы отправляете</Text>
                            <TextInput
                                style={[styles.input,{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'},  errorMessage || Number(count) > calculateMaxTransfer(balance) ? styles.inputError : null, balance === 0 || Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}
                                editable={true}
                                onChangeText={validateCount}
                                placeholder={'0'}
                                value={count}
                                keyboardType={"numeric"}
                                placeholderTextColor='#8C8C8C'
                                type={'number'}
                                
                            />
                            <Pressable style={styles.scanIconContainer}>
                                <Text style={{color:'#878787'}}>PZM</Text>
                            </Pressable>
                        </View>
                        {errorMessage && <Text style={[styles.errorText, {color:'#C85557'}]}>{errorMessage}</Text>}
                        {!errorMessage && !count && <Text style={styles.errorText}>коммисия сети 0,5% (не менее 0,05 и не более 10 pzm)</Text>}
                        {!errorMessage && count && <Text style={[styles.errorText, Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}>{Number(count) > calculateMaxTransfer(balance)  ? `максимальная сумма с учетом комиссии: ${calculateMaxTransfer(balance).toFixed(3)} pzm` : `коммисия сети ${parseFloat(getComission(count).toFixed(3))} pzm`}</Text>}
                        <Text style={styles.label}>Выберите банк для получения рублей</Text>
                        {
                            banks && 
                            <View style={{paddingVertical:14,width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                {banks.map(bank => (
                                    <View style={{height:34,padding:4, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                        <Text style={{}}>
                                            {bank.title}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            
                        }
                        <Text style={styles.label}>Номер телефона с привязанной картой</Text>
                        <View style={[styles.pressable]}>
                            <TextInput
                                style={[styles.input,{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'},  errorMessage || Number(count) > calculateMaxTransfer(balance) ? styles.inputError : null, balance === 0 || Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}
                                editable={true}
                                onChangeText={validateCount}
                                placeholder={'Введите номер телефона'}
                                value={count}
                                keyboardType={"numeric"}
                                placeholderTextColor='#8C8C8C'
                                type={'number'}
                            />
                        </View>
                        <View style={styles.payButtonTextContainer}>
                            <View style={[styles.payContainer, {width:'61%'}]} >
                                <Text style={{fontSize:18}}>
                                    Вы получите <Text style={{fontWeight:'bold'}}>{`${count ? `${count}` : '0'}`} </Text><Text style={{fontSize:14,fontWeight:'bold'}}>₽</Text>
                                </Text>
                            </View>
                            <Pressable style={[styles.payContainer, {width:'36%', backgroundColor:'#41146D'}]} disabled={!!errorMessage || !count  || !phoneNumber || isLoading || Number(count) > calculateMaxTransfer(balance)} >
                                <Text style={{color:'white', fontSize:18}}>
                                    Продать
                                </Text>
                            </Pressable>
                        </View>
                        <Text style={{textAlign:'center', marginTop:7, color:'#B4B4B4', fontSize:12}}>
                            после нажатия на кнопку Продать, с вашего кошелька
                        </Text>
                        <Text style={{textAlign:'center', color:'#B4B4B4', fontSize:12, lineHeight:13}}>
                                автоматически спишется указанная вами сумма PZM 
                            </Text>
                        <Text style={styles.transactionsTitle}>
                            История продаж
                        </Text>
                        {
                            <View style={{marginBottom:50}}>
                                {transactions && transactions.map((item, index)=>( 
                                    <View style={{marginBottom:9}} key={index}>
                                        <ExchangerItem item={item}/>
                                    </View>
                                ))}
                            </View>
                        }
                        
                    </View>
                </View>
            </ScrollView>
        </>
    );
};


const styles = StyleSheet.create({
    bankContainer:{

    },
    payTextContainer:{

    },
    payContainer:{
        height:45,
        backgroundColor:'#F6F6F6',
        borderRadius:8,
        display: 'flex',
        alignItems:'center',
        justifyContent:'center',
        // paddingHorizontal:25,
        // paddingVertical:10
    },
    payButtonTextContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop: 31
    },
    transactionsTitle:{
        fontSize:20,
        marginTop:23,
        marginBottom:9,
        // fontWeight:'bold',
    },
    pressable: {
        position: 'relative',
    },
    copyButtonContainer: {
        position: 'absolute',
        right: 15,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label:{
        color:'#5D5D5D',
        fontSize:14,
        marginLeft:9,
        marginBottom:2
    },
    createWallet:{
        marginHorizontal:42,
        alignItems: 'center',
        marginVertical: 15,
        position:'absolute',
        bottom:95
    },
    input: {
        // borderWidth: 1,
        // paddingVertical: 6,
        height:45,
        paddingHorizontal: 13,
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        fontSize:18,
        color: '#000000',
    },
    inputContainer: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#957ABC'
    },
    container: {
        flex: 1,
        marginTop:88,
        alignItems: 'center',
        position:'relative'
    },
    title: {
        color: '#070907',
        marginBottom: 36,
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    errorText: {
        marginLeft:8,
        marginBottom:25,
        fontWeight: 'bold',
        fontSize: 12.5,
    },
    inputError: {
        borderColor: '#C85557',
    },
    convertToRubContainer: {
        position: 'absolute',
        right: 0,
        top: 1,
        bottom: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#D9D9D9',
        paddingHorizontal: 10, // Дополнительный отступ для текста
    },
    convertToRubText: {
        fontSize: 16,
        color: '#808080',
    },
    checkboxText: {
        fontSize: 14,
        lineHeight: 18, // Немного больше для центрирования относительно чекбокса
        // marginLeft: 6,  // Расстояние от чекбокса до текста
        textAlignVertical: 'center', // Для текстового центрирования
    },
    scanIconContainer: {
        position: 'absolute',
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        right:0,
        paddingRight: 10,
        paddingLeft: 10,
        width:50,
        height:45,
        bottom: -12,
        transform: [{ translateY: -12 }], 
    },
});
