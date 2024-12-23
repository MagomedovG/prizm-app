import { useCustomTheme } from "@/src/providers/CustomThemeProvider";
import { IWallet } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { memo, useEffect, useState } from "react";
import { Alert, Pressable, View, Text, TextInput, Platform, StyleSheet, StatusBar } from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import {Image} from 'expo-image'
import { useQuery } from "@tanstack/react-query";
const statusBarHeight = StatusBar.currentHeight || 0;

type BankItem = {
    // item:{
        name:string,
        logo:string,
        id:number
    // }
}


export default function ExchangerHeaderComponent () {
    const [counter, setCounter] = useState(10);
    const { theme } = useCustomTheme();
    const [count,setCount]=useState<number | null>(null)
    const [phoneNumber,setPhoneNumber]=useState<number | string>('+7')
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const banks = [{title:'СБЕР'},{title:'ТБАНК'},{title:'АЛЬФА'},{title:'ВТБ'}]
    const [exchangeRates, setExchangeRates] = useState<number | null>(null);
    const [error, setError] = useState(null);
    const [exchargerFee, setExchargerFee] = useState<number | null>(null)
    const [activeBank, setActiveBank] = useState<number | null>(null)
    const router = useRouter();
    const [walletInfo,setWalletInfo] = useState<IWallet | null>(null)
    const [balance, setBalance] = useState<number | null>(null)
    const [prizmWallet, setPrizmWallet] = useState('');
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [hasMore, setHasMore] = useState(true); // Флаг для проверки, есть ли еще данные
    const [nextLink, setNextLink] = useState('')

        
        
    const fetchWalletData = async () =>{
        try {
            const userId = await AsyncStorage.getItem('user_id')
            const response = await fetch(
                `${apiUrl}/api/v1/users/${userId}/wallet-data/`
            );
            const data = await response.json();
            setWalletInfo(data);
            setBalance(data?.balance_in_pzm);
            setPrizmWallet(data?.prizm_wallet)
            console.log(data.prizm_wallet)
            // console.log(data?.balance_in_pzm * 0.005, 'balance * 0.005')
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error,`${apiUrl}/api/v1/users/userId/wallet-data/`);
        }
    }
    // const fetchOrders = async (wallet?:string) => {
    //     if (loading || !hasMore) return;

    //     setLoading(true);
    //     try {
    //         const response = await fetch(
    //             nextLink || `${apiUrl}/api/v1/pzm-orders/?user-account-rs=${wallet}`
    //         );
    //         const data = await response.json();
    //         console.log(data.results.length)
    //         console.log(`${apiUrl}/api/v1/pzm-orders/?user-account-rs=${wallet}/`)
    //         if (data?.next){
    //             setNextLink(data.next)
    //         } else {
    //             setHasMore(false)
    //         }
    //         if (nextLink){
    //             console.log('nextLink',nextLink)
    //         }
    //         setOrders((prevOrders) => [...prevOrders, ...data.results]);
    //         // setPage((prevPage) => prevPage + limit);
    //         // setHasMore(data.results.length === limit); // Если данных меньше лимита, значит это последняя страница
    //     } catch (error) {
    //         console.error('Ошибка загрузки данных:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const getFee = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/v1/utils/settings/is-exchanger-available`)
            const data = await response.json()
            if (response.ok){
                setExchargerFee(data.exchanger_fee)
            } else {
                Alert.alert(data.detail,'',[{ text: "На главную" ,
                    onPress: () => {
                        router.replace('/(user)/menu')
                    }
                  }])
            }
        }  catch (error) {
            // console.log(error)
        }
    }
    const postOrder = async () => {
        try {
            const secret_phrase = await AsyncStorage.getItem("secret-phrase");
            // console.log(exchangeRates?.toFixed(7).toString())
            // const prizm_exchange_rate = exchangeRates ? parseFloat(exchangeRates?.toFixed(7).toString()) : 0
            const prizm_exchange_rate = exchangeRates 

            const form = {
                prizm_amount: count,
                seller_bank: activeBank,
                seller_phone_number:phoneNumber,
                secret_phrase,
                prizm_exchange_rate
            }
            const response = await fetch(
                `${apiUrl}/api/v1/pzm-orders/`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                }
            );
            const data = await response.json();
            if (!response.ok) {
                console.log(data)
                if (data.detail){
                    Alert.alert(data.detail,'',[{ text: "На главную" ,
                        onPress: () => {
                            router.replace('/(user)/menu')
                        }
                      }])
                }
                if (data.header || data.description){
                    Alert.alert(
                        data.header,
                        data.description,
                    );
                } else if (!data.detail){
                    const message = data.secret_phrase?.[0] ? 'Не заполнена парольная фраза' : 'Ошибка при создании ордера на продажу' 
                    Alert.alert(
                        message
                    );
                }
                
            } else {
                Alert.alert(
                    data.header,
                    data.description,
                  );
                  router.replace('/(user)/menu');
                  
            }
            console.log(form, data)
        } catch (error) {
            console.error("Ошибка при отправке ордера:", error);
        }
    }
    useEffect(() => {
        // const getWallet = async () => {
        //     const prizmWallet = await AsyncStorage.getItem('prizm_wallet')
        //     if(prizmWallet){
        //         fetchOrders(prizmWallet);
        //     } else {
        //         console.log('wallet не найден')
        //     }
            
        // }
        // getWallet()
        fetchWalletData()
        getFee()
        
    }, []);
   

    const { data: bankItems, isLoading: isBankItemsLoading, refetch: refresBankItems } = useQuery({
        queryKey:['bank-items'],
        queryFn: async () => {
                const response = await fetch(`${apiUrl}/api/v1/utils/banks/`);
                // console.log('refresuserWallet',`${apiUrl}/api/v1/utils/banks/`)
                return await response.json();
        },
    });

    function calculateMaxTransfer(balance:any) {
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
        // console.log(balance * 0.005, 'balance * 0.005')
        // return typeof balance
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
    const fetchData = async () => {
        try {
            const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=PZM");
            if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setExchangeRates(data.data.rates.RUB);
            // console.log(data.data.rates.RUB);
        } catch (err) {
            console.error(err.message);
        }
    };
    useEffect(()=>{
        fetchData(); // Первоначальный запрос
        
        
        const interval = setInterval(() => {
            setCounter((prevCounter) => {
                if (prevCounter === 1) {
                    fetchData(); 
                    return 10; 
                }
                return prevCounter - 1;
            });
        }, 1000);

        return () => clearInterval(interval); 
    },[])
    const BankImage = memo(({ source, isActive }: { source: string; isActive: boolean }) => (
        <Image
          style={[
            isActive ? { borderWidth: 1.2, borderColor: '#4BA2FF' } : {},
            styles.image,
          ]}
          contentFit="cover"
          source={{ uri: source }}
          cachePolicy="disk"
        />
      ));
    return (
        <>
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
                            <Text style={{fontWeight:'bold',fontSize:20, lineHeight:20}}>{walletInfo?.balance_in_pzm ? walletInfo?.balance_in_pzm : 0} <Text style={{fontSize:16}}>PZM</Text></Text>
                            <Text style={{fontWeight:'bold',fontSize:20,lineHeight:20}}>{walletInfo?.balance_in_pzm && exchangeRates ? parseFloat((walletInfo?.balance_in_pzm * exchangeRates).toFixed(5).toString()) : 0} <Text style={{fontSize:18}}>₽</Text></Text>
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
                    {!errorMessage && count && <Text style={[styles.errorText, Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}>{Number(count) > calculateMaxTransfer(balance)  ? `максимальная сумма с учетом комиссии: ${calculateMaxTransfer(balance).toFixed(3)} pzm` : `коммисия сети ${parseFloat(getComission(count)?.toFixed(3))} pzm`}</Text>}
                    <Text style={styles.label}>Выберите банк для получения рублей</Text>
                    {
                        bankItems && 
                        <View style={{marginVertical:14,width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                            {bankItems.map((bank:BankItem, index) => (
                                <Pressable key={index} onPress={()=>{setActiveBank(bank.id)}} style={[
                                    Platform.OS === 'ios' ? styles.itemIosContainer : styles.itemAndroidContainer,
                                    
                                ]}>
                                   <Image style={[bank.id === activeBank ? {borderWidth:1.2, borderColor: '#4BA2FF'} : {},{height:42, width:'100%', borderRadius:10}]} contentFit='cover' source={{uri:`${apiUrl}${bank.logo}`}} cachePolicy='disk'/>
                                </Pressable>
                            ))}
                        </View>

                        
                    }
                    <Text style={styles.label}>Номер телефона с привязанной картой</Text>
                    <View style={[styles.pressable]}>
                        <TextInput
                            style={[styles.input,{borderColor: theme === 'purple' ? '#957ABC' : '#4D7440'},  errorMessage || Number(count) > calculateMaxTransfer(balance) ? styles.inputError : null, balance === 0 || Number(count) > calculateMaxTransfer(balance) ? {color:'#C85557'} : {}]}
                            editable={true}
                            onChangeText={(text) => {
                                // Удаляем всё, что вне префикса, и добавляем 
                                const cleanedText = text.replace(/[^0-9]/g, ''); // Убираем нецифровые символы
                                if (!cleanedText.startsWith('7')) {
                                    setPhoneNumber(`+7${cleanedText.replace(/^7/, '')}`);
                                } else {
                                    setPhoneNumber(`+${cleanedText}`);
                                }
                            }}
                            placeholder={'Введите номер телефона'}
                            value={phoneNumber}
                            keyboardType={"numeric"}
                            placeholderTextColor='#8C8C8C'
                            type={'number'}
                            textContentType='telephoneNumber'
                        />
                    </View>
                    <View style={styles.payButtonTextContainer}>
                        <View style={[styles.payContainer, {width:'61%'}]} >
                            <Text style={{fontSize:18}}>
                                Вы получите <Text style={{fontWeight:'bold'}}>{`${count && exchangeRates && count > 0 ? `${parseFloat(((count - getComission(count)) * exchangeRates).toFixed(5).toString())}` : '0'}`} </Text><Text style={{fontSize:14,fontWeight:'bold'}}>₽</Text>
                            </Text>
                        </View>
                        <Pressable style={[styles.payContainer, theme === 'purple' ? styles.purpleBackground : styles.greenBackground,{width:'36%'}]} disabled={!!errorMessage || !activeBank || !count  || !phoneNumber || Number(count) > calculateMaxTransfer(balance)} onPress={postOrder}>
                            <Text style={{color:'white', fontSize:18}}>
                                Продать
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={{marginLeft:10, fontSize:13, marginTop:3, fontWeight:500, color:'#5D5D5D'}}>
                        Комиссия обменника {exchargerFee}%
                    </Text>
                    <Text style={{marginLeft:10, fontSize:13, color:'#5D5D5D'}}>
                        до следующего обновления {counter} сек
                    </Text>
                    <View style={{marginLeft:10,display:'flex', width:'100%',flexDirection:'row', justifyContent:'center'}}>
                        <View>
                            <Text style={{textAlign:'center', marginTop:4, color:'#B4B4B4', fontSize:12}}>
                                после нажатия на кнопку Продать, с вашего кошелька автоматически спишется указанная вами сумма PZM 
                            </Text>
                        </View>
                    </View>
                    
                    
                    <Text style={styles.transactionsTitle}>
                        История продаж
                    </Text>
        </>
    )
  }
  const styles = StyleSheet.create({
    bankContainer:{

    },
    payTextContainer:{

    },
    itemIosContainer:{
        width:'23%',
        // height:34,
        padding:4, 
        display:'flex', 
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center',
        marginTop:5,
        marginBottom:5,
        borderColor:'rgba(0,0,0,0.2)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    itemAndroidContainer: {
        width:'21%',
        borderRadius:10,
        backgroundColor:'#fff',
        marginTop:5,
        marginBottom:5,
        marginHorizontal:5,
        shadowColor: 'rgba(0,0,0,0.7)',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
    },
    // image:{
    //     height:34
    // },
    payContainer:{
        height:45,
        backgroundColor:'#F6F6F6',
        borderRadius:8,
        display: 'flex',
        alignItems:'center',
        justifyContent:'center',
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
        // marginTop:88,
        alignItems: 'center',
        position:'relative'
    },
    title: {
        color: '#070907',
        marginBottom: 36,
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop:statusBarHeight + 58,
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
        paddingHorizontal: 10, 
    },
    convertToRubText: {
        fontSize: 16,
        color: '#808080',
    },
    checkboxText: {
        fontSize: 14,
        lineHeight: 18, 
        textAlignVertical: 'center', 
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
    loader: {
        marginVertical: 20,
    },
      purpleBackground:{
        backgroundColor:'#41146D'
    },
    greenBackground:{
        backgroundColor:"#32933C"
    },
});