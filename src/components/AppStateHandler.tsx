import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useRouter } from 'expo-router'; 

const AppStateHandler = () => {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
    const lastActiveTimeRef = useRef<Date | null>(new Date());
    const router = useRouter();
    const INACTIVITY_THRESHOLD = 120 * 1000; // полчаса в миллисекундах

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState === 'active' && nextAppState.match(/inactive|background/)) {
                lastActiveTimeRef.current = new Date();
            } else if (
                nextAppState === 'active' &&
                lastActiveTimeRef.current &&
                new Date().getTime() - lastActiveTimeRef.current.getTime() > INACTIVITY_THRESHOLD
            ) {
                router.replace('/pin/setpinscreen'); 
            }
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [appState, router]);

    return null;
};

export default AppStateHandler;
