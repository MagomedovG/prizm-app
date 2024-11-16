import { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Location Loading...');
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);

  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  // Проверка, включены ли сервисы геолокации
  const checkIfLocationEnabled = async () => {
    try {
      let enabled = await Location.hasServicesEnabledAsync();
      console.log("Location services enabled:", enabled);

      if (!enabled) {
        Alert.alert('Location not enabled', 'Please enable your Location', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      } else {
        setLocationServicesEnabled(enabled);
      }
    } catch (error) {
      console.error("Error checking location services:", error.message);
    }
  };

  // Получение текущей локации
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Permission status:", status);

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow the app to use the location services', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        return;
      }

      // Получение координат
      const { coords } = await Location.getCurrentPositionAsync();
      console.log("Coords received from getCurrentPositionAsync:", coords);

      if (coords) {
        let { latitude, longitude } = coords;

        console.log("Raw Latitude and Longitude:", latitude, longitude);

        // Проверяем, что latitude и longitude — это числа
        if (
          typeof latitude !== "number" ||
          typeof longitude !== "number" ||
          isNaN(latitude) ||
          isNaN(longitude)
        ) {
          console.error("Invalid coordinates:", latitude, longitude);
          setDisplayCurrentAddress("Unable to fetch valid coordinates.");
          return;
        }

        console.log("Valid coordinates:", latitude, longitude);

        // Обратное геокодирование
        try {
          console.log("Calling reverseGeocodeAsync with:", { latitude, longitude });
          let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          console.log("Response from reverseGeocodeAsync:", response);

          for (let item of response) {
            console.log("Processing response item:", item);

            if (item.name && item.city && item.postalCode) {
              let address = `${item.name}, ${item.city}, ${item.postalCode}`;
              setDisplayCurrentAddress(address);
              return;
            }
          }

          // Если не удалось получить полный адрес
          setDisplayCurrentAddress("Unable to retrieve full address.");
        } catch (error) {
          console.error("Error in reverseGeocodeAsync:", error.message);
          setDisplayCurrentAddress("Error retrieving address.");
        }
      }
    } catch (error) {
      console.error("Error fetching location:", error.message);
      setDisplayCurrentAddress("Error fetching location.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{displayCurrentAddress}</Text>
      <Text style={{ marginTop: 20 }}>HomeScreen</Text>
    </View>
  );
}
// import { StyleSheet, Text, Alert, View} from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import * as Location from 'expo-location'

// const HomeScreen = () => {
//   const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Location Loading.....');
//   const [locationServicesEnabled, setLocationServicesEnabled] = useState(false)
//   useEffect(()=>{
//    checkIfLocationEnabled();
//    getCurrentLocation();
//   },[])
//   //check if location is enable or not
//   const checkIfLocationEnabled= async ()=>{
//     let enabled = await Location.hasServicesEnabledAsync();       //returns true or false
//     if(!enabled){                     //if not enable 
//       Alert.alert('Location not enabled', 'Please enable your Location', [
//         {
//           text: 'Cancel',
//           onPress: () => console.log('Cancel Pressed'),
//           style: 'cancel',
//         },
//         {text: 'OK', onPress: () => console.log('OK Pressed')},
//       ]);
//     }else{
//       setLocationServicesEnabled(enabled)         //store true into state
//     }
//   }
//   //get current location
//   const getCurrentLocation= async ()=>{
//        let {status} = await Location.requestForegroundPermissionsAsync();  //used for the pop up box where we give permission to use location 
//       console.log(status);
//        if(status !== 'granted'){
//         Alert.alert('Permission denied', 'Allow the app to use the location services', [
//           {
//             text: 'Cancel',
//             onPress: () => console.log('Cancel Pressed'),
//             style: 'cancel',
//           },
//           {text: 'OK', onPress: () => console.log('OK Pressed')},
//         ]);
//        }

//          //get current position lat and long
//        const {coords} = await Location.getCurrentPositionAsync();  
//        console.log(coords)
       
//        if(coords){
//         const {latitude,longitude} =coords;
//         console.log(latitude,longitude);

//        //provide lat and long to get the the actual address
//         let responce = await Location.reverseGeocodeAsync({           
//           latitude,
//           longitude
//         });
//         console.log(responce);
//         //loop on the responce to get the actual result
//         for(let item of responce ){
//          let address = `${item.name} ${item.city} ${item.postalCode}`
//           setDisplayCurrentAddress(address)
//         }
//            }
//   }
  
//   return (
//     <SafeAreaView>
//       <View><Text>{displayCurrentAddress}</Text></View>
//       <Text>HomeScreen</Text>
//     </SafeAreaView>
//   )
// }

// export default HomeScreen

