import { useState, useEffect } from 'react';
import { Text, View, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function App() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginTop: 20 }}>HomeScreen</Text>
    </View>
  );
}

