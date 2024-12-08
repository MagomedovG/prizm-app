import { Link } from "expo-router";
import { View, Text, Platform, Image, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function TaxiItem({item}:any){

    return (
        <View style={{marginHorizontal:23}}>
            <View style={Platform.OS === 'ios' ? styles.itemIosContainer : styles.itemAndroidContainer}>
                <View style={[styles.container,{width:'40%'}]}>
                    <View style={styles.logo}>

                    </View>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.sumContainer}>
                        <Text style={[styles.sum, {fontWeight: 'bold'}]}>
                            {parseFloat(item?.cashbackSize.toFixed(2).toString())}%
                        </Text>
                    </View>
                    <Link href={`tel:${item.telNumber}`} style={styles.sumContainer}>
                        <Text style={styles.sum}>
                            Позвонить
                        </Text>
                    </Link>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        gap:8
    },
    itemIosContainer:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding:14,
        borderRadius:9,
        marginTop:4.5,
        marginBottom:4.5,
        borderWidth:1,
        // borderColor:'rgba(0,0,0,0.2)',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4
    },
    itemAndroidContainer: {
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding:14,
        borderRadius:9,
        marginTop:4.5,
        marginBottom:4.5,
        shadowColor: 'rgba(0,0,0,0.7)',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 3,
    },
    logo:{
        width:32,
        aspectRatio: 1, 
        borderRadius:50,
        backgroundColor:'#f5f5f5'
    },
    title:{
        fontSize: RFValue(15, 812),
        lineHeight: RFValue(17, 812),
    },
    sumContainer: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
    },
    sum: {
        fontSize: RFValue(15, 812),
        lineHeight: RFValue(19, 812),
        color:'#41146D'
    },

})