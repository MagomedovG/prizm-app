import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ScrollView, View,Text, FlatList, Pressable,StyleSheet, Dimensions } from "react-native";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width - 25;
import {Image} from 'expo-image'


export default function PartnersScreen() {
    const { data: business, isLoading: isBusinessLoading } = useQuery({
        queryKey: ['business'],
        queryFn: async () => {
            const response = await fetch(
                `${apiUrl}/api/v1/business/2/`,
            );
            const data = await response.json();
            const business = data.business;
            return business;
        },
    });
    return (
        <View style={styles.container}>
            <View>
                <Text>
                    уа ыуларыушгарыуша
                    щжшоаыужщоаыужщаоыэ
                    ыушщзэоаэыоа
                    ыошщыоуа
                    ыаоы
                    щаоыузшаоыущо
                    щаоышуоаыу

                    ыощуаыоуашыуа
                    ышроащшыоаэышоуаэы
                </Text>
            </View>
            <Text style={styles.subTitle}>Контакты:</Text>
            {business?.contacts.length && business?.contacts.length >= 1 ?
                <>
                    <FlatList
                        data={business?.contacts}
                        columnWrapperStyle={business?.contacts.length > 1 ? styles.row : undefined} 
                        contentContainerStyle={styles.listContainer} 
                        renderItem={({item}) => (
                            <Link href={item.contact_type.contact_value_type === 'phone_number' ? `tel:${item.value}` : item.value} style={[styles.contactContainer,{backgroundColor:`#${item.contact_type.background_color}`}]} asChild>
                                <Pressable>
                                    <View style={[{display: 'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',margin:0, padding:0},business?.contacts.length > 2 ? {gap:7} : {gap:10}]}>
                                        <Image
                                            style={{width:business?.contacts?.length > 2 ? 23 : 27, height:business?.contacts && business?.contacts?.length > 2 ? 23 : 27, borderRadius:50}}
                                            source={{uri: `${apiUrl}/${item.contact_type.logo}`}}
                                            cachePolicy={'memory-disk'}
                                        />
                                        <Text style={[styles.contactText,{color:`#${item.contact_type.text_color}`}, business?.contacts && business?.contacts?.length > 2  ? {fontSize: 13.5} : {fontSize: 16}]}>
                                            {item.contact_type.name}
                                        </Text>
                                    </View>
                                    
                                </Pressable>
                                </Link>
                            
                        )}
                        numColumns={business?.contacts.length > 2 ? 3 : business?.contacts.length} 
                        keyExtractor={(item) => item.value}
                        showsHorizontalScrollIndicator={false}
                    />
                </>
                : <Text style={{fontWeight:600, fontSize:17, color:'rgba(0, 0, 0, 0.6)'}}>Нет контактов</Text>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: ITEM_WIDTH,
        paddingHorizontal: 10,
        position: 'relative',
        marginBottom: 50,
        alignSelf: 'center',
        marginTop:height / 8
    },
    row: {
        justifyContent: 'space-between', 
        gap:5,
      },
    listContainer: {
        gap: 7,
      },
      contactContainer: {
        flex: 1, 
        padding: 10,
        borderRadius: 8,
      },
      contactText: {
        textAlign: 'center',
        fontWeight: 600,
        
      },
    subTitle: {
        marginTop: 30,
        marginBottom: 9,
        color: '#323232',
        fontSize: 20,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartSubtitle: {
        color: 'white',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    cartLogo: {
        width: 85,
        height: 85,
        borderRadius: 100,
        objectFit: 'cover'
    },
    cart: {
        backgroundColor: '#535353',
        paddingHorizontal: 16,
        paddingVertical: 25,
        borderRadius: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32
    },
    saleContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
    },
    sale: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 9,
        textAlign: 'center',
        borderRadius: 10,
        marginBottom: 5,
        // alignSelf: 'flex-start',
        borderWidth: 0.5,
    },
    saleText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },
    
});
