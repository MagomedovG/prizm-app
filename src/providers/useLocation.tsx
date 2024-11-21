import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';

const useLocation = () => {
  const [currentAddress, setCurrentAddress] = useState<string>('Нет данных о местоположении');
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
    //   if (!enabled) {
    //     Alert.alert('Location not enabled', 'Please enable your Location', [
    //       { text: 'Cancel', style: 'cancel' },
    //       { text: 'OK', onPress: () => console.log('OK Pressed') },
    //     ]);
    //   }
      setLocationServicesEnabled(enabled);
    } catch (err) {
      setError('Error checking location services.');
      console.error(err);
    }
  };

  // Получение текущей локации и адреса
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow the app to use the location services', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        setError('Location permission denied.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;
        console.log('latitude, longitude',latitude, longitude)
        setLatitude(latitude.toString());
        setLongtitude(longitude.toString());
        if (typeof latitude === 'number' && typeof longitude === 'number') {
          const response = await Location.reverseGeocodeAsync({ latitude, longitude });
          for (const item of response) {
            if (item.name && item.city && item.postalCode) {
              const address = `${item.name}, ${item.city}`;
              
              setCurrentAddress(address);
              return;
            }
          }
          setCurrentAddress('Unable to retrieve full address.');
        } else {
          setError('Invalid coordinates received.');
        }
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
