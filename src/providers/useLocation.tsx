import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const useLocation = () => {
  const [currentAddress, setCurrentAddress] = useState<string>('не указано местоположение');
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude]=useState('')
  const [longtitude, setLongtitude]=useState('')
  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);

  // Проверка, включены ли сервисы геолокации
  const checkIfLocationEnabled = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
    
      setLocationServicesEnabled(enabled);
    } catch (err) {
      setError('Error checking location services.');
      console.error(err);
    }
  };
  const getServerLocation = async (lat, lon) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/localities/get-locality-by-coordinates/?latlon=${lat},${lon}`)
      const data = await response.json()
      console.log(data);
      if (response.ok){
        setCurrentAddress(data.full_name)
        AsyncStorage.setItem('locality-type',data.type)
        AsyncStorage.setItem('locality-id',data.id.toString())
      }
    } catch (e) {
      console.log('Ошибка получения локации по координатам',lat,lon,' На ручку',`${apiUrl}/api/v1/localities/get-locality-by-coordinates/?latlon=${lat},${lon}`)
    }
  }
  // Получение текущей локации и адреса
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        
        return;
      }
      //api/v1/localities/get-locality-by-coordinates/?latlon=
      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;
          getServerLocation(latitude, longitude)
        console.log('latitude, longitude',latitude, longitude)
        setLatitude(latitude.toString());
        setLongtitude(longitude.toString());
        
      }
    } catch (err) {
      setError('Error fetching location.');
      console.error(err);
    }
  };

  return {
    currentAddress,
    locationServicesEnabled,
    longtitude, 
    latitude,
    error,
  };
};

export default useLocation;
