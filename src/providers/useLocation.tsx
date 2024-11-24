// import React, { createContext, useContext, useState, useEffect } from 'react';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// // Создаем контекст
// const LocationContext = createContext(null);

// // Провайдер контекста
// export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
//   const [currentAddress, setCurrentAddress] = useState<string>('не указано местоположение');
//   const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(false);
//   const [latitude, setLatitude] = useState<string>('');
//   const [longitude, setLongitude] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     checkIfLocationEnabled();
//     getCurrentLocation();
//   }, []);

//   const checkIfLocationEnabled = async () => {
//     try {
//       const enabled = await Location.hasServicesEnabledAsync();
//       setLocationServicesEnabled(enabled);
//     } catch (err) {
//       setError('Ошибка проверки доступности геолокации.');
//       console.error(err);
//     }
//   };

//   const getServerLocation = async (lat: number, lon: number) => {
//     try {
//       const localFullName = await AsyncStorage.getItem('locality-full-name')
//       const localLocationId = await AsyncStorage.getItem('locality-id')
//       const localLocationType = await AsyncStorage.getItem('locality-type')
//       const response = await fetch(`${apiUrl}/api/v1/localities/get-locality-by-coordinates/?latlon=${lat},${lon}`);
//       const data = await response.json();
//       if (response.ok ) {
//         if (data?.full_name !== localFullName || data?.id !== localLocationId || data?.type !== localLocationType){
//           await AsyncStorage.setItem('locality-full-name', data.full_name);
//           await AsyncStorage.setItem('locality-type', data.type);
//           await AsyncStorage.setItem('locality-id', data.id.toString());
//         }
        
//       }
//     } catch (err) {
//       console.error('Ошибка получения локации с сервера:', err);
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') return;

//       const { coords } = await Location.getCurrentPositionAsync();
//       if (coords) {
//         const { latitude, longitude } = coords;
//         setLatitude(latitude.toString());
//         setLongitude(longitude.toString());
//         getServerLocation(latitude, longitude);
//       }
//     } catch (err) {
//       setError('Ошибка получения текущей геолокации.');
//       console.error(err);
//     }
//   };

//   return (
//     <LocationContext.Provider
//       value={{
//         currentAddress,
//         locationServicesEnabled,
//         latitude,
//         longitude,
//         error,
//       }}
//     >
//       {children}
//     </LocationContext.Provider>
//   );
// };

// // Хук для доступа к данным локации
// export const useLocationContext = () => {
//   return useContext(LocationContext);
// };
